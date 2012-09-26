/*
 * mainscene.js
 */

(function(ns) {
    
    var TIME = 600;
    var GAUGE_WIDTH = SCREEN_WIDTH-80;
    
    var UI_DATA = {
        children: [
            { type: "Label", name: "titleLabel", x:SCREEN_CENTER_X, y:80, width:SCREEN_WIDTH, text:"title", align:"center", fontSize:50 },
            { type: "Label", name: "scoreLabel", x:350, y:125, width:SCREEN_WIDTH, text:"Score: 0", align:"center", fontSize:25 },
            { type: "Label", name: "timeLabel", x:260, y:160, width:SCREEN_WIDTH, text:"Time:", fontSize:25, visible: false },
            { type: "Shape", name: "gauge", x:40, y:170, width:GAUGE_WIDTH, height: 25 },
        ]
    };
    
    ns.MainScene = tm.createClass({
        superClass: tm.app.Scene,
        
        init: function(mode) {
            this.superInit();
            
            this.frame = 0;
            
            mode = mode || "default";
            
            // ゲームデータ取得, 初期化
            this.gameData = tm.util.DataManager.get("game-data");
            this.gameData.time  = TIME;
            this.gameData.score = 0;
            this.gameData.mode = mode;
            
            // UI
            this.fromJSON(UI_DATA);
            this.titleLabel.text = mode;
            // ゲージ
            console.dir(this.gauge);
            this.gauge.originX = 0.0;
            this.gauge.canvas.clearColor("white");
            
            // ボードを作成
            var board = tm.app.Shape(PIECE_SIZE*8, PIECE_SIZE*8);
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
                    this.setPiece(j, i, piece);
                    piece.ontouchmove = function(e) {
                        this.onpiecetouchmove(e);
                    }.bind(this);
                }
            }
            
            this.checkGather();
        },
        
        /*
         * 更新
         */
        update: function(app) {
            for (var i=0; i<8; ++i) {
                for (var j=0; j<8; ++j) {
                    var x = j, y = i;
                    this.checkFall(x, y);
                }
            }
            
            if (this.checkAnimation() === true) {
                this.checkGather();
            }
            
            // タイマー更新
            this.gameData.time -= 1;
            this.gauge.width = (this.gameData.time/TIME)*GAUGE_WIDTH;
            
            if (this.gameData.time <= 0) {
                app.replaceScene(EndScene());
            }
        },
        
        
        /*
         * 落ちチェック
         */
        checkFall: function(x, y) {
            var target = this.getPiece(x, y);
            var top    = this.getPieceTop(target);
            
            if (top && top.isFall == true) return ;
            
            if (y <= 0) {
                if (target.destroy == true) {
                    target.appear();
                    
                    target.y = - PIECE_SIZE*4 + PIECE_SIZE/2 - PIECE_SIZE;
                    target.fall();
                    target.setColor( tm.util.Random.randint(0, 5) );
                }
            }
            else if ( target.destroy == true && top.destroy == false ) {
                this.setPiece(x, y, top);
                this.setPiece(x, y-1, target);
                target.y -= PIECE_SIZE;
                top.fall();
                // 上のピースをチェック
                this.checkFall(x, y-1);
            }
        },
        
        /*
         * アニメーション中かをチェック
         */
        checkAnimation: function() {
            for (var i=0; i<8; ++i) {
                for (var j=0; j<8; ++j) {
                    var x = j, y = i;
                    var target = this.getPiece(x, y);
                    if (target.isNormal() == false) {
                        return false;
                    }
                }
            }
            return true;
        },
        
        /*
         * チェック
         */
        checkGather: function() {
            for (var i=0; i<8; ++i) {
                for (var j=0; j<8; ++j) {
                    var x = j;
                    var y = i;
                    var target = this.getPiece(x, y);
                    if (j<6) {
                        var rst = [target];
                        this.checkPieceGather(target, 1, 0, rst);
                        
                        if (rst.length >= 3) {
                            rst.forEach(function(elm) { elm.disappear(); });
                            tm.sound.SoundManager.get("pinpon").play();
                            // タイマー回復
                            this.gameData.time = Math.min(this.gameData.time+25, TIME);
                            // スコア更新
                            this.gameData.score += 100;
                            this.scoreLabel.text = "Score:" + this.gameData.score;
                        }
                        /*
                        var right  = this.getPieceRight(target);
                        var right2 = this.getPieceRight(right);
                        if (target.color == right.color && target.color == right2.color) {
                            target.disappear();
                            right.disappear();
                            right2.disappear();
                            tm.sound.SoundManager.get("pinpon").play();
                            tm.sound.SoundManager.get("a").play();
                        }
                        */
                    }
                    if (i<6) {
                        var bottom = this.getPieceBottom(target);
                        var bottom2= this.getPieceBottom(bottom);
                        if (target.color == bottom.color && target.color == bottom2.color) {
                            target.disappear();
                            bottom.disappear();
                            bottom2.disappear();
                            tm.sound.SoundManager.get("pinpon").play();
                            // タイマー回復
                            this.gameData.time = Math.min(this.gameData.time+25, TIME);
                            // スコア更新
                            this.gameData.score += 100;
                            this.scoreLabel.text = "Score:" + this.gameData.score;
                        }
                    }
                }
            }
        },
        
        checkPieceGather: function(p, vx, vy, rst)
        {
            var other = this.getPiece(p.indexX+vx, p.indexY+vy);
            
            if (other && p.color == other.color) {
                rst.push(other);
                // 再帰チェック
                this.checkPieceGather(other, vx, vy, rst);
            }
            
            return rst;
        },
        
        /*
         * ピースをセット
         */
        setPiece: function(x, y, p) {
            this.pieceList[y][x] = p;
            p.indexX = x;
            p.indexY = y;
        },
        
        /*
         * ピース入れ替え
         */
        swapPiece: function(p0, p1) {
            var p0IndexX = p0.indexX;
            var p0IndexY = p0.indexY;
            var p1IndexX = p1.indexX;
            var p1IndexY = p1.indexY;
            this.setPiece(p0IndexX, p0IndexY, p1);
            this.setPiece(p1IndexX, p1IndexY, p0);
        },
        
        /*
         * ピース取得
         */
        getPiece        : function(x, y) { return (this.pieceList[y]) ? this.pieceList[y][x] : null; },
        getPieceLeft    : function(p) { return this.getPiece(p.indexX-1, p.indexY); },
        getPieceRight   : function(p) { return this.getPiece(p.indexX+1, p.indexY); },
        getPieceTop     : function(p) { return this.getPiece(p.indexX, p.indexY-1); },
        getPieceBottom  : function(p) { return this.getPiece(p.indexX, p.indexY+1); },
        
        /*
         * 動けるかをチェック
         */
        canPieceMove: function(p) {
            var piece = p;
            // 下まで調べる
            while (piece) {
                if (piece.isNormal() == false) {
                    return false;
                }
                piece = this.getPieceBottom(piece);
            }
            
            return true;
        },
        
        onpiecetouchmove: function(e) {
            var target = e.target;
            // 動ける状態かどうかをチェック
            if (this.canPieceMove(target) == false) return ;
            
            var p   = e.app.pointing;
            var dp  = p.deltaPosition;
            var len = dp.length();
            
            if (len > 4) {
                var other = null;
                var moveX = 0;
                var moveY = 0;
                var angle = dp.toAngle()*Math.RAD_TO_DEG;
                angle += 360;
                angle %= 360;
                
                // bottom
                if (45 < angle && angle < 135) {
                    other = this.getPieceBottom(target);
                    moveY = PIECE_SIZE;
                }
                // left
                else if (135 < angle && angle < 225) {
                    other = this.getPieceLeft(target);
                    moveX = -PIECE_SIZE;
                }
                // top
                else if (225 < angle && angle < 315) {
                    other = this.getPieceTop(target);
                    moveY = -PIECE_SIZE;
                }
                // right
                else {
                    other = this.getPieceRight(target);
                    moveX = PIECE_SIZE;
                }
                
                // 入れ替え
                if (other && this.canPieceMove(other) == true) {
                    target.move(moveX, moveY);
                    other.move(-moveX, -moveY);
                    this.swapPiece(target, other);
                }
            }
        },
        
        onblur: function() {
            app.pushScene(PauseScene());
        },
    });
    
})(window);

