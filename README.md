# Assignment 02 - Web Mario

The assignment requires a Cocos Creator 2.4.8 2D Mario-style game. The Cocos Creator project root is this folder:

`C:\HTML5\Assignment02`

For grading, open this folder as the Cocos Creator 2.4.8 project. Backup files from the standalone browser preview were moved outside this project to `C:\HTML5\Assignment02_backup`.

## How to Run

Open `C:\HTML5\Assignment02` with Cocos Creator 2.4.8, the normal 2D Creator editor.

1. Open Cocos Dashboard.
2. Import / Open `C:\HTML5\Assignment02`.
3. Open `assets/menu.fire`.
4. Press Preview.

## Controls

- Move: `A` / `D` or left / right arrow keys
- Jump: `W`, `Space`, or up arrow
- Pause: `P` or the pause button

## Implemented Scoring Items

- Complete Game Process (5%): start menu, level select, gameplay view, level clear, game over, pause, return-to-menu flow
- World Map (10%): gravity, rectangle collision, falling objects, moving camera, provided background art, two world maps
- Level Design (5%): static walls, pipes, cloud platforms, jumpable pits, stair sections, elevated parkour routes, question blocks, enemies, goal flag
- Player (15%): keyboard movement, jump, hurt/life decrease, out-of-bounds life loss, respawn at initial position, temporary invincibility blink, bigger Mario after question block
- Enemies (15%): Goomba enemies with gravity/collision, patrol movement, stomp-only defeat, side collision hurts player
- Question Blocks (5%): question blocks react when hit from below, change to used block, give score, spawn a provided mushroom item, and make Mario bigger after collection
- Animations (10%): Mario idle/walk/jump atlas frames, Goomba atlas animation, question block bump, invincibility blink
- Sound Effects (10%): looping BGM, jump, hurt/die, stomp, coin, mushroom power up, level clear, game over; one-shot SFX do not stop BGM
- UI (10%): life, score, world, timer, HUD icons from provided assets
- Appearance (10%): provided title/menu/button/tile/player/enemy/flag/UI image assets, terrain tiles, pipe tiles, wall tiles, decorative hills/bushes/clouds, HUD icons, full menu/background art

## Assets

The game uses the provided `AS2_source` image and audio assets from the assignment package, including:

- `pictures/title_0.png`, `menu_bg.png`, `button_blue.png`, `button_orange.png`
- `pictures/life.png`, `world.png`, `timer.png`, `flag.png`
- `player/mario_small.png`
- `enemies/Goomba.png`
- `effects_UI_tiles/tiles.png`, `effects_UI_tiles/tiles.plist`, `effects_UI_tiles/items.png`, `effects_UI_tiles/items.plist`, `effects_UI_tiles/tileset.png`
- `audio/bgm_1.mp3`, `jump.wav`, `loseOneLife.wav`, `stomp.wav`, `coin.wav`, `PowerUp.mp3`, `levelClear.mp3`, `Game Over.mp3`

Most visible game objects are rendered from the provided assets through Cocos Sprite/SpriteAtlas resources. Labels are used only for dynamic text such as score, time, and menu commands.

## Bonus / Extra Features

- Two selectable levels with different terrain difficulty
- Asset-based parkour layout with pipes, walls, cloud platforms, gaps, stairs, elevated block routes, visible mushroom power-ups, and non-collision scenery details
- Pause system
- Invincibility blink after taking damage

## Submission Notes

- Root scene: `assets/menu.fire`
- Main script: `assets/Scripts/WebMarioGame.js`
- AI usage report: `AI_reference.pdf`
- Do not include `node_modules` in the submitted zip.
- After zipping, generate and submit the MD5 checksum required by the assignment.
