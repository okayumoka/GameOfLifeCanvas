'use strict';
// Game Of Life with Canvas

// export default class GameOfLife {
class GameOfLife {

	constructor(canvas, bufCanvas, col, row, cellSize, fps) {
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

	initCanvas(canvas) {
		canvas.width = this.col * this.cellSize;
		canvas.height = this.row * this.cellSize;
		return canvas.getContext('2d');
	}

	initMap() {
		let map = [];
		let tmpMap = [];
		for (let i = 0; i < this.row; i++) {
			map[i] = [];
			tmpMap[i] = [];
			for (let j = 0; j < this.col; j++) {
				map[i][j] = 0;
				tmpMap[i][j] = 0;
			}
		}
		this.map = map;
		this.tmpMap = tmpMap; 

		// for test
		this.putMap(2, 1, [
			[1],
			[1],
			[1]
		]);
	}

	start() {
		let frameTime = 1000.0 / this.fps;
		console.log('progress time: ' + frameTime);
		this.timerId = window.setInterval(() => {
			this.onDraw();
			this.onProgress();
		}, frameTime);
	}

	stop() {
		window.clearInterval(this.timerId);
	}

	onDraw() {
		// console.log('onDraw');
		let c = this.bufContext;
		let map = this.map;

		c.beginPath();
		c.fillStyle = this.backgroundColor;
		c.fillRect(0, 0, this.bufCanvas.width, this.bufCanvas.height)

		c.fillStyle = this.foregroundColor;
		let rowMax = this.row;
		let colMax = this.col;
		let cellSize = this.cellSize;
		for (let row = 0; row < rowMax; row++) {
			for (let col = 0; col < colMax; col++) {
				if (map[row][col] === 1) {
					let x = cellSize * col;
					let y = cellSize * row;
					c.beginPath();
					c.fillRect(x, y, cellSize, cellSize)
				}
			}
		}

		this.context.drawImage(this.bufCanvas, 0, 0, this.canvas.width, this.canvas.height);
	}

	onProgress() {
		// console.log('onProgress');
		let map = this.map;
		let tmpMap = this.tmpMap;
		let colMax = this.col;
		let rowMax = this.row;

		// init tmpMap.
		for (let r = 0; r < rowMax; r++) {
			for (let c = 0; c < colMax; c++) {
				tmpMap[r][c] = map[r][c];
				// map[r][c] = 0;
			}
		}

		for (let r = 0; r < rowMax; r++) {
			for (let c = 0; c < colMax; c++) {
				let current = tmpMap[r][c];
				let living = this._getLivingCellCount(tmpMap, c, r, 0, 0, colMax, rowMax);
				if (current === 0) {
					if (living === 3) {
						map[r][c] = 1;
					}
				} else {
					if (living < 2) {
						map[r][c] = 0;
					} else if (living < 4) {
						map[r][c] = 1;
					} else {
						map[r][c] = 0;
					}
				}
			}
		}

	}

	_getLivingCellCount(map, col, row, colMin, rowMin, colMax, rowMax) {
		let count = 0;
		for (let i = -1; i <= 1; i++) {
			let r = row + i;
			for (let j = -1; j <= 1; j++) {
				let c = col + j;
				if (colMin <= c && c < colMax
					&& rowMin <= r && r < rowMax
					&& !(i == 0 && j == 0) ) {
					// inside of map.
					if (map[r][c] !== 0) count++;
				} else {
					// outside of map.
				}
			}
		}
		return count;
	}

	putMap(col, row, mapData) {
		let mapDataColMax = mapData[0].length;
		let mapDataRowMax = mapData.length;
		let colMax = this.col;
		let rowMax = this.row;
		let map = this.map;

		for (let r = 0; r < mapDataRowMax; r++) {
			for (let c = 0; c < mapDataColMax; c++) {
				let targetCol = c + col;
				let targetRow = r + row;
				let val = mapData[r][c];
				if (0 <= targetCol && targetCol < colMax &&
					0 <= targetRow && targetRow < rowMax &&
					val != null) {
					map[targetRow][targetCol] = val;
				}
			}
		}
	}

	initClickEvent() {
		let canvas = this.canvas;
		canvas.addEventListener('click', (e) => {
			let x = e.offsetX != null ? e.offsetX : e.layerX;
			let y = e.offsetY != null ? e.offsetY : e.layerY;
			let col = Math.floor(x / this.cellSize);
			let row = Math.floor(y / this.cellSize);
			// console.log(`pos:${x},${y} col:${col} row:${row}`);
			this.onClick(col, row);
			e.preventDefault();
			return false;
		});
	}

	onClick(col, row) {
		this.putMap(col, row, [
			[1, 1, 1],
			[1, 0, 0],
			[0, 1, 0]
		]);
	}

}
window.GameOfLife = GameOfLife;

