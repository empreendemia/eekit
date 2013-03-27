/** Company
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de company de tasks
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
        Company = Model.Company;

    /** POST /company
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : Registra um usuário no serviço
     *
     * @request : {token}
     * @response : {categories[], fields[]}
     */
    app.post('/company', function (request,response) {
        var newcompany;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                Company.findOne({company : company._id}, function (error, oldcompany) {
                    if (error) {
                        response.send({error : error});
                    } else if (oldcompany === null) {
                        newcompany = new Company({
                            company : company._id,
                            categories : [
                                {name : 'Cliente', type : 'clients', color : 'red'},
                                {name : 'Negociação', type : 'clients', color : 'red'},
                                {name : 'Potencial', type : 'clients', color : 'red'},
                                {name : 'Ex-cliente', type : 'clients', color : 'red'},
                                {name : 'Não-cliente', type : 'clients', color : 'red'},
                                {name : 'Fornecedor', type : 'suppliers', color : 'green'},
                                {name : 'Ex-fornecedor', type : 'suppliers', color : 'green'},
                                {name : 'Parceiro', type : 'partners', color : 'gold'},
                                {name : 'Revendedor', type : 'partners', color : 'gold'},
                                {name : 'Amigos', type : 'personals', color : 'blue'},
                                {name : 'Família', type : 'personals', color : 'blue'},
                                {name : 'Trabalho', type : 'personals', color : 'blue'}
                            ]
                        });
                        newcompany.save(function (error) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                response.send({categories : newcompany.categories, fields : newcompany.fields});
                            }
                        });
                    } else {
                        response.send({categories : oldcompany.categories, fields : oldcompany.fields});
                    }
                });
            }
        });
    });
}