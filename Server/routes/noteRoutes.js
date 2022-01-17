const express = require('express');
const verifyJwtToken = require("../middleware/authTokenMiddleWare");
const noteController = require("../controllers/noteController");

const router = express.Router();

router.use(verifyJwtToken.verifyJwtToken);

router.get("/all", noteController.getAllNotes);
router.get("/:id", noteController.getNoteById);
router.post("/new", noteController.createNote);
router.put("/:id", noteController.updateNote);
router.delete("/:id", noteController.deleteNoteById);

module.exports = router;
