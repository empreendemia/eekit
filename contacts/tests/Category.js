/** Tests Contacts.Category
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-09
 *
 * @description : Kit de testes do controller category do serviço contacts
 */

var should = require("should"),
    api = require("./utils.js").api,
    rand = require("./utils.js").rand,
    auth = require("./utils.js").auth;

describe('GET /categories', function () {
    var token;

    before(function (done) {
        auth('contacts', function (newToken) {
            token = newToken;
            api.post('contacts', '/company', {token : token}, function (error, data, response) {
                done();
            });
        });
    });

    it('url tem que existir', function (done) {
        api.get('contacts', '/categories', {}, function (error, data, response) {
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
        api.get('contacts', '/categories', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('pega as categorias do usuário', function (done) {
        api.get('contacts', '/categories', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('categories')
                done();
            }
        });
    });

});

describe('GET /category/[category]', function () {
    var token,
        category;

    before(function (done) {
        auth('contacts', function (newToken) {
            token = newToken;
            api.post('contacts', '/company', {token : token}, function (error, data, response) {
                category = data.categories[0];
                done();
            });
        });
    });

    it('url tem que existir', function (done) {
        api.get('contacts', '/category/geral', {}, function (error, data, response) {
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
        api.get('contacts', '/category/geral', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('categoria inexistente', function (done) {
        api.get('contacts', '/category/inexistente', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('exibe categoria', function (done) {
        api.get('contacts', '/category/' + category._id, {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('category')
                done();
            }
        });
    });

});


describe('POST /category', function () {
    var token;

    before(function (done) {
        auth('contacts', function (newToken) {
            token = newToken;
            api.post('contacts', '/company', {token : token}, function (error, data, response) {
                done();
            });
        });
    });

    it('url tem que existir', function (done) {
        api.post('contacts', '/category', {}, function (error, data, response) {
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
        api.post('contacts', '/category', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('categoria sem nome', function (done) {
        api.post('contacts', '/category', {token : token, type : 'clients', color : 'blue'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'ValidationError');
                done();
            }
        });
    });

    it('categoria sem cor', function (done) {
        api.post('contacts', '/category', {token : token, name : 'Categoria', type : 'clients'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'ValidationError');
                done();
            }
        });
    });

    it('categoria sem tipo', function (done) {
        api.post('contacts', '/category', {token : token, name : 'Categoria', color : 'blue'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'ValidationError');
                done();
            }
        });
    });

    it('cadastra categoria', function (done) {
        api.post('contacts', '/category', {token : token, name : 'Categoria', type : 'clients', color : 'blue'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('category').property('name', 'Categoria');
                data.should.have.property('category').property('type', 'clients');
                data.should.have.property('category').property('color', 'blue');
                done();
            }
        });
    });
});

describe('POST /category/:id/update', function () {
    var token,
        category;

    before(function (done) {
        auth('contacts', function (newToken) {
            token = newToken;
            api.post('contacts', '/company', {token : token}, function (error, data, response) {
                category = data.categories[0];
                done();
            });
        });
    });

    it('url tem que existir', function (done) {
        api.post('contacts', '/category/' + category._id + '/update', {}, function (error, data, response) {
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
        api.post('contacts', '/category/' + category._id + '/update', {token : 'inválido', name : 'Categoria', type : 'clients', color : 'blue'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('categoria inexistente', function (done) {
        api.post('contacts', '/category/inexistente/update', {token : token, name : 'Categoria', type : 'clients', color : 'blue'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('altera categoria', function (done) {
        api.post('contacts', '/category/' + category._id + '/update', {token : token, name : 'Categoria', type : 'clients', color : 'blue'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('category').property('name', 'Categoria');
                data.should.have.property('category').property('type', 'clients');
                data.should.have.property('category').property('color', 'blue');
                done();
            }
        });
    });

});

describe('POST /category/:id/delete', function () {
    var token,
        category;

    before(function (done) {
        auth('contacts', function (newToken) {
            token = newToken;
            api.post('contacts', '/company', {token : token}, function (error, data, response) {
                category = data.categories[0];
                done();
            });
        });
    });

    it('url tem que existir', function (done) {
        api.post('contacts', '/category/' + category._id + '/delete', {}, function (error, data, response) {
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
        api.post('contacts', '/category/' + category._id + '/delete', {token : 'inválido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('categoria inexistente', function (done) {
        api.post('contacts', '/category/inexistente/delete', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('deleta categoria', function (done) {
        api.post('contacts', '/category/'+category._id+'/delete', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data);
                done();
            }
        });
    });

});