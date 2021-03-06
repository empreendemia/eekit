/** App
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-09
 *
 * @description : www da Empreendemia 3
 */

var express = require('express'),
    config  = require('./config.js'),
    cluster = require('cluster');

if (cluster.isMaster) {
    cluster.on('disconnect', cluster.fork);

    for (i = 0; i < require('os').cpus().length; i = i + 1) {
        cluster.fork();
    }
} else {
    var app = module.exports = express();

    /*  Configurando o server */
    app.configure(function () {
        "use strict";

        app.use(express.bodyParser());
        app.use(express.methodOverride());

        /* Serve a pasta public */
        app.use('/js', express.static('public/js'));
        app.use('/css', express.static('public/css'));
        app.use('/images', express.static('public/images'));
        app.use('/template', express.static('public/template'));

        /* caso seja ambiente de produção, esconder erros */
        if (config.host.debuglevel === 0) {
            app.use(express.errorHandler({ dumpExceptions: true }));
        }

        app.use(app.router);
    });

    /*  index.ejs */
    app.get('/*', function (request, response) {
        "use strict";
        response.render('../view/index.ejs', {config : config});
    });

    /*  Métodos para dev e teste */
    app.get('/ping', function (request, response) {
        "use strict";
        response.header('Access-Control-Allow-Origin', '*');
        response.send(true);
    });

    app.get('/version', function (request, response) {
        "use strict";

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        var fs = require('fs'), regexm;

        fs.readFile('changelog.md', 'utf8', function(error, data) {
            if (error) response.send({error : error});
            else {
                regexm = data.match(/\#{2}\s*([0-9]+\.[0-9]+\.?[0-9]?)\s*(\((.*)\))?/);
                response.send({ version : regexm[1], date : regexm[3] });
            }
        });
    });

    app.get('/status', function (request, response) {
        "use strict";
        response.header('Access-Control-Allow-Origin', '*');
        response.send(true);
    });

    /*  Métodos para dev e teste */
    app.get('/config', function (request, response) {
        "use strict";

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        var result = {services : {}};
        for (var i in config.services) {
            result.services[i] = {
                host : config.services[i].url,
                port : config.services[i].port
            };
        }
        response.send(result);
    });

    setInterval(function () {
        'use strict';

        if (process.memoryUsage().heapUsed > 150000000) {
            process.exit();
        }
    }, 30000);

    /*  Ativando o server */
    app.listen(config.host.port);
}
