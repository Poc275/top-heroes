/**
 * Store module that handles the purchasing of card packs.
 * @module server/store
 */
// class member variables
var PACK_SIZE = 5;
var BRONZE_PRICE = -500;
var BRONZE_PREMIUM_PRICE = -750;
var SILVER_PRICE = -1500;
var SILVER_PREMIUM_PRICE = -2000;
var GOLD_PRICE = -4500;
var GOLD_PREMIUM_PRICE = -5000;
var PREMIUM_CHANCE = 20;
var BROWN_PLATINUM_CHANCE = 5;
var store = {
    nBronze: 0,
    nSilver: 0,
    nGold: 0,
    nBrownPlatinum: 0
};
var config;

// initialise variables
if(!process.env.FacebookClientID) {
	config = require('../config/auth');
}

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// var options = {
// 	user: process.env.MongoUsername || config.mongo.username,
// 	pass: process.env.MongoPassword || config.mongo.password
// };

// var db = mongoose.createConnection('ds062919.mlab.com:62919/tc', options);

var options = {
	user: process.env.CosmosDbUsername || config.cosmosdb.username,
	pass: process.env.CosmosDbPassword || config.cosmosdb.password
};
var hostname = process.env.CosmosDbHost || config.cosmosdb.host;
var port = process.env.CosmosDbPort || config.cosmosdb.port;
var dbname = process.env.dbName || config.cosmosdb.dbname;

var db = mongoose.createConnection(hostname + ':' + port + '/' + dbname + '?ssl=true', options, function(err) {
	if(!err) {
		console.log("DB Connected!");
	}
});

// create mongoose schemas and models from the schemas
// note 'cards' and 'users' refers to the collection names
var baseSchema = require('../models/Base.js').BaseSchema;
var Base = db.model('topheroes', baseSchema);
// var cardSchema = require('../models/Card.js').CardSchema;
// var Card = db.model('cards', cardSchema);
var cardSchema = require('../models/Card.js').CardSchema;
var Card = Base.discriminator('cards', cardSchema);
// var userSchema = require('../models/User.js').UserSchema;
// var User = db.model('users', userSchema);
var userSchema = require('../models/User.js').UserSchema;
var User = Base.discriminator('users', userSchema);


/**
 * Function that purchases a bronze pack
 * @param {function} cb - Callback function
 * @returns {error|array} JSON array of card objects (the pack)
 */
store.purchaseBronze = function(email, cb) {
    store.initialiseQuantities(function(err) {
        if(err) {
            console.log(err);
            return cb(err, null);
        }

        // get all bronze
        store.getCards("Bronze", 100, function(err, bronzeCards) {
            if(err) {
                console.log(err);
                return cb(err, null);
            }

            // 20% chance of silver
            store.getCards("Silver", PREMIUM_CHANCE, function(err, silverCards) {
                if(err) {
                    console.log(err);
                    return cb(err, null);
                }

                // 5% chance of brown platinum
                store.getCards("Brown Platinum", BROWN_PLATINUM_CHANCE, function(err, brownPlatinumCards) {
                    if(err) {
                        console.log(err);
                        return cb(err, null);
                    }

                    // combine all cards and pick a random pack
                    var pack = store.pickRandomCards(bronzeCards.concat(silverCards, brownPlatinumCards), PACK_SIZE);
                    // take payment and return
                    store.updateBoon(email, BRONZE_PRICE, function(err, balance) {
                        if(err) {
                            console.log(err);
                            return cb(err, null);
                        }

                        return cb(null, pack);
                    });
                });
            });
        });
    });
};

/**
 * Function that purchases a bronze premium pack
 * @param {function} cb - Callback function
 * @returns {error|array} JSON array of card objects (the pack)
 */
store.purchaseBronzePremium = function(email, cb) {
    store.initialiseQuantities(function(err) {
        if(err) {
            console.log(err);
            return cb(err, null);
        }

        // get all bronze
        store.getCards("Bronze", 100, function(err, bronzeCards) {
            if(err) {
                console.log(err);
                return cb(err, null);
            }

            // 20% chance of silver
            store.getCards("Silver", PREMIUM_CHANCE, function(err, silverCards) {
                if(err) {
                    console.log(err);
                    return cb(err, null);
                }

                // 5% chance of brown platinum
                store.getCards("Brown Platinum", BROWN_PLATINUM_CHANCE, function(err, brownPlatinumCards) {
                    if(err) {
                        console.log(err);
                        return cb(err, null);
                    }

                    // pack must contain 1 silver card
                    card.aggregate([
                        { $match: { cuntal_order: "Silver" }},
                        { $project: { _id: true }},
                        { $sample: { size: 1 }}
                    ], function(err, premiumCard) {
                        if(err) {
                            console.log(err);
                            return cb(err, null);
                        }

                        var pack = store.pickRandomCards(bronzeCards.concat(silverCards, brownPlatinumCards), PACK_SIZE - 1);
                        pack.push(premiumCard[0]._id);
                        // take payment and return
                        store.updateBoon(email, BRONZE_PREMIUM_PRICE, function(err, balance) {
                            if(err) {
                                console.log(err);
                                return cb(err, null);
                            }

                            return cb(null, pack);
                        });
                    });
                });
            });
        });
    });
};

