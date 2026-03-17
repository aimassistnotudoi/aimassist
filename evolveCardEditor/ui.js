// ====================
// イベント登録
// ====================
export function bindEvents(handlers) {
    const {
        onSearch,
        onBtnSaveEffect,
        onClan,
        onType1,
        onType2,
        onTribe1,
        onTribe2,
        onTribeOp,
        onRarity,
        onAbility,
        onSameName,
        onImportDeck,
        onExportDeck,
    } = handlers;
    //検索
    document.getElementById('filter-name').addEventListener('input', e => {onSearch(e.target.value)});//name
    document.getElementById("filter-clan").addEventListener("change", e => {//clan
        if(!e.target.type == "checkbox") return;
        const clan = e.target.value;
        if(e.target.checked){
            onClan(clan, "add");
        }else{
            onClan(clan, "remove");
        }
    })
    document.getElementById("filter-type-1").addEventListener("change", e => {//type1
        if(!e.target.type == "checkbox") return;
        const type = e.target.value;
        if(e.target.checked){
            onType1(type, "add");
        }else{
            onType1(type, "remove");
        }
    })
    document.getElementById("filter-type-2").addEventListener("change", e => {//type2
        if(!e.target.type == "checkbox") return;
        const type = e.target.value;
        if(e.target.checked){
            onType2(type, "add");
        }else{
            onType2(type, "remove");
        }
    })
    document.getElementById("filter-tribe").addEventListener("change", e => {//tribe
        const tribe = e.target.value;
        const id = e.target.id;
        if(id == "tribe-select1"){
            onTribe1(tribe);
        }
        if(id == "tribe-select2"){
            onTribe2(tribe);
        }
    })
    document.getElementById("filter-tribe-op").addEventListener("change", e => {//tribe and/or
        if(e.target.checked){
            onTribeOp(e.target.value);
        }
    })
    document.getElementById("filter-rarity").addEventListener("change", e => {//rarity
        if(!e.target.type == "checkbox") return;
        const rarity = e.target.value;
        if(e.target.checked){
            onRarity(rarity, "add");
        }else{
            onRarity(rarity, "remove");
        }
    })
    document.getElementById("filter-ability").addEventListener("change", () => {//ability
        let ability = document.getElementById("filter-ability-text").value;
        const labels = document.querySelectorAll("label");
        for(const label of labels){
            const checkbox = label.querySelector("input[type='checkbox']");
            const img = label.querySelector("img");
            if(img && checkbox && checkbox.checked){
                ability = ability + " " + img.src;
            }
        }
        onAbility(ability);
    })
    document.getElementById("filter-same-name").addEventListener("change", e => onSameName(e.target.checked));
        
    //タブ切り替え
    document.getElementById('tab-deck').addEventListener('click', renderTabDeck);
    document.getElementById('tab-view').addEventListener('click', renderTabView);
    //デッキ完成
    document.getElementById('complete-deck').addEventListener('click', renderTabView);
    //デッキインポート
    document.getElementById('import-deck').addEventListener('change', e => {
        const deckFile = e.target.files[0];
        if(deckFile) onImportDeck(deckFile);
        
        e.target.value = ""; //同じファイルを連続で選択できるようにする
    });
    //デッキエクスポート
    document.getElementById('export-deck').addEventListener('click', () => {
        const url = onExportDeck();
        const a = document.createElement('a');
        a.href = url;
        a.download = (document.getElementById("export-deck-name").value || "my_deck") + ".json";
        a.click();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
    })
    //効果編集モーダル
    //---------
    document.getElementById("btn-cancel-effect").addEventListener("click", () => {
        document.getElementById('effect-modal').classList.remove('show');
    })
    document.getElementById("btn-save-effect").addEventListener("click", () => {
        const custom_effect = document.getElementById('effect-editable').innerHTML;
        onBtnSaveEffect(custom_effect);
        document.getElementById('effect-modal').classList.remove('show');
    })
    document.querySelector('.ability-icons').addEventListener('click', e => {
        const editor = document.getElementById('effect-editable');
        const sel = window.getSelection();
        let range
        if(sel.rangeCount === 0 || !editor.contains(sel.anchorNode)){
            range = document.createRange();
            range.selectNodeContents(editor);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }else{
            range = sel.getRangeAt(0);
        }

        const btn = e.target.closest('button');
        if(!btn) return;
        const img = btn.querySelector('img');
        const clone = img.cloneNode();
        insertAtCursor(clone, range);
    })
    //--------
}

