/** 
 * Field
 *
 * @author : Rafael Erthal
 * @since : 2013-01
 *
 * @description : Módulo que implementa as funcionalidades de campos configuraveis
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
        trigger = require('../Utils.js').trigger,
        Field = Model.Field,
        Company = Model.Company;

    /** POST /field
     *
     * @autor : Rafael Erthal
     * @since : 2013-01
     *
     * @description : Cadastra um campo configurável
     *
     * @request : {token, name, position}
     * @response : {field}
     */
    app.post('/field', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        company.fields.push({
                            name     : request.param('name', null),
                            position : request.param('position', null)
                        });
                        company.save(function (error) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                response.send({field : company.fields.pop()});
                            }
                        });
                    }
                });
            }
        });
    });

    /** GET /fields
     *
     * @autor : Rafael Erthal
     * @since : 2013-01
     *
     * @description : Lista campos configuráveis
     *
     * @request : {token}
     * @response : {fields[]}
     */
    app.get('/fields', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        response.send({fields : company.fields});
                    }
                });
            }
        });
    });

    /** GET /field/:id
     *
     * @autor : Rafael Erthal
     * @since : 2013-01
     *
     * @description : Exibe campo configurável
     *
     * @request : {token}
     * @response : {field}
     */
    app.get('/field/:id', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                            response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        company.findField(request.params.id, function (error, field) {
                            if (error) {
                                response.send({error : error});
                            } else if (field === null) {
                                response.send({error : { message : 'field not found', name : 'NotFoundError', token : request.params.id, path : 'field'}});
                            } else {
                                response.send({field : field});
                            }
                        });
                    }
                });
            }
        });
    });

    /** POST /field/:id/update
     *
     * @autor : Rafael Erthal
     * @since : 2013-01
     *
     * @description : Edita campo configurável
     *
     * @request : {token, name, position}
     * @response : {field}
     */
    app.post('/field/:id/update', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        company.findField(request.params.id, function (error, field) {
                            if (error) {
                                response.send({error : error});
                            } else if (field === null) {
                                    response.send({error : { message : 'field not found', name : 'NotFoundError', token : request.params.id, path : 'field'}});
                            } else {
                                field.name = request.param('name', field.name);
                                field.position = request.param('position', field.position);
                                company.save(function (error) {
                                    if (error) {
                                        response.send({error: error});
                                    } else {
                                        response.send({field : field});
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    /** POST /field/:id/delete
     *
     * @autor : Rafael Erthal
     * @since : 2013-01
     *
     * @description : Exclui campo configurável
     *
     * @request : {token}
     * @response : {}
     */
    app.post('/field/:id/delete', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        company.findField(request.params.id, function (error, field) {
                            if (error) {
                                response.send({error : error});
                            } else if (field === null) {
                                response.send({error : { message : 'field not found', name : 'NotFoundError', token : request.params.id, path : 'field'}});
                            } else {
                                field.remove();
                                company.save(function (error) {
                                    if (error) {
                                        response.send({error: error});
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