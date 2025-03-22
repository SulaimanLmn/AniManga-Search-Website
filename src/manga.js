const searchBar = document.getElementById("searchbar");

// Genre mapping for manga according to Jikan API
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
  Boys_Love: 28,
  Girls_Love: 26,
  Gourmet: 47,
  Harem: 35,
  Historical: 13,
  Isekai: 62,
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

// Generate genres dropdown content
function generateGenresDropdown() {
  const genresDropdown = document.getElementById("genres-dropdown");
  Object.keys(genreMap).forEach((genre) => {
    const genreDiv = document.createElement("div");
    genreDiv.className =
      "flex justify-between items-center p-2.5 cursor-pointer hover:bg-gray-100";
    genreDiv.onclick = function () {
      toggleCheck(this, genre);
    };
    genreDiv.innerHTML = `
            <span>${genre.replace("_", " ")}</span>
            <img src="assets/check.png" class="check-icon hidden w-3.5 h-3.5" alt="">
        `;
    genresDropdown.appendChild(genreDiv);
  });
}

// Generate years dropdown content
function generateYearsDropdown() {
  const yearsDropdown = document.getElementById("years-dropdown");
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
  yearsDropdown.classList.add("hidden");
  dropdownButton.classList.toggle("hidden");
}

function toggleYearsDropdown(event) {
  event.stopPropagation();
  const dropdownButton = document.getElementById("years-dropdown");
  const genresDropdown = document.getElementById("genres-dropdown");
  genresDropdown.classList.add("hidden");
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
      checkIcon.classList.add("hidden");
      selectedYear = null;
    } else {
      const allYearChecks = document.querySelectorAll(
        "#years-dropdown .check-icon"
      );
      allYearChecks.forEach((icon) => icon.classList.add("hidden"));
      checkIcon.classList.remove("hidden");
      selectedYear = value;
    }
  } else {
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

  updateDropdownButtonText();
  applyAllFilters();
}

function updateDropdownButtonText() {
  const genresBtn = document
    .getElementById("genres-dropdown-btn")
    .querySelector("p");
  if (selectedGenres.length > 0) {
    const selectedGenreNames = Object.entries(genreMap)
      .filter(([_, id]) => selectedGenres.includes(id))
      .map(([name]) => name.replace("_", " "));
    genresBtn.textContent = selectedGenreNames.join(", ");
  } else {
    genresBtn.textContent = "Any";
  }

  const yearsBtn = document
    .getElementById("years-dropdown-btn")
    .querySelector("p");
  yearsBtn.textContent = selectedYear || "Any";
}

async function applyAllFilters() {
  const mangaContainer = document.getElementById("manga-cards-container");
  const loadingIndicator = document.getElementById("loading-indicator");

  let queryParts = [];

  if (currentSearch && currentSearch.trim() !== "") {
    queryParts.push(`q=${encodeURIComponent(currentSearch)}`);
  }

  if (selectedGenres.length > 0) {
    queryParts.push(`genres=${selectedGenres.join(",")}`);
  }

  if (selectedYear) {
    const startDate = `${selectedYear}-01-01`;
    const endDate = `${selectedYear}-12-31`;
    queryParts.push(`start_date=${startDate}`);
    queryParts.push(`end_date=${endDate}`);
  }

  queryParts.push("limit=20");
  queryParts.push("sfw=true");

  const queryString = queryParts.join("&");
  const url = `https://api.jikan.moe/v4/manga?${queryString}`;

  try {
    loadingIndicator.classList.remove("hidden");
    mangaContainer.innerHTML = "";

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    loadingIndicator.classList.add("hidden");

    if (!data.data || data.data.length === 0) {
      mangaContainer.innerHTML = `
                <div class="w-full text-center text-gray-600">
                    No results found for the selected filters
                </div>
            `;
      return;
    }

    data.data.forEach((manga) => {
      const mangaCard = document.createElement("div");
      mangaCard.innerHTML = `
                <div class="w-[300px] bg-white shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl rounded-md cursor-pointer" onclick="window.location.href='manga_detail.html?mangaId=${
                  manga.mal_id
                }'">
                    <img src="${manga.images.jpg.image_url}" 
                         class="w-[300px] h-[400px] rounded-t-md object-cover" 
                         alt="${manga.title}">
                    <div class="flex flex-col h-[200px] p-4">
                        <h3 class="text-[1.1rem] font-semibold mb-2 line-clamp-2">${
                          manga.title
                        }</h3>
                        <div class="flex flex-col gap-2 mt-auto">
                            <p class="text-[14px]">${
                              manga.chapters
                                ? `${manga.chapters} chapters`
                                : "Ongoing"
                            }</p>
                            <p class="text-[14px]">${manga.status}</p>
                            <div class="flex items-center w-max text-[13px] py-0.5 px-1.5 rounded-md bg-yellow-200 gap-1.5">
                                <img src="assets/star-icon.png" class="w-3.5 h-3.5" alt="Star Icon">
                                <p>${
                                  manga.score != null ? manga.score : "Unrated"
                                }</p>
                            </div>
                            <p class="text-[12px] line-clamp-1 text-gray-600">${
                              manga.genres
                                ? manga.genres
                                    .map((genre) => genre.name)
                                    .join(", ")
                                : "No genres available"
                            }</p>
                        </div>
                    </div>
                </div>
            `;
      mangaContainer.appendChild(mangaCard);
    });
  } catch (error) {
    loadingIndicator.classList.add("hidden");
    console.error("Error fetching manga:", error);
    mangaContainer.innerHTML = `
            <div class="w-full text-center text-red-600">
                Error loading results. Please try again later.<br>
                Please wait a moment and try again (API rate limit).
            </div>
        `;
  }
}

// Initialize dropdowns and load initial manga
generateGenresDropdown();
generateYearsDropdown();
applyAllFilters();
