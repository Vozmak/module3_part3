import { lambdaUrl } from '../../../env';

const imagesGallery = <HTMLBodyElement>document.querySelector('.Images');
const unsplashApiForm = <HTMLFormElement>document.querySelector('.findImage');
const keywordElement = <HTMLInputElement>document.querySelector('#keyword');
const pageElement = <HTMLInputElement>document.querySelector('#page');
const totalPages = <HTMLParagraphElement>document.querySelector('#total_pages');
const textAreaElement = <HTMLTextAreaElement>document.querySelector('#imagesIDs');

unsplashApiForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  imagesGallery.innerHTML = '';

  const unsplashResponse = await fetch(`http://localhost:3000/local/gallery/unsplash?keyword=${keywordElement.value}&page=${pageElement.value}`, {
    headers: {
      Authorization: `Bearer ${localStorage.token}`,
    },
  });

  if (unsplashResponse.status !== 200) {
    return alert(unsplashResponse.statusText);
  }

  const imagesList = await unsplashResponse.json();

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
