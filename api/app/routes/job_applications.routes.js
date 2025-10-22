const express = require('express');
const {getAll,getById,getByAdId,getByPeopleId,createApplication,updateApplicationUser,updateApplicationAdmin ,deleteApplicationById} = require('../controllers/job_applications.controller');
const auth = require('../middlewares/auth.middleware');
const authorize = require("../middlewares/roleAuth.middleware");
const router = express.Router();

router.get("/",auth,getAll);
router.get("/:id",auth,getById);
router.get("/ad/:ad_id",auth,authorize([1,2]),getByAdId);
router.get("/people/:people_id",auth,authorize([1,3]),getByPeopleId);
router.post("/",createApplication);
router.patch("/:id",auth,authorize([3]),updateApplicationUser);
router.patch("/admin/:id",auth,authorize([1]),updateApplicationAdmin);
router.delete("/:id",auth,authorize([1,3]),deleteApplicationById);
module.exports = router;