// backend/src/mockCalendar.js

// Mock event data (adjust dates/times as needed)
const mockEvents = [
  {
	summary: "Existing Booking",
	start: { dateTime: "2025-05-25T14:00:00-05:00" },
	end: { dateTime: "2025-05-25T16:00:00-05:00" }
  }
];

// Mock functions
function listEvents() {
  return Promise.resolve(mockEvents);
}

function createEvent(event) {
  console.log("[MOCK] Creating event:", event);
  mockEvents.push(event);
  return Promise.resolve({ id: "mock-event-id", ...event });
}

module.exports = { listEvents, createEvent };
