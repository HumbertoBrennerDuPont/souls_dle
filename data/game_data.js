// ─── Banco de Dados de Itens, Cenários e Músicas ──────────────────────────────

const ITEMS = [
  { id: "divine_blessing", name: "Bênção Divina", image: "imgs/item_divine_blessing.jpg", type: "Consumível" },
  { id: "havel_ring", name: "Anel de Havel", image: "imgs/item_havel_ring.webp", type: "Anel" },
  { id: "estus_flask", name: "Frasco de Estus", image: "imgs/item_flask_estus.webp", type: "Consumível" },
  { id: "claymore", name: "Claymore", image: "imgs/claymore.png", type: "Arma" },
  { id: "moonlight_gs", name: "Moonlight Greatsword", image: null, type: "Arma" },
  { id: "uchigatana", name: "Uchigatana", image: null, type: "Arma" },
  { id: "zweihander", name: "Zweihander", image: null, type: "Arma" },
  { id: "drake_sword", name: "Drake Sword", image: null, type: "Arma" },
  { id: "fap_ring", name: "Ring of Favor and Protection", image: null, type: "Anel" },
  { id: "chloranthy_ring", name: "Chloranthy Ring", image: null, type: "Anel" },
  { id: "hornet_ring", name: "Hornet Ring", image: null, type: "Anel" },
  { id: "firebomb", name: "Bomba de Fogo", image: null, type: "Consumível" },
  { id: "humanity", name: "Humanidade", image: null, type: "Consumível" },
  { id: "green_blossom", name: "Green Blossom", image: null, type: "Consumível" },
  { id: "master_key", name: "Chave Mestra", image: null, type: "Item Chave" },
  { id: "small_doll", name: "Pequena Boneca", image: null, type: "Item Chave" },
  { id: "homeward_bone", name: "Osso de Regresso", image: null, type: "Consumível" },
  { id: "repair_powder", name: "Pó de Reparação", image: null, type: "Consumível" },
  { id: "gold_pine_resin", name: "Resina de Pinheiro Dourado", image: null, type: "Consumível" },
  { id: "lloyds_talisman", name: "Talismã de Lloyd", image: null, type: "Consumível" },
  { id: "black_firebomb", name: "Bomba de Fogo Negra", image: null, type: "Consumível" },
  { id: "dung_pie", name: "Torta de Estume", image: null, type: "Consumível" },
  { id: "prism_stone", name: "Pedra de Prisma", image: null, type: "Consumível" },
  { id: "alluring_skull", name: "Crânio Atraente", image: null, type: "Consumível" },
  { id: "bloodbite_ring", name: "Anel de Mordida de Sangue", image: null, type: "Anel" },
  { id: "poisonbite_ring", name: "Anel de Mordida de Veneno", image: null, type: "Anel" },
  { id: "clings_ring", name: "Anel de Reclamação", image: null, type: "Anel" },
  { id: "ring_of_steel_protection", name: "Anel de Proteção de Aço", image: null, type: "Anel" },
  { id: "covenant_of_artorias", name: "Pacto de Artorias", image: null, type: "Anel" },
  { id: "orange_charred_ring", name: "Anel Carbonizado Laranja", image: null, type: "Anel" },
  { id: "rusted_iron_ring", name: "Anel de Ferro Enferrujado", image: null, type: "Anel" },
  { id: "grass_crest_shield", name: "Escudo de Emblema de Grama", image: null, type: "Arma" },
  { id: "havels_shield", name: "Escudo de Havel", image: null, type: "Arma" },
  { id: "black_knight_gs", name: "Espada Grande de Cavaleiro Negro", image: null, type: "Arma" },
  { id: "balder_side_sword", name: "Espada Lateral de Balder", image: null, type: "Arma" },
  { id: "ricards_rapier", name: "Rapieira de Ricard", image: null, type: "Arma" },
  { id: "butcher_knife", name: "Faca de Carniceiro", image: null, type: "Arma" },
  { id: "dragon_tooth", name: "Dente de Dragão", image: null, type: "Arma" },
  { id: "grant", name: "Concessão (Grant)", image: null, type: "Arma" },
  { id: "sanctus", name: "Sanctus", image: null, type: "Arma" },
  { id: "blood_rock", name: "Rocha de Sangue", image: null, type: "Consumível" },
  { id: "twin_humanities", name: "Humanidade Gêmea", image: null, type: "Consumível" },
  { id: "divine_ember", name: "Brasa Divina", image: null, type: "Item Chave" },
  { id: "large_ember", name: "Brasa Grande", image: null, type: "Item Chave" },
  { id: "peculiar_doll", name: "Boneca Peculiar", image: null, type: "Item Chave" },
  { id: "basin_of_vows", name: "Bacia de Votos", image: null, type: "Item Chave" },
  { id: "dark_sign", name: "Marca Negra", image: null, type: "Item Chave" },
  { id: "dried_finger", name: "Dedo Ressecado", image: null, type: "Consumível" },
  { id: "rubbish", name: "Lixo", image: null, type: "Item" },
  { id: "pendant", name: "Pingente", image: null, type: "Item" }
];

