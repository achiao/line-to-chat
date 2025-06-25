import axios from 'axios';
import FormData from 'form-data';

async function getAccessToken() {
  const data = new FormData();
  data.append('refresh_token', '3b6930cc4dc2b6691e7bca0490248dbbd18acd4e');
  data.append('client_id', '613a9d8ce8b43aa');
  data.append('client_secret', '4982e5f9d620eb6ba0e89bdb30e1a0001140f7d3');
  data.append('grant_type', 'refresh_token');

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.imgur.com/oauth2/token',
    headers: {
      ...data.getHeaders()
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
  } catch (error) {
    console.error(error.response ? error.response.data : error);
  }
}
async function getImages() {
  const myHeaders = new Headers();
  myHeaders.append(
    'Authorization',
    'Bearer e7e16fd6a0ff6dfbb3b4ef0459a8d4678688a8f2'
  );

  const requestOptions: RequestInit = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow' as RequestRedirect
  };
  try {
    const response = await fetch(
      'https://api.imgur.com/3/account/me/images',
      requestOptions
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    return json.data.map((image) => image.id);
    console.log('response: ', json);
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

function deleteImages(imagesId: string[]) {
  var myHeaders = new Headers();
  myHeaders.append(
    'Authorization',
    'Bearer e7e16fd6a0ff6dfbb3b4ef0459a8d4678688a8f2'
  );

  var formdata = new FormData();

  var requestOptions: RequestInit = {
    method: 'DELETE',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow' as RequestRedirect
  };

  imagesId.forEach((imageHash) => {
    fetch(`https://api.imgur.com/3/image/${imageHash}`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));
  });
}
(async () => {
  try {
    await getAccessToken();
    /*const imagesId = await getImages();
    console.log('imagesId: ', imagesId);
    deleteImages(imagesId);*/
  } catch (err) {
    console.error('Error:', err);
  }
})();
