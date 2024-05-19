import * as PIXI from "pixi.js";
import { Board } from "./Board";
import { Tile } from "./Tile";
import { CombinationManager } from "./CombinationManager";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { HUD } from "./HUD";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class Game {
    container: PIXI.Container;
    board: Board;
    combinationManager: CombinationManager;
    disabled: boolean;
    selectedTile: Tile | null;
    hud: HUD;
    isInitialRemoval: boolean;

    constructor(app: PIXI.Application, textures: PIXI.Texture[], gameDuration: number) {
        this.container = new PIXI.Container();
        this.container.sortableChildren = true; // Разрешить сортировку детей по zIndex

        this.board = new Board(textures);
        this.container.addChild(this.board.container);

        this.combinationManager = new CombinationManager(this.board);

        this.hud = new HUD(app, gameDuration);
        this.container.addChild(this.hud.container);

        this.board.container.on('tile-touch-start', this.onTileClick.bind(this));

        this.isInitialRemoval = true;
        this.removeStartMatches();
        this.isInitialRemoval = false;

        this.disabled = false;
        this.selectedTile = null;

        app.ticker.add(this.update.bind(this)); // Добавить метод update в тикер приложения
    }

    update(): void {
        this.hud.update();
    }

    removeStartMatches(): void {
        let matches = this.combinationManager.getMatches();

        while (matches.length) {
            this.removeMatches(matches);

            const fields = this.board.fields.filter(field => field.tile === null);

            fields.forEach(field => {
                this.board.createTile(field);
            });

            matches = this.combinationManager.getMatches();
        }
    }

    onTileClick(tile: Tile): void {
        if (this.disabled) {
            return;
        }
        if (this.selectedTile) {
            if (!this.selectedTile.isNeighbour(tile)) {
                this.clearSelection();
                this.selectTile(tile);
            } else {
                this.swap(this.selectedTile, tile);
            }
        } else {
            this.selectTile(tile);
        }
    }

    swap(selectedTile: Tile, tile: Tile, reverse: boolean = false): void {
        this.disabled = true;
        selectedTile.sprite.zIndex = 2;
        if (tile.field && selectedTile.field) {
            selectedTile.moveTo(tile.field.position, 0.2, 0.2, "Power2.easeOut");
            this.clearSelection();

            tile.moveTo(selectedTile.field.position, 0.2, 0.2, "Power2.easeOut").then(() => {
                this.board.swap(selectedTile, tile);

                if (!reverse) {
                    const matches = this.combinationManager.getMatches();
                    if (matches.length) {
                        this.processMatches(matches);
                    } else {
                        this.swap(tile, selectedTile, true);
                    }
                } else {
                    this.disabled = false;
                }
            });
        }
    }

    removeMatches(matches: Tile[][]): void {
        console.log(matches);
        console.log(matches.length);
        
        matches.forEach(match => {
            match.forEach(tile => {
                if (tile) {
                    tile.remove();
                    if (!this.isInitialRemoval) {
                        this.hud.addScore(1);
                    }
                }
            });
        });
    }

    processMatches(matches: Tile[][]): void {
        this.removeMatches(matches);
        this.processFallDown()
            .then(() => this.addTiles())
            .then(() => this.onFallDownOver());
    }

    onFallDownOver(): void {
        const matches = this.combinationManager.getMatches();

        if (matches.length) {
            this.processMatches(matches)
        } else {
            this.disabled = false;
        }
    }

    addTiles(): Promise<void> {
        return new Promise(resolve => {
            const fields = this.board.fields.filter(field => field.tile === null);
            let total = fields.length;
            let completed = 0;

            fields.forEach(field => {
                const tile = this.board.createTile(field);
                tile.sprite.y = -500;
                const delay = Math.random() * 2 / 10 + 0.3 / (field.row + 1);
                tile.fallDownTo(field.position, delay).then(() => {
                    ++completed;
                    if (completed >= total) {
                        resolve();
                    }
                });
            });
        });
    }

    processFallDown(): Promise<void> {
        return new Promise(resolve => {
            let completed = 0;
            let started = 0;

            for (let row = this.board.rows - 1; row >= 0; row--) {
                for (let col = this.board.cols - 1; col >= 0; col--) {
                    const field = this.board.getField(row, col);
                    if (field && !field.tile) {
                        ++started;
                        this.fallDownTo(field).then(() => {
                            ++completed;
                            if (completed >= started) {
                                resolve();
                            }
                        });
                    }
                }
            }
        });
    }

    fallDownTo(emptyField: any): Promise<void> {
        for (let row = emptyField.row - 1; row >= 0; row--) {
            let fallingField = this.board.getField(row, emptyField.col);
            if (fallingField && fallingField.tile) {
                const fallingTile = fallingField.tile;
                fallingTile.field = emptyField;
                emptyField.tile = fallingTile;
                fallingField.tile = null;
                return fallingTile.fallDownTo(emptyField.position, 0.2);
            }
        }

        return Promise.resolve();
    }

    clearSelection(): void {
        if (this.selectedTile && this.selectedTile.field) {
            this.selectedTile.field.unselect();
            this.selectedTile = null;
        }
    }

    selectTile(tile: Tile): void {
        this.selectedTile = tile;
        this.selectedTile.field?.select();
    }
}
