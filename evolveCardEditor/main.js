document.getElementById("deck-button").addEventListener("click", () => {
    const clan = document.querySelector('input[name="clan"]:checked');

    if (!clan) {
        location.href = "deck/index.html";
    }

    location.href = `deck/index.html?clan=${clan.value}`;
})