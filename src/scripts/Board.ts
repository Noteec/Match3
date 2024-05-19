import * as PIXI from "pixi.js";
import { Field } from "./Field";
import { Tile } from "./Tile";

export class Board {
    container: PIXI.Container;
    fields: Field[];
    rows: number;
    cols: number;
    private textures: PIXI.Texture[];
    fieldSize: number;
    width: number;
    height: number;

    constructor(textures: PIXI.Texture[]) {
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

    create(): void {
        this.createFields();
        this.createTiles();
    }

    createTiles(): void {
        this.fields.forEach(field => this.createTile(field));
    }

    createTile(field: Field): Tile {
        const randomTileType = Math.floor(Math.random() * 3);
        const tile = new Tile(this.textures[randomTileType], randomTileType);
        field.setTile(tile);
        this.container.addChild(tile.sprite);

        tile.sprite.interactive = true;
        tile.sprite.on("pointerdown", () => {
            this.container.emit('tile-touch-start', tile);
        });

        return tile;
    }

    getField(row: number, col: number): Field | undefined {
        return this.fields.find(field => field.row === row && field.col === col);
    }

    createFields(): void {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.createField(row, col);
            }
        }
    }

    createField(row: number, col: number): void {
        const field = new Field(row, col);
        this.fields.push(field);
        this.container.addChild(field.sprite);
    }

    ajustPosition(): void {
        if (this.fields.length === 0) return; // Проверка на пустой массив полей

        this.fieldSize = this.fields[0].sprite.width;
        this.width = this.cols * this.fieldSize;
        this.height = this.rows * this.fieldSize;
        this.container.x = (window.innerWidth - this.width) / 2 + this.fieldSize / 2;
        this.container.y = (window.innerHeight - this.height) / 2 + this.fieldSize / 2;
        }
        
    swap(tile1: Tile, tile2: Tile): void {
        const tile1Field = tile1.field;
        const tile2Field = tile2.field;

        if (!tile1Field || !tile2Field) return; // Проверка на наличие поля у тайлов

        tile1Field.tile = tile2;
        tile2.field = tile1Field;

        tile2Field.tile = tile1;
        tile1.field = tile2Field;
    }
}