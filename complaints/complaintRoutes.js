const express = require('express');
const router = express.Router();
const { auth, isSubAdmin } = require('./complaintMiddleware');
const {
  createComplaint,
  getComplaintById,
  updateComplaint,
  getUserComplaints,
  deleteComplaint,
  getAllComplaintsForSubAdmin
} = require('./complaintController');

// ✅ SubAdmin route must come before dynamic ID route
router.get('/subadmin', auth, isSubAdmin, getAllComplaintsForSubAdmin);

router.post('/create', auth, createComplaint);
router.get('/', auth, getUserComplaints);
router.get('/:id', auth, getComplaintById); // This should be below /subadmin
router.put('/:id', auth, updateComplaint);
router.delete('/:id', auth, deleteComplaint);

module.exports = router;
