var resolver = require('../libs/fileResolver');

exports.post=function(req, res) {
    resolver.removeCurrents(req.body.images, req.body.component, res);
};