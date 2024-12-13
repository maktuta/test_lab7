const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Підключення до SQLite
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE events (id INTEGER PRIMARY KEY AUTOINCREMENT, event TEXT, timestamp TEXT)");
});

// Маршрут для збереження події
app.post('/events', (req, res) => {
  const { event } = req.body;
  const timestamp = new Date().toISOString();

  db.run("INSERT INTO events (event, timestamp) VALUES (?, ?)", [event, timestamp], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to save event' });
    }
    res.status(200).json({ id: this.lastID, timestamp });
  });
});

// Маршрут для отримання всіх подій
app.get('/events', (req, res) => {
  db.all("SELECT * FROM events", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch events' });
    }
    res.status(200).json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
