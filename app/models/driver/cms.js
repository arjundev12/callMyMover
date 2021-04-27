const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const cmsSchema = Schema({
    type: {
        type: String,
        enum: ['about', 'term', 'policies']
    },
    title: {
        type: String,
        default: ""
    },
    content: {
        type: String,
        default: ""
    },
},{timestamps: true, versionKey: false, });
const CMSModel = mongoose.model('cms', cmsSchema);
module.exports = CMSModel;