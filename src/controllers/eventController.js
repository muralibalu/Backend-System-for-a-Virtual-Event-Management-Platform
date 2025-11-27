const { v4: uuidv4 } = require("uuid");
const events = require("../data/events");
const users = require("../data/users");
const emailService = require("../services/emailService");

async function listEvents(req, res) {
  // return lightweight event objects
  const list = events.map((e) => ({
    id: e.id,
    title: e.title,
    date: e.date,
    time: e.time,
    description: e.description,
    organizerId: e.organizerId,
    participantsCount: e.participants.length,
  }));
  res.json(list);
}

async function createEvent(req, res) {
  const { title, date, time, description } = req.body;
  if (!title || !date || !time)
    return res.status(400).json({ error: "title, date, time required" });
  const event = {
    id: uuidv4(),
    title,
    date,
    time,
    description: description || "",
    organizerId: req.user.id,
    participants: [],
  };
  events.push(event);
  res.status(201).json(event);
}

async function updateEvent(req, res) {
  const id = req.params.id;
  const ev = events.find((e) => e.id === id);
  if (!ev) return res.status(404).json({ error: "Event not found" });
  if (ev.organizerId !== req.user.id)
    return res.status(403).json({ error: "You don't own this event" });
  const { title, date, time, description } = req.body;
  if (title) ev.title = title;
  if (date) ev.date = date;
  if (time) ev.time = time;
  if (description) ev.description = description;
  res.json(ev);
}

async function deleteEvent(req, res) {
  const id = req.params.id;
  const idx = events.findIndex((e) => e.id === id);
  if (idx === -1) return res.status(404).json({ error: "Event not found" });
  const ev = events[idx];
  if (ev.organizerId !== req.user.id)
    return res.status(403).json({ error: "You don't own this event" });
  events.splice(idx, 1);
  res.json({ ok: true });
}

async function registerForEvent(req, res) {
  const id = req.params.id;
  const ev = events.find((e) => e.id === id);
  if (!ev) return res.status(404).json({ error: "Event not found" });
  if (ev.participants.includes(req.user.id))
    return res.status(409).json({ error: "Already registered" });
  ev.participants.push(req.user.id);
  // send async email
  const attendee = users.find((u) => u.id === req.user.id);
  try {
    await emailService.sendRegistrationEmail(attendee.email, ev);
  } catch (err) {
    console.error("Email send failed", err);
    // don't fail the registration if email fails
  }
  res.json({ ok: true, eventId: ev.id });
}

module.exports = {
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
};
