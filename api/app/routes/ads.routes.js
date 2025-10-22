const express = require('express');
const {getAll,getById,getByCompanyId,createAd,createAdAdmin,updateAd,updateAdAdmin ,deleteAdById} = require('../controllers/ads.controller');
const auth = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/roleAuth.middleware');

const router = express.Router();

router.get("/",getAll);
router.get("/:id",getById);
router.get("/company/:company_id",getByCompanyId);
router.post("/",auth,authorize([2]),createAd);
router.post("/admin/",auth,authorize([1]),createAdAdmin);
router.patch("/:id",auth,authorize([2]),updateAd);
router.patch("/admin/:id",auth,authorize([1]),updateAdAdmin);
router.delete("/:id",auth,authorize([1,2]),deleteAdById);
module.exports = router;