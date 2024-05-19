import * as PIXI from 'pixi.js';
import { Game } from './Game';


// Create a Pixi.js application
const app = new PIXI.Application({
    width: window.innerWidth, // Set initial width to window width
    height: window.innerHeight, // Set initial height to window height
    backgroundColor: 0x1099bb,
});

// Append the Pixi.js application canvas to the HTML document
document.body.appendChild(app.view);


// Load game assets (e.g., textures, spritesheets)
// Add assets to load
const loader = PIXI.Loader.shared;

loader.add('BlueTile', '../src/assets/BlueTile.png')
      .add('GreenTile', '../src/assets/GreenTile.png')
      .add('RedTile', '../src/assets/RedTile.png');

// Listen for load completion
loader.load((loader, resources) => {
    // Check if resources is defined
    if (resources) {
        // Ensure all resources are loaded
        if (resources['BlueTile'] && resources['GreenTile'] && resources['RedTile']) {
            const textures = [
                resources['BlueTile'].texture,
                resources['GreenTile'].texture,
                resources['RedTile'].texture,
            ];

            const playField = new Game(app,textures, 20);
            app.stage.addChild(playField.container)
        } else {
            console.error('Error: Not all resources were loaded.');
        }
    } else {
        console.error('Error: Resources object is undefined.');
    }
});