angular.module('TCModule').controller('StoreController', function($scope, $mdDialog, Cards, Users) {
    $scope.bronzePackPrice = 500;
    $scope.bronzePremiumPackPrice = 750;
    $scope.silverPackPrice = 1500;
    $scope.silverPremiumPackPrice = 2000;
    $scope.goldPackPrice = 4500;
    $scope.goldPremiumPackPrice = 5000;
    $scope.showPremium = false;

    $scope.getBoon = function() {
        Users.getUsersStats().then(function(stats) {
            $scope.boon = stats.data.boon;
        })
        .catch(function(err) {
            console.log(err);
            $scope.boon = "Error retrieving boon";
        });
    };

    // user has clicked to buy a pack
    // show them the premium option
    $scope.purchase = function(grade) {
        $scope.purchaseGrade = grade;
        $scope.purchaseGradeIcon = "icons/paper-bag-" + grade + ".svg";
        $scope.purchasePremiumIcon = "icons/paper-bag-" + grade + "-premium.svg";
        
        switch(grade) {
            case 'bronze':
                $scope.purchasePrice = $scope.bronzePackPrice;
                $scope.purchasePremiumPrice = $scope.bronzePremiumPackPrice;
                break;
            case 'silver':
                $scope.purchasePrice = $scope.silverPackPrice;
                $scope.purchasePremiumPrice = $scope.silverPremiumPackPrice;
                break;
            case 'gold':
                $scope.purchasePrice = $scope.goldPackPrice;
                $scope.purchasePremiumPrice = $scope.goldPremiumPackPrice;
                break;
            default:
                break;
        }

        $scope.showPremium = true;
    };

    // user has confirmed they want to purchase a pack
    $scope.confirmPurchase = function(grade) {
        var cost = 0;

        // get pack cost
        switch(grade) {
            case 'bronze':
                cost = $scope.bronzePackPrice;
                break;
            case 'bronze-premium':
                cost = $scope.bronzePremiumPackPrice;
                break;
            case 'silver':
                cost = $scope.silverPackPrice;
                break;
            case 'silver-premium':
                cost = $scope.silverPremiumPackPrice;
                break;
            case 'gold':
                cost = $scope.goldPackPrice;
                break;
            case 'gold-premium':
                cost = $scope.goldPremiumPackPrice;
                break;
            default:
                cost = 0;
                break;
        }

        if(cost > $scope.boon) {
            // user can't afford it
            $scope.showNotEnoughBoonAlert();
        } else {
            Cards.purchase(grade).then(function(pack) {
                // update boon
                $scope.getBoon();

                // retrieve card objects from ids
                var promises = pack.data.map(function(card) {
                    return Cards.findById(card.cardId).then(function(cardObject) {
                        // assign got property across
                        cardObject.data.got = card.got;
                        return cardObject.data;
                    })
                    .catch(function(err) {
                        // handle error
                    });
                });

                Promise.all(promises).then(function(cards) {
                    // show dialog with pack directive
                    $mdDialog.show({
                        locals: { newPack: cards },
                        controller: NewPackDialogController,
                        templateUrl: 'templates/new-pack-dialog.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        fullscreen: true // Only for -xs, -sm breakpoints.
                    });
                });
            })
            .catch(function(err) {
                // handle error
            });
        }
    };

    // new pack dialog controller
    function NewPackDialogController($scope, $mdDialog, newPack) {
        $scope.data = {
            pack: newPack
        };

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    }

    // not enough boon alert dialog
    $scope.showNotEnoughBoonAlert = function() {
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.body))
                .clickOutsideToClose(true)
                .title('Not enough boon')
                .textContent('💰 I know deals, and this is a bad one, real bad. Read The Art of The Deal and get back to me with a better offer.')
                .ariaLabel('Not enough boon to buy the pack dialog')
                .ok('I\'m sorry')
        );
    };

    // call init() function immediately
    $scope.getBoon();
});