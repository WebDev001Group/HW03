const db = require("../models");
const { users: User, refreshTokens: RefreshToken, notes: Note } = db;


function getNoteById(req, res) {
    const id = req.params.id;
    return res.status(200).send({ "uid": id });
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
            res.status(500).send({
                message: err.message
            });
        });
}


module.exports = {
    getNoteById,
    createNote,
    updateNote
}


