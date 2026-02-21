import {
    initCards,
    addCardToDeck,
    removeCardFromDeck,
    getFilteredCards,
    getAllCards,
    getCardDict,
    getCurrentDeck,
    getFilterConditions,
    getEditingCardId,
    setConditionsName,
    setEditingCardId,
    setConditionsClan,

    // setConditionsCost,
    // setConditionsType,
    // setConditionsTypeOperator,
    // setConditionsRarity,
    abilityIcons,
} from './state.js';
import {
    bindEvents,
    renderCardList,
    renderDeck,
    renderEffectList,
    renderAbilityIcons,
} from './ui.js';
import {
    loadCardJson,
    // loadEffectJson,
    // exportEffectJson
} from './io.js';

// ====================
// 初期化
// ====================
async function init() {
    const cards = await loadCardJson();
    initCards(cards);

    renderAll();
    renderAbilityIcons(abilityIcons);//一度きり

    // ====================
    // イベント登録
    // ====================
    bindEvents({
        onSearch: (value) => {
            setConditionsName(value);
            renderAll();
        },
        onBtnSaveEffect:(value)=>{
            getCardDict()[getEditingCardId()].custom_effect = value
            renderEffectList(getCurrentDeck(), getCardDict(), {onBtnEdit: setEditingCardId});
        },
        onClan: (clan, op) => {
            setConditionsClan(clan, op);
            renderAll();
        }
    })
}

// ====================
// render橋渡し
// ====================

function handleAdd(card) {
    addCardToDeck(card);
    const deck = getCurrentDeck();
    const dict = getCardDict();
    renderDeck(deck, dict);
    renderEffectList(deck, dict, {onBtnEdit: setEditingCardId});
}
function handleRemove(card) {
    removeCardFromDeck(card);
    const deck = getCurrentDeck();
    const dict = getCardDict();
    renderDeck(deck, dict);
    renderEffectList(deck, dict, {onBtnEdit: setEditingCardId});
}

function renderAll() {
    const allCards = getAllCards();
    const filterConditions = getFilterConditions();
    const currentDeck = getCurrentDeck();
    const cardDict = getCardDict();
    const cards = getFilteredCards(allCards, filterConditions);

    renderCardList(
        cards,
        {
            onAdd: handleAdd,
            onRemove: handleRemove
        }
    );
    renderDeck(currentDeck, cardDict);
    renderEffectList(currentDeck, cardDict, {onBtnEdit: setEditingCardId});
}

// ====================
// 起動
// ====================
init();
