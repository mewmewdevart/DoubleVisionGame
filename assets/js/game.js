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

		const img = document.createElement('img');
		img.src = images[Math.floor(Math.random() * images.length)];
		img.style.position = 'absolute';
		img.style.width = '50px';
		img.style.height = '50px';

		img.onload = () => {
			const containerWidth = imageDisplay.offsetWidth;
			const containerHeight = imageDisplay.offsetHeight;
			const imgWidth = img.clientWidth;
			const imgHeight = img.clientHeight;

			img.style.left = `${(containerWidth - imgWidth) / 2}px`;
			img.style.top = `${(containerHeight - imgHeight) / 2}px`;
		};

		imageDisplay.appendChild(img);
	}

	setInterval(createCenteredImage, 2000);
});
