import { getImagesByQuery } from './pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchForm = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = ''; // Store the current search query
let currentPage = 1; // Track the current page
let totalHits = 0; // Track the total number of images

// Handle form submission
searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  const query = event.target.elements.query.value.trim();

  if (!query) {
    iziToast.error({ title: 'Error', message: 'Please enter a search query!' });
    return;
  }

  currentQuery = query; // Save the search query
  currentPage = 1; // Reset to page 1 for a new search
  clearGallery(); // Clear the gallery
  hideLoadMoreButton(); // Hide the "Load more" button initially
  showLoader(); // Show the loader

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    hideLoader(); // Hide the loader

    totalHits = data.totalHits; // Update totalHits
    const images = data.hits;

    if (images.length === 0) {
      iziToast.warning({
        title: 'No Results',
        message: 'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }

    createGallery(images); // Render the images
    iziToast.success({ title: 'Success', message: `Found ${totalHits} images!` });

    // Check if there are more images to load
    if (images.length < 15 || currentPage * 15 >= totalHits) {
      hideLoadMoreButton();
      if (currentPage * 15 >= totalHits) {
        iziToast.info({
          title: 'End of Collection',
          message: "We're sorry, but you've reached the end of search results.",
        });
      }
    } else {
      showLoadMoreButton(); // Show the "Load more" button if there are more images
    }
  } catch (error) {
    hideLoader();
    iziToast.error({ title: 'Error', message: 'Failed to fetch images. Please try again later.' });
  }
});

// Handle "Load more" button click
loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1; // Increment the page number
  showLoader(); // Show the loader
  hideLoadMoreButton(); // Hide the "Load more" button while loading

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    hideLoader(); // Hide the loader

    const images = data.hits;
    createGallery(images); // Append the new images

    // Smooth scrolling: Scroll by the height of two gallery cards
    const galleryItem = document.querySelector('.gallery-item');
    if (galleryItem) {
      const cardHeight = galleryItem.getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    // Check if there are more images to load
    if (images.length < 15 || currentPage * 15 >= totalHits) {
      hideLoadMoreButton();
      if (currentPage * 15 >= totalHits) {
        iziToast.info({
          title: 'End of Collection',
          message: "We're sorry, but you've reached the end of search results.",
        });
      }
    } else {
      showLoadMoreButton(); // Show the "Load more" button if there are more images
    }
  } catch (error) {
    hideLoader();
    iziToast.error({ title: 'Error', message: 'Failed to fetch images. Please try again later.' });
  }
});