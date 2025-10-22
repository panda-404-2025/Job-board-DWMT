const express = require('express');
const {getAll,getById,register,updateUser,updateUserPassword ,deleteUserById,getAllEmails} = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');
const authorize = require("../middlewares/roleAuth.middleware");
const router = express.Router();

router.get("/",auth,authorize([1]),getAll);
router.get("/email/",getAllEmails);
router.get("/:id",auth,getById);
router.post("/",register);
router.patch("/:id",auth,authorize([1,2,3]),updateUser);
router.patch("/password/:id",auth,authorize([1,2,3]),updateUserPassword)
router.delete("/:id",auth,authorize([1,2,3]),deleteUserById);
module.exports = router;