const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  notificationType: {
    type: String,
    enum: ['email', 'sms']
  },
  email :{
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false
  },
  text: {
    type: String,
    required: false 
  }

});

module.exports = mongoose.model('User', userSchema);