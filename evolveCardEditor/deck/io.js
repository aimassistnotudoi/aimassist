import { supabase } from '../supabase.js';

export async function saveDeckToServer(userId, deckData){
    const {id, name, cards} = deckData;
    if(!cards){
        console.error('Deck data is missing cards:', deckData);
        throw new Error('Deck data is missing cards');
    }
    if(id !== null && id !== undefined){
        // Update existing deck
        const { data, error } = await supabase.rpc(
            'update_deck',
            {
                target_user_id: userId,
                target_id: id,
                target_name: name,
                target_cards: cards
            }
        )
        if(error){
            console.error('Error updating deck:', error);
            throw error;
        }

        if(data) return;
        deckData.id = null;
    }

    // Insert new deck
    const { data, error } = await supabase.rpc(
        'create_deck',
        {
            target_user_id: userId,
            target_name: name,
            target_cards: cards
        }
    )
    if(error){
        console.error('Error inserting deck:', error);
        throw error;
    }
    // Set the new id to deckData
    deckData.id = data;
}

export async function loadDecksFromServer(userId){
    const { data, error } = await supabase.rpc(
        'get_decks',
        {
            target_user_id: userId
        }
    );

    if(error){
        console.error('Error fetching decks:', error);
        throw error;
    }

    return data ?? [];
}

export async function loadCardJson() {
    try {
        const cardsRes = await fetch('../cards.json');
        const uniqueRes = await fetch('../unique_cards.json');

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

// export function saveDeckToLocal(deckData) {
//     try{
//         localStorage.setItem('currentDeck', JSON.stringify(deckData));
//     }
//     catch(error){
//         console.error('Error saving deck to localStorage:', error);
//     }
// }   