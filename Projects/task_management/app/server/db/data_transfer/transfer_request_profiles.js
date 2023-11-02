require('dotenv').config();
const mysql = require('mysql2');

// create a connection to the source database (DB1)
const sourceConnection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_SOURCE_DATABASE
});

// create a connection to the destination database (DB2)
const destConnection = mysql.createConnection({
  host: 'localhost',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

// establish connections to both databases
sourceConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to source database:', err);
    return;
  }
  console.log('Connected to source database');
});

destConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to destination database:', err);
    return;
  }
  console.log('Connected to destination database');
});

// define the SQL query to transfer data from Table1 to Table2
const sqlQuery = `
INSERT INTO task_management.request_profiles (id, name, department_id, campus_id, email, section_id, contact_no, user_id, createdAt, updatedAt)
SELECT t.id, t.name,r1.id,r2.id,t.email,r3.id,t.contactno,t.userid,NOW(),NOW()
FROM printing_shop.dc_requestprofile t
INNER JOIN task_management.departments r1 ON t.department = r1.department
INNER JOIN task_management.campuses r2 ON t.campus = r2.campus
INNER JOIN task_management.sections r3 ON t.section = r3.section;
`;

// execute the SQL query
destConnection.query(sqlQuery, (error, results, fields) => {
  if (error) {
    console.error('Error executing SQL query:', error);
    return;
  }
  console.log('Data transfer complete');
});

// close connections to both databases
sourceConnection.end();
destConnection.end();
