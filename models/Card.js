var mongoose = require('mongoose');
var options = { discriminatorKey: 'kind' };

/**
 * Mongoose Card schema
 */
exports.CardSchema = new mongoose.Schema({
	// _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
	// name: { type: String, required: true },
	_id: false,
	impact: { type: Number, required: true },
	intelligence: { type: Number, required: true },
	legacy: { type: Number, required: true },
	courage: { type: Number, required: true },
	special_ability: { type: Number, required: true },
	humility: { type: Number, required: true },
	hero_rating: { type: String, required: true },
	category: { type: String, required: true },
	special_ability_description: { type: String, required: true },
	bio: { type: String, required: true },
	references: { type: Array, required: false },
	images: { type: Array, required: true }
}, options);