var resolver = require('../libs/fileResolver');

exports.post=function(req, res) {
    resolver.createFolder(req.body.path, res);
};