module.exports = (sequelize, Sequelize) => {
    const Note = sequelize.define("note", {
        noteId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        }
    });
    return Note;
};