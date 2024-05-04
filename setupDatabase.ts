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

  const newDbPool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'course_project_db',
    password: 'admin',
    port: 5432,
  });
  const client = await newDbPool.connect();

  try {
    await client.query('GRANT CREATE ON SCHEMA public TO PUBLIC');
    await client.query('GRANT ALL ON DATABASE course_project_db TO PUBLIC');

    // Create roles
    await client.query(
      "CREATE ROLE guest WITH LOGIN PASSWORD 'guest' NOSUPERUSER NOCREATEDB NOCREATEROLE INHERIT NOREPLICATION CONNECTION LIMIT -1",
    );

    await client.query(
      "CREATE ROLE employee WITH LOGIN PASSWORD 'employee' NOSUPERUSER CREATEDB NOCREATEROLE INHERIT NOREPLICATION CONNECTION LIMIT -1",
    );
    await client.query(
      "CREATE ROLE admin WITH LOGIN PASSWORD 'admin' SUPERUSER CREATEDB CREATEROLE INHERIT REPLICATION CONNECTION LIMIT -1",
    );
    await client.query(
      "CREATE ROLE customer WITH LOGIN PASSWORD 'customer' NOSUPERUSER CREATEDB NOCREATEROLE INHERIT NOREPLICATION CONNECTION LIMIT -1",
    );

    // modify these
    await client.query('GRANT SELECT ON TABLE roles TO guest');
    await client.query(
      'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE customers, staff, users, users_id_seq, customers_id_seq, staff_id_seq TO guest',
    );
    await client.query(
      'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE customers, staff, users, leasings, invoices, payments, users_id_seq, customers_id_seq, staff_id_seq, leasings_id_seq, invoices_id_seq, payments_id_seq TO customer',
    );

    await client.query(
      'GRANT SELECT ON TABLE users, users_id_seq, fleet, fleet_id_seq, vehicle_classes, vehicle_classes_id_seq, parking_locations TO customer',
    );

    await client.query(
      'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE fleet, customers, vehicle_classes, staff, users, leasings, invoices, payments, parking_locations, users_id_seq, customers_id_seq, staff_id_seq, leasings_id_seq, vehicle_classes_id_seq, fleet_id_seq, invoices_id_seq, payments_id_seq, parking_locations_id_seq, monthly_analytics, monthly_analytics_id_seq TO employee',
    );

    await client.query('GRANT pg_write_server_files TO employee');
    await client.query('GRANT pg_write_server_files TO admin');

    console.log('--> Roles created successfully');
  } catch (error) {
    console.error(error.message);
  } finally {
    client.release();
    client.end();
  }
}

async function createFunctions() {
  console.log('--> Creating Functions and Triggers');

  const newDbPool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'course_project_db',
    password: 'admin',
    port: 5432,
  });
  const client = await newDbPool.connect();

  try {
    await client.query(`
    CREATE OR REPLACE FUNCTION getTomorrowsPickups()
    RETURNS TABLE (
        id INT,
        vehicleId INT,
        createdByEmployeeId INT,
        customerId INT,
        pickupDate TIMESTAMP,
        returnDate TIMESTAMP,
        allowedMileage INT
    )
    AS $$
    BEGIN
        RETURN QUERY
        SELECT
            l.id,
            l.vehicle_id,
            l.created_by_employee_id,
            l.customer_id,
            l.pickup_date,
            l.return_date,
            l.allowed_mileage
        FROM
            leasings l
        WHERE
            DATE(l.pickup_date) = CURRENT_DATE + INTERVAL '1 day';
    END;
    $$ LANGUAGE plpgsql;
  `);

    await client.query(`
    CREATE OR REPLACE FUNCTION getTodaysPickups()
    RETURNS TABLE (
        id INT,
        vehicleId INT,
        createdByEmployeeId INT,
        customerId INT,
        pickupDate TIMESTAMP,
        returnDate TIMESTAMP,
        allowedMileage INT
    )
    AS $$
    BEGIN
        RETURN QUERY
        SELECT
            l.id,
            l.vehicle_id,
            l.created_by_employee_id,
            l.customer_id,
            l.pickup_date,
            l.return_date,
            l.allowed_mileage
        FROM
            leasings l
        WHERE
            DATE(l.pickup_date) = CURRENT_DATE;
    END;
    $$ LANGUAGE plpgsql;
  `);

    await client.query(`
    CREATE OR REPLACE FUNCTION getTodaysReturns()
    RETURNS TABLE (
        id INT,
        vehicleId INT,
        createdByEmployeeId INT,
        customerId INT,
        pickupDate TIMESTAMP,
        returnDate TIMESTAMP,
        allowedMileage INT
    )
    AS $$
    BEGIN
        RETURN QUERY
        SELECT
            l.id,
            l.vehicle_id,
            l.created_by_employee_id,
            l.customer_id,
            l.pickup_date,
            l.return_date,
            l.allowed_mileage
        FROM
            leasings l
        WHERE
            DATE(l.return_date) = CURRENT_DATE;
    END;
    $$ LANGUAGE plpgsql;    
  `);

    await client.query(`
      CREATE OR REPLACE FUNCTION getTomorrowsReturns()
      RETURNS TABLE (
          id INT,
          vehicleId INT,
          createdByEmployeeId INT,
          customerId INT,
          pickupDate TIMESTAMP,
          returnDate TIMESTAMP,
          allowedMileage INT
      )
      AS $$
      BEGIN
          RETURN QUERY
          SELECT
              l.id,
              l.vehicle_id,
              l.created_by_employee_id,
              l.customer_id,
              l.pickup_date,
              l.return_date,
              l.allowed_mileage
          FROM
              leasings l
          WHERE
              DATE(l.return_date) = CURRENT_DATE + INTERVAL '1 day';
      END;
      $$ LANGUAGE plpgsql;    
    `);

    await client.query(`
      CREATE OR REPLACE PROCEDURE add_car(
        make_param VARCHAR(64),
        model_param VARCHAR(64),
        production_year_param INT,
        color_param VARCHAR(32),
        class_id_param INT,
        mileage_param INT,
        vrm_param VARCHAR(8),
        parking_location_id_param INT
      )
      LANGUAGE plpgsql
      AS $$
      BEGIN
          INSERT INTO Fleet (make, model, production_year, color, classId, mileage, vrm, parkingLocationId)
          VALUES (make_param, model_param, production_year_param, color_param, class_id_param, mileage_param, vrm_param, parking_location_id_param);
      END;
      $$;
    `);

    await client.query(
      `CREATE INDEX idx_pickup_date ON leasings (pickup_date);`,
    );
    await client.query(
      `CREATE INDEX idx_return_date ON leasings (return_date);`,
    );

    console.log('--> Functions, Procedures and Indexes created successfully');
  } catch (error) {
    console.error(error.message);
  } finally {
    client.release();
    client.end();
    newDbPool.end();
  }
}

async function setupDatabase() {
  await createDatabase();
  await dropRolesIfExists();
  await createRoles();
  await createFunctions();
  process.exit();
}

setupDatabase();
