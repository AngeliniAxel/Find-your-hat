const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
	constructor(field) {
		this.field = field;
		this.playerLocation = [0, 0];
		this.stopGame = false;
	}

	print() {
		this.field[this.playerLocation[0]][this.playerLocation[1]] = pathCharacter;
		for (let i = 0; i < this.field.length; i++) {
			console.log(this.field[i].join(''));
		}
	}

	askLocation() {
		const location = prompt('Wich way? ');
		switch (location) {
			case 'u':
				this.playerLocation[0]--;
				break;
			case 'd':
				this.playerLocation[0]++;
				break;
			case 'l':
				this.playerLocation[1]--;
				break;
			case 'r':
				this.playerLocation[1]++;
				break;
			default:
				console.log('Out of bounds instructions! Use U D L or R');
				this.askLocation();
				break;
		}
	}

	testLocation() {
		if (
			this.playerLocation[1] < 0 ||
			this.playerLocation[0] < 0 ||
			this.playerLocation[0] >= this.field.length
		) {
			console.log('Ouch! You went off the map!!');
			this.stopGame = true;
		} else if (this.field[this.playerLocation[0]][this.playerLocation[1]] == hat) {
			console.log('Great job! You found your hat!!!');
			this.stopGame = true;
		} else if (this.field[this.playerLocation[0]][this.playerLocation[1]] == hole) {
			console.log('Sorry! You fell down a hole!!');
			this.stopGame = true;
		} else {
			for (let i = 0; i < this.field.length; i++) {
				if (this.playerLocation[1] >= this.field.length) {
					console.log('Ouch! You went off the map!!');
					this.stopGame = true;
					break;
				}
			}
		}
	}

	loopGame() {
		while (!this.stopGame) {
			this.print();
			this.askLocation();
			this.testLocation();
		}
	}

	static generateField(height, width) {
		let arr = [];
		let matriz = [];
		let randomHeight;
		let randomWidth;

		// Creating plain field

		for (let i = 0; i < width; i++) {
			arr.push(fieldCharacter);
		}
		for (let i = 0; i < height; i++) {
			matriz.push([...arr]);
		}

		//Creating random start point and hat and validating they are not the same place

		randomHeight = Math.floor(Math.random() * height);
		randomWidth = Math.floor(Math.random() * width);
		matriz[randomHeight][randomWidth] = pathCharacter;

		while (matriz[randomHeight][randomHeight] == pathCharacter) {
			randomHeight = Math.floor(Math.random() * height);
			randomWidth = Math.floor(Math.random() * width);
		}

		matriz[randomHeight][randomWidth] = hat;

		return matriz;
		//console.log(matriz);
	}

	static startGame() {
		//let height = prompt('height: ');
		//let width = prompt('width: ');

		const game = new Field(Field.generateField(height, width));

		game.loopGame();
	}
}

Field.startGame();
