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
exports.Field = void 0;
const PIXI = __importStar(require("pixi.js"));
class Field {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        // Создание спрайта поля
        this.sprite = new PIXI.Sprite(PIXI.Texture.from(Field.fieldTexturePath));
        this.sprite.width = 100;
        this.sprite.height = 100;
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
        this.sprite.anchor.set(0.5);
        // Создание спрайта для выбранного состояния поля
        this.selected = new PIXI.Sprite(PIXI.Texture.from(Field.selectedTexturePath));
        this.selected.anchor.set(0.5);
        this.selected.visible = false; // Спрайт по умолчанию не виден
        // Добавление спрайта выбранного состояния под основной спрайт
        this.sprite.addChildAt(this.selected, 0);
        this.tile = null;
    }
    unselect() {
        this.selected.visible = false;
    }
    select() {
        this.selected.visible = true;
    }
    get position() {
        // Метод для получения позиции поля в пикселях
        return {
            x: this.col * this.sprite.width,
            y: this.row * this.sprite.height
        };
    }
    setTile(tile) {
        // Метод для установки плитки на поле
        this.tile = tile;
        this.tile.field = this;
        tile.setPosition(this.position);
    }
}
exports.Field = Field;
// Пути к текстурам поля и выбранного поля
Field.fieldTexturePath = "../src/assets/field.png";
Field.selectedTexturePath = "../src/assets/fieldS.png";
