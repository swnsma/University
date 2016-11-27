var resolver = require('../libs/fileResolver');

exports.post=function(req, res) {
    resolver.acceptImage(req.body.image, req.body.component);
    res.end(JSON.stringify({result: true}));
};