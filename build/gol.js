/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Game Of Life with Canvas

// export default class GameOfLife {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameOfLife = function () {
	function GameOfLife(canvas, bufCanvas, col, row, cellSize, fps) {
		_classCallCheck(this, GameOfLife);

		this.canvas = canvas;
		this.bufCanvas = bufCanvas;
		this.col = col;
		this.row = row;
		this.cellSize = cellSize;
		this.fps = fps;
		this.timerId = null;
		this.map = null;
		this.tmpMap = null;

		this.backgroundColor = '#000';
		this.foregroundColor = '#ff0';

		this.context = this.initCanvas(canvas);
		this.bufContext = this.initCanvas(bufCanvas);
		bufCanvas.style.display = 'none';
		bufCanvas.style.visibility = 'hidden';

		this.initMap();
		this.initClickEvent();
	}

	_createClass(GameOfLife, [{
		key: 'initCanvas',
		value: function initCanvas(canvas) {
			canvas.width = this.col * this.cellSize;
			canvas.height = this.row * this.cellSize;
			return canvas.getContext('2d');
		}
	}, {
		key: 'initMap',
		value: function initMap() {
			var map = [];
			var tmpMap = [];
			for (var i = 0; i < this.row; i++) {
				map[i] = [];
				tmpMap[i] = [];
				for (var j = 0; j < this.col; j++) {
					map[i][j] = 0;
					tmpMap[i][j] = 0;
				}
			}
			this.map = map;
			this.tmpMap = tmpMap;

			// for test
			this.putMap(2, 1, [[1], [1], [1]]);
		}
	}, {
		key: 'start',
		value: function start() {
			var _this = this;

			var frameTime = 1000.0 / this.fps;
			console.log('progress time: ' + frameTime);
			this.timerId = window.setInterval(function () {
				_this.onDraw();
				_this.onProgress();
			}, frameTime);
		}
	}, {
		key: 'stop',
		value: function stop() {
			window.clearInterval(this.timerId);
		}
	}, {
		key: 'onDraw',
		value: function onDraw() {
			// console.log('onDraw');
			var c = this.bufContext;
			var map = this.map;

			c.beginPath();
			c.fillStyle = this.backgroundColor;
			c.fillRect(0, 0, this.bufCanvas.width, this.bufCanvas.height);

			c.fillStyle = this.foregroundColor;
			var rowMax = this.row;
			var colMax = this.col;
			var cellSize = this.cellSize;
			for (var row = 0; row < rowMax; row++) {
				for (var col = 0; col < colMax; col++) {
					if (map[row][col] === 1) {
						var x = cellSize * col;
						var y = cellSize * row;
						c.beginPath();
						c.fillRect(x, y, cellSize, cellSize);
					}
				}
			}

			this.context.drawImage(this.bufCanvas, 0, 0, this.canvas.width, this.canvas.height);
		}
	}, {
		key: 'onProgress',
		value: function onProgress() {
			// console.log('onProgress');
			var map = this.map;
			var tmpMap = this.tmpMap;
			var colMax = this.col;
			var rowMax = this.row;

			// init tmpMap.
			for (var r = 0; r < rowMax; r++) {
				for (var c = 0; c < colMax; c++) {
					tmpMap[r][c] = map[r][c];
					// map[r][c] = 0;
				}
			}

			for (var _r = 0; _r < rowMax; _r++) {
				for (var _c = 0; _c < colMax; _c++) {
					var current = tmpMap[_r][_c];
					var living = this._getLivingCellCount(tmpMap, _c, _r, 0, 0, colMax, rowMax);
					if (current === 0) {
						if (living === 3) {
							map[_r][_c] = 1;
						}
					} else {
						if (living < 2) {
							map[_r][_c] = 0;
						} else if (living < 4) {
							map[_r][_c] = 1;
						} else {
							map[_r][_c] = 0;
						}
					}
				}
			}
		}
	}, {
		key: '_getLivingCellCount',
		value: function _getLivingCellCount(map, col, row, colMin, rowMin, colMax, rowMax) {
			var count = 0;
			for (var i = -1; i <= 1; i++) {
				var r = row + i;
				for (var j = -1; j <= 1; j++) {
					var c = col + j;
					if (colMin <= c && c < colMax && rowMin <= r && r < rowMax && !(i == 0 && j == 0)) {
						// inside of map.
						if (map[r][c] !== 0) count++;
					} else {
						// outside of map.
					}
				}
			}
			return count;
		}
	}, {
		key: 'putMap',
		value: function putMap(col, row, mapData) {
			var mapDataColMax = mapData[0].length;
			var mapDataRowMax = mapData.length;
			var colMax = this.col;
			var rowMax = this.row;
			var map = this.map;

			for (var r = 0; r < mapDataRowMax; r++) {
				for (var c = 0; c < mapDataColMax; c++) {
					var targetCol = c + col;
					var targetRow = r + row;
					var val = mapData[r][c];
					if (0 <= targetCol && targetCol < colMax && 0 <= targetRow && targetRow < rowMax && val != null) {
						map[targetRow][targetCol] = val;
					}
				}
			}
		}
	}, {
		key: 'initClickEvent',
		value: function initClickEvent() {
			var _this2 = this;

			var canvas = this.canvas;
			canvas.addEventListener('click', function (e) {
				var x = e.offsetX != null ? e.offsetX : e.layerX;
				var y = e.offsetY != null ? e.offsetY : e.layerY;
				var col = Math.floor(x / _this2.cellSize);
				var row = Math.floor(y / _this2.cellSize);
				// console.log(`pos:${x},${y} col:${col} row:${row}`);
				_this2.onClick(col, row);
				e.preventDefault();
				return false;
			});
		}
	}, {
		key: 'onClick',
		value: function onClick(col, row) {
			this.putMap(col, row, [[1, 1, 1], [1, 0, 0], [0, 1, 0]]);
		}
	}]);

	return GameOfLife;
}();

window.GameOfLife = GameOfLife;

/***/ })
/******/ ]);