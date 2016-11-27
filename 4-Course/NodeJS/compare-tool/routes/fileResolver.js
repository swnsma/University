var resolver = require('../libs/fileResolver');

exports.post=function(req, res) {
    resolver.imagesList(req, res);
};