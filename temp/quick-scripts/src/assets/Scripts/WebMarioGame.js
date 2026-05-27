"use strict";
cc._RF.push(module, '1685cbMgNVLgrsZgfUwmUMW', 'WebMarioGame');
// Scripts/WebMarioGame.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    graphics: cc.Graphics,
    titleLabel: cc.Label,
    infoLabel: cc.Label,
    hudLabel: cc.Label,
    audioSource: cc.AudioSource
  },
  onLoad: function onLoad() {
    this.VIEW_W = 960;
    this.VIEW_H = 540;
    this.GRAVITY = 1750;
    this.keys = {};
    this.state = "menu";
    this.levelIndex = 0;
    this.camera = 0;
    this.score = 0;
    this.lives = 3;
    this.timer = 120;
    this.message = "";
    this.bgmClip = null;
    this.jumpClip = null;
    this.stompClip = null;
    this.hurtClip = null;
    this.powerClip = null;
    this.coinClip = null;
    this.clearClip = null;
    this.gameOverClip = null;
    this.frames = {};
    this.enemySprites = [];
    this.blockSprites = [];
    this.decorSprites = [];
    this.powerupSprites = [];
    this.useTileSprites = true;
    this.hudIconSprites = [];
    this.menuButtons = [{
      id: "start",
      x: -145,
      y: -36,
      w: 230,
      h: 58
    }, {
      id: "levels",
      x: 145,
      y: -36,
      w: 230,
      h: 58
    }];
    this.ensureSceneNodes();
    this.loadAudio();
    this.loadImageAssets();
    this.showMenu();
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },
  onDestroy: function onDestroy() {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
  },
  update: function update(dt) {
    dt = Math.min(dt, 1 / 30);
    this.handleHotkeys();
    if (this.state === "playing") this.stepGame(dt);
    this.draw();
  },
  ensureSceneNodes: function ensureSceneNodes() {
    this.node.setContentSize(this.VIEW_W, this.VIEW_H);

    if (!this.graphics) {
      var drawNode = new cc.Node("GameGraphics");
      drawNode.parent = this.node;
      this.graphics = drawNode.addComponent(cc.Graphics);
    }

    if (!this.imageLayer) {
      this.imageLayer = new cc.Node("ImageLayer");
      this.imageLayer.parent = this.node;
    }

    if (!this.menuBgSprite) this.menuBgSprite = this.makeSpriteNode("MenuBackground", 0, 6, 640, 363);
    if (!this.titleSprite) this.titleSprite = this.makeSpriteNode("TitleImage", 0, 156, 360, 149);
    if (!this.blueButtonSprite) this.blueButtonSprite = this.makeSpriteNode("BlueButton", -145, -36, 230, 58);
    if (!this.orangeButtonSprite) this.orangeButtonSprite = this.makeSpriteNode("OrangeButton", 145, -36, 230, 58);
    if (!this.playerSprite) this.playerSprite = this.makeSpriteNode("MarioSprite", 0, 0, 36, 42);
    if (!this.menuMarioSprite) this.menuMarioSprite = this.makeSpriteNode("MenuMario", -330, -142, 48, 48);
    if (!this.menuGoombaSprite) this.menuGoombaSprite = this.makeSpriteNode("MenuGoomba", 326, -152, 48, 48);
    if (!this.flagSprite) this.flagSprite = this.makeSpriteNode("FlagSprite", 0, 0, 58, 220);
    if (!this.lifeIcon) this.lifeIcon = this.makeSpriteNode("LifeIcon", -350, 248, 39, 21);
    if (!this.worldIcon) this.worldIcon = this.makeSpriteNode("WorldIcon", 132, 248, 86, 16);
    if (!this.timerIcon) this.timerIcon = this.makeSpriteNode("TimerIcon", 310, 248, 28, 32);
    if (!this.titleLabel) this.titleLabel = this.makeLabel("Title", 40, 210, 64);
    if (!this.infoLabel) this.infoLabel = this.makeLabel("Info", 28, 140, 24);
    if (!this.hudLabel) this.hudLabel = this.makeLabel("HUD", 0, 245, 24);
    if (!this.startLabel) this.startLabel = this.makeLabel("StartLabel", -145, -46, 25);
    if (!this.levelLabel) this.levelLabel = this.makeLabel("LevelLabel", 145, -46, 25);
    if (!this.audioSource) this.audioSource = this.node.addComponent(cc.AudioSource);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
  },
  makeSpriteNode: function makeSpriteNode(name, x, y, w, h) {
    var node = new cc.Node(name);
    node.parent = this.imageLayer || this.node;
    node.zIndex = this.spriteZIndex(name);
    node.setPosition(x, y);
    node.setContentSize(w, h);
    var sprite = node.addComponent(cc.Sprite);
    sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
    return sprite;
  },
  spriteZIndex: function spriteZIndex(name) {
    if (name === "MenuBackground") return -40;
    if (name === "TitleImage" || name.indexOf("Button") >= 0) return 20;
    if (name.indexOf("DecorSprite") === 0) return -8;
    if (name.indexOf("TileSprite") === 0) return 0;
    if (name === "FlagSprite") return 4;
    if (name.indexOf("PowerUpSprite") === 0) return 6;
    if (name.indexOf("GoombaSprite") === 0 || name === "MenuGoomba") return 8;
    if (name === "MarioSprite" || name === "MenuMario") return 10;
    if (name.indexOf("Icon") >= 0) return 30;
    return 1;
  },
  makeLabel: function makeLabel(name, x, y, size) {
    var node = new cc.Node(name);
    node.parent = this.node;
    node.setPosition(x, y);
    node.setContentSize(900, size * 3);
    var label = node.addComponent(cc.Label);
    label.fontSize = size;
    label.lineHeight = size + 6;
    label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
    label.verticalAlign = cc.Label.VerticalAlign.CENTER;
    node.color = cc.Color.WHITE;
    return label;
  },
  loadAudio: function loadAudio() {
    var _this = this;

    cc.resources.load("AS2_source/audio/bgm_1", cc.AudioClip, function (err, clip) {
      if (!err && clip) {
        _this.bgmClip = clip;
        _this.audioSource.clip = clip;
        _this.audioSource.loop = true;
      }
    });
    cc.resources.load("AS2_source/audio/jump", cc.AudioClip, function (_err, clip) {
      _this.jumpClip = clip;
    });
    cc.resources.load("AS2_source/audio/stomp", cc.AudioClip, function (_err, clip) {
      _this.stompClip = clip;
    });
    cc.resources.load("AS2_source/audio/loseOneLife", cc.AudioClip, function (_err, clip) {
      _this.hurtClip = clip;
    });
    cc.resources.load("AS2_source/audio/PowerUp", cc.AudioClip, function (_err, clip) {
      _this.powerClip = clip;
    });
    cc.resources.load("AS2_source/audio/coin", cc.AudioClip, function (_err, clip) {
      _this.coinClip = clip;
    });
    cc.resources.load("AS2_source/audio/levelClear", cc.AudioClip, function (_err, clip) {
      _this.clearClip = clip;
    });
    cc.resources.load("AS2_source/audio/Game Over", cc.AudioClip, function (_err, clip) {
      _this.gameOverClip = clip;
    });
  },
  loadImageAssets: function loadImageAssets() {
    var _this2 = this;

    this.loadSpriteFrame("AS2_source/pictures/menu_bg", function (frame) {
      _this2.frames.menuBg = frame;
      _this2.menuBgSprite.spriteFrame = frame;
    });
    this.loadSpriteFrame("AS2_source/pictures/title_0", function (frame) {
      _this2.frames.title = frame;
      _this2.titleSprite.spriteFrame = frame;
      _this2.titleLabel.node.active = false;
    });
    this.loadSpriteFrame("AS2_source/pictures/button_blue", function (frame) {
      _this2.frames.buttonBlue = frame;
      _this2.blueButtonSprite.spriteFrame = frame;
    });
    this.loadSpriteFrame("AS2_source/pictures/button_orange", function (frame) {
      _this2.frames.buttonOrange = frame;
      _this2.orangeButtonSprite.spriteFrame = frame;
    });
    this.loadSpriteAtlas("AS2_source/player/mario_small", function (atlas) {
      var frames = ["mario_small_0", "mario_small_1", "mario_small_2", "mario_small_3"].map(function (name) {
        return atlas.getSpriteFrame(name);
      }).filter(function (frame) {
        return !!frame;
      });
      _this2.frames.marioSmallFrames = frames;
      _this2.frames.marioSmall = frames[0];
      _this2.playerSprite.spriteFrame = frames[0];
      _this2.menuMarioSprite.spriteFrame = frames[0];
    });
    this.loadSpriteAtlas("AS2_source/enemies/Goomba", function (atlas) {
      var frames = ["Goomba_0", "Goomba_1", "Goomba_2"].map(function (name) {
        return atlas.getSpriteFrame(name);
      }).filter(function (frame) {
        return !!frame;
      });
      _this2.frames.goombaFrames = frames;
      _this2.frames.goomba = frames[0];
      _this2.menuGoombaSprite.spriteFrame = frames[0];
    });
    this.loadSpriteFrame("AS2_source/pictures/flag", function (frame) {
      _this2.frames.flag = frame;
      _this2.flagSprite.spriteFrame = frame;
    });
    this.loadSpriteFrame("AS2_source/pictures/life", function (frame) {
      _this2.frames.life = frame;
      _this2.lifeIcon.spriteFrame = frame;
    });
    this.loadSpriteFrame("AS2_source/pictures/world", function (frame) {
      _this2.frames.world = frame;
      _this2.worldIcon.node.active = false;
    });
    this.loadSpriteFrame("AS2_source/pictures/timer", function (frame) {
      _this2.frames.timer = frame;
      _this2.timerIcon.spriteFrame = frame;
    });
    this.loadSpriteAtlas("AS2_source/effects_UI_tiles/tiles", function (atlas) {
      _this2.frames.groundTop = atlas.getSpriteFrame("tiles_227");
      _this2.frames.groundBody = atlas.getSpriteFrame("tiles_229");
      _this2.frames.brickTile = atlas.getSpriteFrame("tiles_2");
      _this2.frames.questionTile = atlas.getSpriteFrame("tiles_220");
      _this2.frames.usedTile = atlas.getSpriteFrame("tiles_203");
      _this2.frames.cloudTile = null;
      _this2.frames.pipeTop = atlas.getSpriteFrame("tiles_21") || atlas.getSpriteFrame("tiles_107");
      _this2.frames.pipeBody = atlas.getSpriteFrame("tiles_23") || atlas.getSpriteFrame("tiles_108");
      _this2.frames.wallTile = atlas.getSpriteFrame("tiles_2");
      _this2.frames.hillTile = atlas.getSpriteFrame("tiles_224");
      _this2.frames.bushTile = atlas.getSpriteFrame("tiles_225") || atlas.getSpriteFrame("tiles_224");
      _this2.frames.grassTile = atlas.getSpriteFrame("tiles_10") || atlas.getSpriteFrame("tiles_227");
      _this2.frames.edgeTile = null;
    });
    this.loadSpriteAtlas("AS2_source/effects_UI_tiles/items", function (atlas) {
      _this2.frames.mushroom = atlas.getSpriteFrame("items_46");
      _this2.frames.coin = atlas.getSpriteFrame("items_37");
      _this2.frames.usedTile = atlas.getSpriteFrame("items_14") || _this2.frames.usedTile;
      _this2.frames.cloudLeft = atlas.getSpriteFrame("items_15");
      _this2.frames.cloudRight = atlas.getSpriteFrame("items_16");
      _this2.frames.cloudTile = _this2.frames.cloudLeft || _this2.frames.cloudRight || _this2.frames.cloudTile;
    });
  },
  loadSpriteFrame: function loadSpriteFrame(path, callback) {
    cc.resources.load(path, cc.SpriteFrame, function (err, frame) {
      if (!err && frame) callback(frame);
    });
  },
  loadSpriteAtlas: function loadSpriteAtlas(path, callback) {
    cc.resources.load(path, cc.SpriteAtlas, function (err, atlas) {
      if (!err && atlas) callback(atlas);
    });
  },
  loadAtlasFrame: function loadAtlasFrame(path, rect, callback) {
    cc.resources.load(path, cc.Texture2D, function (err, texture) {
      if (err || !texture) return;
      callback(new cc.SpriteFrame(texture, rect));
    });
  },
  loadAtlasFrames: function loadAtlasFrames(path, rects, callback) {
    cc.resources.load(path, cc.Texture2D, function (err, texture) {
      if (err || !texture) return;
      callback(rects.map(function (rect) {
        return new cc.SpriteFrame(texture, rect);
      }));
    });
  },
  showMenu: function showMenu() {
    this.state = "menu";
    this.message = "";
    this.titleLabel.string = "Web Mario";
    this.showMenuImages(true);
    this.titleSprite.node.active = true;
    this.titleLabel.node.active = !this.frames.title;
    this.menuBgSprite.node.active = true;
    this.menuBgSprite.node.setPosition(0, 6);
    this.menuBgSprite.node.setContentSize(640, 363);
    this.blueButtonSprite.node.active = true;
    this.orangeButtonSprite.node.active = true;
    this.menuMarioSprite.node.active = true;
    this.menuGoombaSprite.node.active = true;
    this.playerSprite.node.active = false;
    this.flagSprite.node.active = false;
    this.hideHudIcons();
    this.hideBlockSprites();
    this.hideEnemySprites();
    this.titleLabel.node.setPosition(0, 142);
    this.titleLabel.fontSize = 68;
    this.titleLabel.lineHeight = 76;
    this.infoLabel.node.setPosition(0, -116);
    this.infoLabel.fontSize = 22;
    this.infoLabel.lineHeight = 30;
    this.infoLabel.string = "Move: A/D or Arrow Keys    Jump: W/Space/Up    P: Pause";
    this.blueButtonSprite.node.setPosition(-145, -36);
    this.orangeButtonSprite.node.setPosition(145, -36);
    this.blueButtonSprite.node.setContentSize(230, 58);
    this.orangeButtonSprite.node.setContentSize(230, 58);
    this.startLabel.node.active = true;
    this.levelLabel.node.active = true;
    this.startLabel.node.setPosition(-145, -46);
    this.levelLabel.node.setPosition(145, -46);
    this.startLabel.string = "START GAME";
    this.levelLabel.string = "LEVEL SELECT";
    this.hudLabel.string = "";
  },
  showLevelSelect: function showLevelSelect() {
    this.state = "levels";
    this.titleLabel.string = "Level Select";
    this.showMenuImages(true);
    this.titleSprite.node.active = false;
    this.titleLabel.node.active = true;
    this.menuBgSprite.node.active = true;
    this.menuBgSprite.node.setPosition(0, 6);
    this.menuBgSprite.node.setContentSize(640, 363);
    this.blueButtonSprite.node.active = true;
    this.orangeButtonSprite.node.active = true;
    this.blueButtonSprite.node.setPosition(-150, 10);
    this.orangeButtonSprite.node.setPosition(150, 10);
    this.blueButtonSprite.node.setContentSize(250, 72);
    this.orangeButtonSprite.node.setContentSize(250, 72);
    this.menuMarioSprite.node.active = false;
    this.menuGoombaSprite.node.active = false;
    this.playerSprite.node.active = false;
    this.flagSprite.node.active = false;
    this.hideHudIcons();
    this.hideBlockSprites();
    this.hideEnemySprites();
    this.titleLabel.node.setPosition(0, 154);
    this.titleLabel.fontSize = 56;
    this.infoLabel.node.setPosition(0, -136);
    this.infoLabel.fontSize = 24;
    this.infoLabel.lineHeight = 34;
    this.infoLabel.string = "1: World 1-1      2: World 1-2      ESC: Back";
    this.startLabel.node.active = true;
    this.levelLabel.node.active = true;
    this.startLabel.node.setPosition(-150, 0);
    this.levelLabel.node.setPosition(150, 0);
    this.startLabel.string = "WORLD 1-1";
    this.levelLabel.string = "WORLD 1-2";
    this.hudLabel.string = "";
  },
  startGame: function startGame(index) {
    var levels = this.makeLevels();
    this.levelIndex = index;
    this.level = levels[index];
    this.player = this.makePlayer();
    this.player.x = this.level.start.x;
    this.player.y = this.level.start.y;
    this.blocks = this.level.blocks.map(function (block) {
      return Object.assign({}, block);
    });
    this.decorations = (this.level.decorations || []).map(function (item) {
      return Object.assign({}, item);
    });
    this.powerups = [];
    this.enemies = this.level.enemies.map(function (enemy) {
      return {
        x: enemy.x,
        y: enemy.y,
        w: 34,
        h: 32,
        vx: -65,
        vy: 0,
        alive: true,
        squash: 0,
        onGround: false
      };
    });
    this.camera = 0;
    this.score = 0;
    this.lives = 3;
    this.timer = 120;
    this.message = "";
    this.state = "playing";
    this.showMenuImages(false);
    this.menuBgSprite.node.active = true;
    this.menuBgSprite.node.setPosition(0, 20);
    this.menuBgSprite.node.setContentSize(960, 544);
    this.playerSprite.node.active = true;
    this.showHudIcons();
    this.titleLabel.node.active = true;
    this.titleLabel.string = "";
    this.infoLabel.string = "";
    this.startLabel.node.active = false;
    this.levelLabel.node.active = false;
    this.hudLabel.node.setPosition(0, 248);
    this.hudLabel.fontSize = 22;
    this.hudLabel.lineHeight = 30;
    if (this.audioSource && this.bgmClip) this.audioSource.play();
  },
  showMenuImages: function showMenuImages(active) {
    [this.menuBgSprite, this.titleSprite, this.blueButtonSprite, this.orangeButtonSprite, this.menuMarioSprite, this.menuGoombaSprite].forEach(function (sprite) {
      if (sprite) sprite.node.active = active;
    });
  },
  showHudIcons: function showHudIcons() {
    this.lifeIcon.node.setPosition(-350, 248);
    this.worldIcon.node.active = false;
    this.timerIcon.node.setPosition(310, 248);
    this.lifeIcon.node.active = true;
    this.timerIcon.node.active = true;
  },
  hideHudIcons: function hideHudIcons() {
    this.lifeIcon.node.active = false;
    this.worldIcon.node.active = false;
    this.timerIcon.node.active = false;
  },
  makePlayer: function makePlayer() {
    return {
      x: 90,
      y: 260,
      w: 30,
      h: 42,
      vx: 0,
      vy: 0,
      onGround: false,
      big: false,
      invincible: 0,
      facing: 1,
      anim: 0
    };
  },
  makeLevels: function makeLevels() {
    var ground = function ground(x, y, w, h) {
      return {
        type: "ground",
        x: x,
        y: y,
        w: w,
        h: h
      };
    };

    var brick = function brick(x, y, w, h) {
      return {
        type: "brick",
        x: x,
        y: y,
        w: w,
        h: h
      };
    };

    var wall = function wall(x, y, w, h) {
      return {
        type: "wall",
        x: x,
        y: y,
        w: w,
        h: h
      };
    };

    var pipe = function pipe(x, y, h) {
      return {
        type: "pipe",
        x: x,
        y: y,
        w: 72,
        h: h
      };
    };

    var cloud = function cloud(x, y, w) {
      return {
        type: "cloud",
        x: x,
        y: y,
        w: w,
        h: 30
      };
    };

    var deco = function deco(type, x, y, w, h, parallax) {
      return {
        type: type,
        x: x,
        y: y,
        w: w,
        h: h,
        parallax: parallax || 1
      };
    };

    var question = function question(x, y) {
      return {
        type: "question",
        x: x,
        y: y,
        w: 36,
        h: 36,
        used: false,
        bump: 0
      };
    };

    return [{
      name: "1-1",
      length: 4600,
      start: {
        x: 90,
        y: 260
      },
      blocks: [ground(0, 468, 900, 72), ground(1010, 468, 620, 72), ground(1760, 468, 760, 72), ground(2670, 468, 760, 72), ground(3560, 468, 1040, 72), pipe(610, 396, 72), pipe(1300, 360, 108), pipe(2940, 360, 108), pipe(4040, 324, 144), brick(380, 432, 72, 36), brick(760, 396, 108, 72), brick(1160, 396, 108, 72), brick(1560, 360, 144, 36), brick(1980, 396, 144, 72), brick(2220, 324, 180, 36), brick(3180, 396, 108, 72), wall(3440, 432, 72, 36), wall(3548, 396, 72, 72), wall(3656, 360, 72, 108), wall(3764, 324, 72, 144), brick(4148, 288, 180, 36), cloud(500, 330, 108), cloud(1460, 276, 144), cloud(2520, 316, 108), cloud(3860, 246, 144), question(472, 286), question(920, 260), question(1532, 190), question(2384, 220), question(3920, 160)],
      decorations: [deco("hill", 90, 382, 96, 86, 0.82), deco("bush", 250, 420, 64, 48, 0.95), deco("cloud", 720, 122, 108, 46, 0.55), deco("edge", 900, 430, 40, 38, 1), deco("hill", 1080, 382, 118, 96, 0.82), deco("bush", 1450, 420, 72, 48, 0.95), deco("cloud", 1840, 108, 144, 48, 0.55), deco("hill", 2180, 382, 128, 96, 0.82), deco("bush", 2400, 420, 86, 48, 0.95), deco("edge", 2520, 430, 40, 38, 1), deco("cloud", 2820, 148, 108, 46, 0.55), deco("hill", 3340, 382, 116, 96, 0.82), deco("bush", 3820, 420, 86, 48, 0.95)],
      enemies: [{
        x: 840,
        y: 420
      }, {
        x: 1700,
        y: 420
      }, {
        x: 2580,
        y: 420
      }, {
        x: 3350,
        y: 420
      }],
      flag: {
        x: 4300,
        y: 252
      }
    }, {
      name: "1-2",
      length: 5400,
      start: {
        x: 90,
        y: 260
      },
      blocks: [ground(0, 468, 700, 72), ground(830, 468, 560, 72), ground(1550, 468, 670, 72), ground(2380, 468, 620, 72), ground(3180, 468, 760, 72), ground(4140, 468, 1260, 72), pipe(520, 396, 72), pipe(1100, 360, 108), pipe(1900, 324, 144), pipe(2780, 360, 108), pipe(4380, 324, 144), wall(390, 432, 72, 36), wall(498, 396, 72, 72), wall(960, 396, 108, 72), brick(1260, 324, 72, 36), brick(1488, 324, 108, 36), cloud(1580, 276, 108), wall(1700, 396, 72, 72), wall(1808, 360, 72, 108), brick(2180, 324, 180, 36), cloud(2380, 288, 108), cloud(2640, 260, 108), wall(3020, 432, 72, 36), wall(3128, 396, 72, 72), wall(3236, 360, 72, 108), wall(3344, 324, 72, 144), cloud(3560, 270, 108), cloud(3820, 246, 108), brick(4020, 360, 144, 36), wall(4680, 432, 72, 36), wall(4788, 396, 72, 72), wall(4896, 360, 72, 108), question(650, 260), question(1392, 240), question(2120, 240), question(2520, 226), question(3720, 230), question(4800, 260)],
      decorations: [deco("hill", 120, 382, 112, 92, 0.82), deco("bush", 330, 420, 72, 48, 0.95), deco("edge", 700, 430, 40, 38, 1), deco("cloud", 860, 130, 120, 46, 0.55), deco("hill", 1600, 382, 132, 96, 0.82), deco("bush", 2010, 420, 86, 48, 0.95), deco("edge", 2220, 430, 40, 38, 1), deco("cloud", 2350, 108, 144, 48, 0.55), deco("hill", 3250, 382, 132, 96, 0.82), deco("bush", 3660, 420, 86, 48, 0.95), deco("edge", 3940, 430, 40, 38, 1), deco("cloud", 4160, 138, 132, 46, 0.55), deco("hill", 4560, 382, 116, 92, 0.82), deco("bush", 5010, 420, 92, 48, 0.95)],
      enemies: [{
        x: 1040,
        y: 420
      }, {
        x: 1840,
        y: 420
      }, {
        x: 2720,
        y: 420
      }, {
        x: 3400,
        y: 420
      }, {
        x: 3860,
        y: 420
      }, {
        x: 4520,
        y: 420
      }],
      flag: {
        x: 5120,
        y: 252
      }
    }];
  },
  handleHotkeys: function handleHotkeys() {
    if (this.state === "menu") {
      if (this.consume(cc.macro.KEY.enter)) this.startGame(0);
      if (this.consume(cc.macro.KEY.l)) this.showLevelSelect();
      return;
    }

    if (this.state === "levels") {
      if (this.consume(cc.macro.KEY["1"])) this.startGame(0);
      if (this.consume(cc.macro.KEY["2"])) this.startGame(1);
      if (this.consume(cc.macro.KEY.escape)) this.showMenu();
      return;
    }

    if (this.state === "playing" || this.state === "paused") {
      if (this.consume(cc.macro.KEY.p)) this.state = this.state === "playing" ? "paused" : "playing";
      return;
    }

    if (this.consume(cc.macro.KEY.enter)) this.showMenu();
  },
  stepGame: function stepGame(dt) {
    this.timer -= dt;
    if (this.timer <= 0) this.hurtPlayer();
    this.updatePlayer(dt);
    this.updateEnemies(dt);
    this.updatePowerups(dt);
    this.blocks.forEach(function (block) {
      block.bump = Math.max(0, (block.bump || 0) - dt * 80);
    });
    this.updateHud();
  },
  updatePlayer: function updatePlayer(dt) {
    var left = this.keys[cc.macro.KEY.left] || this.keys[cc.macro.KEY.a];
    var right = this.keys[cc.macro.KEY.right] || this.keys[cc.macro.KEY.d];
    var jump = this.keys[cc.macro.KEY.up] || this.keys[cc.macro.KEY.w] || this.keys[cc.macro.KEY.space];
    this.player.vx = left ? -235 : right ? 235 : 0;
    if (left) this.player.facing = -1;
    if (right) this.player.facing = 1;

    if (jump && this.player.onGround) {
      this.player.vy = this.player.big ? -780 : -720;
      this.playOneShot(this.jumpClip);
    }

    this.player.anim += dt * Math.abs(this.player.vx);
    this.player.invincible = Math.max(0, this.player.invincible - dt);
    this.moveBody(this.player, dt, true);
    if (this.player.y > 660) this.hurtPlayer();
    if (this.hit(this.player, {
      x: this.level.flag.x,
      y: this.level.flag.y,
      w: 42,
      h: 216
    })) this.levelClear();
    this.camera = Math.max(0, Math.min(this.level.length - this.VIEW_W, this.player.x - this.VIEW_W * 0.42));
  },
  updateEnemies: function updateEnemies(dt) {
    var _this3 = this;

    this.enemies.forEach(function (enemy) {
      if (!enemy.alive) {
        enemy.squash -= dt;
        return;
      }

      _this3.moveBody(enemy, dt, false);

      if (enemy.vx === 0) enemy.vx = Math.random() > 0.5 ? 65 : -65;
      if (!_this3.hit(_this3.player, enemy) || _this3.player.invincible > 0) return;
      var stomp = _this3.player.vy > 80 && _this3.player.y + _this3.player.h - enemy.y < 20;

      if (stomp) {
        enemy.alive = false;
        enemy.squash = 0.35;
        _this3.player.vy = -430;
        _this3.score += 200;

        _this3.playOneShot(_this3.stompClip);
      } else {
        _this3.hurtPlayer();
      }
    });
  },
  moveBody: function moveBody(body, dt, isPlayer) {
    var _this4 = this;

    body.x += body.vx * dt;
    this.blocks.forEach(function (block) {
      if (!_this4.hit(body, block)) return;
      if (body.vx > 0) body.x = block.x - body.w;
      if (body.vx < 0) body.x = block.x + block.w;
      body.vx = 0;
    });
    body.vy += this.GRAVITY * dt;
    body.y += body.vy * dt;
    body.onGround = false;
    this.blocks.forEach(function (block) {
      if (!_this4.hit(body, block)) return;

      if (body.vy > 0) {
        body.y = block.y - body.h;
        body.vy = 0;
        body.onGround = true;
      } else if (body.vy < 0) {
        body.y = block.y + block.h;
        body.vy = 0;
        if (isPlayer && block.type === "question") _this4.useQuestion(block);
      }
    });
  },
  useQuestion: function useQuestion(block) {
    if (block.used) return;
    block.used = true;
    block.bump = 12;
    this.score += 100;
    this.spawnPowerup(block);
    this.playOneShot(this.coinClip);
  },
  spawnPowerup: function spawnPowerup(block) {
    this.powerups.push({
      x: block.x + 2,
      y: block.y - 40,
      w: 32,
      h: 32,
      vx: -75,
      vy: 0,
      onGround: false,
      alive: true,
      bob: 0
    });
  },
  updatePowerups: function updatePowerups(dt) {
    var _this5 = this;

    if (!this.powerups) return;
    this.powerups.forEach(function (item) {
      if (!item.alive) return;
      item.bob += dt * 8;
      var oldVx = item.vx;

      _this5.moveBody(item, dt, false);

      if (item.vx === 0) item.vx = oldVx < 0 ? 75 : -75;
      if (item.y > 660 || item.x < _this5.camera - 220) item.alive = false;
      var collectBox = {
        x: item.x - 12,
        y: item.y - 18,
        w: item.w + 24,
        h: item.h + 36
      };
      if (!_this5.hit(_this5.player, collectBox)) return;
      item.alive = false;

      if (!_this5.player.big) {
        _this5.player.big = true;
        _this5.player.h = 58;
        _this5.player.y -= 16;
      }

      _this5.score += 500;

      _this5.playOneShot(_this5.powerClip);
    });
  },
  hurtPlayer: function hurtPlayer() {
    this.lives -= 1;
    this.playOneShot(this.hurtClip);

    if (this.lives <= 0) {
      this.state = "over";
      this.message = "GAME OVER\nENTER: Menu";
      if (this.audioSource) this.audioSource.stop();
      this.playOneShot(this.gameOverClip);
      return;
    }

    this.player = this.makePlayer();
    this.player.x = this.level.start.x;
    this.player.y = this.level.start.y;
    this.player.invincible = 1.6;
    this.timer = 120;
  },
  levelClear: function levelClear() {
    this.state = "clear";
    this.score += Math.max(0, Math.ceil(this.timer)) * 10;
    this.message = "LEVEL CLEAR\nENTER: Menu";
    if (this.audioSource) this.audioSource.stop();
    this.playOneShot(this.clearClip);
  },
  updateHud: function updateHud() {
    this.hudLabel.string = this.lives + "        SCORE " + String(this.score).padStart(6, "0") + "        WORLD " + this.level.name + "        TIME " + Math.max(0, Math.ceil(this.timer));
  },
  draw: function draw() {
    var g = this.graphics;
    if (!g) return;
    g.clear();

    if (this.state === "menu") {
      this.hideBlockSprites();
      this.hideDecorSprites();
      this.hidePowerupSprites();
      this.flagSprite.node.active = false;
      return;
    }

    if (this.state === "levels") {
      this.hideBlockSprites();
      this.hideDecorSprites();
      this.hidePowerupSprites();
      this.flagSprite.node.active = false;
      return;
    }

    this.syncDecorSprites();
    this.syncBlockSprites();
    this.syncPowerupSprites();
    this.syncGameSprites();
    this.syncFlagSprite();
    if (this.state === "paused") this.message = "PAUSED";
    this.infoLabel.string = this.message;
  },
  syncGameSprites: function syncGameSprites() {
    var _this6 = this;

    if (this.playerSprite && this.frames.marioSmall && this.player) {
      var walking = this.player.onGround && Math.abs(this.player.vx) > 10;
      var jumping = !this.player.onGround;
      var playerFrames = this.frames.marioSmallFrames || [this.frames.marioSmall];
      var playerFrameIndex = jumping ? Math.min(3, playerFrames.length - 1) : walking ? Math.floor(this.player.anim / 90) % Math.min(3, playerFrames.length) : 0;
      this.playerSprite.node.active = true;
      this.playerSprite.spriteFrame = playerFrames[playerFrameIndex] || this.frames.marioSmall;
      this.playerSprite.node.setPosition(this.player.x - this.camera - this.VIEW_W / 2 + this.player.w / 2, this.VIEW_H / 2 - this.player.y - this.player.h / 2);
      this.playerSprite.node.setScale(this.player.facing, 1);
      this.playerSprite.node.setContentSize(this.player.big ? 46 : 34, this.player.big ? 58 : 42);
      this.playerSprite.node.opacity = this.player.invincible > 0 && Math.floor(Date.now() / 90) % 2 === 0 ? 80 : 255;
    }

    this.ensureEnemySprites();
    this.enemies.forEach(function (enemy, index) {
      var sprite = _this6.enemySprites[index];
      if (!sprite) return;
      sprite.node.active = !!_this6.frames.goomba && enemy.alive;
      if (!sprite.node.active) return;
      var goombaFrames = _this6.frames.goombaFrames || [_this6.frames.goomba];
      sprite.spriteFrame = goombaFrames[Math.floor(Date.now() / 180 + index) % goombaFrames.length] || _this6.frames.goomba;
      sprite.node.setPosition(enemy.x - _this6.camera - _this6.VIEW_W / 2 + enemy.w / 2, _this6.VIEW_H / 2 - enemy.y - enemy.h / 2);
      sprite.node.setContentSize(40, 42);
    });
  },
  syncBlockSprites: function syncBlockSprites() {
    var _this7 = this;

    if (!this.frames.groundTop || !this.frames.groundBody || !this.frames.brickTile || !this.frames.questionTile) return;
    var index = 0;
    this.blocks.forEach(function (block) {
      var visibleX = block.x - _this7.camera;
      if (visibleX + block.w < -80 || visibleX > _this7.VIEW_W + 80) return;

      if (block.type === "ground") {
        var _tileSize = 32;

        var _cols = Math.ceil(block.w / _tileSize);

        var _rows = Math.max(1, Math.ceil(block.h / _tileSize));

        for (var col = 0; col < _cols; col += 1) {
          for (var row = 0; row < _rows; row += 1) {
            var _frame = row === 0 ? _this7.frames.groundTop : _this7.frames.groundBody;

            _this7.placeBlockSprite(index, _frame, block.x + col * _tileSize, block.y + row * _tileSize, _tileSize, _tileSize);

            index += 1;
          }
        }

        return;
      }

      if (block.type === "pipe") {
        var _tileSize2 = 36;

        var _cols2 = Math.max(1, Math.ceil(block.w / _tileSize2));

        var _rows2 = Math.max(1, Math.ceil(block.h / _tileSize2));

        for (var _col = 0; _col < _cols2; _col += 1) {
          for (var _row = 0; _row < _rows2; _row += 1) {
            var _frame2 = _row === 0 ? _this7.frames.pipeTop || _this7.frames.brickTile : _this7.frames.pipeBody || _this7.frames.pipeTop || _this7.frames.brickTile;

            _this7.placeBlockSprite(index, _frame2, block.x + _col * _tileSize2, block.y + _row * _tileSize2, _tileSize2, _tileSize2);

            index += 1;
          }
        }

        return;
      }

      if (block.type === "cloud") {
        var _tileSize3 = 36;

        var _cols3 = Math.max(1, Math.ceil(block.w / _tileSize3));

        for (var _col2 = 0; _col2 < _cols3; _col2 += 1) {
          var _frame3 = _col2 === _cols3 - 1 ? _this7.frames.cloudRight || _this7.frames.cloudLeft || _this7.frames.brickTile : _this7.frames.cloudLeft || _this7.frames.cloudRight || _this7.frames.brickTile;

          _this7.placeBlockSprite(index, _frame3, block.x + _col2 * _tileSize3, block.y, _tileSize3, block.h);

          index += 1;
        }

        return;
      }

      var tileSize = block.type === "question" ? 36 : 36;
      var cols = Math.max(1, Math.ceil(block.w / tileSize));
      var rows = Math.max(1, Math.ceil(block.h / tileSize));
      var frame = block.type === "question" ? block.used ? _this7.frames.usedTile : _this7.frames.questionTile : block.type === "wall" ? _this7.frames.wallTile || _this7.frames.brickTile : _this7.frames.brickTile;
      var bumpY = block.type === "question" ? block.bump || 0 : 0;

      for (var _col3 = 0; _col3 < cols; _col3 += 1) {
        for (var _row2 = 0; _row2 < rows; _row2 += 1) {
          _this7.placeBlockSprite(index, frame, block.x + _col3 * tileSize, block.y + _row2 * tileSize - bumpY, tileSize, tileSize);

          index += 1;
        }
      }
    });

    for (var i = index; i < this.blockSprites.length; i += 1) {
      this.blockSprites[i].node.active = false;
    }
  },
  syncDecorSprites: function syncDecorSprites() {
    var _this8 = this;

    if (!this.decorations) return;
    var index = 0;
    this.decorations.forEach(function (item) {
      var parallax = item.parallax || 1;
      var x = item.x - _this8.camera * parallax;
      if (x + item.w < -120 || x > _this8.VIEW_W + 120) return;

      var frame = _this8.decorFrame(item.type);

      if (!frame) return;

      _this8.placeDecorSprite(index, frame, x, item.y, item.w, item.h);

      index += 1;
    });

    for (var i = index; i < this.decorSprites.length; i += 1) {
      this.decorSprites[i].node.active = false;
    }
  },
  syncPowerupSprites: function syncPowerupSprites() {
    var _this9 = this;

    if (!this.powerups) return;
    var index = 0;
    this.powerups.forEach(function (item) {
      if (!item.alive || !_this9.frames.mushroom) return;
      var visibleX = item.x - _this9.camera;
      if (visibleX + item.w < -80 || visibleX > _this9.VIEW_W + 80) return;

      while (_this9.powerupSprites.length <= index) {
        var _sprite = _this9.makeSpriteNode("PowerUpSprite" + (_this9.powerupSprites.length + 1), 0, 0, 32, 32);

        _sprite.node.active = false;

        _this9.powerupSprites.push(_sprite);
      }

      var sprite = _this9.powerupSprites[index];
      sprite.spriteFrame = _this9.frames.mushroom;
      sprite.node.active = true;
      sprite.node.setContentSize(32, 32);
      var bobY = Math.sin(item.bob || 0) * 4;
      sprite.node.setPosition(item.x - _this9.camera - _this9.VIEW_W / 2 + item.w / 2, _this9.VIEW_H / 2 - item.y - item.h / 2 + bobY);
      index += 1;
    });

    for (var i = index; i < this.powerupSprites.length; i += 1) {
      this.powerupSprites[i].node.active = false;
    }
  },
  decorFrame: function decorFrame(type) {
    if (type === "hill") return this.frames.hillTile;
    if (type === "bush") return this.frames.bushTile;
    if (type === "grass") return this.frames.grassTile;
    if (type === "edge") return null;
    if (type === "cloud") return this.frames.cloudTile;
    return this.frames.brickTile;
  },
  placeDecorSprite: function placeDecorSprite(index, frame, worldX, worldY, w, h) {
    while (this.decorSprites.length <= index) {
      var _sprite2 = this.makeSpriteNode("DecorSprite" + (this.decorSprites.length + 1), 0, 0, 48, 48);

      _sprite2.node.active = false;
      this.decorSprites.push(_sprite2);
    }

    var sprite = this.decorSprites[index];
    sprite.spriteFrame = frame;
    sprite.node.active = true;
    sprite.node.setContentSize(w, h);
    sprite.node.setPosition(worldX - this.VIEW_W / 2 + w / 2, this.VIEW_H / 2 - worldY - h / 2);
  },
  placeBlockSprite: function placeBlockSprite(index, frame, worldX, worldY, w, h) {
    if (!frame) return;

    while (this.blockSprites.length <= index) {
      var _sprite3 = this.makeSpriteNode("TileSprite" + (this.blockSprites.length + 1), 0, 0, 48, 48);

      _sprite3.node.active = false;
      this.blockSprites.push(_sprite3);
    }

    var sprite = this.blockSprites[index];
    sprite.spriteFrame = frame;
    sprite.node.active = true;
    sprite.node.setContentSize(w, h);
    sprite.node.setPosition(worldX - this.camera - this.VIEW_W / 2 + w / 2, this.VIEW_H / 2 - worldY - h / 2);
  },
  hideBlockSprites: function hideBlockSprites() {
    this.blockSprites.forEach(function (sprite) {
      sprite.node.active = false;
    });
  },
  hideDecorSprites: function hideDecorSprites() {
    this.decorSprites.forEach(function (sprite) {
      sprite.node.active = false;
    });
  },
  hidePowerupSprites: function hidePowerupSprites() {
    this.powerupSprites.forEach(function (sprite) {
      sprite.node.active = false;
    });
  },
  syncFlagSprite: function syncFlagSprite() {
    if (!this.flagSprite) return;

    if (!this.frames.flag || !this.level) {
      this.flagSprite.node.active = false;
      return;
    }

    this.flagSprite.node.active = true;
    this.flagSprite.node.setPosition(this.level.flag.x - this.camera - this.VIEW_W / 2 + 22, this.VIEW_H / 2 - this.level.flag.y - 108);
    this.flagSprite.node.setContentSize(58, 220);
  },
  ensureEnemySprites: function ensureEnemySprites() {
    while (this.enemySprites.length < this.enemies.length) {
      var sprite = this.makeSpriteNode("GoombaSprite" + (this.enemySprites.length + 1), 0, 0, 40, 42);
      sprite.node.active = false;
      this.enemySprites.push(sprite);
    }
  },
  hideEnemySprites: function hideEnemySprites() {
    this.enemySprites.forEach(function (sprite) {
      sprite.node.active = false;
    });
  },
  hit: function hit(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  },
  playOneShot: function playOneShot(clip) {
    if (clip) cc.audioEngine.playEffect(clip, false);
  },
  consume: function consume(code) {
    if (!this.keys[code]) return false;
    delete this.keys[code];
    return true;
  },
  onTouchEnd: function onTouchEnd(event) {
    var point = this.node.convertToNodeSpaceAR(event.getLocation());

    if (this.state === "menu") {
      if (this.pointInButton(point, this.menuButtons[0])) this.startGame(0);
      if (this.pointInButton(point, this.menuButtons[1])) this.showLevelSelect();
      return;
    }

    if (this.state === "levels") {
      if (this.pointInButton(point, {
        x: -150,
        y: 10,
        w: 250,
        h: 72
      })) this.startGame(0);
      if (this.pointInButton(point, {
        x: 150,
        y: 10,
        w: 250,
        h: 72
      })) this.startGame(1);
    }
  },
  pointInButton: function pointInButton(point, button) {
    return point.x >= button.x - button.w / 2 && point.x <= button.x + button.w / 2 && point.y >= button.y - button.h / 2 && point.y <= button.y + button.h / 2;
  },
  onKeyDown: function onKeyDown(event) {
    this.keys[event.keyCode] = true;
  },
  onKeyUp: function onKeyUp(event) {
    delete this.keys[event.keyCode];
  }
});

cc._RF.pop();