const SCENERY = [
  { id: "anor_londo", name: "Anor Londo", image: "imgs/cenário (1).jpg", type: "Local" },
  { id: "firelink_shrine", name: "Santuário de Firelink", image: "imgs/cenario_firelink.jpg", type: "Local" },
  { id: "blighttown", name: "Cidade de Moléstia", image: "imgs/cenario_blighttown.jpg", type: "Local" },
  { id: "majula", name: "Majula", image: null, type: "Local" },
  { id: "central_yharnam", name: "Central Yharnam", image: null, type: "Local" },
  { id: "irithyll", name: "Irithyll of the Boreal Valley", image: null, type: "Local" },
  { id: "sens_fortress", name: "Sen's Fortress", image: null, type: "Local" },
  { id: "ash_lake", name: "Ash Lake", image: null, type: "Local" },
  { id: "kiln_first_flame", name: "Kiln of the First Flame", image: null, type: "Local" },
  { id: "drangleic_castle", name: "Castelo de Drangleic", image: null, type: "Local" },
  { id: "lothric_castle", name: "Castelo de Lothric", image: null, type: "Local" },
  { id: "fishing_hamlet", name: "Fishing Hamlet", image: null, type: "Local" },
  { id: "cainhurst", name: "Forsaken Cainhurst Castle", image: null, type: "Local" },
  { id: "hunter_dream", name: "Sonho do Caçador", image: null, type: "Local" },
  { id: "painted_world_ariamis", name: "Mundo Pintado de Ariamis", image: null, type: "Local" },
  { id: "painted_world_ariandel", name: "Mundo Pintado de Ariandel", image: null, type: "Local" },
  { id: "ringed_city", name: "The Ringed City", image: null, type: "Local" },
  { id: "archdragon_peak", name: "Archdragon Peak", image: null, type: "Local" },
  { id: "heides_tower", name: "Heide's Tower of Flame", image: null, type: "Local" },
  { id: "shrine_of_amana", name: "Shrine of Amana", image: null, type: "Local" },
  { id: "forest_fallen_giants", name: "Forest of Fallen Giants", image: null, type: "Local" },
  { id: "undead_burg", name: "Undead Burg", image: null, type: "Local" },
  { id: "darkroot_garden", name: "Darkroot Garden", image: null, type: "Local" },
  { id: "new_londo_ruins", name: "New Londo Ruins", image: null, type: "Local" },
  { id: "duke_archives", name: "The Duke's Archives", image: null, type: "Local" },
  { id: "lost_izalith", name: "Lost Izalith", image: null, type: "Local" },
  { id: "catacombs_of_carthus", name: "Catacumbas de Carthus", image: null, type: "Local" },
  { id: "profaned_capital", name: "Capital Profanada", image: null, type: "Local" },
  { id: "farron_keep", name: "Pântano de Farron", image: null, type: "Local" },
  { id: "old_yharnam", name: "Old Yharnam", image: null, type: "Local" },
  { id: "upper_cathedral_ward", name: "Upper Cathedral Ward", image: null, type: "Local" },
  { id: "byrgenwerth", name: "Byrgenwerth", image: null, type: "Local" },
  { id: "nightmare_frontier", name: "Nightmare Frontier", image: null, type: "Local" },
  { id: "nightmare_of_mensis", name: "Pesadelo de Mensis", image: null, type: "Local" },
  { id: "cathedral_of_the_deep", name: "Catedral das Profundezas", image: null, type: "Local" },
  { id: "grand_archives", name: "Grandes Arquivos", image: null, type: "Local" },
  { id: "dragon_aerie", name: "Dragon Aerie", image: null, type: "Local" },
  { id: "iron_keep", name: "Iron Keep", image: null, type: "Local" },
  { id: "frozen_eleum_loyce", name: "Frozen Eleum Loyce", image: null, type: "Local" },
  { id: "brume_tower", name: "Brume Tower", image: null, type: "Local" },
  { id: "shulva", name: "Shulva, Sanctum City", image: null, type: "Local" },
  { id: "catacombs", name: "As Catacumbas", image: null, type: "Local" },
  { id: "tomb_of_giants", name: "Tumba dos Gigantes", image: null, type: "Local" },
  { id: "valley_ofdrakes", name: "Valley of Drakes", image: null, type: "Local" },
  { id: "crystal_cave", name: "Caverna de Cristal", image: null, type: "Local" },
  { id: "untended_graves", name: "Untended Graves", image: null, type: "Local" },
  { id: "consumed_king_garden", name: "Jardim do Rei Consumido", image: null, type: "Local" },
  { id: "hemwick_charnel_lane", name: "Hemwick Charnel Lane", image: null, type: "Local" },
  { id: "yahargul", name: "Yahar'gul, Unseen Village", image: null, type: "Local" },
  { id: "forbidden_woods", name: "Forbidden Woods", image: null, type: "Local" }
];

