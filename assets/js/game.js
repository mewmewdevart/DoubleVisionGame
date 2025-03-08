document.addEventListener('DOMContentLoaded', () => {
	const imageDisplay = document.getElementById('imageDisplay');
	const images = [
		'./assets/images/icon_00.png',
		'./assets/images/icon_01.png',
		'./assets/images/icon_02.png',
		'./assets/images/icon_03.png',
		'./assets/images/icon_04.png'
	];

	function createCenteredImage() {
		imageDisplay.innerHTML = '';
		const img = createImageElement(images);
		centerImage(img, imageDisplay);
		imageDisplay.appendChild(img);
	}

	function createImageElement(images) {
		const img = document.createElement('img');
		img.src = images[Math.floor(Math.random() * images.length)];
		img.style.position = 'absolute';
		img.style.width = '50px';
		img.style.height = '50px';
		return img;
	}

	function centerImage(img, container) {
		img.onload = () => {
			const containerWidth = container.offsetWidth;
			const containerHeight = container.offsetHeight;
			const imgWidth = img.clientWidth;
			const imgHeight = img.clientHeight;

			img.style.left = `${(containerWidth - imgWidth) / 2}px`;
			img.style.top = `${(containerHeight - imgHeight) / 2}px`;
		};
	}

	setInterval(createCenteredImage, 2000);

	const gameStart = document.getElementById('game-start');
	const inGame = document.getElementById('in-game');

	document.querySelector('.game-screen').addEventListener('click', () => {
		gameStart.style.display = 'none';
		inGame.style.display = 'block';
		startGame();
	});

	function startGame() {
		const eyeLocal00Blocks = document.querySelectorAll('.eyeLocal00 .block');
		const eyeLocal01Blocks = document.querySelectorAll('.eyeLocal01 .block');

		clearBlocks(eyeLocal00Blocks);
		clearBlocks(eyeLocal01Blocks);

		const imagesForEyeLocal00 = generateUniqueImages(3, images);
		placeImagesInBlocks(eyeLocal00Blocks, imagesForEyeLocal00);

		const availableImagesForEyeLocal01 = images.filter(
			image => !imagesForEyeLocal00.includes(image)
		);
		const imagesForEyeLocal01 = generateUniqueImages(2, availableImagesForEyeLocal01);

		const randomImageFromEyeLocal00 = imagesForEyeLocal00[Math.floor(Math.random() * imagesForEyeLocal00.length)];
		const randomBlockIndex = Math.floor(Math.random() * eyeLocal01Blocks.length);
		imagesForEyeLocal01.splice(randomBlockIndex, 0, randomImageFromEyeLocal00);

		placeImagesInBlocks(eyeLocal01Blocks, imagesForEyeLocal01);
	}

	function clearBlocks(blocks) {
		blocks.forEach(block => (block.innerHTML = ''));
	}

	function generateUniqueImages(count, imagePool) {
		const uniqueImages = [];
		while (uniqueImages.length < count) {
			const randomImage = imagePool[Math.floor(Math.random() * imagePool.length)];
			if (!uniqueImages.includes(randomImage)) {
				uniqueImages.push(randomImage);
			}
		}
		return uniqueImages;
	}

	function placeImagesInBlocks(blocks, images) {
		blocks.forEach((block, index) => {
			if (images[index]) {
				const img = document.createElement('img');
				img.src = images[index];
				img.style.width = '100%';
				img.style.height = '100%';
				block.appendChild(img);
			}
		});
	}
});