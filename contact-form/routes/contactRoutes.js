import express from 'express';
import { body } from 'express-validator';
import {
  submitContactForm,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// Validation middleware for contact form submission
const contactValidation = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Full name can only contain letters, spaces, hyphens, and apostrophes'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
    .withMessage('Please provide a valid phone number'),

  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isIn(['prayer', 'salvation', 'ministry', 'counseling', 'church-planting', 'general', 'other'])
    .withMessage('Please select a valid subject'),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
];

// Validation middleware for status update
const statusUpdateValidation = [
  body('status')
    .optional()
    .isIn(['pending', 'read', 'responded', 'archived'])
    .withMessage('Invalid status value'),

  body('responseNote')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Response note cannot exceed 1000 characters'),

  body('respondedBy')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Responded by cannot exceed 100 characters')
];

// Public Routes
// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', contactValidation, validate, submitContactForm);

// Admin Routes - Protected with authentication
// @route   GET /api/contact/stats
// @desc    Get contact statistics
// @access  Private (Admin only)
router.get('/stats', protect, authorize('admin', 'superadmin'), getContactStats);

// @route   GET /api/contact
// @desc    Get all contacts
// @access  Private (Admin only)
router.get('/', protect, authorize('admin', 'superadmin'), getAllContacts);

// @route   GET /api/contact/:id
// @desc    Get single contact by ID
// @access  Private (Admin only)
router.get('/:id', protect, authorize('admin', 'superadmin'), getContactById);

// @route   PATCH /api/contact/:id/status
// @desc    Update contact status
// @access  Private (Admin only)
router.patch('/:id/status', protect, authorize('admin', 'superadmin'), statusUpdateValidation, validate, updateContactStatus);

// @route   DELETE /api/contact/:id
// @desc    Delete contact
// @access  Private (Superadmin only)
router.delete('/:id', protect, authorize('superadmin'), deleteContact);

export default router;
