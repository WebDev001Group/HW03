const db = require("../models");
const { users: User, refreshTokens: RefreshToken, notes: Note } = db;


function getNoteById(req, res) {
    const id = req.params.id;
    const ownerId = req.userId;
    const role = req.role;

    Note.findByPk(id)
        .then(note => {
            if (!note) {
                res.status(404).send({ message: "not found!" });
            }
            if (role !== "Admin" && ownerId !== note.userId) {
                return res.status(403).send({ message: "you can only view your own notes!" });
            }
            return res.status(200).send({ note: note });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        })
}

function createNote(req, res) {
    const ownerId = req.userId;
    const title = req.body.title;
    const description = req.body.description;

    if (!title || !description) {
        res.status(400).send({ message: "title or descritpion can not be empty!" });
    }
    Note.create({
        userId: ownerId,
        title: title,
        description: description
    }).then(note => {
        res.status(201).send({ message: `the note id is ${note.noteId}` });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    })
}

async function updateNote(req, res) {
    const userId = req.userId;
    const role = req.role;
    const noteId = req.params.id;

    let note = await Note.findByPk(noteId);

    if (!note) {
        return res.status(404).send({ message: "not found!" })
    }

    if (role !== "Admin" && note.userId !== userId) {
        return res.status(403).send({ message: "you can only change your own notes!" });
    }

    Note.update(req.body, { where: { noteId: noteId } })
        .then((num) => {
            if (num == 1) {
                return res.status(200).send({ message: "update successfully!" });
            }
            else {
                return res.status(400).send({ message: "failed" });
            }
        })
        .catch(err => {
            return res.status(500).send({
                message: err.message
            });
        });
}


function getAllNotes(req, res) {
    const userId = req.userId;
    const role = req.role;
    let condition = role === "Admin" ? {} : { userId: userId }

    Note.findAll({ where: condition })
        .then(notes => {
            return res.status(200).send({ notes: notes });

        })
        .catch(err => {
            return res.status(500).send({ message: err.message });
        });
}

async function deleteNoteById(req, res) {
    const noteId = req.params.id;
    const role = req.role;
    const userId = req.userId;

    let note = await Note.findByPk(noteId);
    if (!note) {
        return res.status(404).send({ message: "not found!" })
    }

    if (role !== "Admin" && note.userId !== userId) {
        return res.status(403).send({ message: "you can only delete your own notes!" });
    }

    Note.destroy({ where: { noteId: noteId } })
        .then(num => {
            if (num == 1) {
                res.status(200).send({ messge: "deleted successfully!" });
            }
            else {
                res.status(404).send({ message: "delete failed!" });
            }
        })
        .catch(err => {
            return res.status(500).send({ message: err.message });
        });
}

module.exports = {
    getNoteById,
    createNote,
    updateNote,
    getAllNotes,
    deleteNoteById
}


