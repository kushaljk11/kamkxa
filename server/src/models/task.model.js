const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Subtask title is required'],
      trim: true,
      maxlength: [200, 'Subtask title cannot exceed 200 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: true,
    timestamps: false,
  }
);

const recurrenceSchema = new mongoose.Schema(
  {
    frequency: {
      type: String,
      enum: ['NONE', 'DAILY', 'WEEKDAYS', 'WEEKLY', 'MONTHLY', 'CUSTOM'],
      default: 'NONE',
    },
    interval: {
      type: Number,
      default: 1,
      min: 1,
    },
    daysOfWeek: {
      type: [Number], // 0 = Sunday, 1 = Monday, etc.
      default: [],
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must belong to a user'],
      index: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Task title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'TODO',
      index: true,
    },
    priority: {
      type: String,
      enum: ['URGENT', 'HIGH', 'MEDIUM', 'LOW'],
      default: 'MEDIUM',
      index: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    dueDate: {
      type: Date,
      default: null,
      index: true,
    },
    estimatedMinutes: {
      type: Number,
      default: null,
      min: [1, 'Estimated duration must be at least 1 minute'],
    },
    tags: {
      type: [String],
      default: [],
      set: (tags) => (Array.isArray(tags) ? tags.map((t) => t.trim().toLowerCase()) : []),
    },
    subtasks: {
      type: [subtaskSchema],
      default: [],
    },
    recurrence: {
      type: recurrenceSchema,
      default: () => ({ frequency: 'NONE', interval: 1, daysOfWeek: [], endDate: null }),
    },
    isInbox: {
      type: Boolean,
      default: true,
      index: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-set isInbox and completedAt before saving
taskSchema.pre('save', function (next) {
  // If task has an assigned project, it is no longer an inbox task
  if (this.project) {
    this.isInbox = false;
  }

  // Handle completedAt timestamp
  if (this.isModified('status')) {
    if (this.status === 'COMPLETED' && !this.completedAt) {
      this.completedAt = new Date();
    } else if (this.status !== 'COMPLETED') {
      this.completedAt = null;
    }
  }

  next();
});

// Compound Indexes for fast queries
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, project: 1 });
taskSchema.index({ user: 1, isInbox: 1 });
taskSchema.index({ user: 1, createdAt: -1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
