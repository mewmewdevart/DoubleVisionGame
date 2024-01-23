// Constants for image sources
const IMAGE_SOURCES = [
	'./assets/images/icon_00.png',
	'./assets/images/icon_01.png',
	'./assets/images/icon_02.png',
	'./assets/images/icon_03.png',
	'./assets/images/icon_04.png',
];

// DOM elements
const START_SCREEN = document.getElementById('game-start-screen');
const GAMEPLAY_SCREEN = document.getElementById('gameplay-screen');
const TUTORIAL_SCREEN = document.getElementById('tutorial-screen');
const SCORE_ELEMENT = document.getElementById('gameScore');
const TIMER_ELEMENT = document.getElementById('gameTimer');

const VICTORY_SCREEN = document.getElementById('victory-screen');
const VICTORY_PHRASE = document.getElementById('congratulationsMessage');
const WINSCORE_ELEMENT = document.getElementById('victoryScore');
const LOSE_SCREEN = document.getElementById('lose-screen');

// Congratulatory phrases displayed at the end of the game
const CONGRATULATORY_PHRASES = [
	"Congratulations, you are a Perfectionist",
	"Glorious Champion: Your Skills Know No Bounds!",
	"Eyes of Tandera: You've Transcended the Game!",
];

// Game state variables
let randomChosenImage;
let arrRandomImages;
let score = 0;
let timer = 10;
let timerInterval;

// Initial positions of game blocks
const BLOCK_POSITIONS_EASY = [
	{ left: 175, top: 30 },
	{ left: 100, top: 275 },
	{ left: 300, top: 200 },
];

// Event listener for key press to start the game
document.addEventListener('keydown', function (event) {
	START_SCREEN.style.display = 'none';
	TUTORIAL_SCREEN.style.display = 'flex';

	// Set a timeout to reset the page after 5 seconds
	setTimeout(() => {
	gameStart();
	}, 5000);
});

// Function to start the game
function gameStart() {
	TUTORIAL_SCREEN.style.display = 'none';
	GAMEPLAY_SCREEN.style.display = 'flex';

	// Call updateTimer immediately to display the initial value of the timer
	updateTimer();

	// Start the timer interval
	timerInterval = setInterval(updateTimer, 1000);
}

// Function to update the displayed timer
function updateTimer() {
	// Decrease the timer
	timer--;

	// Update the displayed timer after decrementing
	TIMER_ELEMENT.textContent = `${timer}s`;

	// Check if the timer has reached 0
	if (timer === 0) {
	clearInterval(timerInterval);

	// Determine whether to show the lose or victory screen
	if (score <= 0)
		loseScreenDisplay();
	else
		victoryScreenDisplay();
	}
}

// Get a random image that is not in the existing set
function getRandomImage(existingImages) {
	const availableImages = IMAGE_SOURCES.filter(img => !existingImages.includes(img));
	const randomIndex = Math.floor(Math.random() * availableImages.length);
	return availableImages[randomIndex];
}

// Choose a random image for the game
function chooseRandomImage() {
	randomChosenImage = getRandomImage([]);
	arrRandomImages = IMAGE_SOURCES.filter(img => img !== randomChosenImage);
}

// Shuffle the block positions
function shuffleBlockPositions(blockPositions) {
	const shuffledPositions = [...blockPositions];

	for (let i = shuffledPositions.length - 1; i > 0; i--) {
	const j = Math.floor(Math.random() * (i + 1));
	[shuffledPositions[i], shuffledPositions[j]] = [shuffledPositions[j], shuffledPositions[i]];
	}
	return shuffledPositions;
}

// Insert random images into the specified container
function insertRandomImages(localDivClass) {
	const localDiv = document.querySelector(`.${localDivClass}`);
	const blocks = localDiv.querySelectorAll('.block');
	const existingImages = [];
	const newBlockPositions = shuffleBlockPositions(BLOCK_POSITIONS_EASY);

	blocks.forEach((block, i) => {
	const img = document.createElement('img');
	let randomImage;

	if (i === 0) {
		randomImage = randomChosenImage;
	} else {
		randomImage = getRandomImage(existingImages);
		arrRandomImages = arrRandomImages.filter(img => img !== randomImage);
	}

	// Update position based on the blockPositions array
	const position = newBlockPositions[i % newBlockPositions.length];
	block.style.left = `${position.left}px`;
	block.style.top = `${position.top}px`;
	img.addEventListener('click', () => {
		if (randomImage === randomChosenImage) {
		// Increment the score by 10 only if the clicked image matches the chosen image
		score += 10;
		if (score > 0)
			SCORE_ELEMENT.style.color = '#fff';
		SCORE_ELEMENT.textContent = score.toString();
		initData();
		} else {
		score -= 10;
		SCORE_ELEMENT.textContent = score.toString();
		if (score <= 0)
			SCORE_ELEMENT.style.color = '#ff9898';
		if (score < -30)
			loseScreenDisplay();
		}
	});
	// Set image attributes and append to the block
	img.src = randomImage;
	img.alt = `Icon ${i}`;
	img.style.width = '100%';
	img.style.height = '100%';

	block.innerHTML = '';
	block.appendChild(img);

	existingImages.push(randomImage);
	});
}

