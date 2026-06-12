/* ============================================================
   data.js — all of the Companion's content, separated from logic.
   Edit text here without touching the rendering code in app.js.
   ============================================================ */

/* ---------- chapters (The Tale tracker) ----------
   `refs` lists names worth having to hand while reading that chapter.
   Each is looked up at runtime against Who's Who, the Lexicon, and the
   Map, and rendered as a tap-to-jump chip — so spelling must match. */
const SECTIONS = [
  { title: 'Ainulindalë & Valaquenta', chapters: [
    { id: 'ainu', t: 'Ainulindalë', d: 'The Music of the Ainur: the world is sung into being, and Melkor weaves discord into the theme.',
      refs: ['Eru Ilúvatar', 'The Ainur', 'Melkor', 'Manwë', 'Ulmo'] },
    { id: 'vala', t: 'Valaquenta', d: 'A formal roll-call of the Valar and the Maiar. Reference more than story — note who Manwë, Ulmo, Aulë, and Melkor are.',
      refs: ['Manwë', 'Varda', 'Ulmo', 'Aulë', 'Yavanna', 'Mandos', 'Melian', 'Sauron'] },
  ]},
  { title: 'Quenta Silmarillion — The Years of the Trees', chapters: [
    { id: 'q1',  n: 1,  t: 'Of the Beginning of Days', d: 'The shaping of the world, the fall of the Two Lamps, and the making of the silver and gold Trees.',
      refs: ['Melkor', 'Yavanna', 'The Two Trees', 'Aman / The Blessed Realm'] },
    { id: 'q2',  n: 2,  t: 'Of Aulë and Yavanna', d: 'Aulë secretly makes the Dwarves; Yavanna wins protection for growing things — the seed of the Ents.',
      refs: ['Aulë', 'Yavanna', 'Manwë'] },
    { id: 'q3',  n: 3,  t: 'Of the Coming of the Elves', d: 'The Elves awaken under the stars; the Valar war on Melkor and chain him, and summon the Elves west.',
      refs: ['The Eldar', 'Melkor', 'Varda', 'Middle-earth'] },
    { id: 'q4',  n: 4,  t: 'Of Thingol and Melian', d: 'An Elf-king and a divine Maia fall in love in the woods — the only such union, and a fateful one.',
      refs: ['Thingol', 'Melian', 'Doriath'] },
    { id: 'q5',  n: 5,  t: 'Of Eldamar and the Princes of the Eldalië', d: 'The Elves settle in the Blessed Realm; the great kindreds and their princely houses are named.',
      refs: ['The Eldar', 'The Noldor', 'Thingol', 'Aman / The Blessed Realm'] },
    { id: 'q6',  n: 6,  t: 'Of Fëanor and the Unchaining of Melkor', d: 'The most gifted Elf ever born comes of age, just as Melkor is released and begins to feign goodwill.',
      refs: ['Fëanor', 'Fingolfin', 'Finarfin', 'Melkor'] },
    { id: 'q7',  n: 7,  t: 'Of the Silmarils and the Unrest of the Noldor', d: 'Fëanor makes the three Jewels. Melkor sows lies; pride and suspicion poison the Noldor.',
      refs: ['Fëanor', 'Silmarils', 'Melkor', 'Fingolfin'] },
    { id: 'q8',  n: 8,  t: 'Of the Darkening of Valinor', d: 'Melkor and the monstrous spider Ungoliant destroy the Two Trees. The light of the world goes out.',
      refs: ['Melkor', 'The Two Trees', 'Silmarils'] },
    { id: 'q9',  n: 9,  t: 'Of the Flight of the Noldor', d: 'The terrible Oath of Fëanor, the first Kinslaying, and the doomed exile back to Middle-earth.',
      refs: ['The Oath of Fëanor', 'The Kinslaying', 'Fëanor', 'Fingolfin', 'Finarfin', 'Morgoth'] },
    { id: 'q10', n: 10, t: 'Of the Sindar', d: 'The Elves who never left Middle-earth, and the hidden kingdom of Doriath guarded by Melian.',
      refs: ['Thingol', 'Melian', 'Doriath'] },
    { id: 'q11', n: 11, t: 'Of the Sun and Moon and the Hiding of Valinor', d: 'The last flower and fruit of the dead Trees are raised as the Sun and Moon.',
      refs: ['The Two Trees', 'Varda', 'Morgoth'] },
  ]},
  { title: 'Quenta Silmarillion — The Wars of Beleriand', chapters: [
    { id: 'q12', n: 12, t: 'Of Men', d: 'The second Children awaken: mortal, short-lived, and bound to a different fate than the Elves.',
      refs: ['Eru Ilúvatar', 'Morgoth', 'Middle-earth'] },
    { id: 'q13', n: 13, t: 'Of the Return of the Noldor', d: 'The exiles reach Middle-earth and the long war on Morgoth begins, with early victories.',
      refs: ['Fëanor', 'Maedhros', 'Fingolfin', 'Angband'] },
    { id: 'q14', n: 14, t: 'Of Beleriand and its Realms', d: 'A geographic tour of the lands and kingdoms where the First Age plays out. A map chapter — go slow.',
      refs: ['Beleriand', 'Hithlum', 'Doriath', 'The Falas', 'Ossiriand'] },
    { id: 'q15', n: 15, t: 'Of the Noldor in Beleriand', d: 'The secret cities of Nargothrond and Gondolin are founded; Galadriel appears.',
      refs: ['Finrod', 'Turgon', 'Nargothrond', 'Gondolin', 'Galadriel'] },
    { id: 'q16', n: 16, t: 'Of Maeglin', d: 'A dark family tragedy whose consequences will one day doom the hidden city of Gondolin.',
      refs: ['Eöl', 'Turgon', 'Gondolin'] },
    { id: 'q17', n: 17, t: 'Of the Coming of Men into the West', d: 'The three Houses of Men cross into Beleriand and ally themselves with the Elf-lords.',
      refs: ['Finrod', 'Thingol', 'Beleriand'] },
    { id: 'q18', n: 18, t: 'Of the Ruin of Beleriand and the Fall of Fingolfin', d: 'Morgoth breaks the long siege; the High King rides alone to challenge him in single combat.',
      refs: ['Fingolfin', 'Morgoth', 'Angband', 'Dorthonion'] },
    { id: 'q19', n: 19, t: 'Of Beren and Lúthien', d: 'The great love story: a mortal man and an Elf-maiden dare to take a Silmaril from Morgoth’s crown. The heart of the book.',
      refs: ['Beren', 'Lúthien', 'Thingol', 'Melian', 'Finrod', 'Silmarils'] },
    { id: 'q20', n: 20, t: 'Of the Fifth Battle: Nirnaeth Arnoediad', d: '"Unnumbered Tears." The grand alliance against Morgoth is shattered by betrayal.',
      refs: ['Maedhros', 'Húrin', 'Turgon', 'Morgoth'] },
    { id: 'q21', n: 21, t: 'Of Túrin Turambar', d: 'The long, devastating tragedy of a mighty hero under Morgoth’s curse. The book’s darkest tale.',
      refs: ['Túrin', 'Húrin', 'Morgoth', 'Nargothrond', 'Doriath'] },
    { id: 'q22', n: 22, t: 'Of the Ruin of Doriath', d: 'A Silmaril brings ruin: strife with Dwarves, and the fall of Thingol’s ancient kingdom.',
      refs: ['Thingol', 'Melian', 'Silmarils', 'Doriath'] },
    { id: 'q23', n: 23, t: 'Of Tuor and the Fall of Gondolin', d: 'The last hidden city is betrayed and destroyed; from its ruin one family escapes.',
      refs: ['Tuor', 'Turgon', 'Gondolin', 'The Mouths of Sirion'] },
    { id: 'q24', n: 24, t: 'Of the Voyage of Eärendil', d: 'A half-elven mariner bears a Silmaril over Sea to plead for aid, and the Valar overthrow Morgoth at last.',
      refs: ['Eärendil', 'Elwing', 'Elrond & Elros', 'Silmarils', 'Morgoth'] },
  ]},
  { title: 'The Later Ages', chapters: [
    { id: 'akal',  t: 'Akallabêth', d: 'The Downfall of Númenor: the gift of an island kingdom to Men, their growing pride, and its drowning.',
      refs: ['Númenor', 'Sauron', 'Elrond & Elros'] },
    { id: 'rings', t: 'Of the Rings of Power and the Third Age', d: 'The forging of the Rings, Sauron’s rise, and the events that lead directly into The Lord of the Rings.',
      refs: ['Sauron', 'Middle-earth'] },
  ]},
];

