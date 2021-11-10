import { lambdaUrl } from '../../../env.js';

const idsForm = <HTMLFormElement>document.querySelector('.postImage');
const imagesIDs = <HTMLTextAreaElement>document.querySelector('#imagesIDs');

idsForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const idsURLs = imagesIDs.value.split(', ').map((id) => {
    const url = (<HTMLImageElement>document.querySelector(`[title=${id}]`)).src;
    return {
      url: url,
      id: id
    }
  })

  const unsplashResponse = await fetch(`${lambdaUrl}/gallery/unsplash`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.token}`,
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({
      urls: idsURLs
    }),
  });

  console.log(unsplashResponse.statusText);
})
