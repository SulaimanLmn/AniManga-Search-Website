function toggleDropdown() {
  let dropdownButton = document.getElementById("dropdown");
  dropdownButton.classList.toggle("hidden");
}

function toggleCheck(element) {
  const checkIcon = element.querySelector(".check-icon");
  checkIcon.classList.toggle("hidden");
  //   fetchAnimeWithGenre("Comedy");

  getImage();
}

// async function fetchAnimeWithGenre(genre) {
//   const genreId = getGenreIdByName(genre);
//   const res = await fetch(`https://api.jikan.moe/v4/anime?genres=${genreId}`);
//   if (!res.ok) {
//     throw Error;
//   }
//   console.log(await res.json());
// }

// function getGenreIdByName(pickedGenre) {
//   const GENRES = {
//     Action: 1,
//     Adventure: 2,
//     Comedy: 4,
//     Drama: 8,
//     Fantasy: 10,
//     Horror: 14,
//     Mystery: 7,
//     Romance: 22,
//     SciFi: 24,
//     Sports: 30,
//     Supernatural: 37,
//     Thriller: 41,
//   };
//   console.log(GENRES[pickedGenre]);
//   return GENRES[pickedGenre] || null; // Return genre ID or null if not found
// }

async function getImage() {
  const animeImg = document.getElementById("animeImg");
  const res = await fetch("https://api.jikan.moe/v4/anime/100");

  const image = await res.json();
  animeImg.src = image.data.image.webp.image_url;
  console.log(image.data.image.webp.image_url);
}
