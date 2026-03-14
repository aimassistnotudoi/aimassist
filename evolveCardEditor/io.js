export async function loadCardJson() {
    try {
      const response = await fetch('cards.json');
      return await response.json();
    } catch (error) {
      console.error('Error loading card JSON:', error);
      return [];
    }
}

// export async function loadDeckJson(deck) {
//     try{
//         const response = await fetch(deck);
//         return await response.json();
//     }
// }