var fs = require('fs');
var path = require('path');
var root = path.dirname(process.mainModule.filename);
var conf = require(root+'/config');

module.exports = function(image, component) {
    fs.unlinkSync(path.join(conf.get('folder'), conf.get('base'), component) + '/' + image);
    fs.renameSync(path.join(conf.get('folder'), conf.get('current'), component) + '/' + image,
        path.join(conf.get('folder'), conf.get('base'), component) + '/' + image);
};