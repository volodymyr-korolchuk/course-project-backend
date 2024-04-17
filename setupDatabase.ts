const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
  port: 5432,
});

async function dropRolesIfExists() {
  const client = await pool.connect();

  try {
    // Drop the roles if they exist
    await client.query('DROP ROLE IF EXISTS Guest');
    await client.query('DROP ROLE IF EXISTS Employee');
    await client.query('DROP ROLE IF EXISTS Admin');
    await client.query('DROP ROLE IF EXISTS Customer');

    console.log('Roles dropped successfully.');
  } catch (error) {
    console.error('Error dropping roles:', error);
  } finally {
    client.release();
  }
}

async function databaseExists() {
  const client = await pool.connect();

  try {
    // Check if the database exists
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'course_project_db'",
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking database existence:', error);
    return false;
  } finally {
    client.release();
  }
}

async function createDatabase() {
  const client = await pool.connect();

  try {
    const dbExists = await databaseExists();
    if (dbExists) {
      rl.question(
        'The database already exists. Do you want to drop it and recreate? (y/N): ',
        async (answer) => {
          if (answer.toLowerCase() === 'y') {
            await client.query('DROP DATABASE IF EXISTS course_project_db');
            await client.query('CREATE DATABASE course_project_db');
            await createRoles(client);
            console.log('Database dropped and recreated successfully.');
          } else {
            console.log('Aborting creation.');
          }
          rl.close();
        },
      );
    } else {
      // Database creation
      await client.query('CREATE DATABASE course_project_db');
      await createRoles(client);
      console.log('Database created successfully.');
    }
  } catch (error) {
    console.error('Error creating database and roles:', error);
  } finally {
    client.release();
  }
}

async function createRoles(client) {
  // Roles creation
  await client.query(
    "CREATE ROLE Guest WITH LOGIN PASSWORD 'guest' NOSUPERUSER NOCREATEDB NOCREATEROLE INHERIT NOREPLICATION CONNECTION LIMIT -1",
  );
  await client.query(
    "CREATE ROLE Employee WITH LOGIN PASSWORD 'employee' NOSUPERUSER CREATEDB NOCREATEROLE INHERIT NOREPLICATION CONNECTION LIMIT -1",
  );
  await client.query(
    "CREATE ROLE Admin WITH LOGIN PASSWORD 'admin' SUPERUSER CREATEDB CREATEROLE INHERIT REPLICATION CONNECTION LIMIT -1",
  );
  await client.query(
    "CREATE ROLE Customer WITH LOGIN PASSWORD 'customer' NOSUPERUSER CREATEDB NOCREATEROLE INHERIT NOREPLICATION CONNECTION LIMIT -1",
  );
  console.log('Roles created successfully.');
}

async function setupDatabase() {
  await dropRolesIfExists();
  await createDatabase();
}

setupDatabase();
