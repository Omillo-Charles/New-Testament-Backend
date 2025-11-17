import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    phone: {
      type: String,
      trim: true,
      match: [
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        'Please provide a valid phone number'
      ]
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      enum: {
        values: [
          'prayer',
          'salvation',
          'ministry',
          'counseling',
          'church-planting',
          'general',
          'other'
        ],
        message: 'Please select a valid subject'
      }
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    status: {
      type: String,
      enum: ['pending', 'read', 'responded', 'archived'],
      default: 'pending'
    },
    ipAddress: {
      type: String,
      trim: true
    },
    userAgent: {
      type: String,
      trim: true
    },
    responseNote: {
      type: String,
      trim: true
    },
    respondedAt: {
      type: Date
    },
    respondedBy: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ subject: 1 });

// Virtual for subject display name
contactSchema.virtual('subjectDisplay').get(function () {
  const subjectMap = {
    prayer: 'Prayer Request',
    salvation: 'Salvation & Baptism',
    ministry: 'Ministry Opportunities',
    counseling: 'Counseling',
    'church-planting': 'Church Planting',
    general: 'General Inquiry',
    other: 'Other'
  };
  return subjectMap[this.subject] || this.subject;
});

// Method to mark as read
contactSchema.methods.markAsRead = function () {
  this.status = 'read';
  return this.save();
};

// Method to mark as responded
contactSchema.methods.markAsResponded = function (respondedBy, note) {
  this.status = 'responded';
  this.respondedAt = new Date();
  this.respondedBy = respondedBy;
  if (note) {
    this.responseNote = note;
  }
  return this.save();
};

// Static method to get contacts by status
contactSchema.statics.getByStatus = function (status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to get recent contacts
contactSchema.statics.getRecent = function (limit = 10) {
  return this.find().sort({ createdAt: -1 }).limit(limit);
};

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
