"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var framework;
(function (framework) {
    var FileParser = /** @class */ (function () {
        function FileParser(filename, content) {
            this.filename = filename;
            this.content = [];
            for (var _i = 0, _a = content.trim().split('\n'); _i < _a.length; _i++) {
                var line = _a[_i];
                var words = line.trim().split(new RegExp('\\s+'));
                this.content.push(words);
            }
            this.y = 0;
            this.x = 0;
        }
        FileParser.prototype.isEOF = function () {
            return this.content.length <= this.y;
        };
        FileParser.prototype.isNewLine = function () {
            return this.y < this.content.length && this.x === this.content[this.y].length;
        };
        FileParser.prototype.getWord = function () {
            if (this.isEOF()) {
                this.reportError('a word expected, but EOF');
            }
            if (this.content[this.y].length <= this.x) {
                this.reportError('a word expected, but newline');
            }
            var word = this.content[this.y][this.x];
            this.x += 1;
            return word;
        };
        FileParser.prototype.getInt = function () {
            var word = this.getWord();
            if (!word.match(new RegExp('^[-+]?[0-9]+$'))) {
                this.reportError("a number expected, but word " + JSON.stringify(this.content[this.y][this.x]));
            }
            return parseInt(word);
        };
        FileParser.prototype.getNewline = function () {
            if (this.isEOF()) {
                this.reportError('newline expected, but EOF');
            }
            if (this.x < this.content[this.y].length) {
                this.reportError("newline expected, but word " + JSON.stringify(this.content[this.y][this.x]));
            }
            this.x = 0;
            this.y += 1;
        };
        FileParser.prototype.reportError = function (msg) {
            msg = this.filename + ": line " + (this.y + 1) + ": " + msg;
            alert(msg);
            throw new Error(msg);
        };
        return FileParser;
    }());
    framework.FileParser = FileParser;
    var FileSelector = /** @class */ (function () {
        function FileSelector(callback) {
            var _this = this;
            this.callback = callback;
            this.inputFile = document.getElementById("inputFile");
            this.outputFile = document.getElementById("outputFile");
            this.reloadButton = document.getElementById("reloadButton");
            this.reloadFilesClosure = function () {
                _this.reloadFiles();
            };
            this.inputFile.addEventListener('change', this.reloadFilesClosure);
            this.outputFile.addEventListener('change', this.reloadFilesClosure);
            this.reloadButton.addEventListener('click', this.reloadFilesClosure);
            this.reloadFilesClosure();
            this.inputFile.addEventListener('click', function () {
                _this.inputFile.value = "";
            });
            this.outputFile.addEventListener('click', function () {
                _this.outputFile.value = "";
            });
        }
        FileSelector.prototype.reloadFiles = function () {
            var _this = this;
            if (this.inputFile.files == null || this.inputFile.files.length == 0)
                return;
            loadFile(this.inputFile.files[0], function (inputContent) {
                if (_this.outputFile.files == null || _this.outputFile.files.length == 0)
                    return;
                loadFile(_this.outputFile.files[0], function (outputContent) {
                    _this.reloadButton.classList.remove('disabled');
                    if (_this.callback !== undefined) {
                        _this.callback(inputContent, outputContent);
                    }
                });
            });
        };
        return FileSelector;
    }());
    framework.FileSelector = FileSelector;
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
            this.runIcon = document.getElementById("runIcon");
            this.intervalId = null;
            this.moving = false; //playボタンで再生中かどうか
            //this.setMinMax(-1, -1);
            this.setMinMax(0, 3779); //ここで操作回数を指定する
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
                if (_this.intervalId !== null) {
                    _this.play();
                }
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
                _this.setValue(_this.getValue() + 1);
            });
            this.lastButton.addEventListener('click', function () {
                _this.stop();
                _this.setValue(_this.getMax());
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
            //return Math.floor(1000 / fps);
            return 1000 / fps;
        };
        RichSeekBar.prototype.resetInterval = function () {
            // if (this.intervalId) {
            //     clearInterval(this.intervalId);
            //     this.intervalId = null;
            // }
            this.moving = false;
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
            this.resetInterval();
            async function interval_move(){
                if (_this.getValue() == _this.getMax()) {
                    _this.stop();
                }
                else {
                    const cur = frames[_this.getValue()];
                    const next = frames[_this.getValue() + 1];
                    const delay = _this.getDelay();
                    //だいたいdelay[ms]使って動かす
                    await swap_motion(cur.y, cur.x, next.y, next.x, delay);
                    _this.setValue(_this.getValue() + 1);
                }
            }
            //再生ボタンがオンになっている限り、操作を続ける
            this.moving = true;
            while(this.moving){
                await interval_move();
            }
            // this.intervalId = setInterval(async function () {
            //     if (_this.getValue() == _this.getMax()) {
            //         _this.stop();
            //     }
            //     else {
            //         let cur = _this.getValue();
            //         let delay = _this.getDelay() / (66 / 2);
            //         await swap_motion(frames[cur].y, frames[cur].x, frames[cur+1].y, frames[cur+1].x, delay);
            //         _this.setValue(_this.getValue() + 1);
            //     }
            // //}, this.getDelay());
            // }, 0);
        };
        RichSeekBar.prototype.stop = function () {
            this.playButton.removeEventListener('click', this.stopClosure);
            this.playButton.addEventListener('click', this.playClosure);
            this.runIcon.classList.remove('stop');
            this.runIcon.classList.add('play');
            this.resetInterval();
        };
        return RichSeekBar;
    }());
    framework.RichSeekBar = RichSeekBar;
    var loadFile = function (file, callback) {
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = function () {
            if (typeof reader.result == 'string')
                callback(reader.result);
        };
    };
    var saveUrlAsLocalFile = function (url, filename) {
        var anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        var evt = document.createEvent('MouseEvent');
        evt.initEvent("click", true, true);
        anchor.dispatchEvent(evt);
    };
    var FileExporter = /** @class */ (function () {
        function FileExporter(canvas) {
            var saveAsImage = document.getElementById("saveAsImage");
            saveAsImage.addEventListener('click', function () {
                saveUrlAsLocalFile(canvas.toDataURL('image/png'), 'canvas.png');
            });
        }
        return FileExporter;
    }());
    framework.FileExporter = FileExporter;
})(framework || (framework = {}));
var visualizer;
(function (visualizer) {
    function isInside(value, min, max) {
        return min <= value && value <= max;
    }
    var Vege = /** @class */ (function () {
        function Vege(R, C, S, E, V) {
            this.R = R;
            this.C = C;
            this.S = S;
            this.E = E;
            this.V = V;
        }
        return Vege;
    }());
    var InputFile = /** @class */ (function () {
        function InputFile(content) {
            this.veges = [];
            var parser = new framework.FileParser('<input-file>', content);
            this.N = parser.getInt();
            this.M = parser.getInt();
            this.T = parser.getInt();
            parser.getNewline();
            for (var i = 0; i < this.M; i++) {
                var r = parser.getInt();
                var c = parser.getInt();
                var s = parser.getInt();
                var t = parser.getInt();
                var v = parser.getInt();
                parser.getNewline();
                this.veges.push(new Vege(r, c, s, t, v));
            }
        }
        return InputFile;
    }());
    var OutputFile = /** @class */ (function () {
        function OutputFile(content, inputFile) {
            this.commands = [];
            var parser = new framework.FileParser('<output-file>', content);
            var rows = content.trim().split("\n");
            if (rows.length !== inputFile.T) {
                var msg = "<output-file> invalid number of lines";
                alert(msg);
                throw new Error(msg);
            }
            for (var i = 0; i < inputFile.T; i++) {
                var command = [];
                while (!parser.isEOF() && !parser.isNewLine()) {
                    command.push(parser.getInt());
                }
                if (command.length === 1) {
                    if (command[0] !== -1) {
                        parser.reportError("invalid output");
                    }
                }
                else if (command.length === 2) {
                    if (command.some(function (v) { return !isInside(v, 0, inputFile.N - 1); })) {
                        parser.reportError("value out of range");
                    }
                }
                else if (command.length === 4) {
                    if (command.some(function (v) { return !isInside(v, 0, inputFile.N - 1); })) {
                        parser.reportError("value out of range");
                    }
                }
                else {
                    parser.reportError("invalid output");
                }
                this.commands.push(command);
                if (i < inputFile.T) {
                    parser.getNewline();
                }
            }
            if (!parser.isEOF()) {
                parser.reportError("too many output");
            }
        }
        return OutputFile;
    }());
    var TesterFrame = /** @class */ (function () {
        function TesterFrame(board, y, x) {
            //this.board = board;
            //this.y = y;
            //sthis.x = x;
        }
        return TesterFrame;
    }());
    var Tester = /** @class */ (function () {
        function Tester(inputContent, outputContent) {
            function error(row, msg) {
                msg = "<output-file>: line " + (row + 1) + ": " + msg;
                alert(msg);
                throw new Error(msg);
            }
            //var input = new InputFile(inputContent);
            //var output = new OutputFile(outputContent, input);
        }
        return Tester;
    }());
    var Visualizer = /** @class */ (function () {
        function Visualizer() {
            this.canvas = document.getElementById("canvas");
            // adjust resolution
            this.dpr = window.devicePixelRatio || 1;
            var height = this.canvas.height;
            var width = this.canvas.width;
            this.canvas.style.height = height + 'px';
            this.canvas.style.width = width + 'px';
            this.height = this.canvas.height = height * this.dpr; // pixels
            this.width = this.canvas.width = width * this.dpr; // pixels
            this.offset = 10 * this.dpr; // pixels
            this.moneyInput = document.getElementById("moneyInput");
            this.actionInput = document.getElementById("actionInput");
            this.machinesInput = document.getElementById("machinesInput");
            this.priceInput = document.getElementById("priceInput");
            this.logArea = document.getElementById("logArea");
        }
        Visualizer.prototype.draw = async function (frame, pre) {
            console.log(frame);
            //移動情報をファイルから受け取る
            if(frame > n){
                alert("length error");
                return;
            }
            let board = frames[frame].board;
            for(let i = 0; i < height; i++){
                for(let j = 0; j < width; j++){
                    let img = document.getElementById(i + "_" + j);
                    img.src = "./images/" + board[i][j][0] + "_" + board[i][j][1] + ".png";
                    img.style.border = "none";
                    img.style.zIndex = 0;
                }
            }
            let selecting = document.getElementById(frames[frame].y + "_" + frames[frame].x);
            selecting.style.border = "1px solid red";
            selecting.style.zIndex = 10;
        };
        Visualizer.prototype.init_draw = function() {
            rotate_imgs_motion(rotate_cmd);
        }
        Visualizer.prototype.getCanvas = function () {
            return this.canvas;
        };
        return Visualizer;
    }());
    var App = /** @class */ (function () {
        function App() {
            var _this = this;
            this.tester = null;
            this.visualizer = new Visualizer();
            this.exporter = new framework.FileExporter(this.visualizer.getCanvas());
            this.seek = new framework.RichSeekBar(function (curValue, preValue) {
                _this.visualizer.draw(curValue, preValue);
                //if (_this.tester) {
                //    _this.visualizer.draw(_this.tester.frames[curValue]);
                //}
            });
            this.loader = new framework.FileSelector(function (inputContent, outputContent) {
                _this.tester = new Tester(inputContent, outputContent);
                _this.seek.setMinMax(0, _this.tester.frames.length - 1);
                _this.seek.setValue(0);
                //_this.visualizer.draw(_this.tester.frames[0]);
                _this.visualizer.draw(0);
                _this.visualizer.init_draw();
            });
        }
        return App;
    }());
    visualizer.App = App;
})(visualizer || (visualizer = {}));
window.onload = function () {
    new visualizer.App();
};
//# sourceMappingURL=index.js.map