const express = require('express');
const {
  getAuthUrl,
  setTokensFromCode,
  listEvents,
  createEvent,
  oAuth2Client,
} = require('./googleCalendar');

const app = express();
app.use(express.json());

// 1. Start OAuth2 flow
app.get('/auth/google', (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
});

// 2. OAuth2 callback
app.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code provided');
  try {
	await setTokensFromCode(code);
	res.send('Google Calendar connected! You can now use the app.');
  } catch (err) {
	console.error(err);
	res.status(500).send('Error exchanging code for tokens');
  }
});

// 3. List events (GET /calendar/events)
app.get('/calendar/events', async (req, res) => {
  try {
	const events = await listEvents();
	res.json(events);
  } catch (err) {
	console.error(err);
	res.status(500).send('Error fetching events');
  }
});

// 4. Create event (POST /calendar/events)
app.post('/calendar/events', async (req, res) => {
  try {
	const event = req.body; // Expect event object in request body
	const created = await createEvent(event);
	res.json(created);
  } catch (err) {
	console.error(err);
	res.status(500).send('Error creating event');
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
