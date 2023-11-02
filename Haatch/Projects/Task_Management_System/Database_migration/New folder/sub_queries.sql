-- SELECT id,binding_rqstdate
-- FROM dc_jobbinding
-- WHERE STR_TO_DATE(binding_rqstdate, '%Y-%m-%d %H:%i:%s') IS NULL LIMIT 0,50000;

-- SELECT * FROM dc_jobbinding WHERE binding_rqstdate = '0000-00-00 00:00:00';

-- UPDATE dc_jobbinding SET binding_rqstdate =
-- NULL WHERE CAST(binding_rqstdate AS CHAR(20)) = '0000-00-00 00:00:00';

select binding_status,id from dc_jobbinding limit 50000;


SELECT contactno, COUNT(*) as count FROM dc_requestprofile GROUP BY contactno HAVING count > 1;

select * from job_profiles;

SELECT dc_jobprofile.*
FROM printing_shop.dc_jobprofile
LEFT JOIN task_management.job_profiles
ON dc_jobprofile.id = job_profiles.id
WHERE job_profiles.id IS NULL LIMIT 0,100