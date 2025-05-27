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

const searchForm = document.querySelector('.form'); // Змінено з .search-form на .form
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  const query = event.target.elements.query.value.trim();

  if (!query) {
    iziToast.error({ title: 'Ошибка', message: 'Введите поисковый запрос!' });
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
        title: 'Нет результатов',
        message: 'Извините, по вашему запросу ничего не найдено. Попробуйте снова!',
      });
      return;
    }

    createGallery(images);
    iziToast.success({ title: 'Успех', message: `Найдено ${totalHits} изображений!` });

    if (images.length < 15 || currentPage * 15 >= totalHits) {
      hideLoadMoreButton();
      if (currentPage * 15 >= totalHits) {
        iziToast.info({
          title: 'Конец коллекции',
          message: 'Извините, вы достигли конца результатов поиска.',
        });
      }
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    hideLoader();
    iziToast.error({ title: 'Ошибка', message: 'Не удалось загрузить изображения. Попробуйте снова!' });
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
          title: 'Конец коллекции',
          message: 'Извините, вы достигли конца результатов поиска.',
        });
      }
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    hideLoader();
    iziToast.error({ title: 'Ошибка', message: 'Не удалось загрузить изображения. Попробуйте снова!' });
  }
});