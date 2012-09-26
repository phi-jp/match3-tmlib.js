/*
 * titlescene.js
 */


(function(ns) {
    
    var UI_DATA = {
        children: [
            { type: "Label", name: "titleLabel", x:SCREEN_CENTER_X, y:150, width:SCREEN_WIDTH, text:"Match3 - tmlib.js", align:"center", fontSize:40 },
            { type: "LabelButton", name: "playLabel", x:SCREEN_CENTER_X, y:360, width:150, width:SCREEN_WIDTH, text:"Play Game", align:"center", fontSize:25 },
            { type: "LabelButton", name: "tweetLabel", x:SCREEN_CENTER_X, y:420, width:150, width:SCREEN_WIDTH, text:"Tweet", align:"center", fontSize:25 },
            { type: "LabelButton", name: "rankingLabel", x:SCREEN_CENTER_X, y:480, width:150, width:SCREEN_WIDTH, text:"Ranking", align:"center", fontSize:25 },
        ],
    }

    ns.TitleScene = tm.createClass({
        
        superClass: tm.app.Scene,
        
        init: function(bgm) {
            this.superInit();
            
            this.fromJSON(UI_DATA);
            
            this.playLabel.ontouchstart = function() {
                var fade = tm.app.Shape(SCREEN_WIDTH, SCREEN_HEIGHT).addChildTo(this);
                fade.originX = fade.originY = 0;
                fade.canvas.clearColor("white");
                fade.alpha = 0.0;
                fade.animation.fadeIn(1000);
                fade.blendMode = "lighter";
                fade.onanimationend = function() {
                    app.replaceScene(MainScene());
                }
            }.bind(this);
            
            // ツイート
            this.tweetLabel.onpointingstart = function() {
                window.open(tm.social.Twitter.createURL({
                    type    : "tweet",
                    text    : "『match3』 tmlib.js を使ってマッチ3ゲーム(Zookeeper)作りました.",
                    hashtags: "match3,tmlibjs",
                    url     : "https://github.com/phi1618/match3-tmlib.js",
                    via     : "phi_jp", 
                }), "_self");
            };
            
            // ランキング
            this.rankingLabel.onpointingstart = function() {
                window.open("https://twitter.com/#!/search/%23match3%20%23tmlibjs", "_self");
            };
        },
        
        update: function(app) {
        },
        
        onblur: function() {
            app.pushScene(PauseScene());
        }
    });

})(window);

