import {
    initCards,
    addCardToDeck,
    removeCardFromDeck,
    getFilteredCards,
    getDisplayCards,
    getAllCards,
    getUniqueCards,
    getCardDict,
    getCurrentDeck,
    getFilterConditions,
    getEditingCardId,
    setConditionsName,
    setEditingCardId,
    setDisplayCards,
    changeConditionsClan,
    changeConditionsType1,
    changeConditionsType2,
    setConditionsTribe1,
    setConditionsTribe2,
    setConditionsTribeOp,
    changeConditionsRarity,
    setConditionsAbility,

    // setConditionsCost,
    // setConditionsType,
    // setConditionsTypeOperator,
    // setConditionsRarity,
    abilityIcons,
    tribes,
} from './state.js';
import {
    bindEvents,
    renderCardList,
    renderDeck,
    renderEffectList,
    renderAbilityIcons,
    renderFilterConditions,
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
    const [cards, uniqueCards] = await loadCardJson();
    initCards(cards, uniqueCards);

    renderAll();
    renderAbilityIcons(abilityIcons);//一度きり
    renderFilterConditions(tribes, abilityIcons);//一度きり

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
            changeConditionsClan(clan, op);
            renderAll();
        },
        onType1: (type, op) => {
            changeConditionsType1(type, op);
            renderAll();
        },
        onType2: (type, op) => {
            changeConditionsType2(type, op);
            renderAll();
        },
        onTribe1:(tribe) => {
            setConditionsTribe1(tribe);
            renderAll();
        },
        onTribe2:(tribe) => {
            setConditionsTribe2(tribe);
            renderAll();
        },
        onTribeOp:(op)=>{
            setConditionsTribeOp(op);
            renderAll();
        },
        onRarity:(rarity, op)=>{
            changeConditionsRarity(rarity, op);
            renderAll();
        },
        onAbility:(ability)=>{
            setConditionsAbility(ability);
            renderAll();
        },
        onSameName:(checked)=>{
            if(checked) setDisplayCards(getUniqueCards());
            else setDisplayCards(getAllCards());
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
    const displayCards = getDisplayCards();
    const filterConditions = getFilterConditions();
    const currentDeck = getCurrentDeck();
    const cardDict = getCardDict();
    const cards = getFilteredCards(displayCards, filterConditions);

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
