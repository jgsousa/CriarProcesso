var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
var mountFolder = function(connect, dir){
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt){
    require('load-grunt-tasks')(grunt, {scope: 'devDependencies' });

    grunt.initConfig({
        open:{
            dev: {
                path: 'http://localhost:9010',
                app: 'Google Chrome'
            }
        },

        watch:{
            scripts:{
                files: ['**/*.js'],
                options:{
                    livereload:true,
                    interval:10000
                }
          }
        },
        connect: {
            server: {
                options: {
                    port: 9010,
                    hostname: 'localhost',
                    middleware: function (connect, options){
                        return [
                            proxySnippet,
                            connect.static(options.base[0]),
                            connect.directory(options.base[0]),
                        ]
                    }
                },
                proxies:[
                    {
                        context: '/sap/opu/odata',
                        host: 'sapretail.deloitte.pt',
                        port: '8080',
                        https: false
                    }
                ]
            }
        }
    });

    grunt.registerTask('default',[
        'configureProxies:server',
        'connect',
        'open:dev',
        'watch'
    ]);

}

