import { lambdaUrl } from '../../../env.js';

const imagesGallery = <HTMLBodyElement>document.querySelector('.Images');
const unsplashApiForm = <HTMLFormElement>document.querySelector('.findImage');
const keywordElement = <HTMLInputElement>document.querySelector('#keyword');
const pageElement = <HTMLInputElement>document.querySelector('#page');
const totalPages = <HTMLParagraphElement>document.querySelector('#total_pages');
const textAreaElement = <HTMLTextAreaElement>document.querySelector('#imagesIDs');

unsplashApiForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const unsplashResponse = await fetch(`${lambdaUrl}/gallery/unsplash?keyword=${keywordElement.value}&page=${pageElement.value}`, {
    headers: {
      Authorization: `Bearer ${localStorage.token}`,
    },
  });

  if (unsplashResponse.status !== 200) {
    const error = await unsplashResponse.json();
    return alert(error.errorMessage);
  }

  const imagesList = await unsplashResponse.json();

  imagesGallery.innerHTML = '';
  totalPages.textContent = `Total Pages: ${imagesList.total_pages}`;

  for (const image of imagesList.result) {
    const divImg = document.createElement('div');

    const img = document.createElement('img');
    img.className = 'img';
    img.title = image.id;
    img.src = image.url;
    img.onclick = function (event) {
      event.preventDefault();
      if (textAreaElement.value === '') {
        textAreaElement.value = `${image.id}`
      } else {
        if (textAreaElement.value.includes(image.id)) {
          textAreaElement.value = textAreaElement.value.replace(`${image.id}, `, '');
        } else {
          textAreaElement.value = `${textAreaElement.value}, ${image.id}`
        }
      }

    };
    divImg.insertAdjacentElement('beforeend', img);

    const imgInfo = document.createElement('div');
    imgInfo.className = 'ImageInfo';
    imgInfo.innerHTML = `<div><h3>ID</h3><span>${image.id}</span></div>
                         <div><h3>Likes</h3><span>${image.likes}</span></div>`;
    divImg.insertAdjacentElement('beforeend', imgInfo);

    imagesGallery.insertAdjacentElement('beforeend', divImg);
  }
});
