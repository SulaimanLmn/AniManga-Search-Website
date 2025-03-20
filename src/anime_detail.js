async function fetchAnimeDetails() {
  const loadingIndicator = document.getElementById("loading-indicator");
  const mainContent = document.getElementById("main-content");
  const bannerContainer = document.getElementById("banner-container");
  const ImageContainer = document.getElementById("anime-image-container");
  const descriptionContainer = document.getElementById("description-container");
  const detailContainer = document.getElementById("detail_container");
  const characterContainer = document.getElementById("character-container");
  const charactersSection = document.getElementById("characters-section");

  const urlParams = new URLSearchParams(window.location.search);
  const animeId = urlParams.get("animeId");

  try {
    // Show loading indicator and hide main content
    loadingIndicator.classList.remove("hidden");
    mainContent.classList.add("hidden");

    // Clear existing content
    bannerContainer.innerHTML = "";
    ImageContainer.innerHTML = "";
    descriptionContainer.innerHTML = "";
    detailContainer.innerHTML = "";
    characterContainer.innerHTML = "";

    // Add delay to respect API rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Fetch anime details
    const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
    if (!response.ok) throw new Error("Failed to fetch anime details");
    const data = await response.json();

    // Add delay before fetching characters to respect rate limit
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Fetch character details
    const res = await fetch(
      `https://api.jikan.moe/v4/anime/${animeId}/characters?limit=6`
    );
    if (!res.ok) throw new Error("Failed to fetch character details");
    const characterData = await res.json();
    const characters = characterData.data;

    const anime = data.data;
    const animeSeason =
      anime.season != null
        ? anime.season.charAt(0).toUpperCase() +
          anime.season.slice(1) +
          " " +
          anime.year
        : "Unknown";

    // Update banner
    bannerContainer.innerHTML = `
      <img src="${anime.trailer.images.maximum_image_url}" class="w-full h-full object-cover shadow-lg" alt="">
    `;

    // Update image
    ImageContainer.innerHTML = `
      <img src="${anime.images.jpg.large_image_url}" alt="" 
           class="w-[215px] h-[310px] rounded-lg shadow-xl mx-auto sm:mx-0">
    `;

    // Update description
    descriptionContainer.innerHTML = `
      <h1 class="text-xl sm:text-2xl font-semibold text-gray-800">${anime.title}</h1>
      <p class="text-sm sm:text-base text-gray-600 leading-relaxed">${anime.synopsis}</p>
    `;

    // Update details
    detailContainer.innerHTML = `
      <div class="space-y-4">
        <div class="border-b pb-2">
          <p class="text-gray-500 text-sm">Format</p>
          <p class="font-medium text-gray-800">${anime.type}</p>
        </div>
        <div class="border-b pb-2">
          <p class="text-gray-500 text-sm">Episodes</p>
          <p class="font-medium text-gray-800">${anime.episodes}</p>
        </div>
        <div class="border-b pb-2">
          <p class="text-gray-500 text-sm">Episode Duration</p>
          <p class="font-medium text-gray-800">${anime.duration
            .split(" ")
            .slice(0, 2)
            .join(" ")}</p>
        </div>
        <div class="border-b pb-2">
          <p class="text-gray-500 text-sm">Start Date</p>
          <p class="font-medium text-gray-800">${
            anime.aired.string.split(" to ")[0]
          }</p>
        </div>
        <div class="border-b pb-2">
          <p class="text-gray-500 text-sm">End Date</p>
          <p class="font-medium text-gray-800">${
            anime.aired.string.split(" to ")[1] || "Ongoing"
          }</p>
        </div>
        <div class="border-b pb-2">
          <p class="text-gray-500 text-sm">Season</p>
          <p class="font-medium text-gray-800">${animeSeason}</p>
        </div>
        <div class="border-b pb-2">
          <p class="text-gray-500 text-sm">Studios</p>
          <p class="font-medium text-gray-800">${
            anime.studios[0]?.name || "Unknown"
          }</p>
        </div>
        <div class="border-b pb-2">
          <p class="text-gray-500 text-sm">Producers</p>
          <div class="font-medium text-gray-800 space-y-1">
            ${
              anime.producers.length > 0
                ? anime.producers
                    .map((producer) => `<p>${producer.name}</p>`)
                    .join("")
                : "<p>Unknown</p>"
            }
          </div>
        </div>
        <div class="border-b pb-2">
          <p class="text-gray-500 text-sm">Genres</p>
          <div class="font-medium text-gray-800 space-y-1">
            ${anime.genres.map((genre) => `<p>${genre.name}</p>`).join("")}
          </div>
        </div>
      </div>
    `;

    // Update characters
    if (characterData.data && characterData.data.length > 0) {
      // Only show characters section if there are characters
      charactersSection.classList.remove("hidden");

      for (let i = 0; i < 21 && i < characterData.data.length; i++) {
        const character = characterData.data[i];
        const characterCard = document.createElement("div");

        const japaneseVoiceActor =
          character.voice_actors.find((va) => va.language === "Japanese") ||
          character.voice_actors[0];

        const characterDiv = `
          <div class="flex flex-col sm:flex-row bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="flex w-full sm:w-1/2 cursor-pointer" onclick="window.location.href='character_detail.html?characterName=${
              character.character.name
            }&characterImage=${character.character.images.jpg.image_url}'">
              <img src="${character.character.images.jpg.image_url}" alt=""
                  class="w-[100px] sm:w-[120px] h-[130px] sm:h-[150px] object-cover">
              <div class="flex flex-col justify-between p-2 sm:p-4 flex-1">
                <p class="font-medium text-sm sm:text-base text-gray-800">${
                  character.character.name
                }</p>
                <p class="text-xs sm:text-sm text-gray-600">${
                  character.role
                }</p>
              </div>
            </div>
            <div class="flex w-full sm:w-1/2 border-t sm:border-t-0 sm:border-l">
              <div class="flex flex-col justify-between p-2 sm:p-4 flex-1">
                <p class="font-medium text-sm sm:text-base text-gray-800 text-right">${
                  japaneseVoiceActor?.person?.name || "Unknown"
                }</p>
                <p class="text-xs sm:text-sm text-gray-600 text-right">${
                  japaneseVoiceActor?.language || "Unknown"
                }</p>
              </div>
              <img src="${
                japaneseVoiceActor?.person?.images?.jpg?.image_url || ""
              }" alt="" 
                   class="w-[100px] sm:w-[120px] h-[130px] sm:h-[150px] object-cover">
            </div>
          </div>
        `;

        characterCard.innerHTML = characterDiv;
        characterContainer.append(characterCard);
      }
    }

    // After all data is loaded and DOM is updated
    // Hide loading indicator and show main content
    loadingIndicator.classList.add("hidden");
    mainContent.classList.remove("hidden");

    // Update the main layout structure to be responsive
    const mainContentDiv = document.querySelector(
      "#main-content > div > div.flex.flex-col"
    );
    if (mainContentDiv) {
      mainContentDiv.classList.add("px-4", "sm:px-8", "lg:px-0");
    }

    // Update the flex container for image and description
    const imageDescContainer = document.querySelector(
      "#main-content .flex.flex-col.sm\\:flex-row"
    );
    if (imageDescContainer) {
      imageDescContainer.classList.add("items-center", "sm:items-start");
    }

    // Update the additional info container
    const additionalInfoContainer = document.querySelector(
      "#main-content .flex.flex-col.lg\\:flex-row"
    );
    if (additionalInfoContainer) {
      additionalInfoContainer.classList.add("gap-4", "lg:gap-8");
    }

    // Update character container grid
    characterContainer.classList.add(
      "grid",
      "grid-cols-1",
      "lg:grid-cols-2",
      "gap-4"
    );
  } catch (error) {
    console.error(error);
    // Hide loading indicator and main content
    loadingIndicator.classList.add("hidden");
    mainContent.classList.add("hidden");
    // Show error message
    document.body.innerHTML = `
      <div class="flex items-center justify-center h-screen">
        <div class="text-center text-red-600">
          Error loading anime details. Please try again later.<br>
          ${error.message}
        </div>
      </div>
    `;
  }
}

fetchAnimeDetails();
