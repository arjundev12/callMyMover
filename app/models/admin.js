const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const adminSchema = Schema({
  email: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true,
    default: ''
  },
  type: {
    type: String,
    enum: ['superadmin', 'admin', 'subadmin'],
    default: 'admin',
    trim: true
  },
  token: {
    type: String
  },
  Status: {
    type: String,
    enum: ['active', 'pending'],
    default: 'active'
  },
  isProfileCompleted: {
    type: Boolean,
    default: false
  },
  emailVerification: {
    type: Boolean,
    default: false
  },
  Permissions: {
    type: { any: [Schema.Types.Mixed] }
  },
},
  {
    versionKey: false,
    timestamps: true
  });
// // Method to set salt and hash the password for a user 
// userSchema.methods.setPassword = function(password) { 

//   // Creating a unique salt for a particular user 
//      this.salt = crypto.randomBytes(16).toString('hex'); 

//      // Hashing user's salt and password with 1000 iterations, 

//      this.hash = crypto.pbkdf2Sync(password, this.salt,  
//      1000, 64, `sha512`).toString(`hex`); 
//  }; 

//  // Method to check the entered password is correct or not 
//  userSchema.methods.validPassword = function(password) { 
//      var hash = crypto.pbkdf2Sync(password,  
//      this.salt, 1000, 64, `sha512`).toString(`hex`); 
//      return this.hash === hash; 
//  }; 

const User = mongoose.model('admin', adminSchema);
module.exports = User;