// Get the character name from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const characterImageUrl = urlParams.get("characterImage");
const characterId = urlParams.get("characterId");
const characterName = urlParams.get("characterName"); // Assuming the URL has characterName parameter

// Fetch character details based on name
fetchAniListCharacterDetails(characterName);

async function fetchAniListCharacterDetails(characterName) {
  const characterBioContainer = document.getElementById("character-bio");
  const characterNameContainer = document.getElementById("character-name");
  const characterDescriptionContainer =
    document.getElementById("character-desc");
  const characterImage = document.getElementById("character-img");

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
            }
            dateOfBirth {
                year
                month
                day
            }
            description
            image {
                large
            }
            media {
                edges {
                    node {
                        title {
                            romaji
                            english
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

    // Check if the character data is available
    if (data.data && data.data.Character) {
      const character = data.data.Character;
      //   console.log(characterImageUrl);
      characterImage.src = characterImageUrl;
      characterDescriptionContainer.innerHTML = `<p class="leading-relaxed">${character.description}</p>`;

      characterNameContainer.innerHTML = `
                <p class="text-4xl">${character.name.full}</p>
                <p>${character.name.native}</p>
            `;
      characterBioContainer.innerHTML = `
                <p>Birthday: ${monthNames[character.dateOfBirth.month - 1]} ${
        character.dateOfBirth.day
      }</p>
                <p>Initial Age: ${
                  new Date().getFullYear() - character.dateOfBirth.year
                }</p>
                <p>Gender: Male</p> <!-- Replace with actual gender if available -->
                <p>Initial Height: 170 cm (5'7")</p> <!-- Replace with actual height if available -->
            `;
    }
  } catch (error) {
    console.error("Error fetching character details:", error);
  }
}
