import * as PIXI from "pixi.js";
import gsap from "gsap";
import { Field } from "./Field";

export class Tile {
    sprite: PIXI.Sprite;
    type: number;
    field: Field | null; // Поле, на котором находится плитка

    constructor(texture: PIXI.Texture, type: number) {
        this.sprite = new PIXI.Sprite(texture); // Создание спрайта с переданной текстурой
        this.sprite.width = 50;
        this.sprite.height = 50;
        this.sprite.anchor.set(0.5);
        this.type = type;
        this.field = null;
    }

    setPosition(position: { x: number, y: number }): void {
        // Установка позиции спрайта
        this.sprite.x = position.x;
        this.sprite.y = position.y;
    }

    moveTo(position: { x: number, y: number }, duration: number, delay: number = 0, ease: string = "linear"): Promise<void> {
        // Анимация перемещения плитки к заданной позиции
        return new Promise(resolve => {
            gsap.to(this.sprite, {
                x: position.x,
                y: position.y,
                duration, // Продолжительность анимации
                delay, // Задержка перед началом анимации
                ease, // Тип плавности анимации
                onComplete: () => resolve()
            });
        });
    }

    fallDownTo(position: { x: number, y: number }, delay: number = 0): Promise<void> {
        // Анимация падения плитки к заданной позиции с эффектом "bounce"
        return this.moveTo(position, 0.5, delay, "bounce.out");
    }

    remove(): void {
        // Удаление спрайта плитки и освобождение поля
        if (this.sprite.parent) {
            this.sprite.parent.removeChild(this.sprite);
        }
        if (this.field) {
            this.field.tile = null;
        }
    }

    isNeighbour(tile: Tile): boolean {
        // Проверка, является ли данная плитка соседней по отношению к другой плитке
        if (!this.field || !tile.field) return false;

        const rowDiff = Math.abs(this.field.row - tile.field.row);
        const colDiff = Math.abs(this.field.col - tile.field.col);

        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }
}
