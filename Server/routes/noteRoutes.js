const express = require('express');
const verifyJwtToken = require("../middleware/authTokenMiddleWare");
const noteController = require("../controllers/noteController");
const router = express.Router();

router.use(verifyJwtToken.verifyJwtToken);
router.get("/test", noteController.hi);


module.exports = router;
