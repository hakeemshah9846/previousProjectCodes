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
INSERT INTO task_management.papers (id, paper_name, paper_size,paper_weight,paper_unitcost, paper_type,paper_dimension,createdAt,updatedAt)
SELECT id, paper_name, paper_size,paper_weight, paper_unitcost, paper_type, paper_dimension,NOW(),NOW()
FROM printing_shop.dc_paper;
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
