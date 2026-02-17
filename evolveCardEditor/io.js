export function loadCardJson() {
  return fetch('cards.json')
    .then(response => response.json())
    .catch(error => {
      console.error('Error loading card JSON:', error);
      return [];
    });
}