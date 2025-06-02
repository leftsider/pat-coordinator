// backend/src/index.js
const express = require('express');
const { listEvents, createEvent } = require('./mockCalendar'); // ← Use mocks

const app = express();
app.use(express.json());

// Remove Google OAuth routes for now

// List events (GET /calendar/events)
app.get('/calendar/events', async (req, res) => {
  try {
    const events = await listEvents();
    res.json(events);
  } catch (err) {
    res.status(500).send('Error fetching events');
  }
});

// Create event (POST /calendar/events)
app.post('/calendar/events', async (req, res) => {
  try {
    const created = await createEvent(req.body);
    res.json(created);
  } catch (err) {
    res.status(500).send('Error creating event');
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Mock calendar mode active. Use /calendar/events');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend (MOCK MODE) running on port ${PORT}`);
});
