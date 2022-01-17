const express = require('express');
const verifyJwtToken = require("../middleware/authTokenMiddleWare");
const noteController = require("../controllers/noteController");
const router = express.Router();

router.use(verifyJwtToken.verifyJwtToken);

router.get("/:id", noteController.getNoteById);
router.post("/new", noteController.createNote);
router.put("/:id", noteController.updateNote);

module.exports = router;
