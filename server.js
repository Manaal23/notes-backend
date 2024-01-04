const mongoose = require("mongoose")

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userController = require("./controller/user/userController");
const notesController = require("./controller/notes/notesController");
const auth = require("./middleware/auth");
const app = express();
const rateLimiter = require("express-rate-limit");

const rateLimit = rateLimiter({
    windowMs: 60 * 1000,
    max: 5,
    message: "You have exceeded your 5 requests per minute limit.",
    headers: true,
  });


app.use(rateLimit);
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));

mongoose.connect(process.env.DB_URL)


app.use(cors());

app.post("/api/auth/signup", userController.signUp)
app.post("/api/auth/login", userController.login)

app.get("/api/notes",auth, notesController.getNotes)
app.post("/api/notes",auth, notesController.saveNotes)
app.put("/api/notes/:id",auth, notesController.updateNotes)
app.get("/api/notes/:id",auth, notesController.notesDetail)
app.delete("/api/notes/:id",auth, notesController.deleteNotes)
app.post("/api/notes/:id/share",auth, notesController.shareNotes)
app.get("/api/search",auth, notesController.searchNotes)

// app.get("/api/elastic", notesController.elasticData)

module.exports = app;