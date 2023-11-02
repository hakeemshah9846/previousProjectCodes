INSERT INTO task_management.request_profile (id, name, binding_operator_id, binding_type_id, binding_status_id, material_id, binding_page_count, binding_quantity, require_perforation, request_date, completed_date, unit_cost, createdAt, updatedAt)
SELECT t.id, t.jobid,t.binding_operator,r1.id,r2.id,t.binding_material,t.binding_pagecount,t.binding_quantity,t.binding_reqPerforation,t.binding_rqstdate,t.binding_completedate,t.binding_jobCost,"2023-03-18","2023-03-18"
FROM printing_shop.dc_jobbinding t
INNER JOIN task_management.binding_types r1 ON t.binding_type = r1.binding_type
INNER JOIN task_management.binding_statuses r2 ON t.binding_status = r2.status;
