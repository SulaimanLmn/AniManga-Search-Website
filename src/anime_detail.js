async function fetchAnimeDetails() {
  const bannerContainer = document.getElementById("banner-container");
  const ImageContainer = document.getElementById("anime-image-container");
  const descriptionContainer = document.getElementById("description-container");
  const detailContainer = document.getElementById("detail_container");
  const characterContainer = document.getElementById("character-container");

  const urlParams = new URLSearchParams(window.location.search);
  const animeId = urlParams.get("animeId");

  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
    const data = await response.json();

    const res = await fetch(
      `https://api.jikan.moe/v4/anime/${animeId}/characters?limit=6`
    );
    const characterData = await res.json();
    const characters = characterData.data;

    const anime = data.data;
    const animeSeason =
      anime.season != null
        ? anime.season.charAt(0).toUpperCase() +
          anime.season.slice(1) +
          " " +
          anime.year
        : "Unkown";

    bannerContainer.innerHTML = `
         <img src="${anime.trailer.images.maximum_image_url}" class="w-screen h-[350px] shadow-2xs" alt="">
        `;

    ImageContainer.innerHTML = `
        <img src="${anime.images.jpg.large_image_url}" alt="" class="w-[215px] h-[310px] absolute top-[15rem]">
       `;

    descriptionContainer.innerHTML = `
    <h1 class="text-2xl">${anime.title}</h1>

                    <p class="text-[14px] overflow-auto">${anime.synopsis}</p>
    `;

    detailContainer.innerHTML = `
        <div>
            <p>Format</p>
            <p>${anime.type}</p>
        </div>

        <div>
            <p>Episodes</p>
            <p>${anime.episodes}</p>
        </div>

        <div>
            <p>Episode Duration</p>
            <p>${anime.duration.split(" ").slice(0, 2).join(" ")}</p>
        </div>

        <div>
            <p>Start Date</p>
            <p>${anime.aired.string.split(" to ")[0]}</p>
        </div>

         <div>
            <p>End Date</p>
            <p>${anime.aired.string.split(" to ")[1]}</p>
        </div>

         <div>
            <p>Season</p>
            <p>${animeSeason}</p>
        </div>

          <div>
            <p>Studios</p>
            <p>${anime.studios[0].name}</p>
        </div>
    `;
    for (let i = 0; i < 21 && i < characterData.data.length; i++) {
      const character = characterData.data[i];
      const characterCard = document.createElement("div");

      const characterDiv = `
             <div class="flex h-max w-[450px]  h[150px] justify-between bg-white rounded-[0.4rem]">
                              <div class="flex w-[225px]  h-max" onclick="window.location.href='character_detail.html?characterName=${character.character.name}&characterImage=${character.character.images.jpg.image_url}'">
                                  <img src="${character.character.images.jpg.image_url}" alt=""
                                      class="w-[120px] h-[150px] object-fill rounded-tl-[0.4rem] rounded-bl-[0.4rem]">
                                  <div class="flex flex-col justify-between m-3">
                                      <p>
                                          ${character.character.name}
                                      </p>
      
                                      <p>
                                          ${character.role}
                                      </p>
                                  </div>
                              </div>
      
                              <div class="flex w-[225px] h-max">
                                  <div class="flex flex-col justify-between text-right w-[200px] m-3">
                                      <p>${character.voice_actors[0].person.name}</p>
      
                                      <p>${character.voice_actors[0].language}</p>
                                  </div>
                                  <img src="${character.voice_actors[0].person.images.jpg.image_url}" alt="" class="w-[120px] h-[150px] rounded-tr-[0.4rem] rounded-br-[0.4rem]">
                              </div>
                          </div>
          `;

      characterCard.innerHTML = characterDiv;
      characterContainer.append(characterCard);
    }
  } catch (e) {
    console.log(e);
  }
}

fetchAnimeDetails();
