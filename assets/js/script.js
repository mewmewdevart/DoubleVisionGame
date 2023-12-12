const imageSources = [
	'./assets/images/icon_00.png',
	'./assets/images/icon_01.png',
	'./assets/images/icon_02.png',
	'./assets/images/icon_03.png',
	'./assets/images/icon_04.png',
  ];


  const startScreen = document.getElementById('gameStartScreen');
  const gameScreen = document.getElementById('gameplay');
  const victoryPhrase = document.getElementById('congratulationsMessage');
  const winScoreElement = document.getElementById('victoryScore');
  const scoreElement = document.getElementById('gameScore');
  const tutorialScreenElement = document.querySelector('.tutorialScreen');
  const victoryScreenElement = document.querySelector('.victoryScreen');
  const loseScreenElement = document.querySelector('.loseScreen');
  
  const congratulatoryPhrases = [
	"Congratulations, you are a Perfectionist",
	"Glorious Champion: Your Skills Know No Bounds!",
	"Eyes of Tandera: You've Transcended the Game!",
  ];
  
  let randomChosenImage;
  let arrRandomImages;
  
  let score = 0;
  let timer = 30;
  let timerInterval;
  const blockPositions = [
	{ left: 100, top: 0 },
	{ left: 25, top: 150 },
	{ left: 175, top: 150 },
];

// Update the displayed timer
  function updateTimer() {
	const timerElement = document.getElementById('gameTimer');
	timerElement.textContent = `${timer}s`;
  
	if (timer === 0) {
	  clearInterval(timerInterval);
	  if (score <= 0)
	  	loseScreen();
	  else
	  	victoryScreen();
	} else {
	  timer--;
	}
  }

// Get a random image that is not in the existing set
  function getRandomImage(existingImages) {
	const availableImages = imageSources.filter(img => !existingImages.includes(img));
	const randomIndex = Math.floor(Math.random() * availableImages.length);
	return availableImages[randomIndex];
  }

// Choose a random image for the game
  function chooseRandomImage() {
	randomChosenImage = getRandomImage([]);
	arrRandomImages = imageSources.filter(img => img !== randomChosenImage);
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
	const newBlockPositions = shuffleBlockPositions(blockPositions);
  
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
				scoreElement.style.color = '#fff';
		  scoreElement.textContent = score.toString();
		  initData();
		} else {
			score -= 10;
			scoreElement.textContent = score.toString();
			if (score <= 0)
				scoreElement.style.color = '#ff9898';
			if (score < -30)
				loseScreen();
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
	const newBlockPositions = shuffleBlockPositions(blockPositions);
  
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
					scoreElement.style.color = '#fff';
			scoreElement.textContent = score.toString();
			initData();
			} else {
				score -= 10;
				scoreElement.textContent = score.toString();
				if (score <= 0)
					scoreElement.style.color = '#ff9898';
				if (score < -30)
					loseScreen();
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

scoreElement.textContent = score.toString();

// Event listener for key press to start the game
   document.addEventListener('keydown', function(event) {
	
	startScreen.style.display = 'none';
	tutorialScreenElement.style.display = 'flex';

	// Set a timeout to reset the page after 5 seconds
	setTimeout(() => {
		tutorialScreenElement.style.display = 'none';
		initData();
		initGame();
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
  
  // Initialize the game
  function initGame() {
	gameScreen.style.display = 'flex';
	timerInterval = setInterval(updateTimer, 1000);
  }

// Display the victory screen
  function victoryScreen() {
	gameScreen.style.display = 'none';
	victoryScreenElement.style.display = 'block';

	const randomIndex = Math.floor(Math.random() * congratulatoryPhrases.length);
	const selectedPhrase = congratulatoryPhrases[randomIndex];
	victoryPhrase.textContent = selectedPhrase;
  
	let scoreFeedback = scoreElement;
	scoreFeedback.textContent = score.toString();
  
	// Display the final score in the victory screen
	winScoreElement.textContent = `Final Score: ${score}`;

	// Set a timeout to reset the page after 5 seconds
	setTimeout(() => {
		location.reload();
	}, 5000);
  }

// Display the lose screen
  function loseScreen(){
	gameScreen.style.display = 'none';
	loseScreenElement.style.display = 'block';

	// Set a timeout to reset the page after 5 seconds
	setTimeout(() => {
		location.reload();
	}, 5000);
  }

// Change the image/icon source on the start screen
function changeIconStartScreen(imageNumber) {
	const imageContainer = document.getElementById('imageDisplay');
	imageContainer.innerHTML = `<img src="${imageSources[imageNumber]}" alt="Icon ${imageNumber}">`;
	}
	
// Display each image for 5 seconds and then switch to the next on
	let currentImage = 0;
	function displayImages() {
	changeIconStartScreen(currentImage);
	
	setTimeout(() => {
		currentImage = (currentImage + 1) % imageSources.length;
		displayImages();
	}, 5000); 
	}
	
// Start the image display
displayImages();
