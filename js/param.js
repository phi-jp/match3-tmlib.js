/*
 * param.js
 */


var FRAME_RATE      = 30;
var SCREEN_WIDTH    = 480;
var SCREEN_HEIGHT   = 720;
var SCREEN_CENTER_X = SCREEN_WIDTH/2;
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;
var PIECE_SIZE      = 50;


tm.preload(function() {
    
    tm.sound.SoundManager.add("bgm", "http://storage.tmlife.net/resource/bgm/maoudamashii/bgm_maoudamashii_healing02.wav", 1);
    tm.sound.SoundManager.add("pinpon", "sound/pinpon");
    tm.sound.SoundManager.add("boo", "sound/boo");
    
    tm.util.DataManager.set("game-data", {
        time : 0,
        score: 0,
    });
});
