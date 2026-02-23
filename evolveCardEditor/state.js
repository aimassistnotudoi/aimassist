let allCards = []; //全カード配列
let currentDeck = {}; // 現在のデッキ（card_idをキー、枚数を値とした辞書）
let cardDict = {}; // card_idをキーとしたカード辞書
let editingCardId;

export const tribes = [" ", '植物族', 'エルフ族', '虫族', '狩人', 'プリンセス', '妖精', '獣', '精霊', '指揮官', '暗殺者', '盗賊', 
    '兵士', 'メイド', '忍者', '魔法使い', '錬金術師', '魔法生物', '土の印', '竜使い', 'ドラゴニュート', '竜族', '不死鳥', 
    '魔界', '死者', 'キラー', '死霊術師', '先導', '信仰', '狂信', '天使', '堕天使', '魔王', '大神', '傭兵', 'ゴブリン', 
    '悪魔', '光輝', '巨人', 'クリスタリア', 'レヴィオン', '貴族', 'ヒーロー', 'ダンサー', '学院', 'ゴーレム', 'チェス', 
    '海洋', '武装', '吸血鬼', '偶像', '超克', 'コック', '童話', '鳥族', 'シンガー', '星神', '円卓', 'プリンス', '禁忌', 
    'ゴルゴーン', '絶傑', '人形', 'マグナ', 'アイドル', '挑戦者', '陰陽師', '妖怪', '探偵', '自然', '機械', '商人', 
    '武闘竜人', 'アルカナ', '荒野', '宴楽', '財宝', '式神', 'ルミナス', 'アナテマ'
]
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
    tribe1: " ",
    tribe2: " ",
    tribeOp: "or", //or,and
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
export function setEditingCardId(cardId){editingCardId = cardId;}
export function setConditionsTribeOp(op){filterConditions.tribeOp = op}
export function setConditionsTribe1(tribe){filterConditions.tribe1 = tribe;}
export function setConditionsTribe2(tribe){filterConditions.tribe2 = tribe;}

export function changeConditionsClan(clan, op){changeConditionsOfList("clan", clan, op);}
export function changeConditionsType1(type, op){changeConditionsOfList("type1", type, op);}
export function changeConditionsType2(type, op){changeConditionsOfList("type2", type, op);}
export function changeConditionsRarity(rarity, op){changeConditionsOfList("rarity", rarity, op);}


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

        if(conditions.type1 && conditions.type2){//タイプ検索
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

        
        const tribes = card.tribe.split("・")
        const tribe1 = conditions.tribe1;
        const tribe2 = conditions.tribe2;
        function hasTribe(tribe) {
            if(tribe === " ") return false; //条件なし
            return tribes.includes(tribe);
        }
        if(tribe1 === " " && tribe2 === " "){}
        else if(conditions.tribeOp === "or"){
            if(!(hasTribe(tribe1) || hasTribe(tribe2))) return false; //種族検索(or)
        }else if(!(hasTribe(tribe1) && hasTribe(tribe2))) return false; //種族検索(and)


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