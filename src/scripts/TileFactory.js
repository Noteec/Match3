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
exports.TileFactory = void 0;
const PIXI = __importStar(require("pixi.js"));
const Tile_1 = require("./Tile");
class TileFactory {
    static generate() {
        // Массив возможных текстур
        const textures = [
            PIXI.Texture.from('../src/assets/BlueTile.png'),
            PIXI.Texture.from('../src/assets/RedTile.png'),
            PIXI.Texture.from('../src/assets/GreenTile.png')
        ]; // Добавьте другие текстуры по мере необходимости
        // Выбираем случайную текстуру из массива
        const textureIndex = Math.floor(Math.random() * textures.length);
        const texture = textures[textureIndex];
        // Создаем тайл с выбранной текстурой
        return new Tile_1.Tile(texture, textureIndex);
    }
}
exports.TileFactory = TileFactory;
