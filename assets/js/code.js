const IMAGES_EASY = [
	'./assets/images/icon_00.png',
	'./assets/images/icon_01.png',
	'./assets/images/icon_02.png',
	'./assets/images/icon_03.png',
	'./assets/images/icon_04.png',
];

const IMAGES_HARD = [
	'./assets/images/icon_05.png',
	'./assets/images/icon_06.png',
	'./assets/images/icon_07.png',
	'./assets/images/icon_08.png',
	'./assets/images/icon_09.png',
	'./assets/images/icon_10.png',
	'./assets/images/icon_11.png',
	'./assets/images/icon_12.png',
	'./assets/images/icon_13.png',
];

const CONGRATULATORY_PHRASES = [
	"Congratulations, you are a Perfectionist",
	"Glorious Champion: Your Skills Know No Bounds!",
	"Eyes of Tandera: You've Transcended the Game!",
];

const BLOCK_POSITIONS_EASY = [
	{ left: 175, top: 30 },
	{ left: 100, top: 275 },
	{ left: 300, top: 200 },
];

const BLOCK_POSITIONS_HARD = [
	{ left: 175, top: 20 },  // Top Center
	{ left: 60, top: 150 },  // Left Middle
	{ left: 290, top: 150 }, // Right Middle
	{ left: 100, top: 280 }, // Bottom Left
	{ left: 250, top: 280 }, // Bottom Right
];

const DOM = {
	startScreen: document.getElementById('game-start-screen'),
	levelSelectScreen: document.getElementById('level-select-screen'),
	gameplayScreen: document.getElementById('gameplay-screen'),
	tutorialScreen: document.getElementById('tutorial-screen'),
	scoreElement: document.getElementById('gameScore'),
	timerElement: document.getElementById('gameTimer'),
	victoryScreen: document.getElementById('victory-screen'),
	victoryPhrase: document.getElementById('congratulationsMessage'),
	victoryScore: document.getElementById('victoryScore'),
	loseScreen: document.getElementById('lose-screen'),
	eyeLocal00: document.querySelector('.eyeLocal00'),
	eyeLocal01: document.querySelector('.eyeLocal01'),
	btnEasy: document.getElementById('btn-easy'),
	btnHard: document.getElementById('btn-hard'),
	imageDisplay: document.getElementById('imageDisplay'),
};

let state = {
	randomChosenImage: null,
	arrRandomImages: [],
	score: 0,
	timer: 60,
	timerInterval: null,
	isPlaying: false,
	difficulty: 'easy',
	currentImageIndex: 0,
	slideShowInterval: null,
	isMuted: false
};

const AUDIO = {
	success: new Audio('./assets/sounds/success.wav'),
	fail: new Audio('./assets/sounds/fail.wav'),
	bgm: new Audio('./assets/sounds/puzzles.ogg'),
};

AUDIO.bgm.loop = true;
AUDIO.bgm.volume = 0.5;
AUDIO.success.volume = 0.6;
AUDIO.fail.volume = 0.6;

function init() {
	startSlideShow();

	const btnMute = document.getElementById('btn-mute');
	if (btnMute) {
		btnMute.addEventListener('click', (e) => {
			e.stopPropagation();
			toggleMute(btnMute);
		});
	}

	DOM.startScreen.addEventListener('click', () => {
		AUDIO.bgm.play().catch(e => console.log("Audio play failed:", e));

		stopSlideShow();
		DOM.startScreen.style.display = 'none';
		DOM.levelSelectScreen.style.display = 'flex';
	});

	DOM.btnEasy.addEventListener('click', (e) => {
		e.stopPropagation();
		handleGameStartSequence('easy');
	});
	DOM.btnHard.addEventListener('click', (e) => {
		e.stopPropagation();
		handleGameStartSequence('hard');
	});
}

function handleGameStartSequence(difficulty) {
	state.difficulty = difficulty;

	DOM.levelSelectScreen.style.display = 'none';
	DOM.tutorialScreen.querySelector('h2').textContent = difficulty === 'easy'
		? "Easy Mode: Find the matching image!"
		: "Hard Mode: Find the matching image!";

	DOM.tutorialScreen.style.display = 'flex';

	setTimeout(() => {
		DOM.tutorialScreen.style.display = 'none';
		startGame();
	}, 3000);
}

function startGame() {
	resetGameState();
	DOM.gameplayScreen.style.display = 'flex';

	startRound();
	updateTimerDisplay();
	state.timerInterval = setInterval(() => {
		state.timer--;
		updateTimerDisplay();

		if (state.timer <= 0) {
			endGame();
		}
	}, 1000);
}

function resetGameState() {
	state.score = 0;
	state.timer = 60;
	state.isPlaying = true;
	updateScoreDisplay();
	if (AUDIO.bgm.paused) {
		AUDIO.bgm.currentTime = 0;
		AUDIO.bgm.play().catch(e => console.log("BGM play failed:", e));
	}
}