function renderTabDeck(){
    document.getElementById('deck-section').classList.remove('hidden');
    document.getElementById('view-section').classList.add('hidden');
}
function renderTabView(){
    document.getElementById('deck-section').classList.add('hidden');
    document.getElementById('view-section').classList.remove('hidden');
}

// ====================
// render
// ====================

export function renderCardList(list, handlers) {
    const {onAdd, onRemove} = handlers;
    const area = document.getElementById('card-list');
    area.innerHTML = '';

    const maxCardsPerPage = 50;
    const totalPages = Math.ceil(list.length / maxCardsPerPage);

    //ページ分割
    for (let page = 0; page < totalPages; page++) {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'page';
        pageDiv.dataset.page = page + 1;
    
        // このページに含まれるカードを抽出
        const start = page * maxCardsPerPage;
        const end = start + maxCardsPerPage;
        const pageCards = list.slice(start, end);
    
        pageCards.forEach(c => {
            const div = document.createElement('div');
            div.className = 'card';
            const a = document.createElement('a');
			div.appendChild(a);
            a.className = 'card-img add';

            const img = document.createElement('img');
			a.appendChild(img);
            img.src = c.img;
            img.alt = c.name;
            img.setAttribute("data-tilt", "");
            img.setAttribute("data-tilt-max", "10");

            const p = document.createElement('p');
			div.appendChild(p);
            p.className = "card-name";
            p.textContent = c.name;
            
            const btnContainer = document.createElement('div');
			div.appendChild(btnContainer);
			btnContainer.className = "button-container";

            const btnRemove = document.createElement('button');
			btnContainer.appendChild(btnRemove);
            btnRemove.className = "remove";
            btnRemove.textContent = "-";

            const btnAdd = document.createElement('button');
			btnContainer.appendChild(btnAdd);
            btnAdd.className = "add";
            btnAdd.textContent = "+";


            div.querySelectorAll('.add').forEach(el => {
				el.addEventListener('click', () => onAdd(c));
				});
            div.querySelector('.remove').addEventListener('click', () => onRemove(c));
            pageDiv.appendChild(div);
        });
    
        // 最初以外は非表示にする
        if (page !== 0) pageDiv.style.display = 'none';
        area.appendChild(pageDiv);
    }
    
      createPagination(totalPages, 1); // ページボタンを作成
      VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
}


function createPagination(totalPages, currentPage) {
    const index = document.getElementById('page-index');
    index.innerHTML = '';
  
    const showPage = (page) => {
        document.querySelectorAll('.page').forEach(div => {
            div.style.display = (div.dataset.page == page) ? 'flex' : 'none';
        });
        createPagination(totalPages, page);
    };
  
    // ページ番号を生成（1 … current-1 current current+1 … last）
    const pages = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        if (currentPage > 3) pages.push(1, '…');
        else if(currentPage === 3) pages.push(1);
        for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
            pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push('…', totalPages);
        else if(currentPage === totalPages - 2) pages.push(totalPages);
    }
  
    // ボタンをDOMに追加
    pages.forEach(p => {
        const btn = document.createElement('button');
        btn.textContent = p;
        btn.disabled = (p === currentPage || p === '…');
        if (p !== '…') btn.addEventListener('click', () => showPage(p));
        index.appendChild(btn);
    });
}

export function renderDeck(deck, dict) {
    const ul = document.getElementById('deck-cards');
    const cards = ul.querySelectorAll('li');
    for (let card of cards) {
        if (!deck[card.id]) { //デッキに存在しないカードは削除
            ul.removeChild(card);
        }
    }
    for (var key in deck) {
        let li = ul.querySelector(`#${key}`);
        if(!li) {
            li = document.createElement('li');
            li.className = "deck-card loading";
            li.id = key;

            const name = document.createElement('span');
            name.className = "deck-card-title";
            name.textContent = `${dict[key].name} × ${deck[key]["count"]}`;

            const thumbnail = document.createElement('div');
            thumbnail.className = "deck-card-thumbnail";

            const img = document.createElement('img');
            img.src = dict[key].img;
            img.alt = dict[key].name;

            thumbnail.appendChild(img);
            li.appendChild(name);
            li.appendChild(thumbnail);
            ul.appendChild(li);
        }
        else {
            li.className = "deck-card loaded";
            li.querySelector('.deck-card-title').textContent = `${dict[key].name} × ${deck[key]["count"]}`;
        }
    }
}


