/** Tests Finances.Category
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-10
 *
 * @description : Kit de testes do controller category do serviço finances
 */

var should = require("should"),
    api = require("./utils.js").api,
    rand = require("./utils.js").rand,
    auth = require("./utils.js").auth;

describe('POST /category', function () {
    var token;

    before(function (done) {
        auth('finances', function (newToken) {
            token = newToken;
            api.post('finances', '/company', {token : token}, function (error, data, response) {
                done();
            });
        });
    });

    it('url tem que existir', function (done) {
        api.post('finances', '/category', {}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('token inválido', function (done) {
        api.post('finances', '/category', {
            token : 'invalido',
            name : 'Nome ' + rand()
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('nome em branco', function (done) {
        api.post('finances', '/category', {
            token : token
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'ValidationError');
                done();
            }
        });
    });

    it('cadastra categoria', function (done) {
        api.post('finances', '/category', {
            token : token,
            name : 'Nome ' + rand(),
            type : 'debt'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('category')
                done();
            }
        });
    });
})

describe('GET /category/id', function () {
    var token,
        category;

    before(function (done) {
        auth('finances', function (newToken) {
            token = newToken;
            api.post('finances', '/company', {token : token}, function (error, data, response) {
                category = data.categories[0];
                done();
            });
        });
    });

    it('url tem que existir', function (done) {
        api.get('finances', '/category/id', {}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('token inválido', function (done) {
        api.get('finances', '/category/' + category._id, {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('categoria inexistente', function (done) {
        api.get('finances', '/category/inexistnte', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('pega categoria', function (done) {
        api.get('finances', '/category/' + category._id, {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('category')
                done();
            }
        });
    });

});

describe('POST /category/id/delete', function () {
    var token,
        category;

    before(function (done) {
        auth('finances', function (newToken) {
            token = newToken;
            api.post('finances', '/company', {token : token}, function (error, data, response) {
                category = data.categories[0];
                done();
            });
        });
    });

    it('url tem que existir', function (done) {
        api.post('finances', '/category/id/delete', {}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('token inválido', function (done) {
        api.post('finances', '/category/' + category._id + '/delete', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('categoria inexistente', function (done) {
        api.post('finances', '/category/inexistente/delete', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('exclui categoria', function (done) {
        api.post('finances', '/category/' + category._id + '/delete', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                api.get('finances', '/category/' + category._id, {token : token}, function (error, data, response) {
                    if (error) {
                        return done(error);
                    } else {
                        data.should.have.property('error').property('name', 'NotFoundError');
                        done();
                    }
                });
            }
        });
    });
});

describe('POST /category/id/update', function () {
    var token,
        category;

    before(function (done) {
        auth('finances', function (newToken) {
            token = newToken;
            api.post('finances', '/company', {token : token}, function (error, data, response) {
                category = data.categories[0];
                done();
            });
        });
    });

    it('url tem que existir', function (done) {
        api.post('finances', '/category/id/update', {}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('token inválido', function (done) {
        api.post('finances', '/category/' + category._id + '/update', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('categoria inexistente', function (done) {
        api.post('finances', '/category/inexistente/update', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('nome em branco', function (done) {
        api.post('finances', '/category/' + category._id + '/update', {
            token : token
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                api.get('finances', '/category/' + category._id, {token : token}, function (error, data, response) {
                    if (error) {
                        return done(error);
                    } else {
                        data.should.have.property('category').property('name', category.name);
                        done();
                    }
                });
            }
        });
    });

    it('edita categoria', function (done) {
        var newName = 'Nome' + rand()
        api.post('finances', '/category/' + category._id + '/update', {
            token : token,
            name  : newName
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                api.get('finances', '/category/' + category._id, {token : token}, function (error, data, response) {
                    if (error) {
                        return done(error);
                    } else {
                        data.should.have.property('category').property('name', newName);
                        done();
                    }
                });
            }
        });
    });
});

describe('GET /categories', function () {
    var token,
        handled = 0;

    before(function (done) {
        auth('finances', function (newToken) {
            token = newToken;
            api.post('finances', '/company', {token : token}, function (error, data, response) {
                for (var i = 0; i < 20; i++) {
                    api.post('finances', '/category', {
                        token : token,
                        name : 'Nome ' + rand()
                    }, function (error, data, response) {
                        handled++;
                        if (handled === 20) {
                            done();
                        }
                    });
                }
            });
        });
    });

    it('url tem que existir', function (done) {
        api.get('finances', '/categories', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('token inválido', function (done) {
        api.get('finances', '/categories', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('lista categorias', function (done) {
        api.get('finances', '/categories', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('categories');
                done();
            }
        });
    });

});