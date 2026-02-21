let allCards = []; //全カード配列
let currentDeck = {}; // 現在のデッキ（card_idをキー、枚数を値とした辞書）
let cardDict = {}; // card_idをキーとしたカード辞書
let editingCardId;

export const abilityIcons = {
    fanfare : "ファンファーレ",
    lastword : "ラストワード",
    evolve : "進化",
    stand : "起動",
    act : "アクト",
    quick : "クイック",
    power : "攻撃力",
    hp : "体力",
    cost01 : "コスト1",
    cost02 : "コスト2",
    cost03 : "コスト3",
    cost04 : "コスト4",
    cost05 : "コスト5",
    cost06 : "コスト6",
    cost07 : "コスト7",
    cost08 : "コスト8",
    cost09 : "コスト9",
    cost10 : "コスト10",
}

//検索条件
let filterConditions = {
    //カード名
    //コスト or検索
    //タイプ1
    //タイプ2
    //レアリティ or検索
    //クラス
};

// ====================
// getter/setter
// ====================
export function getAllCards(){return allCards;}
export function getCurrentDeck(){return {...currentDeck};}
export function getCardDict(){return cardDict;}
export function getFilterConditions(){return {...filterConditions};}
export function getEditingCardId(){return editingCardId;}

export function setConditionsName(name){filterConditions.name = name;}
export function setConditionsCost(cost){filterConditions.cost = cost;}
export function setConditionsRarity(rarity){filterConditions.rarity = rarity;}
export function setEditingCardId(cardId){editingCardId = cardId;}

export function changeConditionsClan(clan, op){
    changeConditionsOfList("clan", clan, op);
}
export function changeConditionsType1(type, op){
    changeConditionsOfList("type1", type, op);
}
export function changeConditionsType2(type, op){
    changeConditionsOfList("type2", type, op);
}

function changeConditionsOfList(key, value, op){
    if(op == "add"){
        if(!filterConditions[key]) filterConditions[key] = [value];
        else if(!filterConditions[key].includes(value)) filterConditions[key].push(value);
        return;
    }
    if(op == "remove"){
        if(filterConditions[key]) {
            filterConditions[key] = filterConditions[key].filter(v => v !== value);
            if(filterConditions[key].length === 0) delete filterConditions[key];
        }
        return;
    }
}


// ====================
// 初期化
// ====================
export function initCards(data) {
    allCards = data;
    data.forEach(card => {
        cardDict[card.card_id] = card;
    });
}

// ====================
// カード検索
// ====================
export function getFilteredCards(cards, conditions) {
    let filteredCards = cards.filter(card => {
        if(conditions.name){
            if(!card.name.includes(conditions.name)) return false; //名前検索
        }
        if(conditions.cost){
            if(!conditions.cost.includes(card.cost)) return false; //コスト検索
        }

        if(conditions.type1 && conditions.type2){
            const hasType1 = conditions.type1.some(t => card.type.includes(t));
            const hasType2 = conditions.type2.some(t => {
                if(t == "通常") return !card.type.includes("エボルヴ") && !card.type.includes("アドバンス") && !card.type.includes("トークン");
                return card.type.includes(t);
            });
            if(!hasType1 || !hasType2) return false; //タイプ1とタイプ2両方検索
        }else if(conditions.type1){
            if(!conditions.type1.some(t => card.type.includes(t))) return false; //タイプ1検索
        }else if(conditions.type2){
            if(!conditions.type2.some(t => {
                if(t == "通常") return !card.type.includes("エボルヴ") && !card.type.includes("アドバンス") && !card.type.includes("トークン");
                return card.type.includes(t);
            })) return false; //タイプ2検索
        }

        if(conditions.rarity){
            if(!conditions.rarity.includes(card.rarity)) return false; //レアリティ検索
        }
        if(conditions.clan){
            if(!conditions.clan.includes(card.clan)) return false; //種族検索
        }
        return true;
    })

    return filteredCards;
}

// ====================
// デッキ操作
// ====================
export function addCardToDeck(card) {
    if(!currentDeck[card.card_id]) currentDeck[card.card_id] = 1;
    else if(currentDeck[card.card_id] < 3) currentDeck[card.card_id] += 1; // 3枚上限
    if(currentDeck[card.card_id] > 3) currentDeck[card.card_id] = 3; // 上限を超えないように
}

export function removeCardFromDeck(card) {
    if(currentDeck[card.card_id]) {
        currentDeck[card.card_id] -=1;
        if(currentDeck[card.card_id]<=0) delete currentDeck[card.card_id];
    }
}