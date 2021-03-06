const cache = require('memory-cache');
const CACHE_DURATION = require('../config').cacheDuration;

function containsFilter(text, filters, allFilters) {
    let filtersMatched = [];
    //iterate through passed (target) filters and check if string contains it
    for (let i = filters.length - 1; i >= 0; i--) {

        let filter = filters[i].toObject();

        //if matchingIndex key, use the word root for matching, otherwise use the whole word
        let matchingString = filter.matchingIndex ? filter.name.substring(0, filter.matchingIndex) : filter.name;

        //if has a match
        if (text.indexOf(matchingString) > -1) {
            //found a match. Iterate through all filters to embed references to all filters it matches and return
            for (let i = 0; i < allFilters.length; i++) {
                let filter = allFilters[i].toObject();
                let matchingString = filter.matchingIndex ? filter.name.substring(0, filter.matchingIndex) : filter.name;
                if (text.indexOf(matchingString) > -1) {
                    filtersMatched.push(filter._id);
                }
            }
            return filtersMatched;
        }
    }
    return false;
}

function cacheIt(cacheKey, data) {
    if (!data || !data.length) return;
    cache.put(cacheKey, data, CACHE_DURATION);
}

module.exports = {
    containsFilter,
    cacheIt
};
