var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var videoSchema = new Schema({
    title: {
        type: String,
        trim: true,
    },
    thumbnail: {
        type: String,
        trim: true
    },
    video: {
        type: String,
        trim: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin"
    },
    status: {
        type: String,
        default: "active"
    },
    meta: {
        type: { any: [Schema.Types.Mixed] }
    }

}, { versionKey: false, timestamps: true });

videoSchema.plugin(mongoosePaginate);
let Videomodel = mongoose.model('video', videoSchema);
module.exports = Videomodel;