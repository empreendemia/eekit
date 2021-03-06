/**
 * @author : Mauro Ribeiro
 * @since : 2012-10
 *
 * @description : Tokens do usuário
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    tokenSchema,
    Token;

tokenSchema = new Schema({
    token          : {type : String, trim : true},
    service        : {type : String, required : true},
    dateCreated    : {type : Date, required : true},
    dateExpiration : {type : Date, required : true}
});


/**
 * Cria um token
 *
 * @author Mauro Ribeiro
 * @since  2013-03
 *
 * @param minutes   duração do token
 * @param service   id do serviço
 * @param cb        callback
 */
tokenSchema.generate = function (service) {
    var token, expiration,
        crypto = require('crypto'),
        config = require('./../config.js');

    expiration = new Date();
    expiration.setDate(expiration.getDate() + 30);

    token = {
         token : crypto
             .createHash('sha512')
             .update(config.security.token + this._id + crypto.randomBytes(10))
             .digest('hex'),
         service : service,
         dateCreated : new Date(),
         dateExpiration : expiration
    };

    return token;
}


/*  Exportando o pacote  */
Token = exports.Token = tokenSchema;