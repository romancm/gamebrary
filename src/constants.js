export const POPULAR_PLATFORMS = [169, 167, 130, 48, 49, 41];
export const DEFAULT_LIST_VIEW = 'single';
export const MIN_PROFILE_LENGTH = 6;
export const THUMBNAIL_PREFIX = '_300x300';
export const MAX_PROFILE_LENGTH = 20;
export const STEAM_CATEGORY_ID = 13;
export const GOG_CATEGORY_ID = 17;
export const TWITTER_CATEGORY_ID = 5;

export const BOARD_TYPE_STANDARD = 'standard';
export const BOARD_TYPE_KANBAN = 'kanban';
export const BOARD_TYPE_TIER = 'tier';

export const BOARD_TYPES = [
  { text: 'Standard', value: BOARD_TYPE_STANDARD },
  { text: 'Kanban', value: BOARD_TYPE_KANBAN },
  { text: 'Tier', value: BOARD_TYPE_TIER },
];

export const PLATFORM_CATEGORIES = {
  1: 'console',
  2: 'arcade',
  3: 'platform',
  4: 'operating_system',
  5: 'portable_console',
  6: 'computer',
};

export const DEFAULT_BOARD_BASE = {
  name: '',
  ranked: false,
  isPublic: false,
}

export const DEFAULT_BOARD_TIER = {
  ...DEFAULT_BOARD_BASE,
  type: BOARD_TYPE_TIER,
  lists: [
    { name: 'S', games: [], backgroundColor: '#C0382B' },
    { name: 'A', games: [], backgroundColor: '#E84B3C'},
    { name: 'B', games: [], backgroundColor: '#F39C19' },
    { name: 'C', games: [], backgroundColor: '#F2C511' },
    { name: 'D', games: [], backgroundColor: '#27AF60' },
  ],
};

export const DEFAULT_BOARD_STANDARD = {
  ...DEFAULT_BOARD_BASE,
  type: BOARD_TYPE_STANDARD,
  lists: [
    {
      games: [],
    }
  ],
};

export const DEFAULT_BOARD_KANBAN = {
  ...DEFAULT_BOARD_BASE,
  type: BOARD_TYPE_KANBAN,
  lists: [{
    name: 'Click to edit',
    games: [],
    sortBy: null,
    showTags: false,
    showNotes: false,
    showCount: false,
    view: null,
  }],
};

export const AUTH_PROVIDERS = {
  'google.com': { name: 'Google', id: 'google' },
  'twitter.com': { name: 'Twitter', id: 'twitter' },
  password: { name: 'Gamebrary (Email)', id: 'gamebrary' },
};

export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyA6MsmnLtqT4b11r-j15wwreRypO3AodcA',
  authDomain: 'gamebrary.com',
  databaseURL: 'https://gamebrary-8c736.firebaseio.com',
  projectId: 'gamebrary-8c736',
  storageBucket: 'gamebrary-8c736.appspot.com',
  messagingSenderId: '324529217902',
};

export const LINKS_CATEGORIES = {
  1: { id: 'official', icon: 'fas fa-link' },
  2: { id: 'fandom', svg: true },
  3: { id: 'wikipedia', svg: true },
  4: { id: 'facebook', svg: true },
  5: { id: 'twitter', svg: true },
  6: { id: 'twitch', svg: true },
  8: { id: 'instagram', svg: true },
  9: { id: 'youtube', svg: true },
  10: { id: 'iphone', svg: true },
  11: { id: 'ipad', svg: true },
  12: { id: 'android', svg: true },
  13: { id: 'steam', svg: true },
  14: { id: 'reddit', svg: true },
  15: { id: 'itch', svg: true },
  16: { id: 'epicgames', svg: true },
  17: { id: 'gog', svg: true },
  18: { id: 'discord', svg: true },
};