/**
 * Function that purchases a silver pack
 * @param {function} cb - Callback function
 * @returns {error|array} JSON array of card objects (the pack)
 */
store.purchaseSilver = function(email, cb) {
    store.initialiseQuantities(function(err) {
        if(err) {
            console.log(err);
            return cb(err, null);
        }

        // get all silver
        store.getCards("Silver", 100, function(err, silverCards) {
            if(err) {
                console.log(err);
                return cb(err, null);
            }

            // 20% chance of bronze
            store.getCards("Bronze", PREMIUM_CHANCE, function(err, bronzeCards) {
                if(err) {
                    console.log(err);
                    return cb(err, null);
                }

                // 20% chance of gold
                store.getCards("Gold", PREMIUM_CHANCE, function(err, goldCards) {
                    if(err) {
                        console.log(err);
                        return cb(err, null);
                    }

                    // 5% chance of brown platinum
                    store.getCards("Brown Platinum", BROWN_PLATINUM_CHANCE, function(err, brownPlatinumCards) {
                        if(err) {
                            console.log(err);
                            return cb(err, null);
                        }

                        // combine all cards and pick a random pack
                        var pack = store.pickRandomCards(silverCards.concat(bronzeCards, goldCards, brownPlatinumCards), PACK_SIZE);
                        // take payment and return
                        store.updateBoon(email, SILVER_PRICE, function(err, balance) {
                            if(err) {
                                console.log(err);
                                return cb(err, null);
                            }

                            return cb(null, pack);
                        });
                    });
                });
            });
        });
    });
};

/**
 * Function that purchases a silver premium pack
 * @param {function} cb - Callback function
 * @returns {error|array} JSON array of card objects (the pack)
 */
store.purchaseSilverPremium = function(email, cb) {
    store.initialiseQuantities(function(err) {
        if(err) {
            console.log(err);
            return cb(err, null);
        }

        // get all silver
        store.getCards("Silver", 100, function(err, silverCards) {
            if(err) {
                console.log(err);
                return cb(err, null);
            }

            // 20% chance of bronze
            store.getCards("Bronze", PREMIUM_CHANCE, function(err, bronzeCards) {
                if(err) {
                    console.log(err);
                    return cb(err, null);
                }

                // 20% chance of gold
                store.getCards("Gold", PREMIUM_CHANCE, function(err, goldCards) {
                    if(err) {
                        console.log(err);
                        return cb(err, null);
                    }

                    // 5% chance of brown platinum
                    store.getCards("Brown Platinum", BROWN_PLATINUM_CHANCE, function(err, brownPlatinumCards) {
                        if(err) {
                            console.log(err);
                            return cb(err, null);
                        }

                        // pack must contain 1 gold card
                        card.aggregate([
                            { $match: { cuntal_order: "Gold" }},
                            { $project: { _id: true }},
                            { $sample: { size: 1 }}
                        ], function(err, premiumCard) {
                            if(err) {
                                console.log(err);
                                return cb(err, null);
                            }

                            var pack = store.pickRandomCards(silverCards.concat(bronzeCards, goldCards, brownPlatinumCards), PACK_SIZE - 1);
                            pack.push(premiumCard[0]._id);
                            // take payment and return
                            store.updateBoon(email, SILVER_PREMIUM_PRICE, function(err, balance) {
                                if(err) {
                                    console.log(err);
                                    return cb(err, null);
                                }

                                return cb(null, pack);
                            });
                        });
                    });
                });
            });
        });
    });
};

/**
 * Function that purchases a gold pack
 * @param {function} cb - Callback function
 * @returns {error|array} JSON array of card objects (the pack)
 */
