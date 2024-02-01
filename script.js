function displayData(data) {
  const allPlayersContainer = document.getElementById("allPlayersContainer");
  allPlayersContainer.innerHTML = ""; // Clear previous content

  if (Array.isArray(data)) {
    data.forEach((player) => {
      const playerCard = createPlayerCard(player);
      allPlayersContainer.appendChild(playerCard);
    });
  } else {
    // Assume it's a single player object
    const playerCard = createPlayerCard(data);
    allPlayersContainer.appendChild(playerCard);
  }
}

function createPlayerCard(player) {
  const card = document.createElement("div");
  card.classList.add("player-card");

  const nameElement = document.createElement("p");
  nameElement.textContent = `Name: ${player.name}`;

  const breedElement = document.createElement("p");
  breedElement.textContent = `Breed: ${player.breed}`;

  const imageElement = document.createElement("img");
  imageElement.src = player.imageUrl; // Assuming imageUrl is the property holding the image URL
  imageElement.alt = `${player.name}'s image`; // Alt text for accessibility
  imageElement.classList.add("player-image"); // Add the player-image class

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deletePlayer(player.id));

  card.appendChild(nameElement);
  card.appendChild(breedElement);
  card.appendChild(imageElement);
  card.appendChild(deleteButton);

  return card;
}

// GET - Get all players
async function getAllPlayers() {
  try {
    const response = await fetch(
      "https://fsa-puppy-bowl.herokuapp.com/api/2308-FTB-MT-WEB-PT/players"
    );
    const result = await response.json();
    console.log(result);
    return result.data.players; // Return the array of players
  } catch (error) {
    console.error("Error fetching all players:", error);
    return []; // Return an empty array in case of an error
  }
}

// POST - Create new player
async function createNewPlayer() {
  try {
    const playerName = document.getElementById("playerName").value;
    const playerBreed = document.getElementById("playerBreed").value;

    const response = await fetch(
      "https://fsa-puppy-bowl.herokuapp.com/api/2308-FTB-MT-WEB-PT/players/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: playerName,
          breed: playerBreed,
        }),
      }
    );

    // Fetch the updated list of players
    const updatedPlayers = await getAllPlayers();

    // Display the updated list of players
    displayData(updatedPlayers);
  } catch (error) {
    console.error("Error creating a new player:", error);
  }
}

// DELETE - Delete player by id
async function deletePlayer(playerId) {
  try {
    await fetch(
      `https://fsa-puppy-bowl.herokuapp.com/api/2308-FTB-MT-WEB-PT/players/${playerId}`,
      {
        method: "DELETE",
      }
    );

    console.log(`Player with ID ${playerId} deleted successfully.`);

    // Fetch the updated list of players and refresh the display
    const allPlayers = await getAllPlayers();
    displayData(allPlayers);
  } catch (error) {
    console.error(`Error deleting player with ID ${playerId}:`, error);
  }
}

window.onload = async () => {
  const allPlayers = await getAllPlayers();
  displayData(allPlayers);
};
