'use strict';

// ─── Estado ───────────────────────────────────────────────────────────────────
const STATE = {
  category: 'characters', // 'characters', 'items', 'scenery', 'music'
  target:    null,
  guesses:   [],
  guessedIds: new Set(),
  won:       false,
  maxGuesses: 15,    // Aumentado para acomodar a dica
  zoomLevel: 4,      // Para o modo Cenário
  isAudioPlaying: false,
  audioTimer:    null,
  hintUsed:      false
};

// ─── Cache de elementos ───────────────────────────────────────────────────────
const EL = {
  input:       () => document.getElementById('searchInput'),
  suggestions: () => document.getElementById('suggestionList'),
  guessesArea: () => document.getElementById('guessesArea'),
  modal:       () => document.getElementById('victoryModal'),
  modalSub:    () => document.getElementById('victorySubtitle'),
  modalChar:   () => document.getElementById('modalCharacter'),
  modalScore:  () => document.getElementById('modalScore'),
  modalNext:   () => document.getElementById('modalNext'),
  idleScreen:  () => document.getElementById('idleScreen'),
  gameContent: () => document.getElementById('gameContent'),
  menuCards:   () => document.querySelectorAll('.menu-card'),
  btnBack:     () => document.getElementById('btnBackToMenu'),
  
  // Novos elementos
  instruction: () => document.getElementById('instructionText'),
  legend:      () => document.getElementById('gameLegend'),
  vChallenge:  () => document.getElementById('visualChallenge'),
  aChallenge:  () => document.getElementById('audioChallenge'),
  charTable:   () => document.getElementById('characterTable'),
  simpleHist:  () => document.getElementById('simpleHistory'),
  histList:    () => document.getElementById('historyList'),
  imgTarget:   () => document.getElementById('challengeImage'),
  gameAudio:   () => document.getElementById('gameAudio'),
  btnPlay:     () => document.getElementById('btnPlayMusic'),
  playIcon:    () => document.getElementById('playIcon'),
  playLabel:   () => document.getElementById('playLabel'),
  progressBar: () => document.getElementById('audioProgressBar'),

  // Elementos da Dica
  hintModal:   () => document.getElementById('hintModal'),
  hintText:    () => document.getElementById('hintText'),
  hintContent: () => document.getElementById('hintContent'),
  hintActions: () => document.getElementById('hintActions'),
  hintClose:   () => document.getElementById('hintCloseAction'),
};

// ─── Lógica de Dicas ──────────────────────────────────────────────────────────
function showHintRequestModal() {
  if (STATE.hintUsed) return;
  
  const modal = EL.hintModal();
  if (!modal) return;

  EL.hintContent().classList.add('hidden');
  EL.hintActions().classList.remove('hidden');
  EL.hintClose().classList.add('hidden');
  
  modal.classList.remove('hidden');
  
  document.getElementById('btnAcceptHint').onclick = () => {
    STATE.hintUsed = true;
    EL.hintText().textContent = getHintText();
    EL.hintContent().classList.remove('hidden');
    EL.hintActions().classList.add('hidden');
    EL.hintClose().classList.remove('hidden');
    saveProgress();
  };
  
  document.getElementById('btnDeclineHint').onclick = () => {
    modal.classList.add('hidden');
    STATE.hintUsed = true; // Marca como usado mesmo que negue, para não repetir
    saveProgress();
  };

  document.getElementById('btnCloseHintModal').onclick = () => {
    modal.classList.add('hidden');
  };
}

function getHintText() {
  const t = STATE.target;
  if (STATE.category === 'characters') {
    return `DICA: Este personagem é da raça "${t.race}" e sua arma principal é "${t.weapon}".`;
  } else if (STATE.category === 'items' || STATE.category === 'scenery') {
    return `DICA: O nome começa com a letra "${t.name.charAt(0)}" e é classificado como "${t.type}".`;
  } else if (STATE.category === 'music') {
    const gameHint = t.name.includes('DS1') || t.name.includes('Souls I') ? 'Dark Souls I' 
                   : t.name.includes('DS3') || t.name.includes('Souls III') ? 'Dark Souls III' 
                   : t.name.includes('Majula') || t.name.includes('DS2') ? 'Dark Souls II' 
                   : 'Bloodborne';
    return `DICA: Esta trilha sonora pertence ao jogo "${gameHint}".`;
  }
  return "DICA: Continue tentando, Undead!";
}

