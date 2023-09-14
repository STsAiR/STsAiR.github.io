const tempDataValue = localStorage.getItem('temp');

if (localStorage.getItem('name')) {
  console.log('The data exists in localStorage');
} else {
  console.log('The data does not exist in localStorage');
}
