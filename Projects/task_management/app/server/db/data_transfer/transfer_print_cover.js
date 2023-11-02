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
//Changed require_lamination to printCover_laminate
const sqlQuery = `
INSERT INTO c1_document_center.print_covers (id, job_id, print_cover_operator_id, request_date, completed_date, print_cover_status_id, print_cover_material_id, print_cover_quantity, print_cover_sides, print_cover_color_id, printCover_laminate, print_cover_machine_id,createdAt,updatedAt)
SELECT t.id, t.jobId,t.printCover_operator,t.printCover_rqstDate,t.printCover_completeDate,r1.id,t.printCover_material,t.printCover_quantity,t.printCover_sides,r2.id,t.printCover_laminate,t.printCover_Machine,NOW(),NOW()
FROM printing_shop.dc_printcovers t
INNER JOIN c1_document_center.print_cover_statuses r1 ON t.printCover_status = r1.status
INNER JOIN c1_document_center.print_cover_colors r2 ON t.printCover_color = r2.print_cover_color;

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


//Data transfer completed
