const searchBar = document.getElementById("searchbar");

// Genre mapping according to Jikan API documentation
const genreMap = {
  Action: 1,
  Adventure: 2,
  Comedy: 4,
  Drama: 8,
  Fantasy: 10,
  Horror: 14,
  Mystery: 7,
  Romance: 22,
  "Sci-Fi": 24,
  "Slice of Life": 36,
  Sports: 30,
  Supernatural: 37,
  Thriller: 41,
  Military: 38,
  School: 23,
  Psychological: 40,
  Music: 19,
  Mecha: 18,
  Historical: 13,
};

let selectedGenres = [];
let selectedYear = null;
let currentSearch = "";

// Event listeners for search
searchBar.addEventListener("keydown", (userInput) => {
  if (userInput.key == "Enter") {
    currentSearch = userInput.target.value;
    applyAllFilters();
  }
});

searchBar.addEventListener("input", (userInput) => {
  if (userInput.target.value == "") {
    currentSearch = "";
    applyAllFilters();
  }
});

// Generate years dropdown content
function generateYearsDropdown() {
  const yearsDropdown = document.getElementById("years-dropdown");

  // Generate years from 2000 to 2025
  for (let year = 2000; year <= 2025; year++) {
    const yearDiv = document.createElement("div");
    yearDiv.className =
      "flex justify-between items-center p-2.5 cursor-pointer hover:bg-gray-100";
    yearDiv.onclick = function () {
      toggleCheck(this, year.toString());
    };
    yearDiv.innerHTML = `
            <span>${year}</span>
            <img src="assets/check.png" class="check-icon hidden w-3.5 h-3.5" alt="">
        `;
    yearsDropdown.appendChild(yearDiv);
  }
}

// Dropdown toggle functions
function toggleGenresDropdown(event) {
  event.stopPropagation();
  const dropdownButton = document.getElementById("genres-dropdown");
  const yearsDropdown = document.getElementById("years-dropdown");

  // Close years dropdown if open
  yearsDropdown.classList.add("hidden");

  // Toggle genres dropdown
  dropdownButton.classList.toggle("hidden");
}

function toggleYearsDropdown(event) {
  event.stopPropagation();
  const dropdownButton = document.getElementById("years-dropdown");
  const genresDropdown = document.getElementById("genres-dropdown");

  // Close genres dropdown if open
  genresDropdown.classList.add("hidden");

  // Toggle years dropdown
  dropdownButton.classList.toggle("hidden");
}

// Close dropdowns when clicking outside
window.addEventListener("click", (event) => {
  const genresDropdown = document.getElementById("genres-dropdown");
  const yearsDropdown = document.getElementById("years-dropdown");
  const genresButton = document.getElementById("genres-dropdown-btn");
  const yearsButton = document.getElementById("years-dropdown-btn");

  if (
    !genresButton.contains(event.target) &&
    !genresDropdown.contains(event.target)
  ) {
    genresDropdown.classList.add("hidden");
  }

  if (
    !yearsButton.contains(event.target) &&
    !yearsDropdown.contains(event.target)
  ) {
    yearsDropdown.classList.add("hidden");
  }
});

function toggleCheck(element, value) {
  const checkIcon = element.querySelector(".check-icon");
  const parentId = element.parentElement.id;

  if (parentId === "years-dropdown") {
    if (selectedYear === value) {
      // If clicking the same year, deselect it
      checkIcon.classList.add("hidden");
      selectedYear = null;
    } else {
      // If clicking a different year, deselect all and select the new one
      const allYearChecks = document.querySelectorAll(
        "#years-dropdown .check-icon"
      );
      allYearChecks.forEach((icon) => icon.classList.add("hidden"));
      checkIcon.classList.remove("hidden");
      selectedYear = value;
    }
  } else {
    // For genres (multiple selection allowed)
    checkIcon.classList.toggle("hidden");
    const genreId = genreMap[value];

    if (checkIcon.classList.contains("hidden")) {
      selectedGenres = selectedGenres.filter((id) => id !== genreId);
    } else {
      if (!selectedGenres.includes(genreId)) {
        selectedGenres.push(genreId);
      }
    }
  }

  // Update the dropdown button text
  updateDropdownButtonText();

  // Apply all filters
  applyAllFilters();
}

function updateDropdownButtonText() {
  // Update genres button text
  const genresBtn = document
    .getElementById("genres-dropdown-btn")
    .querySelector("p");
  if (selectedGenres.length > 0) {
    const selectedGenreNames = Object.entries(genreMap)
      .filter(([_, id]) => selectedGenres.includes(id))
      .map(([name]) => name);
    genresBtn.textContent = selectedGenreNames.join(", ");
  } else {
    genresBtn.textContent = "Any";
  }

  // Update years button text
  const yearsBtn = document
    .getElementById("years-dropdown-btn")
    .querySelector("p");
  yearsBtn.textContent = selectedYear || "Any";
}

async function applyAllFilters() {
  const animeContainer = document.getElementById("anime-cards-container");
  const loadingIndicator = document.getElementById("loading-indicator");

  let queryParts = [];

  // Add search query if exists
  if (currentSearch && currentSearch.trim() !== "") {
    queryParts.push(`q=${encodeURIComponent(currentSearch)}`);
  }

  // Add genres if selected
  if (selectedGenres.length > 0) {
    queryParts.push(`genres=${selectedGenres.join(",")}`);
  }

  // Add year if selected
  if (selectedYear) {
    const startDate = `${selectedYear}-01-01`;
    const endDate = `${selectedYear}-12-31`;
    queryParts.push(`start_date=${startDate}`);
    queryParts.push(`end_date=${endDate}`);
  }

  queryParts.push("limit=20");
  queryParts.push("sfw=true");

  const queryString = queryParts.join("&");
  const url = `https://api.jikan.moe/v4/anime?${queryString}`;

  try {
    // Show loading indicator
    loadingIndicator.classList.remove("hidden");
    // Clear existing anime cards
    animeContainer.innerHTML = "";

    // Add delay to respect API rate limiting
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();

    // Hide loading indicator
    loadingIndicator.classList.add("hidden");

    if (!data.data || data.data.length === 0) {
      animeContainer.innerHTML = `
        <div class="w-full text-center text-gray-600">
          No results found for the selected filters
        </div>
      `;
      return;
    }

    data.data.forEach((anime) => {
      const animeCard = document.createElement("div");
      animeCard.innerHTML = `
        <div class="flex flex-col w-full sm:w-[300px] h-[580px] gap-2 bg-white shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl" onclick="window.location.href='anime_detail.html?animeId=${
          anime.mal_id
        }'">
          <img src="${
            anime.images.jpg.image_url
          }" class="w-full sm:w-[300px] h-[370px] rounded-t-md object-cover transition-transform duration-300 group-hover:scale-110" id="animeImg" alt="${
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
              <p class="text-[14px]">${
                anime.genres
                  ? anime.genres.map((genre) => genre.name).join(", ")
                  : "No genres available"
              }</p>
            </div>
          </div>
        </div>
      `;
      animeContainer.appendChild(animeCard);
    });
  } catch (error) {
    // Hide loading indicator and show error
    loadingIndicator.classList.add("hidden");

    console.error("Error fetching anime:", error);
    console.log("URL that caused error:", url);
    animeContainer.innerHTML = `
      <div class="w-full text-center text-red-600">
        Error loading results. Please try again later. <br>
        Please wait a moment and try again (API rate limit).
      </div>
    `;
  }
}

// Initialize the years dropdown and load initial anime
generateYearsDropdown();
applyAllFilters();
