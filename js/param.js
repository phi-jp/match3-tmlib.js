/*
 * param.js
 */


var FRAME_RATE      = 30;
var SCREEN_WIDTH    = 480;
var SCREEN_HEIGHT   = 720;
var SCREEN_CENTER_X = SCREEN_WIDTH/2;
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;
var PIECE_SIZE      = 50;

var PIECE_IMAGE     = null;


tm.preload(function() {
    
    tm.sound.SoundManager.add("bgm", "http://storage.tmlife.net/resource/bgm/maoudamashii/bgm_maoudamashii_healing02.wav", 1);
    tm.sound.SoundManager.add("pinpon", "sound/pinpon");
    tm.sound.SoundManager.add("boo", "sound/boo");
    
    tm.util.DataManager.set("game-data", {
        time : 0,
        score: 0,
    });
    
    PIECE_IMAGE = tm.graphics.Canvas();
    
    PIECE_IMAGE.width = PIECE_SIZE*9;
    PIECE_IMAGE.height= PIECE_SIZE;
    
    var colorList = ["white", "red", "green", "blue", "yellow", "purple", "cyan"];
    
    var startX = PIECE_SIZE/2;
    var startY = PIECE_SIZE/2;
    var radius = PIECE_SIZE/2*0.9;
    for (var i=0,len=colorList.length; i<len; ++i) {
        var x = startX + i*PIECE_SIZE;
        var y = startY;
        color = colorList[i];
        PIECE_IMAGE.fillStyle = color;
        PIECE_IMAGE.fillCircle(x, y, radius);
    }
    
    //PIECE_IMAGE.saveAsImage();
});
