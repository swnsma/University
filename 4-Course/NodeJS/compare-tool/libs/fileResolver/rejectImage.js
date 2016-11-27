var fs = require('fs');
var path = require('path');
var root = path.dirname(process.mainModule.filename);
var conf = require(root+'/config');
var mkdir = require('mkdirpd');

module.exports = function reject (image, component) {
    var rejectPath =  path.join(conf.get('folder'), conf.get('reject'), component);
    fs.rename(path.join(conf.get('folder'), conf.get('current'), component) + '/' + image,
        rejectPath + '/' + image, function(err) {
            if(err) {
                try {
                    mkdir.sync(rejectPath);
                }catch(err) {
                    console.log(err);
                    console.log('Can\'t create rejected images folder.');
                }
                reject(image, component);
            }
        });
};