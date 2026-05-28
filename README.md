# Assignment 02 - Web Mario

This project is a Cocos Creator 2.4.8 2D Mario-style platform game for CS2410 Software Studio Assignment 02.

## Project Links

- GitHub Repository: https://github.com/briannn0127/Super-Mario
- Firebase Hosting: https://supermario-777.web.app
- Cocos Creator Version: Creator 2.4.8
- Main Scene: `assets/menu.fire`
- Main Script: `assets/Scripts/WebMarioGame.js`

## How to Run

### Firebase Version

Open:

```text
https://supermario-777.web.app
```

### Cocos Creator Preview

1. Open Cocos Dashboard.
2. Use Cocos Creator 2.4.8, not Creator3D.
3. Open this folder as the project root:

```text
C:\HTML5\Assignment02
```

4. Open `assets/menu.fire`.
5. Press Preview.

## Controls

- Move: `A` / `D` or left / right arrow keys
- Jump: `W`, `Space`, or up arrow
- Pause: `P`
- Start game: click `START GAME` or press `Enter`
- Level select: click `LEVEL SELECT` or press `L`
- In level select: press `1` or `2`, or click a world button

## Completed Scoring Items

### Complete Game Process (5%)

- Start menu
- Level select
- Game scene
- Pause and resume
- Game over screen
- Course clear screen
- Restart / return-to-menu flow

### Basic Rules (50%)

World map:

- Gravity-based player and enemy movement
- Collision between player, enemies, blocks, platforms, ground, pipes, and walls
- Camera follows the player's position
- Two playable world maps, `WORLD 1-1` and `WORLD 1-2`

Level design:

- Static walls and brick platforms
- Ground gaps
- Pipes
- Cloud platforms
- Stairs and elevated parkour routes
- Question blocks
- Goal flag
- Different difficulty between level 1 and level 2

Player:

- Keyboard movement and jumping
- Life decreases when hit by enemies
- Life decreases when falling out of bounds
- Respawn at the initial position after losing a life
- Temporary invincibility after damage
- Small Mario can become big Mario after collecting a mushroom
- Big Mario becomes small Mario when damaged instead of dying immediately

Enemies:

- Goomba enemy
- Turtle enemy
- Flower enemy
- Enemy collision and patrol movement
- Stomping from above defeats enemies
- Side collision hurts the player

Question blocks:

- Question blocks react when hit from below
- Used blocks change appearance
- Blocks spawn mushrooms
- Mushrooms move and can be collected
- Mushroom collection increases score and powers up Mario

### Animations (10%)

- Small Mario idle, walk, and jump frames
- Big Mario frames
- Goomba animation
- Turtle animation
- Flower animation
- Question block bump effect
- Score popup and visual effects
- Invincibility blink after damage

### Sound Effects (10%)

- Background music
- Jump sound
- Hurt / lose-life sound
- Stomp sound
- Coin / question block sound
- Power-up appear sound
- Power-up collection sound
- Power-down sound
- Level clear sound
- Game over sound
- One-shot sound effects do not stop the BGM

### UI (10%)

- Life display
- Score display
- World display
- Timer display
- HUD icons from provided assets
- Result overlay
- Firebase leaderboard overlay

### Appearance (10%)

The game uses the provided assignment assets as much as possible:

- Menu background, title, and buttons
- Mario small and big sprites
- Goomba, Turtle, and Flower enemy sprites
- Tile, block, wall, pipe, ground, and question block images
- Mushroom and item sprites
- Flag image
- HUD icons
- Decorative hills, bushes, and clouds
- Audio assets from the provided package

## Bonus / Extra Features

- Firebase Hosting deployment
- Firebase Realtime Database leaderboard
- Player can submit name and score after game over or course clear
- Top 10 leaderboard sorted by score
- Leaderboard button available during gameplay
- Firebase failure is handled without crashing the game
- Two selectable levels
- Editable Cocos prefabs for menu and levels:
  - `assets/Prefabs/MenuEditable.prefab`
  - `assets/Prefabs/Level1Editable.prefab`
  - `assets/Prefabs/Level2Editable.prefab`

## Important Files

```text
assets/menu.fire
assets/Scripts/WebMarioGame.js
assets/Prefabs/MenuEditable.prefab
assets/Prefabs/Level1Editable.prefab
assets/Prefabs/Level2Editable.prefab
assets/resources/AS2_source/
build/web-desktop/index.html
firebase.json
README.md
AI_reference.pdf
```

## Git

The project was version-controlled with regular commits. Recent commits include:

```text
c2224ad Align menu button hitboxes
d259f2b Fix deployed leaderboard cache
0159aee Fix leaderboard score loading
b1f5476 Fix leaderboard access and deploy layout
41ccb99 Add Firebase leaderboard
108b812 Setup Firebase Hosting
```

## Submission Notes

- Main page for Firebase Hosting is `build/web-desktop/index.html`.
- `README.md` describes completed scoring items and bonus features.
- `AI_reference.pdf` is included in the project root.
- Do not include `node_modules` in the submitted zip.
- Zip format should follow the course rule, for example:

```text
Assignment02_學號.zip
```

- Generate and submit the MD5 checksum after creating the final zip.
