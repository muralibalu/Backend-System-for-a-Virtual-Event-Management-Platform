const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');


// Public: list events
router.get('/events', eventController.listEvents);


// Organizer-only event CRUD
router.post('/events', authenticate, authorizeRole('organizer'), eventController.createEvent);
router.put('/events/:id', authenticate, authorizeRole('organizer'), eventController.updateEvent);
router.delete('/events/:id', authenticate, authorizeRole('organizer'), eventController.deleteEvent);


// Register for event (attendees)
router.post('/events/:id/register', authenticate, eventController.registerForEvent);


module.exports = router;