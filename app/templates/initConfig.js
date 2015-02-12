'use strict';

// Define the configuration for all the tasks
module.exports = {

  // Project settings
  // Configurable paths
  config: {
    app: 'app',
    dist: 'dist'
  },

  // Watches files for changes and runs tasks based on the changed files
  watch: {
    bower: {
      files: ['bower.json'],
      tasks: ['wiredep']
    },<% if (coffee) { %>
    coffee: {
      files: ['<%%= config.app %>/scripts/{,*/}*.{coffee,litcoffee,coffee.md}'],
      tasks: ['coffee:dist']
    },
    coffeeTest: {
      files: ['test/spec/{,*/}*.{coffee,litcoffee,coffee.md}'],
      tasks: ['coffee:test', 'test:watch']
    },<% } else { %>
    js: {
      files: ['<%%= config.app %>/scripts/{,*/}*.js'],
      tasks: ['jshint'],
      options: {
        livereload: true
      }
    },
    jstest: {
      files: ['test/spec/{,*/}*.js'],
      tasks: ['test:watch']
    },<% } %>
    gruntfile: {
      files: ['Gruntfile.js']
    },<% if (includeSass) { %>
    sass: {
      files: ['<%%= config.app %>/styles/{,*/}*.{scss,sass}'],
      tasks: ['sass:server', 'autoprefixer']
    },<% } %>
    styles: {
      files: ['<%%= config.app %>/styles/{,*/}*.css'],
      tasks: ['newer:copy:styles', 'autoprefixer']
    },
    livereload: {
      options: {
        livereload: '<%%= connect.options.livereload %>'
      },
      files: [
        '<%%= config.app %>/{,*/}*.html',
        '.tmp/styles/{,*/}*.css',<% if (coffee) { %>
        '.tmp/scripts/{,*/}*.js',<% } %>
        '<%%= config.app %>/images/{,*/}*'
      ]
    }
  },

  // The actual grunt server settings
  connect: {
    options: {
      port: 9000,
      open: true,
      livereload: 35729,
      // Change this to '0.0.0.0' to access the server from outside
      hostname: 'localhost'
    },
    livereload: {
      options: {
        middleware: function(connect) {
          return [
            connect.static('.tmp'),
            connect().use('/bower_components', connect.static('./bower_components')),
            connect.static(config.app)
          ];
        }
      }
    },
    test: {
      options: {
        open: false,
        port: 9001,
        middleware: function(connect) {
          return [
            connect.static('.tmp'),
            connect.static('test'),
            connect().use('/bower_components', connect.static('./bower_components')),
            connect.static(config.app)
          ];
        }
      }
    },
    dist: {
      options: {
        base: '<%%= config.dist %>',
        livereload: false
      }
    }
  },

  // Empties folders to start fresh
  clean: {
    dist: {
      files: [{
        dot: true,
        src: [
          '.tmp',
          '<%%= config.dist %>/*',
          '!<%%= config.dist %>/.git*'
        ]
      }]
    },
    server: '.tmp'
  },

  // Make sure code styles are up to par and there are no obvious mistakes
  jshint: {
    options: {
      jshintrc: '.jshintrc',
      reporter: require('jshint-stylish')
    },
    all: [
      'Gruntfile.js',
      '<%%= config.app %>/scripts/{,*/}*.js',
      '!<%%= config.app %>/scripts/vendor/*',
      'test/spec/{,*/}*.js'
    ]
  },<% if (testFramework === 'mocha') { %>

  // Mocha testing framework configuration options
  mocha: {
    all: {
      options: {
        run: true,
        urls: ['http://<%%= connect.test.options.hostname %>:<%%= connect.test.options.port %>/index.html']
      }
    }
  },<% } else if (testFramework === 'jasmine') { %>

  // Jasmine testing framework configuration options
  jasmine: {
    all: {
      options: {
        specs: 'test/spec/{,*/}*.js'
      }
    }
  },<% } %><% if (coffee) { %>

  // Compiles CoffeeScript to JavaScript
  coffee: {
    dist: {
      files: [{
        expand: true,
        cwd: '<%%= config.app %>/scripts',
        src: '{,*/}*.{coffee,litcoffee,coffee.md}',
        dest: '.tmp/scripts',
        ext: '.js'
      }]
    },
    test: {
      files: [{
        expand: true,
        cwd: 'test/spec',
        src: '{,*/}*.{coffee,litcoffee,coffee.md}',
        dest: '.tmp/spec',
        ext: '.js'
      }]
    }
  },<% } %><% if (includeSass) { %>

  // Compiles Sass to CSS and generates necessary files if requested
  sass: {
    options: {<% if (includeLibSass) { %>
      sourceMap: true,
      includePaths: ['bower_components']
      <% } else { %>
      loadPath: 'bower_components'<% if (bundleExec) { %>,
      bundleExec: true<% } %>
    <% } %>},
    dist: {
      files: [{
        expand: true,
        cwd: '<%%= config.app %>/styles',
        src: ['*.{scss,sass}'],
        dest: '.tmp/styles',
        ext: '.css'
      }]
    },
    server: {
      files: [{
        expand: true,
        cwd: '<%%= config.app %>/styles',
        src: ['*.{scss,sass}'],
        dest: '.tmp/styles',
        ext: '.css'
      }]
    }
  },<% } %>

  // Add vendor prefixed styles
  autoprefixer: {
    options: {
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']<% if (includeSass) { %>,
      map: {
        prev: '.tmp/styles/'
      }
      <% } %>
    },
    dist: {
      files: [{
        expand: true,
        cwd: '.tmp/styles/',
        src: '{,*/}*.css',
        dest: '.tmp/styles/'
      }]
    }
  },

  // Automatically inject Bower components into the HTML file
  wiredep: {
    app: {
      ignorePath: /^<%= config.app %>\/|\.\.\//,
      src: ['<%%= config.app %>/{,*/}*.html']<% if (includeBootstrap) { %>,<% if (includeSass) { %>
      exclude: ['bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js']<% } else { %>
      exclude: ['bower_components/bootstrap/dist/js/bootstrap.js']<% } } %>
    }<% if (includeSass) { %>,
    sass: {
      src: ['<%%= config.app %>/styles/{,*/}*.{scss,sass}'],
      ignorePath: /(\.\.\/){1,2}bower_components\//
    }<% } %>
  },

  // Renames files for browser caching purposes
  rev: {
    dist: {
      files: {
        src: [
          '<%%= config.dist %>/scripts/{,*/}*.js',
          '<%%= config.dist %>/styles/{,*/}*.css',
          '<%%= config.dist %>/images/{,*/}*.*',
          '<%%= config.dist %>/styles/fonts/{,*/}*.*',
          '<%%= config.dist %>/*.{ico,png}'
        ]
      }
    }
  },

  // Reads HTML for usemin blocks to enable smart builds that automatically
  // concat, minify and revision files. Creates configurations in memory so
  // additional tasks can operate on them
  useminPrepare: {
    options: {
      dest: '<%%= config.dist %>'
    },
    html: '<%%= config.app %>/index.html'
  },

  // Performs rewrites based on rev and the useminPrepare configuration
  usemin: {
    options: {
      assetsDirs: [
        '<%%= config.dist %>',
        '<%%= config.dist %>/images',
        '<%%= config.dist %>/styles',
        '<%%= config.dist %>/styles/fonts'
      ]
    },
    html: ['<%%= config.dist %>/{,*/}*.html'],
    css: ['<%%= config.dist %>/styles/{,*/}*.css']
  },

  // The following *-min tasks produce minified files in the dist folder
  imagemin: {
    dist: {
      files: [{
        expand: true,
        cwd: '<%%= config.app %>/images',
        src: '{,*/}*.{gif,jpeg,jpg,png}',
        dest: '<%%= config.dist %>/images'
      }]
    }
  },

  svgmin: {
    dist: {
      files: [{
        expand: true,
        cwd: '<%%= config.app %>/images',
        src: '{,*/}*.svg',
        dest: '<%%= config.dist %>/images'
      }]
    }
  },

  htmlmin: {
    dist: {
      options: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        removeAttributeQuotes: true,
        removeCommentsFromCDATA: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true,
        // true would impact styles with attribute selectors
        removeRedundantAttributes: false,
        useShortDoctype: true
      },
      files: [{
        expand: true,
        cwd: '<%%= config.dist %>',
        src: '{,*/}*.html',
        dest: '<%%= config.dist %>'
      }]
    }
  },

  // By default, your `index.html`'s <!-- Usemin block --> will take care
  // of minification. These next options are pre-configured if you do not
  // wish to use the Usemin blocks.
  // cssmin: {
  //   dist: {
  //     files: {
  //       '<%%= config.dist %>/styles/main.css': [
  //         '.tmp/styles/{,*/}*.css',
  //         '<%%= config.app %>/styles/{,*/}*.css'
  //       ]
  //     }
  //   }
  // },
  // uglify: {
  //   dist: {
  //     files: {
  //       '<%%= config.dist %>/scripts/scripts.js': [
  //         '<%%= config.dist %>/scripts/scripts.js'
  //       ]
  //     }
  //   }
  // },
  // concat: {
  //   dist: {}
  // },

  // Copies remaining files to places other tasks can use
  copy: {
    dist: {
      files: [{
        expand: true,
        dot: true,
        cwd: '<%%= config.app %>',
        dest: '<%%= config.dist %>',
        src: [
          '*.{ico,png,txt,md}',
          'images/{,*/}*.webp',
          '{,*/}*.html',
          'styles/fonts/{,*/}*.*'
        ]
      }, {
        src: 'node_modules/apache-server-configs/dist/.htaccess',
        dest: '<%%= config.dist %>/.htaccess'
      }<% if (includeBootstrap) { %>, {
        expand: true,
        dot: true,
        cwd: '<% if (includeSass) {
            %>bower_components/bootstrap-sass-official/assets/fonts/<%
          } else {
            %>bower_components/bootstrap/dist/fonts/<%
          } %>',
        src: '**',
        dest: '<%%= config.dist %>/styles/fonts/'
      },<% } %> {
        expand: true,
        dot: true,
        cwd: 'bower_components/fontawesome/fonts/',
        src: '**',
        dest: '<%%= config.dist %>/styles/fonts/fontawesome/'
      }]
    },
    styles: {
      expand: true,
      dot: true,
      cwd: '<%%= config.app %>/styles',
      dest: '.tmp/styles/',
      src: '{,*/}*.css'
    }
  },<% if (includeModernizr) { %>

  // Generates a custom Modernizr build that includes only the tests you
  // reference in your app
  modernizr: {
    dist: {
      devFile: 'bower_components/modernizr/modernizr.js',
      outputFile: '<%%= config.dist %>/scripts/vendor/modernizr.js',
      files: {
        src: [
          '<%%= config.dist %>/scripts/{,*/}*.js',
          '<%%= config.dist %>/styles/{,*/}*.css',
          '!<%%= config.dist %>/scripts/vendor/*'
        ]
      },
      uglify: true
    }
  },<% } %>

  // Run some tasks in parallel to speed up build process
  concurrent: {
    server: [<% if (includeSass) { %>
      'sass:server',<% } if (coffee) {  %>
      'coffee:dist',<% } %>
      'copy:styles'
    ],
    test: [<% if (coffee) { %>
      'coffee',<% } %>
      'copy:styles'
    ],
    dist: [<% if (coffee) { %>
      'coffee',<% } if (includeSass) { %>
      'sass',<% } %>
      'copy:styles',
      'imagemin',
      'svgmin'
    ]
  },

  replace: {
    path: {
      src: ['dist/styles/{,*/}*.css'],
      overwrite: true,
      replacements: [{
        // Fontawesome
        from: '../fonts/fontawesome-',
        to: 'fonts/fontawesome/fontawesome-'
      }<% if (includeBootstrap) { %>, {
        // Bootstrap
        from: '<% if (includeSass) {
            %>../bower_components/bootstrap-sass-official/assets/fonts/bootstrap/<%
          } else {
            %>bower_components/bootstrap/dist/fonts/bootstrap/<%
          } %>',
        to: 'fonts/bootstrap/'
      }<% } %>]
    }
  }
};
