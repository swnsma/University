var resolver = require('../libs/fileResolver');

exports.post=function(req, res) {
    resolver.removeFolder(req.body.path, res);
};