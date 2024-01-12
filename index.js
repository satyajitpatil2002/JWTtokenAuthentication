const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const secretKey = "secreteKey"; 

app.get("/", (req, res) => {
    res.json({
        message: "a sample api"
    });
});

app.post("/login", (req, res) => {
    const user = {
        id: 1,
        username: "satya",
        email: "satya@gmail.com"
    };

    jwt.sign({ user }, secretKey, { expiresIn: '1000s' }, (error, token) => {
        if (error) {
            return res.status(500).json({ error: "Error generating token" });
        }

        res.json({
            token
        });
    });
});

app.post("/profile", verifyToken, (req, res) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if (err) {
            res.status(401).json({ result: 'invalid token' });
        } else {
            res.json({
                message: "profile accessed",
                authData
            });
        }
    });
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        if (bearer.length === 2) { // Check for undefined token
            const token = bearer[1];
            req.token = token;
            next();
        } else {
            res.status(403).json({
                result: 'Token format is not valid'
            });
        }
    } else {
        res.status(403).json({
            result: 'Token is not provided'
        });
    }
}

app.listen(7000, () => {
    console.log("app is running on port 7000");
});
