'use strict';

// ─── Estado ───────────────────────────────────────────────────────────────────
const STATE = {
  target: null,
  guesses: [],
  guessedIds: new Set(),
  won: false,
  maxGuesses: 10
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
  modalNext:   () => document.getElementById('modalNext')
};

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
function submitGuess(charId, isInitialLoad = false) {
  if (STATE.won && !isInitialLoad) return;
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

  // Insere no topo
  area.insertBefore(row, area.firstChild);
  
  // No carregamento inicial, não esperamos o frame para revelar (animação instantânea ou via CSS)
  if (isInitialLoad) {
    row.classList.add('revealed');
  } else {
    requestAnimationFrame(() => row.classList.add('revealed'));
  }

  STATE.guesses.push({ char, comparison });

  // Atualiza contadores (removidos conforme solicitado)


  if (!isInitialLoad) {
    EL.input().value = '';
    closeSuggestions();
    saveProgress();
  }

  // Verifica vitória/derrota
  if (char.id === STATE.target.id) {
    STATE.won = true;
    if (isInitialLoad) {
        showVictoryModal(char); // Mostra direto sem delay se já ganhou hoje
    } else {
        setTimeout(() => showVictoryModal(char), 700);
    }
  } else if (STATE.guesses.length >= STATE.maxGuesses) {
    if (isInitialLoad) {
        showDefeatModal();
    } else {
        setTimeout(() => showDefeatModal(), 700);
    }
  }
}

// ─── Autocomplete ─────────────────────────────────────────────────────────────
let selectedSuggestionIndex = -1;

function filterSuggestions(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().trim();
  return CHARACTERS.filter(c =>
    !STATE.guessedIds.has(c.id) &&
    c.name.toLowerCase().includes(q)
  ).slice(0, 8);
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

  matches.forEach((char, i) => {
    const li = document.createElement('li');
    li.className = 'suggestion-item';
    li.setAttribute('role', 'option');
    li.setAttribute('id', `suggestion-${i}`);
    li.setAttribute('aria-selected', 'false');
    li.innerHTML = `
      <span class="sug-avatar" aria-hidden="true">${char.emoji}</span>
      <div class="sug-info">
        <span class="sug-name">${highlightMatch(char.name, EL.input().value)}</span>
        <span class="sug-meta">${char.game} · ${char.type}</span>
      </div>
    `;
    li.addEventListener('click', () => submitGuess(char.id));
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
    const items = EL.suggestions().querySelectorAll('.suggestion-item');
    const count = items.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion((selectedSuggestionIndex + 1) % count);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion((selectedSuggestionIndex - 1 + count) % count);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < count) {
        items[selectedSuggestionIndex].click();
      } else if (count === 1) {
        items[0].click();
      }
    } else if (e.key === 'Escape') {
      closeSuggestions();
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#searchContainer')) {
      closeSuggestions();
    }
  });
}

// ─── Modais ───────────────────────────────────────────────────────────────────
function showVictoryModal(char) {
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
  EL.modalChar().innerHTML = `
    <div class="modal-char-display">
      <span class="modal-char-emoji" aria-hidden="true">${char.emoji}</span>
      <span class="modal-char-name">${char.name}</span>
      <span class="modal-char-meta">${char.type} · ${char.game}</span>
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

  document.getElementById('btnCloseModal').addEventListener('click', () => {
    modal.classList.add('hidden');
  }, { once: true });

  document.getElementById('btnShare').addEventListener('click', shareResult, { once: true });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });
}

function showDefeatModal() {
  EL.modalSub().textContent = `Você foi derrotado. O personagem era...`;
  EL.modalChar().innerHTML = `
    <div class="modal-char-display">
      <span class="modal-char-emoji" aria-hidden="true">${STATE.target.emoji}</span>
      <span class="modal-char-name">${STATE.target.name}</span>
      <span class="modal-char-meta">${STATE.target.type} · ${STATE.target.game}</span>
    </div>
  `;
  document.getElementById('victoryTitle').textContent = 'A Chama se Apagou';
  EL.modalScore().textContent = 'Tente novamente amanhã, Undead.';

  startCountdown();

  const modal = EL.modal();
  modal.classList.remove('hidden');
  EL.input().disabled = true;

  document.getElementById('btnCloseModal').addEventListener('click', () => {
    modal.classList.add('hidden');
  }, { once: true });
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
  const emojiMap = { correct: '🟩', partial: '🟨', incorrect: '🟥' };
  const fields = ['type','game','height','weight','weapon','race','gender'];

  const lines = STATE.guesses.map(g =>
    fields.map(f => emojiMap[g.comparison[f].result]).join('')
  ).join('\n');

  const today = new Date();
  const dateStr = today.toLocaleDateString('pt-BR');

  const text = `🔥 Dark Souls — Who Am I? (${dateStr})\n${lines}\n${STATE.guesses.length} tentativa${STATE.guesses.length !== 1 ? 's' : ''}\n#DarkSoulsQuiz`;

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
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('toast-visible');
  setTimeout(() => toast.classList.remove('toast-visible'), 2500);
}

// ─── Persistência ─────────────────────────────────────────────────────────────
function getTodayKey() {
  const d = new Date();
  return `dsq_${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
}

function saveProgress() {
  const data = {
    guessedIds: [...STATE.guessedIds],
    guesses: STATE.guesses.map(g => ({ charId: g.char.id })),
    won: STATE.won
  };
  localStorage.setItem(getTodayKey(), JSON.stringify(data));
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(getTodayKey());
    if (!raw) return;
    const data = JSON.parse(raw);
    data.guesses.forEach(g => {
      const char = CHARACTERS.find(c => c.id === g.charId);
      if (char) submitGuess(char.id, true);
    });
  } catch {}
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

// ─── Inicialização ────────────────────────────────────────────────────────────
function init() {
  // Verifica preferência de movimento
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) initParticles();

  STATE.target = getDailyCharacter();

  initInputEvents();
  loadProgress();

  // Foco inicial no input
  EL.input().focus();
}

document.addEventListener('DOMContentLoaded', init);