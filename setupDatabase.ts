const { execSync } = require('child_process');
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
    await client.query('DROP ROLE IF EXISTS guest');
    await client.query('DROP ROLE IF EXISTS employee');
    await client.query('DROP ROLE IF EXISTS admin');
    await client.query('DROP ROLE IF EXISTS customer');

    console.log('--> Roles dropped successfully.');
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
      console.log('--> Dropping the DB');
      await client.query('DROP DATABASE IF EXISTS course_project_db');
      await client.query('CREATE DATABASE course_project_db');
      await console.log('--> Database dropped and recreated successfully.');
    } else {
      await client.query('CREATE DATABASE course_project_db');
      console.log('--> Database created successfully.');
    }
    execPrismaPush();
    execPrismaSeed();
  } catch (error) {
    console.error('Error creating database and roles:', error);
  } finally {
    client.release();
  }
}

function execPrismaPush() {
  console.log('--> Pushing Prisma Schema to the DB');
  execSync('npx prisma db push');
}

function execPrismaSeed() {
  console.log('--> Seeding the DB');
  execSync('npx prisma db seed');
}

async function createRoles() {
  console.log('--> Creating Roles');
  await pool.end();

  const newDbPool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'course_project_db',
    password: 'admin',
    port: 5432,
  });
  const client = await newDbPool.connect();

  try {
    // Revoke default priviliges
    await client.query('GRANT CREATE ON SCHEMA public TO PUBLIC');
    await client.query('GRANT ALL ON DATABASE course_project_db TO PUBLIC');

    // Create roles
    await client.query(
      "CREATE ROLE guest WITH LOGIN PASSWORD 'guest' NOSUPERUSER NOCREATEDB NOCREATEROLE INHERIT NOREPLICATION CONNECTION LIMIT -1",
    );

    await client.query(
      'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE users, users_id_seq TO guest',
    );
    await client.query('GRANT SELECT ON TABLE roles TO guest');

    await client.query(
      "CREATE ROLE employee WITH LOGIN PASSWORD 'employee' NOSUPERUSER CREATEDB NOCREATEROLE INHERIT NOREPLICATION CONNECTION LIMIT -1",
    );
    await client.query(
      "CREATE ROLE admin WITH LOGIN PASSWORD 'admin' SUPERUSER CREATEDB CREATEROLE INHERIT REPLICATION CONNECTION LIMIT -1",
    );
    await client.query(
      "CREATE ROLE customer WITH LOGIN PASSWORD 'customer' NOSUPERUSER CREATEDB NOCREATEROLE INHERIT NOREPLICATION CONNECTION LIMIT -1",
    );
    await client.query(
      'GRANT SELECT ON TABLE users, users_id_seq, fleet TO customer',
    );

    console.log('--> Roles created successfully');
  } catch (error) {
    console.error(error.message);
  } finally {
    client.release();
    client.end();
    await newDbPool.end();
    process.exit();
  }
}

async function setupDatabase() {
  await createDatabase();
  await dropRolesIfExists();
  await createRoles();
}

setupDatabase();
