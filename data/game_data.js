// ─── Banco de Dados de Itens, Cenários e Músicas ──────────────────────────────

const ITEMS = [
  { id: "divine_blessing", name: "Bênção Divina", image: "imgs/item_divine_blessing.jpg", type: "Consumível" },
  { id: "havel_ring", name: "Anel de Havel", image: "imgs/item_havel_ring.jpg", type: "Anel" },
  { id: "estus_flask", name: "Frasco de Estus", image: "imgs/item_estus_flask.jpg", type: "Consumível" },
  { id: "claymore", name: "Claymore", image: "imgs/item_claymore.jpg", type: "Arma" }
];

const SCENERY = [
  { id: "anor_londo", name: "Anor Londo", image: "imgs/cenário (1).jpg", type: "Local" },
  { id: "firelink_shrine", name: "Santuário de Firelink", image: "imgs/cenario_firelink.jpg", type: "Local" },
  { id: "blighttown", name: "Cidade de Moléstia", image: "imgs/cenario_blighttown.jpg", type: "Local" }
];

const MUSIC = [
  { id: "gwyn_theme", name: "Gwyn, Lord of Cinder", audio: "audio/gymn_lordofCinder.mp3", type: "Trilha Sonora" },
  { id: "soul_of_cinder", name: "Soul of Cinder", audio: "audio/Yuka Kitamura - Soul of Cinder.mp3", type: "Trilha Sonora" },
  { id: "majula", name: "Majula Theme", audio: "audio/Majula - Motoi Sakuraba (youtube).mp3", type: "Trilha Sonora" }
];

function getDailyTarget(category) {
  const today = new Date();
  const seed = parseInt(
    `${today.getFullYear()}${String(today.getMonth()+1).padStart(2,'0')}${String(today.getDate()).padStart(2,'0')}`,
    10
  );
  
  let pool = [];
  if (category === 'characters') pool = CHARACTERS;
  else if (category === 'items') pool = ITEMS;
  else if (category === 'scenery') pool = SCENERY;
  else if (category === 'music') pool = MUSIC;
  
  return pool[seed % pool.length];
}
