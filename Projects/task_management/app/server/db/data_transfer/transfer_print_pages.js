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
INSERT INTO task_management.print_pages (id, job_id, print_pages_machine, job_print_color_id, job_print_operator_id, paper_type_id, job_print_pages, job_print_quantity, job_done_date, job_status, job_req_comment, job_print_comment,print_sides,job_type,job_print_total,job_req_paper_quantity,job_print_per_paper,job_req_lamination,job_req_stappled,job_paper_cost,job_print_cost,createdAt, updatedAt)
SELECT t.id, t.jobID,t.jobPrintMachine,r1.id,t.jobPrintOperator,t.jobPrintPaperType,t.jobPrintPages,t.jobPrintQuantity,t.jobDoneDate,t.jobStatus,t.jobReqComment,t.jobPrintComment,t.jobPrintSides,t.jobType,t.jobPrintTotal,t.jobReqPaperQuanity,t.jobPrintPerPaper,t.jobReqLaminate,t.jobReqStappled,t.jobPaperCost,t.jobPrintCost,NOW(),NOW()
FROM printing_shop.dc_printpages t
INNER JOIN task_management.print_pages_colors r1 ON t.jobPrintColor = r1.job_print_color
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
