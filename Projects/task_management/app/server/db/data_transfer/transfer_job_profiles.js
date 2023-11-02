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
INSERT INTO task_management.job_profiles (id, job_id, job_title, requested_by_id,job_type_id,job_req_comment,document_type_id,document_name,document_mode_id,requested_delivery_date,job_req_for,job_status_id,confidentiality,require_sample,require_edits,delivery_mode_id,deliver_to_id,deliver_to_department_id,deliver_to_location,require_cover,require_finishing_and_binding,job_requested_on,job_completed_on, createdAt, updatedAt)
SELECT t.id, t.jobID,t.jobTitle,t.jobReqBy,r1.id,t.jobReqComment,r2.id,t.jobDocName,r3.id,t.jobReqDeliveryDate,t.jobReqFor,r4.id,t.jobConfidential,t.jobReqSample,t.jobReqEdit,r5.id,t.jobDeliverTo,r6.id,t.jobDelLocation,t.jobReqCover,t.jobReqBinding,t.jobReqDate,t.jobDoneDate,NOW(),NOW()
FROM printing_shop.dc_jobprofile t
INNER JOIN task_management.job_types r1 ON t.jobType = r1.job_type
INNER JOIN task_management.document_types r2 ON t.jobDocType = r2.document_type
INNER JOIN task_management.document_modes r3 ON t.jobDocMode = r3.document_mode
INNER JOIN task_management.job_statuses r4 ON t.jobStatus = r4.status
INNER JOIN task_management.delivery_modes r5 ON t.jobDeliveryMode = r5.delivery_mode
INNER JOIN task_management.departments r6 ON t.jobDelDepartment = r6.department;
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
