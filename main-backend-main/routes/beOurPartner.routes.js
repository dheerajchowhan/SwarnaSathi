const express = require('express');
const router = express.Router();
const beOurPartnerControllers = require('../controllers/beOurPartnerControllers');

// Routes
router.post('/', beOurPartnerControllers.createFormSubmission);
router.post('/send-otp', beOurPartnerControllers.sendOTP);
router.post('/verify-otp', beOurPartnerControllers.verifyOTP);
router.get('/', beOurPartnerControllers.getAllSubmissions);
router.get('/:id', beOurPartnerControllers.getSubmission);
router.put('/:id', beOurPartnerControllers.updateSubmission);
router.delete('/:id', beOurPartnerControllers.deleteSubmission);

module.exports = router;