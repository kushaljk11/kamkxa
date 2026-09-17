const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Never return passwordHash by default
    },
    avatar: {
      type: String,
      default: '',
    },
    timezone: {
      type: String,
      default: 'UTC',
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
      defaultReminderMinutes: {
        type: Number,
        default: 30,
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      whatsappNotifications: {
        type: Boolean,
        default: false,
      },
    },
    resetPasswordToken: {
      type: String,
      default: null,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare candidate password with stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.passwordHash) {
    throw new Error('Password hash not loaded for comparison');
  }
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Generate and hash password reset token
userSchema.methods.generatePasswordResetToken = function () {
  const crypto = require('crypto');
  // Generate random 32-byte token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token and save to user
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set expiration to 1 hour
  this.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