// Check if additional random images need to be added to the container
function checkToAddRandomImages(localDivClass) {
	const localDiv = document.querySelector(`.${localDivClass}`);
	const newBlockPositions = shuffleBlockPositions(BLOCK_POSITIONS_EASY);

	if (localDiv) {
	const blocks = localDiv.getElementsByClassName('block');

	for (let i = 0; i < blocks.length && i < arrRandomImages.length + 1 && i < newBlockPositions.length; i++) {
		const img = new Image();
		let randomImage;

		if (i === 0) {
		randomImage = randomChosenImage;
		} else {
		randomImage = arrRandomImages[i - 1];
		}

		img.addEventListener('click', () => {
		if (randomImage === randomChosenImage) {
			score += 10;
			if (score > 0)
			SCORE_ELEMENT.style.color = '#fff';
			SCORE_ELEMENT.textContent = score.toString();
			initData();
		} else {
			score -= 10;
			SCORE_ELEMENT.textContent = score.toString();
			if (score <= 0)
			SCORE_ELEMENT.style.color = '#ff9898';
			if (score < -30)
			loseScreenDisplay();
		}
		});

		// Set image attributes and append to the block
		img.src = randomImage;
		img.alt = `Icon ${i}`;
		img.style.width = '100%';
		img.style.height = '100%';

		// Update position based on the newBlockPositions array
		const position = newBlockPositions[i];
		blocks[i].style.left = `${position.left}px`;
		blocks[i].style.top = `${position.top}px`;

		blocks[i].innerHTML = '';
		blocks[i].appendChild(img);
	}
	} else {
	console.error(`Container with class '${localDivClass}' not found.`);
	}
}

// Event listener for key press to start the game
document.addEventListener('keydown', function (event) {
	START_SCREEN.style.display = 'none';
	TUTORIAL_SCREEN.style.display = 'flex';

	// Set a timeout to reset the page after 5 seconds
	setTimeout(() => {
	TUTORIAL_SCREEN.style.display = 'none';
	initData();
	gameStart();
	}, 5000);
});

// Initialize data for the game
function initData() {
	chooseRandomImage();
	insertRandomImages('eyeLocal00');

	console.log(randomChosenImage);
	console.log(arrRandomImages);

	checkToAddRandomImages('eyeLocal01');
	console.log(randomChosenImage);
	console.log(arrRandomImages);
}

// Display the victory screen
function victoryScreenDisplay() {
	GAMEPLAY_SCREEN.style.display = 'none';
	VICTORY_SCREEN.style.display = 'flex';


	const randomIndex = Math.floor(Math.random() * CONGRATULATORY_PHRASES.length);
	const selectedPhrase = CONGRATULATORY_PHRASES[randomIndex];
	VICTORY_PHRASE.textContent = selectedPhrase;

	// Get the score content from SCORE_ELEMENT
	const scoreContent = SCORE_ELEMENT.textContent;

	let scoreFeedback = SCORE_ELEMENT;
	scoreFeedback.textContent = scoreContent;

	// Display the final score in the victory screen
	WINSCORE_ELEMENT.textContent = `Final Score: ${scoreContent}`;

	// Set a timeout to reset the page after 5 seconds
	setTimeout(() => {
		location.reload();
	}, 5000);
}



// Display the lose screen
function loseScreenDisplay() {
	GAMEPLAY_SCREEN.style.display = 'none';
	LOSE_SCREEN.style.display = 'flex';

	// Set a timeout to reset the page after 5 seconds
	setTimeout(() => {
	location.reload();
	}, 5000);
}

// Change the image/icon source on the start screen
function changeIconStartScreen(imageNumber) {
	const imageContainer = document.getElementById('imageDisplay');
	imageContainer.innerHTML = `<img src="${IMAGE_SOURCES[imageNumber]}" alt="Icon ${imageNumber}">`;
}

// Display each image for 5 seconds and then switch to the next one
let currentImage = 0;
function displayImages() {
	changeIconStartScreen(currentImage);

	setTimeout(() => {
	currentImage = (currentImage + 1) % IMAGE_SOURCES.length;
	displayImages();
	}, 5000);
}

// Start the image display
displayImages();
