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
        this.create(); // Создание доски
        this.ajustPosition(); // Настройка позиции доски
    }
    create() {
        // Создание полей и плиток на доске
        this.createFields();
        this.createTiles();
    }
    createTiles() {
        // Создание плиток для каждого поля
        this.fields.forEach(field => this.createTile(field));
    }
    createTile(field) {
        // Создание плитки для конкретного поля
        const randomTileType = Math.floor(Math.random() * 3); // Случайный тип плитки
        const tile = new Tile_1.Tile(this.textures[randomTileType], randomTileType); // Создание новой плитки
        field.setTile(tile); // Установка плитки на поле
        this.container.addChild(tile.sprite); // Добавление спрайта плитки в контейнер
        tile.sprite.interactive = true; // Делает спрайт интерактивным
        tile.sprite.on("pointerdown", () => {
            // Обработка события клика по плитке
            this.container.emit('tile-touch-start', tile);
        });
        return tile;
    }
    getField(row, col) {
        // Получение поля по строке и столбцу
        return this.fields.find(field => field.row === row && field.col === col);
    }
    createFields() {
        // Создание всех полей на доске
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.createField(row, col);
            }
        }
    }
    createField(row, col) {
        // Создание одного поля
        const field = new Field_1.Field(row, col); // Создание нового поля
        this.fields.push(field); // Добавление поля в массив полей
        this.container.addChild(field.sprite); // Добавление спрайта поля в контейнер
    }
    ajustPosition() {
        // Настройка позиции доски в окне
        if (this.fields.length === 0)
            return; // Проверка на пустой массив полей
        this.fieldSize = this.fields[0].sprite.width; // Установка размера поля
        this.width = this.cols * this.fieldSize; // Вычисление ширины доски
        this.height = this.rows * this.fieldSize; // Вычисление высоты доски
        this.container.x = (window.innerWidth - this.width) / 2 + this.fieldSize / 2; // Центрирование доски по горизонтали
        this.container.y = (window.innerHeight - this.height) / 2 + this.fieldSize / 2; // Центрирование доски по вертикали
    }
    swap(tile1, tile2) {
        // Метод для обмена плиток местами
        const tile1Field = tile1.field;
        const tile2Field = tile2.field;
        if (!tile1Field || !tile2Field)
            return; // Проверка на наличие поля у плиток
        // Обмен полями плиток
        tile1Field.tile = tile2;
        tile2.field = tile1Field;
        tile2Field.tile = tile1;
        tile1.field = tile2Field;
    }
}
exports.Board = Board;