store.purchaseGold = function(email, cb) {
    store.initialiseQuantities(function(err) {
        if(err) {
            console.log(err);
            return cb(err, null);
        }

        // get all gold
        store.getCards("Gold", 100, function(err, goldCards) {
            if(err) {
                console.log(err);
                return cb(err, null);
            }

            // 20% chance of silver
            store.getCards("Silver", PREMIUM_CHANCE, function(err, silverCards) {
                if(err) {
                    console.log(err);
                    return cb(err, null);
                }

                // 20% chance of brown platinum
                store.getCards("Brown Platinum", PREMIUM_CHANCE, function(err, brownPlatinumCards) {
                    if(err) {
                        console.log(err);
                        return cb(err, null);
                    }

                    // combine all cards and pick a random pack
                    var pack = store.pickRandomCards(goldCards.concat(silverCards, brownPlatinumCards), PACK_SIZE);
                    // take payment and return
                    store.updateBoon(email, GOLD_PRICE, function(err, balance) {
                        if(err) {
                            console.log(err);
                            return cb(err, null);
                        }

                        return cb(null, pack);
                    });
                });
            });
        });
    });
};

/**
 * Function that purchases a gold premium pack
 * @param {function} cb - Callback function
 * @returns {error|array} JSON array of card objects (the pack)
 */
store.purchaseGoldPremium = function(email, cb) {
    store.initialiseQuantities(function(err) {
        if(err) {
            console.log(err);
            return cb(err, null);
        }

        // get all gold
        store.getCards("Gold", 100, function(err, goldCards) {
            if(err) {
                console.log(err);
                return cb(err, null);
            }

            // pack must contain 1 brown platinum card
            card.aggregate([
                { $match: { cuntal_order: "Brown Platinum" }},
                { $project: { _id: true }},
                { $sample: { size: 1 }}
            ], function(err, premiumCard) {
                if(err) {
                    console.log(err);
                    return cb(err, null);
                }

                var pack = store.pickRandomCards(goldCards, PACK_SIZE - 1);
                pack.push(premiumCard[0]._id);
                // take payment and return
                store.updateBoon(email, GOLD_PREMIUM_PRICE, function(err, balance) {
                    if(err) {
                        console.log(err);
                        return cb(err, null);
                    }

                    return cb(null, pack);
                });
            });
        });
    });
};

/**
 * Function that takes payment for purchases, issues refunds for duplicates etc.
 * Note that the balance isn't checked as this will be done by the 
 * UI to prevent un-necessary server calls.
 * @param {string} email - User's email address
 * @param {number} price - Price of the pack
 * @param {function} cb - Callback function
 * @returns {error|number} Returns user's updated balance
 */
store.updateBoon = function(email, price, cb) {
    user.findOneAndUpdate(
        { email: email },
        { $inc: { boon: price }},
        { new: true },    
    function(err, updatedUser) {
        if(err) {
            console.log(err);
            return cb(err, null);
        }

        return cb(null, updatedUser.boon);
    });
};

/**
 * Function that adds a purchased pack to a user's collection. 
 * The function has 2 stages, the first checks for duplicates within the pack itself, 
 * the unique cards and then passed to the second stage to see if the user has them already.
 * @todo Apply refunds for duplicates. How much?
 * @param {string} email - User's email address
 * @param {array} pack - Array of card ObjectId() to add to collection
 * @param {function} cb - Callback function
 * @returns {error|object} Array of card ObjectId() tagged true for duplicate or false otherwise
 */
store.addPackToUserCollection = function(email, pack, cb) {
    var duplicateSortedPack = [];
    var sortedPack = [];
    var packDuplicate = false;
    var packDuplicateId;

    // stage 1 - filter pack for duplicates
    // note we can't do this in map() because we can't
    // guarantee that the cards are added and checked synchronously
    for(var i = 0; i < pack.length; i++) {
        // compare against rest of elements
        for(var j = i + 1; j < pack.length; j++) {
            if(pack[i].equals(pack[j])) {
                packDuplicate = true;
                packDuplicateId = pack[j];
            }
        }

        if(packDuplicate) {
            duplicateSortedPack.push({
                cardId: packDuplicateId,
                duplicate: true
            });
        } else {
            duplicateSortedPack.push({
                cardId: pack[i],
                duplicate: false
            });
        }

        // reset flag
        packDuplicate = false;
    }

    // stage 2 - check if user has the card already
    // get user's collection
    user.aggregate([
        { $match: { email: email }},
        { $project: { _id: false, cards: true }}
    ], function(err, collection) {
        if(err) {
            console.log(err);
            return cb(err, null);
        }

        // find duplicates
        // because forEach is synchronous and we need to wait for each card in the pack to be processed, 
        // we use a collection of promises from which we can await until they're all complete using Promise.all().
        // note that we have to use map() instead of forEach() because forEach() doesn't return anything
        // whereas from map() we can return a promise
        var promises = duplicateSortedPack.map(function(card) {
            return new Promise(function(resolve, reject) {
                if(card.duplicate) {
                    // ignore as it's a pack duplicate
                    // apply refund...
                    sortedPack.push({
                        cardId: card.cardId,
                        got: true
                    });
                    resolve();

                } else {
                    // not a pack duplicate, check if user has it already
                    var duplicate = collection[0].cards.find(function(existingCard) {
                        return existingCard.equals(card.cardId);
                    });

                    if(duplicate === undefined) {
                        // not got, add to collection
                        user.update(
                            { email: email },
                            { $push: { cards: mongoose.Types.ObjectId(card.cardId) }},
                        function(err, res) {
                            sortedPack.push({
                                cardId: card.cardId,
                                got: false
                            });
                            resolve();
                        });
                    } else {
                        // apply refund...
                        sortedPack.push({
                            cardId: card.cardId,
                            got: true
                        });
                        resolve();
                    }
                }
            });
        });

        // when all promises have completed, return the sorted pack
        Promise.all(promises).then(function() {
            return cb(null, sortedPack);
        })
        .catch(function(err) {
            console.log("Error: ", err);
            return cb(err, null);
        });
    });
};

