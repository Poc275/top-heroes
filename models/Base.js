// Base schema to enable Mongoose discriminators to work
// and save money per billing in Azure Cosmos Db
var mongoose = require('mongoose');
var options = { discriminatorKey: 'kind' };

// The only common properties are _id and name (card name and user's name)
exports.BaseSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true }
}, options);
