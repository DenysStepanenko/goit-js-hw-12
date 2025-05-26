import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// Initialize SimpleLightbox for the gallery
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const galleryContainer = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');

// Function to create gallery markup and append it
export function createGallery(images) {
  const markup = images
    .map(
      image => `
        <a href="${image.largeImageURL}" class="gallery-item">
          <img src="${image.webformatURL}" alt="${image.tags}" />
          <div class="info">
            <p>Likes: ${image.likes}</p>
            <p>Views: ${image.views}</p>
            <p>Comments: ${image.comments}</p>
            <p>Downloads: ${image.downloads}</p>
          </div>
        </a>
      `
    )
    .join('');

  galleryContainer.insertAdjacentHTML('beforeend', markup); // Append new images
  lightbox.refresh(); // Refresh SimpleLightbox to include new images
}

// Function to clear the gallery
export function clearGallery() {
  galleryContainer.innerHTML = ''; // Clear the gallery container
}

// Function to show the loader
export function showLoader() {
  loader.classList.add('visible'); // Add a class to show the loader
}

// Function to hide the loader
export function hideLoader() {
  loader.classList.remove('visible'); // Remove the class to hide the loader
}

// Function to show the "Load more" button
export function showLoadMoreButton() {
  loadMoreBtn.classList.add('visible'); // Add a class to show the button
}

// Function to hide the "Load more" button
export function hideLoadMoreButton() {
  loadMoreBtn.classList.remove('visible'); // Remove the class to hide the button
}