"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombinationManager = void 0;
class CombinationManager {
    constructor(board) {
        this.board = board;
    }
    getMatches() {
        const matches = [];
        const matchedTiles = new Set(); // Сет для хранения всех уникальных совпадений
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
        const tileTypeMap = new Map();
        matchedTiles.forEach(tile => {
            var _a;
            if (!tileTypeMap.has(tile.type)) {
                tileTypeMap.set(tile.type, []);
            }
            (_a = tileTypeMap.get(tile.type)) === null || _a === void 0 ? void 0 : _a.push(tile);
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
    findMatch(startRow, startCol, dx, dy) {
        var _a, _b;
        const match = [];
        const initialTile = (_a = this.board.getField(startRow, startCol)) === null || _a === void 0 ? void 0 : _a.tile;
        if (!initialTile)
            return match;
        match.push(initialTile);
        let row = startRow + dy;
        let col = startCol + dx;
        while (row < this.board.rows && col < this.board.cols) {
            const tile = (_b = this.board.getField(row, col)) === null || _b === void 0 ? void 0 : _b.tile;
            if (tile && tile.type === initialTile.type) {
                match.push(tile);
            }
            else {
                break;
            }
            row += dy;
            col += dx;
        }
        return match;
    }
}
exports.CombinationManager = CombinationManager;