/**
 * Function that selects potential cards for a purchase from which 
 * random cards are selected to make a pack. This is the function that 
 * implements the percentage chance of getting a card of a certain grade, 
 * depending on the pack being bought.
 * @param {string} order - Card grade (Bronze, Silver, Gold, or Brown Platinum)
 * @param {number} percentage - Percentage of that grade to return
 * @param {function} cb - Callback function
 * @returns {error|array} Array of card ObjectId()
 */
store.getCards = function(order, percentage, cb) {
    if(percentage === 100) {
        card.aggregate([
            { $match: { cuntal_order: order }},
            { $project: { _id: true }}
        ], function(err, results) {
            if(err) {
                console.log(err);
                return cb(err, null);
            }

            var cards = results.map(function(card) {
                return mongoose.Types.ObjectId(card._id);
            });

            return cb(null, cards);
        });
    } else {
        var amount;

        if(order === "Bronze") {
            amount = Math.ceil(store.nBronze * percentage / 100);
        } else if(order === "Silver") {
            amount = Math.ceil(store.nSilver * percentage / 100);
        } else if(order === "Gold") {
            amount = Math.ceil(store.nGold * percentage / 100);
        } else {
            amount = Math.ceil(store.nBrownPlatinum * percentage / 100);
        }

        card.aggregate([
            { $match: { cuntal_order: order }},
            { $project: { _id: true }},
            { $sample: { size: amount }}
        ], function(err, results) {
            if(err) {
                console.log(err);
                return cb(err, null);
            }

            var cards = results.map(function(card) {
                return mongoose.Types.ObjectId(card._id);
            });

            return cb(null, cards);
        });
    }
};

/**
 * Function that selects X random cards from the potential array returned 
 * from getCards(). Duplicates are allowed.
 * @param {array} cards - Array of potential cards - ObjectId()
 * @param {number} total - Number of cards to return. For premium packs this is PACK_SIZE - 1
 * because the pack must contain 1 premium grade card. For non-premium packs total = PACK_SIZE
 * @returns {array} Array of cards - ObjectId(). This is the final purchased pack
 */
store.pickRandomCards = function(cards, total) {
    var pack = [];

    for(var i = 0; i < total; i++) {
        pack.push(cards[Math.floor(Math.random() * cards.length)]);
    }

    return pack;
};


/**
 * Function that removes a card from a user's collection.
 * @todo This function is intended for the swap functionality which is still to implement.
 * @param {string} email - User's email address
 * @param {array} ids - Array of ObjectIds of the cards to remove
 * @param {function} cb - Callback function
 * @returns {error|null} Null if no error, otherwise contains the error object
 */
store.removeCardFromCollection = function(email, ids, cb) {
    user.update(
        { email: email },
        { $pull: { cards: { $in: ids } }},
    function(err, res) {
        if(err) {
            console.log(err);
            return cb(err);
        }

        return cb(null);
    });
};

/**
 * Function that gets the count of number of cards in each grade 
 * (Bronze, Silver, Gold, and Brown Platinum). This is so the percentages 
 * in getCards() can be calculated correctly.
 * @param {function} cb - Callback function
 * @returns {error|null} Null if no error otherwise contains the error object
 */
store.initialiseQuantities = function(cb) {
    card.aggregate([
        { $group: {
            _id: "$cuntal_order",
            total: { $sum: 1 }
        }}
    ], function(err, results) {
        if(err) {
            console.log(err);
            return cb(err);
        }

        results.forEach(function(category) {
            switch(category._id) {
                case "Bronze":
                    store.nBronze = category.total;
                    break;
                case "Silver":
                    store.nSilver = category.total;
                    break;
                case "Gold":
                    store.nGold = category.total;
                    break;
                case "Brown Platinum":
                    store.nBrownPlatinum = category.total;
                    break;
                default:
                    break;
            }
        });

        return cb(null);
    });
};

module.exports = store;