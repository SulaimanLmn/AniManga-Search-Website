// Get the voice actor name from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const vaImageUrl = decodeURIComponent(urlParams.get("vaImage") || "");
const vaName = decodeURIComponent(urlParams.get("vaName") || "");

async function fetchVoiceActorDetails(vaName) {
  const loadingIndicator = document.getElementById("loading-indicator");
  const mainContent = document.getElementById("main-content");
  const vaBioContainer = document.getElementById("va-bio");
  const vaNameContainer = document.getElementById("va-name");
  const vaDescriptionContainer = document.getElementById("va-desc");
  const vaImage = document.getElementById("va-img");
  const charactersList = document.getElementById("characters-list");

  // Show loading, hide content
  loadingIndicator.classList.remove("hidden");
  mainContent.classList.add("hidden");

  const query = `
    query {
        Staff(search: "${vaName}") {
            id
            name {
                full
                native
                alternative
            }
            image {
                large
            }
            description
            dateOfBirth {
                year
                month
                day
            }
            age
            gender
            yearsActive
            homeTown
            bloodType
            primaryOccupations
            characters(sort: FAVOURITES_DESC) {
                nodes {
                    name {
                        full
                    }
                    image {
                        medium
                    }
                    media(sort: POPULARITY_DESC) {
                        nodes {
                            title {
                                english
                                romaji
                            }
                            type
                            format
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

    if (data.data && data.data.Staff) {
      const va = data.data.Staff;

      // Update image
      vaImage.src = vaImageUrl || va.image.large;

      // Update name section
      vaNameContainer.innerHTML = `
                <h1 class="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800">${
                  va.name.full
                }</h1>
                ${
                  va.name.native
                    ? `<p class="text-base sm:text-lg text-gray-600 mt-1">${va.name.native}</p>`
                    : ""
                }
                ${
                  va.name.alternative && va.name.alternative.length > 0
                    ? `<p class="text-xs sm:text-sm text-gray-500 mt-2">Also known as: ${va.name.alternative.join(
                        ", "
                      )}</p>`
                    : ""
                }
            `;

      // Update bio section
      vaBioContainer.innerHTML = `
                <h2 class="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Personal Details</h2>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    ${
                      va.dateOfBirth
                        ? `
                    <div class="border-b pb-2">
                        <p class="text-gray-500 text-xs sm:text-sm">Birthday</p>
                        <p class="font-medium text-sm sm:text-base text-gray-800">
                            ${va.dateOfBirth.month}/${va.dateOfBirth.day}/${va.dateOfBirth.year}
                        </p>
                    </div>
                    `
                        : ""
                    }
                    ${
                      va.age
                        ? `
                    <div class="border-b pb-2">
                        <p class="text-gray-500 text-xs sm:text-sm">Age</p>
                        <p class="font-medium text-sm sm:text-base text-gray-800">${va.age}</p>
                    </div>
                    `
                        : ""
                    }
                    ${
                      va.gender
                        ? `
                    <div class="border-b pb-2">
                        <p class="text-gray-500 text-xs sm:text-sm">Gender</p>
                        <p class="font-medium text-sm sm:text-base text-gray-800">${va.gender}</p>
                    </div>
                    `
                        : ""
                    }
                    ${
                      va.bloodType
                        ? `
                    <div class="border-b pb-2">
                        <p class="text-gray-500 text-xs sm:text-sm">Blood Type</p>
                        <p class="font-medium text-sm sm:text-base text-gray-800">${va.bloodType}</p>
                    </div>
                    `
                        : ""
                    }
                    ${
                      va.homeTown
                        ? `
                    <div class="border-b pb-2">
                        <p class="text-gray-500 text-xs sm:text-sm">Hometown</p>
                        <p class="font-medium text-sm sm:text-base text-gray-800">${va.homeTown}</p>
                    </div>
                    `
                        : ""
                    }
                    ${
                      va.yearsActive
                        ? `
                    <div class="border-b pb-2">
                        <p class="text-gray-500 text-xs sm:text-sm">Years Active</p>
                        <p class="font-medium text-sm sm:text-base text-gray-800">${va.yearsActive.join(
                          " - "
                        )}</p>
                    </div>
                    `
                        : ""
                    }
                </div>
            `;

      // Update description
      vaDescriptionContainer.innerHTML = `
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Background</h2>
                <div class="prose max-w-none">
                    <p class="text-gray-600 leading-relaxed whitespace-pre-line">${
                      va.description || "No description available."
                    }</p>
                </div>
            `;

      // Update characters list
      if (va.characters && va.characters.nodes.length > 0) {
        charactersList.innerHTML = va.characters.nodes
          .map((character) => {
            const media = character.media.nodes[0];
            return `
                <div class="py-4 mb-2 border-b last:border-b-0">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors w-full"
                             onclick="window.location.href='character_detail.html?characterName=${encodeURIComponent(
                               character.name.full
                             )}&characterImage=${encodeURIComponent(
              character.image.medium
            )}'">
                            <img src="${character.image.medium}" alt="" 
                                 class="w-12 h-12 rounded-full object-cover">
                            <div class="flex-1">
                                <p class="font-medium text-gray-800">${
                                  character.name.full
                                }</p>
                                <p class="text-sm text-gray-500">${
                                  media.title.english || media.title.romaji
                                }</p>
                            </div>
                            <div class="text-sm text-gray-500">
                                <span class="inline-block px-2 py-1 bg-gray-100 rounded">${
                                  media.type
                                }</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
          })
          .join("");
      } else {
        charactersList.innerHTML =
          '<p class="text-gray-600">No characters found.</p>';
      }

      // Show content, hide loading
      loadingIndicator.classList.add("hidden");
      mainContent.classList.remove("hidden");
    }
  } catch (error) {
    console.error("Error fetching voice actor details:", error);
    loadingIndicator.classList.add("hidden");
    document.body.innerHTML = `
            <div class="flex items-center justify-center h-screen">
                <div class="text-center text-red-600">
                    Error loading voice actor details. Please try again later.<br>
                    ${error.message}
                </div>
            </div>
        `;
  }
}

// Add a check to prevent fetching with empty name
if (vaName && vaName !== "Unknown") {
  fetchVoiceActorDetails(vaName);
} else {
  document.body.innerHTML = `
        <div class="flex items-center justify-center h-screen">
            <div class="text-center text-red-600">
                No voice actor name provided or voice actor is unknown.
            </div>
        </div>
    `;
}