/* ---------- who's who ---------- */
const WHO = [
  { label: 'The Valar — the Powers', note: 'The fourteen great spirits who govern the world. Think demigods, not a pantheon of equals.', people: [
    { n: 'Manwë', a: 'the Elder King', r: 'Lord of air and wind, king of the Valar — and Melkor’s brother and chief opponent.' },
    { n: 'Varda', a: 'Elbereth', r: 'Queen of the stars, kindler of the lights of heaven. The Elves love and call on her above all.' },
    { n: 'Ulmo', r: 'Lord of all waters. Aloof from the others, he works secretly through river and sea to aid Elves and Men.' },
    { n: 'Aulë', r: 'The great smith and master of crafts. Maker of the Dwarves; teacher of the Noldor.' },
    { n: 'Yavanna', r: 'Giver of fruits and grower of all things. She made the Two Trees.' },
    { n: 'Mandos', a: 'Námo', r: 'Keeper of the Houses of the Dead and speaker of doom and prophecy.' },
    { n: 'Melkor', a: 'later Morgoth', r: 'Once the mightiest of the Valar, fallen into envy and hatred. The source of evil — "the Great Enemy."' },
  ]},
  { label: 'The Maiar — lesser spirits', note: 'Servants of the Valar. Some are central; others become the villains of later ages.', people: [
    { n: 'Melian', r: 'A Maia who weds Thingol and shields Doriath with her power. Mother of Lúthien.' },
    { n: 'Sauron', r: 'Morgoth’s chief lieutenant — the enemy who endures long after his master falls.' },
    { n: 'Balrogs', r: 'Maiar corrupted into demons of fire and shadow. One of them you’ll meet again in Moria.' },
  ]},
  { label: 'The Noldor — the central exiles', note: 'The Elf-kindred at the heart of the tragedy: brilliant, proud, and cursed. Watch the similar names.', people: [
    { n: 'Fëanor', r: 'The greatest craftsman who ever lived; maker of the Silmarils. His genius and pride set the whole tragedy in motion.' },
    { n: 'Fingolfin', r: 'Fëanor’s half-brother and rival; High King of the Noldor in exile. Dies challenging Morgoth alone.' },
    { n: 'Finarfin', r: 'The wisest and gentlest brother — the one who turns back rather than follow the Oath into exile.' },
    { n: 'Maedhros', r: 'Fëanor’s eldest son; bound by the Oath yet often the most honourable and tormented of the seven.' },
    { n: 'Finrod', a: 'Felagund', r: 'Founder of Nargothrond and the great friend of Men. Gives his life for Beren.' },
    { n: 'Turgon', r: 'Builder and king of the hidden city of Gondolin.' },
    { n: 'Galadriel', r: 'Daughter of Finarfin, among the leaders of the exile — the same lady you know from Lothlórien.' },
  ]},
  { label: 'The Sindar & Doriath', note: 'The Elves who stayed in Middle-earth, and the woodland realm at the story’s centre.', people: [
    { n: 'Thingol', a: 'Elwë', r: 'King of Doriath, the greatest of the Elves who never saw the Blessed Realm. The only Elf to wed a Maia.' },
    { n: 'Lúthien', r: 'Daughter of Thingol and Melian; the fairest of all the Children of Ilúvatar, and heroine of the great love story.' },
    { n: 'Eöl', a: 'the Dark Elf', r: 'A reclusive, sinister smith of the deep woods; father of Maeglin.' },
  ]},
  { label: 'The Edain — the Houses of Men', note: 'The mortal heroes who fight beside the Elves against Morgoth.', people: [
    { n: 'Beren', r: 'A mortal man who loves Lúthien and dares the impossible — to cut a Silmaril from Morgoth’s iron crown.' },
    { n: 'Húrin', r: 'A valiant lord, captured and cursed by Morgoth to watch his children destroyed from afar.' },
    { n: 'Túrin', a: 'Turambar', r: 'Húrin’s son: mighty, proud, and doomed. His curse-driven tragedy is the book’s darkest thread.' },
    { n: 'Tuor', r: 'Húrin’s nephew, guided to Gondolin, where he weds the king’s daughter Idril.' },
  ]},
  { label: 'The Half-elven — the great lineage', note: 'The bloodline that joins Elves and Men, and runs forward into The Lord of the Rings.', people: [
    { n: 'Eärendil', r: 'Son of Tuor; the mariner who carries a Silmaril across the Sea to beg the Valar for aid — and becomes a star.' },
    { n: 'Elwing', r: 'Granddaughter of Beren and Lúthien, Eärendil’s wife, and keeper of their Silmaril.' },
    { n: 'Elrond & Elros', r: 'Their twin sons. One chooses immortality (Elrond of Rivendell); the other becomes the first king of Númenor.' },
  ]},
];

