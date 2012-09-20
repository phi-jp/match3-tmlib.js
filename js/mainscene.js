/*
 * mainscene.js
 */

(function(ns) {
    
    var UI_DATA = {
        children: [
            { type: "Label", name: "titleLabel", x:SCREEN_CENTER_X, y:80, width:SCREEN_WIDTH, text:"title", align:"center", fontSize:50 },
            { type: "Label", name: "timeLabel", x:260, y:160, width:SCREEN_WIDTH, text:"Time:", fontSize:25 },
        ]
    };
    
    ns.MainScene = tm.createClass({
        superClass: tm.app.Scene,
        
        init: function() {
            this.superInit();
        }
    });
    
})(window);
