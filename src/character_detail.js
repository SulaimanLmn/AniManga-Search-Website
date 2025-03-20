// Get the character name from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const characterImageUrl = urlParams.get("characterImage");
const characterId = urlParams.get("characterId");
const characterName = urlParams.get("characterName"); // Assuming the URL has characterName parameter

// Fetch character details based on name
fetchAniListCharacterDetails(characterName);

async function fetchAniListCharacterDetails(characterName) {
  const loadingIndicator = document.getElementById("loading-indicator");
  const mainContent = document.getElementById("main-content");
  const characterBioContainer = document.getElementById("character-bio");
  const characterNameContainer = document.getElementById("character-name");
  const characterDescriptionContainer =
    document.getElementById("character-desc");
  const characterImage = document.getElementById("character-img");
  const appearancesList = document.getElementById("appearances-list");

  // Show loading, hide content
  loadingIndicator.classList.remove("hidden");
  mainContent.classList.add("hidden");

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const query = `
    query {
        Character(search: "${characterName}") {
            id
            name {
                full
                native
                alternative
            }
            dateOfBirth {
                year
                month
                day
            }
            gender
            age
            bloodType
            description
            favourites
            image {
                large
            }
            media {
                edges {
                    node {
                        id
                        idMal
                        title {
                            romaji
                            english
                        }
                        type
                        format
                        seasonYear
                        averageScore
                    }
                    characterRole
                    voiceActors(language: JAPANESE) {
                        name {
                            full
                        }
                        image {
                            medium
                        }
                    }
                }
            }
        }
    }`;

  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.data && data.data.Character) {
      const character = data.data.Character;

      // Update image
      characterImage.src = characterImageUrl || character.image.large;

      // Update name section
      characterNameContainer.innerHTML = `
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800">${
          character.name.full
        }</h1>
        ${
          character.name.native
            ? `<p class="text-base sm:text-lg text-gray-600 mt-1">${character.name.native}</p>`
            : ""
        }
        ${
          character.name.alternative && character.name.alternative.length > 0
            ? `<p class="text-xs sm:text-sm text-gray-500 mt-2">Also known as: ${character.name.alternative.join(
                ", "
              )}</p>`
            : ""
        }
      `;

      // Update bio section
      const birthday =
        character.dateOfBirth.month && character.dateOfBirth.day
          ? `${monthNames[character.dateOfBirth.month - 1]} ${
              character.dateOfBirth.day
            }`
          : "Unknown";

      const age = character.dateOfBirth.year
        ? `${new Date().getFullYear() - character.dateOfBirth.year} years old`
        : character.age || "Unknown";

      characterBioContainer.innerHTML = `
        <h2 class="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Personal Details</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            ${
              character.dateOfBirth.month && character.dateOfBirth.day
                ? `
            <div class="border-b pb-2">
                <p class="text-gray-500 text-xs sm:text-sm">Birthday</p>
                <p class="font-medium text-sm sm:text-base text-gray-800">${birthday}</p>
            </div>
            `
                : ""
            }
            <div class="border-b pb-2">
                <p class="text-gray-500 text-xs sm:text-sm">Age</p>
                <p class="font-medium text-sm sm:text-base text-gray-800">${age}</p>
            </div>
            ${
              character.gender
                ? `
            <div class="border-b pb-2">
                <p class="text-gray-500 text-xs sm:text-sm">Gender</p>
                <p class="font-medium text-sm sm:text-base text-gray-800">${character.gender}</p>
            </div>
            `
                : ""
            }
            ${
              character.bloodType
                ? `
            <div class="border-b pb-2">
                <p class="text-gray-500 text-xs sm:text-sm">Blood Type</p>
                <p class="font-medium text-sm sm:text-base text-gray-800">${character.bloodType}</p>
            </div>
            `
                : ""
            }
            <div class="border-b pb-2">
                <p class="text-gray-500 text-xs sm:text-sm">Favorites</p>
                <p class="font-medium text-sm sm:text-base text-gray-800">${
                  character.favourites || 0
                }</p>
            </div>
        </div>
      `;

      // Update description
      characterDescriptionContainer.innerHTML = `
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Background</h2>
        <div class="prose max-w-none">
          <p class="text-gray-600 leading-relaxed whitespace-pre-line">${
            character.description || "No description available."
          }</p>
        </div>
      `;

      // Update appearances
      const appearances = character.media.edges
        .filter(
          (edge) =>
            (edge.node.title.english || edge.node.title.romaji) &&
            edge.node.idMal
        )
        .map((edge) => ({
          title: edge.node.title.english || edge.node.title.romaji,
          type: edge.node.type,
          format: edge.node.format,
          year: edge.node.seasonYear,
          role: edge.characterRole,
          id: edge.node.idMal,
        }));

      appearancesList.innerHTML =
        appearances.length > 0
          ? appearances
              .map(
                (app) => `
            <div class="py-4 mb-2 border-b last:border-b-0">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <div class="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors duration-300" onclick="window.location.href='${app.type.toLowerCase()}_detail.html?${app.type.toLowerCase()}Id=${
                  app.id
                }'">
                        <span class="inline-block px-2 py-1 text-xs font-medium bg-gray-100 rounded">${
                          app.type
                        }</span>
                        <span class="text-gray-700 font-medium">${
                          app.title
                        }</span>
                    </div>
                    <div class="flex items-center gap-2 sm:gap-4 text-sm text-gray-500">
                        <span>${app.format || "Unknown format"}</span>
                        <span>${app.year || "Year unknown"}</span>
                        <span>${app.role || "Unknown role"}</span>
                    </div>
                </div>
            </div>
        `
              )
              .join("")
          : '<p class="text-gray-600">No appearances found.</p>';

      // Hide loading, show content
      loadingIndicator.classList.add("hidden");
      mainContent.classList.remove("hidden");
    }
  } catch (error) {
    console.error("Error fetching character details:", error);
    loadingIndicator.classList.add("hidden");
    document.body.innerHTML = `
      <div class="flex items-center justify-center h-screen">
        <div class="text-center text-red-600">
          Error loading character details. Please try again later.<br>
          ${error.message}
        </div>
      </div>
    `;
  }
}

if (characterName) {
  fetchAniListCharacterDetails(characterName);
} else {
  document.body.innerHTML = `
    <div class="flex items-center justify-center h-screen">
      <div class="text-center text-red-600">
        No character name provided.
      </div>
    </div>
  `;
}
