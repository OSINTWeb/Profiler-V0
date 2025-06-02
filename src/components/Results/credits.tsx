const options = {
    method: 'GET',
    headers: {accept: 'application/json', 'api-key': 'b9d8cdecfba21e7bb888f45a0c276a11'}
  };
  
  fetch('https://api.osint.industries/misc/credits', options)
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.error(err));


//     const url = 'https://api.osint.industries/v2/request?type=email&query=Mayank%40gmail.com&timeout=60';
// const options = {method: 'GET', headers: {'api-key': 'abcd', accept: 'application/json'}};

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error(err));