select id,binding_status,jobid from dc_jobbinding;
SELECT COUNT(*) as row_count FROM dc_jobbinding;

select id,binding_status_id,job_id from finishing_and_bindings;
SELECT COUNT(*) as row_count FROM finishing_and_bindings;

SELECT COUNT(*) FROM dc_paper;


SELECT COUNT(*) FROM dc_jobprofile;


SELECT MAX(jobReqBy) AS max_value, MIN(jobReqBy) AS min_value
FROM dc_jobprofile;

SELECT MAX(id) AS max_value, MIN(id) AS min_value
FROM dc_requestprofile;

SELECT id 
FROM dc_requestprofile
WHERE id - 1 NOT IN (SELECT id FROM dc_requestprofile);


 