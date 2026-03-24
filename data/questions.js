const QUIZ_DATA = {
  personagem: [
    {
      id: "p1",
      question: "Este NPC vende feitiços iniciais e é encontrado no Santuário de Firelink. Quem é ele?",
      options: ["Griggs de Vinheim", "Big Hat Logan", "Rickert de Vinheim", "Yoel de Londor"],
      answer: "Griggs de Vinheim",
      hint: "Ele fica preso em uma sala no Burg Inferior.",
      category: "personagem"
    },
    {
      id: "p2",
      question: "Qual cavaleiro sem-cabeça serve de boss opcional na base do Castelo de Drangleic?",
      options: ["Velstadt", "Pursuers", "The Rotten", "Velstadt, o Herald Real"],
      answer: "Pursuers",
      hint: "Ele pode aparecer em vários locais antes do confronto principal.",
      category: "personagem"
    },
    {
      id: "p3",
      question: "Este personagem de Dark Souls III é descrito como o 'Firekeeper' do Santuário de Firelink. Qual é o seu papel?",
      options: ["Guardar a chama e ajudar o Ashen One", "Vender itens de magia", "Forjar armas", "Ensinar gestos"],
      answer: "Guardar a chama e ajudar o Ashen One",
      hint: "Ela pode ver através de um olho especial que lhe foi dado.",
      category: "personagem"
    },
    {
      id: "p4",
      question: "Quem é o mercador que usa um chapéu incomum e é encontrado no Undead Burg em Dark Souls 1?",
      options: ["Andre de Astora", "Undead Merchant (masculino)", "Patches", "Oswald de Carim"],
      answer: "Undead Merchant (masculino)",
      hint: "Ele vende a chave da Torre de Havel.",
      category: "personagem"
    },
    {
      id: "p5",
      question: "Qual personagem traiu os Deuses de Anor Londo e se aliou ao Caos?",
      options: ["Smough", "Ornstein", "Gwyndolin", "Lautrec de Carim"],
      answer: "Lautrec de Carim",
      hint: "Ele pode matar a Firekeeper se não for eliminado a tempo.",
      category: "personagem"
    },
    {
      id: "p6",
      question: "Em Bloodborne, qual é o nome do médico que introduz o jogador ao ritual de transfusão de sangue?",
      options: ["Gehrman", "Iosefka", "Alfred", "Willem"],
      answer: "Iosefka",
      hint: "Ela opera uma clínica no início do jogo.",
      category: "personagem"
    },
    {
      id: "p7",
      question: "Quem forja armas e armaduras no Santuário de Firelink em Dark Souls III?",
      options: ["Cornyx de Pântano Oscuro", "Andre", "Greirat", "Orbeck de Vinheim"],
      answer: "Andre",
      hint: "Este ferreiro também aparece no primeiro Dark Souls.",
      category: "personagem"
    }
  ],

  item: [
    {
      id: "i1",
      question: "Qual anel, encontrado em Anor Londo, reduz o dano de quedas ao mínimo?",
      options: ["Ring of Favor", "Havel's Ring", "Silvercat Ring", "Speckled Stoneplate Ring"],
      answer: "Silvercat Ring",
      hint: "Um gato famoso está relacionado a este item.",
      category: "item"
    },
    {
      id: "i2",
      question: "Este consumível restaura completamente o HP e remove efeitos negativos. Como se chama?",
      options: ["Humanity", "Divine Blessing", "Estus Flask", "Green Blossom"],
      answer: "Divine Blessing",
      hint: "Extremamente raro e muito valorizado em speedruns.",
      category: "item"
    },
    {
      id: "i3",
      question: "Qual arma é obtida pela alma do boss Sif, o Grande Lobo Cinzento?",
      options: ["Fume Ultra Greatsword", "Greatsword of Artorias", "Moonlight Greatsword", "Black Knight Sword"],
      answer: "Greatsword of Artorias",
      hint: "Requer transposição com o ferreiro usando a alma do lobo.",
      category: "item"
    },
    {
      id: "i4",
      question: "Qual é o nome do item que permite ao jogador se tornar humano novamente e acender fogueiras em Dark Souls 1?",
      options: ["Effigy", "Homeward Bone", "Humanity", "Bonfire Ascetic"],
      answer: "Humanity",
      hint: "Pode ser encontrado em ratos e é essencial para o modo online.",
      category: "item"
    },
    {
      id: "i5",
      question: "Em Dark Souls III, qual item consumível enfraquece permanentemente uma fogueira ao ser usado nela?",
      options: ["Undead Bone Shard", "Ashen Estus Flask", "Ember", "Bonfire Ascetic"],
      answer: "Undead Bone Shard",
      hint: "Encontrar e queimar estes fragmentos aumenta a cura do Estus.",
      category: "item"
    },
    {
      id: "i6",
      question: "Qual escudo tem 100% de absorção física e é considerado o melhor escudo padrão da série?",
      options: ["Eagle Shield", "Black Iron Greatshield", "Tower Shield", "Havel's Greatshield"],
      answer: "Black Iron Greatshield",
      hint: "Pertence ao set de Black Iron, associado a um cavaleiro famoso.",
      category: "item"
    }
  ],

  cenario: [
    {
      id: "c1",
      question: "Qual área de Dark Souls 1 é conhecida pela neblina tóxica e pelos inimigos que causam Bleed?",
      options: ["Blighttown", "The Depths", "Demon Ruins", "Valley of Drakes"],
      answer: "Blighttown",
      hint: "Famosa por causar queda de FPS na versão original para PS3.",
      category: "cenario"
    },
    {
      id: "c2",
      question: "Em qual cidade de pedra flutuante o jogador enfrenta os bosses Ornstein e Smough?",
      options: ["Lordran", "Anor Londo", "Irithyll of the Boreal Valley", "Drangleic Castle"],
      answer: "Anor Londo",
      hint: "Esta cidade é iluminada por uma luz artificial criada por Gwyndolin.",
      category: "cenario"
    },
    {
      id: "c3",
      question: "Qual área de Dark Souls III é considerada a mais difícil da base game e precede o boss final Soul of Cinder?",
      options: ["Archdragon Peak", "Grand Archives", "Kiln of the First Flame", "Lothric Castle"],
      answer: "Kiln of the First Flame",
      hint: "É o destino final da jornada do Ashen One.",
      category: "cenario"
    },
    {
      id: "c4",
      question: "Em Bloodborne, qual é o nome do bairro inicial onde o jogador começa sua jornada?",
      options: ["Cathedral Ward", "Yharnam Central", "Central Yharnam", "Old Yharnam"],
      answer: "Central Yharnam",
      hint: "Aqui você encontra os primeiros caçadores hostis e os cães da guarda.",
      category: "cenario"
    },
    {
      id: "c5",
      question: "Qual área de Dark Souls II é acessada ao coletarear quatro Grandes Almas e é o local do boss Throne Defender e Watcher?",
      options: ["Drangleic Castle", "Black Gulch", "Forest of Fallen Giants", "Shaded Woods"],
      answer: "Drangleic Castle",
      hint: "Este castelo dá nome ao próprio jogo.",
      category: "cenario"
    },
    {
      id: "c6",
      question: "Em qual área secreta de Dark Souls 1 é possível encontrar a raça dos Oolacile e revisitar o passado de Artorias?",
      options: ["Ash Lake", "The Duke's Archives", "Oolacile Township", "Crystal Cave"],
      answer: "Oolacile Township",
      hint: "Esta área só é acessível através do DLC Artorias of the Abyss.",
      category: "cenario"
    }
  ],

  musica: [
    {
      id: "m1",
      question: "Qual é o nome da trilha tocada durante o combate contra Gwyn, Lord of Cinder, em Dark Souls 1?",
      options: ["Lordvessel", "Gwyn, Lord of Cinder", "Firelink Shrine", "Prologue"],
      answer: "Gwyn, Lord of Cinder",
      hint: "Composta por Motoi Sakuraba, é tocada inteiramente ao piano.",
      category: "musica"
    },
    {
      id: "m2",
      question: "A música ambiente do Santuário de Firelink em Dark Souls III foi composta por qual artista?",
      options: ["Yuka Kitamura", "Motoi Sakuraba", "Nobuo Uematsu", "Hitoshi Sakimoto"],
      answer: "Yuka Kitamura",
      hint: "Esta compositora é responsável pela maioria das trilhas de DS3.",
      category: "musica"
    },
    {
      id: "m3",
      question: "Qual trilha toca durante o combate contra o Nameless King em Dark Souls III?",
      options: ["Soul of Cinder", "Nameless King", "Pontiff Sulyvahn", "Consumed King"],
      answer: "Nameless King",
      hint: "A peça tem duas fases distintas, uma para cada fase do boss.",
      category: "musica"
    },
    {
      id: "m4",
      question: "Como se chama a trilha tocada na luta contra Ludwig em Bloodborne: The Old Hunters?",
      options: ["Ludwig, the Holy Blade", "The Holy Moonlight Sword", "Living Failures", "Maria of the Astral Clocktower"],
      answer: "Ludwig, the Holy Blade",
      hint: "A música muda drasticamente na segunda fase do boss.",
      category: "musica"
    },
    {
      id: "m5",
      question: "A música 'Soul of Cinder' em Dark Souls III inclui uma referência musical a qual jogo anterior da série?",
      options: ["Dark Souls 2", "Demon's Souls", "Dark Souls 1 (tema de Gwyn)", "Bloodborne"],
      answer: "Dark Souls 1 (tema de Gwyn)",
      hint: "Preste atenção na segunda fase do boss final.",
      category: "musica"
    },
    {
      id: "m6",
      question: "Qual compositor é responsável pelas trilhas principais de Dark Souls 1 e 2?",
      options: ["Yuka Kitamura", "Kenji Ito", "Motoi Sakuraba", "Yasunori Mitsuda"],
      answer: "Motoi Sakuraba",
      hint: "Ele também compôs para a série Star Ocean e Tales of.",
      category: "musica"
    }
  ]
};

const CATEGORY_META = {
  personagem: { label: "Personagem", icon: "⚔️", description: "Identifique o habitante de Lordran" },
  item:        { label: "Item",       icon: "🏺", description: "Reconheça o equipamento ou consumível" },
  cenario:     { label: "Cenário",    icon: "🏰", description: "Onde esta área está localizada?" },
  musica:      { label: "Música",     icon: "🎵", description: "Reconheça a trilha sonora" }
};