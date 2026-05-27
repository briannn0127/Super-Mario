
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/__qc_index__.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}
require('./assets/Scripts/WebMarioGame');

                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Scripts/WebMarioGame.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0c1xcV2ViTWFyaW9HYW1lLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiZ3JhcGhpY3MiLCJHcmFwaGljcyIsInRpdGxlTGFiZWwiLCJMYWJlbCIsImluZm9MYWJlbCIsImh1ZExhYmVsIiwiYXVkaW9Tb3VyY2UiLCJBdWRpb1NvdXJjZSIsIm9uTG9hZCIsIlZJRVdfVyIsIlZJRVdfSCIsIkdSQVZJVFkiLCJrZXlzIiwic3RhdGUiLCJsZXZlbEluZGV4IiwiY2FtZXJhIiwic2NvcmUiLCJsaXZlcyIsInRpbWVyIiwibWVzc2FnZSIsImJnbUNsaXAiLCJqdW1wQ2xpcCIsInN0b21wQ2xpcCIsImh1cnRDbGlwIiwicG93ZXJDbGlwIiwiY29pbkNsaXAiLCJjbGVhckNsaXAiLCJnYW1lT3ZlckNsaXAiLCJmcmFtZXMiLCJlbmVteVNwcml0ZXMiLCJibG9ja1Nwcml0ZXMiLCJkZWNvclNwcml0ZXMiLCJwb3dlcnVwU3ByaXRlcyIsInVzZVRpbGVTcHJpdGVzIiwiaHVkSWNvblNwcml0ZXMiLCJtZW51QnV0dG9ucyIsImlkIiwieCIsInkiLCJ3IiwiaCIsImVuc3VyZVNjZW5lTm9kZXMiLCJsb2FkQXVkaW8iLCJsb2FkSW1hZ2VBc3NldHMiLCJzaG93TWVudSIsInN5c3RlbUV2ZW50Iiwib24iLCJTeXN0ZW1FdmVudCIsIkV2ZW50VHlwZSIsIktFWV9ET1dOIiwib25LZXlEb3duIiwiS0VZX1VQIiwib25LZXlVcCIsIm9uRGVzdHJveSIsIm9mZiIsIm5vZGUiLCJOb2RlIiwiVE9VQ0hfRU5EIiwib25Ub3VjaEVuZCIsInVwZGF0ZSIsImR0IiwiTWF0aCIsIm1pbiIsImhhbmRsZUhvdGtleXMiLCJzdGVwR2FtZSIsImRyYXciLCJzZXRDb250ZW50U2l6ZSIsImRyYXdOb2RlIiwicGFyZW50IiwiYWRkQ29tcG9uZW50IiwiaW1hZ2VMYXllciIsIm1lbnVCZ1Nwcml0ZSIsIm1ha2VTcHJpdGVOb2RlIiwidGl0bGVTcHJpdGUiLCJibHVlQnV0dG9uU3ByaXRlIiwib3JhbmdlQnV0dG9uU3ByaXRlIiwicGxheWVyU3ByaXRlIiwibWVudU1hcmlvU3ByaXRlIiwibWVudUdvb21iYVNwcml0ZSIsImZsYWdTcHJpdGUiLCJsaWZlSWNvbiIsIndvcmxkSWNvbiIsInRpbWVySWNvbiIsIm1ha2VMYWJlbCIsInN0YXJ0TGFiZWwiLCJsZXZlbExhYmVsIiwibmFtZSIsInpJbmRleCIsInNwcml0ZVpJbmRleCIsInNldFBvc2l0aW9uIiwic3ByaXRlIiwiU3ByaXRlIiwic2l6ZU1vZGUiLCJTaXplTW9kZSIsIkNVU1RPTSIsImluZGV4T2YiLCJzaXplIiwibGFiZWwiLCJmb250U2l6ZSIsImxpbmVIZWlnaHQiLCJob3Jpem9udGFsQWxpZ24iLCJIb3Jpem9udGFsQWxpZ24iLCJDRU5URVIiLCJ2ZXJ0aWNhbEFsaWduIiwiVmVydGljYWxBbGlnbiIsImNvbG9yIiwiQ29sb3IiLCJXSElURSIsInJlc291cmNlcyIsImxvYWQiLCJBdWRpb0NsaXAiLCJlcnIiLCJjbGlwIiwibG9vcCIsIl9lcnIiLCJsb2FkU3ByaXRlRnJhbWUiLCJmcmFtZSIsIm1lbnVCZyIsInNwcml0ZUZyYW1lIiwidGl0bGUiLCJhY3RpdmUiLCJidXR0b25CbHVlIiwiYnV0dG9uT3JhbmdlIiwibG9hZFNwcml0ZUF0bGFzIiwiYXRsYXMiLCJtYXAiLCJnZXRTcHJpdGVGcmFtZSIsImZpbHRlciIsIm1hcmlvU21hbGxGcmFtZXMiLCJtYXJpb1NtYWxsIiwiZ29vbWJhRnJhbWVzIiwiZ29vbWJhIiwiZmxhZyIsImxpZmUiLCJ3b3JsZCIsImdyb3VuZFRvcCIsImdyb3VuZEJvZHkiLCJicmlja1RpbGUiLCJxdWVzdGlvblRpbGUiLCJ1c2VkVGlsZSIsImNsb3VkVGlsZSIsInBpcGVUb3AiLCJwaXBlQm9keSIsIndhbGxUaWxlIiwiaGlsbFRpbGUiLCJidXNoVGlsZSIsImdyYXNzVGlsZSIsImVkZ2VUaWxlIiwibXVzaHJvb20iLCJjb2luIiwiY2xvdWRMZWZ0IiwiY2xvdWRSaWdodCIsInBhdGgiLCJjYWxsYmFjayIsIlNwcml0ZUZyYW1lIiwiU3ByaXRlQXRsYXMiLCJsb2FkQXRsYXNGcmFtZSIsInJlY3QiLCJUZXh0dXJlMkQiLCJ0ZXh0dXJlIiwibG9hZEF0bGFzRnJhbWVzIiwicmVjdHMiLCJzdHJpbmciLCJzaG93TWVudUltYWdlcyIsImhpZGVIdWRJY29ucyIsImhpZGVCbG9ja1Nwcml0ZXMiLCJoaWRlRW5lbXlTcHJpdGVzIiwic2hvd0xldmVsU2VsZWN0Iiwic3RhcnRHYW1lIiwiaW5kZXgiLCJsZXZlbHMiLCJtYWtlTGV2ZWxzIiwibGV2ZWwiLCJwbGF5ZXIiLCJtYWtlUGxheWVyIiwic3RhcnQiLCJibG9ja3MiLCJibG9jayIsIk9iamVjdCIsImFzc2lnbiIsImRlY29yYXRpb25zIiwiaXRlbSIsInBvd2VydXBzIiwiZW5lbWllcyIsImVuZW15IiwidngiLCJ2eSIsImFsaXZlIiwic3F1YXNoIiwib25Hcm91bmQiLCJzaG93SHVkSWNvbnMiLCJwbGF5IiwiZm9yRWFjaCIsImJpZyIsImludmluY2libGUiLCJmYWNpbmciLCJhbmltIiwiZ3JvdW5kIiwidHlwZSIsImJyaWNrIiwid2FsbCIsInBpcGUiLCJjbG91ZCIsImRlY28iLCJwYXJhbGxheCIsInF1ZXN0aW9uIiwidXNlZCIsImJ1bXAiLCJsZW5ndGgiLCJjb25zdW1lIiwibWFjcm8iLCJLRVkiLCJlbnRlciIsImwiLCJlc2NhcGUiLCJwIiwiaHVydFBsYXllciIsInVwZGF0ZVBsYXllciIsInVwZGF0ZUVuZW1pZXMiLCJ1cGRhdGVQb3dlcnVwcyIsIm1heCIsInVwZGF0ZUh1ZCIsImxlZnQiLCJhIiwicmlnaHQiLCJkIiwianVtcCIsInVwIiwic3BhY2UiLCJwbGF5T25lU2hvdCIsImFicyIsIm1vdmVCb2R5IiwiaGl0IiwibGV2ZWxDbGVhciIsInJhbmRvbSIsInN0b21wIiwiYm9keSIsImlzUGxheWVyIiwidXNlUXVlc3Rpb24iLCJzcGF3blBvd2VydXAiLCJwdXNoIiwiYm9iIiwib2xkVngiLCJjb2xsZWN0Qm94Iiwic3RvcCIsImNlaWwiLCJTdHJpbmciLCJwYWRTdGFydCIsImciLCJjbGVhciIsImhpZGVEZWNvclNwcml0ZXMiLCJoaWRlUG93ZXJ1cFNwcml0ZXMiLCJzeW5jRGVjb3JTcHJpdGVzIiwic3luY0Jsb2NrU3ByaXRlcyIsInN5bmNQb3dlcnVwU3ByaXRlcyIsInN5bmNHYW1lU3ByaXRlcyIsInN5bmNGbGFnU3ByaXRlIiwid2Fsa2luZyIsImp1bXBpbmciLCJwbGF5ZXJGcmFtZXMiLCJwbGF5ZXJGcmFtZUluZGV4IiwiZmxvb3IiLCJzZXRTY2FsZSIsIm9wYWNpdHkiLCJEYXRlIiwibm93IiwiZW5zdXJlRW5lbXlTcHJpdGVzIiwidmlzaWJsZVgiLCJ0aWxlU2l6ZSIsImNvbHMiLCJyb3dzIiwiY29sIiwicm93IiwicGxhY2VCbG9ja1Nwcml0ZSIsImJ1bXBZIiwiaSIsImRlY29yRnJhbWUiLCJwbGFjZURlY29yU3ByaXRlIiwiYm9iWSIsInNpbiIsIndvcmxkWCIsIndvcmxkWSIsImIiLCJhdWRpb0VuZ2luZSIsInBsYXlFZmZlY3QiLCJjb2RlIiwiZXZlbnQiLCJwb2ludCIsImNvbnZlcnRUb05vZGVTcGFjZUFSIiwiZ2V0TG9jYXRpb24iLCJwb2ludEluQnV0dG9uIiwiYnV0dG9uIiwia2V5Q29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDUCxhQUFTRCxFQUFFLENBQUNFLFNBREw7QUFHUEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLFFBQVEsRUFBRUosRUFBRSxDQUFDSyxRQURIO0FBRVZDLElBQUFBLFVBQVUsRUFBRU4sRUFBRSxDQUFDTyxLQUZMO0FBR1ZDLElBQUFBLFNBQVMsRUFBRVIsRUFBRSxDQUFDTyxLQUhKO0FBSVZFLElBQUFBLFFBQVEsRUFBRVQsRUFBRSxDQUFDTyxLQUpIO0FBS1ZHLElBQUFBLFdBQVcsRUFBRVYsRUFBRSxDQUFDVztBQUxOLEdBSEw7QUFXUEMsRUFBQUEsTUFYTyxvQkFXRTtBQUNQLFNBQUtDLE1BQUwsR0FBYyxHQUFkO0FBQ0EsU0FBS0MsTUFBTCxHQUFjLEdBQWQ7QUFDQSxTQUFLQyxPQUFMLEdBQWUsSUFBZjtBQUNBLFNBQUtDLElBQUwsR0FBWSxFQUFaO0FBQ0EsU0FBS0MsS0FBTCxHQUFhLE1BQWI7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLENBQWxCO0FBQ0EsU0FBS0MsTUFBTCxHQUFjLENBQWQ7QUFDQSxTQUFLQyxLQUFMLEdBQWEsQ0FBYjtBQUNBLFNBQUtDLEtBQUwsR0FBYSxDQUFiO0FBQ0EsU0FBS0MsS0FBTCxHQUFhLEdBQWI7QUFDQSxTQUFLQyxPQUFMLEdBQWUsRUFBZjtBQUNBLFNBQUtDLE9BQUwsR0FBZSxJQUFmO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQixJQUFoQjtBQUNBLFNBQUtDLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxTQUFLQyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQixJQUFqQjtBQUNBLFNBQUtDLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxTQUFLQyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsU0FBS0MsWUFBTCxHQUFvQixJQUFwQjtBQUNBLFNBQUtDLE1BQUwsR0FBYyxFQUFkO0FBQ0EsU0FBS0MsWUFBTCxHQUFvQixFQUFwQjtBQUNBLFNBQUtDLFlBQUwsR0FBb0IsRUFBcEI7QUFDQSxTQUFLQyxZQUFMLEdBQW9CLEVBQXBCO0FBQ0EsU0FBS0MsY0FBTCxHQUFzQixFQUF0QjtBQUNBLFNBQUtDLGNBQUwsR0FBc0IsSUFBdEI7QUFDQSxTQUFLQyxjQUFMLEdBQXNCLEVBQXRCO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixDQUNqQjtBQUFFQyxNQUFBQSxFQUFFLEVBQUUsT0FBTjtBQUFlQyxNQUFBQSxDQUFDLEVBQUUsQ0FBQyxHQUFuQjtBQUF3QkMsTUFBQUEsQ0FBQyxFQUFFLENBQUMsRUFBNUI7QUFBZ0NDLE1BQUFBLENBQUMsRUFBRSxHQUFuQztBQUF3Q0MsTUFBQUEsQ0FBQyxFQUFFO0FBQTNDLEtBRGlCLEVBRWpCO0FBQUVKLE1BQUFBLEVBQUUsRUFBRSxRQUFOO0FBQWdCQyxNQUFBQSxDQUFDLEVBQUUsR0FBbkI7QUFBd0JDLE1BQUFBLENBQUMsRUFBRSxDQUFDLEVBQTVCO0FBQWdDQyxNQUFBQSxDQUFDLEVBQUUsR0FBbkM7QUFBd0NDLE1BQUFBLENBQUMsRUFBRTtBQUEzQyxLQUZpQixDQUFuQjtBQUtBLFNBQUtDLGdCQUFMO0FBQ0EsU0FBS0MsU0FBTDtBQUNBLFNBQUtDLGVBQUw7QUFDQSxTQUFLQyxRQUFMO0FBRUFoRCxJQUFBQSxFQUFFLENBQUNpRCxXQUFILENBQWVDLEVBQWYsQ0FBa0JsRCxFQUFFLENBQUNtRCxXQUFILENBQWVDLFNBQWYsQ0FBeUJDLFFBQTNDLEVBQXFELEtBQUtDLFNBQTFELEVBQXFFLElBQXJFO0FBQ0F0RCxJQUFBQSxFQUFFLENBQUNpRCxXQUFILENBQWVDLEVBQWYsQ0FBa0JsRCxFQUFFLENBQUNtRCxXQUFILENBQWVDLFNBQWYsQ0FBeUJHLE1BQTNDLEVBQW1ELEtBQUtDLE9BQXhELEVBQWlFLElBQWpFO0FBQ0QsR0FsRE07QUFvRFBDLEVBQUFBLFNBcERPLHVCQW9ESztBQUNWekQsSUFBQUEsRUFBRSxDQUFDaUQsV0FBSCxDQUFlUyxHQUFmLENBQW1CMUQsRUFBRSxDQUFDbUQsV0FBSCxDQUFlQyxTQUFmLENBQXlCQyxRQUE1QyxFQUFzRCxLQUFLQyxTQUEzRCxFQUFzRSxJQUF0RTtBQUNBdEQsSUFBQUEsRUFBRSxDQUFDaUQsV0FBSCxDQUFlUyxHQUFmLENBQW1CMUQsRUFBRSxDQUFDbUQsV0FBSCxDQUFlQyxTQUFmLENBQXlCRyxNQUE1QyxFQUFvRCxLQUFLQyxPQUF6RCxFQUFrRSxJQUFsRTtBQUNBLFNBQUtHLElBQUwsQ0FBVUQsR0FBVixDQUFjMUQsRUFBRSxDQUFDNEQsSUFBSCxDQUFRUixTQUFSLENBQWtCUyxTQUFoQyxFQUEyQyxLQUFLQyxVQUFoRCxFQUE0RCxJQUE1RDtBQUNELEdBeERNO0FBMERQQyxFQUFBQSxNQTFETyxrQkEwREFDLEVBMURBLEVBMERJO0FBQ1RBLElBQUFBLEVBQUUsR0FBR0MsSUFBSSxDQUFDQyxHQUFMLENBQVNGLEVBQVQsRUFBYSxJQUFJLEVBQWpCLENBQUw7QUFDQSxTQUFLRyxhQUFMO0FBQ0EsUUFBSSxLQUFLbEQsS0FBTCxLQUFlLFNBQW5CLEVBQThCLEtBQUttRCxRQUFMLENBQWNKLEVBQWQ7QUFDOUIsU0FBS0ssSUFBTDtBQUNELEdBL0RNO0FBaUVQeEIsRUFBQUEsZ0JBakVPLDhCQWlFWTtBQUNqQixTQUFLYyxJQUFMLENBQVVXLGNBQVYsQ0FBeUIsS0FBS3pELE1BQTlCLEVBQXNDLEtBQUtDLE1BQTNDOztBQUVBLFFBQUksQ0FBQyxLQUFLVixRQUFWLEVBQW9CO0FBQ2xCLFVBQU1tRSxRQUFRLEdBQUcsSUFBSXZFLEVBQUUsQ0FBQzRELElBQVAsQ0FBWSxjQUFaLENBQWpCO0FBQ0FXLE1BQUFBLFFBQVEsQ0FBQ0MsTUFBVCxHQUFrQixLQUFLYixJQUF2QjtBQUNBLFdBQUt2RCxRQUFMLEdBQWdCbUUsUUFBUSxDQUFDRSxZQUFULENBQXNCekUsRUFBRSxDQUFDSyxRQUF6QixDQUFoQjtBQUNEOztBQUNELFFBQUksQ0FBQyxLQUFLcUUsVUFBVixFQUFzQjtBQUNwQixXQUFLQSxVQUFMLEdBQWtCLElBQUkxRSxFQUFFLENBQUM0RCxJQUFQLENBQVksWUFBWixDQUFsQjtBQUNBLFdBQUtjLFVBQUwsQ0FBZ0JGLE1BQWhCLEdBQXlCLEtBQUtiLElBQTlCO0FBQ0Q7O0FBQ0QsUUFBSSxDQUFDLEtBQUtnQixZQUFWLEVBQXdCLEtBQUtBLFlBQUwsR0FBb0IsS0FBS0MsY0FBTCxDQUFvQixnQkFBcEIsRUFBc0MsQ0FBdEMsRUFBeUMsQ0FBekMsRUFBNEMsR0FBNUMsRUFBaUQsR0FBakQsQ0FBcEI7QUFDeEIsUUFBSSxDQUFDLEtBQUtDLFdBQVYsRUFBdUIsS0FBS0EsV0FBTCxHQUFtQixLQUFLRCxjQUFMLENBQW9CLFlBQXBCLEVBQWtDLENBQWxDLEVBQXFDLEdBQXJDLEVBQTBDLEdBQTFDLEVBQStDLEdBQS9DLENBQW5CO0FBQ3ZCLFFBQUksQ0FBQyxLQUFLRSxnQkFBVixFQUE0QixLQUFLQSxnQkFBTCxHQUF3QixLQUFLRixjQUFMLENBQW9CLFlBQXBCLEVBQWtDLENBQUMsR0FBbkMsRUFBd0MsQ0FBQyxFQUF6QyxFQUE2QyxHQUE3QyxFQUFrRCxFQUFsRCxDQUF4QjtBQUM1QixRQUFJLENBQUMsS0FBS0csa0JBQVYsRUFBOEIsS0FBS0Esa0JBQUwsR0FBMEIsS0FBS0gsY0FBTCxDQUFvQixjQUFwQixFQUFvQyxHQUFwQyxFQUF5QyxDQUFDLEVBQTFDLEVBQThDLEdBQTlDLEVBQW1ELEVBQW5ELENBQTFCO0FBQzlCLFFBQUksQ0FBQyxLQUFLSSxZQUFWLEVBQXdCLEtBQUtBLFlBQUwsR0FBb0IsS0FBS0osY0FBTCxDQUFvQixhQUFwQixFQUFtQyxDQUFuQyxFQUFzQyxDQUF0QyxFQUF5QyxFQUF6QyxFQUE2QyxFQUE3QyxDQUFwQjtBQUN4QixRQUFJLENBQUMsS0FBS0ssZUFBVixFQUEyQixLQUFLQSxlQUFMLEdBQXVCLEtBQUtMLGNBQUwsQ0FBb0IsV0FBcEIsRUFBaUMsQ0FBQyxHQUFsQyxFQUF1QyxDQUFDLEdBQXhDLEVBQTZDLEVBQTdDLEVBQWlELEVBQWpELENBQXZCO0FBQzNCLFFBQUksQ0FBQyxLQUFLTSxnQkFBVixFQUE0QixLQUFLQSxnQkFBTCxHQUF3QixLQUFLTixjQUFMLENBQW9CLFlBQXBCLEVBQWtDLEdBQWxDLEVBQXVDLENBQUMsR0FBeEMsRUFBNkMsRUFBN0MsRUFBaUQsRUFBakQsQ0FBeEI7QUFDNUIsUUFBSSxDQUFDLEtBQUtPLFVBQVYsRUFBc0IsS0FBS0EsVUFBTCxHQUFrQixLQUFLUCxjQUFMLENBQW9CLFlBQXBCLEVBQWtDLENBQWxDLEVBQXFDLENBQXJDLEVBQXdDLEVBQXhDLEVBQTRDLEdBQTVDLENBQWxCO0FBQ3RCLFFBQUksQ0FBQyxLQUFLUSxRQUFWLEVBQW9CLEtBQUtBLFFBQUwsR0FBZ0IsS0FBS1IsY0FBTCxDQUFvQixVQUFwQixFQUFnQyxDQUFDLEdBQWpDLEVBQXNDLEdBQXRDLEVBQTJDLEVBQTNDLEVBQStDLEVBQS9DLENBQWhCO0FBQ3BCLFFBQUksQ0FBQyxLQUFLUyxTQUFWLEVBQXFCLEtBQUtBLFNBQUwsR0FBaUIsS0FBS1QsY0FBTCxDQUFvQixXQUFwQixFQUFpQyxHQUFqQyxFQUFzQyxHQUF0QyxFQUEyQyxFQUEzQyxFQUErQyxFQUEvQyxDQUFqQjtBQUNyQixRQUFJLENBQUMsS0FBS1UsU0FBVixFQUFxQixLQUFLQSxTQUFMLEdBQWlCLEtBQUtWLGNBQUwsQ0FBb0IsV0FBcEIsRUFBaUMsR0FBakMsRUFBc0MsR0FBdEMsRUFBMkMsRUFBM0MsRUFBK0MsRUFBL0MsQ0FBakI7QUFDckIsUUFBSSxDQUFDLEtBQUt0RSxVQUFWLEVBQXNCLEtBQUtBLFVBQUwsR0FBa0IsS0FBS2lGLFNBQUwsQ0FBZSxPQUFmLEVBQXdCLEVBQXhCLEVBQTRCLEdBQTVCLEVBQWlDLEVBQWpDLENBQWxCO0FBQ3RCLFFBQUksQ0FBQyxLQUFLL0UsU0FBVixFQUFxQixLQUFLQSxTQUFMLEdBQWlCLEtBQUsrRSxTQUFMLENBQWUsTUFBZixFQUF1QixFQUF2QixFQUEyQixHQUEzQixFQUFnQyxFQUFoQyxDQUFqQjtBQUNyQixRQUFJLENBQUMsS0FBSzlFLFFBQVYsRUFBb0IsS0FBS0EsUUFBTCxHQUFnQixLQUFLOEUsU0FBTCxDQUFlLEtBQWYsRUFBc0IsQ0FBdEIsRUFBeUIsR0FBekIsRUFBOEIsRUFBOUIsQ0FBaEI7QUFDcEIsUUFBSSxDQUFDLEtBQUtDLFVBQVYsRUFBc0IsS0FBS0EsVUFBTCxHQUFrQixLQUFLRCxTQUFMLENBQWUsWUFBZixFQUE2QixDQUFDLEdBQTlCLEVBQW1DLENBQUMsRUFBcEMsRUFBd0MsRUFBeEMsQ0FBbEI7QUFDdEIsUUFBSSxDQUFDLEtBQUtFLFVBQVYsRUFBc0IsS0FBS0EsVUFBTCxHQUFrQixLQUFLRixTQUFMLENBQWUsWUFBZixFQUE2QixHQUE3QixFQUFrQyxDQUFDLEVBQW5DLEVBQXVDLEVBQXZDLENBQWxCO0FBQ3RCLFFBQUksQ0FBQyxLQUFLN0UsV0FBVixFQUF1QixLQUFLQSxXQUFMLEdBQW1CLEtBQUtpRCxJQUFMLENBQVVjLFlBQVYsQ0FBdUJ6RSxFQUFFLENBQUNXLFdBQTFCLENBQW5CO0FBQ3ZCLFNBQUtnRCxJQUFMLENBQVVULEVBQVYsQ0FBYWxELEVBQUUsQ0FBQzRELElBQUgsQ0FBUVIsU0FBUixDQUFrQlMsU0FBL0IsRUFBMEMsS0FBS0MsVUFBL0MsRUFBMkQsSUFBM0Q7QUFDRCxHQS9GTTtBQWlHUGMsRUFBQUEsY0FqR08sMEJBaUdRYyxJQWpHUixFQWlHY2pELENBakdkLEVBaUdpQkMsQ0FqR2pCLEVBaUdvQkMsQ0FqR3BCLEVBaUd1QkMsQ0FqR3ZCLEVBaUcwQjtBQUMvQixRQUFNZSxJQUFJLEdBQUcsSUFBSTNELEVBQUUsQ0FBQzRELElBQVAsQ0FBWThCLElBQVosQ0FBYjtBQUNBL0IsSUFBQUEsSUFBSSxDQUFDYSxNQUFMLEdBQWMsS0FBS0UsVUFBTCxJQUFtQixLQUFLZixJQUF0QztBQUNBQSxJQUFBQSxJQUFJLENBQUNnQyxNQUFMLEdBQWMsS0FBS0MsWUFBTCxDQUFrQkYsSUFBbEIsQ0FBZDtBQUNBL0IsSUFBQUEsSUFBSSxDQUFDa0MsV0FBTCxDQUFpQnBELENBQWpCLEVBQW9CQyxDQUFwQjtBQUNBaUIsSUFBQUEsSUFBSSxDQUFDVyxjQUFMLENBQW9CM0IsQ0FBcEIsRUFBdUJDLENBQXZCO0FBQ0EsUUFBTWtELE1BQU0sR0FBR25DLElBQUksQ0FBQ2MsWUFBTCxDQUFrQnpFLEVBQUUsQ0FBQytGLE1BQXJCLENBQWY7QUFDQUQsSUFBQUEsTUFBTSxDQUFDRSxRQUFQLEdBQWtCaEcsRUFBRSxDQUFDK0YsTUFBSCxDQUFVRSxRQUFWLENBQW1CQyxNQUFyQztBQUNBLFdBQU9KLE1BQVA7QUFDRCxHQTFHTTtBQTRHUEYsRUFBQUEsWUE1R08sd0JBNEdNRixJQTVHTixFQTRHWTtBQUNqQixRQUFJQSxJQUFJLEtBQUssZ0JBQWIsRUFBK0IsT0FBTyxDQUFDLEVBQVI7QUFDL0IsUUFBSUEsSUFBSSxLQUFLLFlBQVQsSUFBeUJBLElBQUksQ0FBQ1MsT0FBTCxDQUFhLFFBQWIsS0FBMEIsQ0FBdkQsRUFBMEQsT0FBTyxFQUFQO0FBQzFELFFBQUlULElBQUksQ0FBQ1MsT0FBTCxDQUFhLGFBQWIsTUFBZ0MsQ0FBcEMsRUFBdUMsT0FBTyxDQUFDLENBQVI7QUFDdkMsUUFBSVQsSUFBSSxDQUFDUyxPQUFMLENBQWEsWUFBYixNQUErQixDQUFuQyxFQUFzQyxPQUFPLENBQVA7QUFDdEMsUUFBSVQsSUFBSSxLQUFLLFlBQWIsRUFBMkIsT0FBTyxDQUFQO0FBQzNCLFFBQUlBLElBQUksQ0FBQ1MsT0FBTCxDQUFhLGVBQWIsTUFBa0MsQ0FBdEMsRUFBeUMsT0FBTyxDQUFQO0FBQ3pDLFFBQUlULElBQUksQ0FBQ1MsT0FBTCxDQUFhLGNBQWIsTUFBaUMsQ0FBakMsSUFBc0NULElBQUksS0FBSyxZQUFuRCxFQUFpRSxPQUFPLENBQVA7QUFDakUsUUFBSUEsSUFBSSxLQUFLLGFBQVQsSUFBMEJBLElBQUksS0FBSyxXQUF2QyxFQUFvRCxPQUFPLEVBQVA7QUFDcEQsUUFBSUEsSUFBSSxDQUFDUyxPQUFMLENBQWEsTUFBYixLQUF3QixDQUE1QixFQUErQixPQUFPLEVBQVA7QUFDL0IsV0FBTyxDQUFQO0FBQ0QsR0F2SE07QUF5SFBaLEVBQUFBLFNBekhPLHFCQXlIR0csSUF6SEgsRUF5SFNqRCxDQXpIVCxFQXlIWUMsQ0F6SFosRUF5SGUwRCxJQXpIZixFQXlIcUI7QUFDMUIsUUFBTXpDLElBQUksR0FBRyxJQUFJM0QsRUFBRSxDQUFDNEQsSUFBUCxDQUFZOEIsSUFBWixDQUFiO0FBQ0EvQixJQUFBQSxJQUFJLENBQUNhLE1BQUwsR0FBYyxLQUFLYixJQUFuQjtBQUNBQSxJQUFBQSxJQUFJLENBQUNrQyxXQUFMLENBQWlCcEQsQ0FBakIsRUFBb0JDLENBQXBCO0FBQ0FpQixJQUFBQSxJQUFJLENBQUNXLGNBQUwsQ0FBb0IsR0FBcEIsRUFBeUI4QixJQUFJLEdBQUcsQ0FBaEM7QUFDQSxRQUFNQyxLQUFLLEdBQUcxQyxJQUFJLENBQUNjLFlBQUwsQ0FBa0J6RSxFQUFFLENBQUNPLEtBQXJCLENBQWQ7QUFDQThGLElBQUFBLEtBQUssQ0FBQ0MsUUFBTixHQUFpQkYsSUFBakI7QUFDQUMsSUFBQUEsS0FBSyxDQUFDRSxVQUFOLEdBQW1CSCxJQUFJLEdBQUcsQ0FBMUI7QUFDQUMsSUFBQUEsS0FBSyxDQUFDRyxlQUFOLEdBQXdCeEcsRUFBRSxDQUFDTyxLQUFILENBQVNrRyxlQUFULENBQXlCQyxNQUFqRDtBQUNBTCxJQUFBQSxLQUFLLENBQUNNLGFBQU4sR0FBc0IzRyxFQUFFLENBQUNPLEtBQUgsQ0FBU3FHLGFBQVQsQ0FBdUJGLE1BQTdDO0FBQ0EvQyxJQUFBQSxJQUFJLENBQUNrRCxLQUFMLEdBQWE3RyxFQUFFLENBQUM4RyxLQUFILENBQVNDLEtBQXRCO0FBQ0EsV0FBT1YsS0FBUDtBQUNELEdBcklNO0FBdUlQdkQsRUFBQUEsU0F2SU8sdUJBdUlLO0FBQUE7O0FBQ1Y5QyxJQUFBQSxFQUFFLENBQUNnSCxTQUFILENBQWFDLElBQWIsQ0FBa0Isd0JBQWxCLEVBQTRDakgsRUFBRSxDQUFDa0gsU0FBL0MsRUFBMEQsVUFBQ0MsR0FBRCxFQUFNQyxJQUFOLEVBQWU7QUFDdkUsVUFBSSxDQUFDRCxHQUFELElBQVFDLElBQVosRUFBa0I7QUFDaEIsUUFBQSxLQUFJLENBQUM1RixPQUFMLEdBQWU0RixJQUFmO0FBQ0EsUUFBQSxLQUFJLENBQUMxRyxXQUFMLENBQWlCMEcsSUFBakIsR0FBd0JBLElBQXhCO0FBQ0EsUUFBQSxLQUFJLENBQUMxRyxXQUFMLENBQWlCMkcsSUFBakIsR0FBd0IsSUFBeEI7QUFDRDtBQUNGLEtBTkQ7QUFPQXJILElBQUFBLEVBQUUsQ0FBQ2dILFNBQUgsQ0FBYUMsSUFBYixDQUFrQix1QkFBbEIsRUFBMkNqSCxFQUFFLENBQUNrSCxTQUE5QyxFQUF5RCxVQUFDSSxJQUFELEVBQU9GLElBQVAsRUFBZ0I7QUFBRSxNQUFBLEtBQUksQ0FBQzNGLFFBQUwsR0FBZ0IyRixJQUFoQjtBQUF1QixLQUFsRztBQUNBcEgsSUFBQUEsRUFBRSxDQUFDZ0gsU0FBSCxDQUFhQyxJQUFiLENBQWtCLHdCQUFsQixFQUE0Q2pILEVBQUUsQ0FBQ2tILFNBQS9DLEVBQTBELFVBQUNJLElBQUQsRUFBT0YsSUFBUCxFQUFnQjtBQUFFLE1BQUEsS0FBSSxDQUFDMUYsU0FBTCxHQUFpQjBGLElBQWpCO0FBQXdCLEtBQXBHO0FBQ0FwSCxJQUFBQSxFQUFFLENBQUNnSCxTQUFILENBQWFDLElBQWIsQ0FBa0IsOEJBQWxCLEVBQWtEakgsRUFBRSxDQUFDa0gsU0FBckQsRUFBZ0UsVUFBQ0ksSUFBRCxFQUFPRixJQUFQLEVBQWdCO0FBQUUsTUFBQSxLQUFJLENBQUN6RixRQUFMLEdBQWdCeUYsSUFBaEI7QUFBdUIsS0FBekc7QUFDQXBILElBQUFBLEVBQUUsQ0FBQ2dILFNBQUgsQ0FBYUMsSUFBYixDQUFrQiwwQkFBbEIsRUFBOENqSCxFQUFFLENBQUNrSCxTQUFqRCxFQUE0RCxVQUFDSSxJQUFELEVBQU9GLElBQVAsRUFBZ0I7QUFBRSxNQUFBLEtBQUksQ0FBQ3hGLFNBQUwsR0FBaUJ3RixJQUFqQjtBQUF3QixLQUF0RztBQUNBcEgsSUFBQUEsRUFBRSxDQUFDZ0gsU0FBSCxDQUFhQyxJQUFiLENBQWtCLHVCQUFsQixFQUEyQ2pILEVBQUUsQ0FBQ2tILFNBQTlDLEVBQXlELFVBQUNJLElBQUQsRUFBT0YsSUFBUCxFQUFnQjtBQUFFLE1BQUEsS0FBSSxDQUFDdkYsUUFBTCxHQUFnQnVGLElBQWhCO0FBQXVCLEtBQWxHO0FBQ0FwSCxJQUFBQSxFQUFFLENBQUNnSCxTQUFILENBQWFDLElBQWIsQ0FBa0IsNkJBQWxCLEVBQWlEakgsRUFBRSxDQUFDa0gsU0FBcEQsRUFBK0QsVUFBQ0ksSUFBRCxFQUFPRixJQUFQLEVBQWdCO0FBQUUsTUFBQSxLQUFJLENBQUN0RixTQUFMLEdBQWlCc0YsSUFBakI7QUFBd0IsS0FBekc7QUFDQXBILElBQUFBLEVBQUUsQ0FBQ2dILFNBQUgsQ0FBYUMsSUFBYixDQUFrQiw0QkFBbEIsRUFBZ0RqSCxFQUFFLENBQUNrSCxTQUFuRCxFQUE4RCxVQUFDSSxJQUFELEVBQU9GLElBQVAsRUFBZ0I7QUFBRSxNQUFBLEtBQUksQ0FBQ3JGLFlBQUwsR0FBb0JxRixJQUFwQjtBQUEyQixLQUEzRztBQUNELEdBdEpNO0FBd0pQckUsRUFBQUEsZUF4Sk8sNkJBd0pXO0FBQUE7O0FBQ2hCLFNBQUt3RSxlQUFMLENBQXFCLDZCQUFyQixFQUFvRCxVQUFDQyxLQUFELEVBQVc7QUFDN0QsTUFBQSxNQUFJLENBQUN4RixNQUFMLENBQVl5RixNQUFaLEdBQXFCRCxLQUFyQjtBQUNBLE1BQUEsTUFBSSxDQUFDN0MsWUFBTCxDQUFrQitDLFdBQWxCLEdBQWdDRixLQUFoQztBQUNELEtBSEQ7QUFJQSxTQUFLRCxlQUFMLENBQXFCLDZCQUFyQixFQUFvRCxVQUFDQyxLQUFELEVBQVc7QUFDN0QsTUFBQSxNQUFJLENBQUN4RixNQUFMLENBQVkyRixLQUFaLEdBQW9CSCxLQUFwQjtBQUNBLE1BQUEsTUFBSSxDQUFDM0MsV0FBTCxDQUFpQjZDLFdBQWpCLEdBQStCRixLQUEvQjtBQUNBLE1BQUEsTUFBSSxDQUFDbEgsVUFBTCxDQUFnQnFELElBQWhCLENBQXFCaUUsTUFBckIsR0FBOEIsS0FBOUI7QUFDRCxLQUpEO0FBS0EsU0FBS0wsZUFBTCxDQUFxQixpQ0FBckIsRUFBd0QsVUFBQ0MsS0FBRCxFQUFXO0FBQ2pFLE1BQUEsTUFBSSxDQUFDeEYsTUFBTCxDQUFZNkYsVUFBWixHQUF5QkwsS0FBekI7QUFDQSxNQUFBLE1BQUksQ0FBQzFDLGdCQUFMLENBQXNCNEMsV0FBdEIsR0FBb0NGLEtBQXBDO0FBQ0QsS0FIRDtBQUlBLFNBQUtELGVBQUwsQ0FBcUIsbUNBQXJCLEVBQTBELFVBQUNDLEtBQUQsRUFBVztBQUNuRSxNQUFBLE1BQUksQ0FBQ3hGLE1BQUwsQ0FBWThGLFlBQVosR0FBMkJOLEtBQTNCO0FBQ0EsTUFBQSxNQUFJLENBQUN6QyxrQkFBTCxDQUF3QjJDLFdBQXhCLEdBQXNDRixLQUF0QztBQUNELEtBSEQ7QUFJQSxTQUFLTyxlQUFMLENBQXFCLCtCQUFyQixFQUFzRCxVQUFDQyxLQUFELEVBQVc7QUFDL0QsVUFBTWhHLE1BQU0sR0FBRyxDQUFDLGVBQUQsRUFBa0IsZUFBbEIsRUFBbUMsZUFBbkMsRUFBb0QsZUFBcEQsRUFDWmlHLEdBRFksQ0FDUixVQUFDdkMsSUFBRDtBQUFBLGVBQVVzQyxLQUFLLENBQUNFLGNBQU4sQ0FBcUJ4QyxJQUFyQixDQUFWO0FBQUEsT0FEUSxFQUVaeUMsTUFGWSxDQUVMLFVBQUNYLEtBQUQ7QUFBQSxlQUFXLENBQUMsQ0FBQ0EsS0FBYjtBQUFBLE9BRkssQ0FBZjtBQUdBLE1BQUEsTUFBSSxDQUFDeEYsTUFBTCxDQUFZb0csZ0JBQVosR0FBK0JwRyxNQUEvQjtBQUNBLE1BQUEsTUFBSSxDQUFDQSxNQUFMLENBQVlxRyxVQUFaLEdBQXlCckcsTUFBTSxDQUFDLENBQUQsQ0FBL0I7QUFDQSxNQUFBLE1BQUksQ0FBQ2dELFlBQUwsQ0FBa0IwQyxXQUFsQixHQUFnQzFGLE1BQU0sQ0FBQyxDQUFELENBQXRDO0FBQ0EsTUFBQSxNQUFJLENBQUNpRCxlQUFMLENBQXFCeUMsV0FBckIsR0FBbUMxRixNQUFNLENBQUMsQ0FBRCxDQUF6QztBQUNELEtBUkQ7QUFTQSxTQUFLK0YsZUFBTCxDQUFxQiwyQkFBckIsRUFBa0QsVUFBQ0MsS0FBRCxFQUFXO0FBQzNELFVBQU1oRyxNQUFNLEdBQUcsQ0FBQyxVQUFELEVBQWEsVUFBYixFQUF5QixVQUF6QixFQUNaaUcsR0FEWSxDQUNSLFVBQUN2QyxJQUFEO0FBQUEsZUFBVXNDLEtBQUssQ0FBQ0UsY0FBTixDQUFxQnhDLElBQXJCLENBQVY7QUFBQSxPQURRLEVBRVp5QyxNQUZZLENBRUwsVUFBQ1gsS0FBRDtBQUFBLGVBQVcsQ0FBQyxDQUFDQSxLQUFiO0FBQUEsT0FGSyxDQUFmO0FBR0EsTUFBQSxNQUFJLENBQUN4RixNQUFMLENBQVlzRyxZQUFaLEdBQTJCdEcsTUFBM0I7QUFDQSxNQUFBLE1BQUksQ0FBQ0EsTUFBTCxDQUFZdUcsTUFBWixHQUFxQnZHLE1BQU0sQ0FBQyxDQUFELENBQTNCO0FBQ0EsTUFBQSxNQUFJLENBQUNrRCxnQkFBTCxDQUFzQndDLFdBQXRCLEdBQW9DMUYsTUFBTSxDQUFDLENBQUQsQ0FBMUM7QUFDRCxLQVBEO0FBUUEsU0FBS3VGLGVBQUwsQ0FBcUIsMEJBQXJCLEVBQWlELFVBQUNDLEtBQUQsRUFBVztBQUMxRCxNQUFBLE1BQUksQ0FBQ3hGLE1BQUwsQ0FBWXdHLElBQVosR0FBbUJoQixLQUFuQjtBQUNBLE1BQUEsTUFBSSxDQUFDckMsVUFBTCxDQUFnQnVDLFdBQWhCLEdBQThCRixLQUE5QjtBQUNELEtBSEQ7QUFJQSxTQUFLRCxlQUFMLENBQXFCLDBCQUFyQixFQUFpRCxVQUFDQyxLQUFELEVBQVc7QUFDMUQsTUFBQSxNQUFJLENBQUN4RixNQUFMLENBQVl5RyxJQUFaLEdBQW1CakIsS0FBbkI7QUFDQSxNQUFBLE1BQUksQ0FBQ3BDLFFBQUwsQ0FBY3NDLFdBQWQsR0FBNEJGLEtBQTVCO0FBQ0QsS0FIRDtBQUlBLFNBQUtELGVBQUwsQ0FBcUIsMkJBQXJCLEVBQWtELFVBQUNDLEtBQUQsRUFBVztBQUMzRCxNQUFBLE1BQUksQ0FBQ3hGLE1BQUwsQ0FBWTBHLEtBQVosR0FBb0JsQixLQUFwQjtBQUNBLE1BQUEsTUFBSSxDQUFDbkMsU0FBTCxDQUFlMUIsSUFBZixDQUFvQmlFLE1BQXBCLEdBQTZCLEtBQTdCO0FBQ0QsS0FIRDtBQUlBLFNBQUtMLGVBQUwsQ0FBcUIsMkJBQXJCLEVBQWtELFVBQUNDLEtBQUQsRUFBVztBQUMzRCxNQUFBLE1BQUksQ0FBQ3hGLE1BQUwsQ0FBWVYsS0FBWixHQUFvQmtHLEtBQXBCO0FBQ0EsTUFBQSxNQUFJLENBQUNsQyxTQUFMLENBQWVvQyxXQUFmLEdBQTZCRixLQUE3QjtBQUNELEtBSEQ7QUFJQSxTQUFLTyxlQUFMLENBQXFCLG1DQUFyQixFQUEwRCxVQUFDQyxLQUFELEVBQVc7QUFDbkUsTUFBQSxNQUFJLENBQUNoRyxNQUFMLENBQVkyRyxTQUFaLEdBQXdCWCxLQUFLLENBQUNFLGNBQU4sQ0FBcUIsV0FBckIsQ0FBeEI7QUFDQSxNQUFBLE1BQUksQ0FBQ2xHLE1BQUwsQ0FBWTRHLFVBQVosR0FBeUJaLEtBQUssQ0FBQ0UsY0FBTixDQUFxQixXQUFyQixDQUF6QjtBQUNBLE1BQUEsTUFBSSxDQUFDbEcsTUFBTCxDQUFZNkcsU0FBWixHQUF3QmIsS0FBSyxDQUFDRSxjQUFOLENBQXFCLFNBQXJCLENBQXhCO0FBQ0EsTUFBQSxNQUFJLENBQUNsRyxNQUFMLENBQVk4RyxZQUFaLEdBQTJCZCxLQUFLLENBQUNFLGNBQU4sQ0FBcUIsV0FBckIsQ0FBM0I7QUFDQSxNQUFBLE1BQUksQ0FBQ2xHLE1BQUwsQ0FBWStHLFFBQVosR0FBdUJmLEtBQUssQ0FBQ0UsY0FBTixDQUFxQixXQUFyQixDQUF2QjtBQUNBLE1BQUEsTUFBSSxDQUFDbEcsTUFBTCxDQUFZZ0gsU0FBWixHQUF3QixJQUF4QjtBQUNBLE1BQUEsTUFBSSxDQUFDaEgsTUFBTCxDQUFZaUgsT0FBWixHQUFzQmpCLEtBQUssQ0FBQ0UsY0FBTixDQUFxQixVQUFyQixLQUFvQ0YsS0FBSyxDQUFDRSxjQUFOLENBQXFCLFdBQXJCLENBQTFEO0FBQ0EsTUFBQSxNQUFJLENBQUNsRyxNQUFMLENBQVlrSCxRQUFaLEdBQXVCbEIsS0FBSyxDQUFDRSxjQUFOLENBQXFCLFVBQXJCLEtBQW9DRixLQUFLLENBQUNFLGNBQU4sQ0FBcUIsV0FBckIsQ0FBM0Q7QUFDQSxNQUFBLE1BQUksQ0FBQ2xHLE1BQUwsQ0FBWW1ILFFBQVosR0FBdUJuQixLQUFLLENBQUNFLGNBQU4sQ0FBcUIsU0FBckIsQ0FBdkI7QUFDQSxNQUFBLE1BQUksQ0FBQ2xHLE1BQUwsQ0FBWW9ILFFBQVosR0FBdUJwQixLQUFLLENBQUNFLGNBQU4sQ0FBcUIsV0FBckIsQ0FBdkI7QUFDQSxNQUFBLE1BQUksQ0FBQ2xHLE1BQUwsQ0FBWXFILFFBQVosR0FBdUJyQixLQUFLLENBQUNFLGNBQU4sQ0FBcUIsV0FBckIsS0FBcUNGLEtBQUssQ0FBQ0UsY0FBTixDQUFxQixXQUFyQixDQUE1RDtBQUNBLE1BQUEsTUFBSSxDQUFDbEcsTUFBTCxDQUFZc0gsU0FBWixHQUF3QnRCLEtBQUssQ0FBQ0UsY0FBTixDQUFxQixVQUFyQixLQUFvQ0YsS0FBSyxDQUFDRSxjQUFOLENBQXFCLFdBQXJCLENBQTVEO0FBQ0EsTUFBQSxNQUFJLENBQUNsRyxNQUFMLENBQVl1SCxRQUFaLEdBQXVCLElBQXZCO0FBQ0QsS0FkRDtBQWVBLFNBQUt4QixlQUFMLENBQXFCLG1DQUFyQixFQUEwRCxVQUFDQyxLQUFELEVBQVc7QUFDbkUsTUFBQSxNQUFJLENBQUNoRyxNQUFMLENBQVl3SCxRQUFaLEdBQXVCeEIsS0FBSyxDQUFDRSxjQUFOLENBQXFCLFVBQXJCLENBQXZCO0FBQ0EsTUFBQSxNQUFJLENBQUNsRyxNQUFMLENBQVl5SCxJQUFaLEdBQW1CekIsS0FBSyxDQUFDRSxjQUFOLENBQXFCLFVBQXJCLENBQW5CO0FBQ0EsTUFBQSxNQUFJLENBQUNsRyxNQUFMLENBQVkrRyxRQUFaLEdBQXVCZixLQUFLLENBQUNFLGNBQU4sQ0FBcUIsVUFBckIsS0FBb0MsTUFBSSxDQUFDbEcsTUFBTCxDQUFZK0csUUFBdkU7QUFDQSxNQUFBLE1BQUksQ0FBQy9HLE1BQUwsQ0FBWTBILFNBQVosR0FBd0IxQixLQUFLLENBQUNFLGNBQU4sQ0FBcUIsVUFBckIsQ0FBeEI7QUFDQSxNQUFBLE1BQUksQ0FBQ2xHLE1BQUwsQ0FBWTJILFVBQVosR0FBeUIzQixLQUFLLENBQUNFLGNBQU4sQ0FBcUIsVUFBckIsQ0FBekI7QUFDQSxNQUFBLE1BQUksQ0FBQ2xHLE1BQUwsQ0FBWWdILFNBQVosR0FBd0IsTUFBSSxDQUFDaEgsTUFBTCxDQUFZMEgsU0FBWixJQUF5QixNQUFJLENBQUMxSCxNQUFMLENBQVkySCxVQUFyQyxJQUFtRCxNQUFJLENBQUMzSCxNQUFMLENBQVlnSCxTQUF2RjtBQUNELEtBUEQ7QUFRRCxHQWxPTTtBQW9PUHpCLEVBQUFBLGVBcE9PLDJCQW9PU3FDLElBcE9ULEVBb09lQyxRQXBPZixFQW9PeUI7QUFDOUI3SixJQUFBQSxFQUFFLENBQUNnSCxTQUFILENBQWFDLElBQWIsQ0FBa0IyQyxJQUFsQixFQUF3QjVKLEVBQUUsQ0FBQzhKLFdBQTNCLEVBQXdDLFVBQUMzQyxHQUFELEVBQU1LLEtBQU4sRUFBZ0I7QUFDdEQsVUFBSSxDQUFDTCxHQUFELElBQVFLLEtBQVosRUFBbUJxQyxRQUFRLENBQUNyQyxLQUFELENBQVI7QUFDcEIsS0FGRDtBQUdELEdBeE9NO0FBME9QTyxFQUFBQSxlQTFPTywyQkEwT1M2QixJQTFPVCxFQTBPZUMsUUExT2YsRUEwT3lCO0FBQzlCN0osSUFBQUEsRUFBRSxDQUFDZ0gsU0FBSCxDQUFhQyxJQUFiLENBQWtCMkMsSUFBbEIsRUFBd0I1SixFQUFFLENBQUMrSixXQUEzQixFQUF3QyxVQUFDNUMsR0FBRCxFQUFNYSxLQUFOLEVBQWdCO0FBQ3RELFVBQUksQ0FBQ2IsR0FBRCxJQUFRYSxLQUFaLEVBQW1CNkIsUUFBUSxDQUFDN0IsS0FBRCxDQUFSO0FBQ3BCLEtBRkQ7QUFHRCxHQTlPTTtBQWdQUGdDLEVBQUFBLGNBaFBPLDBCQWdQUUosSUFoUFIsRUFnUGNLLElBaFBkLEVBZ1BvQkosUUFoUHBCLEVBZ1A4QjtBQUNuQzdKLElBQUFBLEVBQUUsQ0FBQ2dILFNBQUgsQ0FBYUMsSUFBYixDQUFrQjJDLElBQWxCLEVBQXdCNUosRUFBRSxDQUFDa0ssU0FBM0IsRUFBc0MsVUFBQy9DLEdBQUQsRUFBTWdELE9BQU4sRUFBa0I7QUFDdEQsVUFBSWhELEdBQUcsSUFBSSxDQUFDZ0QsT0FBWixFQUFxQjtBQUNyQk4sTUFBQUEsUUFBUSxDQUFDLElBQUk3SixFQUFFLENBQUM4SixXQUFQLENBQW1CSyxPQUFuQixFQUE0QkYsSUFBNUIsQ0FBRCxDQUFSO0FBQ0QsS0FIRDtBQUlELEdBclBNO0FBdVBQRyxFQUFBQSxlQXZQTywyQkF1UFNSLElBdlBULEVBdVBlUyxLQXZQZixFQXVQc0JSLFFBdlB0QixFQXVQZ0M7QUFDckM3SixJQUFBQSxFQUFFLENBQUNnSCxTQUFILENBQWFDLElBQWIsQ0FBa0IyQyxJQUFsQixFQUF3QjVKLEVBQUUsQ0FBQ2tLLFNBQTNCLEVBQXNDLFVBQUMvQyxHQUFELEVBQU1nRCxPQUFOLEVBQWtCO0FBQ3RELFVBQUloRCxHQUFHLElBQUksQ0FBQ2dELE9BQVosRUFBcUI7QUFDckJOLE1BQUFBLFFBQVEsQ0FBQ1EsS0FBSyxDQUFDcEMsR0FBTixDQUFVLFVBQUNnQyxJQUFEO0FBQUEsZUFBVSxJQUFJakssRUFBRSxDQUFDOEosV0FBUCxDQUFtQkssT0FBbkIsRUFBNEJGLElBQTVCLENBQVY7QUFBQSxPQUFWLENBQUQsQ0FBUjtBQUNELEtBSEQ7QUFJRCxHQTVQTTtBQThQUGpILEVBQUFBLFFBOVBPLHNCQThQSTtBQUNULFNBQUsvQixLQUFMLEdBQWEsTUFBYjtBQUNBLFNBQUtNLE9BQUwsR0FBZSxFQUFmO0FBQ0EsU0FBS2pCLFVBQUwsQ0FBZ0JnSyxNQUFoQixHQUF5QixXQUF6QjtBQUNBLFNBQUtDLGNBQUwsQ0FBb0IsSUFBcEI7QUFDQSxTQUFLMUYsV0FBTCxDQUFpQmxCLElBQWpCLENBQXNCaUUsTUFBdEIsR0FBK0IsSUFBL0I7QUFDQSxTQUFLdEgsVUFBTCxDQUFnQnFELElBQWhCLENBQXFCaUUsTUFBckIsR0FBOEIsQ0FBQyxLQUFLNUYsTUFBTCxDQUFZMkYsS0FBM0M7QUFDQSxTQUFLaEQsWUFBTCxDQUFrQmhCLElBQWxCLENBQXVCaUUsTUFBdkIsR0FBZ0MsSUFBaEM7QUFDQSxTQUFLakQsWUFBTCxDQUFrQmhCLElBQWxCLENBQXVCa0MsV0FBdkIsQ0FBbUMsQ0FBbkMsRUFBc0MsQ0FBdEM7QUFDQSxTQUFLbEIsWUFBTCxDQUFrQmhCLElBQWxCLENBQXVCVyxjQUF2QixDQUFzQyxHQUF0QyxFQUEyQyxHQUEzQztBQUNBLFNBQUtRLGdCQUFMLENBQXNCbkIsSUFBdEIsQ0FBMkJpRSxNQUEzQixHQUFvQyxJQUFwQztBQUNBLFNBQUs3QyxrQkFBTCxDQUF3QnBCLElBQXhCLENBQTZCaUUsTUFBN0IsR0FBc0MsSUFBdEM7QUFDQSxTQUFLM0MsZUFBTCxDQUFxQnRCLElBQXJCLENBQTBCaUUsTUFBMUIsR0FBbUMsSUFBbkM7QUFDQSxTQUFLMUMsZ0JBQUwsQ0FBc0J2QixJQUF0QixDQUEyQmlFLE1BQTNCLEdBQW9DLElBQXBDO0FBQ0EsU0FBSzVDLFlBQUwsQ0FBa0JyQixJQUFsQixDQUF1QmlFLE1BQXZCLEdBQWdDLEtBQWhDO0FBQ0EsU0FBS3pDLFVBQUwsQ0FBZ0J4QixJQUFoQixDQUFxQmlFLE1BQXJCLEdBQThCLEtBQTlCO0FBQ0EsU0FBSzRDLFlBQUw7QUFDQSxTQUFLQyxnQkFBTDtBQUNBLFNBQUtDLGdCQUFMO0FBQ0EsU0FBS3BLLFVBQUwsQ0FBZ0JxRCxJQUFoQixDQUFxQmtDLFdBQXJCLENBQWlDLENBQWpDLEVBQW9DLEdBQXBDO0FBQ0EsU0FBS3ZGLFVBQUwsQ0FBZ0JnRyxRQUFoQixHQUEyQixFQUEzQjtBQUNBLFNBQUtoRyxVQUFMLENBQWdCaUcsVUFBaEIsR0FBNkIsRUFBN0I7QUFDQSxTQUFLL0YsU0FBTCxDQUFlbUQsSUFBZixDQUFvQmtDLFdBQXBCLENBQWdDLENBQWhDLEVBQW1DLENBQUMsR0FBcEM7QUFDQSxTQUFLckYsU0FBTCxDQUFlOEYsUUFBZixHQUEwQixFQUExQjtBQUNBLFNBQUs5RixTQUFMLENBQWUrRixVQUFmLEdBQTRCLEVBQTVCO0FBQ0EsU0FBSy9GLFNBQUwsQ0FBZThKLE1BQWYsR0FBd0IseURBQXhCO0FBQ0EsU0FBS3hGLGdCQUFMLENBQXNCbkIsSUFBdEIsQ0FBMkJrQyxXQUEzQixDQUF1QyxDQUFDLEdBQXhDLEVBQTZDLENBQUMsRUFBOUM7QUFDQSxTQUFLZCxrQkFBTCxDQUF3QnBCLElBQXhCLENBQTZCa0MsV0FBN0IsQ0FBeUMsR0FBekMsRUFBOEMsQ0FBQyxFQUEvQztBQUNBLFNBQUtmLGdCQUFMLENBQXNCbkIsSUFBdEIsQ0FBMkJXLGNBQTNCLENBQTBDLEdBQTFDLEVBQStDLEVBQS9DO0FBQ0EsU0FBS1Msa0JBQUwsQ0FBd0JwQixJQUF4QixDQUE2QlcsY0FBN0IsQ0FBNEMsR0FBNUMsRUFBaUQsRUFBakQ7QUFDQSxTQUFLa0IsVUFBTCxDQUFnQjdCLElBQWhCLENBQXFCaUUsTUFBckIsR0FBOEIsSUFBOUI7QUFDQSxTQUFLbkMsVUFBTCxDQUFnQjlCLElBQWhCLENBQXFCaUUsTUFBckIsR0FBOEIsSUFBOUI7QUFDQSxTQUFLcEMsVUFBTCxDQUFnQjdCLElBQWhCLENBQXFCa0MsV0FBckIsQ0FBaUMsQ0FBQyxHQUFsQyxFQUF1QyxDQUFDLEVBQXhDO0FBQ0EsU0FBS0osVUFBTCxDQUFnQjlCLElBQWhCLENBQXFCa0MsV0FBckIsQ0FBaUMsR0FBakMsRUFBc0MsQ0FBQyxFQUF2QztBQUNBLFNBQUtMLFVBQUwsQ0FBZ0I4RSxNQUFoQixHQUF5QixZQUF6QjtBQUNBLFNBQUs3RSxVQUFMLENBQWdCNkUsTUFBaEIsR0FBeUIsY0FBekI7QUFDQSxTQUFLN0osUUFBTCxDQUFjNkosTUFBZCxHQUF1QixFQUF2QjtBQUNELEdBblNNO0FBcVNQSyxFQUFBQSxlQXJTTyw2QkFxU1c7QUFDaEIsU0FBSzFKLEtBQUwsR0FBYSxRQUFiO0FBQ0EsU0FBS1gsVUFBTCxDQUFnQmdLLE1BQWhCLEdBQXlCLGNBQXpCO0FBQ0EsU0FBS0MsY0FBTCxDQUFvQixJQUFwQjtBQUNBLFNBQUsxRixXQUFMLENBQWlCbEIsSUFBakIsQ0FBc0JpRSxNQUF0QixHQUErQixLQUEvQjtBQUNBLFNBQUt0SCxVQUFMLENBQWdCcUQsSUFBaEIsQ0FBcUJpRSxNQUFyQixHQUE4QixJQUE5QjtBQUNBLFNBQUtqRCxZQUFMLENBQWtCaEIsSUFBbEIsQ0FBdUJpRSxNQUF2QixHQUFnQyxJQUFoQztBQUNBLFNBQUtqRCxZQUFMLENBQWtCaEIsSUFBbEIsQ0FBdUJrQyxXQUF2QixDQUFtQyxDQUFuQyxFQUFzQyxDQUF0QztBQUNBLFNBQUtsQixZQUFMLENBQWtCaEIsSUFBbEIsQ0FBdUJXLGNBQXZCLENBQXNDLEdBQXRDLEVBQTJDLEdBQTNDO0FBQ0EsU0FBS1EsZ0JBQUwsQ0FBc0JuQixJQUF0QixDQUEyQmlFLE1BQTNCLEdBQW9DLElBQXBDO0FBQ0EsU0FBSzdDLGtCQUFMLENBQXdCcEIsSUFBeEIsQ0FBNkJpRSxNQUE3QixHQUFzQyxJQUF0QztBQUNBLFNBQUs5QyxnQkFBTCxDQUFzQm5CLElBQXRCLENBQTJCa0MsV0FBM0IsQ0FBdUMsQ0FBQyxHQUF4QyxFQUE2QyxFQUE3QztBQUNBLFNBQUtkLGtCQUFMLENBQXdCcEIsSUFBeEIsQ0FBNkJrQyxXQUE3QixDQUF5QyxHQUF6QyxFQUE4QyxFQUE5QztBQUNBLFNBQUtmLGdCQUFMLENBQXNCbkIsSUFBdEIsQ0FBMkJXLGNBQTNCLENBQTBDLEdBQTFDLEVBQStDLEVBQS9DO0FBQ0EsU0FBS1Msa0JBQUwsQ0FBd0JwQixJQUF4QixDQUE2QlcsY0FBN0IsQ0FBNEMsR0FBNUMsRUFBaUQsRUFBakQ7QUFDQSxTQUFLVyxlQUFMLENBQXFCdEIsSUFBckIsQ0FBMEJpRSxNQUExQixHQUFtQyxLQUFuQztBQUNBLFNBQUsxQyxnQkFBTCxDQUFzQnZCLElBQXRCLENBQTJCaUUsTUFBM0IsR0FBb0MsS0FBcEM7QUFDQSxTQUFLNUMsWUFBTCxDQUFrQnJCLElBQWxCLENBQXVCaUUsTUFBdkIsR0FBZ0MsS0FBaEM7QUFDQSxTQUFLekMsVUFBTCxDQUFnQnhCLElBQWhCLENBQXFCaUUsTUFBckIsR0FBOEIsS0FBOUI7QUFDQSxTQUFLNEMsWUFBTDtBQUNBLFNBQUtDLGdCQUFMO0FBQ0EsU0FBS0MsZ0JBQUw7QUFDQSxTQUFLcEssVUFBTCxDQUFnQnFELElBQWhCLENBQXFCa0MsV0FBckIsQ0FBaUMsQ0FBakMsRUFBb0MsR0FBcEM7QUFDQSxTQUFLdkYsVUFBTCxDQUFnQmdHLFFBQWhCLEdBQTJCLEVBQTNCO0FBQ0EsU0FBSzlGLFNBQUwsQ0FBZW1ELElBQWYsQ0FBb0JrQyxXQUFwQixDQUFnQyxDQUFoQyxFQUFtQyxDQUFDLEdBQXBDO0FBQ0EsU0FBS3JGLFNBQUwsQ0FBZThGLFFBQWYsR0FBMEIsRUFBMUI7QUFDQSxTQUFLOUYsU0FBTCxDQUFlK0YsVUFBZixHQUE0QixFQUE1QjtBQUNBLFNBQUsvRixTQUFMLENBQWU4SixNQUFmLEdBQXdCLCtDQUF4QjtBQUNBLFNBQUs5RSxVQUFMLENBQWdCN0IsSUFBaEIsQ0FBcUJpRSxNQUFyQixHQUE4QixJQUE5QjtBQUNBLFNBQUtuQyxVQUFMLENBQWdCOUIsSUFBaEIsQ0FBcUJpRSxNQUFyQixHQUE4QixJQUE5QjtBQUNBLFNBQUtwQyxVQUFMLENBQWdCN0IsSUFBaEIsQ0FBcUJrQyxXQUFyQixDQUFpQyxDQUFDLEdBQWxDLEVBQXVDLENBQXZDO0FBQ0EsU0FBS0osVUFBTCxDQUFnQjlCLElBQWhCLENBQXFCa0MsV0FBckIsQ0FBaUMsR0FBakMsRUFBc0MsQ0FBdEM7QUFDQSxTQUFLTCxVQUFMLENBQWdCOEUsTUFBaEIsR0FBeUIsV0FBekI7QUFDQSxTQUFLN0UsVUFBTCxDQUFnQjZFLE1BQWhCLEdBQXlCLFdBQXpCO0FBQ0EsU0FBSzdKLFFBQUwsQ0FBYzZKLE1BQWQsR0FBdUIsRUFBdkI7QUFDRCxHQXhVTTtBQTBVUE0sRUFBQUEsU0ExVU8scUJBMFVHQyxLQTFVSCxFQTBVVTtBQUNmLFFBQU1DLE1BQU0sR0FBRyxLQUFLQyxVQUFMLEVBQWY7QUFDQSxTQUFLN0osVUFBTCxHQUFrQjJKLEtBQWxCO0FBQ0EsU0FBS0csS0FBTCxHQUFhRixNQUFNLENBQUNELEtBQUQsQ0FBbkI7QUFDQSxTQUFLSSxNQUFMLEdBQWMsS0FBS0MsVUFBTCxFQUFkO0FBQ0EsU0FBS0QsTUFBTCxDQUFZeEksQ0FBWixHQUFnQixLQUFLdUksS0FBTCxDQUFXRyxLQUFYLENBQWlCMUksQ0FBakM7QUFDQSxTQUFLd0ksTUFBTCxDQUFZdkksQ0FBWixHQUFnQixLQUFLc0ksS0FBTCxDQUFXRyxLQUFYLENBQWlCekksQ0FBakM7QUFDQSxTQUFLMEksTUFBTCxHQUFjLEtBQUtKLEtBQUwsQ0FBV0ksTUFBWCxDQUFrQm5ELEdBQWxCLENBQXNCLFVBQUNvRCxLQUFEO0FBQUEsYUFBV0MsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQkYsS0FBbEIsQ0FBWDtBQUFBLEtBQXRCLENBQWQ7QUFDQSxTQUFLRyxXQUFMLEdBQW1CLENBQUMsS0FBS1IsS0FBTCxDQUFXUSxXQUFYLElBQTBCLEVBQTNCLEVBQStCdkQsR0FBL0IsQ0FBbUMsVUFBQ3dELElBQUQ7QUFBQSxhQUFVSCxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCRSxJQUFsQixDQUFWO0FBQUEsS0FBbkMsQ0FBbkI7QUFDQSxTQUFLQyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLEtBQUtYLEtBQUwsQ0FBV1csT0FBWCxDQUFtQjFELEdBQW5CLENBQXVCLFVBQUMyRCxLQUFEO0FBQUEsYUFBWTtBQUNoRG5KLFFBQUFBLENBQUMsRUFBRW1KLEtBQUssQ0FBQ25KLENBRHVDO0FBRWhEQyxRQUFBQSxDQUFDLEVBQUVrSixLQUFLLENBQUNsSixDQUZ1QztBQUdoREMsUUFBQUEsQ0FBQyxFQUFFLEVBSDZDO0FBSWhEQyxRQUFBQSxDQUFDLEVBQUUsRUFKNkM7QUFLaERpSixRQUFBQSxFQUFFLEVBQUUsQ0FBQyxFQUwyQztBQU1oREMsUUFBQUEsRUFBRSxFQUFFLENBTjRDO0FBT2hEQyxRQUFBQSxLQUFLLEVBQUUsSUFQeUM7QUFRaERDLFFBQUFBLE1BQU0sRUFBRSxDQVJ3QztBQVNoREMsUUFBQUEsUUFBUSxFQUFFO0FBVHNDLE9BQVo7QUFBQSxLQUF2QixDQUFmO0FBV0EsU0FBSzlLLE1BQUwsR0FBYyxDQUFkO0FBQ0EsU0FBS0MsS0FBTCxHQUFhLENBQWI7QUFDQSxTQUFLQyxLQUFMLEdBQWEsQ0FBYjtBQUNBLFNBQUtDLEtBQUwsR0FBYSxHQUFiO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLEVBQWY7QUFDQSxTQUFLTixLQUFMLEdBQWEsU0FBYjtBQUNBLFNBQUtzSixjQUFMLENBQW9CLEtBQXBCO0FBQ0EsU0FBSzVGLFlBQUwsQ0FBa0JoQixJQUFsQixDQUF1QmlFLE1BQXZCLEdBQWdDLElBQWhDO0FBQ0EsU0FBS2pELFlBQUwsQ0FBa0JoQixJQUFsQixDQUF1QmtDLFdBQXZCLENBQW1DLENBQW5DLEVBQXNDLEVBQXRDO0FBQ0EsU0FBS2xCLFlBQUwsQ0FBa0JoQixJQUFsQixDQUF1QlcsY0FBdkIsQ0FBc0MsR0FBdEMsRUFBMkMsR0FBM0M7QUFDQSxTQUFLVSxZQUFMLENBQWtCckIsSUFBbEIsQ0FBdUJpRSxNQUF2QixHQUFnQyxJQUFoQztBQUNBLFNBQUtzRSxZQUFMO0FBQ0EsU0FBSzVMLFVBQUwsQ0FBZ0JxRCxJQUFoQixDQUFxQmlFLE1BQXJCLEdBQThCLElBQTlCO0FBQ0EsU0FBS3RILFVBQUwsQ0FBZ0JnSyxNQUFoQixHQUF5QixFQUF6QjtBQUNBLFNBQUs5SixTQUFMLENBQWU4SixNQUFmLEdBQXdCLEVBQXhCO0FBQ0EsU0FBSzlFLFVBQUwsQ0FBZ0I3QixJQUFoQixDQUFxQmlFLE1BQXJCLEdBQThCLEtBQTlCO0FBQ0EsU0FBS25DLFVBQUwsQ0FBZ0I5QixJQUFoQixDQUFxQmlFLE1BQXJCLEdBQThCLEtBQTlCO0FBQ0EsU0FBS25ILFFBQUwsQ0FBY2tELElBQWQsQ0FBbUJrQyxXQUFuQixDQUErQixDQUEvQixFQUFrQyxHQUFsQztBQUNBLFNBQUtwRixRQUFMLENBQWM2RixRQUFkLEdBQXlCLEVBQXpCO0FBQ0EsU0FBSzdGLFFBQUwsQ0FBYzhGLFVBQWQsR0FBMkIsRUFBM0I7QUFDQSxRQUFJLEtBQUs3RixXQUFMLElBQW9CLEtBQUtjLE9BQTdCLEVBQXNDLEtBQUtkLFdBQUwsQ0FBaUJ5TCxJQUFqQjtBQUN2QyxHQXBYTTtBQXNYUDVCLEVBQUFBLGNBdFhPLDBCQXNYUTNDLE1BdFhSLEVBc1hnQjtBQUNyQixLQUNFLEtBQUtqRCxZQURQLEVBRUUsS0FBS0UsV0FGUCxFQUdFLEtBQUtDLGdCQUhQLEVBSUUsS0FBS0Msa0JBSlAsRUFLRSxLQUFLRSxlQUxQLEVBTUUsS0FBS0MsZ0JBTlAsRUFPRWtILE9BUEYsQ0FPVSxVQUFDdEcsTUFBRCxFQUFZO0FBQ3BCLFVBQUlBLE1BQUosRUFBWUEsTUFBTSxDQUFDbkMsSUFBUCxDQUFZaUUsTUFBWixHQUFxQkEsTUFBckI7QUFDYixLQVREO0FBVUQsR0FqWU07QUFtWVBzRSxFQUFBQSxZQW5ZTywwQkFtWVE7QUFDYixTQUFLOUcsUUFBTCxDQUFjekIsSUFBZCxDQUFtQmtDLFdBQW5CLENBQStCLENBQUMsR0FBaEMsRUFBcUMsR0FBckM7QUFDQSxTQUFLUixTQUFMLENBQWUxQixJQUFmLENBQW9CaUUsTUFBcEIsR0FBNkIsS0FBN0I7QUFDQSxTQUFLdEMsU0FBTCxDQUFlM0IsSUFBZixDQUFvQmtDLFdBQXBCLENBQWdDLEdBQWhDLEVBQXFDLEdBQXJDO0FBQ0EsU0FBS1QsUUFBTCxDQUFjekIsSUFBZCxDQUFtQmlFLE1BQW5CLEdBQTRCLElBQTVCO0FBQ0EsU0FBS3RDLFNBQUwsQ0FBZTNCLElBQWYsQ0FBb0JpRSxNQUFwQixHQUE2QixJQUE3QjtBQUNELEdBellNO0FBMllQNEMsRUFBQUEsWUEzWU8sMEJBMllRO0FBQ2IsU0FBS3BGLFFBQUwsQ0FBY3pCLElBQWQsQ0FBbUJpRSxNQUFuQixHQUE0QixLQUE1QjtBQUNBLFNBQUt2QyxTQUFMLENBQWUxQixJQUFmLENBQW9CaUUsTUFBcEIsR0FBNkIsS0FBN0I7QUFDQSxTQUFLdEMsU0FBTCxDQUFlM0IsSUFBZixDQUFvQmlFLE1BQXBCLEdBQTZCLEtBQTdCO0FBQ0QsR0EvWU07QUFpWlBzRCxFQUFBQSxVQWpaTyx3QkFpWk07QUFDWCxXQUFPO0FBQ0x6SSxNQUFBQSxDQUFDLEVBQUUsRUFERTtBQUVMQyxNQUFBQSxDQUFDLEVBQUUsR0FGRTtBQUdMQyxNQUFBQSxDQUFDLEVBQUUsRUFIRTtBQUlMQyxNQUFBQSxDQUFDLEVBQUUsRUFKRTtBQUtMaUosTUFBQUEsRUFBRSxFQUFFLENBTEM7QUFNTEMsTUFBQUEsRUFBRSxFQUFFLENBTkM7QUFPTEcsTUFBQUEsUUFBUSxFQUFFLEtBUEw7QUFRTEksTUFBQUEsR0FBRyxFQUFFLEtBUkE7QUFTTEMsTUFBQUEsVUFBVSxFQUFFLENBVFA7QUFVTEMsTUFBQUEsTUFBTSxFQUFFLENBVkg7QUFXTEMsTUFBQUEsSUFBSSxFQUFFO0FBWEQsS0FBUDtBQWFELEdBL1pNO0FBaWFQekIsRUFBQUEsVUFqYU8sd0JBaWFNO0FBQ1gsUUFBTTBCLE1BQU0sR0FBRyxTQUFUQSxNQUFTLENBQUNoSyxDQUFELEVBQUlDLENBQUosRUFBT0MsQ0FBUCxFQUFVQyxDQUFWO0FBQUEsYUFBaUI7QUFBRThKLFFBQUFBLElBQUksRUFBRSxRQUFSO0FBQWtCakssUUFBQUEsQ0FBQyxFQUFEQSxDQUFsQjtBQUFxQkMsUUFBQUEsQ0FBQyxFQUFEQSxDQUFyQjtBQUF3QkMsUUFBQUEsQ0FBQyxFQUFEQSxDQUF4QjtBQUEyQkMsUUFBQUEsQ0FBQyxFQUFEQTtBQUEzQixPQUFqQjtBQUFBLEtBQWY7O0FBQ0EsUUFBTStKLEtBQUssR0FBRyxTQUFSQSxLQUFRLENBQUNsSyxDQUFELEVBQUlDLENBQUosRUFBT0MsQ0FBUCxFQUFVQyxDQUFWO0FBQUEsYUFBaUI7QUFBRThKLFFBQUFBLElBQUksRUFBRSxPQUFSO0FBQWlCakssUUFBQUEsQ0FBQyxFQUFEQSxDQUFqQjtBQUFvQkMsUUFBQUEsQ0FBQyxFQUFEQSxDQUFwQjtBQUF1QkMsUUFBQUEsQ0FBQyxFQUFEQSxDQUF2QjtBQUEwQkMsUUFBQUEsQ0FBQyxFQUFEQTtBQUExQixPQUFqQjtBQUFBLEtBQWQ7O0FBQ0EsUUFBTWdLLElBQUksR0FBRyxTQUFQQSxJQUFPLENBQUNuSyxDQUFELEVBQUlDLENBQUosRUFBT0MsQ0FBUCxFQUFVQyxDQUFWO0FBQUEsYUFBaUI7QUFBRThKLFFBQUFBLElBQUksRUFBRSxNQUFSO0FBQWdCakssUUFBQUEsQ0FBQyxFQUFEQSxDQUFoQjtBQUFtQkMsUUFBQUEsQ0FBQyxFQUFEQSxDQUFuQjtBQUFzQkMsUUFBQUEsQ0FBQyxFQUFEQSxDQUF0QjtBQUF5QkMsUUFBQUEsQ0FBQyxFQUFEQTtBQUF6QixPQUFqQjtBQUFBLEtBQWI7O0FBQ0EsUUFBTWlLLElBQUksR0FBRyxTQUFQQSxJQUFPLENBQUNwSyxDQUFELEVBQUlDLENBQUosRUFBT0UsQ0FBUDtBQUFBLGFBQWM7QUFBRThKLFFBQUFBLElBQUksRUFBRSxNQUFSO0FBQWdCakssUUFBQUEsQ0FBQyxFQUFEQSxDQUFoQjtBQUFtQkMsUUFBQUEsQ0FBQyxFQUFEQSxDQUFuQjtBQUFzQkMsUUFBQUEsQ0FBQyxFQUFFLEVBQXpCO0FBQTZCQyxRQUFBQSxDQUFDLEVBQURBO0FBQTdCLE9BQWQ7QUFBQSxLQUFiOztBQUNBLFFBQU1rSyxLQUFLLEdBQUcsU0FBUkEsS0FBUSxDQUFDckssQ0FBRCxFQUFJQyxDQUFKLEVBQU9DLENBQVA7QUFBQSxhQUFjO0FBQUUrSixRQUFBQSxJQUFJLEVBQUUsT0FBUjtBQUFpQmpLLFFBQUFBLENBQUMsRUFBREEsQ0FBakI7QUFBb0JDLFFBQUFBLENBQUMsRUFBREEsQ0FBcEI7QUFBdUJDLFFBQUFBLENBQUMsRUFBREEsQ0FBdkI7QUFBMEJDLFFBQUFBLENBQUMsRUFBRTtBQUE3QixPQUFkO0FBQUEsS0FBZDs7QUFDQSxRQUFNbUssSUFBSSxHQUFHLFNBQVBBLElBQU8sQ0FBQ0wsSUFBRCxFQUFPakssQ0FBUCxFQUFVQyxDQUFWLEVBQWFDLENBQWIsRUFBZ0JDLENBQWhCLEVBQW1Cb0ssUUFBbkI7QUFBQSxhQUFpQztBQUFFTixRQUFBQSxJQUFJLEVBQUpBLElBQUY7QUFBUWpLLFFBQUFBLENBQUMsRUFBREEsQ0FBUjtBQUFXQyxRQUFBQSxDQUFDLEVBQURBLENBQVg7QUFBY0MsUUFBQUEsQ0FBQyxFQUFEQSxDQUFkO0FBQWlCQyxRQUFBQSxDQUFDLEVBQURBLENBQWpCO0FBQW9Cb0ssUUFBQUEsUUFBUSxFQUFFQSxRQUFRLElBQUk7QUFBMUMsT0FBakM7QUFBQSxLQUFiOztBQUNBLFFBQU1DLFFBQVEsR0FBRyxTQUFYQSxRQUFXLENBQUN4SyxDQUFELEVBQUlDLENBQUo7QUFBQSxhQUFXO0FBQUVnSyxRQUFBQSxJQUFJLEVBQUUsVUFBUjtBQUFvQmpLLFFBQUFBLENBQUMsRUFBREEsQ0FBcEI7QUFBdUJDLFFBQUFBLENBQUMsRUFBREEsQ0FBdkI7QUFBMEJDLFFBQUFBLENBQUMsRUFBRSxFQUE3QjtBQUFpQ0MsUUFBQUEsQ0FBQyxFQUFFLEVBQXBDO0FBQXdDc0ssUUFBQUEsSUFBSSxFQUFFLEtBQTlDO0FBQXFEQyxRQUFBQSxJQUFJLEVBQUU7QUFBM0QsT0FBWDtBQUFBLEtBQWpCOztBQUVBLFdBQU8sQ0FDTDtBQUNFekgsTUFBQUEsSUFBSSxFQUFFLEtBRFI7QUFFRTBILE1BQUFBLE1BQU0sRUFBRSxJQUZWO0FBR0VqQyxNQUFBQSxLQUFLLEVBQUU7QUFBRTFJLFFBQUFBLENBQUMsRUFBRSxFQUFMO0FBQVNDLFFBQUFBLENBQUMsRUFBRTtBQUFaLE9BSFQ7QUFJRTBJLE1BQUFBLE1BQU0sRUFBRSxDQUNOcUIsTUFBTSxDQUFDLENBQUQsRUFBSSxHQUFKLEVBQVMsR0FBVCxFQUFjLEVBQWQsQ0FEQSxFQUVOQSxNQUFNLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxHQUFaLEVBQWlCLEVBQWpCLENBRkEsRUFHTkEsTUFBTSxDQUFDLElBQUQsRUFBTyxHQUFQLEVBQVksR0FBWixFQUFpQixFQUFqQixDQUhBLEVBSU5BLE1BQU0sQ0FBQyxJQUFELEVBQU8sR0FBUCxFQUFZLEdBQVosRUFBaUIsRUFBakIsQ0FKQSxFQUtOQSxNQUFNLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxJQUFaLEVBQWtCLEVBQWxCLENBTEEsRUFPTkksSUFBSSxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsRUFBWCxDQVBFLEVBUU5BLElBQUksQ0FBQyxJQUFELEVBQU8sR0FBUCxFQUFZLEdBQVosQ0FSRSxFQVNOQSxJQUFJLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxHQUFaLENBVEUsRUFVTkEsSUFBSSxDQUFDLElBQUQsRUFBTyxHQUFQLEVBQVksR0FBWixDQVZFLEVBWU5GLEtBQUssQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEVBQVgsRUFBZSxFQUFmLENBWkMsRUFhTkEsS0FBSyxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixFQUFoQixDQWJDLEVBY05BLEtBQUssQ0FBQyxJQUFELEVBQU8sR0FBUCxFQUFZLEdBQVosRUFBaUIsRUFBakIsQ0FkQyxFQWVOQSxLQUFLLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxHQUFaLEVBQWlCLEVBQWpCLENBZkMsRUFnQk5BLEtBQUssQ0FBQyxJQUFELEVBQU8sR0FBUCxFQUFZLEdBQVosRUFBaUIsRUFBakIsQ0FoQkMsRUFpQk5BLEtBQUssQ0FBQyxJQUFELEVBQU8sR0FBUCxFQUFZLEdBQVosRUFBaUIsRUFBakIsQ0FqQkMsRUFrQk5BLEtBQUssQ0FBQyxJQUFELEVBQU8sR0FBUCxFQUFZLEdBQVosRUFBaUIsRUFBakIsQ0FsQkMsRUFtQk5DLElBQUksQ0FBQyxJQUFELEVBQU8sR0FBUCxFQUFZLEVBQVosRUFBZ0IsRUFBaEIsQ0FuQkUsRUFvQk5BLElBQUksQ0FBQyxJQUFELEVBQU8sR0FBUCxFQUFZLEVBQVosRUFBZ0IsRUFBaEIsQ0FwQkUsRUFxQk5BLElBQUksQ0FBQyxJQUFELEVBQU8sR0FBUCxFQUFZLEVBQVosRUFBZ0IsR0FBaEIsQ0FyQkUsRUFzQk5BLElBQUksQ0FBQyxJQUFELEVBQU8sR0FBUCxFQUFZLEVBQVosRUFBZ0IsR0FBaEIsQ0F0QkUsRUF1Qk5ELEtBQUssQ0FBQyxJQUFELEVBQU8sR0FBUCxFQUFZLEdBQVosRUFBaUIsRUFBakIsQ0F2QkMsRUF5Qk5HLEtBQUssQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsQ0F6QkMsRUEwQk5BLEtBQUssQ0FBQyxJQUFELEVBQU8sR0FBUCxFQUFZLEdBQVosQ0ExQkMsRUEyQk5BLEtBQUssQ0FBQyxJQUFELEVBQU8sR0FBUCxFQUFZLEdBQVosQ0EzQkMsRUE0Qk5BLEtBQUssQ0FBQyxJQUFELEVBQU8sR0FBUCxFQUFZLEdBQVosQ0E1QkMsRUE4Qk5HLFFBQVEsQ0FBQyxHQUFELEVBQU0sR0FBTixDQTlCRixFQStCTkEsUUFBUSxDQUFDLEdBQUQsRUFBTSxHQUFOLENBL0JGLEVBZ0NOQSxRQUFRLENBQUMsSUFBRCxFQUFPLEdBQVAsQ0FoQ0YsRUFpQ05BLFFBQVEsQ0FBQyxJQUFELEVBQU8sR0FBUCxDQWpDRixFQWtDTkEsUUFBUSxDQUFDLElBQUQsRUFBTyxHQUFQLENBbENGLENBSlY7QUF3Q0V6QixNQUFBQSxXQUFXLEVBQUUsQ0FDWHVCLElBQUksQ0FBQyxNQUFELEVBQVMsRUFBVCxFQUFhLEdBQWIsRUFBa0IsRUFBbEIsRUFBc0IsRUFBdEIsRUFBMEIsSUFBMUIsQ0FETyxFQUVYQSxJQUFJLENBQUMsTUFBRCxFQUFTLEdBQVQsRUFBYyxHQUFkLEVBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCLElBQTNCLENBRk8sRUFHWEEsSUFBSSxDQUFDLE9BQUQsRUFBVSxHQUFWLEVBQWUsR0FBZixFQUFvQixHQUFwQixFQUF5QixFQUF6QixFQUE2QixJQUE3QixDQUhPLEVBSVhBLElBQUksQ0FBQyxNQUFELEVBQVMsR0FBVCxFQUFjLEdBQWQsRUFBbUIsRUFBbkIsRUFBdUIsRUFBdkIsRUFBMkIsQ0FBM0IsQ0FKTyxFQUtYQSxJQUFJLENBQUMsTUFBRCxFQUFTLElBQVQsRUFBZSxHQUFmLEVBQW9CLEdBQXBCLEVBQXlCLEVBQXpCLEVBQTZCLElBQTdCLENBTE8sRUFNWEEsSUFBSSxDQUFDLE1BQUQsRUFBUyxJQUFULEVBQWUsR0FBZixFQUFvQixFQUFwQixFQUF3QixFQUF4QixFQUE0QixJQUE1QixDQU5PLEVBT1hBLElBQUksQ0FBQyxPQUFELEVBQVUsSUFBVixFQUFnQixHQUFoQixFQUFxQixHQUFyQixFQUEwQixFQUExQixFQUE4QixJQUE5QixDQVBPLEVBUVhBLElBQUksQ0FBQyxNQUFELEVBQVMsSUFBVCxFQUFlLEdBQWYsRUFBb0IsR0FBcEIsRUFBeUIsRUFBekIsRUFBNkIsSUFBN0IsQ0FSTyxFQVNYQSxJQUFJLENBQUMsTUFBRCxFQUFTLElBQVQsRUFBZSxHQUFmLEVBQW9CLEVBQXBCLEVBQXdCLEVBQXhCLEVBQTRCLElBQTVCLENBVE8sRUFVWEEsSUFBSSxDQUFDLE1BQUQsRUFBUyxJQUFULEVBQWUsR0FBZixFQUFvQixFQUFwQixFQUF3QixFQUF4QixFQUE0QixDQUE1QixDQVZPLEVBV1hBLElBQUksQ0FBQyxPQUFELEVBQVUsSUFBVixFQUFnQixHQUFoQixFQUFxQixHQUFyQixFQUEwQixFQUExQixFQUE4QixJQUE5QixDQVhPLEVBWVhBLElBQUksQ0FBQyxNQUFELEVBQVMsSUFBVCxFQUFlLEdBQWYsRUFBb0IsR0FBcEIsRUFBeUIsRUFBekIsRUFBNkIsSUFBN0IsQ0FaTyxFQWFYQSxJQUFJLENBQUMsTUFBRCxFQUFTLElBQVQsRUFBZSxHQUFmLEVBQW9CLEVBQXBCLEVBQXdCLEVBQXhCLEVBQTRCLElBQTVCLENBYk8sQ0F4Q2Y7QUF1REVwQixNQUFBQSxPQUFPLEVBQUUsQ0FDUDtBQUFFbEosUUFBQUEsQ0FBQyxFQUFFLEdBQUw7QUFBVUMsUUFBQUEsQ0FBQyxFQUFFO0FBQWIsT0FETyxFQUVQO0FBQUVELFFBQUFBLENBQUMsRUFBRSxJQUFMO0FBQVdDLFFBQUFBLENBQUMsRUFBRTtBQUFkLE9BRk8sRUFHUDtBQUFFRCxRQUFBQSxDQUFDLEVBQUUsSUFBTDtBQUFXQyxRQUFBQSxDQUFDLEVBQUU7QUFBZCxPQUhPLEVBSVA7QUFBRUQsUUFBQUEsQ0FBQyxFQUFFLElBQUw7QUFBV0MsUUFBQUEsQ0FBQyxFQUFFO0FBQWQsT0FKTyxDQXZEWDtBQTZERThGLE1BQUFBLElBQUksRUFBRTtBQUFFL0YsUUFBQUEsQ0FBQyxFQUFFLElBQUw7QUFBV0MsUUFBQUEsQ0FBQyxFQUFFO0FBQWQ7QUE3RFIsS0FESyxFQWdFTDtBQUNFZ0QsTUFBQUEsSUFBSSxFQUFFLEtBRFI7QUFFRTBILE1BQUFBLE1BQU0sRUFBRSxJQUZWO0FBR0VqQyxNQUFBQSxLQUFLLEVBQUU7QUFBRTFJLFFBQUFBLENBQUMsRUFBRSxFQUFMO0FBQVNDLFFBQUFBLENBQUMsRUFBRTtBQUFaLE9BSFQ7QUFJRTBJLE1BQUFBLE1BQU0sRUFBRSxDQUNOcUIsTUFBTSxDQUFDLENBQUQsRUFBSSxHQUFKLEVBQVMsR0FBVCxFQUFjLEVBQWQsQ0FEQSxFQUVOQSxNQUFNLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYLEVBQWdCLEVBQWhCLENBRkEsRUFHTkEsTUFBTSxDQUFDLElBQUQsRUFBTyxHQUFQLEVBQVksR0FBWixFQUFpQixFQUFqQixDQUhBLEVBSU5BLE1BQU0sQ0FBQyxJQUFELEVBQU8sR0FBUCxFQUFZLEdBQVosRUFBaUIsRUFBakIsQ0FKQSxFQUtOQSxNQUFNLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxHQUFaLEVBQWlCLEVBQWpCLENBTEEsRUFNTkEsTUFBTSxDQUFDLElBQUQsRUFBTyxHQUFQLEVBQVksSUFBWixFQUFrQixFQUFsQixDQU5BLEVBUU5JLElBQUksQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEVBQVgsQ0FSRSxFQVNOQSxJQUFJLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxHQUFaLENBVEUsRUFVTkEsSUFBSSxDQUFDLElBQUQsRUFBTyxHQUFQLEVBQVksR0FBWixDQVZFLEVBV05BLElBQUksQ0FBQyxJQUFELEVBQU8sR0FBUCxFQUFZLEdBQVosQ0FYRSxFQVlOQSxJQUFJLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxHQUFaLENBWkUsRUFjTkQsSUFBSSxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsRUFBWCxFQUFlLEVBQWYsQ0FkRSxFQWVOQSxJQUFJLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxFQUFYLEVBQWUsRUFBZixDQWZFLEVBZ0JOQSxJQUFJLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYLEVBQWdCLEVBQWhCLENBaEJFLEVBaUJORCxLQUFLLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxFQUFaLEVBQWdCLEVBQWhCLENBakJDLEVBa0JOQSxLQUFLLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxHQUFaLEVBQWlCLEVBQWpCLENBbEJDLEVBbUJORyxLQUFLLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxHQUFaLENBbkJDLEVBb0JORixJQUFJLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxFQUFaLEVBQWdCLEVBQWhCLENBcEJFLEVBcUJOQSxJQUFJLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxFQUFaLEVBQWdCLEdBQWhCLENBckJFLEVBc0JORCxLQUFLLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxHQUFaLEVBQWlCLEVBQWpCLENBdEJDLEVBdUJORyxLQUFLLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxHQUFaLENBdkJDLEVBd0JOQSxLQUFLLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxHQUFaLENBeEJDLEVBeUJORixJQUFJLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxFQUFaLEVBQWdCLEVBQWhCLENBekJFLEVBMEJOQSxJQUFJLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxFQUFaLEVBQWdCLEVBQWhCLENBMUJFLEVBMkJOQSxJQUFJLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxFQUFaLEVBQWdCLEdBQWhCLENBM0JFLEVBNEJOQSxJQUFJLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxFQUFaLEVBQWdCLEdBQWhCLENBNUJFLEVBNkJORSxLQUFLLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxHQUFaLENBN0JDLEVBOEJOQSxLQUFLLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxHQUFaLENBOUJDLEVBK0JOSCxLQUFLLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxHQUFaLEVBQWlCLEVBQWpCLENBL0JDLEVBZ0NOQyxJQUFJLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxFQUFaLEVBQWdCLEVBQWhCLENBaENFLEVBaUNOQSxJQUFJLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxFQUFaLEVBQWdCLEVBQWhCLENBakNFLEVBa0NOQSxJQUFJLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxFQUFaLEVBQWdCLEdBQWhCLENBbENFLEVBb0NOSyxRQUFRLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FwQ0YsRUFxQ05BLFFBQVEsQ0FBQyxJQUFELEVBQU8sR0FBUCxDQXJDRixFQXNDTkEsUUFBUSxDQUFDLElBQUQsRUFBTyxHQUFQLENBdENGLEVBdUNOQSxRQUFRLENBQUMsSUFBRCxFQUFPLEdBQVAsQ0F2Q0YsRUF3Q05BLFFBQVEsQ0FBQyxJQUFELEVBQU8sR0FBUCxDQXhDRixFQXlDTkEsUUFBUSxDQUFDLElBQUQsRUFBTyxHQUFQLENBekNGLENBSlY7QUErQ0V6QixNQUFBQSxXQUFXLEVBQUUsQ0FDWHVCLElBQUksQ0FBQyxNQUFELEVBQVMsR0FBVCxFQUFjLEdBQWQsRUFBbUIsR0FBbkIsRUFBd0IsRUFBeEIsRUFBNEIsSUFBNUIsQ0FETyxFQUVYQSxJQUFJLENBQUMsTUFBRCxFQUFTLEdBQVQsRUFBYyxHQUFkLEVBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCLElBQTNCLENBRk8sRUFHWEEsSUFBSSxDQUFDLE1BQUQsRUFBUyxHQUFULEVBQWMsR0FBZCxFQUFtQixFQUFuQixFQUF1QixFQUF2QixFQUEyQixDQUEzQixDQUhPLEVBSVhBLElBQUksQ0FBQyxPQUFELEVBQVUsR0FBVixFQUFlLEdBQWYsRUFBb0IsR0FBcEIsRUFBeUIsRUFBekIsRUFBNkIsSUFBN0IsQ0FKTyxFQUtYQSxJQUFJLENBQUMsTUFBRCxFQUFTLElBQVQsRUFBZSxHQUFmLEVBQW9CLEdBQXBCLEVBQXlCLEVBQXpCLEVBQTZCLElBQTdCLENBTE8sRUFNWEEsSUFBSSxDQUFDLE1BQUQsRUFBUyxJQUFULEVBQWUsR0FBZixFQUFvQixFQUFwQixFQUF3QixFQUF4QixFQUE0QixJQUE1QixDQU5PLEVBT1hBLElBQUksQ0FBQyxNQUFELEVBQVMsSUFBVCxFQUFlLEdBQWYsRUFBb0IsRUFBcEIsRUFBd0IsRUFBeEIsRUFBNEIsQ0FBNUIsQ0FQTyxFQVFYQSxJQUFJLENBQUMsT0FBRCxFQUFVLElBQVYsRUFBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsRUFBMUIsRUFBOEIsSUFBOUIsQ0FSTyxFQVNYQSxJQUFJLENBQUMsTUFBRCxFQUFTLElBQVQsRUFBZSxHQUFmLEVBQW9CLEdBQXBCLEVBQXlCLEVBQXpCLEVBQTZCLElBQTdCLENBVE8sRUFVWEEsSUFBSSxDQUFDLE1BQUQsRUFBUyxJQUFULEVBQWUsR0FBZixFQUFvQixFQUFwQixFQUF3QixFQUF4QixFQUE0QixJQUE1QixDQVZPLEVBV1hBLElBQUksQ0FBQyxNQUFELEVBQVMsSUFBVCxFQUFlLEdBQWYsRUFBb0IsRUFBcEIsRUFBd0IsRUFBeEIsRUFBNEIsQ0FBNUIsQ0FYTyxFQVlYQSxJQUFJLENBQUMsT0FBRCxFQUFVLElBQVYsRUFBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsRUFBMUIsRUFBOEIsSUFBOUIsQ0FaTyxFQWFYQSxJQUFJLENBQUMsTUFBRCxFQUFTLElBQVQsRUFBZSxHQUFmLEVBQW9CLEdBQXBCLEVBQXlCLEVBQXpCLEVBQTZCLElBQTdCLENBYk8sRUFjWEEsSUFBSSxDQUFDLE1BQUQsRUFBUyxJQUFULEVBQWUsR0FBZixFQUFvQixFQUFwQixFQUF3QixFQUF4QixFQUE0QixJQUE1QixDQWRPLENBL0NmO0FBK0RFcEIsTUFBQUEsT0FBTyxFQUFFLENBQ1A7QUFBRWxKLFFBQUFBLENBQUMsRUFBRSxJQUFMO0FBQVdDLFFBQUFBLENBQUMsRUFBRTtBQUFkLE9BRE8sRUFFUDtBQUFFRCxRQUFBQSxDQUFDLEVBQUUsSUFBTDtBQUFXQyxRQUFBQSxDQUFDLEVBQUU7QUFBZCxPQUZPLEVBR1A7QUFBRUQsUUFBQUEsQ0FBQyxFQUFFLElBQUw7QUFBV0MsUUFBQUEsQ0FBQyxFQUFFO0FBQWQsT0FITyxFQUlQO0FBQUVELFFBQUFBLENBQUMsRUFBRSxJQUFMO0FBQVdDLFFBQUFBLENBQUMsRUFBRTtBQUFkLE9BSk8sRUFLUDtBQUFFRCxRQUFBQSxDQUFDLEVBQUUsSUFBTDtBQUFXQyxRQUFBQSxDQUFDLEVBQUU7QUFBZCxPQUxPLEVBTVA7QUFBRUQsUUFBQUEsQ0FBQyxFQUFFLElBQUw7QUFBV0MsUUFBQUEsQ0FBQyxFQUFFO0FBQWQsT0FOTyxDQS9EWDtBQXVFRThGLE1BQUFBLElBQUksRUFBRTtBQUFFL0YsUUFBQUEsQ0FBQyxFQUFFLElBQUw7QUFBV0MsUUFBQUEsQ0FBQyxFQUFFO0FBQWQ7QUF2RVIsS0FoRUssQ0FBUDtBQTBJRCxHQXBqQk07QUFzakJQeUIsRUFBQUEsYUF0akJPLDJCQXNqQlM7QUFDZCxRQUFJLEtBQUtsRCxLQUFMLEtBQWUsTUFBbkIsRUFBMkI7QUFDekIsVUFBSSxLQUFLb00sT0FBTCxDQUFhck4sRUFBRSxDQUFDc04sS0FBSCxDQUFTQyxHQUFULENBQWFDLEtBQTFCLENBQUosRUFBc0MsS0FBSzVDLFNBQUwsQ0FBZSxDQUFmO0FBQ3RDLFVBQUksS0FBS3lDLE9BQUwsQ0FBYXJOLEVBQUUsQ0FBQ3NOLEtBQUgsQ0FBU0MsR0FBVCxDQUFhRSxDQUExQixDQUFKLEVBQWtDLEtBQUs5QyxlQUFMO0FBQ2xDO0FBQ0Q7O0FBRUQsUUFBSSxLQUFLMUosS0FBTCxLQUFlLFFBQW5CLEVBQTZCO0FBQzNCLFVBQUksS0FBS29NLE9BQUwsQ0FBYXJOLEVBQUUsQ0FBQ3NOLEtBQUgsQ0FBU0MsR0FBVCxDQUFhLEdBQWIsQ0FBYixDQUFKLEVBQXFDLEtBQUszQyxTQUFMLENBQWUsQ0FBZjtBQUNyQyxVQUFJLEtBQUt5QyxPQUFMLENBQWFyTixFQUFFLENBQUNzTixLQUFILENBQVNDLEdBQVQsQ0FBYSxHQUFiLENBQWIsQ0FBSixFQUFxQyxLQUFLM0MsU0FBTCxDQUFlLENBQWY7QUFDckMsVUFBSSxLQUFLeUMsT0FBTCxDQUFhck4sRUFBRSxDQUFDc04sS0FBSCxDQUFTQyxHQUFULENBQWFHLE1BQTFCLENBQUosRUFBdUMsS0FBSzFLLFFBQUw7QUFDdkM7QUFDRDs7QUFFRCxRQUFJLEtBQUsvQixLQUFMLEtBQWUsU0FBZixJQUE0QixLQUFLQSxLQUFMLEtBQWUsUUFBL0MsRUFBeUQ7QUFDdkQsVUFBSSxLQUFLb00sT0FBTCxDQUFhck4sRUFBRSxDQUFDc04sS0FBSCxDQUFTQyxHQUFULENBQWFJLENBQTFCLENBQUosRUFBa0MsS0FBSzFNLEtBQUwsR0FBYSxLQUFLQSxLQUFMLEtBQWUsU0FBZixHQUEyQixRQUEzQixHQUFzQyxTQUFuRDtBQUNsQztBQUNEOztBQUVELFFBQUksS0FBS29NLE9BQUwsQ0FBYXJOLEVBQUUsQ0FBQ3NOLEtBQUgsQ0FBU0MsR0FBVCxDQUFhQyxLQUExQixDQUFKLEVBQXNDLEtBQUt4SyxRQUFMO0FBQ3ZDLEdBMWtCTTtBQTRrQlBvQixFQUFBQSxRQTVrQk8sb0JBNGtCRUosRUE1a0JGLEVBNGtCTTtBQUNYLFNBQUsxQyxLQUFMLElBQWMwQyxFQUFkO0FBQ0EsUUFBSSxLQUFLMUMsS0FBTCxJQUFjLENBQWxCLEVBQXFCLEtBQUtzTSxVQUFMO0FBQ3JCLFNBQUtDLFlBQUwsQ0FBa0I3SixFQUFsQjtBQUNBLFNBQUs4SixhQUFMLENBQW1COUosRUFBbkI7QUFDQSxTQUFLK0osY0FBTCxDQUFvQi9KLEVBQXBCO0FBQ0EsU0FBS29ILE1BQUwsQ0FBWWdCLE9BQVosQ0FBb0IsVUFBQ2YsS0FBRCxFQUFXO0FBQzdCQSxNQUFBQSxLQUFLLENBQUM4QixJQUFOLEdBQWFsSixJQUFJLENBQUMrSixHQUFMLENBQVMsQ0FBVCxFQUFZLENBQUMzQyxLQUFLLENBQUM4QixJQUFOLElBQWMsQ0FBZixJQUFvQm5KLEVBQUUsR0FBRyxFQUFyQyxDQUFiO0FBQ0QsS0FGRDtBQUdBLFNBQUtpSyxTQUFMO0FBQ0QsR0F0bEJNO0FBd2xCUEosRUFBQUEsWUF4bEJPLHdCQXdsQk03SixFQXhsQk4sRUF3bEJVO0FBQ2YsUUFBTWtLLElBQUksR0FBRyxLQUFLbE4sSUFBTCxDQUFVaEIsRUFBRSxDQUFDc04sS0FBSCxDQUFTQyxHQUFULENBQWFXLElBQXZCLEtBQWdDLEtBQUtsTixJQUFMLENBQVVoQixFQUFFLENBQUNzTixLQUFILENBQVNDLEdBQVQsQ0FBYVksQ0FBdkIsQ0FBN0M7QUFDQSxRQUFNQyxLQUFLLEdBQUcsS0FBS3BOLElBQUwsQ0FBVWhCLEVBQUUsQ0FBQ3NOLEtBQUgsQ0FBU0MsR0FBVCxDQUFhYSxLQUF2QixLQUFpQyxLQUFLcE4sSUFBTCxDQUFVaEIsRUFBRSxDQUFDc04sS0FBSCxDQUFTQyxHQUFULENBQWFjLENBQXZCLENBQS9DO0FBQ0EsUUFBTUMsSUFBSSxHQUFHLEtBQUt0TixJQUFMLENBQVVoQixFQUFFLENBQUNzTixLQUFILENBQVNDLEdBQVQsQ0FBYWdCLEVBQXZCLEtBQThCLEtBQUt2TixJQUFMLENBQVVoQixFQUFFLENBQUNzTixLQUFILENBQVNDLEdBQVQsQ0FBYTVLLENBQXZCLENBQTlCLElBQTJELEtBQUszQixJQUFMLENBQVVoQixFQUFFLENBQUNzTixLQUFILENBQVNDLEdBQVQsQ0FBYWlCLEtBQXZCLENBQXhFO0FBQ0EsU0FBS3ZELE1BQUwsQ0FBWVksRUFBWixHQUFpQnFDLElBQUksR0FBRyxDQUFDLEdBQUosR0FBVUUsS0FBSyxHQUFHLEdBQUgsR0FBUyxDQUE3QztBQUNBLFFBQUlGLElBQUosRUFBVSxLQUFLakQsTUFBTCxDQUFZc0IsTUFBWixHQUFxQixDQUFDLENBQXRCO0FBQ1YsUUFBSTZCLEtBQUosRUFBVyxLQUFLbkQsTUFBTCxDQUFZc0IsTUFBWixHQUFxQixDQUFyQjs7QUFDWCxRQUFJK0IsSUFBSSxJQUFJLEtBQUtyRCxNQUFMLENBQVlnQixRQUF4QixFQUFrQztBQUNoQyxXQUFLaEIsTUFBTCxDQUFZYSxFQUFaLEdBQWlCLEtBQUtiLE1BQUwsQ0FBWW9CLEdBQVosR0FBa0IsQ0FBQyxHQUFuQixHQUF5QixDQUFDLEdBQTNDO0FBQ0EsV0FBS29DLFdBQUwsQ0FBaUIsS0FBS2hOLFFBQXRCO0FBQ0Q7O0FBQ0QsU0FBS3dKLE1BQUwsQ0FBWXVCLElBQVosSUFBb0J4SSxFQUFFLEdBQUdDLElBQUksQ0FBQ3lLLEdBQUwsQ0FBUyxLQUFLekQsTUFBTCxDQUFZWSxFQUFyQixDQUF6QjtBQUNBLFNBQUtaLE1BQUwsQ0FBWXFCLFVBQVosR0FBeUJySSxJQUFJLENBQUMrSixHQUFMLENBQVMsQ0FBVCxFQUFZLEtBQUsvQyxNQUFMLENBQVlxQixVQUFaLEdBQXlCdEksRUFBckMsQ0FBekI7QUFDQSxTQUFLMkssUUFBTCxDQUFjLEtBQUsxRCxNQUFuQixFQUEyQmpILEVBQTNCLEVBQStCLElBQS9CO0FBQ0EsUUFBSSxLQUFLaUgsTUFBTCxDQUFZdkksQ0FBWixHQUFnQixHQUFwQixFQUF5QixLQUFLa0wsVUFBTDtBQUN6QixRQUFJLEtBQUtnQixHQUFMLENBQVMsS0FBSzNELE1BQWQsRUFBc0I7QUFBRXhJLE1BQUFBLENBQUMsRUFBRSxLQUFLdUksS0FBTCxDQUFXeEMsSUFBWCxDQUFnQi9GLENBQXJCO0FBQXdCQyxNQUFBQSxDQUFDLEVBQUUsS0FBS3NJLEtBQUwsQ0FBV3hDLElBQVgsQ0FBZ0I5RixDQUEzQztBQUE4Q0MsTUFBQUEsQ0FBQyxFQUFFLEVBQWpEO0FBQXFEQyxNQUFBQSxDQUFDLEVBQUU7QUFBeEQsS0FBdEIsQ0FBSixFQUEwRixLQUFLaU0sVUFBTDtBQUMxRixTQUFLMU4sTUFBTCxHQUFjOEMsSUFBSSxDQUFDK0osR0FBTCxDQUFTLENBQVQsRUFBWS9KLElBQUksQ0FBQ0MsR0FBTCxDQUFTLEtBQUs4RyxLQUFMLENBQVdvQyxNQUFYLEdBQW9CLEtBQUt2TSxNQUFsQyxFQUEwQyxLQUFLb0ssTUFBTCxDQUFZeEksQ0FBWixHQUFnQixLQUFLNUIsTUFBTCxHQUFjLElBQXhFLENBQVosQ0FBZDtBQUNELEdBem1CTTtBQTJtQlBpTixFQUFBQSxhQTNtQk8seUJBMm1CTzlKLEVBM21CUCxFQTJtQlc7QUFBQTs7QUFDaEIsU0FBSzJILE9BQUwsQ0FBYVMsT0FBYixDQUFxQixVQUFDUixLQUFELEVBQVc7QUFDOUIsVUFBSSxDQUFDQSxLQUFLLENBQUNHLEtBQVgsRUFBa0I7QUFDaEJILFFBQUFBLEtBQUssQ0FBQ0ksTUFBTixJQUFnQmhJLEVBQWhCO0FBQ0E7QUFDRDs7QUFDRCxNQUFBLE1BQUksQ0FBQzJLLFFBQUwsQ0FBYy9DLEtBQWQsRUFBcUI1SCxFQUFyQixFQUF5QixLQUF6Qjs7QUFDQSxVQUFJNEgsS0FBSyxDQUFDQyxFQUFOLEtBQWEsQ0FBakIsRUFBb0JELEtBQUssQ0FBQ0MsRUFBTixHQUFXNUgsSUFBSSxDQUFDNkssTUFBTCxLQUFnQixHQUFoQixHQUFzQixFQUF0QixHQUEyQixDQUFDLEVBQXZDO0FBQ3BCLFVBQUksQ0FBQyxNQUFJLENBQUNGLEdBQUwsQ0FBUyxNQUFJLENBQUMzRCxNQUFkLEVBQXNCVyxLQUF0QixDQUFELElBQWlDLE1BQUksQ0FBQ1gsTUFBTCxDQUFZcUIsVUFBWixHQUF5QixDQUE5RCxFQUFpRTtBQUVqRSxVQUFNeUMsS0FBSyxHQUFHLE1BQUksQ0FBQzlELE1BQUwsQ0FBWWEsRUFBWixHQUFpQixFQUFqQixJQUF1QixNQUFJLENBQUNiLE1BQUwsQ0FBWXZJLENBQVosR0FBZ0IsTUFBSSxDQUFDdUksTUFBTCxDQUFZckksQ0FBNUIsR0FBZ0NnSixLQUFLLENBQUNsSixDQUF0QyxHQUEwQyxFQUEvRTs7QUFDQSxVQUFJcU0sS0FBSixFQUFXO0FBQ1RuRCxRQUFBQSxLQUFLLENBQUNHLEtBQU4sR0FBYyxLQUFkO0FBQ0FILFFBQUFBLEtBQUssQ0FBQ0ksTUFBTixHQUFlLElBQWY7QUFDQSxRQUFBLE1BQUksQ0FBQ2YsTUFBTCxDQUFZYSxFQUFaLEdBQWlCLENBQUMsR0FBbEI7QUFDQSxRQUFBLE1BQUksQ0FBQzFLLEtBQUwsSUFBYyxHQUFkOztBQUNBLFFBQUEsTUFBSSxDQUFDcU4sV0FBTCxDQUFpQixNQUFJLENBQUMvTSxTQUF0QjtBQUNELE9BTkQsTUFNTztBQUNMLFFBQUEsTUFBSSxDQUFDa00sVUFBTDtBQUNEO0FBQ0YsS0FuQkQ7QUFvQkQsR0Fob0JNO0FBa29CUGUsRUFBQUEsUUFsb0JPLG9CQWtvQkVLLElBbG9CRixFQWtvQlFoTCxFQWxvQlIsRUFrb0JZaUwsUUFsb0JaLEVBa29Cc0I7QUFBQTs7QUFDM0JELElBQUFBLElBQUksQ0FBQ3ZNLENBQUwsSUFBVXVNLElBQUksQ0FBQ25ELEVBQUwsR0FBVTdILEVBQXBCO0FBQ0EsU0FBS29ILE1BQUwsQ0FBWWdCLE9BQVosQ0FBb0IsVUFBQ2YsS0FBRCxFQUFXO0FBQzdCLFVBQUksQ0FBQyxNQUFJLENBQUN1RCxHQUFMLENBQVNJLElBQVQsRUFBZTNELEtBQWYsQ0FBTCxFQUE0QjtBQUM1QixVQUFJMkQsSUFBSSxDQUFDbkQsRUFBTCxHQUFVLENBQWQsRUFBaUJtRCxJQUFJLENBQUN2TSxDQUFMLEdBQVM0SSxLQUFLLENBQUM1SSxDQUFOLEdBQVV1TSxJQUFJLENBQUNyTSxDQUF4QjtBQUNqQixVQUFJcU0sSUFBSSxDQUFDbkQsRUFBTCxHQUFVLENBQWQsRUFBaUJtRCxJQUFJLENBQUN2TSxDQUFMLEdBQVM0SSxLQUFLLENBQUM1SSxDQUFOLEdBQVU0SSxLQUFLLENBQUMxSSxDQUF6QjtBQUNqQnFNLE1BQUFBLElBQUksQ0FBQ25ELEVBQUwsR0FBVSxDQUFWO0FBQ0QsS0FMRDtBQU9BbUQsSUFBQUEsSUFBSSxDQUFDbEQsRUFBTCxJQUFXLEtBQUsvSyxPQUFMLEdBQWVpRCxFQUExQjtBQUNBZ0wsSUFBQUEsSUFBSSxDQUFDdE0sQ0FBTCxJQUFVc00sSUFBSSxDQUFDbEQsRUFBTCxHQUFVOUgsRUFBcEI7QUFDQWdMLElBQUFBLElBQUksQ0FBQy9DLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQSxTQUFLYixNQUFMLENBQVlnQixPQUFaLENBQW9CLFVBQUNmLEtBQUQsRUFBVztBQUM3QixVQUFJLENBQUMsTUFBSSxDQUFDdUQsR0FBTCxDQUFTSSxJQUFULEVBQWUzRCxLQUFmLENBQUwsRUFBNEI7O0FBQzVCLFVBQUkyRCxJQUFJLENBQUNsRCxFQUFMLEdBQVUsQ0FBZCxFQUFpQjtBQUNma0QsUUFBQUEsSUFBSSxDQUFDdE0sQ0FBTCxHQUFTMkksS0FBSyxDQUFDM0ksQ0FBTixHQUFVc00sSUFBSSxDQUFDcE0sQ0FBeEI7QUFDQW9NLFFBQUFBLElBQUksQ0FBQ2xELEVBQUwsR0FBVSxDQUFWO0FBQ0FrRCxRQUFBQSxJQUFJLENBQUMvQyxRQUFMLEdBQWdCLElBQWhCO0FBQ0QsT0FKRCxNQUlPLElBQUkrQyxJQUFJLENBQUNsRCxFQUFMLEdBQVUsQ0FBZCxFQUFpQjtBQUN0QmtELFFBQUFBLElBQUksQ0FBQ3RNLENBQUwsR0FBUzJJLEtBQUssQ0FBQzNJLENBQU4sR0FBVTJJLEtBQUssQ0FBQ3pJLENBQXpCO0FBQ0FvTSxRQUFBQSxJQUFJLENBQUNsRCxFQUFMLEdBQVUsQ0FBVjtBQUNBLFlBQUltRCxRQUFRLElBQUk1RCxLQUFLLENBQUNxQixJQUFOLEtBQWUsVUFBL0IsRUFBMkMsTUFBSSxDQUFDd0MsV0FBTCxDQUFpQjdELEtBQWpCO0FBQzVDO0FBQ0YsS0FYRDtBQVlELEdBMXBCTTtBQTRwQlA2RCxFQUFBQSxXQTVwQk8sdUJBNHBCSzdELEtBNXBCTCxFQTRwQlk7QUFDakIsUUFBSUEsS0FBSyxDQUFDNkIsSUFBVixFQUFnQjtBQUNoQjdCLElBQUFBLEtBQUssQ0FBQzZCLElBQU4sR0FBYSxJQUFiO0FBQ0E3QixJQUFBQSxLQUFLLENBQUM4QixJQUFOLEdBQWEsRUFBYjtBQUNBLFNBQUsvTCxLQUFMLElBQWMsR0FBZDtBQUNBLFNBQUsrTixZQUFMLENBQWtCOUQsS0FBbEI7QUFDQSxTQUFLb0QsV0FBTCxDQUFpQixLQUFLNU0sUUFBdEI7QUFDRCxHQW5xQk07QUFxcUJQc04sRUFBQUEsWUFycUJPLHdCQXFxQk05RCxLQXJxQk4sRUFxcUJhO0FBQ2xCLFNBQUtLLFFBQUwsQ0FBYzBELElBQWQsQ0FBbUI7QUFDakIzTSxNQUFBQSxDQUFDLEVBQUU0SSxLQUFLLENBQUM1SSxDQUFOLEdBQVUsQ0FESTtBQUVqQkMsTUFBQUEsQ0FBQyxFQUFFMkksS0FBSyxDQUFDM0ksQ0FBTixHQUFVLEVBRkk7QUFHakJDLE1BQUFBLENBQUMsRUFBRSxFQUhjO0FBSWpCQyxNQUFBQSxDQUFDLEVBQUUsRUFKYztBQUtqQmlKLE1BQUFBLEVBQUUsRUFBRSxDQUFDLEVBTFk7QUFNakJDLE1BQUFBLEVBQUUsRUFBRSxDQU5hO0FBT2pCRyxNQUFBQSxRQUFRLEVBQUUsS0FQTztBQVFqQkYsTUFBQUEsS0FBSyxFQUFFLElBUlU7QUFTakJzRCxNQUFBQSxHQUFHLEVBQUU7QUFUWSxLQUFuQjtBQVdELEdBanJCTTtBQW1yQlB0QixFQUFBQSxjQW5yQk8sMEJBbXJCUS9KLEVBbnJCUixFQW1yQlk7QUFBQTs7QUFDakIsUUFBSSxDQUFDLEtBQUswSCxRQUFWLEVBQW9CO0FBQ3BCLFNBQUtBLFFBQUwsQ0FBY1UsT0FBZCxDQUFzQixVQUFDWCxJQUFELEVBQVU7QUFDOUIsVUFBSSxDQUFDQSxJQUFJLENBQUNNLEtBQVYsRUFBaUI7QUFDakJOLE1BQUFBLElBQUksQ0FBQzRELEdBQUwsSUFBWXJMLEVBQUUsR0FBRyxDQUFqQjtBQUNBLFVBQU1zTCxLQUFLLEdBQUc3RCxJQUFJLENBQUNJLEVBQW5COztBQUNBLE1BQUEsTUFBSSxDQUFDOEMsUUFBTCxDQUFjbEQsSUFBZCxFQUFvQnpILEVBQXBCLEVBQXdCLEtBQXhCOztBQUNBLFVBQUl5SCxJQUFJLENBQUNJLEVBQUwsS0FBWSxDQUFoQixFQUFtQkosSUFBSSxDQUFDSSxFQUFMLEdBQVV5RCxLQUFLLEdBQUcsQ0FBUixHQUFZLEVBQVosR0FBaUIsQ0FBQyxFQUE1QjtBQUNuQixVQUFJN0QsSUFBSSxDQUFDL0ksQ0FBTCxHQUFTLEdBQVQsSUFBZ0IrSSxJQUFJLENBQUNoSixDQUFMLEdBQVMsTUFBSSxDQUFDdEIsTUFBTCxHQUFjLEdBQTNDLEVBQWdEc0ssSUFBSSxDQUFDTSxLQUFMLEdBQWEsS0FBYjtBQUNoRCxVQUFNd0QsVUFBVSxHQUFHO0FBQ2pCOU0sUUFBQUEsQ0FBQyxFQUFFZ0osSUFBSSxDQUFDaEosQ0FBTCxHQUFTLEVBREs7QUFFakJDLFFBQUFBLENBQUMsRUFBRStJLElBQUksQ0FBQy9JLENBQUwsR0FBUyxFQUZLO0FBR2pCQyxRQUFBQSxDQUFDLEVBQUU4SSxJQUFJLENBQUM5SSxDQUFMLEdBQVMsRUFISztBQUlqQkMsUUFBQUEsQ0FBQyxFQUFFNkksSUFBSSxDQUFDN0ksQ0FBTCxHQUFTO0FBSkssT0FBbkI7QUFNQSxVQUFJLENBQUMsTUFBSSxDQUFDZ00sR0FBTCxDQUFTLE1BQUksQ0FBQzNELE1BQWQsRUFBc0JzRSxVQUF0QixDQUFMLEVBQXdDO0FBQ3hDOUQsTUFBQUEsSUFBSSxDQUFDTSxLQUFMLEdBQWEsS0FBYjs7QUFDQSxVQUFJLENBQUMsTUFBSSxDQUFDZCxNQUFMLENBQVlvQixHQUFqQixFQUFzQjtBQUNwQixRQUFBLE1BQUksQ0FBQ3BCLE1BQUwsQ0FBWW9CLEdBQVosR0FBa0IsSUFBbEI7QUFDQSxRQUFBLE1BQUksQ0FBQ3BCLE1BQUwsQ0FBWXJJLENBQVosR0FBZ0IsRUFBaEI7QUFDQSxRQUFBLE1BQUksQ0FBQ3FJLE1BQUwsQ0FBWXZJLENBQVosSUFBaUIsRUFBakI7QUFDRDs7QUFDRCxNQUFBLE1BQUksQ0FBQ3RCLEtBQUwsSUFBYyxHQUFkOztBQUNBLE1BQUEsTUFBSSxDQUFDcU4sV0FBTCxDQUFpQixNQUFJLENBQUM3TSxTQUF0QjtBQUNELEtBdEJEO0FBdUJELEdBNXNCTTtBQThzQlBnTSxFQUFBQSxVQTlzQk8sd0JBOHNCTTtBQUNYLFNBQUt2TSxLQUFMLElBQWMsQ0FBZDtBQUNBLFNBQUtvTixXQUFMLENBQWlCLEtBQUs5TSxRQUF0Qjs7QUFDQSxRQUFJLEtBQUtOLEtBQUwsSUFBYyxDQUFsQixFQUFxQjtBQUNuQixXQUFLSixLQUFMLEdBQWEsTUFBYjtBQUNBLFdBQUtNLE9BQUwsR0FBZSx3QkFBZjtBQUNBLFVBQUksS0FBS2IsV0FBVCxFQUFzQixLQUFLQSxXQUFMLENBQWlCOE8sSUFBakI7QUFDdEIsV0FBS2YsV0FBTCxDQUFpQixLQUFLMU0sWUFBdEI7QUFDQTtBQUNEOztBQUNELFNBQUtrSixNQUFMLEdBQWMsS0FBS0MsVUFBTCxFQUFkO0FBQ0EsU0FBS0QsTUFBTCxDQUFZeEksQ0FBWixHQUFnQixLQUFLdUksS0FBTCxDQUFXRyxLQUFYLENBQWlCMUksQ0FBakM7QUFDQSxTQUFLd0ksTUFBTCxDQUFZdkksQ0FBWixHQUFnQixLQUFLc0ksS0FBTCxDQUFXRyxLQUFYLENBQWlCekksQ0FBakM7QUFDQSxTQUFLdUksTUFBTCxDQUFZcUIsVUFBWixHQUF5QixHQUF6QjtBQUNBLFNBQUtoTCxLQUFMLEdBQWEsR0FBYjtBQUNELEdBN3RCTTtBQSt0QlB1TixFQUFBQSxVQS90Qk8sd0JBK3RCTTtBQUNYLFNBQUs1TixLQUFMLEdBQWEsT0FBYjtBQUNBLFNBQUtHLEtBQUwsSUFBYzZDLElBQUksQ0FBQytKLEdBQUwsQ0FBUyxDQUFULEVBQVkvSixJQUFJLENBQUN3TCxJQUFMLENBQVUsS0FBS25PLEtBQWYsQ0FBWixJQUFxQyxFQUFuRDtBQUNBLFNBQUtDLE9BQUwsR0FBZSwwQkFBZjtBQUNBLFFBQUksS0FBS2IsV0FBVCxFQUFzQixLQUFLQSxXQUFMLENBQWlCOE8sSUFBakI7QUFDdEIsU0FBS2YsV0FBTCxDQUFpQixLQUFLM00sU0FBdEI7QUFDRCxHQXJ1Qk07QUF1dUJQbU0sRUFBQUEsU0F2dUJPLHVCQXV1Qks7QUFDVixTQUFLeE4sUUFBTCxDQUFjNkosTUFBZCxHQUEwQixLQUFLakosS0FBL0Isc0JBQXFEcU8sTUFBTSxDQUFDLEtBQUt0TyxLQUFOLENBQU4sQ0FBbUJ1TyxRQUFuQixDQUE0QixDQUE1QixFQUErQixHQUEvQixDQUFyRCxzQkFBeUcsS0FBSzNFLEtBQUwsQ0FBV3RGLElBQXBILHFCQUF3SXpCLElBQUksQ0FBQytKLEdBQUwsQ0FBUyxDQUFULEVBQVkvSixJQUFJLENBQUN3TCxJQUFMLENBQVUsS0FBS25PLEtBQWYsQ0FBWixDQUF4STtBQUNELEdBenVCTTtBQTJ1QlArQyxFQUFBQSxJQTN1Qk8sa0JBMnVCQTtBQUNMLFFBQU11TCxDQUFDLEdBQUcsS0FBS3hQLFFBQWY7QUFDQSxRQUFJLENBQUN3UCxDQUFMLEVBQVE7QUFDUkEsSUFBQUEsQ0FBQyxDQUFDQyxLQUFGOztBQUVBLFFBQUksS0FBSzVPLEtBQUwsS0FBZSxNQUFuQixFQUEyQjtBQUN6QixXQUFLd0osZ0JBQUw7QUFDQSxXQUFLcUYsZ0JBQUw7QUFDQSxXQUFLQyxrQkFBTDtBQUNBLFdBQUs1SyxVQUFMLENBQWdCeEIsSUFBaEIsQ0FBcUJpRSxNQUFyQixHQUE4QixLQUE5QjtBQUNBO0FBQ0Q7O0FBRUQsUUFBSSxLQUFLM0csS0FBTCxLQUFlLFFBQW5CLEVBQTZCO0FBQzNCLFdBQUt3SixnQkFBTDtBQUNBLFdBQUtxRixnQkFBTDtBQUNBLFdBQUtDLGtCQUFMO0FBQ0EsV0FBSzVLLFVBQUwsQ0FBZ0J4QixJQUFoQixDQUFxQmlFLE1BQXJCLEdBQThCLEtBQTlCO0FBQ0E7QUFDRDs7QUFFRCxTQUFLb0ksZ0JBQUw7QUFDQSxTQUFLQyxnQkFBTDtBQUNBLFNBQUtDLGtCQUFMO0FBQ0EsU0FBS0MsZUFBTDtBQUNBLFNBQUtDLGNBQUw7QUFFQSxRQUFJLEtBQUtuUCxLQUFMLEtBQWUsUUFBbkIsRUFBNkIsS0FBS00sT0FBTCxHQUFlLFFBQWY7QUFDN0IsU0FBS2YsU0FBTCxDQUFlOEosTUFBZixHQUF3QixLQUFLL0ksT0FBN0I7QUFDRCxHQXh3Qk07QUEwd0JQNE8sRUFBQUEsZUExd0JPLDZCQTB3Qlc7QUFBQTs7QUFDaEIsUUFBSSxLQUFLbkwsWUFBTCxJQUFxQixLQUFLaEQsTUFBTCxDQUFZcUcsVUFBakMsSUFBK0MsS0FBSzRDLE1BQXhELEVBQWdFO0FBQzlELFVBQU1vRixPQUFPLEdBQUcsS0FBS3BGLE1BQUwsQ0FBWWdCLFFBQVosSUFBd0JoSSxJQUFJLENBQUN5SyxHQUFMLENBQVMsS0FBS3pELE1BQUwsQ0FBWVksRUFBckIsSUFBMkIsRUFBbkU7QUFDQSxVQUFNeUUsT0FBTyxHQUFHLENBQUMsS0FBS3JGLE1BQUwsQ0FBWWdCLFFBQTdCO0FBQ0EsVUFBTXNFLFlBQVksR0FBRyxLQUFLdk8sTUFBTCxDQUFZb0csZ0JBQVosSUFBZ0MsQ0FBQyxLQUFLcEcsTUFBTCxDQUFZcUcsVUFBYixDQUFyRDtBQUNBLFVBQU1tSSxnQkFBZ0IsR0FBR0YsT0FBTyxHQUM1QnJNLElBQUksQ0FBQ0MsR0FBTCxDQUFTLENBQVQsRUFBWXFNLFlBQVksQ0FBQ25ELE1BQWIsR0FBc0IsQ0FBbEMsQ0FENEIsR0FFNUJpRCxPQUFPLEdBQ0xwTSxJQUFJLENBQUN3TSxLQUFMLENBQVcsS0FBS3hGLE1BQUwsQ0FBWXVCLElBQVosR0FBbUIsRUFBOUIsSUFBb0N2SSxJQUFJLENBQUNDLEdBQUwsQ0FBUyxDQUFULEVBQVlxTSxZQUFZLENBQUNuRCxNQUF6QixDQUQvQixHQUVMLENBSk47QUFLQSxXQUFLcEksWUFBTCxDQUFrQnJCLElBQWxCLENBQXVCaUUsTUFBdkIsR0FBZ0MsSUFBaEM7QUFDQSxXQUFLNUMsWUFBTCxDQUFrQjBDLFdBQWxCLEdBQWdDNkksWUFBWSxDQUFDQyxnQkFBRCxDQUFaLElBQWtDLEtBQUt4TyxNQUFMLENBQVlxRyxVQUE5RTtBQUNBLFdBQUtyRCxZQUFMLENBQWtCckIsSUFBbEIsQ0FBdUJrQyxXQUF2QixDQUNFLEtBQUtvRixNQUFMLENBQVl4SSxDQUFaLEdBQWdCLEtBQUt0QixNQUFyQixHQUE4QixLQUFLTixNQUFMLEdBQWMsQ0FBNUMsR0FBZ0QsS0FBS29LLE1BQUwsQ0FBWXRJLENBQVosR0FBZ0IsQ0FEbEUsRUFFRSxLQUFLN0IsTUFBTCxHQUFjLENBQWQsR0FBa0IsS0FBS21LLE1BQUwsQ0FBWXZJLENBQTlCLEdBQWtDLEtBQUt1SSxNQUFMLENBQVlySSxDQUFaLEdBQWdCLENBRnBEO0FBSUEsV0FBS29DLFlBQUwsQ0FBa0JyQixJQUFsQixDQUF1QitNLFFBQXZCLENBQWdDLEtBQUt6RixNQUFMLENBQVlzQixNQUE1QyxFQUFvRCxDQUFwRDtBQUNBLFdBQUt2SCxZQUFMLENBQWtCckIsSUFBbEIsQ0FBdUJXLGNBQXZCLENBQXNDLEtBQUsyRyxNQUFMLENBQVlvQixHQUFaLEdBQWtCLEVBQWxCLEdBQXVCLEVBQTdELEVBQWlFLEtBQUtwQixNQUFMLENBQVlvQixHQUFaLEdBQWtCLEVBQWxCLEdBQXVCLEVBQXhGO0FBQ0EsV0FBS3JILFlBQUwsQ0FBa0JyQixJQUFsQixDQUF1QmdOLE9BQXZCLEdBQWlDLEtBQUsxRixNQUFMLENBQVlxQixVQUFaLEdBQXlCLENBQXpCLElBQThCckksSUFBSSxDQUFDd00sS0FBTCxDQUFXRyxJQUFJLENBQUNDLEdBQUwsS0FBYSxFQUF4QixJQUE4QixDQUE5QixLQUFvQyxDQUFsRSxHQUFzRSxFQUF0RSxHQUEyRSxHQUE1RztBQUNEOztBQUVELFNBQUtDLGtCQUFMO0FBQ0EsU0FBS25GLE9BQUwsQ0FBYVMsT0FBYixDQUFxQixVQUFDUixLQUFELEVBQVFmLEtBQVIsRUFBa0I7QUFDckMsVUFBTS9FLE1BQU0sR0FBRyxNQUFJLENBQUM3RCxZQUFMLENBQWtCNEksS0FBbEIsQ0FBZjtBQUNBLFVBQUksQ0FBQy9FLE1BQUwsRUFBYTtBQUNiQSxNQUFBQSxNQUFNLENBQUNuQyxJQUFQLENBQVlpRSxNQUFaLEdBQXFCLENBQUMsQ0FBQyxNQUFJLENBQUM1RixNQUFMLENBQVl1RyxNQUFkLElBQXdCcUQsS0FBSyxDQUFDRyxLQUFuRDtBQUNBLFVBQUksQ0FBQ2pHLE1BQU0sQ0FBQ25DLElBQVAsQ0FBWWlFLE1BQWpCLEVBQXlCO0FBQ3pCLFVBQU1VLFlBQVksR0FBRyxNQUFJLENBQUN0RyxNQUFMLENBQVlzRyxZQUFaLElBQTRCLENBQUMsTUFBSSxDQUFDdEcsTUFBTCxDQUFZdUcsTUFBYixDQUFqRDtBQUNBekMsTUFBQUEsTUFBTSxDQUFDNEIsV0FBUCxHQUFxQlksWUFBWSxDQUFDckUsSUFBSSxDQUFDd00sS0FBTCxDQUFZRyxJQUFJLENBQUNDLEdBQUwsS0FBYSxHQUFkLEdBQXFCaEcsS0FBaEMsSUFBeUN2QyxZQUFZLENBQUM4RSxNQUF2RCxDQUFaLElBQThFLE1BQUksQ0FBQ3BMLE1BQUwsQ0FBWXVHLE1BQS9HO0FBQ0F6QyxNQUFBQSxNQUFNLENBQUNuQyxJQUFQLENBQVlrQyxXQUFaLENBQ0UrRixLQUFLLENBQUNuSixDQUFOLEdBQVUsTUFBSSxDQUFDdEIsTUFBZixHQUF3QixNQUFJLENBQUNOLE1BQUwsR0FBYyxDQUF0QyxHQUEwQytLLEtBQUssQ0FBQ2pKLENBQU4sR0FBVSxDQUR0RCxFQUVFLE1BQUksQ0FBQzdCLE1BQUwsR0FBYyxDQUFkLEdBQWtCOEssS0FBSyxDQUFDbEosQ0FBeEIsR0FBNEJrSixLQUFLLENBQUNoSixDQUFOLEdBQVUsQ0FGeEM7QUFJQWtELE1BQUFBLE1BQU0sQ0FBQ25DLElBQVAsQ0FBWVcsY0FBWixDQUEyQixFQUEzQixFQUErQixFQUEvQjtBQUNELEtBWkQ7QUFhRCxHQTd5Qk07QUEreUJQMkwsRUFBQUEsZ0JBL3lCTyw4QkEreUJZO0FBQUE7O0FBQ2pCLFFBQUksQ0FBQyxLQUFLak8sTUFBTCxDQUFZMkcsU0FBYixJQUEwQixDQUFDLEtBQUszRyxNQUFMLENBQVk0RyxVQUF2QyxJQUFxRCxDQUFDLEtBQUs1RyxNQUFMLENBQVk2RyxTQUFsRSxJQUErRSxDQUFDLEtBQUs3RyxNQUFMLENBQVk4RyxZQUFoRyxFQUE4RztBQUM5RyxRQUFJK0IsS0FBSyxHQUFHLENBQVo7QUFDQSxTQUFLTyxNQUFMLENBQVlnQixPQUFaLENBQW9CLFVBQUNmLEtBQUQsRUFBVztBQUM3QixVQUFNMEYsUUFBUSxHQUFHMUYsS0FBSyxDQUFDNUksQ0FBTixHQUFVLE1BQUksQ0FBQ3RCLE1BQWhDO0FBQ0EsVUFBSTRQLFFBQVEsR0FBRzFGLEtBQUssQ0FBQzFJLENBQWpCLEdBQXFCLENBQUMsRUFBdEIsSUFBNEJvTyxRQUFRLEdBQUcsTUFBSSxDQUFDbFEsTUFBTCxHQUFjLEVBQXpELEVBQTZEOztBQUM3RCxVQUFJd0ssS0FBSyxDQUFDcUIsSUFBTixLQUFlLFFBQW5CLEVBQTZCO0FBQzNCLFlBQU1zRSxTQUFRLEdBQUcsRUFBakI7O0FBQ0EsWUFBTUMsS0FBSSxHQUFHaE4sSUFBSSxDQUFDd0wsSUFBTCxDQUFVcEUsS0FBSyxDQUFDMUksQ0FBTixHQUFVcU8sU0FBcEIsQ0FBYjs7QUFDQSxZQUFNRSxLQUFJLEdBQUdqTixJQUFJLENBQUMrSixHQUFMLENBQVMsQ0FBVCxFQUFZL0osSUFBSSxDQUFDd0wsSUFBTCxDQUFVcEUsS0FBSyxDQUFDekksQ0FBTixHQUFVb08sU0FBcEIsQ0FBWixDQUFiOztBQUNBLGFBQUssSUFBSUcsR0FBRyxHQUFHLENBQWYsRUFBa0JBLEdBQUcsR0FBR0YsS0FBeEIsRUFBOEJFLEdBQUcsSUFBSSxDQUFyQyxFQUF3QztBQUN0QyxlQUFLLElBQUlDLEdBQUcsR0FBRyxDQUFmLEVBQWtCQSxHQUFHLEdBQUdGLEtBQXhCLEVBQThCRSxHQUFHLElBQUksQ0FBckMsRUFBd0M7QUFDdEMsZ0JBQU01SixNQUFLLEdBQUc0SixHQUFHLEtBQUssQ0FBUixHQUFZLE1BQUksQ0FBQ3BQLE1BQUwsQ0FBWTJHLFNBQXhCLEdBQW9DLE1BQUksQ0FBQzNHLE1BQUwsQ0FBWTRHLFVBQTlEOztBQUNBLFlBQUEsTUFBSSxDQUFDeUksZ0JBQUwsQ0FBc0J4RyxLQUF0QixFQUE2QnJELE1BQTdCLEVBQW9DNkQsS0FBSyxDQUFDNUksQ0FBTixHQUFVME8sR0FBRyxHQUFHSCxTQUFwRCxFQUE4RDNGLEtBQUssQ0FBQzNJLENBQU4sR0FBVTBPLEdBQUcsR0FBR0osU0FBOUUsRUFBd0ZBLFNBQXhGLEVBQWtHQSxTQUFsRzs7QUFDQW5HLFlBQUFBLEtBQUssSUFBSSxDQUFUO0FBQ0Q7QUFDRjs7QUFDRDtBQUNEOztBQUVELFVBQUlRLEtBQUssQ0FBQ3FCLElBQU4sS0FBZSxNQUFuQixFQUEyQjtBQUN6QixZQUFNc0UsVUFBUSxHQUFHLEVBQWpCOztBQUNBLFlBQU1DLE1BQUksR0FBR2hOLElBQUksQ0FBQytKLEdBQUwsQ0FBUyxDQUFULEVBQVkvSixJQUFJLENBQUN3TCxJQUFMLENBQVVwRSxLQUFLLENBQUMxSSxDQUFOLEdBQVVxTyxVQUFwQixDQUFaLENBQWI7O0FBQ0EsWUFBTUUsTUFBSSxHQUFHak4sSUFBSSxDQUFDK0osR0FBTCxDQUFTLENBQVQsRUFBWS9KLElBQUksQ0FBQ3dMLElBQUwsQ0FBVXBFLEtBQUssQ0FBQ3pJLENBQU4sR0FBVW9PLFVBQXBCLENBQVosQ0FBYjs7QUFDQSxhQUFLLElBQUlHLElBQUcsR0FBRyxDQUFmLEVBQWtCQSxJQUFHLEdBQUdGLE1BQXhCLEVBQThCRSxJQUFHLElBQUksQ0FBckMsRUFBd0M7QUFDdEMsZUFBSyxJQUFJQyxJQUFHLEdBQUcsQ0FBZixFQUFrQkEsSUFBRyxHQUFHRixNQUF4QixFQUE4QkUsSUFBRyxJQUFJLENBQXJDLEVBQXdDO0FBQ3RDLGdCQUFNNUosT0FBSyxHQUFHNEosSUFBRyxLQUFLLENBQVIsR0FBYSxNQUFJLENBQUNwUCxNQUFMLENBQVlpSCxPQUFaLElBQXVCLE1BQUksQ0FBQ2pILE1BQUwsQ0FBWTZHLFNBQWhELEdBQThELE1BQUksQ0FBQzdHLE1BQUwsQ0FBWWtILFFBQVosSUFBd0IsTUFBSSxDQUFDbEgsTUFBTCxDQUFZaUgsT0FBcEMsSUFBK0MsTUFBSSxDQUFDakgsTUFBTCxDQUFZNkcsU0FBdkk7O0FBQ0EsWUFBQSxNQUFJLENBQUN3SSxnQkFBTCxDQUFzQnhHLEtBQXRCLEVBQTZCckQsT0FBN0IsRUFBb0M2RCxLQUFLLENBQUM1SSxDQUFOLEdBQVUwTyxJQUFHLEdBQUdILFVBQXBELEVBQThEM0YsS0FBSyxDQUFDM0ksQ0FBTixHQUFVME8sSUFBRyxHQUFHSixVQUE5RSxFQUF3RkEsVUFBeEYsRUFBa0dBLFVBQWxHOztBQUNBbkcsWUFBQUEsS0FBSyxJQUFJLENBQVQ7QUFDRDtBQUNGOztBQUNEO0FBQ0Q7O0FBRUQsVUFBSVEsS0FBSyxDQUFDcUIsSUFBTixLQUFlLE9BQW5CLEVBQTRCO0FBQzFCLFlBQU1zRSxVQUFRLEdBQUcsRUFBakI7O0FBQ0EsWUFBTUMsTUFBSSxHQUFHaE4sSUFBSSxDQUFDK0osR0FBTCxDQUFTLENBQVQsRUFBWS9KLElBQUksQ0FBQ3dMLElBQUwsQ0FBVXBFLEtBQUssQ0FBQzFJLENBQU4sR0FBVXFPLFVBQXBCLENBQVosQ0FBYjs7QUFDQSxhQUFLLElBQUlHLEtBQUcsR0FBRyxDQUFmLEVBQWtCQSxLQUFHLEdBQUdGLE1BQXhCLEVBQThCRSxLQUFHLElBQUksQ0FBckMsRUFBd0M7QUFDdEMsY0FBTTNKLE9BQUssR0FBRzJKLEtBQUcsS0FBS0YsTUFBSSxHQUFHLENBQWYsR0FDVCxNQUFJLENBQUNqUCxNQUFMLENBQVkySCxVQUFaLElBQTBCLE1BQUksQ0FBQzNILE1BQUwsQ0FBWTBILFNBQXRDLElBQW1ELE1BQUksQ0FBQzFILE1BQUwsQ0FBWTZHLFNBRHRELEdBRVQsTUFBSSxDQUFDN0csTUFBTCxDQUFZMEgsU0FBWixJQUF5QixNQUFJLENBQUMxSCxNQUFMLENBQVkySCxVQUFyQyxJQUFtRCxNQUFJLENBQUMzSCxNQUFMLENBQVk2RyxTQUZwRTs7QUFHQSxVQUFBLE1BQUksQ0FBQ3dJLGdCQUFMLENBQXNCeEcsS0FBdEIsRUFBNkJyRCxPQUE3QixFQUFvQzZELEtBQUssQ0FBQzVJLENBQU4sR0FBVTBPLEtBQUcsR0FBR0gsVUFBcEQsRUFBOEQzRixLQUFLLENBQUMzSSxDQUFwRSxFQUF1RXNPLFVBQXZFLEVBQWlGM0YsS0FBSyxDQUFDekksQ0FBdkY7O0FBQ0FpSSxVQUFBQSxLQUFLLElBQUksQ0FBVDtBQUNEOztBQUNEO0FBQ0Q7O0FBRUQsVUFBTW1HLFFBQVEsR0FBRzNGLEtBQUssQ0FBQ3FCLElBQU4sS0FBZSxVQUFmLEdBQTRCLEVBQTVCLEdBQWlDLEVBQWxEO0FBQ0EsVUFBTXVFLElBQUksR0FBR2hOLElBQUksQ0FBQytKLEdBQUwsQ0FBUyxDQUFULEVBQVkvSixJQUFJLENBQUN3TCxJQUFMLENBQVVwRSxLQUFLLENBQUMxSSxDQUFOLEdBQVVxTyxRQUFwQixDQUFaLENBQWI7QUFDQSxVQUFNRSxJQUFJLEdBQUdqTixJQUFJLENBQUMrSixHQUFMLENBQVMsQ0FBVCxFQUFZL0osSUFBSSxDQUFDd0wsSUFBTCxDQUFVcEUsS0FBSyxDQUFDekksQ0FBTixHQUFVb08sUUFBcEIsQ0FBWixDQUFiO0FBQ0EsVUFBTXhKLEtBQUssR0FBRzZELEtBQUssQ0FBQ3FCLElBQU4sS0FBZSxVQUFmLEdBQ1RyQixLQUFLLENBQUM2QixJQUFOLEdBQWEsTUFBSSxDQUFDbEwsTUFBTCxDQUFZK0csUUFBekIsR0FBb0MsTUFBSSxDQUFDL0csTUFBTCxDQUFZOEcsWUFEdkMsR0FFVHVDLEtBQUssQ0FBQ3FCLElBQU4sS0FBZSxNQUFmLEdBQXlCLE1BQUksQ0FBQzFLLE1BQUwsQ0FBWW1ILFFBQVosSUFBd0IsTUFBSSxDQUFDbkgsTUFBTCxDQUFZNkcsU0FBN0QsR0FBMEUsTUFBSSxDQUFDN0csTUFBTCxDQUFZNkcsU0FGM0Y7QUFHQSxVQUFNeUksS0FBSyxHQUFHakcsS0FBSyxDQUFDcUIsSUFBTixLQUFlLFVBQWYsR0FBNkJyQixLQUFLLENBQUM4QixJQUFOLElBQWMsQ0FBM0MsR0FBZ0QsQ0FBOUQ7O0FBQ0EsV0FBSyxJQUFJZ0UsS0FBRyxHQUFHLENBQWYsRUFBa0JBLEtBQUcsR0FBR0YsSUFBeEIsRUFBOEJFLEtBQUcsSUFBSSxDQUFyQyxFQUF3QztBQUN0QyxhQUFLLElBQUlDLEtBQUcsR0FBRyxDQUFmLEVBQWtCQSxLQUFHLEdBQUdGLElBQXhCLEVBQThCRSxLQUFHLElBQUksQ0FBckMsRUFBd0M7QUFDdEMsVUFBQSxNQUFJLENBQUNDLGdCQUFMLENBQXNCeEcsS0FBdEIsRUFBNkJyRCxLQUE3QixFQUFvQzZELEtBQUssQ0FBQzVJLENBQU4sR0FBVTBPLEtBQUcsR0FBR0gsUUFBcEQsRUFBOEQzRixLQUFLLENBQUMzSSxDQUFOLEdBQVUwTyxLQUFHLEdBQUdKLFFBQWhCLEdBQTJCTSxLQUF6RixFQUFnR04sUUFBaEcsRUFBMEdBLFFBQTFHOztBQUNBbkcsVUFBQUEsS0FBSyxJQUFJLENBQVQ7QUFDRDtBQUNGO0FBQ0YsS0F6REQ7O0FBMkRBLFNBQUssSUFBSTBHLENBQUMsR0FBRzFHLEtBQWIsRUFBb0IwRyxDQUFDLEdBQUcsS0FBS3JQLFlBQUwsQ0FBa0JrTCxNQUExQyxFQUFrRG1FLENBQUMsSUFBSSxDQUF2RCxFQUEwRDtBQUN4RCxXQUFLclAsWUFBTCxDQUFrQnFQLENBQWxCLEVBQXFCNU4sSUFBckIsQ0FBMEJpRSxNQUExQixHQUFtQyxLQUFuQztBQUNEO0FBQ0YsR0FoM0JNO0FBazNCUG9JLEVBQUFBLGdCQWwzQk8sOEJBazNCWTtBQUFBOztBQUNqQixRQUFJLENBQUMsS0FBS3hFLFdBQVYsRUFBdUI7QUFDdkIsUUFBSVgsS0FBSyxHQUFHLENBQVo7QUFDQSxTQUFLVyxXQUFMLENBQWlCWSxPQUFqQixDQUF5QixVQUFDWCxJQUFELEVBQVU7QUFDakMsVUFBTXVCLFFBQVEsR0FBR3ZCLElBQUksQ0FBQ3VCLFFBQUwsSUFBaUIsQ0FBbEM7QUFDQSxVQUFNdkssQ0FBQyxHQUFHZ0osSUFBSSxDQUFDaEosQ0FBTCxHQUFTLE1BQUksQ0FBQ3RCLE1BQUwsR0FBYzZMLFFBQWpDO0FBQ0EsVUFBSXZLLENBQUMsR0FBR2dKLElBQUksQ0FBQzlJLENBQVQsR0FBYSxDQUFDLEdBQWQsSUFBcUJGLENBQUMsR0FBRyxNQUFJLENBQUM1QixNQUFMLEdBQWMsR0FBM0MsRUFBZ0Q7O0FBQ2hELFVBQU0yRyxLQUFLLEdBQUcsTUFBSSxDQUFDZ0ssVUFBTCxDQUFnQi9GLElBQUksQ0FBQ2lCLElBQXJCLENBQWQ7O0FBQ0EsVUFBSSxDQUFDbEYsS0FBTCxFQUFZOztBQUNaLE1BQUEsTUFBSSxDQUFDaUssZ0JBQUwsQ0FBc0I1RyxLQUF0QixFQUE2QnJELEtBQTdCLEVBQW9DL0UsQ0FBcEMsRUFBdUNnSixJQUFJLENBQUMvSSxDQUE1QyxFQUErQytJLElBQUksQ0FBQzlJLENBQXBELEVBQXVEOEksSUFBSSxDQUFDN0ksQ0FBNUQ7O0FBQ0FpSSxNQUFBQSxLQUFLLElBQUksQ0FBVDtBQUNELEtBUkQ7O0FBVUEsU0FBSyxJQUFJMEcsQ0FBQyxHQUFHMUcsS0FBYixFQUFvQjBHLENBQUMsR0FBRyxLQUFLcFAsWUFBTCxDQUFrQmlMLE1BQTFDLEVBQWtEbUUsQ0FBQyxJQUFJLENBQXZELEVBQTBEO0FBQ3hELFdBQUtwUCxZQUFMLENBQWtCb1AsQ0FBbEIsRUFBcUI1TixJQUFyQixDQUEwQmlFLE1BQTFCLEdBQW1DLEtBQW5DO0FBQ0Q7QUFDRixHQWw0Qk07QUFvNEJQc0ksRUFBQUEsa0JBcDRCTyxnQ0FvNEJjO0FBQUE7O0FBQ25CLFFBQUksQ0FBQyxLQUFLeEUsUUFBVixFQUFvQjtBQUNwQixRQUFJYixLQUFLLEdBQUcsQ0FBWjtBQUNBLFNBQUthLFFBQUwsQ0FBY1UsT0FBZCxDQUFzQixVQUFDWCxJQUFELEVBQVU7QUFDOUIsVUFBSSxDQUFDQSxJQUFJLENBQUNNLEtBQU4sSUFBZSxDQUFDLE1BQUksQ0FBQy9KLE1BQUwsQ0FBWXdILFFBQWhDLEVBQTBDO0FBQzFDLFVBQU11SCxRQUFRLEdBQUd0RixJQUFJLENBQUNoSixDQUFMLEdBQVMsTUFBSSxDQUFDdEIsTUFBL0I7QUFDQSxVQUFJNFAsUUFBUSxHQUFHdEYsSUFBSSxDQUFDOUksQ0FBaEIsR0FBb0IsQ0FBQyxFQUFyQixJQUEyQm9PLFFBQVEsR0FBRyxNQUFJLENBQUNsUSxNQUFMLEdBQWMsRUFBeEQsRUFBNEQ7O0FBQzVELGFBQU8sTUFBSSxDQUFDdUIsY0FBTCxDQUFvQmdMLE1BQXBCLElBQThCdkMsS0FBckMsRUFBNEM7QUFDMUMsWUFBTS9FLE9BQU0sR0FBRyxNQUFJLENBQUNsQixjQUFMLG9CQUFvQyxNQUFJLENBQUN4QyxjQUFMLENBQW9CZ0wsTUFBcEIsR0FBNkIsQ0FBakUsR0FBc0UsQ0FBdEUsRUFBeUUsQ0FBekUsRUFBNEUsRUFBNUUsRUFBZ0YsRUFBaEYsQ0FBZjs7QUFDQXRILFFBQUFBLE9BQU0sQ0FBQ25DLElBQVAsQ0FBWWlFLE1BQVosR0FBcUIsS0FBckI7O0FBQ0EsUUFBQSxNQUFJLENBQUN4RixjQUFMLENBQW9CZ04sSUFBcEIsQ0FBeUJ0SixPQUF6QjtBQUNEOztBQUNELFVBQU1BLE1BQU0sR0FBRyxNQUFJLENBQUMxRCxjQUFMLENBQW9CeUksS0FBcEIsQ0FBZjtBQUNBL0UsTUFBQUEsTUFBTSxDQUFDNEIsV0FBUCxHQUFxQixNQUFJLENBQUMxRixNQUFMLENBQVl3SCxRQUFqQztBQUNBMUQsTUFBQUEsTUFBTSxDQUFDbkMsSUFBUCxDQUFZaUUsTUFBWixHQUFxQixJQUFyQjtBQUNBOUIsTUFBQUEsTUFBTSxDQUFDbkMsSUFBUCxDQUFZVyxjQUFaLENBQTJCLEVBQTNCLEVBQStCLEVBQS9CO0FBQ0EsVUFBTW9OLElBQUksR0FBR3pOLElBQUksQ0FBQzBOLEdBQUwsQ0FBU2xHLElBQUksQ0FBQzRELEdBQUwsSUFBWSxDQUFyQixJQUEwQixDQUF2QztBQUNBdkosTUFBQUEsTUFBTSxDQUFDbkMsSUFBUCxDQUFZa0MsV0FBWixDQUNFNEYsSUFBSSxDQUFDaEosQ0FBTCxHQUFTLE1BQUksQ0FBQ3RCLE1BQWQsR0FBdUIsTUFBSSxDQUFDTixNQUFMLEdBQWMsQ0FBckMsR0FBeUM0SyxJQUFJLENBQUM5SSxDQUFMLEdBQVMsQ0FEcEQsRUFFRSxNQUFJLENBQUM3QixNQUFMLEdBQWMsQ0FBZCxHQUFrQjJLLElBQUksQ0FBQy9JLENBQXZCLEdBQTJCK0ksSUFBSSxDQUFDN0ksQ0FBTCxHQUFTLENBQXBDLEdBQXdDOE8sSUFGMUM7QUFJQTdHLE1BQUFBLEtBQUssSUFBSSxDQUFUO0FBQ0QsS0FuQkQ7O0FBcUJBLFNBQUssSUFBSTBHLENBQUMsR0FBRzFHLEtBQWIsRUFBb0IwRyxDQUFDLEdBQUcsS0FBS25QLGNBQUwsQ0FBb0JnTCxNQUE1QyxFQUFvRG1FLENBQUMsSUFBSSxDQUF6RCxFQUE0RDtBQUMxRCxXQUFLblAsY0FBTCxDQUFvQm1QLENBQXBCLEVBQXVCNU4sSUFBdkIsQ0FBNEJpRSxNQUE1QixHQUFxQyxLQUFyQztBQUNEO0FBQ0YsR0EvNUJNO0FBaTZCUDRKLEVBQUFBLFVBajZCTyxzQkFpNkJJOUUsSUFqNkJKLEVBaTZCVTtBQUNmLFFBQUlBLElBQUksS0FBSyxNQUFiLEVBQXFCLE9BQU8sS0FBSzFLLE1BQUwsQ0FBWW9ILFFBQW5CO0FBQ3JCLFFBQUlzRCxJQUFJLEtBQUssTUFBYixFQUFxQixPQUFPLEtBQUsxSyxNQUFMLENBQVlxSCxRQUFuQjtBQUNyQixRQUFJcUQsSUFBSSxLQUFLLE9BQWIsRUFBc0IsT0FBTyxLQUFLMUssTUFBTCxDQUFZc0gsU0FBbkI7QUFDdEIsUUFBSW9ELElBQUksS0FBSyxNQUFiLEVBQXFCLE9BQU8sSUFBUDtBQUNyQixRQUFJQSxJQUFJLEtBQUssT0FBYixFQUFzQixPQUFPLEtBQUsxSyxNQUFMLENBQVlnSCxTQUFuQjtBQUN0QixXQUFPLEtBQUtoSCxNQUFMLENBQVk2RyxTQUFuQjtBQUNELEdBeDZCTTtBQTA2QlA0SSxFQUFBQSxnQkExNkJPLDRCQTA2QlU1RyxLQTE2QlYsRUEwNkJpQnJELEtBMTZCakIsRUEwNkJ3Qm9LLE1BMTZCeEIsRUEwNkJnQ0MsTUExNkJoQyxFQTA2QndDbFAsQ0ExNkJ4QyxFQTA2QjJDQyxDQTE2QjNDLEVBMDZCOEM7QUFDbkQsV0FBTyxLQUFLVCxZQUFMLENBQWtCaUwsTUFBbEIsSUFBNEJ2QyxLQUFuQyxFQUEwQztBQUN4QyxVQUFNL0UsUUFBTSxHQUFHLEtBQUtsQixjQUFMLGtCQUFrQyxLQUFLekMsWUFBTCxDQUFrQmlMLE1BQWxCLEdBQTJCLENBQTdELEdBQWtFLENBQWxFLEVBQXFFLENBQXJFLEVBQXdFLEVBQXhFLEVBQTRFLEVBQTVFLENBQWY7O0FBQ0F0SCxNQUFBQSxRQUFNLENBQUNuQyxJQUFQLENBQVlpRSxNQUFaLEdBQXFCLEtBQXJCO0FBQ0EsV0FBS3pGLFlBQUwsQ0FBa0JpTixJQUFsQixDQUF1QnRKLFFBQXZCO0FBQ0Q7O0FBQ0QsUUFBTUEsTUFBTSxHQUFHLEtBQUszRCxZQUFMLENBQWtCMEksS0FBbEIsQ0FBZjtBQUNBL0UsSUFBQUEsTUFBTSxDQUFDNEIsV0FBUCxHQUFxQkYsS0FBckI7QUFDQTFCLElBQUFBLE1BQU0sQ0FBQ25DLElBQVAsQ0FBWWlFLE1BQVosR0FBcUIsSUFBckI7QUFDQTlCLElBQUFBLE1BQU0sQ0FBQ25DLElBQVAsQ0FBWVcsY0FBWixDQUEyQjNCLENBQTNCLEVBQThCQyxDQUE5QjtBQUNBa0QsSUFBQUEsTUFBTSxDQUFDbkMsSUFBUCxDQUFZa0MsV0FBWixDQUNFK0wsTUFBTSxHQUFHLEtBQUsvUSxNQUFMLEdBQWMsQ0FBdkIsR0FBMkI4QixDQUFDLEdBQUcsQ0FEakMsRUFFRSxLQUFLN0IsTUFBTCxHQUFjLENBQWQsR0FBa0IrUSxNQUFsQixHQUEyQmpQLENBQUMsR0FBRyxDQUZqQztBQUlELEdBeDdCTTtBQTA3QlB5TyxFQUFBQSxnQkExN0JPLDRCQTA3QlV4RyxLQTE3QlYsRUEwN0JpQnJELEtBMTdCakIsRUEwN0J3Qm9LLE1BMTdCeEIsRUEwN0JnQ0MsTUExN0JoQyxFQTA3QndDbFAsQ0ExN0J4QyxFQTA3QjJDQyxDQTE3QjNDLEVBMDdCOEM7QUFDbkQsUUFBSSxDQUFDNEUsS0FBTCxFQUFZOztBQUNaLFdBQU8sS0FBS3RGLFlBQUwsQ0FBa0JrTCxNQUFsQixJQUE0QnZDLEtBQW5DLEVBQTBDO0FBQ3hDLFVBQU0vRSxRQUFNLEdBQUcsS0FBS2xCLGNBQUwsaUJBQWlDLEtBQUsxQyxZQUFMLENBQWtCa0wsTUFBbEIsR0FBMkIsQ0FBNUQsR0FBaUUsQ0FBakUsRUFBb0UsQ0FBcEUsRUFBdUUsRUFBdkUsRUFBMkUsRUFBM0UsQ0FBZjs7QUFDQXRILE1BQUFBLFFBQU0sQ0FBQ25DLElBQVAsQ0FBWWlFLE1BQVosR0FBcUIsS0FBckI7QUFDQSxXQUFLMUYsWUFBTCxDQUFrQmtOLElBQWxCLENBQXVCdEosUUFBdkI7QUFDRDs7QUFDRCxRQUFNQSxNQUFNLEdBQUcsS0FBSzVELFlBQUwsQ0FBa0IySSxLQUFsQixDQUFmO0FBQ0EvRSxJQUFBQSxNQUFNLENBQUM0QixXQUFQLEdBQXFCRixLQUFyQjtBQUNBMUIsSUFBQUEsTUFBTSxDQUFDbkMsSUFBUCxDQUFZaUUsTUFBWixHQUFxQixJQUFyQjtBQUNBOUIsSUFBQUEsTUFBTSxDQUFDbkMsSUFBUCxDQUFZVyxjQUFaLENBQTJCM0IsQ0FBM0IsRUFBOEJDLENBQTlCO0FBQ0FrRCxJQUFBQSxNQUFNLENBQUNuQyxJQUFQLENBQVlrQyxXQUFaLENBQ0UrTCxNQUFNLEdBQUcsS0FBS3pRLE1BQWQsR0FBdUIsS0FBS04sTUFBTCxHQUFjLENBQXJDLEdBQXlDOEIsQ0FBQyxHQUFHLENBRC9DLEVBRUUsS0FBSzdCLE1BQUwsR0FBYyxDQUFkLEdBQWtCK1EsTUFBbEIsR0FBMkJqUCxDQUFDLEdBQUcsQ0FGakM7QUFJRCxHQXo4Qk07QUEyOEJQNkgsRUFBQUEsZ0JBMzhCTyw4QkEyOEJZO0FBQ2pCLFNBQUt2SSxZQUFMLENBQWtCa0ssT0FBbEIsQ0FBMEIsVUFBQ3RHLE1BQUQsRUFBWTtBQUNwQ0EsTUFBQUEsTUFBTSxDQUFDbkMsSUFBUCxDQUFZaUUsTUFBWixHQUFxQixLQUFyQjtBQUNELEtBRkQ7QUFHRCxHQS84Qk07QUFpOUJQa0ksRUFBQUEsZ0JBajlCTyw4QkFpOUJZO0FBQ2pCLFNBQUszTixZQUFMLENBQWtCaUssT0FBbEIsQ0FBMEIsVUFBQ3RHLE1BQUQsRUFBWTtBQUNwQ0EsTUFBQUEsTUFBTSxDQUFDbkMsSUFBUCxDQUFZaUUsTUFBWixHQUFxQixLQUFyQjtBQUNELEtBRkQ7QUFHRCxHQXI5Qk07QUF1OUJQbUksRUFBQUEsa0JBdjlCTyxnQ0F1OUJjO0FBQ25CLFNBQUszTixjQUFMLENBQW9CZ0ssT0FBcEIsQ0FBNEIsVUFBQ3RHLE1BQUQsRUFBWTtBQUN0Q0EsTUFBQUEsTUFBTSxDQUFDbkMsSUFBUCxDQUFZaUUsTUFBWixHQUFxQixLQUFyQjtBQUNELEtBRkQ7QUFHRCxHQTM5Qk07QUE2OUJQd0ksRUFBQUEsY0E3OUJPLDRCQTY5QlU7QUFDZixRQUFJLENBQUMsS0FBS2pMLFVBQVYsRUFBc0I7O0FBQ3RCLFFBQUksQ0FBQyxLQUFLbkQsTUFBTCxDQUFZd0csSUFBYixJQUFxQixDQUFDLEtBQUt3QyxLQUEvQixFQUFzQztBQUNwQyxXQUFLN0YsVUFBTCxDQUFnQnhCLElBQWhCLENBQXFCaUUsTUFBckIsR0FBOEIsS0FBOUI7QUFDQTtBQUNEOztBQUNELFNBQUt6QyxVQUFMLENBQWdCeEIsSUFBaEIsQ0FBcUJpRSxNQUFyQixHQUE4QixJQUE5QjtBQUNBLFNBQUt6QyxVQUFMLENBQWdCeEIsSUFBaEIsQ0FBcUJrQyxXQUFyQixDQUNFLEtBQUttRixLQUFMLENBQVd4QyxJQUFYLENBQWdCL0YsQ0FBaEIsR0FBb0IsS0FBS3RCLE1BQXpCLEdBQWtDLEtBQUtOLE1BQUwsR0FBYyxDQUFoRCxHQUFvRCxFQUR0RCxFQUVFLEtBQUtDLE1BQUwsR0FBYyxDQUFkLEdBQWtCLEtBQUtrSyxLQUFMLENBQVd4QyxJQUFYLENBQWdCOUYsQ0FBbEMsR0FBc0MsR0FGeEM7QUFJQSxTQUFLeUMsVUFBTCxDQUFnQnhCLElBQWhCLENBQXFCVyxjQUFyQixDQUFvQyxFQUFwQyxFQUF3QyxHQUF4QztBQUNELEdBeitCTTtBQTIrQlB3TSxFQUFBQSxrQkEzK0JPLGdDQTIrQmM7QUFDbkIsV0FBTyxLQUFLN08sWUFBTCxDQUFrQm1MLE1BQWxCLEdBQTJCLEtBQUt6QixPQUFMLENBQWF5QixNQUEvQyxFQUF1RDtBQUNyRCxVQUFNdEgsTUFBTSxHQUFHLEtBQUtsQixjQUFMLG1CQUFtQyxLQUFLM0MsWUFBTCxDQUFrQm1MLE1BQWxCLEdBQTJCLENBQTlELEdBQW1FLENBQW5FLEVBQXNFLENBQXRFLEVBQXlFLEVBQXpFLEVBQTZFLEVBQTdFLENBQWY7QUFDQXRILE1BQUFBLE1BQU0sQ0FBQ25DLElBQVAsQ0FBWWlFLE1BQVosR0FBcUIsS0FBckI7QUFDQSxXQUFLM0YsWUFBTCxDQUFrQm1OLElBQWxCLENBQXVCdEosTUFBdkI7QUFDRDtBQUNGLEdBai9CTTtBQW0vQlA0RSxFQUFBQSxnQkFuL0JPLDhCQW0vQlk7QUFDakIsU0FBS3pJLFlBQUwsQ0FBa0JtSyxPQUFsQixDQUEwQixVQUFDdEcsTUFBRCxFQUFZO0FBQ3BDQSxNQUFBQSxNQUFNLENBQUNuQyxJQUFQLENBQVlpRSxNQUFaLEdBQXFCLEtBQXJCO0FBQ0QsS0FGRDtBQUdELEdBdi9CTTtBQXkvQlBnSCxFQUFBQSxHQXovQk8sZUF5L0JIVCxDQXovQkcsRUF5L0JBMkQsQ0F6L0JBLEVBeS9CRztBQUNSLFdBQU8zRCxDQUFDLENBQUMxTCxDQUFGLEdBQU1xUCxDQUFDLENBQUNyUCxDQUFGLEdBQU1xUCxDQUFDLENBQUNuUCxDQUFkLElBQW1Cd0wsQ0FBQyxDQUFDMUwsQ0FBRixHQUFNMEwsQ0FBQyxDQUFDeEwsQ0FBUixHQUFZbVAsQ0FBQyxDQUFDclAsQ0FBakMsSUFBc0MwTCxDQUFDLENBQUN6TCxDQUFGLEdBQU1vUCxDQUFDLENBQUNwUCxDQUFGLEdBQU1vUCxDQUFDLENBQUNsUCxDQUFwRCxJQUF5RHVMLENBQUMsQ0FBQ3pMLENBQUYsR0FBTXlMLENBQUMsQ0FBQ3ZMLENBQVIsR0FBWWtQLENBQUMsQ0FBQ3BQLENBQTlFO0FBQ0QsR0EzL0JNO0FBNi9CUCtMLEVBQUFBLFdBNy9CTyx1QkE2L0JLckgsSUE3L0JMLEVBNi9CVztBQUNoQixRQUFJQSxJQUFKLEVBQVVwSCxFQUFFLENBQUMrUixXQUFILENBQWVDLFVBQWYsQ0FBMEI1SyxJQUExQixFQUFnQyxLQUFoQztBQUNYLEdBLy9CTTtBQWlnQ1BpRyxFQUFBQSxPQWpnQ08sbUJBaWdDQzRFLElBamdDRCxFQWlnQ087QUFDWixRQUFJLENBQUMsS0FBS2pSLElBQUwsQ0FBVWlSLElBQVYsQ0FBTCxFQUFzQixPQUFPLEtBQVA7QUFDdEIsV0FBTyxLQUFLalIsSUFBTCxDQUFVaVIsSUFBVixDQUFQO0FBQ0EsV0FBTyxJQUFQO0FBQ0QsR0FyZ0NNO0FBdWdDUG5PLEVBQUFBLFVBdmdDTyxzQkF1Z0NJb08sS0F2Z0NKLEVBdWdDVztBQUNoQixRQUFNQyxLQUFLLEdBQUcsS0FBS3hPLElBQUwsQ0FBVXlPLG9CQUFWLENBQStCRixLQUFLLENBQUNHLFdBQU4sRUFBL0IsQ0FBZDs7QUFDQSxRQUFJLEtBQUtwUixLQUFMLEtBQWUsTUFBbkIsRUFBMkI7QUFDekIsVUFBSSxLQUFLcVIsYUFBTCxDQUFtQkgsS0FBbkIsRUFBMEIsS0FBSzVQLFdBQUwsQ0FBaUIsQ0FBakIsQ0FBMUIsQ0FBSixFQUFvRCxLQUFLcUksU0FBTCxDQUFlLENBQWY7QUFDcEQsVUFBSSxLQUFLMEgsYUFBTCxDQUFtQkgsS0FBbkIsRUFBMEIsS0FBSzVQLFdBQUwsQ0FBaUIsQ0FBakIsQ0FBMUIsQ0FBSixFQUFvRCxLQUFLb0ksZUFBTDtBQUNwRDtBQUNEOztBQUVELFFBQUksS0FBSzFKLEtBQUwsS0FBZSxRQUFuQixFQUE2QjtBQUMzQixVQUFJLEtBQUtxUixhQUFMLENBQW1CSCxLQUFuQixFQUEwQjtBQUFFMVAsUUFBQUEsQ0FBQyxFQUFFLENBQUMsR0FBTjtBQUFXQyxRQUFBQSxDQUFDLEVBQUUsRUFBZDtBQUFrQkMsUUFBQUEsQ0FBQyxFQUFFLEdBQXJCO0FBQTBCQyxRQUFBQSxDQUFDLEVBQUU7QUFBN0IsT0FBMUIsQ0FBSixFQUFrRSxLQUFLZ0ksU0FBTCxDQUFlLENBQWY7QUFDbEUsVUFBSSxLQUFLMEgsYUFBTCxDQUFtQkgsS0FBbkIsRUFBMEI7QUFBRTFQLFFBQUFBLENBQUMsRUFBRSxHQUFMO0FBQVVDLFFBQUFBLENBQUMsRUFBRSxFQUFiO0FBQWlCQyxRQUFBQSxDQUFDLEVBQUUsR0FBcEI7QUFBeUJDLFFBQUFBLENBQUMsRUFBRTtBQUE1QixPQUExQixDQUFKLEVBQWlFLEtBQUtnSSxTQUFMLENBQWUsQ0FBZjtBQUNsRTtBQUNGLEdBbmhDTTtBQXFoQ1AwSCxFQUFBQSxhQXJoQ08seUJBcWhDT0gsS0FyaENQLEVBcWhDY0ksTUFyaENkLEVBcWhDc0I7QUFDM0IsV0FBT0osS0FBSyxDQUFDMVAsQ0FBTixJQUFXOFAsTUFBTSxDQUFDOVAsQ0FBUCxHQUFXOFAsTUFBTSxDQUFDNVAsQ0FBUCxHQUFXLENBQWpDLElBQ0Z3UCxLQUFLLENBQUMxUCxDQUFOLElBQVc4UCxNQUFNLENBQUM5UCxDQUFQLEdBQVc4UCxNQUFNLENBQUM1UCxDQUFQLEdBQVcsQ0FEL0IsSUFFRndQLEtBQUssQ0FBQ3pQLENBQU4sSUFBVzZQLE1BQU0sQ0FBQzdQLENBQVAsR0FBVzZQLE1BQU0sQ0FBQzNQLENBQVAsR0FBVyxDQUYvQixJQUdGdVAsS0FBSyxDQUFDelAsQ0FBTixJQUFXNlAsTUFBTSxDQUFDN1AsQ0FBUCxHQUFXNlAsTUFBTSxDQUFDM1AsQ0FBUCxHQUFXLENBSHRDO0FBSUQsR0ExaENNO0FBNGhDUFUsRUFBQUEsU0E1aENPLHFCQTRoQ0c0TyxLQTVoQ0gsRUE0aENVO0FBQ2YsU0FBS2xSLElBQUwsQ0FBVWtSLEtBQUssQ0FBQ00sT0FBaEIsSUFBMkIsSUFBM0I7QUFDRCxHQTloQ007QUFnaUNQaFAsRUFBQUEsT0FoaUNPLG1CQWdpQ0MwTyxLQWhpQ0QsRUFnaUNRO0FBQ2IsV0FBTyxLQUFLbFIsSUFBTCxDQUFVa1IsS0FBSyxDQUFDTSxPQUFoQixDQUFQO0FBQ0Q7QUFsaUNNLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gIHByb3BlcnRpZXM6IHtcbiAgICBncmFwaGljczogY2MuR3JhcGhpY3MsXG4gICAgdGl0bGVMYWJlbDogY2MuTGFiZWwsXG4gICAgaW5mb0xhYmVsOiBjYy5MYWJlbCxcbiAgICBodWRMYWJlbDogY2MuTGFiZWwsXG4gICAgYXVkaW9Tb3VyY2U6IGNjLkF1ZGlvU291cmNlLFxuICB9LFxuXG4gIG9uTG9hZCgpIHtcbiAgICB0aGlzLlZJRVdfVyA9IDk2MDtcbiAgICB0aGlzLlZJRVdfSCA9IDU0MDtcbiAgICB0aGlzLkdSQVZJVFkgPSAxNzUwO1xuICAgIHRoaXMua2V5cyA9IHt9O1xuICAgIHRoaXMuc3RhdGUgPSBcIm1lbnVcIjtcbiAgICB0aGlzLmxldmVsSW5kZXggPSAwO1xuICAgIHRoaXMuY2FtZXJhID0gMDtcbiAgICB0aGlzLnNjb3JlID0gMDtcbiAgICB0aGlzLmxpdmVzID0gMztcbiAgICB0aGlzLnRpbWVyID0gMTIwO1xuICAgIHRoaXMubWVzc2FnZSA9IFwiXCI7XG4gICAgdGhpcy5iZ21DbGlwID0gbnVsbDtcbiAgICB0aGlzLmp1bXBDbGlwID0gbnVsbDtcbiAgICB0aGlzLnN0b21wQ2xpcCA9IG51bGw7XG4gICAgdGhpcy5odXJ0Q2xpcCA9IG51bGw7XG4gICAgdGhpcy5wb3dlckNsaXAgPSBudWxsO1xuICAgIHRoaXMuY29pbkNsaXAgPSBudWxsO1xuICAgIHRoaXMuY2xlYXJDbGlwID0gbnVsbDtcbiAgICB0aGlzLmdhbWVPdmVyQ2xpcCA9IG51bGw7XG4gICAgdGhpcy5mcmFtZXMgPSB7fTtcbiAgICB0aGlzLmVuZW15U3ByaXRlcyA9IFtdO1xuICAgIHRoaXMuYmxvY2tTcHJpdGVzID0gW107XG4gICAgdGhpcy5kZWNvclNwcml0ZXMgPSBbXTtcbiAgICB0aGlzLnBvd2VydXBTcHJpdGVzID0gW107XG4gICAgdGhpcy51c2VUaWxlU3ByaXRlcyA9IHRydWU7XG4gICAgdGhpcy5odWRJY29uU3ByaXRlcyA9IFtdO1xuICAgIHRoaXMubWVudUJ1dHRvbnMgPSBbXG4gICAgICB7IGlkOiBcInN0YXJ0XCIsIHg6IC0xNDUsIHk6IC0zNiwgdzogMjMwLCBoOiA1OCB9LFxuICAgICAgeyBpZDogXCJsZXZlbHNcIiwgeDogMTQ1LCB5OiAtMzYsIHc6IDIzMCwgaDogNTggfSxcbiAgICBdO1xuXG4gICAgdGhpcy5lbnN1cmVTY2VuZU5vZGVzKCk7XG4gICAgdGhpcy5sb2FkQXVkaW8oKTtcbiAgICB0aGlzLmxvYWRJbWFnZUFzc2V0cygpO1xuICAgIHRoaXMuc2hvd01lbnUoKTtcblxuICAgIGNjLnN5c3RlbUV2ZW50Lm9uKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfRE9XTiwgdGhpcy5vbktleURvd24sIHRoaXMpO1xuICAgIGNjLnN5c3RlbUV2ZW50Lm9uKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfVVAsIHRoaXMub25LZXlVcCwgdGhpcyk7XG4gIH0sXG5cbiAgb25EZXN0cm95KCkge1xuICAgIGNjLnN5c3RlbUV2ZW50Lm9mZihjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX0RPV04sIHRoaXMub25LZXlEb3duLCB0aGlzKTtcbiAgICBjYy5zeXN0ZW1FdmVudC5vZmYoY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9VUCwgdGhpcy5vbktleVVwLCB0aGlzKTtcbiAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5vblRvdWNoRW5kLCB0aGlzKTtcbiAgfSxcblxuICB1cGRhdGUoZHQpIHtcbiAgICBkdCA9IE1hdGgubWluKGR0LCAxIC8gMzApO1xuICAgIHRoaXMuaGFuZGxlSG90a2V5cygpO1xuICAgIGlmICh0aGlzLnN0YXRlID09PSBcInBsYXlpbmdcIikgdGhpcy5zdGVwR2FtZShkdCk7XG4gICAgdGhpcy5kcmF3KCk7XG4gIH0sXG5cbiAgZW5zdXJlU2NlbmVOb2RlcygpIHtcbiAgICB0aGlzLm5vZGUuc2V0Q29udGVudFNpemUodGhpcy5WSUVXX1csIHRoaXMuVklFV19IKTtcblxuICAgIGlmICghdGhpcy5ncmFwaGljcykge1xuICAgICAgY29uc3QgZHJhd05vZGUgPSBuZXcgY2MuTm9kZShcIkdhbWVHcmFwaGljc1wiKTtcbiAgICAgIGRyYXdOb2RlLnBhcmVudCA9IHRoaXMubm9kZTtcbiAgICAgIHRoaXMuZ3JhcGhpY3MgPSBkcmF3Tm9kZS5hZGRDb21wb25lbnQoY2MuR3JhcGhpY3MpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuaW1hZ2VMYXllcikge1xuICAgICAgdGhpcy5pbWFnZUxheWVyID0gbmV3IGNjLk5vZGUoXCJJbWFnZUxheWVyXCIpO1xuICAgICAgdGhpcy5pbWFnZUxheWVyLnBhcmVudCA9IHRoaXMubm9kZTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLm1lbnVCZ1Nwcml0ZSkgdGhpcy5tZW51QmdTcHJpdGUgPSB0aGlzLm1ha2VTcHJpdGVOb2RlKFwiTWVudUJhY2tncm91bmRcIiwgMCwgNiwgNjQwLCAzNjMpO1xuICAgIGlmICghdGhpcy50aXRsZVNwcml0ZSkgdGhpcy50aXRsZVNwcml0ZSA9IHRoaXMubWFrZVNwcml0ZU5vZGUoXCJUaXRsZUltYWdlXCIsIDAsIDE1NiwgMzYwLCAxNDkpO1xuICAgIGlmICghdGhpcy5ibHVlQnV0dG9uU3ByaXRlKSB0aGlzLmJsdWVCdXR0b25TcHJpdGUgPSB0aGlzLm1ha2VTcHJpdGVOb2RlKFwiQmx1ZUJ1dHRvblwiLCAtMTQ1LCAtMzYsIDIzMCwgNTgpO1xuICAgIGlmICghdGhpcy5vcmFuZ2VCdXR0b25TcHJpdGUpIHRoaXMub3JhbmdlQnV0dG9uU3ByaXRlID0gdGhpcy5tYWtlU3ByaXRlTm9kZShcIk9yYW5nZUJ1dHRvblwiLCAxNDUsIC0zNiwgMjMwLCA1OCk7XG4gICAgaWYgKCF0aGlzLnBsYXllclNwcml0ZSkgdGhpcy5wbGF5ZXJTcHJpdGUgPSB0aGlzLm1ha2VTcHJpdGVOb2RlKFwiTWFyaW9TcHJpdGVcIiwgMCwgMCwgMzYsIDQyKTtcbiAgICBpZiAoIXRoaXMubWVudU1hcmlvU3ByaXRlKSB0aGlzLm1lbnVNYXJpb1Nwcml0ZSA9IHRoaXMubWFrZVNwcml0ZU5vZGUoXCJNZW51TWFyaW9cIiwgLTMzMCwgLTE0MiwgNDgsIDQ4KTtcbiAgICBpZiAoIXRoaXMubWVudUdvb21iYVNwcml0ZSkgdGhpcy5tZW51R29vbWJhU3ByaXRlID0gdGhpcy5tYWtlU3ByaXRlTm9kZShcIk1lbnVHb29tYmFcIiwgMzI2LCAtMTUyLCA0OCwgNDgpO1xuICAgIGlmICghdGhpcy5mbGFnU3ByaXRlKSB0aGlzLmZsYWdTcHJpdGUgPSB0aGlzLm1ha2VTcHJpdGVOb2RlKFwiRmxhZ1Nwcml0ZVwiLCAwLCAwLCA1OCwgMjIwKTtcbiAgICBpZiAoIXRoaXMubGlmZUljb24pIHRoaXMubGlmZUljb24gPSB0aGlzLm1ha2VTcHJpdGVOb2RlKFwiTGlmZUljb25cIiwgLTM1MCwgMjQ4LCAzOSwgMjEpO1xuICAgIGlmICghdGhpcy53b3JsZEljb24pIHRoaXMud29ybGRJY29uID0gdGhpcy5tYWtlU3ByaXRlTm9kZShcIldvcmxkSWNvblwiLCAxMzIsIDI0OCwgODYsIDE2KTtcbiAgICBpZiAoIXRoaXMudGltZXJJY29uKSB0aGlzLnRpbWVySWNvbiA9IHRoaXMubWFrZVNwcml0ZU5vZGUoXCJUaW1lckljb25cIiwgMzEwLCAyNDgsIDI4LCAzMik7XG4gICAgaWYgKCF0aGlzLnRpdGxlTGFiZWwpIHRoaXMudGl0bGVMYWJlbCA9IHRoaXMubWFrZUxhYmVsKFwiVGl0bGVcIiwgNDAsIDIxMCwgNjQpO1xuICAgIGlmICghdGhpcy5pbmZvTGFiZWwpIHRoaXMuaW5mb0xhYmVsID0gdGhpcy5tYWtlTGFiZWwoXCJJbmZvXCIsIDI4LCAxNDAsIDI0KTtcbiAgICBpZiAoIXRoaXMuaHVkTGFiZWwpIHRoaXMuaHVkTGFiZWwgPSB0aGlzLm1ha2VMYWJlbChcIkhVRFwiLCAwLCAyNDUsIDI0KTtcbiAgICBpZiAoIXRoaXMuc3RhcnRMYWJlbCkgdGhpcy5zdGFydExhYmVsID0gdGhpcy5tYWtlTGFiZWwoXCJTdGFydExhYmVsXCIsIC0xNDUsIC00NiwgMjUpO1xuICAgIGlmICghdGhpcy5sZXZlbExhYmVsKSB0aGlzLmxldmVsTGFiZWwgPSB0aGlzLm1ha2VMYWJlbChcIkxldmVsTGFiZWxcIiwgMTQ1LCAtNDYsIDI1KTtcbiAgICBpZiAoIXRoaXMuYXVkaW9Tb3VyY2UpIHRoaXMuYXVkaW9Tb3VyY2UgPSB0aGlzLm5vZGUuYWRkQ29tcG9uZW50KGNjLkF1ZGlvU291cmNlKTtcbiAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLm9uVG91Y2hFbmQsIHRoaXMpO1xuICB9LFxuXG4gIG1ha2VTcHJpdGVOb2RlKG5hbWUsIHgsIHksIHcsIGgpIHtcbiAgICBjb25zdCBub2RlID0gbmV3IGNjLk5vZGUobmFtZSk7XG4gICAgbm9kZS5wYXJlbnQgPSB0aGlzLmltYWdlTGF5ZXIgfHwgdGhpcy5ub2RlO1xuICAgIG5vZGUuekluZGV4ID0gdGhpcy5zcHJpdGVaSW5kZXgobmFtZSk7XG4gICAgbm9kZS5zZXRQb3NpdGlvbih4LCB5KTtcbiAgICBub2RlLnNldENvbnRlbnRTaXplKHcsIGgpO1xuICAgIGNvbnN0IHNwcml0ZSA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgc3ByaXRlLnNpemVNb2RlID0gY2MuU3ByaXRlLlNpemVNb2RlLkNVU1RPTTtcbiAgICByZXR1cm4gc3ByaXRlO1xuICB9LFxuXG4gIHNwcml0ZVpJbmRleChuYW1lKSB7XG4gICAgaWYgKG5hbWUgPT09IFwiTWVudUJhY2tncm91bmRcIikgcmV0dXJuIC00MDtcbiAgICBpZiAobmFtZSA9PT0gXCJUaXRsZUltYWdlXCIgfHwgbmFtZS5pbmRleE9mKFwiQnV0dG9uXCIpID49IDApIHJldHVybiAyMDtcbiAgICBpZiAobmFtZS5pbmRleE9mKFwiRGVjb3JTcHJpdGVcIikgPT09IDApIHJldHVybiAtODtcbiAgICBpZiAobmFtZS5pbmRleE9mKFwiVGlsZVNwcml0ZVwiKSA9PT0gMCkgcmV0dXJuIDA7XG4gICAgaWYgKG5hbWUgPT09IFwiRmxhZ1Nwcml0ZVwiKSByZXR1cm4gNDtcbiAgICBpZiAobmFtZS5pbmRleE9mKFwiUG93ZXJVcFNwcml0ZVwiKSA9PT0gMCkgcmV0dXJuIDY7XG4gICAgaWYgKG5hbWUuaW5kZXhPZihcIkdvb21iYVNwcml0ZVwiKSA9PT0gMCB8fCBuYW1lID09PSBcIk1lbnVHb29tYmFcIikgcmV0dXJuIDg7XG4gICAgaWYgKG5hbWUgPT09IFwiTWFyaW9TcHJpdGVcIiB8fCBuYW1lID09PSBcIk1lbnVNYXJpb1wiKSByZXR1cm4gMTA7XG4gICAgaWYgKG5hbWUuaW5kZXhPZihcIkljb25cIikgPj0gMCkgcmV0dXJuIDMwO1xuICAgIHJldHVybiAxO1xuICB9LFxuXG4gIG1ha2VMYWJlbChuYW1lLCB4LCB5LCBzaXplKSB7XG4gICAgY29uc3Qgbm9kZSA9IG5ldyBjYy5Ob2RlKG5hbWUpO1xuICAgIG5vZGUucGFyZW50ID0gdGhpcy5ub2RlO1xuICAgIG5vZGUuc2V0UG9zaXRpb24oeCwgeSk7XG4gICAgbm9kZS5zZXRDb250ZW50U2l6ZSg5MDAsIHNpemUgKiAzKTtcbiAgICBjb25zdCBsYWJlbCA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLkxhYmVsKTtcbiAgICBsYWJlbC5mb250U2l6ZSA9IHNpemU7XG4gICAgbGFiZWwubGluZUhlaWdodCA9IHNpemUgKyA2O1xuICAgIGxhYmVsLmhvcml6b250YWxBbGlnbiA9IGNjLkxhYmVsLkhvcml6b250YWxBbGlnbi5DRU5URVI7XG4gICAgbGFiZWwudmVydGljYWxBbGlnbiA9IGNjLkxhYmVsLlZlcnRpY2FsQWxpZ24uQ0VOVEVSO1xuICAgIG5vZGUuY29sb3IgPSBjYy5Db2xvci5XSElURTtcbiAgICByZXR1cm4gbGFiZWw7XG4gIH0sXG5cbiAgbG9hZEF1ZGlvKCkge1xuICAgIGNjLnJlc291cmNlcy5sb2FkKFwiQVMyX3NvdXJjZS9hdWRpby9iZ21fMVwiLCBjYy5BdWRpb0NsaXAsIChlcnIsIGNsaXApID0+IHtcbiAgICAgIGlmICghZXJyICYmIGNsaXApIHtcbiAgICAgICAgdGhpcy5iZ21DbGlwID0gY2xpcDtcbiAgICAgICAgdGhpcy5hdWRpb1NvdXJjZS5jbGlwID0gY2xpcDtcbiAgICAgICAgdGhpcy5hdWRpb1NvdXJjZS5sb29wID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjYy5yZXNvdXJjZXMubG9hZChcIkFTMl9zb3VyY2UvYXVkaW8vanVtcFwiLCBjYy5BdWRpb0NsaXAsIChfZXJyLCBjbGlwKSA9PiB7IHRoaXMuanVtcENsaXAgPSBjbGlwOyB9KTtcbiAgICBjYy5yZXNvdXJjZXMubG9hZChcIkFTMl9zb3VyY2UvYXVkaW8vc3RvbXBcIiwgY2MuQXVkaW9DbGlwLCAoX2VyciwgY2xpcCkgPT4geyB0aGlzLnN0b21wQ2xpcCA9IGNsaXA7IH0pO1xuICAgIGNjLnJlc291cmNlcy5sb2FkKFwiQVMyX3NvdXJjZS9hdWRpby9sb3NlT25lTGlmZVwiLCBjYy5BdWRpb0NsaXAsIChfZXJyLCBjbGlwKSA9PiB7IHRoaXMuaHVydENsaXAgPSBjbGlwOyB9KTtcbiAgICBjYy5yZXNvdXJjZXMubG9hZChcIkFTMl9zb3VyY2UvYXVkaW8vUG93ZXJVcFwiLCBjYy5BdWRpb0NsaXAsIChfZXJyLCBjbGlwKSA9PiB7IHRoaXMucG93ZXJDbGlwID0gY2xpcDsgfSk7XG4gICAgY2MucmVzb3VyY2VzLmxvYWQoXCJBUzJfc291cmNlL2F1ZGlvL2NvaW5cIiwgY2MuQXVkaW9DbGlwLCAoX2VyciwgY2xpcCkgPT4geyB0aGlzLmNvaW5DbGlwID0gY2xpcDsgfSk7XG4gICAgY2MucmVzb3VyY2VzLmxvYWQoXCJBUzJfc291cmNlL2F1ZGlvL2xldmVsQ2xlYXJcIiwgY2MuQXVkaW9DbGlwLCAoX2VyciwgY2xpcCkgPT4geyB0aGlzLmNsZWFyQ2xpcCA9IGNsaXA7IH0pO1xuICAgIGNjLnJlc291cmNlcy5sb2FkKFwiQVMyX3NvdXJjZS9hdWRpby9HYW1lIE92ZXJcIiwgY2MuQXVkaW9DbGlwLCAoX2VyciwgY2xpcCkgPT4geyB0aGlzLmdhbWVPdmVyQ2xpcCA9IGNsaXA7IH0pO1xuICB9LFxuXG4gIGxvYWRJbWFnZUFzc2V0cygpIHtcbiAgICB0aGlzLmxvYWRTcHJpdGVGcmFtZShcIkFTMl9zb3VyY2UvcGljdHVyZXMvbWVudV9iZ1wiLCAoZnJhbWUpID0+IHtcbiAgICAgIHRoaXMuZnJhbWVzLm1lbnVCZyA9IGZyYW1lO1xuICAgICAgdGhpcy5tZW51QmdTcHJpdGUuc3ByaXRlRnJhbWUgPSBmcmFtZTtcbiAgICB9KTtcbiAgICB0aGlzLmxvYWRTcHJpdGVGcmFtZShcIkFTMl9zb3VyY2UvcGljdHVyZXMvdGl0bGVfMFwiLCAoZnJhbWUpID0+IHtcbiAgICAgIHRoaXMuZnJhbWVzLnRpdGxlID0gZnJhbWU7XG4gICAgICB0aGlzLnRpdGxlU3ByaXRlLnNwcml0ZUZyYW1lID0gZnJhbWU7XG4gICAgICB0aGlzLnRpdGxlTGFiZWwubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICB9KTtcbiAgICB0aGlzLmxvYWRTcHJpdGVGcmFtZShcIkFTMl9zb3VyY2UvcGljdHVyZXMvYnV0dG9uX2JsdWVcIiwgKGZyYW1lKSA9PiB7XG4gICAgICB0aGlzLmZyYW1lcy5idXR0b25CbHVlID0gZnJhbWU7XG4gICAgICB0aGlzLmJsdWVCdXR0b25TcHJpdGUuc3ByaXRlRnJhbWUgPSBmcmFtZTtcbiAgICB9KTtcbiAgICB0aGlzLmxvYWRTcHJpdGVGcmFtZShcIkFTMl9zb3VyY2UvcGljdHVyZXMvYnV0dG9uX29yYW5nZVwiLCAoZnJhbWUpID0+IHtcbiAgICAgIHRoaXMuZnJhbWVzLmJ1dHRvbk9yYW5nZSA9IGZyYW1lO1xuICAgICAgdGhpcy5vcmFuZ2VCdXR0b25TcHJpdGUuc3ByaXRlRnJhbWUgPSBmcmFtZTtcbiAgICB9KTtcbiAgICB0aGlzLmxvYWRTcHJpdGVBdGxhcyhcIkFTMl9zb3VyY2UvcGxheWVyL21hcmlvX3NtYWxsXCIsIChhdGxhcykgPT4ge1xuICAgICAgY29uc3QgZnJhbWVzID0gW1wibWFyaW9fc21hbGxfMFwiLCBcIm1hcmlvX3NtYWxsXzFcIiwgXCJtYXJpb19zbWFsbF8yXCIsIFwibWFyaW9fc21hbGxfM1wiXVxuICAgICAgICAubWFwKChuYW1lKSA9PiBhdGxhcy5nZXRTcHJpdGVGcmFtZShuYW1lKSlcbiAgICAgICAgLmZpbHRlcigoZnJhbWUpID0+ICEhZnJhbWUpO1xuICAgICAgdGhpcy5mcmFtZXMubWFyaW9TbWFsbEZyYW1lcyA9IGZyYW1lcztcbiAgICAgIHRoaXMuZnJhbWVzLm1hcmlvU21hbGwgPSBmcmFtZXNbMF07XG4gICAgICB0aGlzLnBsYXllclNwcml0ZS5zcHJpdGVGcmFtZSA9IGZyYW1lc1swXTtcbiAgICAgIHRoaXMubWVudU1hcmlvU3ByaXRlLnNwcml0ZUZyYW1lID0gZnJhbWVzWzBdO1xuICAgIH0pO1xuICAgIHRoaXMubG9hZFNwcml0ZUF0bGFzKFwiQVMyX3NvdXJjZS9lbmVtaWVzL0dvb21iYVwiLCAoYXRsYXMpID0+IHtcbiAgICAgIGNvbnN0IGZyYW1lcyA9IFtcIkdvb21iYV8wXCIsIFwiR29vbWJhXzFcIiwgXCJHb29tYmFfMlwiXVxuICAgICAgICAubWFwKChuYW1lKSA9PiBhdGxhcy5nZXRTcHJpdGVGcmFtZShuYW1lKSlcbiAgICAgICAgLmZpbHRlcigoZnJhbWUpID0+ICEhZnJhbWUpO1xuICAgICAgdGhpcy5mcmFtZXMuZ29vbWJhRnJhbWVzID0gZnJhbWVzO1xuICAgICAgdGhpcy5mcmFtZXMuZ29vbWJhID0gZnJhbWVzWzBdO1xuICAgICAgdGhpcy5tZW51R29vbWJhU3ByaXRlLnNwcml0ZUZyYW1lID0gZnJhbWVzWzBdO1xuICAgIH0pO1xuICAgIHRoaXMubG9hZFNwcml0ZUZyYW1lKFwiQVMyX3NvdXJjZS9waWN0dXJlcy9mbGFnXCIsIChmcmFtZSkgPT4ge1xuICAgICAgdGhpcy5mcmFtZXMuZmxhZyA9IGZyYW1lO1xuICAgICAgdGhpcy5mbGFnU3ByaXRlLnNwcml0ZUZyYW1lID0gZnJhbWU7XG4gICAgfSk7XG4gICAgdGhpcy5sb2FkU3ByaXRlRnJhbWUoXCJBUzJfc291cmNlL3BpY3R1cmVzL2xpZmVcIiwgKGZyYW1lKSA9PiB7XG4gICAgICB0aGlzLmZyYW1lcy5saWZlID0gZnJhbWU7XG4gICAgICB0aGlzLmxpZmVJY29uLnNwcml0ZUZyYW1lID0gZnJhbWU7XG4gICAgfSk7XG4gICAgdGhpcy5sb2FkU3ByaXRlRnJhbWUoXCJBUzJfc291cmNlL3BpY3R1cmVzL3dvcmxkXCIsIChmcmFtZSkgPT4ge1xuICAgICAgdGhpcy5mcmFtZXMud29ybGQgPSBmcmFtZTtcbiAgICAgIHRoaXMud29ybGRJY29uLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgfSk7XG4gICAgdGhpcy5sb2FkU3ByaXRlRnJhbWUoXCJBUzJfc291cmNlL3BpY3R1cmVzL3RpbWVyXCIsIChmcmFtZSkgPT4ge1xuICAgICAgdGhpcy5mcmFtZXMudGltZXIgPSBmcmFtZTtcbiAgICAgIHRoaXMudGltZXJJY29uLnNwcml0ZUZyYW1lID0gZnJhbWU7XG4gICAgfSk7XG4gICAgdGhpcy5sb2FkU3ByaXRlQXRsYXMoXCJBUzJfc291cmNlL2VmZmVjdHNfVUlfdGlsZXMvdGlsZXNcIiwgKGF0bGFzKSA9PiB7XG4gICAgICB0aGlzLmZyYW1lcy5ncm91bmRUb3AgPSBhdGxhcy5nZXRTcHJpdGVGcmFtZShcInRpbGVzXzIyN1wiKTtcbiAgICAgIHRoaXMuZnJhbWVzLmdyb3VuZEJvZHkgPSBhdGxhcy5nZXRTcHJpdGVGcmFtZShcInRpbGVzXzIyOVwiKTtcbiAgICAgIHRoaXMuZnJhbWVzLmJyaWNrVGlsZSA9IGF0bGFzLmdldFNwcml0ZUZyYW1lKFwidGlsZXNfMlwiKTtcbiAgICAgIHRoaXMuZnJhbWVzLnF1ZXN0aW9uVGlsZSA9IGF0bGFzLmdldFNwcml0ZUZyYW1lKFwidGlsZXNfMjIwXCIpO1xuICAgICAgdGhpcy5mcmFtZXMudXNlZFRpbGUgPSBhdGxhcy5nZXRTcHJpdGVGcmFtZShcInRpbGVzXzIwM1wiKTtcbiAgICAgIHRoaXMuZnJhbWVzLmNsb3VkVGlsZSA9IG51bGw7XG4gICAgICB0aGlzLmZyYW1lcy5waXBlVG9wID0gYXRsYXMuZ2V0U3ByaXRlRnJhbWUoXCJ0aWxlc18yMVwiKSB8fCBhdGxhcy5nZXRTcHJpdGVGcmFtZShcInRpbGVzXzEwN1wiKTtcbiAgICAgIHRoaXMuZnJhbWVzLnBpcGVCb2R5ID0gYXRsYXMuZ2V0U3ByaXRlRnJhbWUoXCJ0aWxlc18yM1wiKSB8fCBhdGxhcy5nZXRTcHJpdGVGcmFtZShcInRpbGVzXzEwOFwiKTtcbiAgICAgIHRoaXMuZnJhbWVzLndhbGxUaWxlID0gYXRsYXMuZ2V0U3ByaXRlRnJhbWUoXCJ0aWxlc18yXCIpO1xuICAgICAgdGhpcy5mcmFtZXMuaGlsbFRpbGUgPSBhdGxhcy5nZXRTcHJpdGVGcmFtZShcInRpbGVzXzIyNFwiKTtcbiAgICAgIHRoaXMuZnJhbWVzLmJ1c2hUaWxlID0gYXRsYXMuZ2V0U3ByaXRlRnJhbWUoXCJ0aWxlc18yMjVcIikgfHwgYXRsYXMuZ2V0U3ByaXRlRnJhbWUoXCJ0aWxlc18yMjRcIik7XG4gICAgICB0aGlzLmZyYW1lcy5ncmFzc1RpbGUgPSBhdGxhcy5nZXRTcHJpdGVGcmFtZShcInRpbGVzXzEwXCIpIHx8IGF0bGFzLmdldFNwcml0ZUZyYW1lKFwidGlsZXNfMjI3XCIpO1xuICAgICAgdGhpcy5mcmFtZXMuZWRnZVRpbGUgPSBudWxsO1xuICAgIH0pO1xuICAgIHRoaXMubG9hZFNwcml0ZUF0bGFzKFwiQVMyX3NvdXJjZS9lZmZlY3RzX1VJX3RpbGVzL2l0ZW1zXCIsIChhdGxhcykgPT4ge1xuICAgICAgdGhpcy5mcmFtZXMubXVzaHJvb20gPSBhdGxhcy5nZXRTcHJpdGVGcmFtZShcIml0ZW1zXzQ2XCIpO1xuICAgICAgdGhpcy5mcmFtZXMuY29pbiA9IGF0bGFzLmdldFNwcml0ZUZyYW1lKFwiaXRlbXNfMzdcIik7XG4gICAgICB0aGlzLmZyYW1lcy51c2VkVGlsZSA9IGF0bGFzLmdldFNwcml0ZUZyYW1lKFwiaXRlbXNfMTRcIikgfHwgdGhpcy5mcmFtZXMudXNlZFRpbGU7XG4gICAgICB0aGlzLmZyYW1lcy5jbG91ZExlZnQgPSBhdGxhcy5nZXRTcHJpdGVGcmFtZShcIml0ZW1zXzE1XCIpO1xuICAgICAgdGhpcy5mcmFtZXMuY2xvdWRSaWdodCA9IGF0bGFzLmdldFNwcml0ZUZyYW1lKFwiaXRlbXNfMTZcIik7XG4gICAgICB0aGlzLmZyYW1lcy5jbG91ZFRpbGUgPSB0aGlzLmZyYW1lcy5jbG91ZExlZnQgfHwgdGhpcy5mcmFtZXMuY2xvdWRSaWdodCB8fCB0aGlzLmZyYW1lcy5jbG91ZFRpbGU7XG4gICAgfSk7XG4gIH0sXG5cbiAgbG9hZFNwcml0ZUZyYW1lKHBhdGgsIGNhbGxiYWNrKSB7XG4gICAgY2MucmVzb3VyY2VzLmxvYWQocGF0aCwgY2MuU3ByaXRlRnJhbWUsIChlcnIsIGZyYW1lKSA9PiB7XG4gICAgICBpZiAoIWVyciAmJiBmcmFtZSkgY2FsbGJhY2soZnJhbWUpO1xuICAgIH0pO1xuICB9LFxuXG4gIGxvYWRTcHJpdGVBdGxhcyhwYXRoLCBjYWxsYmFjaykge1xuICAgIGNjLnJlc291cmNlcy5sb2FkKHBhdGgsIGNjLlNwcml0ZUF0bGFzLCAoZXJyLCBhdGxhcykgPT4ge1xuICAgICAgaWYgKCFlcnIgJiYgYXRsYXMpIGNhbGxiYWNrKGF0bGFzKTtcbiAgICB9KTtcbiAgfSxcblxuICBsb2FkQXRsYXNGcmFtZShwYXRoLCByZWN0LCBjYWxsYmFjaykge1xuICAgIGNjLnJlc291cmNlcy5sb2FkKHBhdGgsIGNjLlRleHR1cmUyRCwgKGVyciwgdGV4dHVyZSkgPT4ge1xuICAgICAgaWYgKGVyciB8fCAhdGV4dHVyZSkgcmV0dXJuO1xuICAgICAgY2FsbGJhY2sobmV3IGNjLlNwcml0ZUZyYW1lKHRleHR1cmUsIHJlY3QpKTtcbiAgICB9KTtcbiAgfSxcblxuICBsb2FkQXRsYXNGcmFtZXMocGF0aCwgcmVjdHMsIGNhbGxiYWNrKSB7XG4gICAgY2MucmVzb3VyY2VzLmxvYWQocGF0aCwgY2MuVGV4dHVyZTJELCAoZXJyLCB0ZXh0dXJlKSA9PiB7XG4gICAgICBpZiAoZXJyIHx8ICF0ZXh0dXJlKSByZXR1cm47XG4gICAgICBjYWxsYmFjayhyZWN0cy5tYXAoKHJlY3QpID0+IG5ldyBjYy5TcHJpdGVGcmFtZSh0ZXh0dXJlLCByZWN0KSkpO1xuICAgIH0pO1xuICB9LFxuXG4gIHNob3dNZW51KCkge1xuICAgIHRoaXMuc3RhdGUgPSBcIm1lbnVcIjtcbiAgICB0aGlzLm1lc3NhZ2UgPSBcIlwiO1xuICAgIHRoaXMudGl0bGVMYWJlbC5zdHJpbmcgPSBcIldlYiBNYXJpb1wiO1xuICAgIHRoaXMuc2hvd01lbnVJbWFnZXModHJ1ZSk7XG4gICAgdGhpcy50aXRsZVNwcml0ZS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy50aXRsZUxhYmVsLm5vZGUuYWN0aXZlID0gIXRoaXMuZnJhbWVzLnRpdGxlO1xuICAgIHRoaXMubWVudUJnU3ByaXRlLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLm1lbnVCZ1Nwcml0ZS5ub2RlLnNldFBvc2l0aW9uKDAsIDYpO1xuICAgIHRoaXMubWVudUJnU3ByaXRlLm5vZGUuc2V0Q29udGVudFNpemUoNjQwLCAzNjMpO1xuICAgIHRoaXMuYmx1ZUJ1dHRvblNwcml0ZS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5vcmFuZ2VCdXR0b25TcHJpdGUubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMubWVudU1hcmlvU3ByaXRlLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLm1lbnVHb29tYmFTcHJpdGUubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMucGxheWVyU3ByaXRlLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5mbGFnU3ByaXRlLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlSHVkSWNvbnMoKTtcbiAgICB0aGlzLmhpZGVCbG9ja1Nwcml0ZXMoKTtcbiAgICB0aGlzLmhpZGVFbmVteVNwcml0ZXMoKTtcbiAgICB0aGlzLnRpdGxlTGFiZWwubm9kZS5zZXRQb3NpdGlvbigwLCAxNDIpO1xuICAgIHRoaXMudGl0bGVMYWJlbC5mb250U2l6ZSA9IDY4O1xuICAgIHRoaXMudGl0bGVMYWJlbC5saW5lSGVpZ2h0ID0gNzY7XG4gICAgdGhpcy5pbmZvTGFiZWwubm9kZS5zZXRQb3NpdGlvbigwLCAtMTE2KTtcbiAgICB0aGlzLmluZm9MYWJlbC5mb250U2l6ZSA9IDIyO1xuICAgIHRoaXMuaW5mb0xhYmVsLmxpbmVIZWlnaHQgPSAzMDtcbiAgICB0aGlzLmluZm9MYWJlbC5zdHJpbmcgPSBcIk1vdmU6IEEvRCBvciBBcnJvdyBLZXlzICAgIEp1bXA6IFcvU3BhY2UvVXAgICAgUDogUGF1c2VcIjtcbiAgICB0aGlzLmJsdWVCdXR0b25TcHJpdGUubm9kZS5zZXRQb3NpdGlvbigtMTQ1LCAtMzYpO1xuICAgIHRoaXMub3JhbmdlQnV0dG9uU3ByaXRlLm5vZGUuc2V0UG9zaXRpb24oMTQ1LCAtMzYpO1xuICAgIHRoaXMuYmx1ZUJ1dHRvblNwcml0ZS5ub2RlLnNldENvbnRlbnRTaXplKDIzMCwgNTgpO1xuICAgIHRoaXMub3JhbmdlQnV0dG9uU3ByaXRlLm5vZGUuc2V0Q29udGVudFNpemUoMjMwLCA1OCk7XG4gICAgdGhpcy5zdGFydExhYmVsLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLmxldmVsTGFiZWwubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMuc3RhcnRMYWJlbC5ub2RlLnNldFBvc2l0aW9uKC0xNDUsIC00Nik7XG4gICAgdGhpcy5sZXZlbExhYmVsLm5vZGUuc2V0UG9zaXRpb24oMTQ1LCAtNDYpO1xuICAgIHRoaXMuc3RhcnRMYWJlbC5zdHJpbmcgPSBcIlNUQVJUIEdBTUVcIjtcbiAgICB0aGlzLmxldmVsTGFiZWwuc3RyaW5nID0gXCJMRVZFTCBTRUxFQ1RcIjtcbiAgICB0aGlzLmh1ZExhYmVsLnN0cmluZyA9IFwiXCI7XG4gIH0sXG5cbiAgc2hvd0xldmVsU2VsZWN0KCkge1xuICAgIHRoaXMuc3RhdGUgPSBcImxldmVsc1wiO1xuICAgIHRoaXMudGl0bGVMYWJlbC5zdHJpbmcgPSBcIkxldmVsIFNlbGVjdFwiO1xuICAgIHRoaXMuc2hvd01lbnVJbWFnZXModHJ1ZSk7XG4gICAgdGhpcy50aXRsZVNwcml0ZS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMudGl0bGVMYWJlbC5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5tZW51QmdTcHJpdGUubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMubWVudUJnU3ByaXRlLm5vZGUuc2V0UG9zaXRpb24oMCwgNik7XG4gICAgdGhpcy5tZW51QmdTcHJpdGUubm9kZS5zZXRDb250ZW50U2l6ZSg2NDAsIDM2Myk7XG4gICAgdGhpcy5ibHVlQnV0dG9uU3ByaXRlLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLm9yYW5nZUJ1dHRvblNwcml0ZS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5ibHVlQnV0dG9uU3ByaXRlLm5vZGUuc2V0UG9zaXRpb24oLTE1MCwgMTApO1xuICAgIHRoaXMub3JhbmdlQnV0dG9uU3ByaXRlLm5vZGUuc2V0UG9zaXRpb24oMTUwLCAxMCk7XG4gICAgdGhpcy5ibHVlQnV0dG9uU3ByaXRlLm5vZGUuc2V0Q29udGVudFNpemUoMjUwLCA3Mik7XG4gICAgdGhpcy5vcmFuZ2VCdXR0b25TcHJpdGUubm9kZS5zZXRDb250ZW50U2l6ZSgyNTAsIDcyKTtcbiAgICB0aGlzLm1lbnVNYXJpb1Nwcml0ZS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMubWVudUdvb21iYVNwcml0ZS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMucGxheWVyU3ByaXRlLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5mbGFnU3ByaXRlLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5oaWRlSHVkSWNvbnMoKTtcbiAgICB0aGlzLmhpZGVCbG9ja1Nwcml0ZXMoKTtcbiAgICB0aGlzLmhpZGVFbmVteVNwcml0ZXMoKTtcbiAgICB0aGlzLnRpdGxlTGFiZWwubm9kZS5zZXRQb3NpdGlvbigwLCAxNTQpO1xuICAgIHRoaXMudGl0bGVMYWJlbC5mb250U2l6ZSA9IDU2O1xuICAgIHRoaXMuaW5mb0xhYmVsLm5vZGUuc2V0UG9zaXRpb24oMCwgLTEzNik7XG4gICAgdGhpcy5pbmZvTGFiZWwuZm9udFNpemUgPSAyNDtcbiAgICB0aGlzLmluZm9MYWJlbC5saW5lSGVpZ2h0ID0gMzQ7XG4gICAgdGhpcy5pbmZvTGFiZWwuc3RyaW5nID0gXCIxOiBXb3JsZCAxLTEgICAgICAyOiBXb3JsZCAxLTIgICAgICBFU0M6IEJhY2tcIjtcbiAgICB0aGlzLnN0YXJ0TGFiZWwubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMubGV2ZWxMYWJlbC5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5zdGFydExhYmVsLm5vZGUuc2V0UG9zaXRpb24oLTE1MCwgMCk7XG4gICAgdGhpcy5sZXZlbExhYmVsLm5vZGUuc2V0UG9zaXRpb24oMTUwLCAwKTtcbiAgICB0aGlzLnN0YXJ0TGFiZWwuc3RyaW5nID0gXCJXT1JMRCAxLTFcIjtcbiAgICB0aGlzLmxldmVsTGFiZWwuc3RyaW5nID0gXCJXT1JMRCAxLTJcIjtcbiAgICB0aGlzLmh1ZExhYmVsLnN0cmluZyA9IFwiXCI7XG4gIH0sXG5cbiAgc3RhcnRHYW1lKGluZGV4KSB7XG4gICAgY29uc3QgbGV2ZWxzID0gdGhpcy5tYWtlTGV2ZWxzKCk7XG4gICAgdGhpcy5sZXZlbEluZGV4ID0gaW5kZXg7XG4gICAgdGhpcy5sZXZlbCA9IGxldmVsc1tpbmRleF07XG4gICAgdGhpcy5wbGF5ZXIgPSB0aGlzLm1ha2VQbGF5ZXIoKTtcbiAgICB0aGlzLnBsYXllci54ID0gdGhpcy5sZXZlbC5zdGFydC54O1xuICAgIHRoaXMucGxheWVyLnkgPSB0aGlzLmxldmVsLnN0YXJ0Lnk7XG4gICAgdGhpcy5ibG9ja3MgPSB0aGlzLmxldmVsLmJsb2Nrcy5tYXAoKGJsb2NrKSA9PiBPYmplY3QuYXNzaWduKHt9LCBibG9jaykpO1xuICAgIHRoaXMuZGVjb3JhdGlvbnMgPSAodGhpcy5sZXZlbC5kZWNvcmF0aW9ucyB8fCBbXSkubWFwKChpdGVtKSA9PiBPYmplY3QuYXNzaWduKHt9LCBpdGVtKSk7XG4gICAgdGhpcy5wb3dlcnVwcyA9IFtdO1xuICAgIHRoaXMuZW5lbWllcyA9IHRoaXMubGV2ZWwuZW5lbWllcy5tYXAoKGVuZW15KSA9PiAoe1xuICAgICAgeDogZW5lbXkueCxcbiAgICAgIHk6IGVuZW15LnksXG4gICAgICB3OiAzNCxcbiAgICAgIGg6IDMyLFxuICAgICAgdng6IC02NSxcbiAgICAgIHZ5OiAwLFxuICAgICAgYWxpdmU6IHRydWUsXG4gICAgICBzcXVhc2g6IDAsXG4gICAgICBvbkdyb3VuZDogZmFsc2UsXG4gICAgfSkpO1xuICAgIHRoaXMuY2FtZXJhID0gMDtcbiAgICB0aGlzLnNjb3JlID0gMDtcbiAgICB0aGlzLmxpdmVzID0gMztcbiAgICB0aGlzLnRpbWVyID0gMTIwO1xuICAgIHRoaXMubWVzc2FnZSA9IFwiXCI7XG4gICAgdGhpcy5zdGF0ZSA9IFwicGxheWluZ1wiO1xuICAgIHRoaXMuc2hvd01lbnVJbWFnZXMoZmFsc2UpO1xuICAgIHRoaXMubWVudUJnU3ByaXRlLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLm1lbnVCZ1Nwcml0ZS5ub2RlLnNldFBvc2l0aW9uKDAsIDIwKTtcbiAgICB0aGlzLm1lbnVCZ1Nwcml0ZS5ub2RlLnNldENvbnRlbnRTaXplKDk2MCwgNTQ0KTtcbiAgICB0aGlzLnBsYXllclNwcml0ZS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5zaG93SHVkSWNvbnMoKTtcbiAgICB0aGlzLnRpdGxlTGFiZWwubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMudGl0bGVMYWJlbC5zdHJpbmcgPSBcIlwiO1xuICAgIHRoaXMuaW5mb0xhYmVsLnN0cmluZyA9IFwiXCI7XG4gICAgdGhpcy5zdGFydExhYmVsLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5sZXZlbExhYmVsLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5odWRMYWJlbC5ub2RlLnNldFBvc2l0aW9uKDAsIDI0OCk7XG4gICAgdGhpcy5odWRMYWJlbC5mb250U2l6ZSA9IDIyO1xuICAgIHRoaXMuaHVkTGFiZWwubGluZUhlaWdodCA9IDMwO1xuICAgIGlmICh0aGlzLmF1ZGlvU291cmNlICYmIHRoaXMuYmdtQ2xpcCkgdGhpcy5hdWRpb1NvdXJjZS5wbGF5KCk7XG4gIH0sXG5cbiAgc2hvd01lbnVJbWFnZXMoYWN0aXZlKSB7XG4gICAgW1xuICAgICAgdGhpcy5tZW51QmdTcHJpdGUsXG4gICAgICB0aGlzLnRpdGxlU3ByaXRlLFxuICAgICAgdGhpcy5ibHVlQnV0dG9uU3ByaXRlLFxuICAgICAgdGhpcy5vcmFuZ2VCdXR0b25TcHJpdGUsXG4gICAgICB0aGlzLm1lbnVNYXJpb1Nwcml0ZSxcbiAgICAgIHRoaXMubWVudUdvb21iYVNwcml0ZSxcbiAgICBdLmZvckVhY2goKHNwcml0ZSkgPT4ge1xuICAgICAgaWYgKHNwcml0ZSkgc3ByaXRlLm5vZGUuYWN0aXZlID0gYWN0aXZlO1xuICAgIH0pO1xuICB9LFxuXG4gIHNob3dIdWRJY29ucygpIHtcbiAgICB0aGlzLmxpZmVJY29uLm5vZGUuc2V0UG9zaXRpb24oLTM1MCwgMjQ4KTtcbiAgICB0aGlzLndvcmxkSWNvbi5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMudGltZXJJY29uLm5vZGUuc2V0UG9zaXRpb24oMzEwLCAyNDgpO1xuICAgIHRoaXMubGlmZUljb24ubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMudGltZXJJY29uLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgfSxcblxuICBoaWRlSHVkSWNvbnMoKSB7XG4gICAgdGhpcy5saWZlSWNvbi5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMud29ybGRJY29uLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy50aW1lckljb24ubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgfSxcblxuICBtYWtlUGxheWVyKCkge1xuICAgIHJldHVybiB7XG4gICAgICB4OiA5MCxcbiAgICAgIHk6IDI2MCxcbiAgICAgIHc6IDMwLFxuICAgICAgaDogNDIsXG4gICAgICB2eDogMCxcbiAgICAgIHZ5OiAwLFxuICAgICAgb25Hcm91bmQ6IGZhbHNlLFxuICAgICAgYmlnOiBmYWxzZSxcbiAgICAgIGludmluY2libGU6IDAsXG4gICAgICBmYWNpbmc6IDEsXG4gICAgICBhbmltOiAwLFxuICAgIH07XG4gIH0sXG5cbiAgbWFrZUxldmVscygpIHtcbiAgICBjb25zdCBncm91bmQgPSAoeCwgeSwgdywgaCkgPT4gKHsgdHlwZTogXCJncm91bmRcIiwgeCwgeSwgdywgaCB9KTtcbiAgICBjb25zdCBicmljayA9ICh4LCB5LCB3LCBoKSA9PiAoeyB0eXBlOiBcImJyaWNrXCIsIHgsIHksIHcsIGggfSk7XG4gICAgY29uc3Qgd2FsbCA9ICh4LCB5LCB3LCBoKSA9PiAoeyB0eXBlOiBcIndhbGxcIiwgeCwgeSwgdywgaCB9KTtcbiAgICBjb25zdCBwaXBlID0gKHgsIHksIGgpID0+ICh7IHR5cGU6IFwicGlwZVwiLCB4LCB5LCB3OiA3MiwgaCB9KTtcbiAgICBjb25zdCBjbG91ZCA9ICh4LCB5LCB3KSA9PiAoeyB0eXBlOiBcImNsb3VkXCIsIHgsIHksIHcsIGg6IDMwIH0pO1xuICAgIGNvbnN0IGRlY28gPSAodHlwZSwgeCwgeSwgdywgaCwgcGFyYWxsYXgpID0+ICh7IHR5cGUsIHgsIHksIHcsIGgsIHBhcmFsbGF4OiBwYXJhbGxheCB8fCAxIH0pO1xuICAgIGNvbnN0IHF1ZXN0aW9uID0gKHgsIHkpID0+ICh7IHR5cGU6IFwicXVlc3Rpb25cIiwgeCwgeSwgdzogMzYsIGg6IDM2LCB1c2VkOiBmYWxzZSwgYnVtcDogMCB9KTtcblxuICAgIHJldHVybiBbXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiMS0xXCIsXG4gICAgICAgIGxlbmd0aDogNDYwMCxcbiAgICAgICAgc3RhcnQ6IHsgeDogOTAsIHk6IDI2MCB9LFxuICAgICAgICBibG9ja3M6IFtcbiAgICAgICAgICBncm91bmQoMCwgNDY4LCA5MDAsIDcyKSxcbiAgICAgICAgICBncm91bmQoMTAxMCwgNDY4LCA2MjAsIDcyKSxcbiAgICAgICAgICBncm91bmQoMTc2MCwgNDY4LCA3NjAsIDcyKSxcbiAgICAgICAgICBncm91bmQoMjY3MCwgNDY4LCA3NjAsIDcyKSxcbiAgICAgICAgICBncm91bmQoMzU2MCwgNDY4LCAxMDQwLCA3MiksXG5cbiAgICAgICAgICBwaXBlKDYxMCwgMzk2LCA3MiksXG4gICAgICAgICAgcGlwZSgxMzAwLCAzNjAsIDEwOCksXG4gICAgICAgICAgcGlwZSgyOTQwLCAzNjAsIDEwOCksXG4gICAgICAgICAgcGlwZSg0MDQwLCAzMjQsIDE0NCksXG5cbiAgICAgICAgICBicmljaygzODAsIDQzMiwgNzIsIDM2KSxcbiAgICAgICAgICBicmljayg3NjAsIDM5NiwgMTA4LCA3MiksXG4gICAgICAgICAgYnJpY2soMTE2MCwgMzk2LCAxMDgsIDcyKSxcbiAgICAgICAgICBicmljaygxNTYwLCAzNjAsIDE0NCwgMzYpLFxuICAgICAgICAgIGJyaWNrKDE5ODAsIDM5NiwgMTQ0LCA3MiksXG4gICAgICAgICAgYnJpY2soMjIyMCwgMzI0LCAxODAsIDM2KSxcbiAgICAgICAgICBicmljaygzMTgwLCAzOTYsIDEwOCwgNzIpLFxuICAgICAgICAgIHdhbGwoMzQ0MCwgNDMyLCA3MiwgMzYpLFxuICAgICAgICAgIHdhbGwoMzU0OCwgMzk2LCA3MiwgNzIpLFxuICAgICAgICAgIHdhbGwoMzY1NiwgMzYwLCA3MiwgMTA4KSxcbiAgICAgICAgICB3YWxsKDM3NjQsIDMyNCwgNzIsIDE0NCksXG4gICAgICAgICAgYnJpY2soNDE0OCwgMjg4LCAxODAsIDM2KSxcblxuICAgICAgICAgIGNsb3VkKDUwMCwgMzMwLCAxMDgpLFxuICAgICAgICAgIGNsb3VkKDE0NjAsIDI3NiwgMTQ0KSxcbiAgICAgICAgICBjbG91ZCgyNTIwLCAzMTYsIDEwOCksXG4gICAgICAgICAgY2xvdWQoMzg2MCwgMjQ2LCAxNDQpLFxuXG4gICAgICAgICAgcXVlc3Rpb24oNDcyLCAyODYpLFxuICAgICAgICAgIHF1ZXN0aW9uKDkyMCwgMjYwKSxcbiAgICAgICAgICBxdWVzdGlvbigxNTMyLCAxOTApLFxuICAgICAgICAgIHF1ZXN0aW9uKDIzODQsIDIyMCksXG4gICAgICAgICAgcXVlc3Rpb24oMzkyMCwgMTYwKSxcbiAgICAgICAgXSxcbiAgICAgICAgZGVjb3JhdGlvbnM6IFtcbiAgICAgICAgICBkZWNvKFwiaGlsbFwiLCA5MCwgMzgyLCA5NiwgODYsIDAuODIpLFxuICAgICAgICAgIGRlY28oXCJidXNoXCIsIDI1MCwgNDIwLCA2NCwgNDgsIDAuOTUpLFxuICAgICAgICAgIGRlY28oXCJjbG91ZFwiLCA3MjAsIDEyMiwgMTA4LCA0NiwgMC41NSksXG4gICAgICAgICAgZGVjbyhcImVkZ2VcIiwgOTAwLCA0MzAsIDQwLCAzOCwgMSksXG4gICAgICAgICAgZGVjbyhcImhpbGxcIiwgMTA4MCwgMzgyLCAxMTgsIDk2LCAwLjgyKSxcbiAgICAgICAgICBkZWNvKFwiYnVzaFwiLCAxNDUwLCA0MjAsIDcyLCA0OCwgMC45NSksXG4gICAgICAgICAgZGVjbyhcImNsb3VkXCIsIDE4NDAsIDEwOCwgMTQ0LCA0OCwgMC41NSksXG4gICAgICAgICAgZGVjbyhcImhpbGxcIiwgMjE4MCwgMzgyLCAxMjgsIDk2LCAwLjgyKSxcbiAgICAgICAgICBkZWNvKFwiYnVzaFwiLCAyNDAwLCA0MjAsIDg2LCA0OCwgMC45NSksXG4gICAgICAgICAgZGVjbyhcImVkZ2VcIiwgMjUyMCwgNDMwLCA0MCwgMzgsIDEpLFxuICAgICAgICAgIGRlY28oXCJjbG91ZFwiLCAyODIwLCAxNDgsIDEwOCwgNDYsIDAuNTUpLFxuICAgICAgICAgIGRlY28oXCJoaWxsXCIsIDMzNDAsIDM4MiwgMTE2LCA5NiwgMC44MiksXG4gICAgICAgICAgZGVjbyhcImJ1c2hcIiwgMzgyMCwgNDIwLCA4NiwgNDgsIDAuOTUpLFxuICAgICAgICBdLFxuICAgICAgICBlbmVtaWVzOiBbXG4gICAgICAgICAgeyB4OiA4NDAsIHk6IDQyMCB9LFxuICAgICAgICAgIHsgeDogMTcwMCwgeTogNDIwIH0sXG4gICAgICAgICAgeyB4OiAyNTgwLCB5OiA0MjAgfSxcbiAgICAgICAgICB7IHg6IDMzNTAsIHk6IDQyMCB9LFxuICAgICAgICBdLFxuICAgICAgICBmbGFnOiB7IHg6IDQzMDAsIHk6IDI1MiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCIxLTJcIixcbiAgICAgICAgbGVuZ3RoOiA1NDAwLFxuICAgICAgICBzdGFydDogeyB4OiA5MCwgeTogMjYwIH0sXG4gICAgICAgIGJsb2NrczogW1xuICAgICAgICAgIGdyb3VuZCgwLCA0NjgsIDcwMCwgNzIpLFxuICAgICAgICAgIGdyb3VuZCg4MzAsIDQ2OCwgNTYwLCA3MiksXG4gICAgICAgICAgZ3JvdW5kKDE1NTAsIDQ2OCwgNjcwLCA3MiksXG4gICAgICAgICAgZ3JvdW5kKDIzODAsIDQ2OCwgNjIwLCA3MiksXG4gICAgICAgICAgZ3JvdW5kKDMxODAsIDQ2OCwgNzYwLCA3MiksXG4gICAgICAgICAgZ3JvdW5kKDQxNDAsIDQ2OCwgMTI2MCwgNzIpLFxuXG4gICAgICAgICAgcGlwZSg1MjAsIDM5NiwgNzIpLFxuICAgICAgICAgIHBpcGUoMTEwMCwgMzYwLCAxMDgpLFxuICAgICAgICAgIHBpcGUoMTkwMCwgMzI0LCAxNDQpLFxuICAgICAgICAgIHBpcGUoMjc4MCwgMzYwLCAxMDgpLFxuICAgICAgICAgIHBpcGUoNDM4MCwgMzI0LCAxNDQpLFxuXG4gICAgICAgICAgd2FsbCgzOTAsIDQzMiwgNzIsIDM2KSxcbiAgICAgICAgICB3YWxsKDQ5OCwgMzk2LCA3MiwgNzIpLFxuICAgICAgICAgIHdhbGwoOTYwLCAzOTYsIDEwOCwgNzIpLFxuICAgICAgICAgIGJyaWNrKDEyNjAsIDMyNCwgNzIsIDM2KSxcbiAgICAgICAgICBicmljaygxNDg4LCAzMjQsIDEwOCwgMzYpLFxuICAgICAgICAgIGNsb3VkKDE1ODAsIDI3NiwgMTA4KSxcbiAgICAgICAgICB3YWxsKDE3MDAsIDM5NiwgNzIsIDcyKSxcbiAgICAgICAgICB3YWxsKDE4MDgsIDM2MCwgNzIsIDEwOCksXG4gICAgICAgICAgYnJpY2soMjE4MCwgMzI0LCAxODAsIDM2KSxcbiAgICAgICAgICBjbG91ZCgyMzgwLCAyODgsIDEwOCksXG4gICAgICAgICAgY2xvdWQoMjY0MCwgMjYwLCAxMDgpLFxuICAgICAgICAgIHdhbGwoMzAyMCwgNDMyLCA3MiwgMzYpLFxuICAgICAgICAgIHdhbGwoMzEyOCwgMzk2LCA3MiwgNzIpLFxuICAgICAgICAgIHdhbGwoMzIzNiwgMzYwLCA3MiwgMTA4KSxcbiAgICAgICAgICB3YWxsKDMzNDQsIDMyNCwgNzIsIDE0NCksXG4gICAgICAgICAgY2xvdWQoMzU2MCwgMjcwLCAxMDgpLFxuICAgICAgICAgIGNsb3VkKDM4MjAsIDI0NiwgMTA4KSxcbiAgICAgICAgICBicmljayg0MDIwLCAzNjAsIDE0NCwgMzYpLFxuICAgICAgICAgIHdhbGwoNDY4MCwgNDMyLCA3MiwgMzYpLFxuICAgICAgICAgIHdhbGwoNDc4OCwgMzk2LCA3MiwgNzIpLFxuICAgICAgICAgIHdhbGwoNDg5NiwgMzYwLCA3MiwgMTA4KSxcblxuICAgICAgICAgIHF1ZXN0aW9uKDY1MCwgMjYwKSxcbiAgICAgICAgICBxdWVzdGlvbigxMzkyLCAyNDApLFxuICAgICAgICAgIHF1ZXN0aW9uKDIxMjAsIDI0MCksXG4gICAgICAgICAgcXVlc3Rpb24oMjUyMCwgMjI2KSxcbiAgICAgICAgICBxdWVzdGlvbigzNzIwLCAyMzApLFxuICAgICAgICAgIHF1ZXN0aW9uKDQ4MDAsIDI2MCksXG4gICAgICAgIF0sXG4gICAgICAgIGRlY29yYXRpb25zOiBbXG4gICAgICAgICAgZGVjbyhcImhpbGxcIiwgMTIwLCAzODIsIDExMiwgOTIsIDAuODIpLFxuICAgICAgICAgIGRlY28oXCJidXNoXCIsIDMzMCwgNDIwLCA3MiwgNDgsIDAuOTUpLFxuICAgICAgICAgIGRlY28oXCJlZGdlXCIsIDcwMCwgNDMwLCA0MCwgMzgsIDEpLFxuICAgICAgICAgIGRlY28oXCJjbG91ZFwiLCA4NjAsIDEzMCwgMTIwLCA0NiwgMC41NSksXG4gICAgICAgICAgZGVjbyhcImhpbGxcIiwgMTYwMCwgMzgyLCAxMzIsIDk2LCAwLjgyKSxcbiAgICAgICAgICBkZWNvKFwiYnVzaFwiLCAyMDEwLCA0MjAsIDg2LCA0OCwgMC45NSksXG4gICAgICAgICAgZGVjbyhcImVkZ2VcIiwgMjIyMCwgNDMwLCA0MCwgMzgsIDEpLFxuICAgICAgICAgIGRlY28oXCJjbG91ZFwiLCAyMzUwLCAxMDgsIDE0NCwgNDgsIDAuNTUpLFxuICAgICAgICAgIGRlY28oXCJoaWxsXCIsIDMyNTAsIDM4MiwgMTMyLCA5NiwgMC44MiksXG4gICAgICAgICAgZGVjbyhcImJ1c2hcIiwgMzY2MCwgNDIwLCA4NiwgNDgsIDAuOTUpLFxuICAgICAgICAgIGRlY28oXCJlZGdlXCIsIDM5NDAsIDQzMCwgNDAsIDM4LCAxKSxcbiAgICAgICAgICBkZWNvKFwiY2xvdWRcIiwgNDE2MCwgMTM4LCAxMzIsIDQ2LCAwLjU1KSxcbiAgICAgICAgICBkZWNvKFwiaGlsbFwiLCA0NTYwLCAzODIsIDExNiwgOTIsIDAuODIpLFxuICAgICAgICAgIGRlY28oXCJidXNoXCIsIDUwMTAsIDQyMCwgOTIsIDQ4LCAwLjk1KSxcbiAgICAgICAgXSxcbiAgICAgICAgZW5lbWllczogW1xuICAgICAgICAgIHsgeDogMTA0MCwgeTogNDIwIH0sXG4gICAgICAgICAgeyB4OiAxODQwLCB5OiA0MjAgfSxcbiAgICAgICAgICB7IHg6IDI3MjAsIHk6IDQyMCB9LFxuICAgICAgICAgIHsgeDogMzQwMCwgeTogNDIwIH0sXG4gICAgICAgICAgeyB4OiAzODYwLCB5OiA0MjAgfSxcbiAgICAgICAgICB7IHg6IDQ1MjAsIHk6IDQyMCB9LFxuICAgICAgICBdLFxuICAgICAgICBmbGFnOiB7IHg6IDUxMjAsIHk6IDI1MiB9LFxuICAgICAgfSxcbiAgICBdO1xuICB9LFxuXG4gIGhhbmRsZUhvdGtleXMoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUgPT09IFwibWVudVwiKSB7XG4gICAgICBpZiAodGhpcy5jb25zdW1lKGNjLm1hY3JvLktFWS5lbnRlcikpIHRoaXMuc3RhcnRHYW1lKDApO1xuICAgICAgaWYgKHRoaXMuY29uc3VtZShjYy5tYWNyby5LRVkubCkpIHRoaXMuc2hvd0xldmVsU2VsZWN0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhdGUgPT09IFwibGV2ZWxzXCIpIHtcbiAgICAgIGlmICh0aGlzLmNvbnN1bWUoY2MubWFjcm8uS0VZW1wiMVwiXSkpIHRoaXMuc3RhcnRHYW1lKDApO1xuICAgICAgaWYgKHRoaXMuY29uc3VtZShjYy5tYWNyby5LRVlbXCIyXCJdKSkgdGhpcy5zdGFydEdhbWUoMSk7XG4gICAgICBpZiAodGhpcy5jb25zdW1lKGNjLm1hY3JvLktFWS5lc2NhcGUpKSB0aGlzLnNob3dNZW51KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhdGUgPT09IFwicGxheWluZ1wiIHx8IHRoaXMuc3RhdGUgPT09IFwicGF1c2VkXCIpIHtcbiAgICAgIGlmICh0aGlzLmNvbnN1bWUoY2MubWFjcm8uS0VZLnApKSB0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZSA9PT0gXCJwbGF5aW5nXCIgPyBcInBhdXNlZFwiIDogXCJwbGF5aW5nXCI7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29uc3VtZShjYy5tYWNyby5LRVkuZW50ZXIpKSB0aGlzLnNob3dNZW51KCk7XG4gIH0sXG5cbiAgc3RlcEdhbWUoZHQpIHtcbiAgICB0aGlzLnRpbWVyIC09IGR0O1xuICAgIGlmICh0aGlzLnRpbWVyIDw9IDApIHRoaXMuaHVydFBsYXllcigpO1xuICAgIHRoaXMudXBkYXRlUGxheWVyKGR0KTtcbiAgICB0aGlzLnVwZGF0ZUVuZW1pZXMoZHQpO1xuICAgIHRoaXMudXBkYXRlUG93ZXJ1cHMoZHQpO1xuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiB7XG4gICAgICBibG9jay5idW1wID0gTWF0aC5tYXgoMCwgKGJsb2NrLmJ1bXAgfHwgMCkgLSBkdCAqIDgwKTtcbiAgICB9KTtcbiAgICB0aGlzLnVwZGF0ZUh1ZCgpO1xuICB9LFxuXG4gIHVwZGF0ZVBsYXllcihkdCkge1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLmtleXNbY2MubWFjcm8uS0VZLmxlZnRdIHx8IHRoaXMua2V5c1tjYy5tYWNyby5LRVkuYV07XG4gICAgY29uc3QgcmlnaHQgPSB0aGlzLmtleXNbY2MubWFjcm8uS0VZLnJpZ2h0XSB8fCB0aGlzLmtleXNbY2MubWFjcm8uS0VZLmRdO1xuICAgIGNvbnN0IGp1bXAgPSB0aGlzLmtleXNbY2MubWFjcm8uS0VZLnVwXSB8fCB0aGlzLmtleXNbY2MubWFjcm8uS0VZLnddIHx8IHRoaXMua2V5c1tjYy5tYWNyby5LRVkuc3BhY2VdO1xuICAgIHRoaXMucGxheWVyLnZ4ID0gbGVmdCA/IC0yMzUgOiByaWdodCA/IDIzNSA6IDA7XG4gICAgaWYgKGxlZnQpIHRoaXMucGxheWVyLmZhY2luZyA9IC0xO1xuICAgIGlmIChyaWdodCkgdGhpcy5wbGF5ZXIuZmFjaW5nID0gMTtcbiAgICBpZiAoanVtcCAmJiB0aGlzLnBsYXllci5vbkdyb3VuZCkge1xuICAgICAgdGhpcy5wbGF5ZXIudnkgPSB0aGlzLnBsYXllci5iaWcgPyAtNzgwIDogLTcyMDtcbiAgICAgIHRoaXMucGxheU9uZVNob3QodGhpcy5qdW1wQ2xpcCk7XG4gICAgfVxuICAgIHRoaXMucGxheWVyLmFuaW0gKz0gZHQgKiBNYXRoLmFicyh0aGlzLnBsYXllci52eCk7XG4gICAgdGhpcy5wbGF5ZXIuaW52aW5jaWJsZSA9IE1hdGgubWF4KDAsIHRoaXMucGxheWVyLmludmluY2libGUgLSBkdCk7XG4gICAgdGhpcy5tb3ZlQm9keSh0aGlzLnBsYXllciwgZHQsIHRydWUpO1xuICAgIGlmICh0aGlzLnBsYXllci55ID4gNjYwKSB0aGlzLmh1cnRQbGF5ZXIoKTtcbiAgICBpZiAodGhpcy5oaXQodGhpcy5wbGF5ZXIsIHsgeDogdGhpcy5sZXZlbC5mbGFnLngsIHk6IHRoaXMubGV2ZWwuZmxhZy55LCB3OiA0MiwgaDogMjE2IH0pKSB0aGlzLmxldmVsQ2xlYXIoKTtcbiAgICB0aGlzLmNhbWVyYSA9IE1hdGgubWF4KDAsIE1hdGgubWluKHRoaXMubGV2ZWwubGVuZ3RoIC0gdGhpcy5WSUVXX1csIHRoaXMucGxheWVyLnggLSB0aGlzLlZJRVdfVyAqIDAuNDIpKTtcbiAgfSxcblxuICB1cGRhdGVFbmVtaWVzKGR0KSB7XG4gICAgdGhpcy5lbmVtaWVzLmZvckVhY2goKGVuZW15KSA9PiB7XG4gICAgICBpZiAoIWVuZW15LmFsaXZlKSB7XG4gICAgICAgIGVuZW15LnNxdWFzaCAtPSBkdDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5tb3ZlQm9keShlbmVteSwgZHQsIGZhbHNlKTtcbiAgICAgIGlmIChlbmVteS52eCA9PT0gMCkgZW5lbXkudnggPSBNYXRoLnJhbmRvbSgpID4gMC41ID8gNjUgOiAtNjU7XG4gICAgICBpZiAoIXRoaXMuaGl0KHRoaXMucGxheWVyLCBlbmVteSkgfHwgdGhpcy5wbGF5ZXIuaW52aW5jaWJsZSA+IDApIHJldHVybjtcblxuICAgICAgY29uc3Qgc3RvbXAgPSB0aGlzLnBsYXllci52eSA+IDgwICYmIHRoaXMucGxheWVyLnkgKyB0aGlzLnBsYXllci5oIC0gZW5lbXkueSA8IDIwO1xuICAgICAgaWYgKHN0b21wKSB7XG4gICAgICAgIGVuZW15LmFsaXZlID0gZmFsc2U7XG4gICAgICAgIGVuZW15LnNxdWFzaCA9IDAuMzU7XG4gICAgICAgIHRoaXMucGxheWVyLnZ5ID0gLTQzMDtcbiAgICAgICAgdGhpcy5zY29yZSArPSAyMDA7XG4gICAgICAgIHRoaXMucGxheU9uZVNob3QodGhpcy5zdG9tcENsaXApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5odXJ0UGxheWVyKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgbW92ZUJvZHkoYm9keSwgZHQsIGlzUGxheWVyKSB7XG4gICAgYm9keS54ICs9IGJvZHkudnggKiBkdDtcbiAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKChibG9jaykgPT4ge1xuICAgICAgaWYgKCF0aGlzLmhpdChib2R5LCBibG9jaykpIHJldHVybjtcbiAgICAgIGlmIChib2R5LnZ4ID4gMCkgYm9keS54ID0gYmxvY2sueCAtIGJvZHkudztcbiAgICAgIGlmIChib2R5LnZ4IDwgMCkgYm9keS54ID0gYmxvY2sueCArIGJsb2NrLnc7XG4gICAgICBib2R5LnZ4ID0gMDtcbiAgICB9KTtcblxuICAgIGJvZHkudnkgKz0gdGhpcy5HUkFWSVRZICogZHQ7XG4gICAgYm9keS55ICs9IGJvZHkudnkgKiBkdDtcbiAgICBib2R5Lm9uR3JvdW5kID0gZmFsc2U7XG4gICAgdGhpcy5ibG9ja3MuZm9yRWFjaCgoYmxvY2spID0+IHtcbiAgICAgIGlmICghdGhpcy5oaXQoYm9keSwgYmxvY2spKSByZXR1cm47XG4gICAgICBpZiAoYm9keS52eSA+IDApIHtcbiAgICAgICAgYm9keS55ID0gYmxvY2sueSAtIGJvZHkuaDtcbiAgICAgICAgYm9keS52eSA9IDA7XG4gICAgICAgIGJvZHkub25Hcm91bmQgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChib2R5LnZ5IDwgMCkge1xuICAgICAgICBib2R5LnkgPSBibG9jay55ICsgYmxvY2suaDtcbiAgICAgICAgYm9keS52eSA9IDA7XG4gICAgICAgIGlmIChpc1BsYXllciAmJiBibG9jay50eXBlID09PSBcInF1ZXN0aW9uXCIpIHRoaXMudXNlUXVlc3Rpb24oYmxvY2spO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIHVzZVF1ZXN0aW9uKGJsb2NrKSB7XG4gICAgaWYgKGJsb2NrLnVzZWQpIHJldHVybjtcbiAgICBibG9jay51c2VkID0gdHJ1ZTtcbiAgICBibG9jay5idW1wID0gMTI7XG4gICAgdGhpcy5zY29yZSArPSAxMDA7XG4gICAgdGhpcy5zcGF3blBvd2VydXAoYmxvY2spO1xuICAgIHRoaXMucGxheU9uZVNob3QodGhpcy5jb2luQ2xpcCk7XG4gIH0sXG5cbiAgc3Bhd25Qb3dlcnVwKGJsb2NrKSB7XG4gICAgdGhpcy5wb3dlcnVwcy5wdXNoKHtcbiAgICAgIHg6IGJsb2NrLnggKyAyLFxuICAgICAgeTogYmxvY2sueSAtIDQwLFxuICAgICAgdzogMzIsXG4gICAgICBoOiAzMixcbiAgICAgIHZ4OiAtNzUsXG4gICAgICB2eTogMCxcbiAgICAgIG9uR3JvdW5kOiBmYWxzZSxcbiAgICAgIGFsaXZlOiB0cnVlLFxuICAgICAgYm9iOiAwLFxuICAgIH0pO1xuICB9LFxuXG4gIHVwZGF0ZVBvd2VydXBzKGR0KSB7XG4gICAgaWYgKCF0aGlzLnBvd2VydXBzKSByZXR1cm47XG4gICAgdGhpcy5wb3dlcnVwcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpZiAoIWl0ZW0uYWxpdmUpIHJldHVybjtcbiAgICAgIGl0ZW0uYm9iICs9IGR0ICogODtcbiAgICAgIGNvbnN0IG9sZFZ4ID0gaXRlbS52eDtcbiAgICAgIHRoaXMubW92ZUJvZHkoaXRlbSwgZHQsIGZhbHNlKTtcbiAgICAgIGlmIChpdGVtLnZ4ID09PSAwKSBpdGVtLnZ4ID0gb2xkVnggPCAwID8gNzUgOiAtNzU7XG4gICAgICBpZiAoaXRlbS55ID4gNjYwIHx8IGl0ZW0ueCA8IHRoaXMuY2FtZXJhIC0gMjIwKSBpdGVtLmFsaXZlID0gZmFsc2U7XG4gICAgICBjb25zdCBjb2xsZWN0Qm94ID0ge1xuICAgICAgICB4OiBpdGVtLnggLSAxMixcbiAgICAgICAgeTogaXRlbS55IC0gMTgsXG4gICAgICAgIHc6IGl0ZW0udyArIDI0LFxuICAgICAgICBoOiBpdGVtLmggKyAzNixcbiAgICAgIH07XG4gICAgICBpZiAoIXRoaXMuaGl0KHRoaXMucGxheWVyLCBjb2xsZWN0Qm94KSkgcmV0dXJuO1xuICAgICAgaXRlbS5hbGl2ZSA9IGZhbHNlO1xuICAgICAgaWYgKCF0aGlzLnBsYXllci5iaWcpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXIuYmlnID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5wbGF5ZXIuaCA9IDU4O1xuICAgICAgICB0aGlzLnBsYXllci55IC09IDE2O1xuICAgICAgfVxuICAgICAgdGhpcy5zY29yZSArPSA1MDA7XG4gICAgICB0aGlzLnBsYXlPbmVTaG90KHRoaXMucG93ZXJDbGlwKTtcbiAgICB9KTtcbiAgfSxcblxuICBodXJ0UGxheWVyKCkge1xuICAgIHRoaXMubGl2ZXMgLT0gMTtcbiAgICB0aGlzLnBsYXlPbmVTaG90KHRoaXMuaHVydENsaXApO1xuICAgIGlmICh0aGlzLmxpdmVzIDw9IDApIHtcbiAgICAgIHRoaXMuc3RhdGUgPSBcIm92ZXJcIjtcbiAgICAgIHRoaXMubWVzc2FnZSA9IFwiR0FNRSBPVkVSXFxuRU5URVI6IE1lbnVcIjtcbiAgICAgIGlmICh0aGlzLmF1ZGlvU291cmNlKSB0aGlzLmF1ZGlvU291cmNlLnN0b3AoKTtcbiAgICAgIHRoaXMucGxheU9uZVNob3QodGhpcy5nYW1lT3ZlckNsaXApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnBsYXllciA9IHRoaXMubWFrZVBsYXllcigpO1xuICAgIHRoaXMucGxheWVyLnggPSB0aGlzLmxldmVsLnN0YXJ0Lng7XG4gICAgdGhpcy5wbGF5ZXIueSA9IHRoaXMubGV2ZWwuc3RhcnQueTtcbiAgICB0aGlzLnBsYXllci5pbnZpbmNpYmxlID0gMS42O1xuICAgIHRoaXMudGltZXIgPSAxMjA7XG4gIH0sXG5cbiAgbGV2ZWxDbGVhcigpIHtcbiAgICB0aGlzLnN0YXRlID0gXCJjbGVhclwiO1xuICAgIHRoaXMuc2NvcmUgKz0gTWF0aC5tYXgoMCwgTWF0aC5jZWlsKHRoaXMudGltZXIpKSAqIDEwO1xuICAgIHRoaXMubWVzc2FnZSA9IFwiTEVWRUwgQ0xFQVJcXG5FTlRFUjogTWVudVwiO1xuICAgIGlmICh0aGlzLmF1ZGlvU291cmNlKSB0aGlzLmF1ZGlvU291cmNlLnN0b3AoKTtcbiAgICB0aGlzLnBsYXlPbmVTaG90KHRoaXMuY2xlYXJDbGlwKTtcbiAgfSxcblxuICB1cGRhdGVIdWQoKSB7XG4gICAgdGhpcy5odWRMYWJlbC5zdHJpbmcgPSBgJHt0aGlzLmxpdmVzfSAgICAgICAgU0NPUkUgJHtTdHJpbmcodGhpcy5zY29yZSkucGFkU3RhcnQoNiwgXCIwXCIpfSAgICAgICAgV09STEQgJHt0aGlzLmxldmVsLm5hbWV9ICAgICAgICBUSU1FICR7TWF0aC5tYXgoMCwgTWF0aC5jZWlsKHRoaXMudGltZXIpKX1gO1xuICB9LFxuXG4gIGRyYXcoKSB7XG4gICAgY29uc3QgZyA9IHRoaXMuZ3JhcGhpY3M7XG4gICAgaWYgKCFnKSByZXR1cm47XG4gICAgZy5jbGVhcigpO1xuXG4gICAgaWYgKHRoaXMuc3RhdGUgPT09IFwibWVudVwiKSB7XG4gICAgICB0aGlzLmhpZGVCbG9ja1Nwcml0ZXMoKTtcbiAgICAgIHRoaXMuaGlkZURlY29yU3ByaXRlcygpO1xuICAgICAgdGhpcy5oaWRlUG93ZXJ1cFNwcml0ZXMoKTtcbiAgICAgIHRoaXMuZmxhZ1Nwcml0ZS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXRlID09PSBcImxldmVsc1wiKSB7XG4gICAgICB0aGlzLmhpZGVCbG9ja1Nwcml0ZXMoKTtcbiAgICAgIHRoaXMuaGlkZURlY29yU3ByaXRlcygpO1xuICAgICAgdGhpcy5oaWRlUG93ZXJ1cFNwcml0ZXMoKTtcbiAgICAgIHRoaXMuZmxhZ1Nwcml0ZS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc3luY0RlY29yU3ByaXRlcygpO1xuICAgIHRoaXMuc3luY0Jsb2NrU3ByaXRlcygpO1xuICAgIHRoaXMuc3luY1Bvd2VydXBTcHJpdGVzKCk7XG4gICAgdGhpcy5zeW5jR2FtZVNwcml0ZXMoKTtcbiAgICB0aGlzLnN5bmNGbGFnU3ByaXRlKCk7XG5cbiAgICBpZiAodGhpcy5zdGF0ZSA9PT0gXCJwYXVzZWRcIikgdGhpcy5tZXNzYWdlID0gXCJQQVVTRURcIjtcbiAgICB0aGlzLmluZm9MYWJlbC5zdHJpbmcgPSB0aGlzLm1lc3NhZ2U7XG4gIH0sXG5cbiAgc3luY0dhbWVTcHJpdGVzKCkge1xuICAgIGlmICh0aGlzLnBsYXllclNwcml0ZSAmJiB0aGlzLmZyYW1lcy5tYXJpb1NtYWxsICYmIHRoaXMucGxheWVyKSB7XG4gICAgICBjb25zdCB3YWxraW5nID0gdGhpcy5wbGF5ZXIub25Hcm91bmQgJiYgTWF0aC5hYnModGhpcy5wbGF5ZXIudngpID4gMTA7XG4gICAgICBjb25zdCBqdW1waW5nID0gIXRoaXMucGxheWVyLm9uR3JvdW5kO1xuICAgICAgY29uc3QgcGxheWVyRnJhbWVzID0gdGhpcy5mcmFtZXMubWFyaW9TbWFsbEZyYW1lcyB8fCBbdGhpcy5mcmFtZXMubWFyaW9TbWFsbF07XG4gICAgICBjb25zdCBwbGF5ZXJGcmFtZUluZGV4ID0ganVtcGluZ1xuICAgICAgICA/IE1hdGgubWluKDMsIHBsYXllckZyYW1lcy5sZW5ndGggLSAxKVxuICAgICAgICA6IHdhbGtpbmdcbiAgICAgICAgICA/IE1hdGguZmxvb3IodGhpcy5wbGF5ZXIuYW5pbSAvIDkwKSAlIE1hdGgubWluKDMsIHBsYXllckZyYW1lcy5sZW5ndGgpXG4gICAgICAgICAgOiAwO1xuICAgICAgdGhpcy5wbGF5ZXJTcHJpdGUubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgdGhpcy5wbGF5ZXJTcHJpdGUuc3ByaXRlRnJhbWUgPSBwbGF5ZXJGcmFtZXNbcGxheWVyRnJhbWVJbmRleF0gfHwgdGhpcy5mcmFtZXMubWFyaW9TbWFsbDtcbiAgICAgIHRoaXMucGxheWVyU3ByaXRlLm5vZGUuc2V0UG9zaXRpb24oXG4gICAgICAgIHRoaXMucGxheWVyLnggLSB0aGlzLmNhbWVyYSAtIHRoaXMuVklFV19XIC8gMiArIHRoaXMucGxheWVyLncgLyAyLFxuICAgICAgICB0aGlzLlZJRVdfSCAvIDIgLSB0aGlzLnBsYXllci55IC0gdGhpcy5wbGF5ZXIuaCAvIDJcbiAgICAgICk7XG4gICAgICB0aGlzLnBsYXllclNwcml0ZS5ub2RlLnNldFNjYWxlKHRoaXMucGxheWVyLmZhY2luZywgMSk7XG4gICAgICB0aGlzLnBsYXllclNwcml0ZS5ub2RlLnNldENvbnRlbnRTaXplKHRoaXMucGxheWVyLmJpZyA/IDQ2IDogMzQsIHRoaXMucGxheWVyLmJpZyA/IDU4IDogNDIpO1xuICAgICAgdGhpcy5wbGF5ZXJTcHJpdGUubm9kZS5vcGFjaXR5ID0gdGhpcy5wbGF5ZXIuaW52aW5jaWJsZSA+IDAgJiYgTWF0aC5mbG9vcihEYXRlLm5vdygpIC8gOTApICUgMiA9PT0gMCA/IDgwIDogMjU1O1xuICAgIH1cblxuICAgIHRoaXMuZW5zdXJlRW5lbXlTcHJpdGVzKCk7XG4gICAgdGhpcy5lbmVtaWVzLmZvckVhY2goKGVuZW15LCBpbmRleCkgPT4ge1xuICAgICAgY29uc3Qgc3ByaXRlID0gdGhpcy5lbmVteVNwcml0ZXNbaW5kZXhdO1xuICAgICAgaWYgKCFzcHJpdGUpIHJldHVybjtcbiAgICAgIHNwcml0ZS5ub2RlLmFjdGl2ZSA9ICEhdGhpcy5mcmFtZXMuZ29vbWJhICYmIGVuZW15LmFsaXZlO1xuICAgICAgaWYgKCFzcHJpdGUubm9kZS5hY3RpdmUpIHJldHVybjtcbiAgICAgIGNvbnN0IGdvb21iYUZyYW1lcyA9IHRoaXMuZnJhbWVzLmdvb21iYUZyYW1lcyB8fCBbdGhpcy5mcmFtZXMuZ29vbWJhXTtcbiAgICAgIHNwcml0ZS5zcHJpdGVGcmFtZSA9IGdvb21iYUZyYW1lc1tNYXRoLmZsb29yKChEYXRlLm5vdygpIC8gMTgwKSArIGluZGV4KSAlIGdvb21iYUZyYW1lcy5sZW5ndGhdIHx8IHRoaXMuZnJhbWVzLmdvb21iYTtcbiAgICAgIHNwcml0ZS5ub2RlLnNldFBvc2l0aW9uKFxuICAgICAgICBlbmVteS54IC0gdGhpcy5jYW1lcmEgLSB0aGlzLlZJRVdfVyAvIDIgKyBlbmVteS53IC8gMixcbiAgICAgICAgdGhpcy5WSUVXX0ggLyAyIC0gZW5lbXkueSAtIGVuZW15LmggLyAyXG4gICAgICApO1xuICAgICAgc3ByaXRlLm5vZGUuc2V0Q29udGVudFNpemUoNDAsIDQyKTtcbiAgICB9KTtcbiAgfSxcblxuICBzeW5jQmxvY2tTcHJpdGVzKCkge1xuICAgIGlmICghdGhpcy5mcmFtZXMuZ3JvdW5kVG9wIHx8ICF0aGlzLmZyYW1lcy5ncm91bmRCb2R5IHx8ICF0aGlzLmZyYW1lcy5icmlja1RpbGUgfHwgIXRoaXMuZnJhbWVzLnF1ZXN0aW9uVGlsZSkgcmV0dXJuO1xuICAgIGxldCBpbmRleCA9IDA7XG4gICAgdGhpcy5ibG9ja3MuZm9yRWFjaCgoYmxvY2spID0+IHtcbiAgICAgIGNvbnN0IHZpc2libGVYID0gYmxvY2sueCAtIHRoaXMuY2FtZXJhO1xuICAgICAgaWYgKHZpc2libGVYICsgYmxvY2sudyA8IC04MCB8fCB2aXNpYmxlWCA+IHRoaXMuVklFV19XICsgODApIHJldHVybjtcbiAgICAgIGlmIChibG9jay50eXBlID09PSBcImdyb3VuZFwiKSB7XG4gICAgICAgIGNvbnN0IHRpbGVTaXplID0gMzI7XG4gICAgICAgIGNvbnN0IGNvbHMgPSBNYXRoLmNlaWwoYmxvY2sudyAvIHRpbGVTaXplKTtcbiAgICAgICAgY29uc3Qgcm93cyA9IE1hdGgubWF4KDEsIE1hdGguY2VpbChibG9jay5oIC8gdGlsZVNpemUpKTtcbiAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgY29sczsgY29sICs9IDEpIHtcbiAgICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCByb3dzOyByb3cgKz0gMSkge1xuICAgICAgICAgICAgY29uc3QgZnJhbWUgPSByb3cgPT09IDAgPyB0aGlzLmZyYW1lcy5ncm91bmRUb3AgOiB0aGlzLmZyYW1lcy5ncm91bmRCb2R5O1xuICAgICAgICAgICAgdGhpcy5wbGFjZUJsb2NrU3ByaXRlKGluZGV4LCBmcmFtZSwgYmxvY2sueCArIGNvbCAqIHRpbGVTaXplLCBibG9jay55ICsgcm93ICogdGlsZVNpemUsIHRpbGVTaXplLCB0aWxlU2l6ZSk7XG4gICAgICAgICAgICBpbmRleCArPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChibG9jay50eXBlID09PSBcInBpcGVcIikge1xuICAgICAgICBjb25zdCB0aWxlU2l6ZSA9IDM2O1xuICAgICAgICBjb25zdCBjb2xzID0gTWF0aC5tYXgoMSwgTWF0aC5jZWlsKGJsb2NrLncgLyB0aWxlU2l6ZSkpO1xuICAgICAgICBjb25zdCByb3dzID0gTWF0aC5tYXgoMSwgTWF0aC5jZWlsKGJsb2NrLmggLyB0aWxlU2l6ZSkpO1xuICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBjb2xzOyBjb2wgKz0gMSkge1xuICAgICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHJvd3M7IHJvdyArPSAxKSB7XG4gICAgICAgICAgICBjb25zdCBmcmFtZSA9IHJvdyA9PT0gMCA/ICh0aGlzLmZyYW1lcy5waXBlVG9wIHx8IHRoaXMuZnJhbWVzLmJyaWNrVGlsZSkgOiAodGhpcy5mcmFtZXMucGlwZUJvZHkgfHwgdGhpcy5mcmFtZXMucGlwZVRvcCB8fCB0aGlzLmZyYW1lcy5icmlja1RpbGUpO1xuICAgICAgICAgICAgdGhpcy5wbGFjZUJsb2NrU3ByaXRlKGluZGV4LCBmcmFtZSwgYmxvY2sueCArIGNvbCAqIHRpbGVTaXplLCBibG9jay55ICsgcm93ICogdGlsZVNpemUsIHRpbGVTaXplLCB0aWxlU2l6ZSk7XG4gICAgICAgICAgICBpbmRleCArPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChibG9jay50eXBlID09PSBcImNsb3VkXCIpIHtcbiAgICAgICAgY29uc3QgdGlsZVNpemUgPSAzNjtcbiAgICAgICAgY29uc3QgY29scyA9IE1hdGgubWF4KDEsIE1hdGguY2VpbChibG9jay53IC8gdGlsZVNpemUpKTtcbiAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgY29sczsgY29sICs9IDEpIHtcbiAgICAgICAgICBjb25zdCBmcmFtZSA9IGNvbCA9PT0gY29scyAtIDFcbiAgICAgICAgICAgID8gKHRoaXMuZnJhbWVzLmNsb3VkUmlnaHQgfHwgdGhpcy5mcmFtZXMuY2xvdWRMZWZ0IHx8IHRoaXMuZnJhbWVzLmJyaWNrVGlsZSlcbiAgICAgICAgICAgIDogKHRoaXMuZnJhbWVzLmNsb3VkTGVmdCB8fCB0aGlzLmZyYW1lcy5jbG91ZFJpZ2h0IHx8IHRoaXMuZnJhbWVzLmJyaWNrVGlsZSk7XG4gICAgICAgICAgdGhpcy5wbGFjZUJsb2NrU3ByaXRlKGluZGV4LCBmcmFtZSwgYmxvY2sueCArIGNvbCAqIHRpbGVTaXplLCBibG9jay55LCB0aWxlU2l6ZSwgYmxvY2suaCk7XG4gICAgICAgICAgaW5kZXggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRpbGVTaXplID0gYmxvY2sudHlwZSA9PT0gXCJxdWVzdGlvblwiID8gMzYgOiAzNjtcbiAgICAgIGNvbnN0IGNvbHMgPSBNYXRoLm1heCgxLCBNYXRoLmNlaWwoYmxvY2sudyAvIHRpbGVTaXplKSk7XG4gICAgICBjb25zdCByb3dzID0gTWF0aC5tYXgoMSwgTWF0aC5jZWlsKGJsb2NrLmggLyB0aWxlU2l6ZSkpO1xuICAgICAgY29uc3QgZnJhbWUgPSBibG9jay50eXBlID09PSBcInF1ZXN0aW9uXCJcbiAgICAgICAgPyAoYmxvY2sudXNlZCA/IHRoaXMuZnJhbWVzLnVzZWRUaWxlIDogdGhpcy5mcmFtZXMucXVlc3Rpb25UaWxlKVxuICAgICAgICA6IChibG9jay50eXBlID09PSBcIndhbGxcIiA/ICh0aGlzLmZyYW1lcy53YWxsVGlsZSB8fCB0aGlzLmZyYW1lcy5icmlja1RpbGUpIDogdGhpcy5mcmFtZXMuYnJpY2tUaWxlKTtcbiAgICAgIGNvbnN0IGJ1bXBZID0gYmxvY2sudHlwZSA9PT0gXCJxdWVzdGlvblwiID8gKGJsb2NrLmJ1bXAgfHwgMCkgOiAwO1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgY29sczsgY29sICs9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgcm93czsgcm93ICs9IDEpIHtcbiAgICAgICAgICB0aGlzLnBsYWNlQmxvY2tTcHJpdGUoaW5kZXgsIGZyYW1lLCBibG9jay54ICsgY29sICogdGlsZVNpemUsIGJsb2NrLnkgKyByb3cgKiB0aWxlU2l6ZSAtIGJ1bXBZLCB0aWxlU2l6ZSwgdGlsZVNpemUpO1xuICAgICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGZvciAobGV0IGkgPSBpbmRleDsgaSA8IHRoaXMuYmxvY2tTcHJpdGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICB0aGlzLmJsb2NrU3ByaXRlc1tpXS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH1cbiAgfSxcblxuICBzeW5jRGVjb3JTcHJpdGVzKCkge1xuICAgIGlmICghdGhpcy5kZWNvcmF0aW9ucykgcmV0dXJuO1xuICAgIGxldCBpbmRleCA9IDA7XG4gICAgdGhpcy5kZWNvcmF0aW9ucy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBwYXJhbGxheCA9IGl0ZW0ucGFyYWxsYXggfHwgMTtcbiAgICAgIGNvbnN0IHggPSBpdGVtLnggLSB0aGlzLmNhbWVyYSAqIHBhcmFsbGF4O1xuICAgICAgaWYgKHggKyBpdGVtLncgPCAtMTIwIHx8IHggPiB0aGlzLlZJRVdfVyArIDEyMCkgcmV0dXJuO1xuICAgICAgY29uc3QgZnJhbWUgPSB0aGlzLmRlY29yRnJhbWUoaXRlbS50eXBlKTtcbiAgICAgIGlmICghZnJhbWUpIHJldHVybjtcbiAgICAgIHRoaXMucGxhY2VEZWNvclNwcml0ZShpbmRleCwgZnJhbWUsIHgsIGl0ZW0ueSwgaXRlbS53LCBpdGVtLmgpO1xuICAgICAgaW5kZXggKz0gMTtcbiAgICB9KTtcblxuICAgIGZvciAobGV0IGkgPSBpbmRleDsgaSA8IHRoaXMuZGVjb3JTcHJpdGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICB0aGlzLmRlY29yU3ByaXRlc1tpXS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH1cbiAgfSxcblxuICBzeW5jUG93ZXJ1cFNwcml0ZXMoKSB7XG4gICAgaWYgKCF0aGlzLnBvd2VydXBzKSByZXR1cm47XG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICB0aGlzLnBvd2VydXBzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGlmICghaXRlbS5hbGl2ZSB8fCAhdGhpcy5mcmFtZXMubXVzaHJvb20pIHJldHVybjtcbiAgICAgIGNvbnN0IHZpc2libGVYID0gaXRlbS54IC0gdGhpcy5jYW1lcmE7XG4gICAgICBpZiAodmlzaWJsZVggKyBpdGVtLncgPCAtODAgfHwgdmlzaWJsZVggPiB0aGlzLlZJRVdfVyArIDgwKSByZXR1cm47XG4gICAgICB3aGlsZSAodGhpcy5wb3dlcnVwU3ByaXRlcy5sZW5ndGggPD0gaW5kZXgpIHtcbiAgICAgICAgY29uc3Qgc3ByaXRlID0gdGhpcy5tYWtlU3ByaXRlTm9kZShgUG93ZXJVcFNwcml0ZSR7dGhpcy5wb3dlcnVwU3ByaXRlcy5sZW5ndGggKyAxfWAsIDAsIDAsIDMyLCAzMik7XG4gICAgICAgIHNwcml0ZS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnBvd2VydXBTcHJpdGVzLnB1c2goc3ByaXRlKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHNwcml0ZSA9IHRoaXMucG93ZXJ1cFNwcml0ZXNbaW5kZXhdO1xuICAgICAgc3ByaXRlLnNwcml0ZUZyYW1lID0gdGhpcy5mcmFtZXMubXVzaHJvb207XG4gICAgICBzcHJpdGUubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgc3ByaXRlLm5vZGUuc2V0Q29udGVudFNpemUoMzIsIDMyKTtcbiAgICAgIGNvbnN0IGJvYlkgPSBNYXRoLnNpbihpdGVtLmJvYiB8fCAwKSAqIDQ7XG4gICAgICBzcHJpdGUubm9kZS5zZXRQb3NpdGlvbihcbiAgICAgICAgaXRlbS54IC0gdGhpcy5jYW1lcmEgLSB0aGlzLlZJRVdfVyAvIDIgKyBpdGVtLncgLyAyLFxuICAgICAgICB0aGlzLlZJRVdfSCAvIDIgLSBpdGVtLnkgLSBpdGVtLmggLyAyICsgYm9iWVxuICAgICAgKTtcbiAgICAgIGluZGV4ICs9IDE7XG4gICAgfSk7XG5cbiAgICBmb3IgKGxldCBpID0gaW5kZXg7IGkgPCB0aGlzLnBvd2VydXBTcHJpdGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICB0aGlzLnBvd2VydXBTcHJpdGVzW2ldLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgfVxuICB9LFxuXG4gIGRlY29yRnJhbWUodHlwZSkge1xuICAgIGlmICh0eXBlID09PSBcImhpbGxcIikgcmV0dXJuIHRoaXMuZnJhbWVzLmhpbGxUaWxlO1xuICAgIGlmICh0eXBlID09PSBcImJ1c2hcIikgcmV0dXJuIHRoaXMuZnJhbWVzLmJ1c2hUaWxlO1xuICAgIGlmICh0eXBlID09PSBcImdyYXNzXCIpIHJldHVybiB0aGlzLmZyYW1lcy5ncmFzc1RpbGU7XG4gICAgaWYgKHR5cGUgPT09IFwiZWRnZVwiKSByZXR1cm4gbnVsbDtcbiAgICBpZiAodHlwZSA9PT0gXCJjbG91ZFwiKSByZXR1cm4gdGhpcy5mcmFtZXMuY2xvdWRUaWxlO1xuICAgIHJldHVybiB0aGlzLmZyYW1lcy5icmlja1RpbGU7XG4gIH0sXG5cbiAgcGxhY2VEZWNvclNwcml0ZShpbmRleCwgZnJhbWUsIHdvcmxkWCwgd29ybGRZLCB3LCBoKSB7XG4gICAgd2hpbGUgKHRoaXMuZGVjb3JTcHJpdGVzLmxlbmd0aCA8PSBpbmRleCkge1xuICAgICAgY29uc3Qgc3ByaXRlID0gdGhpcy5tYWtlU3ByaXRlTm9kZShgRGVjb3JTcHJpdGUke3RoaXMuZGVjb3JTcHJpdGVzLmxlbmd0aCArIDF9YCwgMCwgMCwgNDgsIDQ4KTtcbiAgICAgIHNwcml0ZS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWNvclNwcml0ZXMucHVzaChzcHJpdGUpO1xuICAgIH1cbiAgICBjb25zdCBzcHJpdGUgPSB0aGlzLmRlY29yU3ByaXRlc1tpbmRleF07XG4gICAgc3ByaXRlLnNwcml0ZUZyYW1lID0gZnJhbWU7XG4gICAgc3ByaXRlLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICBzcHJpdGUubm9kZS5zZXRDb250ZW50U2l6ZSh3LCBoKTtcbiAgICBzcHJpdGUubm9kZS5zZXRQb3NpdGlvbihcbiAgICAgIHdvcmxkWCAtIHRoaXMuVklFV19XIC8gMiArIHcgLyAyLFxuICAgICAgdGhpcy5WSUVXX0ggLyAyIC0gd29ybGRZIC0gaCAvIDJcbiAgICApO1xuICB9LFxuXG4gIHBsYWNlQmxvY2tTcHJpdGUoaW5kZXgsIGZyYW1lLCB3b3JsZFgsIHdvcmxkWSwgdywgaCkge1xuICAgIGlmICghZnJhbWUpIHJldHVybjtcbiAgICB3aGlsZSAodGhpcy5ibG9ja1Nwcml0ZXMubGVuZ3RoIDw9IGluZGV4KSB7XG4gICAgICBjb25zdCBzcHJpdGUgPSB0aGlzLm1ha2VTcHJpdGVOb2RlKGBUaWxlU3ByaXRlJHt0aGlzLmJsb2NrU3ByaXRlcy5sZW5ndGggKyAxfWAsIDAsIDAsIDQ4LCA0OCk7XG4gICAgICBzcHJpdGUubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuYmxvY2tTcHJpdGVzLnB1c2goc3ByaXRlKTtcbiAgICB9XG4gICAgY29uc3Qgc3ByaXRlID0gdGhpcy5ibG9ja1Nwcml0ZXNbaW5kZXhdO1xuICAgIHNwcml0ZS5zcHJpdGVGcmFtZSA9IGZyYW1lO1xuICAgIHNwcml0ZS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgc3ByaXRlLm5vZGUuc2V0Q29udGVudFNpemUodywgaCk7XG4gICAgc3ByaXRlLm5vZGUuc2V0UG9zaXRpb24oXG4gICAgICB3b3JsZFggLSB0aGlzLmNhbWVyYSAtIHRoaXMuVklFV19XIC8gMiArIHcgLyAyLFxuICAgICAgdGhpcy5WSUVXX0ggLyAyIC0gd29ybGRZIC0gaCAvIDJcbiAgICApO1xuICB9LFxuXG4gIGhpZGVCbG9ja1Nwcml0ZXMoKSB7XG4gICAgdGhpcy5ibG9ja1Nwcml0ZXMuZm9yRWFjaCgoc3ByaXRlKSA9PiB7XG4gICAgICBzcHJpdGUubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICB9KTtcbiAgfSxcblxuICBoaWRlRGVjb3JTcHJpdGVzKCkge1xuICAgIHRoaXMuZGVjb3JTcHJpdGVzLmZvckVhY2goKHNwcml0ZSkgPT4ge1xuICAgICAgc3ByaXRlLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgfSk7XG4gIH0sXG5cbiAgaGlkZVBvd2VydXBTcHJpdGVzKCkge1xuICAgIHRoaXMucG93ZXJ1cFNwcml0ZXMuZm9yRWFjaCgoc3ByaXRlKSA9PiB7XG4gICAgICBzcHJpdGUubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICB9KTtcbiAgfSxcblxuICBzeW5jRmxhZ1Nwcml0ZSgpIHtcbiAgICBpZiAoIXRoaXMuZmxhZ1Nwcml0ZSkgcmV0dXJuO1xuICAgIGlmICghdGhpcy5mcmFtZXMuZmxhZyB8fCAhdGhpcy5sZXZlbCkge1xuICAgICAgdGhpcy5mbGFnU3ByaXRlLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZmxhZ1Nwcml0ZS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5mbGFnU3ByaXRlLm5vZGUuc2V0UG9zaXRpb24oXG4gICAgICB0aGlzLmxldmVsLmZsYWcueCAtIHRoaXMuY2FtZXJhIC0gdGhpcy5WSUVXX1cgLyAyICsgMjIsXG4gICAgICB0aGlzLlZJRVdfSCAvIDIgLSB0aGlzLmxldmVsLmZsYWcueSAtIDEwOFxuICAgICk7XG4gICAgdGhpcy5mbGFnU3ByaXRlLm5vZGUuc2V0Q29udGVudFNpemUoNTgsIDIyMCk7XG4gIH0sXG5cbiAgZW5zdXJlRW5lbXlTcHJpdGVzKCkge1xuICAgIHdoaWxlICh0aGlzLmVuZW15U3ByaXRlcy5sZW5ndGggPCB0aGlzLmVuZW1pZXMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBzcHJpdGUgPSB0aGlzLm1ha2VTcHJpdGVOb2RlKGBHb29tYmFTcHJpdGUke3RoaXMuZW5lbXlTcHJpdGVzLmxlbmd0aCArIDF9YCwgMCwgMCwgNDAsIDQyKTtcbiAgICAgIHNwcml0ZS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5lbmVteVNwcml0ZXMucHVzaChzcHJpdGUpO1xuICAgIH1cbiAgfSxcblxuICBoaWRlRW5lbXlTcHJpdGVzKCkge1xuICAgIHRoaXMuZW5lbXlTcHJpdGVzLmZvckVhY2goKHNwcml0ZSkgPT4ge1xuICAgICAgc3ByaXRlLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgfSk7XG4gIH0sXG5cbiAgaGl0KGEsIGIpIHtcbiAgICByZXR1cm4gYS54IDwgYi54ICsgYi53ICYmIGEueCArIGEudyA+IGIueCAmJiBhLnkgPCBiLnkgKyBiLmggJiYgYS55ICsgYS5oID4gYi55O1xuICB9LFxuXG4gIHBsYXlPbmVTaG90KGNsaXApIHtcbiAgICBpZiAoY2xpcCkgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdChjbGlwLCBmYWxzZSk7XG4gIH0sXG5cbiAgY29uc3VtZShjb2RlKSB7XG4gICAgaWYgKCF0aGlzLmtleXNbY29kZV0pIHJldHVybiBmYWxzZTtcbiAgICBkZWxldGUgdGhpcy5rZXlzW2NvZGVdO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuXG4gIG9uVG91Y2hFbmQoZXZlbnQpIHtcbiAgICBjb25zdCBwb2ludCA9IHRoaXMubm9kZS5jb252ZXJ0VG9Ob2RlU3BhY2VBUihldmVudC5nZXRMb2NhdGlvbigpKTtcbiAgICBpZiAodGhpcy5zdGF0ZSA9PT0gXCJtZW51XCIpIHtcbiAgICAgIGlmICh0aGlzLnBvaW50SW5CdXR0b24ocG9pbnQsIHRoaXMubWVudUJ1dHRvbnNbMF0pKSB0aGlzLnN0YXJ0R2FtZSgwKTtcbiAgICAgIGlmICh0aGlzLnBvaW50SW5CdXR0b24ocG9pbnQsIHRoaXMubWVudUJ1dHRvbnNbMV0pKSB0aGlzLnNob3dMZXZlbFNlbGVjdCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXRlID09PSBcImxldmVsc1wiKSB7XG4gICAgICBpZiAodGhpcy5wb2ludEluQnV0dG9uKHBvaW50LCB7IHg6IC0xNTAsIHk6IDEwLCB3OiAyNTAsIGg6IDcyIH0pKSB0aGlzLnN0YXJ0R2FtZSgwKTtcbiAgICAgIGlmICh0aGlzLnBvaW50SW5CdXR0b24ocG9pbnQsIHsgeDogMTUwLCB5OiAxMCwgdzogMjUwLCBoOiA3MiB9KSkgdGhpcy5zdGFydEdhbWUoMSk7XG4gICAgfVxuICB9LFxuXG4gIHBvaW50SW5CdXR0b24ocG9pbnQsIGJ1dHRvbikge1xuICAgIHJldHVybiBwb2ludC54ID49IGJ1dHRvbi54IC0gYnV0dG9uLncgLyAyXG4gICAgICAmJiBwb2ludC54IDw9IGJ1dHRvbi54ICsgYnV0dG9uLncgLyAyXG4gICAgICAmJiBwb2ludC55ID49IGJ1dHRvbi55IC0gYnV0dG9uLmggLyAyXG4gICAgICAmJiBwb2ludC55IDw9IGJ1dHRvbi55ICsgYnV0dG9uLmggLyAyO1xuICB9LFxuXG4gIG9uS2V5RG93bihldmVudCkge1xuICAgIHRoaXMua2V5c1tldmVudC5rZXlDb2RlXSA9IHRydWU7XG4gIH0sXG5cbiAgb25LZXlVcChldmVudCkge1xuICAgIGRlbGV0ZSB0aGlzLmtleXNbZXZlbnQua2V5Q29kZV07XG4gIH0sXG59KTtcbiJdfQ==
//------QC-SOURCE-SPLIT------