export function renderEffectList(currentDeck, cardDict, handlers) {
    const {onBtnEdit} = handlers;
    const area = document.getElementById('effect-list');
    area.innerHTML = '';
  
    for (const cardId in currentDeck) {
        const card = cardDict[cardId];   // ←ここでカード本体を取り出す

        const div = document.createElement('div');
        div.className = 'effect-item';
        const imgWrap = document.createElement('div');
        imgWrap.className = "effect-img-wrap";

        const img = document.createElement('img');
        img.src = card.img;
        img.alt = card.name;

        const count = document.createElement('span');
        count.className = "card-count";
        count.textContent = `×${currentDeck[cardId]["count"]}`;
        imgWrap.appendChild(img);
        imgWrap.appendChild(count);

        const info = document.createElement('div');
        info.className = "effect-info";
        const strong = document.createElement('strong');
        strong.textContent = card.name;
        const br = document.createElement('br');
        const effect = document.createElement('span');
        const effectText = currentDeck[cardId]["custom_ability"] || card.ability;
        effect.innerHTML = effectText;
        info.appendChild(strong);
        info.appendChild(br);
        info.appendChild(effect);

        const buttons = document.createElement('div');
        buttons.className = "effect-buttons";
        const btnEdit = document.createElement('button');
        btnEdit.className = "btn-edit";
        btnEdit.textContent = "編集";
        const btnReset = document.createElement('button');
        btnReset.className = "btn-reset";
        btnReset.textContent = "リセット";
        buttons.appendChild(btnEdit);
        buttons.appendChild(btnReset);

        div.appendChild(imgWrap);
        div.appendChild(info);
        div.appendChild(buttons);

        area.appendChild(div);

        //編集ボタンへのバインド
        div.querySelector('.btn-edit').addEventListener('click', () => {
            onBtnEdit(cardId);

            const content = document.getElementById('effect-editable');
            content.innerHTML = currentDeck[cardId]["custom_ability"] || card.ability;

            document.getElementById('effect-modal').classList.add('show');
        });

        div.querySelector('.btn-reset').addEventListener('click', () => {
            currentDeck[cardId]["custom_effect"] = null;
            renderEffectList(currentDeck, cardDict, handlers);
        });
    
    }
}
export function renderAbilityIcons(icons){
    const area = document.querySelector('.modal-buttons');
    const div = document.createElement('div');
    div.className = "ability-icons";
    const baseUrl = "https://shadowverse-evolve.com/wordpress/wp-content/images/texticon/icon_";
    for(const icon in icons){
        const btn = document.createElement('button');
        btn.type = "button";
        const img = document.createElement('img');
        img.alt = icons[icon];
        img.src = baseUrl + icon + ".png";
        img.className = "icon-square";
        btn.appendChild(img);
        div.appendChild(btn);
    }
    area.appendChild(div);
}

function insertAtCursor(node, range){
    range.deleteContents();
    range.insertNode(node);

    //カーソルをノードの後ろに移動
    range.setStartAfter(node);
    range.setEndAfter(node);
    sel.removeAllRanges();
    sel.addRange(range);
}


export function renderFilterConditions(tribes, abilityIcons){
    //tribe
    const select1 = document.getElementById('tribe-select1');
    const select2 = document.getElementById('tribe-select2');
    for(const tribe of tribes){
        const option1 = document.createElement('option');
        option1.value = tribe;
        option1.textContent = tribe;
        select1.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = tribe;
        option2.textContent = tribe;
        select2.appendChild(option2);
    }

    //abilityIcons
    const area = document.getElementById('filter-ability');
    for (const icon in abilityIcons) {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        const img = document.createElement('img');
        img.alt = abilityIcons[icon];
        img.src = "https://shadowverse-evolve.com/wordpress/wp-content/images/texticon/icon_" + icon + ".png";
        img.className = "icon-square";
        label.appendChild(checkbox);
        label.appendChild(img);
        area.appendChild(label);
    }
}