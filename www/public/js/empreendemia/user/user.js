/** user
 *
 * @autor : Rafael Erthal
 * @since : 2012-10
 *
 * @description : controlador de seção de usuário
 */
empreendemia.user = {
    auth : function (cb) {
        var www_token = getCookie('token');
        if (www_token) {
            empreendemia.ajax.get({
                url : 'http://' + empreendemia.config.services.auth.host + ':' + empreendemia.config.services.auth.port + '/validate',
                data : {
                    secret : empreendemia.config.services.www.secret,
                    token  : www_token
                }
            }, function (data) {
                var i,j;
                if (data && data.user && data.user.auths) {
                    for (i in data.user.auths) {
                        for (j in data.user.auths[i].tokens) {
                            if ((new Date() - new Date(data.user.auths[i].tokens[j].dateUpdated))/(1000*60*60*24) < 30) {
                                empreendemia.config.services[data.user.auths[i].service].token = data.user.auths[i].tokens[j].token;
                            }
                        }
                    }
                }
                cb();
            });
        } else {
            cb();
        }
    },

    serviceLogin : function (service, cb) {
        var www_token = getCookie('token');
        if (www_token) {
            empreendemia.ajax.post({
                url : 'http://' + empreendemia.config.services.auth.host + ':' + empreendemia.config.services.auth.port + '/service/' + service + '/auth',
                data : {
                    secret : empreendemia.config.services.www.secret,
                    token  : www_token
                }
            }, function (data) {
                empreendemia.config.services[service].token = data.token;
                cb(empreendemia.config.services[service].token);
            });
        } else {
            cb();
        }
    },

    login : function () {
        empreendemia.apps.open({
            app   : 'ee',
            route : '/login',
            open  : function (tool) {
                tool.open();
                empreendemia.apps.render(tool);
            },
            close : function (params) {
                if (params && params.token) {
                    if (params.remindme) {
                        setCookie('token', params.token, 30);
                    } else {
                        setCookie('token', params.token, 1);
                    }
                    empreendemia.user.auth(function () {
                        empreendemia.load();
                    });
                }
            }
        });
    },

    signup : function () {
        empreendemia.apps.open({
            app   : 'ee',
            route : '/cadastro',
            open  : function (tool) {
                tool.open();
                empreendemia.apps.render(tool);
            },
            close : function (params) {
                if (params && params.token) {
                    if (params.remindme) {
                        setCookie('token', params.token, 30);
                    } else {
                        setCookie('token', params.token, 1);
                    }
                    empreendemia.user.auth(function () {
                        empreendemia.user.serviceLogin('profiles', function (token) {
                            params.profile.token = token;
                            empreendemia.ajax.post({
                                url : 'http://' + empreendemia.config.services.profiles.host + ':' + empreendemia   .config.services.profiles.port + '/profile',
                                data : params.profile
                            }, function () {
                                empreendemia.routes.set('ee/usuario-cadastrado');
                                empreendemia.load();
                            });
                        });
                    });
                }
            }
        });
    },

    logout : function () {
        var www_token = getCookie('token');
        empreendemia.ajax.post({
            url : 'http://' + empreendemia.config.services.auth.host + ':' + empreendemia.config.services.auth.port + '/user/logout',
            data : {
                secret : empreendemia.config.services.www.secret,
                token  : www_token
            }
        }, function (data) {
            var i;
            setCookie('token', null, 0);
            setCookie('remindme', null, 0);
            for (i in empreendemia.config.services) {
                empreendemia.config.services[i].token = undefined;
            }
            empreendemia.routes.set('ee/');
            empreendemia.load();
        });
    },

    profile : function (cb) {
        empreendemia.ajax.get({
            url : 'http://' + empreendemia.config.services.profiles.host + ':' + empreendemia.config.services.profiles.port + '/profile',
            data : {
                token : empreendemia.config.services.profiles.token
            }
        }, function (response) {
            if (response && !response.error) {
                if (getCookie('remindme')) {
                    setCookie('token', getCookie('token'), 30);
                } else {
                    setCookie('token', getCookie('token'), 1);
                }
                cb(response.profile);
            } else {
                cb(null);
            }
        });
    },

    apps : function (cb) {
        empreendemia.ajax.get({
            url : 'http://' + empreendemia.config.services.apps.host + ':' + empreendemia.config.services.apps.port + '/apps'
        }, function (response) {
            if (response && !response.error) {
                cb(response.apps);
            } else {
                cb(null);
            }
        });
    },

    feedback : function () {
        empreendemia.apps.open({
            app   : 'ee',
            route : '/feedback',
            open  : function (tool) {
                tool.open({
                    user : getCookie('id'),
                    events : empreendemia.tracker.events,
                    html : document.body.innerHTML
                });
                empreendemia.apps.render(tool);
            }
        });
    }
};