import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const galleryContainer = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');


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

  galleryContainer.insertAdjacentHTML('beforeend', markup); 
  lightbox.refresh(); 
}


export function clearGallery() {
  galleryContainer.innerHTML = ''; 
}


export function showLoader() {
  loader.classList.add('visible'); 
}


export function hideLoader() {
  loader.classList.remove('visible'); 
}


export function showLoadMoreButton() {
  loadMoreBtn.classList.add('visible'); 
}


export function hideLoadMoreButton() {
  loadMoreBtn.classList.remove('visible'); 
}