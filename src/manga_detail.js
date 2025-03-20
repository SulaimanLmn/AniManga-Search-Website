async function fetchMangaDetails() {
  const loadingIndicator = document.getElementById("loading-indicator");
  const mainContent = document.getElementById("main-content");
  const bannerContainer = document.getElementById("banner-container");
  const ImageContainer = document.getElementById("manga-image-container");
  const descriptionContainer = document.getElementById("description-container");
  const detailContainer = document.getElementById("detail_container");
  const characterContainer = document.getElementById("character-container");
  const charactersSection = document.getElementById("characters-section");

  const urlParams = new URLSearchParams(window.location.search);
  const mangaId = urlParams.get("mangaId");

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

    // Fetch manga details
    const response = await fetch(`https://api.jikan.moe/v4/manga/${mangaId}`);
    if (!response.ok) throw new Error("Failed to fetch manga details");
    const data = await response.json();

    // Add delay before fetching characters to respect rate limit
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Fetch character details
    const res = await fetch(
      `https://api.jikan.moe/v4/manga/${mangaId}/characters?limit=6`
    );
    if (!res.ok) throw new Error("Failed to fetch character details");
    const characterData = await res.json();
    const characters = characterData.data;

    const manga = data.data;

    // Update banner
    bannerContainer.innerHTML = `
      <img src="${manga.images.jpg.large_image_url}" class="w-full h-full object-cover shadow-lg" alt="">
    `;

    // Update image
    ImageContainer.innerHTML = `
      <img src="${manga.images.jpg.large_image_url}" alt="" 
           class="w-[215px] h-[310px] rounded-lg shadow-xl mx-auto sm:mx-0">
    `;

    // Update description
    descriptionContainer.innerHTML = `
      <h1 class="text-xl sm:text-2xl font-semibold text-gray-800">${manga.title}</h1>
      <p class="text-sm sm:text-base text-gray-600 leading-relaxed">${manga.synopsis}</p>
    `;

    // Update details
    detailContainer.innerHTML = `
      <div class="space-y-4">
        <div class="border-b pb-2">
          <p class="text-gray-500 text-sm">Type</p>
          <p class="font-medium text-gray-800">${manga.type}</p>
        </div>
        <div class="border-b pb-2">
          <p class="text-gray-500 text-sm">Chapters</p>
          <p class="font-medium text-gray-800">${
            manga.chapters || "Ongoing"
          }</p>
        </div>
        <div class="border-b pb-2">
          <p class="text-gray-500 text-sm">Volumes</p>
          <p class="font-medium text-gray-800">${manga.volumes || "Ongoing"}</p>
        </div>
        <div class="border-b pb-2">
          <p class="text-gray-500 text-sm">Status</p>
          <p class="font-medium text-gray-800">${manga.status}</p>
        </div>
        <div class="border-b pb-2">
          <p class="text-gray-500 text-sm">Start Date</p>
          <p class="font-medium text-gray-800">${
            manga.published.string.split(" to ")[0]
          }</p>
        </div>
        <div class="border-b pb-2">
          <p class="text-gray-500 text-sm">End Date</p>
          <p class="font-medium text-gray-800">${
            manga.published.string.split(" to ")[1] || "Ongoing"
          }</p>
        </div>
        <div class="border-b pb-2">
          <p class="text-gray-500 text-sm">Authors</p>
          <div class="font-medium text-gray-800 space-y-1">
            ${manga.authors.map((author) => `<p>${author.name}</p>`).join("")}
          </div>
        </div>
        <div class="border-b pb-2">
          <p class="text-gray-500 text-sm">Serializations</p>
          <div class="font-medium text-gray-800 space-y-1">
            ${manga.serializations
              .map((serial) => `<p>${serial.name}</p>`)
              .join("")}
          </div>
        </div>
        <div class="border-b pb-2">
          <p class="text-gray-500 text-sm">Genres</p>
          <div class="font-medium text-gray-800 space-y-1">
            ${manga.genres.map((genre) => `<p>${genre.name}</p>`).join("")}
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

        const characterDiv = `
          <div class="flex bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="flex w-full cursor-pointer" onclick="window.location.href='character_detail.html?characterName=${encodeURIComponent(
              character.character.name
            )}&characterImage=${encodeURIComponent(
          character.character.images.jpg.image_url
        )}'">
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
  } catch (error) {
    console.error(error);
    // Hide loading indicator and main content
    loadingIndicator.classList.add("hidden");
    mainContent.classList.add("hidden");
    // Show error message
    document.body.innerHTML = `
      <div class="flex items-center justify-center h-screen">
        <div class="text-center text-red-600">
          Error loading manga details. Please try again later.<br>
          ${error.message}
        </div>
      </div>
    `;
  }
}

fetchMangaDetails();
