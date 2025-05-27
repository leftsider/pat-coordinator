const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Path to your credentials and token files relative to this file
const CREDENTIALS_PATH = path.join(__dirname, '../credentials/google-calendar.json');
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
const TOKEN_PATH = path.join(__dirname, 'tokens.json');

// Load client secrets from a local file.
//const credentials = JSON.parse(fs.readFileSync('../credentials/google-calendar.json'));
const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;

// Scopes for Google Calendar API
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// Create OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

// Generate the Google Auth URL
function getAuthUrl() {
  return oAuth2Client.generateAuthUrl({
	access_type: 'offline',
	scope: SCOPES,
	prompt: 'consent',
  });
}

// Exchange code for tokens and store them
async function setTokensFromCode(code) {
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  return tokens;
}

// Load tokens from file (if they exist)
function loadTokens() {
  if (fs.existsSync(TOKEN_PATH)) {
	const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
	oAuth2Client.setCredentials(tokens);
	return tokens;
  }
  return null;
}

// List upcoming events
async function listEvents() {
  loadTokens(); // Ensure tokens are loaded
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  const res = await calendar.events.list({
	calendarId: 'primary',
	timeMin: new Date().toISOString(),
	maxResults: 10,
	singleEvents: true,
	orderBy: 'startTime',
  });
  return res.data.items;
}

// Create a new event
async function createEvent(event) {
  loadTokens(); // Ensure tokens are loaded
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  const response = await calendar.events.insert({
	calendarId: 'primary',
	resource: event,
  });
  return response.data;
}

module.exports = {
  getAuthUrl,
  setTokensFromCode,
  listEvents,
  createEvent,
  oAuth2Client,
};

