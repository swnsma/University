var fs = require('fs');
var path = require('path');
var root = path.dirname(process.mainModule.filename);
var conf = require(root+'/config');
var async = require('async');

module.exports = function(images, component, res) {
    var imgFolder = path.join(conf.get('folder'), conf.get('current'), component) +'/';
    try {
        images = JSON.parse(images);
    } catch(e) {
        res.json({result:false});
        console.log('Removing the same process failed. Invalid data.');
    }

    async.each(images, function(link, callback) {
        fs.unlink(imgFolder + link, callback);
    }, function(err) {
        if(err) {
            console.log('Failed to remove images. ');
            console.log(err);
            res.json({result:false});
        } else {
            res.json({result:true});
        }
    });
};