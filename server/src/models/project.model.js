const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    color: {
      type: String,
      default: '#6366F1',
      match: [/^#([0-9A-F]{3}){1,2}$/i, 'Please provide a valid hex color code'],
    },
    icon: {
      type: String,
      default: 'FolderKanban',
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user projects
projectSchema.index({ user: 1, isArchived: 1 });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
