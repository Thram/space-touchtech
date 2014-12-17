/**
 * Created by thram on 17/12/14.
 */
var Game = (function () {
    var stage, queue;

    var canvasBBox;

    var galaxy = new createjs.Graphics(), stars = [],
        bullets = [], bulletG, characters = [], ship;

    var BULLET_SPEED = 15, BG_SPEED = 8, speed = 8, moveLeft = false, moveRight = false,
        moveUp = false, moveDown = false;

    var TOUCHTECH_GUYS = [
        {id: "adrian", src: "img/characters/adrian.png"},
        {id: "bel", src: "img/characters/bel.png"},
        {id: "cam", src: "img/characters/cam.png"},
        {id: "made", src: "img/characters/made.png"},
        {id: "matth", src: "img/characters/matth.png"},
        {id: "mattl", src: "img/characters/mattl.png"},
        {id: "mattw", src: "img/characters/mattw.png"},
        {id: "mitch", src: "img/characters/mitch.png"},
        {id: "robert", src: "img/characters/robert.png"},
        {id: "robin", src: "img/characters/robin.png"},
        {id: "robinffs", src: "img/characters/robinffs.png"},
        {id: "robinmad", src: "img/characters/robinmad.png"},
        {id: "seb", src: "img/characters/seb.png"},
        {id: "tom", src: "img/characters/tom.png"},
        {id: "zige", src: "img/characters/zige.png"}
    ];

    function _renderBullet() {
        bulletG = new createjs.Graphics();
        bulletG.setStrokeStyle(1);
        bulletG.beginStroke(createjs.Graphics.getRGB(180, 0, 0));
        bulletG.beginFill(createjs.Graphics.getRGB(200, 200, 0));
        bulletG.drawCircle(0, 0, 3);
    }

    function _renderStar() {
        var star = new createjs.Shape(galaxy);
        stars.push(star);
        star.x = randRange(10, canvasBBox.width - 10);
        star.y = randRange(-10, canvasBBox.height - 10);
        star.scaleY = star.scaleX = randRange(0.5, 2);
        star.alpha = Math.random() + 0.2;

        stage.addChild(star);
    }

    function _renderGalaxy() {
        galaxy.setStrokeStyle(1);
        galaxy.beginStroke(createjs.Graphics.getRGB(255, 255, 255));
        galaxy.beginFill(createjs.Graphics.getRGB(255, 255, 255));
        galaxy.drawCircle(0, 0, 1);

        for (var i = 0; i < 100; ++i) {
            _renderStar();
        }
    }

    function _renderShip() {
        ship = new createjs.Bitmap(queue.getResult("ship"));
        ship.regX = ship.image.width * 0.5;
        ship.regY = ship.image.height * 0.5;
        ship.x = canvasBBox.width / 2;
        ship.y = canvasBBox.height - 30;

        stage.addChild(ship);
    }

    function _renderCharacter() {
        var time = randRange(0, 5) * 1000;
        setTimeout(
            function () {
                var character = new createjs.Bitmap(
                    queue.getResult(
                        TOUCHTECH_GUYS[randRange(
                            0, TOUCHTECH_GUYS.length -
                            1)].id));
                character.regX = character.image.width * 0.5;
                character.regY = character.image.height * 0.5;
                var x = randRange(50, canvasBBox.width - 50);
                var y = -100;
                character.x = x;
                character.y = y;
                character.setBounds(x, y, character.image.width, character.image.height);
                characters.push(character);
                stage.addChild(character);
                _renderCharacter();
            }, time);
    }

    function _preloadAssets() {
        var assetsLoaded = 0;

        var assets = TOUCHTECH_GUYS.concat(
            [
                {id: "boom", src: "img/boom.png"},
                {id: "ship", src: "img/ship.png"},
                {id: "sound-theme-song", src: "sounds/Invaders_must_die_8-Bit.mp3"},
                {id: "sound-shoot", src: "sounds/shoot.mp3"},
                {id: "sound-explosion", src: "sounds/explosion.mp3"}
            ]);

        function _onLoadQueueComplete(ev) {
            var loadingProgress = document.querySelector("#loading-progress");
            loadingProgress.innerHTML = 100;
            var instance = createjs.Sound.play("sound-theme-song", {loop: -1});
            instance.volume = 0.5;
            _renderBullet();
            _renderGalaxy();
            _renderShip();
            _renderCharacter();

            createjs.Ticker.setFPS(30);
            createjs.Ticker.addEventListener("tick", _tick);

            window.onkeydown = onKeyDown;
            window.onkeyup = onKeyUp;
            var loading = document.querySelector("#loading-wrapper");
            loading.style.display = "none";
        }

        function _onLoadingProgress(ev) {
            assetsLoaded++;
            var loadingProgress = document.querySelector("#loading-progress");
            loadingProgress.innerHTML = (ev.progress * 100).toFixed(0);
        }

        queue = new createjs.LoadQueue(false);
        queue.installPlugin(createjs.Sound);
        queue.addEventListener("complete", _onLoadQueueComplete);
        queue.addEventListener("progress", _onLoadingProgress);
        queue.loadManifest(assets);
    }

    function initialize() {
        bullets = [], characters = [],
            moveLeft = false, moveRight = false,
            moveUp = false, moveDown = false;
        canvasBBox = document.getElementById("canvas").getBoundingClientRect();
        stage = new createjs.Stage("canvas");
        _preloadAssets();
    }

    function onKeyDown(e) {
        if (!e) {
            var e = window.event;
        }

        switch (e.keyCode) {
            // left
            case 37:
                moveLeft = true;
                moveRight = false;
                break;
            // up
            case 38:
                moveUp = true;
                moveDown = false;
                break;
            // right
            case 39:
                moveRight = true;
                moveLeft = false;
                break;
            // down
            case 40:
                moveDown = true;
                moveUp = false;
                break;
        }
    }

    function onKeyUp(e) {
        if (!e) {
            var e = window.event;
        }

        switch (e.keyCode) {
            // left
            case 37:
                moveLeft = false;
                break;
            // up
            case 38:
                moveUp = false;
                break;
            // right
            case 39:
                moveRight = false;
                break;
            // down
            case 40:
                moveDown = false;
                break;
            // Space
            case 32:
                _shoot();
                break;
        }
    }

    function _shoot() {
        var bullet = new createjs.Shape(bulletG);
        bullet.scaleY = 1.5;
        bullet.x = ship.x;
        bullet.y = ship.y - 30;
        bullet.setBounds(ship.x, ship.y - 30, 10, 10);
        bullets.push(bullet);

        var instance = createjs.Sound.play("sound-shoot");
        instance.volume = 0.5;

        stage.addChild(bullet);
    }

    function _boom(character) {
        var explosion = new createjs.SpriteSheet(
            {
                "images": [queue.getResult("boom")],
                frames: {width: 100, height: 100, regX: 50, regY: 50},
                animations: {
                    explode: [0, 80]
                }
            });

        var animation = new createjs.Sprite(explosion, "explode");
        animation.x = character.x;
        animation.y = character.y;
        animation.addEventListener(
            "animationend", function () {
                stage.removeChild(animation);
            });


        stage.addChild(animation);
    }

    function _checkBulletCollision(bullet) {
        if (bullets.length > 0) {
            var character;
            var limit = characters.length;
            for (var i = 0; i < limit; ++i) {
                character = characters[i];
                var intersection = ndgmr.checkRectCollision(bullet, character);

                if (intersection !== null) {
                    _boom(character);
                    stage.removeChild(character);
                    characters.splice(characters.indexOf(character), 1);
                    stage.removeChild(bullet);
                    bullets.splice(bullets.indexOf(bullet), 1);
                    Score.addPoints();
                    var instance = createjs.Sound.play("sound-explosion");
                    instance.volume = 0.5;
                }
            }
        }
    }

    function _checkCharacterCollision(character) {
        var intersection = ndgmr.checkRectCollision(ship, character);
        if (intersection !== null) {
            _boom(character);
            _boom(ship);
            stage.removeChild(character);
            characters.splice(characters.indexOf(character), 1);
            stage.removeChild(ship);
            var ev = new Event("game-over");
            ev.data = {final_score: Score.getPoints()};
            document.dispatchEvent(ev);
            var instance = createjs.Sound.play("sound-explosion");
            instance.volume = 0.5;
        }
    }

    function _tick() {
        _updateStarField();
        _updateBullets();
        _updateCharacters();
        _checkMovement();
        stage.update();
    }

    function _updateStarField() {
        var curStar;
        var limit = stars.length;
        for (var i = 0; i < limit; ++i) {
            curStar = stars[i];
            curStar.y += 4;
            if (curStar.y > canvasBBox.height) {
                curStar.x = randRange(10, canvasBBox.width - 10);
                curStar.y = -randRange(20, canvasBBox.height - 30);
            }
        }
    }

    function _updateCharacters() {
        var character;
        var limit = characters.length;
        for (var i = 0; i < limit; ++i) {
            character = characters[i];
            character.y += 4;
            _checkCharacterCollision(character);
            if (character.y > canvasBBox.height) {
                character.x = randRange(10, canvasBBox.width - 10);
                character.y = -randRange(20, canvasBBox.height - 30);
            }
        }
    }

    function _updateBullets() {
        var bLimit = bullets.length - 1;

        for (var i = bLimit; i >= 0; --i) {
            bullets[i].y -= BULLET_SPEED;
            _checkBulletCollision(bullets[i]);
            if (bullets[i].y < -3) {
                stage.removeChild(bullets[i]);
                bullets.splice(i, 1);
            }

        }
    }

    function _checkMovement() {
        if (moveLeft) {
            ship.x -= speed;
            if (ship.x < 0) {
                ship.x = canvasBBox.width;
            }
        }
        else if (moveRight) {
            ship.x += speed;
            if (ship.x > canvasBBox.width) {
                ship.x = 0;
            }
        }

        if (moveUp) {
            if (ship.y - speed > 24) {
                ship.y -= speed;
                BG_SPEED = 8;
            }
        }
        else if (moveDown) {
            if (ship.y + speed < canvasBBox.height - 20) {
                ship.y += speed;
                BG_SPEED = 3;
            }
        }
        else {
            BG_SPEED = 4;
        }
    }

    function reset() {
        Game.initialize();
        Score.reset()
    }

    // TOOLS

    function randRange(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    return {
        reset: reset,
        initialize: initialize
    }
})();