import * as PIXI from 'pixi.js';
import { Game } from './Game';

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
        if(resources['BlueTile'] && resources['GreenTile'] && resources['RedTile']){
            const textures = [
                resources['BlueTile'].texture,
                resources['GreenTile'].texture,
                resources['RedTile'].texture,
            ];
            const game = new Game(app, textures, 60);
            app.stage.addChild(game.container);
        }

    } else {
        console.error('Error: Resources object is undefined.');
    }
});
