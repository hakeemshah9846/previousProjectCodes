SELECT distinct printCover_Machine FROM dc_printcovers;

select * from dc_paper;

INSERT INTO task_management.print_cover_statuses (status,createdAt,updatedAt)
SELECT distinct printCover_status,NOW(),NOW()
FROM printing_shop.dc_printcovers;

