const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
	constructor(field) {
		this.field = field;
		this.playerLocation = new Array();
		this.stopGame = false;
	}

	//Check player location on the field and prints it
	print() {
		this.field[this.playerLocation[0]][this.playerLocation[1]] = pathCharacter;
		for (let i = 0; i < this.field.length; i++) {
			console.log(this.field[i].join(''));
		}
	}

	//ask direction and updates playerLocation
	askLocation() {
		let location = prompt('Wich way? ');

		switch (location.toLowerCase()) {
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

	//check what is the location and stop the game if neccesary
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

	//loops the game until its finished
	loopGame() {
		while (!this.stopGame) {
			this.print();
			this.askLocation();
			this.testLocation();
		}
	}

	//looks for the starting point and save it in the object`s attribute
	locatePlayer() {
		for (let i = 0; i < this.field.length; i++) {
			for (let j = 0; j < this.field[i].length; j++) {
				if (this.field[i][j] == pathCharacter) {
					this.playerLocation.push(i);
					this.playerLocation.push(j);
				}
			}
		}
	}

	//Is used as the constructor`s parameter
	static generateField(height, width, difficulty) {
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

		while (matriz[randomHeight][randomWidth] === pathCharacter) {
			randomHeight = Math.floor(Math.random() * height);
			randomWidth = Math.floor(Math.random() * width);
		}

		matriz[randomHeight][randomWidth] = hat;

		//Randomly assigning number of holes based on difficulty
		for (let i = 0; i < difficulty; i++) {
			while (
				matriz[randomHeight][randomWidth] == pathCharacter ||
				matriz[randomHeight][randomWidth] == hat ||
				matriz[randomHeight][randomWidth] == hole
			) {
				randomHeight = Math.floor(Math.random() * height);
				randomWidth = Math.floor(Math.random() * width);
			}

			matriz[randomHeight][randomWidth] = hole;
		}

		return matriz;
	}

	/* Checks if the maze cab be solved based on random mouse Random mouse algorithm, 
	if there are 100,000 movements and it has not been resolved yet, it will validate it as false */

	canFieldBeSolved() {
		let coordinates = this.playerLocation.slice();
		let i = 0;

		do {
			let destination = coordinates.slice();
			let randomDirection = Math.floor(Math.random() * 4);

			switch (randomDirection) {
				case 0:
					destination[0]++;
					break;
				case 1:
					destination[0]--;
					break;
				case 2:
					destination[1]++;
					break;
				case 3:
					destination[1]--;
					break;
			}
			if (
				destination[0] <= -1 ||
				destination[1] <= -1 ||
				this.field[destination[0]] === undefined ||
				this.field[destination[0]][destination[1]] === undefined ||
				this.field[destination[0]][destination[1]] === hole
			) {
				i++;
			} else if (this.field[destination[0]][destination[1]] === hat) {
				return true;
			} else if (
				this.field[destination[0]][destination[1]] === fieldCharacter ||
				this.field[destination[0]][destination[1]] === pathCharacter
			) {
				coordinates = destination;
				i++;
			}
		} while (i < 100000);
		return false;
	}

	//Ask for level and returns an array with height, width and number of holes based on difficulty
	static askLevel() {
		let height;
		let width;
		let difficulty;

		let choice = prompt('Select level of difficulty (1 - 2 - 3): ');

		while (choice != '1' && choice != '2' && choice != '3') {
			choice = prompt('Ouch! You have to select one of these three levels (1 - 2 - 3): ');
		}

		switch (choice) {
			case '1':
				console.log('-- EASY MODE --');
				height = 3;
				width = 3;
				difficulty = 2;
				break;
			case '2':
				console.log('-- NORMAL MODE --');
				height = 4;
				width = 4;
				difficulty = 5;
				break;
			case '3':
				console.log('-- HARD MODE --');
				height = 5;
				width = 5;
				difficulty = 12;
				break;
		}

		let arr = [];
		arr.push(height);
		arr.push(width);
		arr.push(difficulty);

		return arr;
	}

	//Creats an obj with random field, it calls recursivity if the maze cannot be solved
	static startGame(arr) {
		let game = new Field(Field.generateField(arr[0], arr[1], arr[2]));
		game.locatePlayer();

		if (!game.canFieldBeSolved()) {
			Field.startGame(arr);
		}
		return game;
	}
}

const arr = Field.askLevel();

let game = Field.startGame(arr);
game.loopGame();