// ─── Utilitários ──────────────────────────────────────────────────────────────
function normalizeText(text) {
  if (!text) return "";
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

// ─── Comparadores ─────────────────────────────────────────────────────────────
const GAMES_ORDER = ['Dark Souls I','Dark Souls II','Dark Souls III','Bloodborne'];

function compareField(guessVal, targetVal, field) {
  if (field === 'height' || field === 'weight') {
    if (guessVal === targetVal) return 'correct';
    if (Math.abs(guessVal - targetVal) <= (field === 'height' ? 20 : 25)) return 'partial';
    return 'incorrect';
  }
  if (field === 'game') {
    if (guessVal === targetVal) return 'correct';
    const gi = GAMES_ORDER.indexOf(guessVal);
    const ti = GAMES_ORDER.indexOf(targetVal);
    if (Math.abs(gi - ti) === 1) return 'partial';
    return 'incorrect';
  }
  return guessVal === targetVal ? 'correct' : 'incorrect';
}

function compareCharacter(guess, target) {
  return {
    type:   { val: guess.type,   result: compareField(guess.type,   target.type,   'type') },
    game:   { val: guess.game,   result: compareField(guess.game,   target.game,   'game'), arrow: GAMES_ORDER.indexOf(guess.game) < GAMES_ORDER.indexOf(target.game) ? '↑' : GAMES_ORDER.indexOf(guess.game) > GAMES_ORDER.indexOf(target.game) ? '↓' : '' },
    height: { val: guess.height, result: compareField(guess.height, target.height, 'height'), arrow: guess.height < target.height ? '↑' : guess.height > target.height ? '↓' : '' },
    weight: { val: guess.weight, result: compareField(guess.weight, target.weight, 'weight'), arrow: guess.weight < target.weight ? '↑' : guess.weight > target.weight ? '↓' : '' },
    weapon: { val: guess.weapon, result: compareField(guess.weapon, target.weapon, 'weapon') },
    race:   { val: guess.race,   result: compareField(guess.race,   target.race,   'race') },
    gender: { val: guess.gender, result: compareField(guess.gender, target.gender, 'gender') }
  };
}

// ─── Renderização de uma linha de guess ───────────────────────────────────────
function createGuessRow(char, comparison, index) {
  const row = document.createElement('div');
  row.className = 'guess-row';
  row.setAttribute('role', 'row');
  row.setAttribute('aria-label', `Tentativa ${index + 1}: ${char.name}`);
  row.style.animationDelay = '0s';

  // Coluna: Imagem + Nome
  const imgCell = document.createElement('div');
  imgCell.className = 'guess-cell cell-image'; // sem cor de fundo
  imgCell.setAttribute('role', 'cell');
  imgCell.innerHTML = `
    <div class="char-avatar" aria-hidden="true">
      ${char.image
        ? `<img src="${char.image}" alt="${char.name}" class="char-img" />`
        : `<span class="char-emoji">${char.emoji}</span>`}
    </div>
    <span class="char-name">${char.name}</span>
  `;
  row.appendChild(imgCell);

  // Colunas de atributos
  const fields = ['type', 'game', 'height', 'weight', 'weapon', 'race', 'gender'];
  const fieldLabels = {
    type:   'Tipo',
    game:   'Jogo',
    height: 'Altura',
    weight: 'Peso',
    weapon: 'Arma',
    race:   'Raça',
    gender: 'Sexo'
  };

  fields.forEach((field, i) => {
    const data = comparison[field];
    const cell = document.createElement('div');
    cell.className = `guess-cell cell-${field} ${data.result}`;
    cell.setAttribute('role', 'cell');

    let displayVal = data.val;
    if (field === 'height') displayVal = `${data.val}cm`;
    if (field === 'weight') displayVal = `${data.val}kg`;

    const arrowHtml = data.arrow
      ? `<span class="arrow-hint" aria-label="Valor real é ${data.arrow === '↑' ? 'maior' : 'menor'}">${data.arrow}</span>`
      : '';

    cell.setAttribute('aria-label',
      `${fieldLabels[field]}: ${displayVal} — ${
        data.result === 'correct' ? 'correto' :
        data.result === 'partial' ? 'próximo' : 'errado'
      }${data.arrow ? `, valor real é ${data.arrow === '↑' ? 'maior' : 'menor'}` : ''}`
    );

    cell.innerHTML = `
      <span class="cell-value">${displayVal}</span>
      ${arrowHtml}
      <span class="cell-label-mobile" aria-hidden="true">${fieldLabels[field]}</span>
    `;

    // Animação em cascata
    cell.style.animationDelay = `${i * 0.08}s`;
    row.appendChild(cell);
  });

  return row;
}

// ─── Submissão de guess ────────────────────────────────────────────────────────
function submitGuess(value, isInitialLoad = false) {
  if (STATE.won && !isInitialLoad) return;

  if (STATE.category === 'characters') {
    handleCharacterGuess(value, isInitialLoad);
  } else {
    handleChallengeGuess(value, isInitialLoad);
  }

  // Verifica gatilho de dica (ao atingir 10 erros ou mais)
  if (!STATE.won && STATE.guesses.length >= 10 && !STATE.hintUsed && !isInitialLoad) {
    setTimeout(showHintRequestModal, 1000);
  }

  if (!isInitialLoad) {
    EL.input().value = '';
    closeSuggestions();
    saveProgress();
  }
}

function handleCharacterGuess(charId, isInitialLoad) {
  if (STATE.guessedIds.has(charId)) {
    if (!isInitialLoad) showToast('Você já tentou este personagem!');
    return;
  }

  const char = CHARACTERS.find(c => c.id === charId);
  if (!char) return;

  STATE.guessedIds.add(charId);
  const comparison = compareCharacter(char, STATE.target);
  const row = createGuessRow(char, comparison, STATE.guesses.length);

  const area = EL.guessesArea();
  area.insertBefore(row, area.firstChild);
  
  if (isInitialLoad) {
    row.classList.add('revealed');
  } else {
    requestAnimationFrame(() => row.classList.add('revealed'));
  }

  STATE.guesses.push({ char, comparison });

  if (char.id === STATE.target.id) {
    STATE.won = true;
    const delay = isInitialLoad ? 0 : 700;
    setTimeout(() => showVictoryModal(char), delay);
  } else if (STATE.guesses.length >= STATE.maxGuesses) {
    const delay = isInitialLoad ? 0 : 700;
    setTimeout(() => showDefeatModal(), delay);
  }
}

function handleChallengeGuess(guessName, isInitialLoad) {
  const normalizedGuess = normalizeText(guessName);
  const normalizedTarget = normalizeText(STATE.target.name);

  // Impede duplicados no histórico visual
  const isDuplicate = STATE.guesses.some(g => normalizeText(g.name) === normalizedGuess);
  if (isDuplicate && !isInitialLoad) {
    showToast('Você já tentou isso!');
    return;
  }

  const isCorrect = normalizedGuess === normalizedTarget;
  const result = {
    name: guessName,
    correct: isCorrect
  };

  const pool = getCategoryPool();
  const targetItem = pool.find(i => normalizeText(i.name) === normalizedGuess);
  if (targetItem) STATE.guessedIds.add(targetItem.id);

  STATE.guesses.push(result);
  addHistoryItem(result);

  if (isCorrect) {
    STATE.won = true;
    const delay = isInitialLoad ? 0 : 500;
    const currentTarget = STATE.target; // Trava o alvo atual para o modal
    setTimeout(() => showVictoryModal(currentTarget), delay);
  } else {
    // Reduz zoom nos modos visuais se este ainda for o caso
    if (STATE.category === 'scenery' || STATE.category === 'items') {
      STATE.zoomLevel = Math.max(1, STATE.zoomLevel - 0.5);
      updateVisualZoom();
    }

    if (STATE.guesses.length >= STATE.maxGuesses) {
      const delay = isInitialLoad ? 0 : 500;
      setTimeout(() => showDefeatModal(), delay);
    }
  }
}

function addHistoryItem(item) {
  const list = EL.histList();
  const el = document.createElement('div');
  el.className = `history-item ${item.correct ? 'correct' : 'incorrect'}`;
  el.innerHTML = `
    <span class="history-status">${item.correct ? '✅' : '❌'}</span>
    <span class="history-name">${item.name}</span>
    <span class="history-result">${item.correct ? 'Correto' : 'Errado'}</span>
  `;
  list.insertBefore(el, list.firstChild);
}

function updateVisualZoom() {
  const img = EL.imgTarget();
  if (img) {
    img.style.transform = `scale(${STATE.zoomLevel})`;
  }
}

// ─── Autocomplete ─────────────────────────────────────────────────────────────
let selectedSuggestionIndex = -1;

function getCategoryPool() {
  if (STATE.category === 'characters') return CHARACTERS;
  if (STATE.category === 'items') return ITEMS;
  if (STATE.category === 'scenery') return SCENERY;
  if (STATE.category === 'music') return MUSIC;
  return [];
}

function filterSuggestions(query) {
  if (!query || query.length < 1) return [];
  
  const q = normalizeText(query);
  const pool = getCategoryPool();
  
  return pool.filter(item => {
    const itemName = normalizeText(item.name);
    return !STATE.guessedIds.has(item.id) && itemName.includes(q);
  }).sort((a, b) => {
    const nameA = normalizeText(a.name);
    const nameB = normalizeText(b.name);
    const startsA = nameA.startsWith(q);
    const startsB = nameB.startsWith(q);
    if (startsA && !startsB) return -1;
    if (!startsA && startsB) return 1;
    return nameA.localeCompare(nameB);
  }).slice(0, 8);
}

function renderSuggestions(matches) {
  const list = EL.suggestions();
  list.innerHTML = '';
  selectedSuggestionIndex = -1;

  if (matches.length === 0) {
    list.classList.add('hidden');
    EL.input().setAttribute('aria-expanded', 'false');
    return;
  }

  const defaultEmojis = {
    characters: '👤',
    items: '🏺',
    scenery: '🏰',
    music: '<img src="imgs/personagens/Solaris-Photoroom.png" style="width:24px; vertical-align:middle;">'
  };

  matches.forEach((item, i) => {
    const li = document.createElement('li');
    li.className = 'suggestion-item';
    li.setAttribute('role', 'option');
    li.setAttribute('id', `suggestion-${i}`);
    li.setAttribute('aria-selected', 'false');
    
    // Prioriza imagem, depois emoji, depois default
    let visualHtml = '';
    if (item.image) {
      visualHtml = `<img src="${item.image}" alt="" class="sug-img-preview" />`;
    } else {
      const emoji = item.emoji || defaultEmojis[STATE.category];
      visualHtml = `<span class="sug-emoji-preview">${emoji}</span>`;
    }

    const meta = item.game ? `${item.game} · ${item.type}` : (item.type || '');

    li.innerHTML = `
      <div class="sug-avatar" aria-hidden="true">${visualHtml}</div>
      <div class="sug-info">
        <span class="sug-name">${highlightMatch(item.name, EL.input().value)}</span>
        <span class="sug-meta">${meta}</span>
      </div>
    `;
    
    li.addEventListener('click', () => {
      // Para personagens enviamos ID, para os outros enviamos o Nome
      if (STATE.category === 'characters') {
        submitGuess(item.id);
      } else {
        submitGuess(item.name);
      }
    });
    
    li.addEventListener('mouseenter', () => setSelectedSuggestion(i));
    list.appendChild(li);
  });

  list.classList.remove('hidden');
  EL.input().setAttribute('aria-expanded', 'true');
}

function highlightMatch(name, query) {
  if (!query) return name;
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(${escapedQuery})`, 'gi');
  return name.replace(re, '<mark>$1</mark>');
}

function setSelectedSuggestion(index) {
  const items = EL.suggestions().querySelectorAll('.suggestion-item');
  items.forEach((el, i) => {
    el.classList.toggle('selected', i === index);
    el.setAttribute('aria-selected', i === index ? 'true' : 'false');
  });
  selectedSuggestionIndex = index;
  if (index >= 0) {
    EL.input().setAttribute('aria-activedescendant', `suggestion-${index}`);
  }
}

function closeSuggestions() {
  EL.suggestions().classList.add('hidden');
  EL.input().setAttribute('aria-expanded', 'false');
  selectedSuggestionIndex = -1;
}

// ─── Navegação por teclado ────────────────────────────────────────────────────
function initInputEvents() {
  const input = EL.input();

  input.addEventListener('input', (e) => {
    const matches = filterSuggestions(e.target.value);
    renderSuggestions(matches);
  });

  input.addEventListener('keydown', (e) => {
    const suggestionsVisible = !EL.suggestions().classList.contains('hidden');

    if (suggestionsVisible) {
      const items = EL.suggestions().querySelectorAll('.suggestion-item');
      const count = items.length;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestion((selectedSuggestionIndex + 1) % count);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestion((selectedSuggestionIndex - 1 + count) % count);
      } else if (e.key === 'Enter') {
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < count) {
          e.preventDefault();
          items[selectedSuggestionIndex].click();
          return;
        }
      }
    }

    if (e.key === 'Enter') {
      const val = e.target.value.trim();
      if (val) {
        e.preventDefault();
        submitGuess(val);
      }
    }

    if (e.key === 'Escape') {
      closeSuggestions();
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#searchContainer')) {
      closeSuggestions();
    }
  });

  // Efeito de reprodução de áudio
  EL.btnPlay().addEventListener('click', toggleAudio);
}

function toggleAudio() {
  const audio = EL.gameAudio();
  if (STATE.isAudioPlaying) {
    audio.pause();
    STATE.isAudioPlaying = false;
    EL.playIcon().textContent = '▶️';
    EL.playLabel().textContent = 'Ouvir (15s)';
    if (STATE.audioTimer) {
      clearTimeout(STATE.audioTimer);
      STATE.audioTimer = null;
    }
  } else {
    audio.currentTime = 0;
    audio.play();
    STATE.isAudioPlaying = true;
    EL.playIcon().textContent = '⏸️';
    EL.playLabel().textContent = 'Ouvindo...';
    
    // Auto-stop após 15s
    STATE.audioTimer = setTimeout(() => {
      audio.pause();
      STATE.isAudioPlaying = false;
      EL.playIcon().textContent = '▶️';
      EL.playLabel().textContent = 'Ouvir (15s)';
      STATE.audioTimer = null;
    }, 15000);
  }
}

function updateAudioProgress() {
  const audio = EL.gameAudio();
  const bar = EL.progressBar();
  if (!audio || !bar) return;
  
  audio.ontimeupdate = () => {
    const pct = Math.min(100, (audio.currentTime / 15) * 100);
    bar.style.width = `${pct}%`;
  };
}

// ─── Modais ───────────────────────────────────────────────────────────────────
const CATEGORY_ORDER = ['characters', 'items', 'scenery', 'music'];

function navigateToNextMode() {
  const currentIndex = CATEGORY_ORDER.indexOf(STATE.category);
  const nextIndex = currentIndex + 1;
  
  // Esconde o modal atual
  EL.modal().classList.add('hidden');

  if (nextIndex < CATEGORY_ORDER.length) {
    // Vai para a próxima categoria
    initMode(CATEGORY_ORDER[nextIndex]);
  } else {
    // Se era a última, volta para o menu
    EL.gameContent().classList.add('hidden');
    EL.idleScreen().classList.remove('hidden');
  }
}

function showVictoryModal(target) {
  const messages = [
    "Você acendeu a fogueira!",
    "A escuridão recuou diante de você.",
    "O conhecimento é sua maior arma.",
    "Praise the Sun! \\o/",
    "A chama da sabedoria queima em você."
  ];
  const msg = messages[STATE.guesses.length % messages.length];
  
  document.getElementById('victoryTitle').textContent = 'Fogueira Acesa!';
  EL.modalSub().textContent = `${msg} — ${STATE.guesses.length} tentativa${STATE.guesses.length !== 1 ? 's' : ''}`;
  
  const isMusic = STATE.category === 'music';
  const isVisual = STATE.category === 'items' || STATE.category === 'scenery';
  
  // Define o que mostrar visualmente (Imagem ou Emoji/Solaire)
  let visualContent = '';
  if (target.image) {
    visualContent = `
      <div class="char-avatar" aria-hidden="true" style="width: 80px; height: 80px; margin-bottom: 0.5rem; border: 2px solid var(--gold-dim);">
        <img src="${target.image}" alt="${target.name}" class="char-img" style="border-radius: 50%; width: 100%; height: 100%; object-fit: cover;" />
      </div>`;
  } else if (isMusic) {
    visualContent = `
      <div class="char-avatar" aria-hidden="true" style="width: 80px; height: 80px; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: center;">
        <img src="imgs/Solaris-Photoroom.png" alt="Solaire" style="width: 100%; height: auto;" />
      </div>`;
  } else {
    const displayEmoji = target.emoji || (STATE.category === 'items' ? '🏺' : '🏰');
    visualContent = `<span class="modal-char-emoji" aria-hidden="true" style="font-size: 3rem;">${displayEmoji}</span>`;
  }

  // Define os metadados (Tipo, Jogo, etc)
  const displayMeta = target.game ? `${target.type} · ${target.game}` : (target.type || '');

  EL.modalChar().innerHTML = `
    <div class="modal-char-display" style="display: flex; flex-direction: column; align-items: center; text-align: center;">
      ${visualContent}
      <span class="modal-char-name" style="font-size: 1.5rem; color: var(--gold); font-weight: bold;">${target.name}</span>
      <span class="modal-char-meta" style="font-size: 0.9rem; opacity: 0.8;">${displayMeta}</span>
    </div>
  `;

  const scoreMsg = STATE.guesses.length === 1 ? '🏆 Incrível! Primeira tentativa!'
    : STATE.guesses.length <= 3 ? '🥇 Excelente desempenho!'
    : STATE.guesses.length <= 6 ? '🥈 Boa performance!'
    : '🥉 Conseguiu! Continue praticando.';
  EL.modalScore().textContent = scoreMsg;

  startCountdown();

  const modal = EL.modal();
  modal.classList.remove('hidden');
  modal.focus();

  document.getElementById('btnCloseModal').onclick = navigateToNextMode;

  document.getElementById('btnShare').addEventListener('click', shareResult, { once: true });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });
}

function showDefeatModal() {
  EL.modalSub().textContent = `Você foi derrotado. A resposta era...`;
  
  const target = STATE.target;
  const isMusic = STATE.category === 'music';
  const isVisual = STATE.category === 'items' || STATE.category === 'scenery';
  
  // Define o que mostrar visualmente (Imagem ou Emoji/Solaire)
  let visualContent = '';
  if (target.image) {
    visualContent = `
      <div class="char-avatar" aria-hidden="true" style="width: 80px; height: 80px; margin-bottom: 0.5rem; border: 2px solid var(--gold-dim);">
        <img src="${target.image}" alt="${target.name}" class="char-img" style="border-radius: 50%; width: 100%; height: 100%; object-fit: cover;" />
      </div>`;
  } else if (isMusic) {
    visualContent = `
      <div class="char-avatar" aria-hidden="true" style="width: 80px; height: 80px; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: center;">
        <img src="imgs/Solaris-Photoroom.png" alt="Solaire" style="width: 100%; height: auto;" />
      </div>`;
  } else {
    const displayEmoji = target.emoji || (STATE.category === 'items' ? '🏺' : '🏰');
    visualContent = `<span class="modal-char-emoji" aria-hidden="true" style="font-size: 3rem;">${displayEmoji}</span>`;
  }

  // Define os metadados (Tipo, Jogo, etc)
  const displayMeta = target.game ? `${target.type} · ${target.game}` : (target.type || '');

  EL.modalChar().innerHTML = `
    <div class="modal-char-display" style="display: flex; flex-direction: column; align-items: center; text-align: center;">
      ${visualContent}
      <span class="modal-char-name" style="font-size: 1.5rem; color: var(--gold); font-weight: bold;">${target.name}</span>
      <span class="modal-char-meta" style="font-size: 0.9rem; opacity: 0.8;">${displayMeta}</span>
    </div>
  `;
  document.getElementById('victoryTitle').textContent = 'A Chama se Apagou';
  EL.modalScore().textContent = 'Tente novamente amanhã, Undead.';

  startCountdown();

  const modal = EL.modal();
  modal.classList.remove('hidden');
  EL.input().disabled = true;

  document.getElementById('btnCloseModal').onclick = navigateToNextMode;
}

let countdownInterval = null;
function startCountdown() {
  if (countdownInterval) return;
  const el = EL.modalNext();
  function update() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const diff = tomorrow - now;
    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    el.textContent = `Próximo personagem em ${h}:${m}:${s}`;
  }
  update();
  countdownInterval = setInterval(update, 1000);
}

// ─── Compartilhar ─────────────────────────────────────────────────────────────
function shareResult() {
  let lines = "";
  let modeName = "";

  if (STATE.category === 'characters') {
    modeName = "Personagens";
    const emojiMap = { correct: '🟩', partial: '🟨', incorrect: '🟥' };
    const fields = ['type','game','height','weight','weapon','race','gender'];
    lines = STATE.guesses.map(g =>
      fields.map(f => emojiMap[g.comparison[f].result]).join('')
    ).join('\n');
  } else {
    modeName = STATE.category === 'items' ? 'Itens' : STATE.category === 'scenery' ? 'Cenário' : 'Música';
    lines = STATE.guesses.map(g => g.correct ? '🟩' : '🟥').join('');
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString('pt-BR');

  const text = `🔥 Dark Souls DLE — ${modeName} (${dateStr})\n${lines}\n${STATE.guesses.length} tentativa${STATE.guesses.length !== 1 ? 's' : ''}\n#DarkSoulsQuiz`;

  if (navigator.share) {
    navigator.share({ title: 'Dark Souls Who Am I?', text }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Resultado copiado! ✓');
    });
  }
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style = "position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.9);color:var(--gold);padding:0.8rem 1.5rem;border-radius:30px;border:1px solid var(--gold-dim);z-index:1000;opacity:0;transition:opacity 0.3s;pointer-events:none;font-family:var(--font-title);";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  setTimeout(() => toast.style.opacity = '0', 2500);
}

