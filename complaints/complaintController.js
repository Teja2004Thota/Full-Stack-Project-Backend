const Complaint = require('./complaintModel');

const createComplaint = async (req, res) => {
  const { issue, subIssue, selectedQuestion, description, priority, needsAI, aiResolved } = req.body;

  try {
    if (!issue || !subIssue || !selectedQuestion) {
      return res.status(400).json({ message: 'Issue, sub-issue, and selected question are required' });
    }

    const complaint = new Complaint({
      userId: req.user.id,
      issue,
      subIssue,
      selectedQuestion,
      description,
      priority,
      needsAI,
      aiResolved: needsAI ? aiResolved : false,
    });

    await complaint.save();
    res.status(201).json({ message: 'Complaint created successfully', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    if (complaint.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to access this complaint' });
    }
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateComplaint = async (req, res) => {
  const { issue, subIssue, selectedQuestion, description, priority, status } = req.body;

  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Allow the complaint owner or a SubAdmin to update
    if (complaint.userId.toString() !== req.user.id && req.user.role !== 'SubAdmin') {
      return res.status(403).json({ message: 'You are not authorized to update this complaint' });
    }

    complaint.issue = issue || complaint.issue;
    complaint.subIssue = subIssue || complaint.subIssue;
    complaint.selectedQuestion = selectedQuestion || complaint.selectedQuestion;
    complaint.description = description !== undefined ? description : complaint.description;
    complaint.priority = priority || complaint.priority;

    // Allow SubAdmins to change complaint status
    if (req.user.role === 'SubAdmin' && status) {
      complaint.status = status;
    }

    await complaint.save();
    res.json({ message: 'Complaint updated successfully', complaint });
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.id });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    if (complaint.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this complaint' });
    }

    await complaint.deleteOne();
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Fetch All Complaints for SubAdmins
const getAllComplaintsForSubAdmin = async (req, res) => {
  try {
    // Ensure only SubAdmins can access
    if (req.user.role !== 'SubAdmin') {
      return res.status(403).json({ message: 'Access denied: SubAdmins only' });
    }

    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error); // Log error for debugging
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = { 
  createComplaint, 
  getComplaintById, 
  updateComplaint, 
  getUserComplaints, 
  deleteComplaint,
  getAllComplaintsForSubAdmin // Export new function
};