/**
 * Category
 *
 * @author : Mauro Ribeiro
 * @since  : 2013-02
 *
 * @description : Módulo que implementa as funcionalidades de categoria
 */

module.exports = function (params) {
    "use strict";

    /**
     * POST /category
     *
     * @author : Mauro Ribeiro
     * @since  : 2013-02
     *
     * @description : Cadastra nova categoria
     *
     * @request : {token, name, type, color}
     * @response : {category}
     */
    params.app.post('/category', function (request,response) {
        var category;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        company.categories.push({
                            name  : request.param('name', null),
                            type  : request.param('type', null),
                            color : request.param('color', null)
                        });
                        company.save(function (error) {
                            var category = company.categories.pop();
                            if (error) {
                                response.send({error : error});
                            } else {
                                response.send({category : category});
                            }
                        });
                    }
                });
            }
        });
    });

    /** GET /categories
     *
     * @author : Rafael Erthal
     * @since  : 2012-09
     *
     * @description : Lista categorias
     *
     * @request : {token}
     * @response : {categories[]}
     */
    params.app.get('/categories', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        response.send({categories : company.categories});
                    }
                });
            }
        });
    });

    /** GET /category/:id
     *
     * @author : Rafael Erthal
     * @since  : 2012-09
     *
     * @description : Exibe fase de negociação de um usuário
     *
     * @request : {token}
     * @response : {category}
     */
    params.app.get('/category/:id', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        company.findCategory(request.params.id, function (error, category) {
                            if (error) {
                                response.send({error : { message : 'category not found', name : 'NotFoundError', token : request.params.id, path : 'category'}});
                            } else if (category === null) {
                                response.send({error : { message : 'category not found', name : 'NotFoundError', token : request.params.id, path : 'category'}});
                            } else {
                                response.send({category : category});
                            }
                        });
                    }
                });
            }
        });
    });

    /**
     * POST /category/:id/update
     *
     * @author : Mauro Ribeiro
     * @since  : 2013-02
     *
     * @description : Atualiza a categoria
     *
     * @request : {token, name, type, color}
     * @response : {category}
     */
    params.app.post('/category/:id/update', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        company.findCategory(request.params.id, function (error, category) {
                            if (error) {
                                response.send({error : { message : 'category not found', name : 'NotFoundError', id : request.params.id, path : 'category'}});
                            } else if (category === null) {
                                response.send({error : { message : 'category not found', name : 'NotFoundError', token : request.params.id, path : 'category'}});
                            } else {
                                category.name = request.param('name', category.name);
                                category.type = request.param('type', category.type);
                                category.color = request.param('color', category.color);
                                company.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send({category : category});
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    /**
     * POST /category/:id/delete
     *
     * @author : Mauro Ribeiro
     * @since  : 2013-02
     *
     * @description : Remove a categoria
     *
     * @request : {token}
     * @response : {}
     */
    params.app.post('/category/:id/delete', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        company.findCategory(request.params.id, function (error, category) {
                            if (error) {
                                response.send({error : { message : 'category not found', name : 'NotFoundError', id : request.params.id, path : 'category'}});
                            } else if (category === null) {
                                response.send({error : { message : 'category not found', name : 'NotFoundError', token : request.params.id, path : 'category'}});
                            } else {
                                category.remove();
                                company.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send(null);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });
}