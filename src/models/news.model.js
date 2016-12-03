const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
    link: {
        type: String,
        required: true,
        unique: true
    },
    text: {
        type: String,
        required: true
    },
    filters: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Filter'
    }]
});

function archive(data, callback) {
    console.log('call insert');
    News.collection.insert(data, (err, docs) => {
        callback(err, docs);
    });
}

const News = module.exports = mongoose.model('News', newsSchema);

module.exports = {
    archive
};
