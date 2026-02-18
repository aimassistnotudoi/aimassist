// ====================
// イベント登録
// ====================
export function bindEvents(handlers) {
    const {
        onSearch,
        onBtnSaveEffect,
    } = handlers;
    //検索
    document.getElementById('search').addEventListener('input', e => {onSearch(e.target.value)});
    //タブ切り替え
    document.getElementById('tab-deck').addEventListener('click', renderTabDeck);
    document.getElementById('tab-view').addEventListener('click', renderTabView);
    //デッキ完成
    document.getElementById('complete-deck').addEventListener('click', renderTabView);

    document.getElementById("btn-cancel-effect").addEventListener("click", () => {
        document.getElementById('effect-modal').classList.remove('show');
    })
    document.getElementById("btn-save-effect").addEventListener("click", () => {
        const custom_effect = document.getElementById('effect-editable').innerHTML;
        onBtnSaveEffect(custom_effect);
        document.getElementById('effect-modal').classList.remove('show');
    })
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
          div.innerHTML = `
            <img src="${c.img}" alt="${c.name}">
            <p>${c.name}</p>
            <button class="add">+</button>
            <button class="remove">−</button>
          `;
          div.querySelector('.add').addEventListener('click', () => onAdd(c));
          div.querySelector('.remove').addEventListener('click', () => onRemove(c));
          pageDiv.appendChild(div);
        });
    
        // 最初以外は非表示にする
        if (page !== 0) pageDiv.style.display = 'none';
        area.appendChild(pageDiv);
      }
    
      createPagination(totalPages, 1); // ページボタンを作成
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
  var text="";
  for (var key in deck) {
    text += 
    `<li class="deck-card">
      <div class="deck-card-thumbnail">
        <img src="${dict[key].img}" alt="${dict[key].name}">
        <span class="deck-card-title">${dict[key].name} × ${deck[key]}</span>
      </div>
    </li>`;
  }
  ul.innerHTML = text;
}


export function renderEffectList(currentDeck, cardDict, handlers) {
    const {onBtnEdit} = handlers;
    const area = document.getElementById('effect-list');
    area.innerHTML = '';
  
    for (const cardId in currentDeck) {
        const card = cardDict[cardId];   // ←ここでカード本体を取り出す

        const div = document.createElement('div');
        div.className = 'effect-item';
        div.innerHTML = `
        <div class = "effect-img-wrap">
            <img src="${card.img}">
            <span class = "card-count">×${currentDeck[cardId]}</span>
        </div>
        <div class = "effect-info">
            <strong>${card.name}</strong><br>
            ${card.custom_effect || card.ability}
        </div>
            <div class="effect-buttons">
            <button class="btn-edit">編集</button>
            <button class="btn-reset">リセット</button>
        </div>
        `;
        area.appendChild(div);

        //編集ボタンへのバインド
        div.querySelector('.btn-edit').addEventListener('click', () => {
            onBtnEdit(cardId);

            const content = document.getElementById('effect-editable');
            content.innerHTML = card.custom_effect || card.ability;

            document.getElementById('effect-modal').classList.add('show');
        });

        div.querySelector('.btn-reset').addEventListener('click', () => {
            card.custom_effect = null;
            renderEffectList(currentDeck, cardDict, handlers);
        });
    
    }
}
  