/* ---------- lexicon ---------- */
const LEX = [
  ['Silmarils', 'The three jewels Fëanor made, holding the living light of the Two Trees. The entire history turns on who possesses them.'],
  ['The Two Trees', 'Telperion (silver) and Laurelin (gold) — they lit the Blessed Realm before the Sun and Moon existed.'],
  ['Eru Ilúvatar', '"The One." The single supreme creator above all the Powers — God, in effect.'],
  ['The Ainur', 'The "Holy Ones," spirits Eru made before the world. Those who entered it became the Valar and Maiar.'],
  ['Valar / Maiar', 'The great Powers who govern the world (Valar) and the lesser spirits who serve them (Maiar).'],
  ['Aman / The Blessed Realm', 'The undying land in the uttermost West, where the Valar dwell. Valinor is their realm within it.'],
  ['Middle-earth', 'The mortal lands east across the Sea, where most of the action takes place.'],
  ['Beleriand', 'The great northwestern region of Middle-earth where the First Age unfolds — later broken and drowned.'],
  ['The Eldar', 'The Elves who answered the summons to journey west (the Vanyar, Noldor, and Teleri).'],
  ['The Noldor', 'The kindred of Elves most central to the story — mighty in skill, learning, and pride.'],
  ['The Oath of Fëanor', 'The reckless vow Fëanor and his seven sons swear to reclaim the Silmarils from anyone, at any cost. The engine of nearly every later disaster.'],
  ['The Kinslaying', 'The first time Elves spill Elf-blood — when the Noldor seize ships by force. A defining stain.'],
  ['Morgoth', '"The Black Foe," the name Fëanor gives the fallen Vala Melkor after he steals the Silmarils.'],
  ['Angband & Thangorodrim', 'Morgoth’s vast iron fortress in the North, and the three volcanic peaks he raised above it.'],
  ['Númenor', 'The island kingdom granted to Men as a reward — whose pride leads to its drowning in the Akallabêth.'],
];

