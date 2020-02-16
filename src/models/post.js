const mongoose = require('mongoose');
const _v = require('validator');


const postSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 10,
    required: true,
  },
  content: {  
    type: String,
    minlength: 20,
    required: true,
  },
  author: {
    type: String,
    required: true,
    validate: {
      validator: (value) => _v.isEmail(value),
    },
  },
  phone: {
    type: String,
    validate: {
      validator: (value) => _v.isMobilePhone(value, 'pl-PL'),
    }
  },
  price: {
    type: Number,
    validate: {
      validator: (value) => {
        return (value >= 0 && ((value * 100 % 1) === 0))
      }
    }
  },
  localization: {
    type: String,
    validate: (value) => value.length > 0,
  },
  imageUrl: {
    type: String,
    validate: {
      validator: (value) => _v.isURL(value),
    },
  },
  status: {
    type: String,
    required: true,
    default: 'published',
    valdate: {
      validator: (value) => {
        const properValues = ['published', 'draft', 'closed'];
        return properValues.includes(value);
      },
    },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Post', postSchema);