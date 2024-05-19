"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
const PIXI = __importStar(require("pixi.js"));
const Field_1 = require("./Field");
const Tile_1 = require("./Tile");
class Board {
    constructor(textures) {
        this.fieldSize = 0;
        this.width = 0;
        this.height = 0;
        this.textures = textures;
        this.container = new PIXI.Container();
        this.fields = [];
        this.rows = 5;
        this.cols = 5;
        this.create();
        this.ajustPosition();
    }
    create() {
        this.createFields();
        this.createTiles();
    }
    createTiles() {
        this.fields.forEach(field => this.createTile(field));
    }
    createTile(field) {
        const randomTileType = Math.floor(Math.random() * 3);
        const tile = new Tile_1.Tile(this.textures[randomTileType], randomTileType);
        field.setTile(tile);
        this.container.addChild(tile.sprite);
        tile.sprite.interactive = true;
        tile.sprite.on("pointerdown", () => {
            this.container.emit('tile-touch-start', tile);
        });
        return tile;
    }
    getField(row, col) {
        return this.fields.find(field => field.row === row && field.col === col);
    }
    createFields() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.createField(row, col);
            }
        }
    }
    createField(row, col) {
        const field = new Field_1.Field(row, col);
        this.fields.push(field);
        this.container.addChild(field.sprite);
    }
    ajustPosition() {
        if (this.fields.length === 0)
            return; // Проверка на пустой массив полей
        this.fieldSize = this.fields[0].sprite.width;
        this.width = this.cols * this.fieldSize;
        this.height = this.rows * this.fieldSize;
        this.container.x = (window.innerWidth - this.width) / 2 + this.fieldSize / 2;
        this.container.y = (window.innerHeight - this.height) / 2 + this.fieldSize / 2;
    }
    swap(tile1, tile2) {
        const tile1Field = tile1.field;
        const tile2Field = tile2.field;
        if (!tile1Field || !tile2Field)
            return; // Проверка на наличие поля у тайлов
        tile1Field.tile = tile2;
        tile2.field = tile1Field;
        tile2Field.tile = tile1;
        tile1.field = tile2Field;
    }
}
exports.Board = Board;
