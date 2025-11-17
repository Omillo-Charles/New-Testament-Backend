import { validationResult } from 'express-validator';
import Contact from '../models/Contact.js';
import config from '../config/env.js';
import { sendUserConfirmationEmail, sendAdminNotificationEmail } from '../utils/nodemailer.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { fullName, email, phone, subject, message } = req.body;

    // Get IP address and user agent
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    // Create contact entry
    const contact = await Contact.create({
      fullName,
      email,
      phone,
      subject,
      message,
      ipAddress,
      userAgent
    });

    // Send confirmation email to user
    await sendUserConfirmationEmail(contact);

    // Send notification email to admin
    await sendAdminNotificationEmail(contact);

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      data: {
        id: contact._id,
        fullName: contact.fullName,
        email: contact.email,
        subject: contact.subjectDisplay,
        createdAt: contact.createdAt
      }
    });

  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while submitting your message. Please try again later.',
      error: config.server.env === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all contacts (Admin)
// @route   GET /api/contact
// @access  Private
export const getAllContacts = async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;

    const query = status ? { status } : {};
    const skip = (page - 1) * limit;

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: contacts
    });

  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: config.server.env === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single contact (Admin)
// @route   GET /api/contact/:id
// @access  Private
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Mark as read if it's pending
    if (contact.status === 'pending') {
      await contact.markAsRead();
    }

    res.status(200).json({
      success: true,
      data: contact
    });

  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact',
      error: config.server.env === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update contact status (Admin)
// @route   PATCH /api/contact/:id/status
// @access  Private
export const updateContactStatus = async (req, res) => {
  try {
    const { status, responseNote, respondedBy } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    if (status === 'responded') {
      await contact.markAsResponded(respondedBy, responseNote);
    } else {
      contact.status = status;
      if (responseNote) contact.responseNote = responseNote;
      await contact.save();
    }

    res.status(200).json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact
    });

  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact status',
      error: config.server.env === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete contact (Admin)
// @route   DELETE /api/contact/:id
// @access  Private
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting contact',
      error: config.server.env === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get contact statistics (Admin)
// @route   GET /api/contact/stats
// @access  Private
export const getContactStats = async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const subjectStats = await Contact.aggregate([
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const total = await Contact.countDocuments();
    const recentCount = await Contact.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        recentCount,
        byStatus: stats,
        bySubject: subjectStats
      }
    });

  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: config.server.env === 'development' ? error.message : undefined
    });
  }
};
