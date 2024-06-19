
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('main'));
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/Database';
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', () => console.error("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));


app.post("/sign_up", async (req, res) => {
    const { name, age, gender, email, mobileno, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const data = {
            name,
            age,
            gender,
            email,
            mobileno,
            password: hashedPassword
        };

        await db.collection('users').insertOne(data);
        console.log("Record Inserted Successfully");
        return res.redirect('registration_complete.html');
    } catch (err) {
        console.error("Error inserting record:", err);
        return res.status(500).send("An error occurred while registering");
    }
});

app.get("/", (req, res) => {
    res.set({
        "Access-Control-Allow-Origin": '*'
    });
    return res.redirect('index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