// ─── Persistência ─────────────────────────────────────────────────────────────
function getTodayKey() {
  const d = new Date();
  const base = `dsq_${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  return `${base}_${STATE.category}`;
}

function saveProgress() {
  const data = {
    targetId: STATE.target.id,
    guesses: STATE.guesses,
    won: STATE.won,
    zoom: STATE.zoomLevel
  };
  localStorage.setItem(getTodayKey(), JSON.stringify(data));
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(getTodayKey());
    if (!raw) return;
    const data = JSON.parse(raw);
    
    // Se o alvo mudou (por update de código ou novo dia), limpa progresso antigo
    if (data.targetId && data.targetId !== STATE.target.id) {
      localStorage.removeItem(getTodayKey());
      return;
    }

    STATE.zoomLevel = data.zoom || 4;
    if (STATE.category === 'scenery' || STATE.category === 'items') updateVisualZoom();

    if (data.guesses && data.guesses.length > 0) {
      const pool = getCategoryPool();
      data.guesses.forEach(g => {
        if (STATE.category === 'characters') {
          // Recria as linhas da tabela para personagens
          const char = CHARACTERS.find(c => c.id === (g.charId || g.char?.id));
          if (char) {
            STATE.guessedIds.add(char.id);
            const comparison = compareCharacter(char, STATE.target);
            const row = createGuessRow(char, comparison, STATE.guesses.length);
            const area = EL.guessesArea();
            area.insertBefore(row, area.firstChild);
            row.classList.add('revealed');
            STATE.guesses.push({ char, comparison });
            if (char.id === STATE.target.id) STATE.won = true;
          }
        } else {
          // No modo desafio visual/audio, o guess é um objeto {name, correct}
          addHistoryItem(g);
          STATE.guesses.push(g);
          
          // Popula guessedIds para que não apareçam no autocomplete
          const item = pool.find(i => normalizeText(i.name) === normalizeText(g.name));
          if (item) STATE.guessedIds.add(item.id);

          if (g.correct) STATE.won = true;
        }
      });
      
      if (STATE.won) {
        const currentTarget = STATE.target;
        showVictoryModal(currentTarget);
      } else if (STATE.guesses.length >= STATE.maxGuesses) {
        showDefeatModal();
      }
    }
  } catch(e) { console.error(e); }
}

// ─── Partículas de cinza ──────────────────────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height; // Começa em qualquer lugar na carga inicial
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 20;
      this.size = Math.random() * 3 + 1;
      this.speedY = -(Math.random() * 1.5 + 0.5);
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.life = 1;
      this.hue = Math.random() * 30 + 10; // Tons de laranja/vermelho
      this.maxOpacity = Math.random() * 0.6 + 0.2;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.life -= 0.003;
      if (this.life <= 0 || this.y < -20) this.reset();
    }
    draw() {
      const opacity = this.life * this.maxOpacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${opacity})`;
      
      // Efeito de brilho
      ctx.shadowBlur = this.size * 2;
      ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
      
      ctx.fill();
      
      // Brilho central mais forte
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
      ctx.fill();
      
      // Reseta shadow para performance
      ctx.shadowBlur = 0;
    }
  }

  resize();
  window.addEventListener('resize', resize);

  // Aumenta o número de partículas para 60 para um efeito mais preenchido
  for (let i = 0; i < 60; i++) {
    particles.push(new Particle());
  }

  function animate() {
    // Limpeza com rastro leve (fade out lento para as brasas)
    ctx.fillStyle = 'rgba(8, 8, 16, 0.15)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// ─── Menu de Categorias ───────────────────────────────────────────────────────
function initCategoryMenu() {
  const cards = EL.menuCards();
  const backBtn = EL.btnBack();

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      initMode(category);
    });
  });

  backBtn.addEventListener('click', () => {
    EL.gameContent().classList.add('hidden');
    EL.idleScreen().classList.remove('hidden');
    
    // Reset áudio se estiver tocando
    const audio = EL.gameAudio();
    if (audio) {
      audio.pause();
      STATE.isAudioPlaying = false;
      EL.playIcon().textContent = '▶️';
      EL.playLabel().textContent = 'Ouvir (15s)';
      if (STATE.audioTimer) {
        clearTimeout(STATE.audioTimer);
        STATE.audioTimer = null;
      }
    }
  });
}

