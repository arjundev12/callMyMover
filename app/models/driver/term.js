const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto=require('crypto');
const termSchema = Schema({
  title: {
    type: String,
    default: ""
  },
  content: {
    type: String,
    default: ""
  },
 },
  {
    timestamps: true

  });
const Term = mongoose.model('Term', termSchema);
module.exports = Term;