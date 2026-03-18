export async function loadCardJson() {
    try {
        const cardsRes = await fetch('cards.json');
        const uniqueRes = await fetch('unique_cards.json');

        const cards = await cardsRes.json();
        const uniqueCards = await uniqueRes.json();

        return [cards["cards"], uniqueCards["cards"]];
    } catch (error) {
        console.error('Error loading card JSON:', error);
        return [[], []];
    }
}

export async function importDeckJson(deckFile) {
    try{
        return JSON.parse(await deckFile.text());
    }
    catch(error){
        console.error('Error parsing deck JSON:', error);
        throw error;
    }
}

export function exportDeckJson(deckData) {
    try{
        const json = JSON.stringify(deckData, null, 2);
        const blob = new Blob([json], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        return url;
    }
    catch(error){
        console.error('Error exporting deck JSON:', error);
        throw error;
    }
}