// filter that returns the descriptive string for a given level
angular.module('TCModule').filter('levelFilter', function() {
    return function(level) {
        // ensure we have a valid level number
        if(isNaN(level)) {
            // just return the number and let
            // the controller handle this
            return level;
        } else {
            var levelDesc;

            switch(level) {
                case 1:
                    levelDesc = 'Bronze Fictional';
                    break;
                case 2:
                    levelDesc = 'Silver Fictional';
                    break;
                case 3:
                    levelDesc = 'Gold Fictional';
                    break;
                case 4:
                    levelDesc = 'Bronze Mouth Breather';
                    break;
                case 5:
                    levelDesc = 'Silver Mouth Breather';
                    break;
                case 6:
                    levelDesc = 'Gold Mouth Breather';
                    break;
                case 7:
                    levelDesc = 'Bronze Sport';
                    break;
                case 8:
                    levelDesc = 'Silver Sport';
                    break;
                case 9:
                    levelDesc = 'Gold Sport';
                    break;
                case 10:
                    levelDesc = 'Bronze Wrong\'n';
                    break;
                case 11:
                    levelDesc = 'Silver Wrong\'n';
                    break;
                case 12:
                    levelDesc = 'Gold Wrong\'n';
                    break;
                case 13:
                    levelDesc = 'Bronze Attention Seeker';
                    break;
                case 14:
                    levelDesc = 'Silver Attention Seeker';
                    break;
                case 15:
                    levelDesc = 'Gold Attention Seeker';
                    break;
                case 16:
                    levelDesc = 'Bronze World Leader';
                    break;
                case 17:
                    levelDesc = 'Silver World Leader';
                    break;
                case 18:
                    levelDesc = 'Gold World Leader';
                    break;
                case 19:
                    levelDesc = 'Bronze 1%er';
                    break;
                case 20:
                    levelDesc = 'Silver 1%er';
                    break;
                case 21:
                    levelDesc = 'Gold 1%er';
                    break;
                case 22:
                    levelDesc = 'Bronze Tory';
                    break;
                case 23:
                    levelDesc = 'Silver Tory';
                    break;
                case 24:
                    levelDesc = 'Gold Tory';
                    break;
                case 25:
                    levelDesc = 'Brown Platinum Tory';
                    break;
                case 26:
                    levelDesc = 'Bronze Top Cunt';
                    break;
                case 27:
                    levelDesc = 'Silver Top Cunt';
                    break;
                case 28:
                    levelDesc = 'Gold Top Cunt';
                    break;
                case 29:
                    levelDesc = 'Brown Platinum Cunt';
                    break;
                default:
                    levelDesc = 'Top Cunt!';
            }

            return levelDesc;
        }
    };
});