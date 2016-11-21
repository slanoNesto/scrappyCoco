const mongoose = require('mongoose');
const helpers = require('../services/helpers.service');

const filterSchema = mongoose.Schema({
    name: {
        type: String,
        matchingIndex: Number,
        required: true,
        unique: true
    }
});

function getAllFilters(callback) {
    Filter.find(callback);
}

function getFilters(ids, callback) {
    if (ids) {
        //filter the valid ids and map them to mongoose objectId's
        let idsMapped = ids
            .filter((item) => mongoose.Types.ObjectId.isValid(item))
            .map((item) => mongoose.Types.ObjectId(item));
        let query = {
            '_id': { $in: idsMapped }
        };
        Filter.find(query, callback);
    } else {
        Filter.find(callback);
    }
}

filterSchema.methods.toJSON = function () {
    let filter = this.toObject();
    delete filter.matchingIndex;

    return filter;
};

const Filter = module.exports = mongoose.model('Filter', filterSchema);

module.exports = {
    getAllFilters,
    getFilters
};
