import { Board } from "./Board";
import { Tile } from "./Tile";

export class CombinationManager {
    private board: Board; // Доска, на которой будут находиться комбинации

    constructor(board: Board) {
        this.board = board;
    }

    getMatches(): Tile[][] {
        const matches: Tile[][] = [];
        const matchedTiles = new Set<Tile>(); // Сет для хранения всех уникальных совпадений

        // Поиск совпадений по строкам и столбцам
        for (let row = 0; row < this.board.rows; row++) {
            for (let col = 0; col < this.board.cols; col++) {
                const horizontalMatch = this.findMatch(row, col, 1, 0); // Поиск горизонтальных совпадений
                const verticalMatch = this.findMatch(row, col, 0, 1); // Поиск вертикальных совпадений

                if (horizontalMatch.length >= 3) {
                    horizontalMatch.forEach(tile => matchedTiles.add(tile)); // Добавление горизонтальных совпадений в сет
                }
                if (verticalMatch.length >= 3) {
                    verticalMatch.forEach(tile => matchedTiles.add(tile)); // Добавление вертикальных совпадений в сет
                }
            }
        }

        // Группируем совпадения по типу тайла
        const tileTypeMap = new Map<number, Tile[]>();
        matchedTiles.forEach(tile => {
            if (!tileTypeMap.has(tile.type)) {
                tileTypeMap.set(tile.type, []);
            }
            tileTypeMap.get(tile.type)?.push(tile);
        });

        // Добавляем совпадения в массив matches
        tileTypeMap.forEach((tiles) => {
            matches.push(tiles);
        });

        // Удаляем совпадения
        matches.forEach(match => {
            match.forEach(tile => {
                const field = tile.field;
                if (field) {
                    field.tile = null; // Устанавливаем поле плитки в null, чтобы удалить плитку
                }
            });
        });

        return matches;
    }


    private findMatch(startRow: number, startCol: number, dx: number, dy: number): Tile[] {
        const match: Tile[] = [];
        const initialTile = this.board.getField(startRow, startCol)?.tile; // Начальная плитка

        if (!initialTile) return match; // Если начальная плитка отсутствует, возвращаем пустой массив

        match.push(initialTile); // Добавляем начальную плитку в совпадение

        let row = startRow + dy;
        let col = startCol + dx;

        // Проход по строкам и столбцам, пока не выйдем за пределы доски
        while (row < this.board.rows && col < this.board.cols) {
            const tile = this.board.getField(row, col)?.tile;
            if (tile && tile.type === initialTile.type) {
                match.push(tile); // Добавляем плитку в совпадение, если она того же типа
            } else {
                break; // Прерываем цикл, если тип плитки не совпадает
            }
            row += dy;
            col += dx;
        }

        return match; // Возвращаем массив найденных плиток
    }
}
