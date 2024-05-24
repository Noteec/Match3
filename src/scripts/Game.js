"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const PIXI = __importStar(require("pixi.js"));
const Board_1 = require("./Board");
const CombinationManager_1 = require("./CombinationManager");
const gsap_1 = __importDefault(require("gsap"));
const PixiPlugin_1 = require("gsap/PixiPlugin");
const HUD_1 = require("./HUD");
const howler_1 = require("howler");
// Регистрация плагина PixiPlugin в GSAP
gsap_1.default.registerPlugin(PixiPlugin_1.PixiPlugin);
PixiPlugin_1.PixiPlugin.registerPIXI(PIXI);
class Game {
    constructor(app, textures, gameDuration) {
        this.container = new PIXI.Container();
        this.container.sortableChildren = true; // Разрешить сортировку детей по zIndex
        this.board = new Board_1.Board(textures);
        this.container.addChild(this.board.container);
        this.combinationManager = new CombinationManager_1.CombinationManager(this.board);
        this.hud = new HUD_1.HUD(app, gameDuration, this);
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
        this.destroySound = new howler_1.Howl({
            src: ['../src/assets/destroySound.mp3'],
            volume: 0.5
        });
        this.backgroundMusic = new howler_1.Howl({
            src: ['../src/assets/BGM.mp3'],
            loop: true,
            volume: 0.5
        });
        // Запуск фоновой музыки
        this.backgroundMusic.play();
    }
    // Метод обновления HUD
    update() {
        this.hud.update();
    }
    // Включение/выключение звука
    toggleSound(isSoundOn) {
        this.destroySound.mute(!isSoundOn);
    }
    // Включение/выключение музыки
    toggleMusic(isMusicOn) {
        this.backgroundMusic.mute(!isMusicOn);
    }
    // Удаление начальных совпадений
    removeStartMatches() {
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
    onTileClick(tile) {
        if (this.disabled) {
            return;
        }
        if (this.selectedTile) {
            if (!this.selectedTile.isNeighbour(tile)) {
                this.clearSelection();
                this.selectTile(tile);
            }
            else {
                this.swap(this.selectedTile, tile);
            }
        }
        else {
            this.selectTile(tile);
        }
    }
    // Смена местами двух тайлов
    swap(selectedTile, tile, reverse = false) {
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
                    }
                    else {
                        this.swap(tile, selectedTile, true);
                    }
                }
                else {
                    this.disabled = false;
                }
            });
        }
    }
    // Удаление совпадений
    removeMatches(matches) {
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
        }
        else {
            console.log("Move sound not initialized");
        }
    }
    // Обработка совпадений
    processMatches(matches) {
        this.removeMatches(matches);
        this.processFallDown()
            .then(() => this.addTiles())
            .then(() => this.onFallDownOver());
    }
    // Метод вызывается после окончания падения тайлов
    onFallDownOver() {
        const matches = this.combinationManager.getMatches();
        if (matches.length) {
            this.processMatches(matches);
        }
        else {
            this.disabled = false;
        }
    }
    // Добавление новых тайлов
    addTiles() {
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
    processFallDown() {
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
    fallDownTo(emptyField) {
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
    clearSelection() {
        if (this.selectedTile && this.selectedTile.field) {
            this.selectedTile.field.unselect();
            this.selectedTile = null;
        }
    }
    // Выбор тайла
    selectTile(tile) {
        var _a;
        this.selectedTile = tile;
        (_a = this.selectedTile.field) === null || _a === void 0 ? void 0 : _a.select();
    }
    endGame() {
        this.disabled = true; // Отключаем взаимодействие
        this.backgroundMusic.stop(); // Останавливаем фоновую музыку
        // Создаем серый прямоугольник для текста "Game Over"
        const gameOverBackground = new PIXI.Graphics();
        gameOverBackground.beginFill(0x666666); // Серый цвет
        gameOverBackground.drawRect(0, 0, 300, 100); // Размеры прямоугольника подберите под свои нужды
        gameOverBackground.endFill();
        gameOverBackground.pivot.set(150, 50); // Центр прямоугольника
        gameOverBackground.position.set(this.container.width / 2, this.container.height / 2); // Позиция прямоугольника
        this.container.addChild(gameOverBackground);
        // Текст "Game Over"
        const gameOverText = new PIXI.Text('Game Over', { fontSize: 48, fill: '#ff0000', align: 'center' });
        gameOverText.anchor.set(0.5);
        gameOverText.position.set(this.container.width / 2, this.container.height / 2);
        this.container.addChild(gameOverText);
        // Текст итогового счета
        const finalScoreText = new PIXI.Text(`Your Score: ${this.hud.score}`, { fontSize: 36, fill: '#ffffff', align: 'center' });
        finalScoreText.anchor.set(0.5);
        finalScoreText.position.set(this.container.width / 2, this.container.height / 2 + 60);
        this.container.addChild(finalScoreText);
    }
}
exports.Game = Game;
