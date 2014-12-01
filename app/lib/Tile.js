'use strict';

var createSubClass = require('./utils/create_subclass'),
    Shape      = createjs.Shape;

var TILE_SIZE = 50;

module.exports = createSubClass(Shape, 'Tile', {
    initialize: Tile$initialize,
    setPos: Tile$setPos,
    move: Tile$move
});

function Tile$initialize(x, y) {
    Shape.prototype.initialize.apply(this, null);
    this.setPos(x, y);
}

function Tile$setPos(x, y) {
    this.gameX = x;
    this.gameY = y;
    this.x = x * TILE_SIZE;
    this.y = y * TILE_SIZE;
}

function Tile$move(dX, dY) {
    this.gameX += dX;
    this.gameY += dY;
    this.x += dX * TILE_SIZE;
    this.y += dY * TILE_SIZE;
}
