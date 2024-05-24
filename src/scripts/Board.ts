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
        this.create(); // Создание доски
        this.ajustPosition(); // Настройка позиции доски
    }

    create(): void {
        // Создание полей и плиток на доске
        this.createFields();
        this.createTiles();
    }

    createTiles(): void {
        // Создание плиток для каждого поля
        this.fields.forEach(field => this.createTile(field));
    }

    createTile(field: Field): Tile {
        // Создание плитки для конкретного поля
        const randomTileType = Math.floor(Math.random() * 3); // Случайный тип плитки
        const tile = new Tile(this.textures[randomTileType], randomTileType); // Создание новой плитки
        field.setTile(tile); // Установка плитки на поле
        this.container.addChild(tile.sprite); // Добавление спрайта плитки в контейнер

        tile.sprite.interactive = true; // Делает спрайт интерактивным
        tile.sprite.on("pointerdown", () => {
            // Обработка события клика по плитке
            this.container.emit('tile-touch-start', tile);
        });

        return tile; 
    }

    getField(row: number, col: number): Field | undefined {
        // Получение поля по строке и столбцу
        return this.fields.find(field => field.row === row && field.col === col);
    }

    createFields(): void {
        // Создание всех полей на доске
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.createField(row, col);
            }
        }
    }

    createField(row: number, col: number): void {
        // Создание одного поля
        const field = new Field(row, col); // Создание нового поля
        this.fields.push(field); // Добавление поля в массив полей
        this.container.addChild(field.sprite); // Добавление спрайта поля в контейнер
    }

    ajustPosition(): void {
        // Настройка позиции доски в окне
        if (this.fields.length === 0) return; // Проверка на пустой массив полей

        this.fieldSize = this.fields[0].sprite.width; // Установка размера поля
        this.width = this.cols * this.fieldSize; // Вычисление ширины доски
        this.height = this.rows * this.fieldSize; // Вычисление высоты доски
        this.container.x = (window.innerWidth - this.width) / 2 + this.fieldSize / 2; // Центрирование доски по горизонтали
        this.container.y = (window.innerHeight - this.height) / 2 + this.fieldSize / 2; // Центрирование доски по вертикали
    }

    swap(tile1: Tile, tile2: Tile): void {
        // Метод для обмена плиток местами
        const tile1Field = tile1.field;
        const tile2Field = tile2.field;

        if (!tile1Field || !tile2Field) return; // Проверка на наличие поля у плиток

        // Обмен полями плиток
        tile1Field.tile = tile2;
        tile2.field = tile1Field;

        tile2Field.tile = tile1;
        tile1.field = tile2Field;
    }
}
