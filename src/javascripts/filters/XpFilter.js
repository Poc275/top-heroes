// filter that returns the position of the xp bar depending on the level
angular.module('TCModule').filter('xpFilter', function() {
    return function(xp, level) {
        // ensure we have valid level/xp values
        if(isNaN(level)) {
            return 0;
        } else if(isNaN(xp)) {
            return 0;
        } else {
            var xpBarPos = 0;
            var levelMin = 0;
            var levelMax = 0;

            switch(level) {
                case 1:
                    levelMin = 0;
                    levelMax = 100;
                    break;
                case 2:
                    levelMin = 100;
                    levelMax = 220;
                    break;
                case 3:
                    levelMin = 220;
                    levelMax = 360;
                    break;
                case 4:
                    levelMin = 360;
                    levelMax = 520;
                    break;
                case 5:
                    levelMin = 520;
                    levelMax = 700;
                    break;
                case 6:
                    levelMin = 700;
                    levelMax = 900;
                    break;
                case 7:
                    levelMin = 900;
                    levelMax = 1120;
                    break;
                case 8:
                    levelMin = 1120;
                    levelMax = 1360;
                    break;
                case 9:
                    levelMin = 1360;
                    levelMax = 1620;
                    break;
                case 10:
                    levelMin = 1620;
                    levelMax = 1900;
                    break;
                case 11:
                    levelMin = 1900;
                    levelMax = 2200;
                    break;
                case 12:
                    levelMin = 2200;
                    levelMax = 2520;
                    break;
                case 13:
                    levelMin = 2520;
                    levelMax = 2860;
                    break;
                case 14:
                    levelMin = 2860;
                    levelMax = 3220;
                    break;
                case 15:
                    levelMin = 3220;
                    levelMax = 3600;
                    break;
                case 16:
                    levelMin = 3600;
                    levelMax = 4000;
                    break;
                case 17:
                    levelMin = 4000;
                    levelMax = 4420;
                    break;
                case 18:
                    levelMin = 4420;
                    levelMax = 4860;
                    break;
                case 19:
                    levelMin = 4860;
                    levelMax = 5320;
                    break;
                case 20:
                    levelMin = 5320;
                    levelMax = 5800;
                    break;
                case 21:
                    levelMin = 5800;
                    levelMax = 6300;
                    break;
                case 22:
                    levelMin = 6300;
                    levelMax = 6820;
                    break;
                case 23:
                    levelMin = 6820;
                    levelMax = 7360;
                    break;
                case 24:
                    levelMin = 7360;
                    levelMax = 7920;
                    break;
                case 25:
                    levelMin = 7920;
                    levelMax = 8500;
                    break;
                case 26:
                    levelMin = 8500;
                    levelMax = 9100;
                    break;
                case 27:
                    levelMin = 9100;
                    levelMax = 9720;
                    break;
                case 28:
                    levelMin = 9720;
                    levelMax = 10360;
                    break;
                case 29:
                    levelMin = 10360;
                    levelMax = 11020;
                    break;
                default:
                    // top level, xp bar is full
                    return 100;
            }

            return (xp - levelMin) / (levelMax - levelMin) * 100;
        }
    };
});