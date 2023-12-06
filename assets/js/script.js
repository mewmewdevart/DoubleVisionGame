const imageSources = [
	'./assets/images/icon_00.png',
	'./assets/images/icon_01.png',
	'./assets/images/icon_02.png',
	'./assets/images/icon_03.png',
	'./assets/images/icon_04.png',
  ];

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
