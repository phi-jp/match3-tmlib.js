/*
 * endscene.js
 */


(function(ns) {
    
    var UI_DATA = {
        children: [
            {
                type:"Label",name:"scoreLabel",
                x:SCREEN_WIDTH/2, y:300, width:SCREEN_WIDTH,
                fillStyle:"white",
                text:"Score:", fontSize: 30, align:"center",
            },
            {
                type:"LabelButton",name:"backButton",
                x:SCREEN_WIDTH-100,y:SCREEN_HEIGHT-50,width:160,height:50,
                fillStyle:"white",shadowColor:"#00f",shadowBlur:16,
                text:"Back Title",fontSize:25
            },
        ]
    }

    ns.EndScene = tm.createClass({
        
        superClass: tm.app.Scene,
        
        init: function(bgm) {
            this.superInit();
            
            // ゲームデータ取得, 初期化
            this.gameData = tm.util.DataManager.get("game-data");
            
            // UI
            this.fromJSON(UI_DATA);
            this.scoreLabel.text += this.gameData.score;    // スコアをセット
            this.backButton.onpointingstart = function() {
                this.dispatchEvent(tm.event.Event("backbuttondown"));
            }.bind(this);
            // tweet url
            var msg = "『{gameTitle}』\nScore:{score}".format({
                gameTitle: document.title,
                score: this.gameData.score,
            });
            var url = tm.social.Twitter.createURL({
                type    : "tweet",
                text    : msg,
                hashtags: "match3,tmlibjs",
                url     : "https://github.com/phi1618/match3-tmlib.js",
            });
            // ツイートボタン
            var tweetButton = tm.app.iPhoneButton(150, 50, "blue", "Tweet").addChildTo(this);
            tweetButton.setPosition(SCREEN_WIDTH/2, 470);
            tweetButton.onpointingstart = function() { window.open(url, "_self"); };
            
        },
        
        onbackbuttondown: function() {
            app.replaceScene(TitleScene());
        },
        
        update: function(app) {
        },
        
        onblur: function() {
            app.pushScene(PauseScene());
        }
    });

})(window);