(function(ns) {
    
    ns.Piece = tm.createClass({
        superClass: tm.app.Sprite,
        
        init: function(color) {
            this.superInit();
            
            this.width  = PIECE_SIZE;
            this.height = PIECE_SIZE;
            this.image  = PIECE_IMAGE;
            this.srcRect.width = PIECE_SIZE;
            this.srcRect.height= PIECE_SIZE;
            
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
            this.setFrameIndex(color);
        },
        
        
        ontouchover: function() {
            this.strokeStyle = "red";
        },
        
        ontouchout: function() {
            this.strokeStyle = "rgba(0, 0, 0, 0)";
        },
        
        // 移動
        move: function(x, y) {
            this.animation.move(x, y, 250);
            this.isMove = true;
            this.onanimationend = this._onmoveend;
        },
        
        // 落ち
        fall: function() {
            this.animation.move(0, PIECE_SIZE, 200);
            this.isFall = true;
            this.onanimationend = this._onfallend;
        },
        
        appear: function() {
            this.destroy = false;
            this.alpha = 1.0;
        },
        
        // 消える
        disappear: function() {
            this.animation.fade(0.0, 1000);
            this.animation.scale(1.5, 1000);
            this.onanimationend = this._ondisappearend;
            this.isDisappear = true;
        },
        
        /*
        // 描画
        draw: function(c) {
            c.strokeRect(-25, -25, 50, 50);
            c.fillCircle(0, 0, 22, 22);
            // c.fillStar(0, 0, 22, 6, 0.5);
        },
        */
        
        // 通常状態かをチェック
        isNormal: function() {
            return this.isMove == false && this.isFall == false && this.isDisappear == false && this.destroy == false;
        },
        
        _onfallend: function() {
            this.isFall = false;
        },
        
        _onmoveend: function() {
            this.isMove = false;
        },
        
        _ondisappearend: function() {
            this.scaleX = this.scaleY = 1;
            this.destroy = true;
            this.isDisappear = false;
        }
        
    });
    
})(window);
