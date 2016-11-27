var resolver = require('../libs/fileResolver');

exports.get = function(req, res) {
    resolver.componentsList(res);
};