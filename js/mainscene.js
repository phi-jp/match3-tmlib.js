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
        
        init: function(mode) {
            this.superInit();
            
            mode = mode || "default";
            
            // UI
            this.fromJSON(UI_DATA);
            this.titleLabel.text = mode;
            
            // ボードを作成
            var board = tm.app.Sprite(PIECE_SIZE*8, PIECE_SIZE*8);
            board.position.set(SCREEN_CENTER_X, SCREEN_CENTER_Y+50);
            board.canvas.clearColor("rgba(255, 255, 255, 0.1)");
            board.canvas.strokeStyle = "white";
            for (var i=0; i<8; ++i) {
                for (var j=0; j<8; ++j) {
                    var x = j*PIECE_SIZE;
                    var y = i*PIECE_SIZE;
                    board.canvas.strokeRect(x, y, PIECE_SIZE, PIECE_SIZE);
                }
            }
            board.addChildTo(this);
            
            // ピースリストを生成
            this.pieceList = [];
            for (var i=0; i<8; ++i) { this.pieceList[i] = []; }
            
            // ピースを作成
            for (var i=0; i<8; ++i) {
                for (var j=0; j<8; ++j) {
                    var x = j*PIECE_SIZE - PIECE_SIZE*4 + PIECE_SIZE/2;
                    var y = i*PIECE_SIZE - PIECE_SIZE*4 + PIECE_SIZE/2;
                    var piece = Piece(tm.util.Random.randint(0, 5)).addChildTo(board);
                    piece.setPosition(x, y);
                }
            }
        }
    });
    
})(window);

(function(ns) {
    
    ns.Piece = tm.createClass({
        superClass: tm.app.CanvasElement,
        
        init: function(color) {
            this.superInit();
            
            this.width  = PIECE_SIZE;
            this.height = PIECE_SIZE;
            this.interaction.enabled = true;
            this.interaction.boundingType = "rect";
            
            this.setColor(color);
            this.strokeStyle = "rgba(0, 0, 0, 0)";
            this.destroy    = false;
            this.isMove     = false;
            this.isFall     = false;
            this.isDisappear= false;
        },
        
        setColor: function(color) {
            this.color = color;
            this.fillStyle = ["white", "red", "green", "blue", "yellow", "purple", "cyan"][color];
        },
        
        
        // 描画
        draw: function(c) {
            c.strokeRect(-25, -25, 50, 50);
            c.fillCircle(0, 0, 22, 22);
            // c.fillStar(0, 0, 22, 6, 0.5);
        },
        
    });
    
})(window);
