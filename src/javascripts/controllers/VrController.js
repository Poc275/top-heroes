angular.module('TCModule').controller('VrController', function($scope, Cards) {
    Cards.getCardCollection().then(function(myCards) {
        $scope.collection = myCards.data;
    });
});
