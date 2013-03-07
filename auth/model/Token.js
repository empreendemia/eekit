/**
 * @author : Mauro Ribeiro
 * @since : 2012-10
 *
 * @description : Tokens do usuário
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    tokenSchema;

tokenSchema = new Schema({
    token       : {type : String, trim : true},
    dateCreated : {type : Date},
    dateUpdated : {type : Date}
});

/*  Exportando o pacote  */
exports.Token = tokenSchema;