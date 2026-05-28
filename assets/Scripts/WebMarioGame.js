cc.Class({
  extends: cc.Component,

  properties: {
    graphics: cc.Graphics,
    titleLabel: cc.Label,
    infoLabel: cc.Label,
    hudLabel: cc.Label,
    audioSource: cc.AudioSource,
  },

  onLoad() {
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
    this.hudLabels = {};
    this.menuButtons = [
      { id: "start", x: -145, y: -36, w: 230, h: 58 },
      { id: "levels", x: 145, y: -36, w: 230, h: 58 },
    ];

    this.ensureSceneNodes();
    this.loadAudio();
    this.loadImageAssets();
    this.showMenu();

    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },

  onDestroy() {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
  },

  update(dt) {
    dt = Math.min(dt, 1 / 30);
    this.handleHotkeys();
    if (this.state === "playing") this.stepGame(dt);
    this.draw();
  },

  ensureSceneNodes() {
    this.node.setContentSize(this.VIEW_W, this.VIEW_H);

    if (!this.graphics) {
      const drawNode = new cc.Node("GameGraphics");
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
    if (!this.hudPanelSprite) this.hudPanelSprite = this.makeSpriteNode("HudPanel", 0, 245, 760, 58);
    if (!this.messagePanelSprite) this.messagePanelSprite = this.makeSpriteNode("MessagePanel", 0, 0, 520, 130);
    if (!this.lifeIcon) this.lifeIcon = this.makeSpriteNode("LifeIcon", -350, 248, 39, 21);
    if (!this.worldIcon) this.worldIcon = this.makeSpriteNode("WorldIcon", 132, 248, 86, 16);
    if (!this.timerIcon) this.timerIcon = this.makeSpriteNode("TimerIcon", 310, 248, 28, 32);
    if (!this.titleLabel) this.titleLabel = this.makeLabel("Title", 40, 210, 64);
    if (!this.superLabel) this.superLabel = this.makeLabel("SuperTitle", 0, 196, 34);
    if (!this.webMarioLabel) this.webMarioLabel = this.makeLabel("WebMarioTitle", 0, 138, 70);
    if (!this.courseLabel) this.courseLabel = this.makeLabel("CourseTitle", 0, 88, 24);
    if (!this.infoLabel) this.infoLabel = this.makeLabel("Info", 28, 140, 24);
    if (!this.resultTitleLabel) this.resultTitleLabel = this.makeLabel("ResultTitle", 0, 56, 34);
    if (!this.resultScoreLabel) this.resultScoreLabel = this.makeLabel("ResultScore", 0, 10, 23);
    if (!this.resultHintLabel) this.resultHintLabel = this.makeLabel("ResultHint", 0, -40, 20);
    if (!this.hudLabel) this.hudLabel = this.makeLabel("HUD", 0, 245, 24);
    if (!this.startLabel) this.startLabel = this.makeLabel("StartLabel", -145, -46, 25);
    if (!this.levelLabel) this.levelLabel = this.makeLabel("LevelLabel", 145, -46, 25);
    this.ensureHudLabels();
    this.styleMenuTitleLabels();
    this.styleResultLabels();
    if (!this.audioSource) this.audioSource = this.node.addComponent(cc.AudioSource);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
  },

  makeSpriteNode(name, x, y, w, h) {
    const node = new cc.Node(name);
    node.parent = this.imageLayer || this.node;
    node.zIndex = this.spriteZIndex(name);
    node.setPosition(x, y);
    node.setContentSize(w, h);
    const sprite = node.addComponent(cc.Sprite);
    sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
    return sprite;
  },

  spriteZIndex(name) {
    if (name === "MenuBackground") return -40;
    if (name === "TitleImage" || name.indexOf("Button") >= 0) return 20;
    if (name === "HudPanel") return 25;
    if (name === "MessagePanel") return 28;
    if (name.indexOf("DecorSprite") === 0) return -8;
    if (name.indexOf("TileSprite") === 0) return 0;
    if (name === "FlagSprite") return 4;
    if (name.indexOf("PowerUpSprite") === 0) return 6;
    if (name.indexOf("GoombaSprite") === 0 || name === "MenuGoomba") return 8;
    if (name === "MarioSprite" || name === "MenuMario") return 10;
    if (name.indexOf("Icon") >= 0) return 30;
    return 1;
  },

  makeLabel(name, x, y, size) {
    const node = new cc.Node(name);
    node.parent = this.node;
    node.zIndex = 50;
    node.setPosition(x, y);
    node.setContentSize(900, size * 3);
    const label = node.addComponent(cc.Label);
    label.fontSize = size;
    label.lineHeight = size + 6;
    label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
    label.verticalAlign = cc.Label.VerticalAlign.CENTER;
    node.color = cc.Color.WHITE;
    return label;
  },

  ensureHudLabels() {
    const specs = [
      ["lives", -278, 247, 24, 96],
      ["score", -88, 247, 24, 230],
      ["world", 166, 247, 24, 140],
      ["time", 318, 247, 24, 100],
    ];
    specs.forEach((spec) => {
      const key = spec[0];
      if (this.hudLabels[key]) return;
      const label = this.makeLabel(`Hud${key}`, spec[1], spec[2], spec[3]);
      label.node.setContentSize(spec[4], 42);
      label.fontSize = spec[3];
      label.lineHeight = spec[3] + 4;
      label.node.active = false;
      this.hudLabels[key] = label;
    });
  },

  styleMenuTitleLabels() {
    const outline = (label, color, width) => {
      let component = label.node.getComponent(cc.LabelOutline);
      if (!component) component = label.node.addComponent(cc.LabelOutline);
      component.color = color;
      component.width = width;
    };
    this.superLabel.node.color = new cc.Color(255, 238, 74);
    this.webMarioLabel.node.color = new cc.Color(255, 74, 62);
    this.courseLabel.node.color = new cc.Color(255, 255, 255);
    this.startLabel.node.color = new cc.Color(38, 64, 86);
    this.levelLabel.node.color = new cc.Color(38, 64, 86);
    outline(this.superLabel, new cc.Color(48, 66, 100), 4);
    outline(this.webMarioLabel, new cc.Color(42, 70, 116), 7);
    outline(this.courseLabel, new cc.Color(38, 64, 86), 3);
    outline(this.startLabel, new cc.Color(255, 255, 255), 2);
    outline(this.levelLabel, new cc.Color(255, 255, 255), 2);
  },

  styleMenuHintLabel() {
    this.infoLabel.node.color = new cc.Color(38, 64, 86);
    let outline = this.infoLabel.node.getComponent(cc.LabelOutline);
    if (!outline) outline = this.infoLabel.node.addComponent(cc.LabelOutline);
    outline.color = new cc.Color(255, 255, 255);
    outline.width = 2;
  },

  styleResultLabels() {
    const labels = [this.resultTitleLabel, this.resultScoreLabel, this.resultHintLabel];
    labels.forEach((label) => {
      if (!label) return;
      label.node.color = new cc.Color(38, 64, 86);
      let outline = label.node.getComponent(cc.LabelOutline);
      if (!outline) outline = label.node.addComponent(cc.LabelOutline);
      outline.color = new cc.Color(255, 255, 255);
      outline.width = 2;
      label.node.active = false;
    });
  },

  loadAudio() {
    cc.resources.load("AS2_source/audio/bgm_1", cc.AudioClip, (err, clip) => {
      if (!err && clip) {
        this.bgmClip = clip;
        this.audioSource.clip = clip;
        this.audioSource.loop = true;
      }
    });
    cc.resources.load("AS2_source/audio/jump", cc.AudioClip, (_err, clip) => { this.jumpClip = clip; });
    cc.resources.load("AS2_source/audio/stomp", cc.AudioClip, (_err, clip) => { this.stompClip = clip; });
    cc.resources.load("AS2_source/audio/loseOneLife", cc.AudioClip, (_err, clip) => { this.hurtClip = clip; });
    cc.resources.load("AS2_source/audio/PowerUp", cc.AudioClip, (_err, clip) => { this.powerClip = clip; });
    cc.resources.load("AS2_source/audio/coin", cc.AudioClip, (_err, clip) => { this.coinClip = clip; });
    cc.resources.load("AS2_source/audio/levelClear", cc.AudioClip, (_err, clip) => { this.clearClip = clip; });
    cc.resources.load("AS2_source/audio/Game Over", cc.AudioClip, (_err, clip) => { this.gameOverClip = clip; });
  },

  loadImageAssets() {
    this.loadSpriteFrame("AS2_source/pictures/menu_bg", (frame) => {
      this.frames.menuBg = frame;
      this.menuBgSprite.spriteFrame = frame;
    });
    this.loadSpriteFrame("AS2_source/pictures/title_0", (frame) => {
      this.frames.title = frame;
      this.titleSprite.spriteFrame = frame;
      this.titleLabel.node.active = false;
    });
    this.loadSpriteFrame("AS2_source/pictures/button_blue", (frame) => {
      this.frames.buttonBlue = frame;
      this.blueButtonSprite.spriteFrame = frame;
    });
    this.loadSpriteFrame("AS2_source/pictures/button_orange", (frame) => {
      this.frames.buttonOrange = frame;
      this.orangeButtonSprite.spriteFrame = frame;
    });
    this.loadSpriteFrame("AS2_source/pictures/text_area_0", (frame) => {
      this.frames.textArea = frame;
      this.hudPanelSprite.spriteFrame = frame;
      this.messagePanelSprite.spriteFrame = frame;
      this.hudPanelSprite.node.active = false;
      this.messagePanelSprite.node.active = false;
    });
    this.loadSpriteAtlas("AS2_source/player/mario_small", (atlas) => {
      const frames = this.collectAtlasFrames(atlas, "mario_small", 36);
      this.frames.marioSmallFrames = frames;
      this.frames.marioSmall = frames[0];
      this.playerSprite.spriteFrame = frames[0];
      this.menuMarioSprite.spriteFrame = frames[0];
    });
    this.loadSpriteAtlas("AS2_source/player/mario_big", (atlas) => {
      const frames = this.collectAtlasFrames(atlas, "mario_big", 45);
      this.frames.marioBigFrames = frames;
      this.frames.marioBig = frames[0];
    });
    this.loadSpriteAtlas("AS2_source/enemies/Goomba", (atlas) => {
      const frames = ["Goomba_0", "Goomba_1", "Goomba_2"]
        .map((name) => atlas.getSpriteFrame(name))
        .filter((frame) => !!frame);
      this.frames.goombaFrames = frames;
      this.frames.goomba = frames[0];
      this.menuGoombaSprite.spriteFrame = frames[0];
    });
    this.loadSpriteFrame("AS2_source/pictures/flag", (frame) => {
      this.frames.flag = frame;
      this.flagSprite.spriteFrame = frame;
    });
    this.loadSpriteFrame("AS2_source/pictures/life", (frame) => {
      this.frames.life = frame;
      this.lifeIcon.spriteFrame = frame;
    });
    this.loadSpriteFrame("AS2_source/pictures/world", (frame) => {
      this.frames.world = frame;
      this.worldIcon.spriteFrame = frame;
      this.worldIcon.node.active = false;
    });
    this.loadSpriteFrame("AS2_source/pictures/timer", (frame) => {
      this.frames.timer = frame;
      this.timerIcon.spriteFrame = frame;
    });
    this.loadSpriteAtlas("AS2_source/effects_UI_tiles/tiles", (atlas) => {
      this.frames.groundTop = atlas.getSpriteFrame("tiles_227");
      this.frames.groundBody = atlas.getSpriteFrame("tiles_229");
      this.frames.brickTile = atlas.getSpriteFrame("tiles_2");
      this.frames.questionTile = atlas.getSpriteFrame("tiles_220");
      this.frames.usedTile = atlas.getSpriteFrame("tiles_203");
      this.frames.cloudTile = null;
      this.frames.pipeTop = atlas.getSpriteFrame("tiles_21") || atlas.getSpriteFrame("tiles_107");
      this.frames.pipeBody = atlas.getSpriteFrame("tiles_23") || atlas.getSpriteFrame("tiles_108");
      this.frames.wallTile = atlas.getSpriteFrame("tiles_2");
      this.frames.hillTile = atlas.getSpriteFrame("tiles_224");
      this.frames.bushTile = atlas.getSpriteFrame("tiles_225") || atlas.getSpriteFrame("tiles_224");
      this.frames.grassTile = atlas.getSpriteFrame("tiles_10") || atlas.getSpriteFrame("tiles_227");
      this.frames.edgeTile = null;
    });
    this.loadSpriteAtlas("AS2_source/effects_UI_tiles/items", (atlas) => {
      this.frames.mushroom = atlas.getSpriteFrame("items_46");
      this.frames.coin = atlas.getSpriteFrame("items_37");
      this.frames.usedTile = atlas.getSpriteFrame("items_14") || this.frames.usedTile;
      this.frames.cloudLeft = atlas.getSpriteFrame("items_15");
      this.frames.cloudRight = atlas.getSpriteFrame("items_16");
      this.frames.cloudTile = this.frames.cloudLeft || this.frames.cloudRight || this.frames.cloudTile;
    });
  },

  loadSpriteFrame(path, callback) {
    cc.resources.load(path, cc.SpriteFrame, (err, frame) => {
      if (!err && frame) callback(frame);
    });
  },

  loadSpriteAtlas(path, callback) {
    cc.resources.load(path, cc.SpriteAtlas, (err, atlas) => {
      if (!err && atlas) callback(atlas);
    });
  },

  collectAtlasFrames(atlas, prefix, maxIndex) {
    const frames = [];
    for (let i = 0; i <= maxIndex; i += 1) {
      const frame = atlas.getSpriteFrame(`${prefix}_${i}`);
      if (frame) frames.push(frame);
    }
    return frames;
  },

  loadAtlasFrame(path, rect, callback) {
    cc.resources.load(path, cc.Texture2D, (err, texture) => {
      if (err || !texture) return;
      callback(new cc.SpriteFrame(texture, rect));
    });
  },

  loadAtlasFrames(path, rects, callback) {
    cc.resources.load(path, cc.Texture2D, (err, texture) => {
      if (err || !texture) return;
      callback(rects.map((rect) => new cc.SpriteFrame(texture, rect)));
    });
  },

  showMenu() {
    this.state = "menu";
    this.message = "";
    this.resultBonus = 0;
    this.hideEditableLevelPrefabs();
    this.titleLabel.string = "Web Mario";
    this.showMenuImages(true);
    this.titleSprite.node.active = false;
    this.titleLabel.node.active = false;
    this.superLabel.node.active = true;
    this.webMarioLabel.node.active = true;
    this.courseLabel.node.active = true;
    this.infoLabel.node.active = true;
    this.menuBgSprite.node.active = true;
    this.menuBgSprite.node.setPosition(0, 6);
    this.menuBgSprite.node.setContentSize(640, 363);
    this.blueButtonSprite.node.active = true;
    this.orangeButtonSprite.node.active = true;
    this.menuMarioSprite.node.active = true;
    this.menuGoombaSprite.node.active = true;
    this.playerSprite.node.active = false;
    this.flagSprite.node.active = false;
    this.hudPanelSprite.node.active = false;
    this.messagePanelSprite.node.active = false;
    this.hideResultLabels();
    this.hideHudIcons();
    this.hideHudLabels();
    this.hideBlockSprites();
    this.hideEnemySprites();
    this.superLabel.node.setPosition(0, 188);
    this.superLabel.fontSize = 34;
    this.superLabel.lineHeight = 42;
    this.superLabel.string = "SUPER";
    this.webMarioLabel.node.setPosition(0, 130);
    this.webMarioLabel.fontSize = 70;
    this.webMarioLabel.lineHeight = 78;
    this.webMarioLabel.string = "WEB MARIO";
    this.courseLabel.node.setPosition(0, 82);
    this.courseLabel.fontSize = 24;
    this.courseLabel.lineHeight = 32;
    this.courseLabel.string = "WORLD 1 ADVENTURE";
    this.infoLabel.node.setPosition(0, -126);
    this.styleMenuHintLabel();
    this.infoLabel.fontSize = 22;
    this.infoLabel.lineHeight = 30;
    this.infoLabel.string = "A/D Move    W/Space Jump    P Pause";
    this.blueButtonSprite.node.setPosition(-145, -36);
    this.orangeButtonSprite.node.setPosition(145, -36);
    this.blueButtonSprite.node.setContentSize(230, 58);
    this.orangeButtonSprite.node.setContentSize(230, 58);
    this.startLabel.node.active = true;
    this.levelLabel.node.active = true;
    this.startLabel.node.setPosition(-145, -38);
    this.levelLabel.node.setPosition(145, -38);
    this.startLabel.fontSize = 23;
    this.levelLabel.fontSize = 23;
    this.startLabel.lineHeight = 28;
    this.levelLabel.lineHeight = 28;
    this.startLabel.string = "START GAME";
    this.levelLabel.string = "LEVEL SELECT";
    this.applyEditableMenuLayout();
    this.hudLabel.string = "";
  },

  applyEditableMenuLayout() {
    const root = this.node.parent && this.node.parent.getChildByName("MenuEditable");
    if (!root) return;

    const direct = (name) => root.getChildByName(name);
    const copyNode = (target, source) => {
      if (!target || !source) return;
      const p = this.editableLocalPosition(root, source);
      target.node.setPosition(p.x, p.y);
      target.node.setContentSize(source.getContentSize());
    };
    const copyLabel = (target, source) => {
      if (!target || !source) return;
      const p = this.editableLocalPosition(root, source);
      const sourceLabel = source.getComponent(cc.Label);
      if (sourceLabel) {
        target.string = sourceLabel.string;
        target.fontSize = sourceLabel.fontSize;
        target.lineHeight = sourceLabel.lineHeight;
      }
      target.node.color = source.color;
      target.node.setPosition(p.x, p.y);
      target.node.setContentSize(source.getContentSize());
    };

    copyNode(this.menuBgSprite, direct("Background"));
    copyLabel(this.superLabel, direct("Title_SUPER"));
    copyLabel(this.webMarioLabel, direct("Title_WEB_MARIO"));
    copyLabel(this.courseLabel, direct("Subtitle_WORLD_1_ADVENTURE"));

    const startButton = direct("StartButton");
    const levelButton = direct("LevelButton");
    copyNode(this.blueButtonSprite, startButton);
    copyNode(this.orangeButtonSprite, levelButton);
    if (startButton) copyLabel(this.startLabel, startButton.getChildByName("Label_START_GAME"));
    if (levelButton) copyLabel(this.levelLabel, levelButton.getChildByName("Label_LEVEL_SELECT"));

    if (startButton) {
      const p = this.editableLocalPosition(root, startButton);
      const size = startButton.getContentSize();
      this.menuButtons[0] = { id: "start", x: p.x, y: p.y, w: size.width, h: size.height };
    }
    if (levelButton) {
      const p = this.editableLocalPosition(root, levelButton);
      const size = levelButton.getContentSize();
      this.menuButtons[1] = { id: "levels", x: p.x, y: p.y, w: size.width, h: size.height };
    }

    root.active = false;
  },

  editableLocalPosition(root, node) {
    let x = 0;
    let y = 0;
    let current = node;
    while (current && current !== root.parent) {
      x += current.x;
      y += current.y;
      if (current === root) break;
      current = current.parent;
    }
    return cc.v2(x, y);
  },

  showLevelSelect() {
    this.state = "levels";
    this.resultBonus = 0;
    this.hideEditableLevelPrefabs();
    this.titleLabel.string = "Level Select";
    this.showMenuImages(true);
    this.titleSprite.node.active = false;
    this.titleLabel.node.active = true;
    this.superLabel.node.active = false;
    this.webMarioLabel.node.active = false;
    this.courseLabel.node.active = false;
    this.infoLabel.node.active = true;
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
    this.hudPanelSprite.node.active = false;
    this.messagePanelSprite.node.active = false;
    this.hideResultLabels();
    this.hideHudIcons();
    this.hideHudLabels();
    this.hideBlockSprites();
    this.hideEnemySprites();
    this.titleLabel.node.setPosition(0, 154);
    this.titleLabel.fontSize = 56;
    this.infoLabel.node.setPosition(0, -136);
    this.styleMenuHintLabel();
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

  startGame(index) {
    const levels = this.makeLevels();
    this.levelIndex = index;
    this.level = this.makeEditableLevel(index, levels[index]) || levels[index];
    this.player = this.makePlayer();
    this.player.x = this.level.start.x;
    this.player.y = this.level.start.y;
    this.blocks = this.level.blocks.map((block) => Object.assign({}, block));
    this.decorations = (this.level.decorations || []).map((item) => Object.assign({}, item));
    this.powerups = [];
    this.enemies = this.level.enemies.map((enemy) => ({
      x: enemy.x,
      y: enemy.y,
      w: 34,
      h: 32,
      vx: -65,
      vy: 0,
      alive: true,
      squash: 0,
      onGround: false,
    }));
    this.camera = 0;
    this.score = 0;
    this.lives = 3;
    this.timer = 120;
    this.resultBonus = 0;
    this.message = "";
    this.state = "playing";
    this.showMenuImages(false);
    this.menuBgSprite.node.active = true;
    this.menuBgSprite.node.setPosition(0, 20);
    this.menuBgSprite.node.setContentSize(960, 544);
    this.playerSprite.node.active = true;
    this.showHudIcons();
    this.showHudLabels();
    this.hudPanelSprite.node.active = true;
    this.hudPanelSprite.node.setPosition(0, 246);
    this.hudPanelSprite.node.setContentSize(760, 58);
    this.messagePanelSprite.node.active = false;
    this.hideResultLabels();
    this.titleLabel.node.active = true;
    this.superLabel.node.active = false;
    this.webMarioLabel.node.active = false;
    this.courseLabel.node.active = false;
    this.titleLabel.string = "";
    this.infoLabel.string = "";
    this.startLabel.node.active = false;
    this.levelLabel.node.active = false;
    this.hudLabel.string = "";
    if (this.audioSource && this.bgmClip) this.audioSource.play();
  },

  makeEditableLevel(index, fallbackLevel) {
    const rootName = `Level${index + 1}Editable`;
    const root = this.node.parent && this.node.parent.getChildByName(rootName);
    if (!root) return null;

    const blocks = [];
    const enemies = [];
    let start = null;
    let flag = null;

    const visit = (node) => {
      const name = node.name || "";
      const rect = this.nodeToWorldRect(root, node);
      if (name.indexOf("Ground_") === 0) blocks.push(Object.assign({ type: "ground" }, rect));
      if (name.indexOf("Pipe_") === 0) blocks.push(Object.assign({ type: "pipe" }, rect));
      if (name.indexOf("Brick_") === 0) blocks.push(Object.assign({ type: "brick" }, rect));
      if (name.indexOf("Wall_") === 0) blocks.push(Object.assign({ type: "wall" }, rect));
      if (name.indexOf("CloudPlatform_") === 0) blocks.push(Object.assign({ type: "cloud" }, rect));
      if (name.indexOf("Question_") === 0) blocks.push(Object.assign({ type: "question", used: false, bump: 0 }, rect));
      if (name.indexOf("Enemy_") === 0) enemies.push({ x: rect.x, y: rect.y });
      if (name === "Start") start = { x: rect.x, y: rect.y };
      if (name === "Flag") flag = { x: rect.x, y: rect.y };
      node.children.forEach(visit);
    };
    root.children.forEach(visit);

    if (!blocks.length) return null;
    const maxX = blocks.reduce((max, block) => Math.max(max, block.x + block.w), 0);
    root.active = false;
    return {
      name: fallbackLevel.name,
      length: Math.max(fallbackLevel.length, maxX + 420),
      start: start || fallbackLevel.start,
      blocks,
      decorations: fallbackLevel.decorations,
      enemies: enemies.length ? enemies : fallbackLevel.enemies,
      flag: flag || fallbackLevel.flag,
    };
  },

  nodeToWorldRect(root, node) {
    const p = this.editableLocalPosition(root, node);
    const size = node.getContentSize();
    return {
      x: p.x + this.VIEW_W / 2 - size.width / 2,
      y: this.VIEW_H / 2 - p.y - size.height / 2,
      w: size.width,
      h: size.height,
    };
  },

  showMenuImages(active) {
    [
      this.menuBgSprite,
      this.titleSprite,
      this.blueButtonSprite,
      this.orangeButtonSprite,
      this.menuMarioSprite,
      this.menuGoombaSprite,
    ].forEach((sprite) => {
      if (sprite) sprite.node.active = active;
    });
  },

  showHudIcons() {
    this.lifeIcon.node.setPosition(-352, 248);
    this.worldIcon.node.setPosition(60, 248);
    this.timerIcon.node.setPosition(385, 248);
    this.lifeIcon.node.active = true;
    this.worldIcon.node.active = !!this.frames.world;
    this.timerIcon.node.active = true;
  },

  hideHudIcons() {
    this.lifeIcon.node.active = false;
    this.worldIcon.node.active = false;
    this.timerIcon.node.active = false;
  },

  showHudLabels() {
    Object.keys(this.hudLabels).forEach((key) => {
      this.hudLabels[key].node.active = true;
      this.hudLabels[key].node.color = new cc.Color(38, 64, 86);
    });
    this.hudLabels.lives.node.setPosition(-278, 247);
    this.hudLabels.score.node.setPosition(-88, 247);
    this.hudLabels.world.node.setPosition(166, 247);
    this.hudLabels.time.node.setPosition(318, 247);
  },

  hideHudLabels() {
    Object.keys(this.hudLabels).forEach((key) => {
      this.hudLabels[key].node.active = false;
    });
  },

  hideEditableLevelPrefabs() {
    const root = this.node.parent || this.node;
    const visit = (node) => {
      if (!node) return;
      if (node.name === "Level1Editable" || node.name === "Level2Editable") {
        node.active = false;
        return;
      }
      node.children.forEach(visit);
    };
    visit(root);
  },

  hideResultLabels() {
    [this.resultTitleLabel, this.resultScoreLabel, this.resultHintLabel].forEach((label) => {
      if (label) label.node.active = false;
    });
  },

  makePlayer() {
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
      anim: 0,
    };
  },

  makeLevels() {
    const ground = (x, y, w, h) => ({ type: "ground", x, y, w, h });
    const brick = (x, y, w, h) => ({ type: "brick", x, y, w, h });
    const wall = (x, y, w, h) => ({ type: "wall", x, y, w, h });
    const pipe = (x, y, h) => ({ type: "pipe", x, y, w: 72, h });
    const cloud = (x, y, w) => ({ type: "cloud", x, y, w, h: 30 });
    const deco = (type, x, y, w, h, parallax) => ({ type, x, y, w, h, parallax: parallax || 1 });
    const question = (x, y) => ({ type: "question", x, y, w: 36, h: 36, used: false, bump: 0 });

    return [
      {
        name: "1-1",
        length: 4600,
        start: { x: 90, y: 260 },
        blocks: [
          ground(0, 468, 900, 72),
          ground(1010, 468, 620, 72),
          ground(1760, 468, 760, 72),
          ground(2670, 468, 760, 72),
          ground(3560, 468, 1040, 72),

          pipe(610, 396, 72),
          pipe(1300, 360, 108),
          pipe(2940, 360, 108),
          pipe(4040, 324, 144),

          brick(380, 432, 72, 36),
          brick(760, 396, 108, 72),
          brick(1160, 396, 108, 72),
          brick(1560, 360, 144, 36),
          brick(1980, 396, 144, 72),
          brick(2220, 324, 180, 36),
          brick(3180, 396, 108, 72),
          wall(3440, 432, 72, 36),
          wall(3548, 396, 72, 72),
          wall(3656, 360, 72, 108),
          wall(3764, 324, 72, 144),
          brick(4148, 288, 180, 36),
          brick(430, 250, 72, 36),
          brick(1188, 252, 144, 36),
          brick(1840, 250, 108, 36),
          brick(2748, 250, 144, 36),
          brick(3368, 250, 144, 36),

          cloud(500, 330, 108),
          cloud(1460, 276, 144),
          cloud(2520, 316, 108),
          cloud(3080, 246, 108),
          cloud(3860, 246, 144),

          question(472, 286),
          question(920, 260),
          question(1532, 190),
          question(2384, 220),
          question(3920, 160),
        ],
        decorations: [
          deco("hill", 90, 382, 96, 86, 0.82),
          deco("bush", 250, 420, 64, 48, 0.95),
          deco("cloud", 720, 122, 108, 46, 0.55),
          deco("edge", 900, 430, 40, 38, 1),
          deco("hill", 1080, 382, 118, 96, 0.82),
          deco("bush", 1450, 420, 72, 48, 0.95),
          deco("cloud", 1840, 108, 144, 48, 0.55),
          deco("hill", 2180, 382, 128, 96, 0.82),
          deco("bush", 2400, 420, 86, 48, 0.95),
          deco("edge", 2520, 430, 40, 38, 1),
          deco("cloud", 2820, 148, 108, 46, 0.55),
          deco("hill", 3340, 382, 116, 96, 0.82),
          deco("bush", 3820, 420, 86, 48, 0.95),
          deco("cloud", 4120, 112, 144, 48, 0.55),
          deco("hill", 4240, 382, 128, 96, 0.82),
        ],
        enemies: [
          { x: 840, y: 420 },
          { x: 1700, y: 420 },
          { x: 2580, y: 420 },
          { x: 3350, y: 420 },
        ],
        flag: { x: 4300, y: 252 },
      },
      {
        name: "1-2",
        length: 5400,
        start: { x: 90, y: 260 },
        blocks: [
          ground(0, 468, 700, 72),
          ground(830, 468, 560, 72),
          ground(1550, 468, 670, 72),
          ground(2380, 468, 620, 72),
          ground(3180, 468, 760, 72),
          ground(4140, 468, 1260, 72),

          pipe(520, 396, 72),
          pipe(1100, 360, 108),
          pipe(1900, 324, 144),
          pipe(2780, 360, 108),
          pipe(4380, 324, 144),

          wall(390, 432, 72, 36),
          wall(498, 396, 72, 72),
          wall(960, 396, 108, 72),
          brick(1260, 324, 72, 36),
          brick(1488, 324, 108, 36),
          cloud(1580, 276, 108),
          wall(1700, 396, 72, 72),
          wall(1808, 360, 72, 108),
          brick(2180, 324, 180, 36),
          cloud(2380, 288, 108),
          cloud(2640, 260, 108),
          wall(3020, 432, 72, 36),
          wall(3128, 396, 72, 72),
          wall(3236, 360, 72, 108),
          wall(3344, 324, 72, 144),
          cloud(3560, 270, 108),
          cloud(3820, 246, 108),
          brick(4020, 360, 144, 36),
          wall(4680, 432, 72, 36),
          wall(4788, 396, 72, 72),
          wall(4896, 360, 72, 108),
          brick(720, 260, 108, 36),
          brick(1736, 232, 108, 36),
          brick(2868, 238, 144, 36),
          brick(3548, 220, 144, 36),
          brick(4308, 238, 108, 36),
          cloud(4580, 238, 108),

          question(650, 260),
          question(1392, 240),
          question(2120, 240),
          question(2520, 226),
          question(3720, 230),
          question(4800, 260),
        ],
        decorations: [
          deco("hill", 120, 382, 112, 92, 0.82),
          deco("bush", 330, 420, 72, 48, 0.95),
          deco("edge", 700, 430, 40, 38, 1),
          deco("cloud", 860, 130, 120, 46, 0.55),
          deco("hill", 1600, 382, 132, 96, 0.82),
          deco("bush", 2010, 420, 86, 48, 0.95),
          deco("edge", 2220, 430, 40, 38, 1),
          deco("cloud", 2350, 108, 144, 48, 0.55),
          deco("hill", 3250, 382, 132, 96, 0.82),
          deco("bush", 3660, 420, 86, 48, 0.95),
          deco("edge", 3940, 430, 40, 38, 1),
          deco("cloud", 4160, 138, 132, 46, 0.55),
          deco("hill", 4560, 382, 116, 92, 0.82),
          deco("bush", 5010, 420, 92, 48, 0.95),
          deco("cloud", 4860, 116, 144, 48, 0.55),
          deco("hill", 5240, 382, 128, 96, 0.82),
        ],
        enemies: [
          { x: 1040, y: 420 },
          { x: 1840, y: 420 },
          { x: 2720, y: 420 },
          { x: 3400, y: 420 },
          { x: 3860, y: 420 },
          { x: 4520, y: 420 },
        ],
        flag: { x: 5120, y: 252 },
      },
    ];
  },

  handleHotkeys() {
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
      if (this.consume(cc.macro.KEY.p)) {
        this.state = this.state === "playing" ? "paused" : "playing";
        if (this.state === "playing") this.message = "";
      }
      return;
    }

    if (this.consume(cc.macro.KEY.enter)) this.showMenu();
  },

  stepGame(dt) {
    this.timer -= dt;
    if (this.timer <= 0) this.hurtPlayer();
    this.updatePlayer(dt);
    this.updateEnemies(dt);
    this.updatePowerups(dt);
    this.blocks.forEach((block) => {
      block.bump = Math.max(0, (block.bump || 0) - dt * 80);
    });
    this.updateHud();
  },

  updatePlayer(dt) {
    const left = this.keys[cc.macro.KEY.left] || this.keys[cc.macro.KEY.a];
    const right = this.keys[cc.macro.KEY.right] || this.keys[cc.macro.KEY.d];
    const jump = this.keys[cc.macro.KEY.up] || this.keys[cc.macro.KEY.w] || this.keys[cc.macro.KEY.space];
    this.player.vx = left ? -235 : right ? 235 : 0;
    if (left) this.player.facing = -1;
    if (right) this.player.facing = 1;
    if (jump && this.player.onGround) {
      this.player.vy = this.player.big ? -780 : -720;
      this.playOneShot(this.jumpClip);
    }
    this.player.anim += dt * (60 + Math.abs(this.player.vx));
    this.player.invincible = Math.max(0, this.player.invincible - dt);
    this.moveBody(this.player, dt, true);
    if (this.player.y > 660) this.hurtPlayer();
    if (this.hit(this.player, { x: this.level.flag.x, y: this.level.flag.y, w: 42, h: 216 })) this.levelClear();
    this.camera = Math.max(0, Math.min(this.level.length - this.VIEW_W, this.player.x - this.VIEW_W * 0.42));
  },

  updateEnemies(dt) {
    this.enemies.forEach((enemy) => {
      if (!enemy.alive) {
        enemy.squash -= dt;
        return;
      }
      this.moveBody(enemy, dt, false);
      if (enemy.vx === 0) enemy.vx = Math.random() > 0.5 ? 65 : -65;
      if (!this.hit(this.player, enemy) || this.player.invincible > 0) return;

      const stomp = this.player.vy > 80 && this.player.y + this.player.h - enemy.y < 20;
      if (stomp) {
        enemy.alive = false;
        enemy.squash = 0.35;
        this.player.vy = -430;
        this.score += 200;
        this.playOneShot(this.stompClip);
      } else {
        this.hurtPlayer();
      }
    });
  },

  moveBody(body, dt, isPlayer) {
    body.x += body.vx * dt;
    this.blocks.forEach((block) => {
      if (!this.hit(body, block)) return;
      if (body.vx > 0) body.x = block.x - body.w;
      if (body.vx < 0) body.x = block.x + block.w;
      body.vx = 0;
    });

    body.vy += this.GRAVITY * dt;
    body.y += body.vy * dt;
    body.onGround = false;
    this.blocks.forEach((block) => {
      if (!this.hit(body, block)) return;
      if (body.vy > 0) {
        body.y = block.y - body.h;
        body.vy = 0;
        body.onGround = true;
      } else if (body.vy < 0) {
        body.y = block.y + block.h;
        body.vy = 0;
        if (isPlayer && block.type === "question") this.useQuestion(block);
      }
    });
  },

  useQuestion(block) {
    if (block.used) return;
    block.used = true;
    block.bump = 12;
    this.score += 100;
    this.spawnPowerup(block);
    this.playOneShot(this.coinClip);
  },

  spawnPowerup(block) {
    this.powerups.push({
      x: block.x + 2,
      y: block.y - 40,
      w: 32,
      h: 32,
      vx: -75,
      vy: 0,
      onGround: false,
      alive: true,
      bob: 0,
    });
  },

  updatePowerups(dt) {
    if (!this.powerups) return;
    this.powerups.forEach((item) => {
      if (!item.alive) return;
      item.bob += dt * 8;
      const oldVx = item.vx;
      this.moveBody(item, dt, false);
      if (item.vx === 0) item.vx = oldVx < 0 ? 75 : -75;
      if (item.y > 660 || item.x < this.camera - 220) item.alive = false;
      const collectBox = {
        x: item.x - 12,
        y: item.y - 18,
        w: item.w + 24,
        h: item.h + 36,
      };
      if (!this.hit(this.player, collectBox)) return;
      item.alive = false;
      if (!this.player.big) {
        this.player.big = true;
        this.player.h = 58;
        this.player.y -= 16;
      }
      this.score += 500;
      this.playOneShot(this.powerClip);
    });
  },

  hurtPlayer() {
    this.lives -= 1;
    this.playOneShot(this.hurtClip);
    if (this.lives <= 0) {
      this.state = "over";
      this.resultBonus = 0;
      this.message = "GAME OVER";
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

  levelClear() {
    this.state = "clear";
    this.resultBonus = Math.max(0, Math.ceil(this.timer)) * 10;
    this.score += this.resultBonus;
    this.message = "COURSE CLEAR!";
    if (this.audioSource) this.audioSource.stop();
    this.playOneShot(this.clearClip);
  },

  updateHud() {
    if (!this.hudLabels.lives) return;
    this.hudLabels.lives.string = String(this.lives);
    this.hudLabels.score.string = `SCORE ${String(this.score).padStart(6, "0")}`;
    this.hudLabels.world.string = this.level ? this.level.name : "1-1";
    this.hudLabels.time.string = String(Math.max(0, Math.ceil(this.timer)));
  },

  draw() {
    const g = this.graphics;
    if (!g) return;
    g.clear();

    if (this.state === "menu") {
      this.hideEditableLevelPrefabs();
      this.hideBlockSprites();
      this.hideDecorSprites();
      this.hidePowerupSprites();
      this.flagSprite.node.active = false;
      this.hudPanelSprite.node.active = false;
      this.messagePanelSprite.node.active = false;
      this.hideResultLabels();
      this.hideHudLabels();
      return;
    }

    if (this.state === "levels") {
      this.hideEditableLevelPrefabs();
      this.hideBlockSprites();
      this.hideDecorSprites();
      this.hidePowerupSprites();
      this.flagSprite.node.active = false;
      this.hudPanelSprite.node.active = false;
      this.messagePanelSprite.node.active = false;
      this.hideResultLabels();
      this.hideHudLabels();
      return;
    }

    this.syncDecorSprites();
    this.syncBlockSprites();
    this.syncPowerupSprites();
    this.syncGameSprites();
    this.syncFlagSprite();

    if (this.state === "clear" || this.state === "over") {
      this.showResultOverlay();
      return;
    }

    this.hideResultLabels();
    if (this.state === "paused") this.message = "PAUSED";
    const showMessage = !!this.message;
    this.messagePanelSprite.node.active = showMessage && !!this.frames.textArea;
    if (showMessage) {
      this.messagePanelSprite.node.setPosition(0, 8);
      this.messagePanelSprite.node.setContentSize(360, 100);
    }
    this.infoLabel.node.active = showMessage;
    this.infoLabel.node.color = new cc.Color(38, 64, 86);
    this.infoLabel.node.setPosition(0, this.state === "paused" ? 8 : -18);
    this.infoLabel.fontSize = this.state === "playing" ? 24 : 30;
    this.infoLabel.lineHeight = this.infoLabel.fontSize + 8;
    this.infoLabel.string = this.message;
  },

  showResultOverlay() {
    const cleared = this.state === "clear";
    this.messagePanelSprite.node.active = !!this.frames.textArea;
    this.messagePanelSprite.node.setPosition(0, 8);
    this.messagePanelSprite.node.setContentSize(610, 184);
    this.infoLabel.node.active = false;

    this.resultTitleLabel.node.active = true;
    this.resultScoreLabel.node.active = true;
    this.resultHintLabel.node.active = true;

    this.resultTitleLabel.node.setPosition(0, 62);
    this.resultScoreLabel.node.setPosition(0, 8);
    this.resultHintLabel.node.setPosition(0, -46);

    this.resultTitleLabel.fontSize = cleared ? 34 : 38;
    this.resultTitleLabel.lineHeight = this.resultTitleLabel.fontSize + 8;
    this.resultScoreLabel.fontSize = 23;
    this.resultScoreLabel.lineHeight = 30;
    this.resultHintLabel.fontSize = 20;
    this.resultHintLabel.lineHeight = 28;

    this.resultTitleLabel.string = cleared ? "COURSE CLEAR!" : "GAME OVER";
    this.resultScoreLabel.string = cleared
      ? `SCORE ${String(this.score).padStart(6, "0")}   TIME BONUS ${String(this.resultBonus || 0).padStart(4, "0")}`
      : `FINAL SCORE ${String(this.score).padStart(6, "0")}`;
    this.resultHintLabel.string = "PRESS ENTER TO RETURN TO MENU";
  },

  syncGameSprites() {
    if (this.playerSprite && this.frames.marioSmall && this.player) {
      const walking = this.player.onGround && Math.abs(this.player.vx) > 10;
      const jumping = !this.player.onGround;
      const playerFrames = this.player.big
        ? (this.frames.marioBigFrames || this.frames.marioSmallFrames || [this.frames.marioSmall])
        : (this.frames.marioSmallFrames || [this.frames.marioSmall]);
      const selectedFrame = this.pickMarioFrame(playerFrames, walking, jumping);
      this.playerSprite.node.active = true;
      this.playerSprite.spriteFrame = selectedFrame || this.frames.marioSmall;
      this.playerSprite.node.setPosition(
        this.player.x - this.camera - this.VIEW_W / 2 + this.player.w / 2,
        this.VIEW_H / 2 - this.player.y - this.player.h / 2
      );
      this.playerSprite.node.setScale(this.player.facing, 1);
      this.playerSprite.node.setContentSize(this.player.big ? 46 : 34, this.player.big ? 58 : 42);
      this.playerSprite.node.opacity = this.player.invincible > 0 && Math.floor(Date.now() / 90) % 2 === 0 ? 80 : 255;
    }

    this.ensureEnemySprites();
    this.enemies.forEach((enemy, index) => {
      const sprite = this.enemySprites[index];
      if (!sprite) return;
      sprite.node.active = !!this.frames.goomba && enemy.alive;
      if (!sprite.node.active) return;
      const goombaFrames = this.frames.goombaFrames || [this.frames.goomba];
      sprite.spriteFrame = goombaFrames[Math.floor((Date.now() / 180) + index) % goombaFrames.length] || this.frames.goomba;
      sprite.node.setPosition(
        enemy.x - this.camera - this.VIEW_W / 2 + enemy.w / 2,
        this.VIEW_H / 2 - enemy.y - enemy.h / 2
      );
      sprite.node.setContentSize(40, 42);
    });
  },

  pickMarioFrame(frames, walking, jumping) {
    if (!frames || !frames.length) return null;
    const byTime = (items, speed) => items[Math.floor(this.player.anim / speed) % items.length];
    if (jumping) {
      const jumpFrames = frames.slice(Math.max(0, frames.length - 6));
      if (jumpFrames.length) {
        const rising = this.player.vy < -180;
        const falling = this.player.vy > 180;
        const index = rising ? 0 : falling ? jumpFrames.length - 1 : Math.floor(jumpFrames.length / 2);
        return jumpFrames[index] || jumpFrames[0];
      }
    }

    if (walking) {
      const walkFrames = frames.slice(2, Math.max(3, frames.length - 6));
      return byTime(walkFrames.length ? walkFrames : frames, 75);
    }

    const idleFrames = frames.slice(0, Math.min(2, frames.length));
    return byTime(idleFrames.length ? idleFrames : frames, 520);
  },

  syncBlockSprites() {
    if (!this.frames.groundTop || !this.frames.groundBody || !this.frames.brickTile || !this.frames.questionTile) return;
    let index = 0;
    this.blocks.forEach((block) => {
      const visibleX = block.x - this.camera;
      if (visibleX + block.w < -80 || visibleX > this.VIEW_W + 80) return;
      if (block.type === "ground") {
        const tileSize = 32;
        const cols = Math.ceil(block.w / tileSize);
        const rows = Math.max(1, Math.ceil(block.h / tileSize));
        for (let col = 0; col < cols; col += 1) {
          for (let row = 0; row < rows; row += 1) {
            const frame = row === 0 ? this.frames.groundTop : this.frames.groundBody;
            this.placeBlockSprite(index, frame, block.x + col * tileSize, block.y + row * tileSize, tileSize, tileSize);
            index += 1;
          }
        }
        return;
      }

      if (block.type === "pipe") {
        const tileSize = 36;
        const cols = Math.max(1, Math.ceil(block.w / tileSize));
        const rows = Math.max(1, Math.ceil(block.h / tileSize));
        for (let col = 0; col < cols; col += 1) {
          for (let row = 0; row < rows; row += 1) {
            const frame = row === 0 ? (this.frames.pipeTop || this.frames.brickTile) : (this.frames.pipeBody || this.frames.pipeTop || this.frames.brickTile);
            this.placeBlockSprite(index, frame, block.x + col * tileSize, block.y + row * tileSize, tileSize, tileSize);
            index += 1;
          }
        }
        return;
      }

      if (block.type === "cloud") {
        const tileSize = 36;
        const cols = Math.max(1, Math.ceil(block.w / tileSize));
        for (let col = 0; col < cols; col += 1) {
          this.placeBlockSprite(index, this.frames.brickTile, block.x + col * tileSize, block.y, tileSize, tileSize);
          index += 1;
        }
        return;
      }

      const tileSize = block.type === "question" ? 36 : 36;
      const cols = Math.max(1, Math.ceil(block.w / tileSize));
      const rows = Math.max(1, Math.ceil(block.h / tileSize));
      const frame = block.type === "question"
        ? (block.used ? this.frames.usedTile : this.frames.questionTile)
        : (block.type === "wall" ? (this.frames.wallTile || this.frames.brickTile) : this.frames.brickTile);
      const bumpY = block.type === "question" ? (block.bump || 0) : 0;
      for (let col = 0; col < cols; col += 1) {
        for (let row = 0; row < rows; row += 1) {
          this.placeBlockSprite(index, frame, block.x + col * tileSize, block.y + row * tileSize - bumpY, tileSize, tileSize);
          index += 1;
        }
      }
    });

    for (let i = index; i < this.blockSprites.length; i += 1) {
      this.blockSprites[i].node.active = false;
    }
  },

  syncDecorSprites() {
    if (!this.decorations) return;
    let index = 0;
    this.decorations.forEach((item) => {
      const parallax = item.parallax || 1;
      const x = item.x - this.camera * parallax;
      if (x + item.w < -120 || x > this.VIEW_W + 120) return;
      if (item.type === "cloud" && (this.frames.cloudLeft || this.frames.cloudRight)) {
        const puffW = 42;
        const puffH = 38;
        const cols = Math.max(2, Math.ceil(item.w / puffW));
        for (let col = 0; col < cols; col += 1) {
          const frame = col === cols - 1
            ? (this.frames.cloudRight || this.frames.cloudLeft)
            : (this.frames.cloudLeft || this.frames.cloudRight);
          this.placeDecorSprite(index, frame, x + col * (puffW - 5), item.y, puffW, puffH);
          index += 1;
        }
        return;
      }
      const frame = this.decorFrame(item.type);
      if (!frame) return;
      this.placeDecorSprite(index, frame, x, item.y, item.w, item.h);
      index += 1;
    });

    for (let i = index; i < this.decorSprites.length; i += 1) {
      this.decorSprites[i].node.active = false;
    }
  },

  syncPowerupSprites() {
    if (!this.powerups) return;
    let index = 0;
    this.powerups.forEach((item) => {
      if (!item.alive || !this.frames.mushroom) return;
      const visibleX = item.x - this.camera;
      if (visibleX + item.w < -80 || visibleX > this.VIEW_W + 80) return;
      while (this.powerupSprites.length <= index) {
        const sprite = this.makeSpriteNode(`PowerUpSprite${this.powerupSprites.length + 1}`, 0, 0, 32, 32);
        sprite.node.active = false;
        this.powerupSprites.push(sprite);
      }
      const sprite = this.powerupSprites[index];
      sprite.spriteFrame = this.frames.mushroom;
      sprite.node.active = true;
      sprite.node.setContentSize(32, 32);
      const bobY = Math.sin(item.bob || 0) * 4;
      sprite.node.setPosition(
        item.x - this.camera - this.VIEW_W / 2 + item.w / 2,
        this.VIEW_H / 2 - item.y - item.h / 2 + bobY
      );
      index += 1;
    });

    for (let i = index; i < this.powerupSprites.length; i += 1) {
      this.powerupSprites[i].node.active = false;
    }
  },

  decorFrame(type) {
    if (type === "hill") return this.frames.hillTile;
    if (type === "bush") return this.frames.bushTile;
    if (type === "grass") return this.frames.grassTile;
    if (type === "edge") return null;
    if (type === "cloud") return this.frames.cloudTile;
    return this.frames.brickTile;
  },

  placeDecorSprite(index, frame, worldX, worldY, w, h) {
    while (this.decorSprites.length <= index) {
      const sprite = this.makeSpriteNode(`DecorSprite${this.decorSprites.length + 1}`, 0, 0, 48, 48);
      sprite.node.active = false;
      this.decorSprites.push(sprite);
    }
    const sprite = this.decorSprites[index];
    sprite.spriteFrame = frame;
    sprite.node.active = true;
    sprite.node.setContentSize(w, h);
    sprite.node.setPosition(
      worldX - this.VIEW_W / 2 + w / 2,
      this.VIEW_H / 2 - worldY - h / 2
    );
  },

  placeBlockSprite(index, frame, worldX, worldY, w, h) {
    if (!frame) return;
    while (this.blockSprites.length <= index) {
      const sprite = this.makeSpriteNode(`TileSprite${this.blockSprites.length + 1}`, 0, 0, 48, 48);
      sprite.node.active = false;
      this.blockSprites.push(sprite);
    }
    const sprite = this.blockSprites[index];
    sprite.spriteFrame = frame;
    sprite.node.active = true;
    sprite.node.setContentSize(w, h);
    sprite.node.setPosition(
      worldX - this.camera - this.VIEW_W / 2 + w / 2,
      this.VIEW_H / 2 - worldY - h / 2
    );
  },

  hideBlockSprites() {
    this.blockSprites.forEach((sprite) => {
      sprite.node.active = false;
    });
  },

  hideDecorSprites() {
    this.decorSprites.forEach((sprite) => {
      sprite.node.active = false;
    });
  },

  hidePowerupSprites() {
    this.powerupSprites.forEach((sprite) => {
      sprite.node.active = false;
    });
  },

  syncFlagSprite() {
    if (!this.flagSprite) return;
    if (!this.frames.flag || !this.level) {
      this.flagSprite.node.active = false;
      return;
    }
    this.flagSprite.node.active = true;
    this.flagSprite.node.setPosition(
      this.level.flag.x - this.camera - this.VIEW_W / 2 + 22,
      this.VIEW_H / 2 - this.level.flag.y - 108
    );
    this.flagSprite.node.setContentSize(58, 220);
  },

  ensureEnemySprites() {
    while (this.enemySprites.length < this.enemies.length) {
      const sprite = this.makeSpriteNode(`GoombaSprite${this.enemySprites.length + 1}`, 0, 0, 40, 42);
      sprite.node.active = false;
      this.enemySprites.push(sprite);
    }
  },

  hideEnemySprites() {
    this.enemySprites.forEach((sprite) => {
      sprite.node.active = false;
    });
  },

  hit(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  },

  playOneShot(clip) {
    if (clip) cc.audioEngine.playEffect(clip, false);
  },

  consume(code) {
    if (!this.keys[code]) return false;
    delete this.keys[code];
    return true;
  },

  onTouchEnd(event) {
    const point = this.node.convertToNodeSpaceAR(event.getLocation());
    if (this.state === "menu") {
      if (this.pointInButton(point, this.menuButtons[0])) this.startGame(0);
      if (this.pointInButton(point, this.menuButtons[1])) this.showLevelSelect();
      return;
    }

    if (this.state === "levels") {
      if (this.pointInButton(point, { x: -150, y: 10, w: 250, h: 72 })) this.startGame(0);
      if (this.pointInButton(point, { x: 150, y: 10, w: 250, h: 72 })) this.startGame(1);
    }
  },

  pointInButton(point, button) {
    return point.x >= button.x - button.w / 2
      && point.x <= button.x + button.w / 2
      && point.y >= button.y - button.h / 2
      && point.y <= button.y + button.h / 2;
  },

  onKeyDown(event) {
    this.keys[event.keyCode] = true;
  },

  onKeyUp(event) {
    delete this.keys[event.keyCode];
  },
});
