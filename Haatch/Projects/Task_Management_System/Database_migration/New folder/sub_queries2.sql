select id,binding_status_id,job_id from finishing_and_bindings;
SELECT COUNT(*) as row_count FROM finishing_and_bindings;

SELECT printing_shop.dc_jobbinding.*
FROM dc_jobbinding
LEFT JOIN task_management.finishing_and_bindings
ON dc_jobbinding.id = finishing_and_bindings.id
WHERE finishing_and_bindings.id IS NULL;

SELECT printing_shop.dc_jobbinding.*
FROM printing_shop.dc_jobbinding
WHERE NOT EXISTS (
  SELECT *
  FROM task_management.finishing_and_bindings
  WHERE printing_shop.dc_jobbinding.id = task_management.finishing_and_bindings.id
);

