import * as PIXI from "pixi.js";
import { Tile } from "./Tile";

export class Field {
    row: number; 
    col: number; 
    sprite: PIXI.Sprite;
    selected: PIXI.Sprite; 
    tile: Tile | null; 

    // Пути к текстурам поля и выбранного поля
    private static readonly fieldTexturePath: string = "../src/assets/field.png";
    private static readonly selectedTexturePath: string = "../src/assets/fieldS.png";

    constructor(row: number, col: number) {
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

    unselect(): void {
        this.selected.visible = false;
    }

    select(): void {
        this.selected.visible = true;
    }

    get position(): { x: number, y: number } {
        // Метод для получения позиции поля в пикселях
        return {
            x: this.col * this.sprite.width,
            y: this.row * this.sprite.height
        };
    }

    setTile(tile: Tile): void {
        // Метод для установки плитки на поле
        this.tile = tile;
        this.tile.field = this;
        tile.setPosition(this.position);
    }
}
