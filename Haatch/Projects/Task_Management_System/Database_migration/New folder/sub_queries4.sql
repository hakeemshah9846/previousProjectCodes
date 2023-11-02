INSERT INTO task_management.sections (section,createdAt,updatedAt)
SELECT distinct section,'2023-03-20','2023-03-20'
FROM printing_shop.dc_requestprofile;


SELECT dc_jobprofile.*
FROM printing_shop.dc_jobprofile
LEFT JOIN task_management.job_profiles
ON dc_jobprofile.id = job_profiles.id
WHERE job_profiles.id IS NULL;

