const express = require('express');
const router = express.Router();
const accessControl = require('../utils/access-control').accessControl;
const printPagesController = require('../controllers/printPagesController');

const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next);
    }
};

router.get('/job-print-operators', setAccessControl('1'), printPagesController.fetchAllPrintPagesOperators );

router.get('/job-print-colors', setAccessControl('1'), printPagesController.fetchAllPrintPagesColors );

router.get('/printers', setAccessControl('1'), printPagesController.fetchAllPrintPagesPrinters);

router.get('/paper-types', setAccessControl('1'), printPagesController.fetchAllPrintPagesPaperTypes);

router.get('/print-pages-machines', setAccessControl('1'), printPagesController.fetchAllPrintPagesMachines);


router.post('/print-pages', setAccessControl('1'), printPagesController.createNew);
router.put('/edit-print-pages', setAccessControl('1'), printPagesController.printPagesEdit);

module.exports = router;