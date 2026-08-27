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
    getCurrentDeckData,
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
    setCurrentDeck,

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
    importDeckJson,
    exportDeckJson,
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
            getCurrentDeck()[getEditingCardId()]["custom_ability"] = value
            renderEffectList(getCurrentDeckData(), getCardDict(), {onBtnEdit: setEditingCardId});
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
        },
        onImportDeck:(deckFile)=>{
            importDeckJson(deckFile).then(deckData => {
                console.log('Deck imported successfully:', deckData);
                setCurrentDeck(deckData);
                renderAll();
            }).catch(error => {
                console.error('Error importing deck:', error);
            });
        },
        onExportDeck:()=>{
            return exportDeckJson(getCurrentDeck());
        }
    })
}

// ====================
// render橋渡し
// ====================

function handleAdd(card) {
    addCardToDeck(card);
    const dict = getCardDict();
    renderDeck(getCurrentDeck(), dict);
    renderEffectList(getCurrentDeckData(), dict, {onBtnEdit: setEditingCardId});
}
function handleRemove(card) {
    removeCardFromDeck(card);
    const dict = getCardDict();
    renderDeck(getCurrentDeck(), dict);
    renderEffectList(getCurrentDeckData(), dict, {onBtnEdit: setEditingCardId});
}

function renderAll() {
    const displayCards = getDisplayCards();
    const filterConditions = getFilterConditions();
    const cardDict = getCardDict();
    const cards = getFilteredCards(displayCards, filterConditions);

    renderCardList(
        cards,
        {
            onAdd: handleAdd,
            onRemove: handleRemove
        }
    );
    renderDeck(getCurrentDeck(), cardDict);
    renderEffectList(getCurrentDeckData(), cardDict, {onBtnEdit: setEditingCardId});
}

// ====================
// 起動
// ====================
init();