import * as PIXI from "pixi.js";
import { Board } from "./Board";
import { Tile } from "./Tile";
import { CombinationManager } from "./CombinationManager";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { HUD } from "./HUD";
import { Howl, Howler } from 'howler';

// Регистрация плагина PixiPlugin в GSAP
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
    destroySound: Howl;
    backgroundMusic: Howl;

    constructor(app: PIXI.Application, textures: PIXI.Texture[], gameDuration: number) {
        this.container = new PIXI.Container();
        this.container.sortableChildren = true; // Разрешить сортировку детей по zIndex

        this.board = new Board(textures);
        this.container.addChild(this.board.container);

        this.combinationManager = new CombinationManager(this.board);

        this.hud = new HUD(app, gameDuration, this);
        this.container.addChild(this.hud.container);

        // Обработка кликов по тайлам
        this.board.container.on('tile-touch-start', this.onTileClick.bind(this));

        // Первоначальное удаление совпадений
        this.isInitialRemoval = true;
        this.removeStartMatches();
        this.isInitialRemoval = false;

        this.disabled = false;
        this.selectedTile = null;

        // Добавление метода update в тикер приложения
        app.ticker.add(this.update.bind(this));

        // Инициализация звуков
        this.destroySound = new Howl({
            src: ['../src/assets/destroySound.mp3'],
            volume: 0.5
        });

        this.backgroundMusic = new Howl({
            src: ['../src/assets/BGM.mp3'],
            loop: true,
            volume: 0.5
        });

        // Запуск фоновой музыки
        this.backgroundMusic.play();
    }

    // Метод обновления HUD
    update(): void {
        this.hud.update();
    }

    // Включение/выключение звука
    toggleSound(isSoundOn: boolean) {
        this.destroySound.mute(!isSoundOn);
    }

    // Включение/выключение музыки
    toggleMusic(isMusicOn: boolean) {
        this.backgroundMusic.mute(!isMusicOn);
    }

    // Удаление начальных совпадений
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

    // Обработка клика по тайлу
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

    // Смена местами двух тайлов
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

    // Удаление совпадений
    removeMatches(matches: Tile[][]): void {
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

        // Воспроизведение звука передвижения
        if (this.destroySound) {
            console.log("Playing move sound");
            this.destroySound.play();
        } else {
            console.log("Move sound not initialized");
        }
    }

    // Обработка совпадений
    processMatches(matches: Tile[][]): void {
        this.removeMatches(matches);
        this.processFallDown()
            .then(() => this.addTiles())
            .then(() => this.onFallDownOver());
    }

    // Метод вызывается после окончания падения тайлов
    onFallDownOver(): void {
        const matches = this.combinationManager.getMatches();

        if (matches.length) {
            this.processMatches(matches)
        } else {
            this.disabled = false;
        }
    }

    // Добавление новых тайлов
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

    // Обработка падения тайлов
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

    // Падение тайла в пустое поле
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

    // Очистка выделения тайла
    clearSelection(): void {
        if (this.selectedTile && this.selectedTile.field) {
            this.selectedTile.field.unselect();
            this.selectedTile = null;
        }
    }

    // Выбор тайла
    selectTile(tile: Tile): void {
        this.selectedTile = tile;
        this.selectedTile.field?.select();
    }

    endGame(): void {
        this.disabled = true;
        this.backgroundMusic.stop(); // Останавливаем фоновую музыку

        const gameOverText = new PIXI.Text('Game Over', { fontSize: 48, fill: '#ff0000', align: 'center' });
        gameOverText.anchor.set(0.5);
        gameOverText.position.set(this.container.width / 2, this.container.height / 2);
        this.container.addChild(gameOverText);

        const finalScoreText = new PIXI.Text(`Your Score: ${this.hud.score}`, { fontSize: 36, fill: '#ffffff', align: 'center' });
        finalScoreText.anchor.set(0.5);
        finalScoreText.position.set(this.container.width / 2, this.container.height / 2 + 60);
        this.container.addChild(finalScoreText);
    }
}
