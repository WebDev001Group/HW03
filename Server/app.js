const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/noteRoutes");
const db = require("./models");
const cors = require('cors');

var corsOptions = {
    origin: "http://localhost:8000"
};

app.use(cors(corsOptions));

db.sequelize.sync();

app.use(express.json());

app.listen(3000, () => {
    console.log(`Server is running on port 3000.`);
});



app.use("/auth", authRoutes);

app.use("/notes", notesRoutes);


