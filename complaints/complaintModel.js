const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    issue: {
      type: String,
      required: [true, 'Issue is required'],
    },
    subIssue: {
      type: String,
      required: [true, 'Sub-issue is required'],
    },
    selectedQuestion: {
      type: String,
      required: [true, 'Selected question is required'],
    },
    description: {
      type: String,
      required: false,
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    needsAI: {
      type: Boolean,
      default: false,
    },
    aiResolved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Solved'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);