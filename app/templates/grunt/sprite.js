'use strict';
var config = require('../initConfig'),
    fs = require('fs'),
    path = require('path');

module.exports = function () {
  var sprites = {};
  
  var getFolders = function (dir) {
    return fs.readdirSync(dir)
      .filter(function (file){
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
  };

  var folders = getFolders(config.config.app + '/sprites');

  folders.forEach(function (name) {
    sprites.name = {
      src: config.config.app + '/sprites/' + name + '/*.png',
      dest: config.config.app + '/images/' + name + '.png',
      destCss: config.config.app + '/styles/sprites/_' + name + '.scss',
      cssTemplate: 'templates/sprite-template.mustache',
      imgPath: '../images/' + name + '.png',
      cssOpts: {
        prefix: name
      }
    };
  });

  return sprites;
};
