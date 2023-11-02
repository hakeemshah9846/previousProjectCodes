const express = require('express');
const router = express.Router();
const accessControl = require('../utils/access-control').accessControl;
const documentController = require('../controllers/documentController');


const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next)
    }
};

router.post('/documents/users/types', setAccessControl('2'),documentController.addNewUserDocumentType);
router.get('/documents/users/types', setAccessControl('2'),documentController.fetchAllUserDocumentType);
router.get('/documents/users/types/:id', setAccessControl('2'),documentController.fetchSingleUserDocumentType);
router.put('/documents/users/types/:id', setAccessControl('2'),documentController.updateUserDocumentType);
router.delete('/documents/users/types/:id', setAccessControl('2'),documentController.deleteUserDocumentType);

//User documents
router.patch('/documents/users/upload', setAccessControl('2,4'),documentController.uploadNewUserDocument);
router.patch('/documents/users/remove', setAccessControl('2,4'),documentController.removeUserDocument);

//System generated documents
router.get('/documents/system/types', setAccessControl('1,2,4'),documentController.fetchAllSystemDocumentType);
router.get('/documents/system/generate/:document_type_id', setAccessControl('2,4'),documentController.generateSystemDocumentType);

module.exports = router;
