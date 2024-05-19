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
exports.Tile = void 0;
const PIXI = __importStar(require("pixi.js"));
const gsap_1 = __importDefault(require("gsap"));
class Tile {
    constructor(texture, type) {
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.width = 50;
        this.sprite.height = 50;
        this.sprite.anchor.set(0.5);
        this.type = type;
        this.field = null;
    }
    setPosition(position) {
        this.sprite.x = position.x;
        this.sprite.y = position.y;
    }
    moveTo(position, duration, delay = 0, ease = "linear") {
        return new Promise(resolve => {
            gsap_1.default.to(this.sprite, {
                x: position.x,
                y: position.y,
                duration,
                delay,
                ease,
                onComplete: () => resolve()
            });
        });
    }
    fallDownTo(position, delay = 0) {
        return this.moveTo(position, 0.5, delay, "bounce.out");
    }
    remove() {
        if (this.sprite.parent) {
            this.sprite.parent.removeChild(this.sprite);
        }
        if (this.field) {
            this.field.tile = null;
        }
    }
    isNeighbour(tile) {
        if (!this.field || !tile.field)
            return false;
        const rowDiff = Math.abs(this.field.row - tile.field.row);
        const colDiff = Math.abs(this.field.col - tile.field.col);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }
}
exports.Tile = Tile;
