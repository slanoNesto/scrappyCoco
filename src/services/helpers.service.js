function containsFilter(text, filters) {
    let filtersMatched = [];
    for (let i = filters.length - 1; i >= 0; i--) {

        let filter = filters[i].toObject();

        //if matchingIndex key, use the word root for matching, otherwise use the whole word
        let matchingString = filter.matchingIndex ? filter.name.substring(0, filter.matchingIndex) : filter.name;

        if (text.indexOf(matchingString) > -1) {
            filtersMatched.push(filter._id);
        }
    }
    if (filtersMatched.length) {
        return filtersMatched;
    } else {
        return false;
    }
}

function isValidObjectId(id) {
    return id.match(/^[0-9a-fA-F]{24}$/);
}

module.exports = {
    containsFilter,
    isValidObjectId
};
