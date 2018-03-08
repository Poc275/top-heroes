angular.module('TCModule').controller('CmsController', function($scope, $http, $sce, Cards) {
    $scope.card = {
        name: 'Harold',
        unpalatibility: 50,
        up_their_own_arsemanship: 50,
        media_attention: 50,
        legacy: 50,
        ppc: 250,
        special_ability: 50,
        category: 'Mouth Breathers',
        special_ability_description: 'Special ability is...',
        mdBio: 'Bio here, markdown compatible...',
        bio: 'Bio here, markdown compatible...',
        references: [
            '[Wikipedia](https://en.wikipedia.org)'
        ],
        cuntal_order: 'Bronze',
        images: [
            'preview-front.jpg',
            'preview-rear.jpg'
        ]
    };

    // wrap card model in array for <tc-card> directive
    $scope.preview = [
        $scope.card
    ];

    $scope.showPreviewCard = true;
    $scope.querySearch = querySearch;
    $scope.selectedItemChange = selectedItemChange;
    $scope.converter = new showdown.Converter();

    Cards.all().then(function(cards) {
        $scope.cards = cards.data;
        // just want names for autocomplete
        $scope.names = $scope.cards.map(function(card) {
            return {
                value: card.name,
                image: card.images[0]
            };
        });
    }, function(err) {
        console.log(err);
        $scope.cards = null;
    });

    // form submit event
    $scope.onSubmit = function() {
        if($scope.card._id) {
            // we're editing an existing card
            Cards.edit($scope.card).then(function(res) {
                $scope.cmsFormResponse = "Edit successful";
            }, function(err) {
                console.log(err);
                $scope.cmsFormResponse = "Error: " + err;
            });
        } else {
            // we're creating a new card
            Cards.create($scope.card).then(function(res) {
                $scope.cmsFormResponse = "Card created successfully";
            }, function(err) {
                console.log(err);
                $scope.cmsFormResponse = "Error: " + err;
            });
        }
    };

    $scope.calcAverage = function() {
        $scope.average = ($scope.card.unpalatibility + 
                         $scope.card.up_their_own_arsemanship + 
                         $scope.card.media_attention + 
                         $scope.card.legacy + 
                         $scope.card.special_ability) / 5;

        $scope.isTory();
    };

    $scope.isTory = function() {
        if($scope.card.category === 'Tories') {
            $scope.card.cuntal_order = 'Brown Platinum';
        } else if($scope.average < 60 || !$scope.average) {
            $scope.card.cuntal_order = 'Bronze';
        } else if($scope.average < 75) {
            $scope.card.cuntal_order = 'Silver';
        } else {
            $scope.card.cuntal_order = 'Gold';
        }
    };

    $scope.updateBioMarkdown = function(text) {
        $scope.card.bio = $sce.trustAsHtml($scope.converter.makeHtml(text));
    };

    // quick markdown insert functions
    $scope.insertMdLink = function() {
        $scope.card.mdBio += "[link text...](https://www.google.com)";
    };

    $scope.insertMdItalics = function() {
        $scope.card.mdBio += "*italic*";
    };

    $scope.insertMdBold = function() {
        $scope.card.mdBio += "**bold**";
    };

    $scope.insertMdNumberedList = function() {
        $scope.card.mdBio += "\n1. Item 1\n2. Item 2\n3. Item 3";
    };

    $scope.insertMdBulletedList = function() {
        $scope.card.mdBio += "\n- Item 1\n- Item 2\n- Item 3";
    };

    $scope.insertMdBlockquote = function() {
        $scope.card.mdBio += "\n> \"I have a dream\"";
    };

    
    function selectedItemChange(item) {
        if(item) {
            var selectedCard = $scope.cards.find(function(card) {
                return card.name === item.value;
            });
    
            // update model and average
            $scope.card = selectedCard;
            $scope.card.mdBio = $scope.card.bio;
            $scope.preview[0] = $scope.card;
            $scope.calcAverage();
        }
    }

    function querySearch(query) {
        var results = query ? $scope.names.filter(createFilterFor(query)) : $scope.names;
        return results;
    }

    function createFilterFor(query) {
        return function filterFn(card) {
            return (card.value.indexOf(query) === 0);
        };
    }

    // initialise average
    $scope.calcAverage();
});