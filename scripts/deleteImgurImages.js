async function getImages() {
  const myHeaders = new Headers();
  myHeaders.append(
    'Authorization',
    'Bearer e7e16fd6a0ff6dfbb3b4ef0459a8d4678688a8f2'
  );

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
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

function deleteImages(imagesId) {
  const myHeaders = new Headers();
  myHeaders.append(
    'Authorization',
    'Bearer e7e16fd6a0ff6dfbb3b4ef0459a8d4678688a8f2'
  );

  const formdata = new FormData();

  const requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
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
    const imagesId = await getImages();
    console.log('imagesId: ', imagesId);
    deleteImages(imagesId);
  } catch (err) {
    console.error('Error:', err);
  }
})();