export const NEWS_SOURCES = {
  eurogamer: { img: 'eurogamer.png', url: 'https://www.eurogamer.net/', name: 'Eurogamer' },
  vg247: { img: 'vg247.svg', url: 'https://www.vg247.com/', name: 'VG247' },
  rps: { img: 'rps.svg', url: 'https://www.rockpapershotgun.com/', name: 'Rock Paper Shotgun' },
  rockpapershotgun: { img: 'rps.svg', url: 'https://www.rockpapershotgun.com/', name: 'Rock Paper Shotgun' },
  pcgamer: { img: 'pcgamer.png', url: 'https://www.pcgamer.com/', name: 'PC Gamer' },
  pressakeycom: { img: 'pressakey.png', url: 'https://pressakey.com/', name: 'Pressakey.com' },
  pcgamesn: { img: 'pcgamesn.svg', url: 'https://www.pcgamesn.com/', name: 'PCGamesN' },
  steamcommunityannouncements: { img: 'steam.png', url: 'https://steamcommunity.com/', name: 'Steam' },
  shacknews: { img: 'shacknews.png', url: 'https://www.shacknews.com/', name: 'Shacknews' },
  steamdb: { img: 'steamdb.svg', url: 'https://steamdb.info/', name: 'Steam' },
  gamemagru: { img: 'gamemagru.png', url: 'https://gamemag.ru/', name: 'GameMAG' },
  steamrelease: { img: 'steam.png', url: 'https://store.steampowered.com/', name: 'Steam' },
  steamannounce: { img: 'steam.png', url: 'https://store.steampowered.com/', name: 'Steam' },
  gamingonlinux: { img: 'gamingonlinux.svg', url: 'https://www.gamingonlinux.com/', name: 'GamingOnLinux' },
};

export const GENRE_ICONS = {
  2: 'fa-solid fa-computer-mouse',
  4: 'fa-solid fa-hand-fist',
  5: 'fa-solid fa-person-rifle',
  7: 'fa-solid fa-music',
  8: 'fa-solid fa-person-running',
  9: 'fa-solid fa-puzzle-piece',
  10: 'fa-solid fa-flag-checkered',
  12: 'fa-solid fa-shield',
  13: 'fa-solid fa-cube',
  14: 'fa-solid fa-futbol',
  15: 'fa-solid fa-chess',
  16: 'fa-solid fa-arrows-turn-to-dots',
  24: 'fa-solid fa-user-ninja',
  26: 'fa-solid fa-person-circle-question',
  30: 'fa-solid fa-table-tennis-paddle-ball',
  31: 'fa-solid fa-mountain-sun',
  32: 'fa-solid fa-gamepad',
  33: 'fa-solid fa-asterisk',
  35: 'fa-solid fa-chess-board',
  34: 'fa-solid fa-comments',
  36: 'fa-solid fa-network-wired',
};

export const KEYBOARD_SHORTCUTS = {
  'MODAL_keyboard-shortcuts': ['shift', '?'],
  // MODAL_devTools: ['shift', 'd'],
  ROUTE_home: ['shift', 'h'],
  ROUTE_search: ['shift', 'k'],
  ROUTE_tags: ['shift', 't'],
  ROUTE_notes: ['shift', 'n'],
  ROUTE_wallpapers: ['shift', 'w'],
  ROUTE_settings: ['shift', 's'],
};

export const LIST_VIEWS = {
  single: 'Single',
  grid: 'Grid',
  compact: 'Compact',
  text: 'Text',
};

export const PLATFORM_LOGO_FORMAT = {
  164: 'png',
  51: 'png',
  47: 'png',
  36: 'png',
  45: 'png',
  124: 'png',
  123: 'png',
  132: 'png',
  160: 'png',
  163: 'png',
  161: 'png',
  165: 'png',
  380: 'png',
  150: 'png',
};

