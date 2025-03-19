const searchBar = document.getElementById("searchbar");

searchBar.addEventListener("keydown", (userInput) => {
  if (userInput.key == "Enter") {
    getAnimeByName(userInput.target.value);
  }
});

searchBar.addEventListener("input", (userInput) => {
  if (userInput.target.value == "") {
    fetchAllAnime();
  }
});

fetchAllAnime();

function toggleGenresDropdown() {
  let dropdownButton = document.getElementById("genres-dropdown");
  dropdownButton.classList.toggle("hidden");
}
function toggleYearsDropdown() {
  let dropdownButton = document.getElementById("years-dropdown");
  dropdownButton.classList.toggle("hidden");
}

function toggleCheck(element) {
  const checkIcon = element.querySelector(".check-icon");
  checkIcon.classList.toggle("hidden");
}

async function getAnimeByName(name) {
  const animeContainer = document.getElementById("anime-container");
  const res = await fetch(`https://api.jikan.moe/v4/anime?q=${name}&limit=20`);
  const data = await res.json();

  console.log(name);
  animeContainer.innerHTML = "";
  data.data.forEach((anime) => {
    if (anime.title.toLowerCase().includes(name.toLowerCase())) {
      const animeCard = document.createElement("div");
      animeCard.innerHTML = `
        <div class="flex flex-col w-[300px] h-[580px] gap-2 bg-white shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl" onclick="window.location.href='anime_detail.html?animeId=${
          anime.mal_id
        }'">
      <img src="${
        anime.images.jpg.image_url
      }" class="w-[300px] h-[370px] rounded-t-md object-cover transition-transform duration-300 group-hover:scale-110" id="animeImg" alt="${
        anime.title
      }">
  
      <div class="flex flex-col m-2.5">
          <p class="text-[1.2rem] h-[70px] font-semibold">${anime.title}</p>
  
          <div class="flex flex-col gap-1 text-[16px]">
              <p>${
                anime.episodes ? `${anime.episodes} episodes` : "Ongoing"
              }</p>
              <p>${anime.status}</p>
              <div class="flex items-center w-max text-[15px] py-0.5 px-1.5 rounded-md bg-yellow-200 gap-1.5">
                  <img src="assets/star-icon.png" class="w-4 h-4" alt="Star Icon">
                  <p>${anime.score != null ? anime.score : "Unrated"}</p>
              </div>
              <p class="text-[14px]"> ${
                anime.genres
                  ? anime.genres.map((genre) => genre.name).join(", ")
                  : "No genres available"
              }</p>
          </div>
      </div>
  </div>
      `;
      animeContainer.append(animeCard);
    } else if (name == "") {
      fetchAllAnime();
    }
  });
}

async function fetchAllAnime() {
  const animeContainer = document.getElementById("anime-container");
  const res = await fetch(
    "https://api.jikan.moe/v4/top/anime?limit=20&sfw=true"
  );
  const data = await res.json();

  animeContainer.innerHTML = "";

  data.data.forEach((anime) => {
    const animeCard = document.createElement("div");

    animeCard.innerHTML = `
                 <div class="flex flex-col w-[300px] h-[580px] gap-2 bg-white shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl" onclick="window.location.href='anime_detail.html?animeId=${
                   anime.mal_id
                 }'">
    <img src="${
      anime.images.jpg.image_url
    }" class="w-[300px] h-[370px] rounded-t-md object-cover transition-transform duration-300 group-hover:scale-110" id="animeImg" alt="${
      anime.title
    }">

    <div class="flex flex-col m-2.5">
        <p class="text-[1.2rem] h-[70px] font-semibold">${anime.title}</p>

        <div class="flex flex-col gap-1 text-[16px]">
            <p>${anime.episodes ? `${anime.episodes} episodes` : "Ongoing"}</p>
            <p>${anime.status}</p>
            <div class="flex items-center w-max text-[15px] py-0.5 px-1.5 rounded-md bg-yellow-200 gap-1.5">
                <img src="assets/star-icon.png" class="w-4 h-4" alt="Star Icon">
                <p>${anime.score}</p>
            </div>
            <p class="text-[14px]"> ${
              anime.genres
                ? anime.genres.map((genre) => genre.name).join(", ")
                : "No genres available"
            }</p>
        </div>
    </div>
</div>
    `;
    animeContainer.append(animeCard);
  });
}
