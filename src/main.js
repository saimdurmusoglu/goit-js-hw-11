import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('#loader');

// Göster
function showLoader() {
  loader.classList.remove('loader-hidden');
}

// Gizle
function hideLoader() {
  loader.classList.add('loader-hidden');
}

const API_KEY = '23458422-3da75be814240b3b99c5452e1';
const BASE_URL = 'https://pixabay.com/api/';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

form.addEventListener('submit', async e => {
  e.preventDefault();

  const query = e.target.searchQuery.value.trim();
  if (!query) return;

  gallery.innerHTML = '';
  showLoader(); // Göster

  try {
    const { data } = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });

    if (data.hits.length === 0) {
      iziToast.warning({
        title: 'Oops!',
        titleColor: '#fff',
        iconUrl: './img/icon.svg',
        iconColor: '#fff',
        messageColor: '#fff',
        backgroundColor: '#ef4040',
        progressBarColor: '#b51b1b',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        close: true, // Kapatma ikonunu aktif et
        timeout: 5000,
        onOpening: (instance, toast) => {
          const closeBtn = toast.querySelector('.iziToast-close');
          if (closeBtn) {
            closeBtn.innerHTML = ''; // Varsayılan ikon temizleniyor

            // SVG ikon oluşturuluyor
            const customIcon = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'svg'
            );
            customIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            customIcon.setAttribute('width', '20');
            customIcon.setAttribute('height', '20');
            customIcon.setAttribute('viewBox', '0 0 24 24');
            customIcon.setAttribute('fill', '#fafafb'); // Rengi burada veriyorsun

            // İçeriği (çarpı ikonu)
            customIcon.innerHTML = `
        <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.89 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"/>
      `;

            // Stil (isteğe bağlı)
            customIcon.style.cursor = 'pointer';

            // Ekleyelim
            closeBtn.appendChild(customIcon);
          }
        },
      });
      return;
    }

    const markup = data.hits
      .map(
        img => `
        <a href="${img.largeImageURL}" class="photo-card">
          <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
          <div class="info">
            <p><b>Likes</b> ${img.likes}</p>
            <p><b>Views</b> ${img.views}</p>
            <p><b>Comments</b> ${img.comments}</p>
            <p><b>Downloads</b> ${img.downloads}</p>
          </div>
        </a>
      `
      )
      .join('');

    gallery.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      titleColor: '#fff',
      iconUrl: './img/icon.svg',
      iconColor: '#fff',
      messageColor: '#fff',
      backgroundColor: '#ef4040',
      progressBarColor: '#b51b1b',
      message: 'Something went wrong while fetching images.',
      position: 'topRight',
      close: true, // Kapatma ikonunu aktif et
      timeout: 5000,
      onOpening: (instance, toast) => {
        const closeBtn = toast.querySelector('.iziToast-close');
        if (closeBtn) {
          closeBtn.innerHTML = ''; // Varsayılan ikon temizleniyor

          // SVG ikon oluşturuluyor
          const customIcon = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
          );
          customIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
          customIcon.setAttribute('width', '20');
          customIcon.setAttribute('height', '20');
          customIcon.setAttribute('viewBox', '0 0 24 24');
          customIcon.setAttribute('fill', '#fafafb'); // Rengi burada veriyorsun

          // İçeriği (çarpı ikonu)
          customIcon.innerHTML = `
        <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.89 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"/>
      `;

          // Stil (isteğe bağlı)
          customIcon.style.cursor = 'pointer';

          // Ekleyelim
          closeBtn.appendChild(customIcon);
        }
      },
    });
  } finally {
    hideLoader(); // Gizle
  }
});