/* ---------- pronunciation ---------- */
const RULES = [
  ['C', 'Always hard, like K. "Celeborn" = KEL-eborn; never soft like "cell."'],
  ['CH', 'The rasping sound in Scottish "loch" or German "Bach" — never as in "church."'],
  ['G', 'Always hard, as in "give" — never soft like "gem."'],
  ['AI', 'Like the "i" in "fine." So it rhymes with "eye," not "pay."'],
  ['AU', 'Like "ow" in "town." "Aulë" begins roughly OW-.'],
  ['EI', 'Like "ay" in "grey."'],
  ['IE', 'Sound both vowels distinctly; don’t collapse it to "ee."'],
  ['final E', 'Always pronounced, never silent. "Manwë" = MAN-weh; "Finwë" = FIN-weh.'],
  ['á é í', 'Accents just mean the vowel is held longer — not stressed differently.'],
];
const BANK = [
  ['Fëanor', 'FEH-ah-nor'], ['Lúthien', 'LOO-thee-en'], ['Eärendil', 'eh-AR-en-dil'],
  ['Fingolfin', 'fin-GOL-fin'], ['Thingol', 'THING-gol'], ['Maedhros', 'MIE-thros'],
  ['Galadriel', 'ga-LAD-ree-el'], ['Túrin', 'TOO-rin'], ['Melkor', 'MEL-kor'],
  ['Telperion', 'tel-PEH-ree-on'], ['Doriath', 'DOR-ee-ath'], ['Gondolin', 'GON-do-lin'],
];

