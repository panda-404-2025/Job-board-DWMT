const express = require('express');
const {login} = require('../controllers/login.controller');
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", login);

module.exports = router;