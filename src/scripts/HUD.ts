import * as PIXI from "pixi.js";

export class HUD {
    container: PIXI.Container;
    scoreText: PIXI.Text;
    timerText: PIXI.Text;
    score: number;
    startTime: number;
    duration: number;

    constructor(app: PIXI.Application, duration: number) {
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

    update(): void {
        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = this.duration - Math.floor(elapsedTime / 1000);

        if (remainingTime >= 0) {
            this.timerText.text = `Time: ${this.formatTime(remainingTime)}`;
        } else {
            this.timerText.text = `Time: 00:00`;
            // Логика для окончания игры
        }
    }

    addScore(points: number): void {
        this.score += points;
        this.scoreText.text = `Score: ${this.score}`;
    }

    formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    }
}