/* ---------- timeline ----------
   `ch` ties an event to the chapter that tells it. The spoiler shield
   veils events whose chapter you haven't yet marked as read. */
const TIMELINE = [
  { era: 'Years of the Trees', sub: 'Before the Sun. The published book gives no dates here — it is the deep mythic past, and one Year of the Trees is nearly ten of ours.', events: [
    { ch: 'q1',  w: 'The Shaping', x: 'The Valar enter the world and order it. Two great Lamps are raised — and cast down by <b>Melkor</b>.' },
    { ch: 'q1',  w: 'The Two Trees', x: 'Yavanna grows <b>Telperion</b> and <b>Laurelin</b>, whose silver and gold light fill Valinor.' },
    { ch: 'q3',  w: 'The Awakening', x: 'The <b>Elves</b> awaken under the stars at Cuiviénen, far off in Middle-earth.' },
    { ch: 'q3',  w: 'The Chaining of Melkor', x: 'The Valar make war on Melkor and bind him for three ages; the Elves are summoned west.' },
    { ch: 'q7',  w: 'The Bliss of Valinor', x: '<b>Fëanor</b> is born and comes to full power; he forges the <b>three Silmarils</b>.' },
    { ch: 'q7',  w: 'The Unchaining', x: 'Melkor is released, feigns repentance, and quietly poisons the Noldor with lies.' },
    { ch: 'q8',  w: 'The Darkening', x: 'Melkor and Ungoliant slay the Trees and steal the Silmarils. Valinor goes dark; he becomes <b>Morgoth</b>.' },
    { ch: 'q9',  w: 'The Flight of the Noldor', x: 'The <b>Oath of Fëanor</b>, the first <b>Kinslaying</b>, and the cursed exile to Middle-earth.' },
  ]},
  { era: 'Years of the Sun &mdash; The First Age', sub: 'Dated in Years of the Sun (FA), by the convention of Tolkien’s later chronicles. Sources vary by a year or two; "c." marks an approximate date.', events: [
    { ch: 'q11', y: 'FA 1', w: 'The Sun first rises', x: 'The last fruit and flower of the dead Trees are set in the sky. Men awaken; the count of years begins.' },
    { ch: 'q13', y: 'FA 1', w: 'Return of the Noldor', x: 'The exiles reach Beleriand and open the long war on Morgoth.' },
    { ch: 'q13', y: 'FA 60', w: 'The Glorious Battle', x: '<i>Dagor Aglareb.</i> The Noldor rout Morgoth and set a <b>Siege of Angband</b> that holds for centuries.' },
    { ch: 'q17', y: 'FA 310', w: 'The Coming of Men', x: 'Finrod meets Bëor; the Houses of Men cross into Beleriand and ally with the Elves.' },
    { ch: 'q18', y: 'FA 455', w: 'The Battle of Sudden Flame', x: '<i>Dagor Bragollach.</i> Morgoth breaks the siege in rivers of fire.' },
    { ch: 'q18', y: 'FA 456', w: 'The fall of Fingolfin', x: 'The High King rides alone to Angband and dies in single combat with Morgoth.' },
    { ch: 'q19', y: 'c. FA 465', w: 'Beren and Lúthien', x: 'A mortal man and an Elf-maid take a <b>Silmaril</b> from Morgoth’s crown — the one triumph against him.' },
    { ch: 'q20', y: 'FA 472', w: 'The Unnumbered Tears', x: '<i>Nirnaeth Arnoediad.</i> The great alliance is shattered by treachery; Húrin is captured.' },
    { ch: 'q21', y: 'FA 464–499', w: 'The Curse of Túrin', x: 'Húrin’s cursed son rises and falls in tragedy; <b>Nargothrond</b> is sacked (c. FA 495).' },
    { ch: 'q22', y: 'c. FA 506', w: 'The Ruin of Doriath', x: 'Strife over a Silmaril brings down Thingol’s ancient forest kingdom.' },
    { ch: 'q23', y: 'FA 510', w: 'The Fall of Gondolin', x: 'The last hidden city is betrayed and burned; survivors flee to the coast.' },
    { ch: 'q24', y: 'FA 542', w: 'The Voyage of Eärendil', x: '<b>Eärendil</b> bears a Silmaril over Sea and reaches the Blessed Realm to plead for aid.' },
    { ch: 'q24', y: 'FA 545–587', w: 'The War of Wrath', x: 'The Valar come at last. Morgoth is overthrown and cast out — but most of Beleriand drowns.' },
    { ch: 'q24', y: 'FA 590', w: 'The Age ends', x: 'Morgoth is thrust into the Void beyond the world. The First Age is over.' },
  ]},
];