export const PLATFORM_NAME_OVERRIDES = {
  6: 'Windows',
  18: 'NES',
  19: 'SNES',
  21: 'GameCube',
  150: 'PC Engine CD',
  38: 'PSP',
  163: 'Steam VR',
  50: '3D0',
  99: 'FAMICOM',
  51: 'FAMICOM Disk System',
};

export const EXCLUDED_PLATFORMS = [
  100,
  101,
  102,
  103,
  104,
  105,
  106,
  107,
  108,
  109,
  110,
  111,
  112,
  113,
  115,
  116,
  118,
  121,
  122,
  125,
  126,
  127,
  129,
  131,
  133,
  134,
  135,
  138,
  139,
  140,
  141,
  142,
  142,
  143,
  144,
  145,
  146,
  147,
  148,
  149,
  151,
  152,
  153,
  154,
  155,
  156,
  157,
  158,
  203,
  236,
  237,
  238,
  239,
  240,
  274,
  308,
  339,
  372,
  372,
  373,
  374,
  375,
  376,
  44,
  52, // Arcade
  55,
  69,
  73,
  74,
  79, // Neogeo
  82,
  85,
  89,
  91,
  95,
  96,
  97,
  97,
  98,
];

export const SUPPORTED_LANGUAGES = [
  { name: 'Arabic', nativeName: 'عربي', value: 'ar' },
  { name: 'Chinese (Simplified)', nativeName: '中文简体', value: 'zh-CN' },
  { name: 'English', nativeName: 'English', value: 'en' },
  { name: 'French', nativeName: 'Français', value: 'fr' },
  { name: 'German', nativeName: 'Deutsch', value: 'de' },
  { name: 'Italian', nativeName: 'Italiano', value: 'it' },
  { name: 'Japanese', nativeName: '日本語', value: 'ja' },
  { name: 'Portuguese', nativeName: 'Português', value: 'pt' },
  { name: 'Russian', nativeName: 'Русский', value: 'ru' },
  { name: 'Spanish', nativeName: 'Español', value: 'es' },
];

// TODO: verify and udpate if needed
// https://api-docs.igdb.com/#age-rating-enums
export const AGE_RATING_SYSTEMS = {
  1: {
    id: 'ESRB',
    ratings: {
      6: 'RP',
      7: 'EC',
      8: 'E',
      9: 'E10',
      10: 'T',
      11: 'M',
      12: 'AO',
    },
  },
  2: {
    id: 'PEGI',
    ratings: {
      1: '3',
      2: '7',
      3: '12',
      4: '16',
      5: '18',
    },
  },
  3: {
    id: 'CERO',
    ratings: {
      13: 'CERO_A',
      14: 'CERO_B',
      15: 'CERO_C',
      16: 'CERO_D',
      17: 'CERO_Z',
    },
  },
  4: {
    id: 'USK',
    ratings: {
      18: 'USK_0',
      19: 'USK_6',
      20: 'USK_12',
      21: 'USK_18',
    },
  },
  5: {
    id: 'GRAC',
    ratings: {
      22: 'GRAC_ALL',
      23: 'GRAC_Twelve',
      24: 'GRAC_Fifteen',
      25: 'GRAC_Eighteen',
      26: 'GRAC_TESTING',
    },
  },
  6: {
    id: 'ClassInd',
    ratings: {
      27: 'ClassInd-L',
      28: 'ClassInd-10',
      29: 'ClassInd-12',
      30: 'ClassInd-14',
      31: 'ClassInd-16',
      32: 'ClassInd-18',
    },
  },
  7: {
    id: 'ACB',
    ratings: {
      33: 'ACB_G',
      34: 'ACB_PG',
      35: 'ACB_M',
      36: 'ACB_MA15',
      37: 'ACB_R18',
      38: 'ACB_RC',
    },
  },
};

export const WEBSITE_CATEGORIES = {
  WIKIPEDIA: 3,
  AMAZON: 20,
};

export const PLATFORM_OVERRIDES = {
  12: {
    slug: 'xbox-360',
  },
};
