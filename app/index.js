'use strict';

var join = require('path').join;
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    // setup the test-framework property, Gruntfile template will need this
    this.option('test-framework', {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    });
    this.testFramework = this.options['test-framework'];

    this.option('coffee', {
      desc: 'Use CoffeeScript',
      type: Boolean,
      defaults: false
    });
    this.coffee = this.options.coffee;
  },

  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // welcome message
    if (!this.options['skip-welcome-message']) {
      this.log(yosay(
        'Out of the box I include HTML5 Boilerplate, jQuery, and a ' +
        'Gruntfile.js to build your app.'
      ));
    }

    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [{
        name: 'Bootstrap',
        value: 'includeBootstrap',
        checked: true
      },{
        name: 'Sass',
        value: 'includeSass',
        checked: true
      },{
        name: 'Modernizr',
        value: 'includeModernizr',
        checked: true
      }]
    }, {
      when: function (answers) {
        return answers && answers.features &&
          answers.features.indexOf('includeSass') !== -1;
      },
      type: 'confirm',
      name: 'libsass',
      value: 'includeLibSass',
      message: 'Would you like to use libsass? Read up more at \n' +
        chalk.green('https://github.com/andrew/node-sass#node-sass'),
      default: false
    }, {
      when: function (answers) {
        return answers && answers.features &&
          answers.features.indexOf('includeSass') !== -1;
      },
      type: 'confirm',
      name: 'bundle',
      value: 'bundleExec',
      message: 'Would you like to use bundleExec? Read up more at \n',
      default: false
    }];

    this.prompt(prompts, function (answers) {
      var features = answers.features;

      var hasFeature = function (feat) {
        return features && features.indexOf(feat) !== -1;
      }

      this.includeSass = hasFeature('includeSass');
      this.includeBootstrap = hasFeature('includeBootstrap');
      this.includeModernizr = hasFeature('includeModernizr');

      this.includeLibSass = answers.libsass;
      this.includeRubySass = !answers.libsass;
      if (this.includeRubySass) {
        this.bundleExec = answers.bundle;
      }

      done();
    }.bind(this));
  },

  writing: {
    gruntfile: function () {
      this.template('Gruntfile.js');
      this.template('initConfig.js');
      this.directory('grunt');
    },

    packageJSON: function () {
      this.template('_package.json', 'package.json');
    },

    git: function () {
      this.copy('gitignore', '.gitignore');
      this.copy('gitattributes', '.gitattributes');
    },

    bower: function () {
      var bower = {
        name: this._.slugify(this.appname),
        private: true,
        dependencies: {}
      };

      if (this.includeBootstrap) {
        var bs = 'bootstrap' + (this.includeSass ? '-sass-official' : '');
        bower.dependencies[bs] = "~3.3.1";
      } else {
        bower.dependencies.jquery = "~2.1.1";
      }

      if (this.includeModernizr) {
        bower.dependencies.modernizr = "~2.8.2";
      }

      this.copy('bowerrc', '.bowerrc');
      this.write('bower.json', JSON.stringify(bower, null, 2));
    },

    jshint: function () {
      this.copy('jshintrc', '.jshintrc');
    },

    editorConfig: function () {
      this.copy('editorconfig', '.editorconfig');
    },

    templates: function () {
      this.directory('templates');
      this.directory('ejs', 'app/ejs');
    },

    app: function () {
      var css = 'main.' + (this.includeSass ? 's' : '') + 'css';
      this.directory('app');
      if (this.includeSass) {
        this.directory('styles', 'app/styles');
      }
      this.mkdir('app/scripts');
      this.mkdir('app/images');
      this.mkdir('app/sprites');
      this.template(css, 'app/styles/' + css);
      this.copy('index.ejs', 'app/index.ejs');

      if (this.coffee) {
        this.copy('main.coffee', 'app/scripts/main.coffee');
      } else {
        this.copy('main.js', 'app/scripts/main.js');
      }
    }
  },

  install: function () {
    this.on('end', function () {
      this.invoke(this.options['test-framework'], {
        options: {
          'skip-message': this.options['skip-install-message'],
          'skip-install': this.options['skip-install'],
          'coffee': this.options.coffee
        }
      });

      if (!this.options['skip-install']) {
        this.installDependencies({
          skipMessage: this.options['skip-install-message'],
          skipInstall: this.options['skip-install']
        });
      }
    });
  }
});
