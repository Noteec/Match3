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
    constructor(app, duration) {
        this.container = new PIXI.Container();
        // Установка начальных значений
        this.score = 0;
        this.duration = duration;
        this.startTime = Date.now();
        // Настройка текста для отображения очков
        this.scoreText = new PIXI.Text(`Score: ${this.score}`, { fontSize: 24, fill: "#ffffff" });
        this.scoreText.position.set(10, 10);
        this.container.addChild(this.scoreText);
        // Настройка текста для отображения таймера
        this.timerText = new PIXI.Text(`Time: ${this.formatTime(duration)}`, { fontSize: 24, fill: "#ffffff" });
        this.timerText.position.set(app.screen.width - 150, 10);
        this.container.addChild(this.timerText);
    }
    update() {
        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = this.duration - Math.floor(elapsedTime / 1000);
        if (remainingTime >= 0) {
            this.timerText.text = `Time: ${this.formatTime(remainingTime)}`;
        }
        else {
            this.timerText.text = `Time: 00:00`;
            // Логика для окончания игры
        }
    }
    addScore(points) {
        this.score += points;
        this.scoreText.text = `Score: ${this.score}`;
    }
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    }
}
exports.HUD = HUD;
