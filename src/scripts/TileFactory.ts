import * as PIXI from 'pixi.js';
import { Tile } from './Tile';

export class TileFactory {
    static generate(): Tile {
        // Массив возможных текстур
        const textures: PIXI.Texture[] = [
            PIXI.Texture.from('../src/assets/BlueTile.png'), 
            PIXI.Texture.from('../src/assets/RedTile.png'), 
            PIXI.Texture.from('../src/assets/GreenTile.png')
        ]; // Добавьте другие текстуры по мере необходимости

        // Выбираем случайную текстуру из массива
        const textureIndex = Math.floor(Math.random() * textures.length);
        const texture = textures[textureIndex];

        // Создаем тайл с выбранной текстурой
        return new Tile(texture, textureIndex);
    }
}