const MUSIC = [
  { id: "gwyn_theme", name: "Gwyn, Lord of Cinder", audio: "audio/gymn_lordofCinder.mp3", type: "Trilha Sonora" },
  { id: "soul_of_cinder", name: "Soul of Cinder", audio: "audio/Yuka Kitamura - Soul of Cinder.mp3", type: "Trilha Sonora" },
  { id: "majula", name: "Majula Theme", audio: "audio/Majula - Motoi Sakuraba (youtube).mp3", type: "Trilha Sonora" },
  { id: "ornstein_smough", name: "Ornstein & Smough", audio: null, type: "Trilha Sonora" },
  { id: "artorias_theme", name: "Knight Artorias", audio: null, type: "Trilha Sonora" },
  { id: "sif_theme", name: "Great Grey Wolf Sif", audio: null, type: "Trilha Sonora" },
  { id: "cleric_beast_theme", name: "Cleric Beast", audio: null, type: "Trilha Sonora" },
  { id: "father_gascoigne_theme", name: "The Hunter (Gascoigne)", audio: null, type: "Trilha Sonora" },
  { id: "gehrman_theme", name: "Gehrman, The First Hunter", audio: null, type: "Trilha Sonora" },
  { id: "ludwig_theme", name: "Ludwig, the Holy Blade", audio: null, type: "Trilha Sonora" },
  { id: "lady_maria_theme", name: "Lady Maria of the Astral Clocktower", audio: null, type: "Trilha Sonora" },
  { id: "abyss_watchers_theme", name: "Abyss Watchers", audio: null, type: "Trilha Sonora" },
  { id: "pontiff_sulyvahn_theme", name: "Pontiff Sulyvahn", audio: null, type: "Trilha Sonora" },
  { id: "slave_knight_gael_theme", name: "Slave Knight Gael", audio: null, type: "Trilha Sonora" },
  { id: "darkeater_midir_theme", name: "Darkeater Midir", audio: null, type: "Trilha Sonora" },
  { id: "sir_alonne_theme", name: "Sir Alonne", audio: null, type: "Trilha Sonora" },
  { id: "fume_knight_theme", name: "Fume Knight", audio: null, type: "Trilha Sonora" },
  { id: "nameless_king_theme", name: "Nameless King", audio: null, type: "Trilha Sonora" },
  { id: "vicar_amelia_theme", name: "Vicar Amelia", audio: null, type: "Trilha Sonora" },
  { id: "ebrietas_theme", name: "Ebrietas, Daughter of the Cosmos", audio: null, type: "Trilha Sonora" },
  { id: "firelink_ds1", name: "Firelink Shrine (DS1)", audio: null, type: "Trilha Sonora" },
  { id: "firelink_ds3", name: "Firelink Shrine (DS3)", audio: null, type: "Trilha Sonora" },
  { id: "nameless_song", name: "Nameless Song", audio: null, type: "Trilha Sonora" },
  { id: "epilogue_ds3", name: "Epilogue (Dark Souls III)", audio: null, type: "Trilha Sonora" },
  { id: "main_theme_bb", name: "Bloodborne (Main Theme)", audio: null, type: "Trilha Sonora" },
  { id: "first_hunter", name: "The First Hunter", audio: null, type: "Trilha Sonora" },
  { id: " Laurence_theme", name: "Laurence, the First Vicar", audio: null, type: "Trilha Sonora" },
  { id: "orphan_kos_theme", name: "Orphan of Kos", audio: null, type: "Trilha Sonora" },
  { id: "living_failures_theme", name: "Living Failures", audio: null, type: "Trilha Sonora" },
  { id: "sister_friede_theme", name: "Sister Friede", audio: null, type: "Trilha Sonora" },
  { id: "dancer_theme", name: "Dancer of the Boreal Valley", audio: null, type: "Trilha Sonora" },
  { id: "vordt_theme", name: "Vordt of the Boreal Valley", audio: null, type: "Trilha Sonora" },
  { id: "iudex_gundyr_theme", name: "Iudex Gundyr", audio: null, type: "Trilha Sonora" },
  { id: "dragonslayer_armour_theme", name: "Dragonslayer Armour", audio: null, type: "Trilha Sonora" },
  { id: "lothric_princes_theme", name: "Lothric, Younger Prince", audio: null, type: "Trilha Sonora" },
  { id: "yhorm_theme", name: "Yhorm the Giant", audio: null, type: "Trilha Sonora" },
  { id: "aldrich_theme", name: "Aldrich, Devourer of Gods", audio: null, type: "Trilha Sonora" },
  { id: "ocieros_theme", name: "Oceiros, the Consumed King", audio: null, type: "Trilha Sonora" },
  { id: "ancient_wyvern_theme", name: "Ancient Wyvern", audio: null, type: "Trilha Sonora" },
  { id: "demon_prince_theme", name: "The Demon Prince", audio: null, type: "Trilha Sonora" },
  { id: "micolash_theme", name: "Micolash, Host of the Nightmare", audio: null, type: "Trilha Sonora" },
  { id: "rom_theme", name: "Rom, the Vacuous Spider", audio: null, type: "Trilha Sonora" },
  { id: "one_reborn_theme", name: "The One Reborn", audio: null, type: "Trilha Sonora" },
  { id: "mergo_wet_nurse_theme", name: "Mergo's Wet Nurse", audio: null, type: "Trilha Sonora" },
  { id: "moon_presence_theme", name: "Moon Presence", audio: null, type: "Trilha Sonora" },
  { id: "queen_of_vilebloods", name: "Queen of the Vilebloods", audio: null, type: "Trilha Sonora" },
  { id: "hail_the_nightmare", name: "Hail the Nightmare", audio: null, type: "Trilha Sonora" },
  { id: "lullaby_for_mergo", name: "Lullaby for Mergo", audio: null, type: "Trilha Sonora" },
  { id: "hunter_dream_theme", name: "The Hunter's Dream", audio: null, type: "Trilha Sonora" },
  { id: "omen", name: "Omen", audio: null, type: "Trilha Sonora" }
];

function getDailyTarget(category) {
  const today = new Date();
  const dateSeed = parseInt(
    `${today.getFullYear()}${String(today.getMonth()+1).padStart(2,'0')}${String(today.getDate()).padStart(2,'0')}`,
    10
  );
  
  // Fatores primos para garantir seeds únicas por categoria
  const factors = { characters: 1, items: 13, scenery: 17, music: 19 };
  const seed = dateSeed * (factors[category] || 1);
  
  let pool = [];
  if (category === 'characters') {
    pool = CHARACTERS;
  } else if (category === 'items') {
    // Apenas itens com imagem para o desafio visual
    pool = ITEMS.filter(i => i.image);
    if (pool.length === 0) pool = ITEMS; 
  } else if (category === 'scenery') {
    pool = SCENERY.filter(i => i.image);
    if (pool.length === 0) pool = SCENERY;
  } else if (category === 'music') {
    pool = MUSIC.filter(i => i.audio);
    if (pool.length === 0) pool = MUSIC;
  }
  
  return pool[seed % pool.length];
}