function startRound() {
	const isHard = state.difficulty === 'hard';
	const imagePool = isHard ? IMAGES_HARD : IMAGES_EASY;
	const itemsPerEye = isHard ? 5 : 3;

	const uniqueNeeded = 1 + (itemsPerEye - 1) * 2;

	const roundImages = getUniqueRandomImages(uniqueNeeded, imagePool);

	if (roundImages.length < uniqueNeeded) {
		console.error("Not enough images in pool for this mode.");
		return;
	}

	const targetImage = roundImages[0];
	const distractorsCount = itemsPerEye - 1;
	const leftDistractors = roundImages.slice(1, 1 + distractorsCount);
	const rightDistractors = roundImages.slice(1 + distractorsCount, 1 + distractorsCount * 2);

	state.randomChosenImage = targetImage;

	const leftEyeImages = shuffleArray([targetImage, ...leftDistractors]);
	const rightEyeImages = shuffleArray([targetImage, ...rightDistractors]);

	populateEye(DOM.eyeLocal00, leftEyeImages);
	populateEye(DOM.eyeLocal01, rightEyeImages);
}

function populateEye(container, imagesToPlace) {
	if (!container) return;

	container.innerHTML = '';

	const positions = shuffleArray(state.difficulty === 'hard'
		? [...BLOCK_POSITIONS_HARD]
		: [...BLOCK_POSITIONS_EASY]
	);

	imagesToPlace.forEach((imgSrc, index) => {
		const block = document.createElement('div');
		block.className = 'block';
		block.style.position = 'absolute';
		block.style.width = '100px';
		block.style.height = '100px';
		block.style.cursor = 'pointer';

		if (positions[index]) {
			block.style.left = `${positions[index].left}px`;
			block.style.top = `${positions[index].top}px`;
		}

		const imgObj = document.createElement('img');
		imgObj.src = imgSrc;
		imgObj.alt = (imgSrc === state.randomChosenImage) ? "Target Image" : "Distractor Image";
		imgObj.style.width = '100%';
		imgObj.style.height = '100%';
		imgObj.dataset.src = imgSrc;

		block.addEventListener('click', (e) => {
			e.stopPropagation();
			handleImageClick(imgSrc);
		});

		block.appendChild(imgObj);
		container.appendChild(block);
	});
}

function handleImageClick(clickedImageSrc) {
	if (!state.isPlaying) return;

	if (clickedImageSrc === state.randomChosenImage) {
		state.score += 10;
		AUDIO.success.currentTime = 0;
		AUDIO.success.play().catch(e => console.log("Sound play failed:", e));

		updateScoreDisplay();
		if (state.score > 0) DOM.scoreElement.style.color = '#fff';
		startRound();
	} else {
		state.score -= 10;
		AUDIO.fail.currentTime = 0;
		AUDIO.fail.play().catch(e => console.log("Sound play failed:", e));

		updateScoreDisplay();
		if (state.score <= 0) DOM.scoreElement.style.color = '#ff9898';
		if (state.score < -30) endGame();
	}
}

function endGame() {
	state.isPlaying = false;
	clearInterval(state.timerInterval);

	AUDIO.bgm.pause();
	AUDIO.bgm.currentTime = 0;

	DOM.gameplayScreen.style.display = 'none';

	if (state.score > 0) {
		DOM.victoryScreen.style.display = 'flex';
		const phrase = CONGRATULATORY_PHRASES[Math.floor(Math.random() * CONGRATULATORY_PHRASES.length)];
		DOM.victoryPhrase.textContent = phrase;
		DOM.victoryScore.textContent = `Final Score: ${state.score}`;
	} else {
		DOM.loseScreen.style.display = 'flex';
	}

	setTimeout(() => {
		DOM.victoryScreen.style.display = 'none';
		DOM.loseScreen.style.display = 'none';
		DOM.startScreen.style.display = 'flex';
		startSlideShow();
	}, 5000);
}

function updateTimerDisplay() {
	DOM.timerElement.textContent = `${state.timer}s`;
}

function updateScoreDisplay() {
	DOM.scoreElement.textContent = state.score.toString();
}

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

function getUniqueRandomImages(count, sourceArray) {
	const shuffled = [...sourceArray];
	shuffleArray(shuffled);
	return shuffled.slice(0, count);
}

function startSlideShow() {
	const images = IMAGES_EASY;

	if (state.slideShowInterval) clearInterval(state.slideShowInterval);

	const showNextImage = () => {
		const img = images[state.currentImageIndex];
		// Ensure imageDisplay is visible if it was hidden
		DOM.imageDisplay.style.display = 'block';
		DOM.imageDisplay.innerHTML = `<img src="${img}" alt="Icon" style="width: 100%; height: 100%; object-fit: contain;">`;
		state.currentImageIndex = (state.currentImageIndex + 1) % images.length;
	};

	showNextImage();
	state.slideShowInterval = setInterval(showNextImage, 2000); // Change every 2 seconds
}

function stopSlideShow() {
	if (state.slideShowInterval) {
		clearInterval(state.slideShowInterval);
		state.slideShowInterval = null;
	}
	DOM.imageDisplay.style.display = 'none';
}

function toggleMute(btn) {
	state.isMuted = !state.isMuted;
	const icon = state.isMuted ? '🔇' : '🔊';
	btn.textContent = icon;

	AUDIO.bgm.muted = state.isMuted;
	AUDIO.success.muted = state.isMuted;
	AUDIO.fail.muted = state.isMuted;
}

init();
