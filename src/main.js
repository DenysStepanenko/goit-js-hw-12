import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchForm = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  const query = event.target.elements.query.value.trim();

  if (!query) {
    iziToast.error({ title: 'Error', message: 'Please enter a search query!' });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    hideLoader();

    totalHits = data.totalHits;
    const images = data.hits;

    if (images.length === 0) {
      iziToast.warning({
        title: 'No Results',
        message: 'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }

    createGallery(images);
    iziToast.success({ title: 'Success', message: `Found ${totalHits} images!` });

    if (images.length < 15 || currentPage * 15 >= totalHits) {
      hideLoadMoreButton();
      if (currentPage * 15 >= totalHits) {
        iziToast.info({
          title: 'End of Collection',
          message: "We're sorry, but you've reached the end of search results.",
        });
      }
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    hideLoader();
    iziToast.error({ title: 'Error', message: 'Failed to fetch images. Please try again later.' });
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    hideLoader();

    const images = data.hits;
    createGallery(images);

    const galleryItem = document.querySelector('.gallery-item');
    if (galleryItem) {
      const cardHeight = galleryItem.getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    if (images.length < 15 || currentPage * 15 >= totalHits) {
      hideLoadMoreButton();
      if (currentPage * 15 >= totalHits) {
        iziToast.info({
          title: 'End of Collection',
          message: "We're sorry, but you've reached the end of search results.",
        });
      }
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    hideLoader();
    iziToast.error({ title: 'Error', message: 'Failed to fetch images. Please try again later.' });
  }
});