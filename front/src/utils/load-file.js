export const loadFile = (url) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      resolve(xhr.responseText);
    }
  };
  xhr.onerror = (e) => reject(e);
  xhr.open('GET', url);
  xhr.send();
});
