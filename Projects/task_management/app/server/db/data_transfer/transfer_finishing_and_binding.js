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
INSERT INTO task_management.finishing_and_bindings (id, job_id, binding_operator_id, binding_type_id, binding_status_id, material_id, binding_page_count, binding_quantity, require_perforation, request_date, completed_date, unit_cost, createdAt, updatedAt)
SELECT t.id, t.jobid,t.binding_operator,r1.id,r2.id,t.binding_material,t.binding_pagecount,t.binding_quantity,t.binding_reqPerforation,t.binding_rqstdate,t.binding_completedate,t.binding_jobCost,NOW(),NOW()
FROM printing_shop.dc_jobbinding t
INNER JOIN task_management.binding_types r1 ON t.binding_type = r1.binding_type
INNER JOIN task_management.binding_statuses r2 ON t.binding_status = r2.status;
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
