/**
 * Created by thram on 17/12/14.
 */
var Score = (function () {
    var points = 0, level = 1;

    function addLevels(l) {
        l = l || 1;
        level += l;
        var ev = new Event("levels-added");
        ev.data = {level: level};
        document.dispatchEvent(ev);
        return level;
    }

    function addPoints(p) {
        p = p || 1;
        points += p;
        var ev = new Event("points-added");
        ev.data = {points: points};
        document.dispatchEvent(ev);
        return points;
    }

    function removePoints(p) {
        p = p || 1;
        points -= p;
        var ev = new Event("points-removed");
        ev.data = {points: points};
        document.dispatchEvent(ev);
        return points;
    }

    function getPoints() {
        return points;
    }

    function reset() {
        points = 0;
        level = 1;
    }

    return {
        reset: reset,
        getPoints: getPoints,
        addPoints: addPoints,
        removePoints: removePoints,
        addLevels: addLevels
    }

})();