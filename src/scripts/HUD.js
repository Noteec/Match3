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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HUD = void 0;
const PIXI = __importStar(require("pixi.js"));
class HUD {
    constructor(app, duration, game) {
        this.container = new PIXI.Container();
        this.score = 0;
        this.duration = duration; // Продолжительность игры в секундах
        this.startTime = Date.now();
        this.game = game;
        this.gameOver = false;
        // Настройка текста для отображения очков
        this.scoreText = new PIXI.Text(`Score: ${this.score}`, { fontSize: 24, fill: "#ffffff" });
        this.scoreText.position.set(10, 10); // Позиция текста счёта на экране
        this.container.addChild(this.scoreText);
        // Настройка текста для отображения таймера
        this.timerText = new PIXI.Text(`Time: ${this.formatTime(duration)}`, { fontSize: 24, fill: "#ffffff" });
        this.timerText.position.set(app.screen.width - 150, 10); // Позиция текста таймера на экране
        this.container.addChild(this.timerText);
        // Настройка кнопок для управления звуком и музыкой
        this.soundButton = new PIXI.Sprite(PIXI.Texture.from('soundOn'));
        this.soundButton.interactive = true; // Делаем кнопку интерактивной
        this.soundButton.buttonMode = true; // Меняем курсор при наведении
        this.soundButton.position.set(10, 50);
        this.soundButton.scale.set(0.2, 0.2); // Уменьшение размера спрайта до 20% 
        this.container.addChild(this.soundButton);
        this.musicButton = new PIXI.Sprite(PIXI.Texture.from('musicOn'));
        this.musicButton.interactive = true; // Делаем кнопку интерактивной
        this.musicButton.buttonMode = true; // Меняем курсор при наведении
        this.musicButton.position.set(10, 150);
        this.musicButton.scale.set(0.2, 0.2); // Уменьшение размера спрайта до 20%
        this.container.addChild(this.musicButton);
        // Начальные состояния звука и музыки включены
        this.isSoundOn = true;
        this.isMusicOn = true;
        // Обработчик нажатия на кнопку звука
        this.soundButton.on('pointerdown', () => {
            this.isSoundOn = !this.isSoundOn;
            this.soundButton.texture = PIXI.Texture.from(this.isSoundOn ? 'soundOn' : 'soundOff'); // Меняем текстуру кнопки
            this.game.toggleSound(this.isSoundOn); // Включаем/выключаем звук в игре
        });
        // Обработчик нажатия на кнопку музыки
        this.musicButton.on('pointerdown', () => {
            this.isMusicOn = !this.isMusicOn;
            this.musicButton.texture = PIXI.Texture.from(this.isMusicOn ? 'musicOn' : 'musicOff'); // Меняем текстуру кнопки
            this.game.toggleMusic(this.isMusicOn); // Включаем/выключаем музыку в игре
        });
    }
    // Метод обновления HUD
    update() {
        const elapsedTime = Date.now() - this.startTime; // Прошедшее время с начала игры
        const remainingTime = this.duration - Math.floor(elapsedTime / 1000); // Оставшееся время
        if (remainingTime >= 0) {
            this.timerText.text = `Time: ${this.formatTime(remainingTime)}`; // Обновляем текст таймера
        }
        else {
            this.timerText.text = `Time: 00:00`; // Если время истекло, устанавливаем 00:00
            if (!this.gameOver) {
                this.gameOver = true;
                this.game.endGame(); // Вызываем метод окончания игры
            }
        }
    }
    // Метод для добавления очков
    addScore(points) {
        this.score += points; // Увеличиваем счёт
        this.scoreText.text = `Score: ${this.score}`; // Обновляем текст счёта
    }
    // Форматирование времени в формат MM:SS
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    }
}
exports.HUD = HUD;
