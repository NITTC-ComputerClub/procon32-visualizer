var framework;
(function (framework) {
    var RichSeekBar = /** @class */ (function () {
        function RichSeekBar(callback) {
            var _this = this;
            this.callback = callback;
            this.seekRange = document.getElementById("seekRange");
            this.seekNumber = document.getElementById("seekNumber");
            this.fpsInput = document.getElementById("fpsInput");
            this.firstButton = document.getElementById("firstButton");
            this.prevButton = document.getElementById("prevButton");
            this.playButton = document.getElementById("playButton");
            this.nextButton = document.getElementById("nextButton");
            this.lastButton = document.getElementById("lastButton");
            this.reloadButton = document.getElementById("reloadButton");
            this.runIcon = document.getElementById("runIcon");
            is_moving = false; //mvoe.js playボタンで再生中かどうか
            this.setMinMax(0, frames.length - 1); //操作回数を指定
            this.seekRange.addEventListener('change', function () {
                _this.setValue(parseInt(_this.seekRange.value));
            });
            this.seekNumber.addEventListener('change', function () {
                _this.setValue(parseInt(_this.seekNumber.value));
            });
            this.seekRange.addEventListener('input', function () {
                _this.setValue(parseInt(_this.seekRange.value));
            });
            this.seekNumber.addEventListener('input', function () {
                _this.setValue(parseInt(_this.seekNumber.value));
            });
            this.fpsInput.addEventListener('change', function () {
                let fps = parseInt(_this.fpsInput.value);
                if(fps <= 0) _this.fpsInput.value = "1";
                if(fps > 100) _this.fpsInput.value = "100";
            });
            this.firstButton.addEventListener('click', function () {
                _this.stop();
                _this.setValue(_this.getMin());
            });
            this.prevButton.addEventListener('click', function () {
                _this.stop();
                _this.setValue(_this.getValue() - 1);
            });
            this.nextButton.addEventListener('click', function () {
                _this.stop();
                if(!is_moving) _this.setValue(_this.getValue() + 1);
            });
            this.lastButton.addEventListener('click', function () {
                _this.stop();
                _this.setValue(_this.getMax());
            });
            this.reloadButton.addEventListener('click', function() {
                location.reload();
            });
            this.playClosure = function () {
                _this.play();
            };
            this.stopClosure = function () {
                _this.stop();
            };
            this.playButton.addEventListener('click', this.playClosure);
        }
        RichSeekBar.prototype.setMinMax = function (min, max) {
            this.seekRange.min = this.seekNumber.min = min.toString();
            this.seekRange.max = this.seekNumber.max = max.toString();
            this.seekRange.step = this.seekNumber.step = '1';
            this.setValue(min);
        };
        RichSeekBar.prototype.getMin = function () {
            return parseInt(this.seekRange.min);
        };
        RichSeekBar.prototype.getMax = function () {
            return parseInt(this.seekRange.max);
        };
        RichSeekBar.prototype.setValue = function (value) {
            value = Math.max(this.getMin(), Math.min(this.getMax(), value)); // clamp
            var preValue = this.seekNumber.valueAsNumber;
            this.seekRange.value = this.seekNumber.value = value.toString();
            if (this.callback !== undefined) {
                this.callback(value, preValue);
            }
        };
        RichSeekBar.prototype.getValue = function () {
            return parseInt(this.seekRange.value);
        };
        RichSeekBar.prototype.getDelay = function () {
            let fps = parseInt(this.fpsInput.value);
            if(fps >= 100) return 1;
            return 1000 / fps;
        };
        RichSeekBar.prototype.play = async function () {
            var _this = this;
            this.playButton.removeEventListener('click', this.playClosure);
            this.playButton.addEventListener('click', this.stopClosure);
            this.runIcon.classList.remove('play');
            this.runIcon.classList.add('stop');
            if (this.getValue() == this.getMax()) { // if last, go to first
                this.setValue(this.getMin());
            }
            async function interval_move(){
                if (_this.getValue() == _this.getMax()) {
                    _this.stop();
                }
                else {
                    const cur = frames[_this.getValue()];
                    const next = frames[_this.getValue() + 1];
                    const delay = _this.getDelay();
                    //だいたいdelay[ms]使って動かす
                    await swap_motion(cur.pos, next.pos, delay, cur.board);
                    _this.setValue(_this.getValue() + 1);
                }
            }
            //再生ボタンがオンになっている限り、操作を続ける
            is_moving = true;
            while(is_moving) await interval_move();
        };
        RichSeekBar.prototype.stop = function () {
            this.playButton.removeEventListener('click', this.stopClosure);
            this.playButton.addEventListener('click', this.playClosure);
            this.runIcon.classList.remove('stop');
            this.runIcon.classList.add('play');
            is_moving = false;
        };
        return RichSeekBar;
    }());
    framework.RichSeekBar = RichSeekBar;
})(framework || (framework = {}));
var visualizer;
(function (visualizer) {
    var Visualizer = /** @class */ (function () {
        function Visualizer() {}
        Visualizer.prototype.draw = function (cur) {
            console.log(cur);
            if(cur >= frames.length){
                alert("length error");
                return;
            }
            const board = frames[cur].board;
            let pos = 0;
            for(let i = 0; i < height; i++){
                for(let j = 0; j < width; j++){
                    let img = document.getElementById(pos);
                    img.src = "./imagesdata/"+image_val+"/" + board[pos] + ".png";
                    img.style.border = "none";
                    const val = rotate_cmd[recover_pos[board[pos]]];
                    img.style.transform = "rotate(" + val*90 + "deg)";
                    img.style.zIndex = 0; //背面に持ってくる

                    if(recover_pos[board[pos]] != pos++) continue;
                    img.style.border = "2px solid blue";
                    for(let r = 0; r < 4; r++){
                        const y = i + dy[r];
                        const x = j + dx[r];
                        if(y < 0 || x < 0 || y >= height || x >= width) continue;
                        const pos = y*width + x;
                        if(recover_pos[board[pos]] == pos){
                            if(r == 0) img.style.borderTop = "none";
                            if(r == 1) img.style.borderLeft = "none";
                            if(r == 2) img.style.borderBottom = "none";
                            if(r == 3) img.style.borderRight = "none";
                        }
                    }
                }
            }
            let selecting = document.getElementById(frames[cur].pos);
            selecting.style.border = "1px solid red";
            selecting.style.zIndex = 10; //前面に持ってくる
        };
        return Visualizer;
    }());
    var App = /** @class */ (function () {
        function App() {
            var _this = this;
            this.visualizer = new Visualizer();
            this.seek = new framework.RichSeekBar(function (curValue, preValue) {
                _this.visualizer.draw(curValue);
            });
        }
        return App;
    }());
    visualizer.App = App;
})(visualizer || (visualizer = {}));
window.onload = function () {
    new visualizer.App();
};
