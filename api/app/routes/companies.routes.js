const express = require('express');
const {getAll,getById,createCompany,updateCompany ,deleteCompanyById} = require('../controllers/companies.controller');
const auth = require('../middlewares/auth.middleware');
const authorize = require("../middlewares/roleAuth.middleware");
const router = express.Router();

router.get("/",getAll);
router.get("/:id",auth,getById);
router.post("/",auth,authorize([1]),createCompany);
router.patch("/:id",auth,authorize([1,2]),updateCompany);
router.delete("/:id",auth,authorize([1]),deleteCompanyById);
module.exports = router;