/* ---------- family trees ---------- */
const TREE_FINWE = { name: 'Finwë', tag: 'First High King of the Noldor', kids: [
  { name: 'Fëanor', key: true, spouse: 'Nerdanel', tag: 'Eldest son; maker of the Silmarils', kids: [
    { name: 'The Seven Sons', tag: 'Maedhros, Maglor, Celegorm, Caranthir, Curufin, Amrod & Amras — all bound by the Oath' },
  ]},
  { name: 'Fingolfin', key: true, tag: 'Second son; later High King in exile', kids: [
    { name: 'Fingon', tag: 'High King after his father' },
    { name: 'Turgon', spouse: 'Elenwë', tag: 'Founder and king of Gondolin', kids: [
      { name: 'Idril', key: true, spouse: 'Tuor (a Man)', tag: 'Her line runs on into the Half-elven →' },
    ]},
    { name: 'Aredhel', spouse: 'Eöl', tag: '', kids: [{ name: 'Maeglin', tag: 'Betrayer of Gondolin' }] },
  ]},
  { name: 'Finarfin', key: true, tag: 'Third son; the one who turned back', kids: [
    { name: 'Finrod Felagund', tag: 'Founder of Nargothrond; friend of Men' },
    { name: 'Galadriel', key: true, tag: 'Last of the great Noldor — yes, that Galadriel' },
    { name: 'Angrod & Aegnor', tag: 'Slain in the Battle of Sudden Flame' },
  ]},
]};

const TREE_LUTHIEN = { name: 'Thingol', spouse: 'Melian (a Maia)', tag: 'King of Doriath & a divine spirit', kids: [
  { name: 'Lúthien', key: true, spouse: 'Beren (a Man)', tag: 'The fairest of all; won a Silmaril', kids: [
    { name: 'Dior', spouse: 'Nimloth', tag: 'Heir of Doriath', kids: [
      { name: 'Elwing', key: true, spouse: 'Eärendil', tag: 'Bore the Silmaril over Sea →' },
    ]},
  ]},
]};

const TREE_GONDOLIN = { name: 'Tuor (a Man)', spouse: 'Idril', tag: 'Refugees of fallen Gondolin', kids: [
  { name: 'Eärendil', key: true, tag: 'The mariner who reached the Blessed Realm →' },
]};

/* ---------- map of Beleriand ---------- */
const PLACES = {
  angband: 'Angband, beneath the three peaks of Thangorodrim — Morgoth’s vast iron fortress in the far north, the source of all the war.',
  hithlum: 'Hithlum — the cold northern highland held by Fingolfin’s people, walled off by the Shadowy Mountains.',
  dorthonion: 'Dorthonion — the great pine highland where Beren’s people held out; later overrun and named the Mountains of Terror to its south.',
  gondolin: 'Gondolin — Turgon’s hidden city, ringed by the Encircling Mountains. The last and most secret kingdom to fall.',
  doriath: 'Doriath — Thingol and Melian’s forest realm at the heart of Beleriand, protected by the unseen Girdle of Melian.',
  nargothrond: 'Nargothrond — Finrod’s great cavern-fortress on the river Narog, hidden underground.',
  falas: 'The Falas — the western coast and its havens, Brithombar and Eglarest, the chief Elvish ports.',
  ossiriand: 'Ossiriand, the Land of Seven Rivers — wooded country in the east where the Green-elves dwelt, under the Blue Mountains.',
  himring: 'Himring & the March of Maedhros — the bleak northeastern hill where the sons of Fëanor guarded against Morgoth.',
  sirion: 'The Mouths of Sirion — where the great river meets the Sea; the last refuge of the survivors at the Age’s end.',
};
