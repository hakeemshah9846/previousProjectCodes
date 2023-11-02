const express = require('express');
const router = express.Router();
const accessControl = require('../utils/access-control').accessControl;
const salaryController = require('../controllers/salaryController');


const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next)
    }
}


router.get('/salaries/histories', setAccessControl('2'),salaryController.salaryList);
router.get('/salaries/histories/view', setAccessControl('2'), salaryController.salaryListView); //Salary detailed view
router.post('/payroll/run', setAccessControl('2'), salaryController.runPayroll);
router.get('/salaries/template', setAccessControl('2'), salaryController.fetchSalaryTemplate);
router.post('/salaries/template', setAccessControl('2'), salaryController.newSalaryTemplate);
router.put('/salaries/template', setAccessControl('2'), salaryController.updateSalaryTemplate);
router.delete('/salaries/template', setAccessControl('2'), salaryController.deleteSalaryTemplate);
router.get('/salaries/listing',setAccessControl('2'),salaryController.salaryListing);

module.exports = router;