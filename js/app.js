/**
 * Created by thram on 18/12/14.
 */
var App = function () {
    Game.initialize();
    var scoreEl = document.querySelector("#score");
    var gameOverOverlay = document.querySelector("#game-over-overlay");
    document.addEventListener(
        "points-added", function (ev) {
            scoreEl.innerHTML = ev.data.points;

        });

    document.addEventListener(
        "game-over", function (ev) {
            gameOverOverlay.style.display = "block";
            var finalScoreEl = document.querySelector("#final-score");
            finalScoreEl.innerHTML = Score.getPoints();
        });

    var playAgainBtn = document.querySelector("#replay");
    playAgainBtn.addEventListener(
        "click", function () {
            Game.reset();
            gameOverOverlay.style.display = "none";
            scoreEl.innerHTML = 0;
        });
};