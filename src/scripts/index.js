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
const PIXI = __importStar(require("pixi.js"));
const Game_1 = require("./Game");
// Create a Pixi.js application
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x1099bb,
});
// Append the Pixi.js application canvas to the HTML document
document.body.appendChild(app.view);
// Load game assets (e.g., textures, spritesheets)
const loader = PIXI.Loader.shared;
loader.add('BlueTile', '../src/assets/BlueTile.png')
    .add('GreenTile', '../src/assets/GreenTile.png')
    .add('RedTile', '../src/assets/RedTile.png')
    .add('soundOn', '../src/assets/soundOn.png')
    .add('soundOff', '../src/assets/soundOff.png')
    .add('musicOn', '../src/assets/musicOn.png')
    .add('musicOff', '../src/assets/musicOff.png');
// Listen for load completion
loader.load((loader, resources) => {
    if (resources) {
        if (resources['BlueTile'] && resources['GreenTile'] && resources['RedTile']) {
            const textures = [
                resources['BlueTile'].texture,
                resources['GreenTile'].texture,
                resources['RedTile'].texture,
            ];
            const game = new Game_1.Game(app, textures, 60);
            app.stage.addChild(game.container);
        }
    }
    else {
        console.error('Error: Resources object is undefined.');
    }
});
