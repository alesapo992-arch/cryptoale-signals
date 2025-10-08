const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const signalsPath = path.join(__dirname, 'signals.txt');
const userPassPath = path.join(__dirname, 'user_password.txt');
const analysisPath = path.join(__dirname, 'analysis.html');

// ====== ENDPOINT SIGNALS ======
app.get('/signals', (req, res) => {
    fs.readFile(signalsPath, 'utf8', (err, content) => {
        if (err) return res.status(500).send('Error reading signals.txt');
        res.send(content.trim());
    });
});

app.post('/save', (req, res) => {
    fs.writeFile(signalsPath, req.body.data || '', 'utf8', err => {
        if (err) return res.status(500).send('Error saving signals.txt');
        res.send('Signals updated successfully!');
    });
});

// ====== ENDPOINT USER PASSWORD ======
app.get('/userPassword', (req, res) => {
    fs.readFile(userPassPath, 'utf8', (err, content) => {
        if (err) return res.send("user2025"); // fallback
        res.send(content.trim());
    });
});

app.post('/saveUserPassword', (req, res) => {
    const pwd = req.body.password || '';
    if (pwd.trim().length < 3) {
        return res.status(400).send('Password too short');
    }
    fs.writeFile(userPassPath, pwd.trim(), 'utf8', err => {
        if (err) return res.status(500).send('Error updating password');
        res.send('User password updated successfully!');
    });
});

// ====== ENDPOINT TRADINGVIEW ANALYSIS ======
app.post('/saveAnalysis', (req, res) => {
    const content = req.body.data || '';
    fs.writeFile(analysisPath, content, 'utf8', err => {
        if (err) return res.status(500).send('Error saving analysis');
        res.send('Analysis saved successfully!');
    });
});

app.get('/getAnalysis', (req, res) => {
    if (!fs.existsSync(analysisPath)) return res.send('');
    fs.readFile(analysisPath, 'utf8', (err, content) => {
        if (err) return res.status(500).send('Error reading analysis');
        res.send(content);
    });
});

app.post('/deleteAnalysis', (req, res) => {
    fs.writeFile(analysisPath, '', 'utf8', err => {
        if (err) return res.status(500).send('Error deleting analysis');
        res.send('Analysis deleted successfully!');
    });
});

// Serve static files
app.use(express.static(__dirname));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`💡 Suggerimento: avvia con 'nodemon server.js' per auto-restart`);
});