'use strict';

var utils    = require('./utils'),
    domReady = utils.domReady,
    Hero     = require('./Hero'),
    Box      = require('./Box'),
    Block    = require('./Block'),
    Diamond  = require('./Diamond'),
    levels   = require('./levels');

var classMap = {
    '1': [Block],
    '2': [Diamond],
    '3': [Box],
    '4': [Hero],
    '5': [Diamond, Box],
    '6': [Diamond, Hero]
};

var c = createjs,
    diamondTiles = [],
    currentLevel = 0,
    stage, mapGroup, hero, tiles;

console.log('Game Started: EaselJS version:', c.EaselJS.version);

domReady(function() {

    prepareWorld();

    window.addEventListener('keydown', onKeyDown)    ;

});

function prepareWorld() {
    stage    = new c.Stage('main');
    mapGroup = new c.Container();

    mapGroup.x = 50;
    mapGroup.y = 50;

    stage.addChild(mapGroup);

    loadLevel();

}

function loadLevel() {
    hero = undefined;
    mapGroup.removeAllChildren();

    var map       = levels[currentLevel].map;

    tiles     = [];

    map.forEach(function(row, indexY) {

        tiles.push([]);

        row.forEach(function(tile, indexX) {
            var classArr = classMap[tile],
                tileArr  = tiles[indexY][indexX] = [];

            if ( classArr ) {

                classArr.forEach(function(TileClass) {
                    var newTile = new TileClass(indexX, indexY);

                    mapGroup.addChild(newTile);
                    tileArr.push(newTile);

                    if ( TileClass === Hero ) { hero = newTile }

                });

                if ( tile === 2 || tile === 5 || tile === 6 ) {
                    diamondTiles.push(tileArr);
                }


            }

        });

    });

    if ( !hero ) { console.log('main.js: no hero un map'); }

    stage.update();

}

function onKeyDown(event) {
    var didMove = false;

    switch  (event.keyCode) {
        case 37:
            didMove = tryMove(hero, -1, 0);
            break;

        case 38:
            didMove = tryMove(hero, 0, -1);
            break;

        case 39:
            didMove = tryMove(hero, 1, 0);
            break;

        case 40:
            didMove = tryMove(hero, 0, 1);
            break;
    }

    if ( didMove ) {
        stage.update();
        checkWin();
    }
}

function tryMove(obj, x, y) {
    var myX  = obj.gameX,
        myY  = obj.gameY,
        tryX = myX + x,
        tryY = myY + y,
        myTile = tiles[myY][myX],
        tryTile = tiles[tryY] && tiles[tryY][tryX];

    if ( !tryTile ) { return; }
    if ( !tryTile.length ) { return processMove(); }

    var tryTileTop = tryTile[tryTile.length-1];

    if ( tryTileTop.name === 'block' ) { return false }

    if ( tryTileTop.name === 'box' ) {

        if ( obj.name === 'box' ) { return false; }

        var canTryTileMove = tryMove(tryTileTop, x, y);

        if ( !canTryTileMove ) { return false; }

    }

    return processMove();

    function processMove() {
        myTile.pop();
        tryTile.push(obj);
        obj.move(x, y);
        mapGroup.addChild(obj);

        return true;
    }

}

function checkWin() {
    var anyFailing = diamondTiles.some(function(tileArr) {
        return tileArr[tileArr.length-1].name !== 'box';
    });

    if ( !anyFailing ) {

        currentLevel++;

        if ( currentLevel === levels.length ) {

            alert('All Levels complete!');

        } else {

            setTimeout(loadLevel, 300);

        }
    }
}
