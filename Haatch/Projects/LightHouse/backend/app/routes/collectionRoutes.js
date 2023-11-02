const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController.js');
const accessControl = require('../utils/access-control').accessControl;

const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next)
    }
};

router.get('/collections', setAccessControl('*'), collectionController.fetchCollections);
router.post('/collections', setAccessControl('1,2,3'), collectionController.addCollection);
router.get('/collections/otp/:id', setAccessControl('1,2,3'), collectionController.generateOTP);
router.patch('/collections/complete/:id', setAccessControl('1,2,3'), collectionController.completeCollection);
router.patch('/collections/accept/:id', setAccessControl('1,2'), collectionController.acceptCollection);
router.patch('/collections/reject/:id', setAccessControl('1,2'), collectionController.rejectCollection);
router.patch('/collections/hold/:id', setAccessControl('1'), collectionController.holdCollection);
router.patch('/collections/activate/:id', setAccessControl('1,2,3'), collectionController.activateCollection);
router.patch('/collections/hide/:id', setAccessControl('1,2,3'), collectionController.hideCollection);
router.patch('/collections/unhide/:id', setAccessControl('1,2,3'), collectionController.unhideCollection);
router.delete('/collections/delete/:id', setAccessControl('1,2,3'), collectionController.deleteCollection);
router.get('/collections/updates', setAccessControl('*'), collectionController.fetchCollectionUpdates);
router.get('/collections/updates/:id', setAccessControl('*'), collectionController.fetchOneCollectionUpdate);
router.post('/collections/updates/:id', setAccessControl('1,2,3'), collectionController.addCollectionUpdates);
router.put('/collections/updates/:id', setAccessControl('1,2,3'), collectionController.updateCollectionUpdates);
router.delete('/collections/updates/:id', setAccessControl('1,2,3'), collectionController.deleteCollectionUpdate);
router.patch('/collections/requests/hold/:id', setAccessControl('2'), collectionController.holdRequestCollection);
router.get('/collections/updated-collections', setAccessControl('*'), collectionController.fetchUpdatedCollections);
router.get('/collections/updated-collections/:id', setAccessControl('*'), collectionController.fetchUpdatedCollection);
router.patch('/collections/updated-collections/accept/:id', setAccessControl('1,2'), collectionController.acceptUpdatedCollection);
router.get('/collections/:id', setAccessControl('*'), collectionController.fetchCollection);
router.put('/collections/:id', setAccessControl('1,2,3'), collectionController.updateCollection);

//api to hide collection
router.patch('/collections/hide/:id',setAccessControl('1,2,3'),collectionController.hideCollection);

module.exports = router;