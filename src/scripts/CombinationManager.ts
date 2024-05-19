import { Board } from "./Board";
import { Tile } from "./Tile";

export class CombinationManager {
    private board: Board;

    constructor(board: Board) {
        this.board = board;
    }

    getMatches(): Tile[][] {
        const matches: Tile[][] = [];
        const matchedTiles = new Set<Tile>(); // Сет для хранения всех уникальных совпадений

        for (let row = 0; row < this.board.rows; row++) {
            for (let col = 0; col < this.board.cols; col++) {
                const horizontalMatch = this.findMatch(row, col, 1, 0);
                const verticalMatch = this.findMatch(row, col, 0, 1);

                if (horizontalMatch.length >= 3) {
                    horizontalMatch.forEach(tile => matchedTiles.add(tile));
                }
                if (verticalMatch.length >= 3) {
                    verticalMatch.forEach(tile => matchedTiles.add(tile));
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
                    field.tile = null;
                }
            });
        });

        return matches;
    }

    private findMatch(startRow: number, startCol: number, dx: number, dy: number): Tile[] {
        const match: Tile[] = [];
        const initialTile = this.board.getField(startRow, startCol)?.tile;

        if (!initialTile) return match;

        match.push(initialTile);

        let row = startRow + dy;
        let col = startCol + dx;

        while (row < this.board.rows && col < this.board.cols) {
            const tile = this.board.getField(row, col)?.tile;
            if (tile && tile.type === initialTile.type) {
                match.push(tile);
            } else {
                break;
            }
            row += dy;
            col += dx;
        }

        return match;
    }
}
