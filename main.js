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
		console.log(this.playerLocation);
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
}

const myField = new Field([
	['*', '░', '░'],
	['░', 'O', '░'],
	['░', '^', '░'],
]);

myField.loopGame();