function initMode(category) {
  // Parar qualquer áudio se mudar de modo
  if (STATE.category === 'music') {
    const audio = EL.gameAudio();
    if (audio) {
      audio.pause();
      STATE.isAudioPlaying = false;
      if (STATE.audioTimer) clearTimeout(STATE.audioTimer);
    }
  }

  STATE.category = category;
  STATE.guesses = [];
  STATE.guessedIds = new Set();
  STATE.won = false;
  STATE.zoomLevel = 4;
  
  // Limpar interface
  EL.guessesArea().innerHTML = '';
  EL.histList().innerHTML = '';
  EL.input().value = '';
  EL.input().disabled = false;
  
  // Selecionar alvo do dia
  STATE.target = getDailyTarget(category);
  
  // Ajustar UI conforme modo
  const isChar = category === 'characters';
  const isVisual = category === 'items' || category === 'scenery';
  const isMusic = category === 'music';
  
  EL.charTable().classList.toggle('hidden', !isChar);
  EL.vChallenge().classList.toggle('hidden', !isVisual);
  EL.aChallenge().classList.toggle('hidden', !isMusic);
  EL.simpleHist().classList.toggle('hidden', isChar);
  EL.legend().classList.toggle('hidden', !isChar);
  
  if (isChar) {
    EL.instruction().textContent = 'Adivinhe o personagem do dia. Digite um nome para começar.';
    EL.input().placeholder = 'Digite o nome de um personagem...';
  } else if (category === 'items' || category === 'scenery') {
    const msg = category === 'items' ? 'Reconheça o item da imagem.' : 'Identifique o local.';
    EL.instruction().textContent = `${msg} O zoom diminui a cada erro.`;
    EL.input().placeholder = category === 'items' ? 'Que item é este?' : 'Que lugar é este?';
    EL.imgTarget().src = STATE.target.image;
    updateVisualZoom();
  } else if (isMusic) {
    EL.instruction().textContent = 'Sinfonia da Morte. Identifique o tema em 15 segundos.';
    EL.input().placeholder = 'Que música é esta?';
    EL.gameAudio().src = STATE.target.audio;
    updateAudioProgress();
  }

  EL.idleScreen().classList.add('hidden');
  EL.gameContent().classList.remove('hidden');
  EL.input().focus();
  
  loadProgress();
}

// ─── Inicialização ────────────────────────────────────────────────────────────
function init() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) initParticles();

  initInputEvents();
  initCategoryMenu();
  
  // Verifica se há progresso em alguma categoria e restaura se necessário
  // mas aqui deixamos o usuário escolher no menu inicial a menos que queira auto-load
}

document.addEventListener('DOMContentLoaded', init);