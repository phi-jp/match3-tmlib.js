/*
 * main.js
 */

var app = null;

tm.main(function() {
    app = tm.app.CanvasApp("#world");
    app.fps = FRAME_RATE;
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    app.fitWindow();
    app.enableStats();
    
    var bgm = tm.sound.SoundManager.get("bgm");
    bgm.loop = true;
    bgm.volume = 0.5;
    bgm.play();
    
    var titleScene = TitleScene();
    app.replaceScene(titleScene);
    
    app.run();
});
