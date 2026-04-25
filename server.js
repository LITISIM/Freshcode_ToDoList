// для запуску сервера введіть у консоль: node server.js
const express = require('express');
const fs = require('fs'); 
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const DATA_FILE = './tasks.json'; 

app.use(cors()); 
app.use(bodyParser.json()); 

app.get('/tasks', (req, res) => {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, '[]');
    }

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send("Помилка читання");
        res.send(JSON.parse(data || "[]"));
    });
});

app.post('/tasks', (req, res) => {
    const tasks = req.body;
    fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), (err) => {
        if (err) return res.status(500).send("Помилка запису");
        res.send({ message: "Успішно збережено на сервері" });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер працює на: http://localhost:${PORT}`);
});