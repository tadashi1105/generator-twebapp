/*global describe, beforeEach, it*/
'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('twebapp:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(__dirname, '.tmp'))
      .withOptions({ 'skip-install': true })
      .withPrompt({
        someOption: true
      })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      '.jshintrc',
      'Gruntfile.js',
      'app/favicon.ico',
      'app/index.html',
      'app/robots.txt',
      'bower.json',
      'package.json'
    ]);
  });
});
