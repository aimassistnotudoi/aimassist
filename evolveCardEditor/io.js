export async function loadCardJson() {
    try {
      const cardsRes = await fetch('cards.json');
      const uniqueRes = await fetch('unique_cards.json');

      const cards = await cardsRes.json();
      const uniqueCards = await uniqueRes.json();

      return [cards, uniqueCards];
    } catch (error) {
      console.error('Error loading card JSON:', error);
      return [[], []];
    }
}

// export async function loadDeckJson(deck) {
//     try{
//         const response = await fetch(deck);
//         return await response.json();
//     }
// }