const oracledb = require('oracledb');

// Initialize Oracle client (adjust path to your Instant Client)
oracledb.initOracleClient({
  libDir: "C:/Users/thesa/Downloads/instantclient-basic-windows.x64-23.9.0.25.07/instantclient_23_9"
});

const dbConfig = {
  user: "sanskar",
  password: "sns",
  connectString: "localhost/XE"
};

async function getConnection() {
  try {
    return await oracledb.getConnection(dbConfig);
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    throw err;
  }
}

async function closeConnection(connection) {
  if (connection && connection.close) {
    try {
      await connection.close();
    } catch (err) {
      console.error("❌ Error closing connection:", err);
    }
  }
}

async function initializeDatabase() {
  let conn;
  try {
    conn = await getConnection();
    console.log("✅ Connected to Oracle Database!");

    // Ensure EMPLOYEES table exists
    const checkEmp = await conn.execute(
      `SELECT COUNT(*) AS COUNT FROM user_tables WHERE table_name = 'EMPLOYEES'`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (checkEmp.rows[0].COUNT === 0) {
      console.log("📋 Creating EMPLOYEES table...");

      await conn.execute(`
        CREATE TABLE EMPLOYEES (
          ID NUMBER PRIMARY KEY,
          NAME VARCHAR2(100) NOT NULL,
          EMAIL VARCHAR2(100) NOT NULL UNIQUE,
          PHONE VARCHAR2(20),
          DEPARTMENT VARCHAR2(50),
          POSITION VARCHAR2(100),
          SALARY NUMBER,
          HIRE_DATE DATE
        )
      `);

      await conn.execute(`CREATE SEQUENCE EMPLOYEES_SEQ START WITH 1 INCREMENT BY 1`);

      await conn.execute(`
        CREATE OR REPLACE TRIGGER EMPLOYEES_TRG
        BEFORE INSERT ON EMPLOYEES
        FOR EACH ROW
        BEGIN
          IF :NEW.ID IS NULL THEN
            SELECT EMPLOYEES_SEQ.NEXTVAL INTO :NEW.ID FROM dual;
          END IF;
        END;
      `);

      console.log("✅ EMPLOYEES table, sequence, and trigger created!");
    } else {
      console.log("✅ EMPLOYEES table already exists!");
    }

    // Ensure USERS table exists
    const checkUsers = await conn.execute(
      `SELECT COUNT(*) AS COUNT FROM user_tables WHERE table_name = 'USERS'`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (checkUsers.rows[0].COUNT === 0) {
      console.log("📋 Creating USERS table...");

      await conn.execute(`
        CREATE TABLE USERS (
          ID NUMBER PRIMARY KEY,
          NAME VARCHAR2(100) NOT NULL,
          EMAIL VARCHAR2(100) NOT NULL UNIQUE,
          PASSWORD VARCHAR2(200) NOT NULL,
          ROLE VARCHAR2(20) DEFAULT 'employee' NOT NULL,
          EMPLOYEE_ID NUMBER NULL,
          CONSTRAINT FK_USERS_EMP FOREIGN KEY (EMPLOYEE_ID) REFERENCES EMPLOYEES(ID)
        )
      `);

      await conn.execute(`CREATE SEQUENCE USERS_SEQ START WITH 1 INCREMENT BY 1`);

      await conn.execute(`
        CREATE OR REPLACE TRIGGER USERS_TRG
        BEFORE INSERT ON USERS
        FOR EACH ROW
        BEGIN
          IF :NEW.ID IS NULL THEN
            SELECT USERS_SEQ.NEXTVAL INTO :NEW.ID FROM dual;
          END IF;
        END;
      `);

      console.log("✅ USERS table, sequence, and trigger created!");
    } else {
      console.log("✅ USERS table already exists!");
    }
  } catch (err) {
    console.error("❌ Error initializing database:", err);
  } finally {
    await closeConnection(conn);
  }
}

module.exports = { getConnection, closeConnection, initializeDatabase, oracledb };

