import { LevelDefinition, WasteCategory, WasteItemTemplate } from '../types/game';

export const WASTE_CATEGORIES_INFO: Record<WasteCategory, {
  name: string;
  shortName: string;
  colorName: string;
  hex: string;
  borderHex: string;
  bgHex: string;
  badgeHex: string;
  iconSymbol: string;
  description: string;
  examples: string[];
}> = {
  KAGIT: {
    name: 'Kağıt & Karton',
    shortName: 'Kağıt',
    colorName: 'Mavi Kutu',
    hex: '#2563EB', // Blue 600
    borderHex: '#1D4ED8',
    bgHex: '#EFF6FF',
    badgeHex: '#3B82F6',
    iconSymbol: '📄',
    description: 'Gazete, defter, koli, dergi ve temiz karton ambalajlar.',
    examples: ['Eski Gazete', 'Karton Kutu', 'Ders Kitabı', 'Yumurta Kolisi', 'Kargo Paketi'],
  },
  PLASTIK: {
    name: 'Plastik',
    shortName: 'Plastik',
    colorName: 'Sarı Kutu',
    hex: '#EAB308', // Yellow 500
    borderHex: '#CA8A04',
    bgHex: '#FEFCE8',
    badgeHex: '#FACC15',
    iconSymbol: '🧴',
    description: 'PET şişeler, şampuan kutuları, temiz yoğurt kapları ve poşetler.',
    examples: ['PET Su Şişesi', 'Deterjan Şişesi', 'Plastik Bardak', 'Yoğurt Kabı', 'Şampuan Şişesi'],
  },
  CAM: {
    name: 'Cam',
    shortName: 'Cam',
    colorName: 'Yeşil Kutu',
    hex: '#16A34A', // Green 600
    borderHex: '#15803D',
    bgHex: '#F0FDF4',
    badgeHex: '#22C55E',
    iconSymbol: '🍾',
    description: 'Cam şişeler, reçel kavanozları, içecek şişeleri ve cam kaplar.',
    examples: ['Cam Su Şişesi', 'Reçel Kavanozu', 'Soda Şişesi', 'Zeytinyağı Şişesi', 'Parfüm Şişesi'],
  },
  ORGANIK: {
    name: 'Organik (Kompost)',
    shortName: 'Organik',
    colorName: 'Kahverengi Kutu',
    hex: '#854D0E', // Brown / Earth
    borderHex: '#713F12',
    bgHex: '#FEF3C7',
    badgeHex: '#A16207',
    iconSymbol: '🍎',
    description: 'Meyve-sebze artıkları, çay posası, yumurta kabuğu ve yemek artıkları.',
    examples: ['Elma Koçanı', 'Muz Kabuğu', 'Çürük Domates', 'Yumurta Kabuğu', 'Çay Posası'],
  },
  METAL: {
    name: 'Metal & Alüminyum',
    shortName: 'Metal',
    colorName: 'Gri Kutu',
    hex: '#64748B', // Slate / Gray
    borderHex: '#475569',
    bgHex: '#F8FAFC',
    badgeHex: '#94A3B8',
    iconSymbol: '🥫',
    description: 'Meşrubat tenekeleri, konserve kutuları, alüminyum folyo ve metal kapaklar.',
    examples: ['Teneke Kutu', 'Konserve Kutusu', 'Metal Kapaklar', 'Alüminyum Folyo'],
  },
  PIL: {
    name: 'Pil',
    shortName: 'Pil',
    colorName: 'Kırmızı Kutu',
    hex: '#DC2626', // Red 600
    borderHex: '#B91C1C',
    bgHex: '#FEF2F2',
    badgeHex: '#EF4444',
    iconSymbol: '🔋',
    description: 'Kalem piller, saat pilleri, 9V blok piller ve şarjlı bataryalar.',
    examples: ['Kalem Pil (AA)', '9V Blok Pil', 'Düğme Pil (Saat)', 'Lityum Batarya'],
  },
  ELEKTRONIK: {
    name: 'Elektronik (E-Atık)',
    shortName: 'E-Atık',
    colorName: 'Mor Kutu',
    hex: '#7C3AED', // Violet / Purple
    borderHex: '#6D28D9',
    bgHex: '#F5F3FF',
    badgeHex: '#8B5CF6',
    iconSymbol: '💻',
    description: 'Eski telefonlar, bozuk kulaklıklar, bilgisayar parçaları, USB ve şarj aletleri.',
    examples: ['Akıllı Telefon', 'Bozuk Kulaklık', 'Bilgisayar Faresi', 'Devre Kartı', 'USB Bellek'],
  },
};

export const WASTE_TEMPLATES: WasteItemTemplate[] = [
  // --- KAĞIT ---
  {
    name: 'Eski Gazete',
    category: 'KAGIT',
    description: 'Okunmuş günlük gazete',
    ecoTip: '1 ton kağıt geri dönüştürülünce 17 yetişkin ağaç kesilmekten kurtulur!',
    icon: 'newspaper',
    primaryColor: '#3B82F6',
  },
  {
    name: 'Karton Koli',
    category: 'KAGIT',
    description: 'Oluklu mukavva kargo kolisi',
    ecoTip: 'Karton ambalajlar katlanarak atılırsa kutuda 5 kat daha az yer kaplar.',
    icon: 'box',
    primaryColor: '#60A5FA',
  },
  {
    name: 'Kullanılmış Defter',
    category: 'KAGIT',
    description: 'Sayfaları dolu okul defteri',
    ecoTip: 'Geri dönüştürülen kağıt, yeni kağıda göre %70 daha az su tüketir.',
    icon: 'book',
    primaryColor: '#2563EB',
  },
  {
    name: 'Yumurta Kolisi',
    category: 'KAGIT',
    description: 'Kalıplanmış selüloz yumurta ambalajı',
    ecoTip: 'Kalıp kartonlar mükemmel bir şekilde yeni ambalaja dönüştürülür.',
    icon: 'package',
    primaryColor: '#93C5FD',
  },

  // --- PLASTİK ---
  {
    name: 'PET Su Şişesi',
    category: 'PLASTIK',
    description: 'Şeffaf plastik içecek şişesi',
    ecoTip: 'Plastik şişelerin doğada tamamen çözünmesi 450 ila 1000 yıl sürer!',
    icon: 'bottle',
    primaryColor: '#EAB308',
  },
  {
    name: 'Deterjan Şişesi',
    category: 'PLASTIK',
    description: 'Sert HDPE plastik ambalaj',
    ecoTip: 'Plastik geri dönüşümü ile her yıl milyonlarca varil petrol tasarruf edilir.',
    icon: 'flask',
    primaryColor: '#F59E0B',
  },
  {
    name: 'Yoğurt Kabı',
    category: 'PLASTIK',
    description: 'Polipropilen (PP) gıda kabı',
    ecoTip: 'Kutuları çalkalayıp atarak geri dönüşüm sürecini kolaylaştırın.',
    icon: 'cup',
    primaryColor: '#FBBF24',
  },
  {
    name: 'Şampuan Şişesi',
    category: 'PLASTIK',
    description: 'Banyo plastik ambalajı',
    ecoTip: 'Banyodaki plastik ambalajlar da en az mutfaktakiler kadar dönüştürülebilir.',
    icon: 'droplet',
    primaryColor: '#D97706',
  },

  // --- CAM ---
  {
    name: 'Cam İçecek Şişesi',
    category: 'CAM',
    description: 'Şeffaf cam meşrubat şişesi',
    ecoTip: 'Cam %100 oranında ve kalitesinden hiçbir şey kaybetmeden sonsuz kez dönüştürülebilir!',
    icon: 'wine',
    primaryColor: '#16A34A',
  },
  {
    name: 'Reçel Kavanozu',
    category: 'CAM',
    description: 'Kapaklı cam kavanoz',
    ecoTip: 'Tek bir cam şişenin geri dönüşümü, bir ampulü 4 saat yakacak enerjiyi kurtarır.',
    icon: 'jar',
    primaryColor: '#22C55E',
  },
  {
    name: 'Zeytinyağı Şişesi',
    category: 'CAM',
    description: 'Koyu renkli koruyucu cam şişe',
    ecoTip: 'Cam atıklar eritilirken hammaddeye göre %40 daha az enerji tüketir.',
    icon: 'glass-bottle',
    primaryColor: '#15803D',
  },
  {
    name: 'Soda Şişesi',
    category: 'CAM',
    description: 'Yeşil maden suyu şişesi',
    ecoTip: 'Geri dönüşen cam havaya salınan sera gazlarını doğrudan %20 azaltır.',
    icon: 'soda',
    primaryColor: '#4ADE80',
  },

  // --- ORGANİK ---
  {
    name: 'Elma Koçanı',
    category: 'ORGANIK',
    description: 'Yenilmiş meyve kalıntısı',
    ecoTip: 'Organik atıklar kompost yapılarak toprağa en zengin doğal gübreyi sağlar!',
    icon: 'apple',
    primaryColor: '#B45309',
  },
  {
    name: 'Muz Kabuğu',
    category: 'ORGANIK',
    description: 'Potasyum zengini meyve kabuğu',
    ecoTip: 'Muz kabukları bitkiler için eşsiz bir doğal mineral ve potasyum kaynağıdır.',
    icon: 'banana',
    primaryColor: '#D97706',
  },
  {
    name: 'Çürük Domates',
    category: 'ORGANIK',
    description: 'Bozulmuş sebze atığı',
    ecoTip: 'Evsel atıkların yaklaşık %50\'si organik biyolojik atıklardan oluşur.',
    icon: 'tomato',
    primaryColor: '#DC2626',
  },
  {
    name: 'Yumurta Kabukları',
    category: 'ORGANIK',
    description: 'Kalsiyum deposu doğal atık',
    ecoTip: 'Yumurta kabukları toprağın kalsiyum dengesini onarmak için komposta katılır.',
    icon: 'egg',
    primaryColor: '#92400E',
  },
  {
    name: 'Çay Posası',
    category: 'ORGANIK',
    description: 'Demlenmiş siyah çay atığı',
    ecoTip: 'Çay posası ev bitkilerinin nem tutmasını artıran harika bir organik maddedir.',
    icon: 'coffee',
    primaryColor: '#78350F',
  },

  // --- METAL ---
  {
    name: 'Teneke İçecek Kutusu',
    category: 'METAL',
    description: 'Alüminyum gazlı içecek kutusu',
    ecoTip: 'Bir alüminyum kutunun geri dönüşümü, sıfırdan üretimine göre %95 daha az enerji harcar!',
    icon: 'can',
    primaryColor: '#94A3B8',
  },
  {
    name: 'Konserve Kutusu',
    category: 'METAL',
    description: 'Çelik gıda konservesi',
    ecoTip: 'Metal ambalajlar geri dönüştürülünce 60 gün içinde market rafına yeni bir kutu olarak döner.',
    icon: 'tin',
    primaryColor: '#64748B',
  },
  {
    name: 'Metal Şişe Kapağı',
    category: 'METAL',
    description: 'Taç gazoz ve maden suyu kapağı',
    ecoTip: 'Küçük metal kapaklar manyetik ayırıcılarda toplanarak çelik sanayisine kazandırılır.',
    icon: 'metal-cap',
    primaryColor: '#CBD5E1',
  },

  // --- PİL ---
  {
    name: 'Kalem Pil (AA)',
    category: 'PIL',
    description: 'Tükenmiş alkalin AA pil',
    ecoTip: 'Tek bir kalem pil toprağa karıştığında 4 metrekare toprağı ve 800 bin litre suyu zehirler!',
    icon: 'battery-aa',
    primaryColor: '#DC2626',
  },
  {
    name: '9V Blok Pil',
    category: 'PIL',
    description: 'Duman dedektörü ve oyuncak pili',
    ecoTip: 'Atık piller TAP kutularında toplanarak içindeki çinko ve mangan metalleri geri kazanılır.',
    icon: 'battery-9v',
    primaryColor: '#EF4444',
  },
  {
    name: 'Düğme Saat Pili',
    category: 'PIL',
    description: 'Lityum düğme pil',
    ecoTip: 'Düğme piller yüksek oranda cıva veya lityum içerir; asla evsel çöpe karıştırılmamalıdır.',
    icon: 'battery-button',
    primaryColor: '#B91C1C',
  },

  // --- ELEKTRONİK (E-ATIK) ---
  {
    name: 'Eski Akıllı Telefon',
    category: 'ELEKTRONIK',
    description: 'Kullanım ömrü dolmuş cep telefonu',
    ecoTip: '1 ton akıllı telefondan, 1 ton altın cevherinden 100 kat daha fazla saf altın çıkarılabilir!',
    icon: 'smartphone',
    primaryColor: '#7C3AED',
  },
  {
    name: 'Bozuk Bilgisayar Faresi',
    category: 'ELEKTRONIK',
    description: 'Kablolu optik bilgisayar faresi',
    ecoTip: 'E-atıklar içindeki değerli bakır kablolar ve plastikler özel tesislerde parçalanarak ayrışır.',
    icon: 'mouse',
    primaryColor: '#8B5CF6',
  },
  {
    name: 'Devre Kartı (PCB)',
    category: 'ELEKTRONIK',
    description: 'Elektronik anakart parçası',
    ecoTip: 'Elektronik devrelerdeki altın, gümüş ve paladyum metalleri doğayı tahrip etmeden geri kazanılır.',
    icon: 'chip',
    primaryColor: '#6D28D9',
  },
  {
    name: 'USB Bellek',
    category: 'ELEKTRONIK',
    description: 'Eski flash depolama aygıtı',
    ecoTip: 'Dünya çapında her yıl 50 milyon tondan fazla elektronik atık üretilmektedir.',
    icon: 'usb',
    primaryColor: '#A78BFA',
  },
];

// --- 100 SEVİYELİ BÜYÜK MACERA HARİTASI (5 BÖLGE • HER 20 SEVİYEDE BİR YENİ MÜZİK) ---
function generate100Levels(): LevelDefinition[] {
  const levels: LevelDefinition[] = [];

  const zoneConfigs = [
    {
      zone: 1,
      minLevel: 1,
      maxLevel: 20,
      regionName: 'Ev & Yeşil Doğa',
      musicTheme: 'Yeşil Doğa & Kalimba Ritimleri',
      themes: ['garden', 'school', 'park'] as const,
      categoryPools: [
        ['KAGIT', 'PLASTIK'] as WasteCategory[],
        ['KAGIT', 'PLASTIK', 'CAM'] as WasteCategory[],
        ['KAGIT', 'PLASTIK', 'CAM', 'ORGANIK'] as WasteCategory[],
        ['KAGIT', 'PLASTIK', 'CAM', 'ORGANIK', 'METAL'] as WasteCategory[],
      ],
      titlePrefixes: ['Yeşil Bahçe', 'Okul Kantini', 'Halk Parkı', 'Kompost Çiftliği', 'Botanik Vadisi'],
      facts: [
        '1 ton kağıt geri dönüştürüldüğünde 17 ağaç ve 26.500 litre su kurtarılır!',
        'Cam ambalaj saflığını hiç kaybetmeden sonsuz kez geri dönüştürülebilir.',
        'Organik atıklar kompost yapılarak toprağa kimyasalsız doğal gübre sağlar.',
        'Plastik ambalajları çalkalayıp atarak geri dönüşüm verimliliğini %40 artırabilirsiniz.',
      ],
    },
    {
      zone: 2,
      minLevel: 21,
      maxLevel: 40,
      regionName: 'Mavi Sahil & Kumsal',
      musicTheme: 'Mavi Sahil & Karayip Esintisi',
      themes: ['beach', 'park'] as const,
      categoryPools: [
        ['PLASTIK', 'CAM', 'METAL'] as WasteCategory[],
        ['PLASTIK', 'CAM', 'METAL', 'ORGANIK'] as WasteCategory[],
        ['KAGIT', 'PLASTIK', 'CAM', 'METAL'] as WasteCategory[],
        ['PLASTIK', 'CAM', 'METAL', 'PIL'] as WasteCategory[],
      ],
      titlePrefixes: ['Mavi Sahil', 'Lagün Koyu', 'Mercan Plajı', 'Balıkçı İskelesi', 'Eko Kordon'],
      facts: [
        'Her yıl milyonlarca deniz canlısı denizlere atılan plastik atıklar yüzünden tehlikeye girer.',
        '1 alüminyum kutunun geri dönüşümü, sıfırdan üretim enerjisinin %95\'ini tasarruf eder!',
        'Cam şişeler kumsalda kırıldığında canlılara zarar verir; yeşil kumbaraya atılmalıdır.',
        'Deniz kenarında yapılan her temizlik kıyı ekosistemini yıllarca korur.',
      ],
    },
    {
      zone: 3,
      minLevel: 41,
      maxLevel: 60,
      regionName: 'Sanayi Hattı & Geri Dönüşüm Tesisi',
      musicTheme: 'Sanayi & Tesis Elektro Nabzı',
      themes: ['factory'] as const,
      categoryPools: [
        ['PIL', 'METAL', 'PLASTIK'] as WasteCategory[],
        ['KAGIT', 'METAL', 'PIL', 'PLASTIK'] as WasteCategory[],
        ['PIL', 'ELEKTRONIK', 'METAL', 'PLASTIK'] as WasteCategory[],
        ['KAGIT', 'PLASTIK', 'CAM', 'METAL', 'PIL'] as WasteCategory[],
      ],
      titlePrefixes: ['Sanayi Hattı', 'TAP Pil İstasyonu', 'Ağır Metal Tesisi', 'Döngüsel Tesis', 'Eko Rafineri'],
      facts: [
        '1 adet kalem pil toprağa karıştığında 800 bin litre temiz suyu ve 4 m² toprağı zehirler!',
        'Atık piller TAP kutularında toplanarak çinko ve mangan sanayiye geri kazandırılır.',
        'Metal kutuları ezerek kutulara atarsanız taşıma emisyonu %30 oranında azalır.',
        'Sanayi tesislerinde doğru ayrıştırma yılda binlerce megawatt enerji tasarrufu sağlar.',
      ],
    },
    {
      zone: 4,
      minLevel: 61,
      maxLevel: 80,
      regionName: 'Akıllı Metropol & Bilişim Vadisi',
      musicTheme: 'Siber Bilişim & Geleceğin Şehri',
      themes: ['tech', 'metropolis'] as const,
      categoryPools: [
        ['ELEKTRONIK', 'PIL', 'METAL', 'PLASTIK'] as WasteCategory[],
        ['ELEKTRONIK', 'PIL', 'METAL', 'CAM', 'PLASTIK'] as WasteCategory[],
        ['ELEKTRONIK', 'PIL', 'METAL', 'CAM', 'KAGIT'] as WasteCategory[],
        ['KAGIT', 'PLASTIK', 'CAM', 'METAL', 'PIL', 'ELEKTRONIK'] as WasteCategory[],
      ],
      titlePrefixes: ['Teknoloji Vadisi', 'Akıllı Metropol', 'Siber Donanım Merkezi', 'Geleceğin Kenti', 'Bilişim Şehri'],
      facts: [
        '1 ton akıllı telefondan, geleneksel altın madenlerinden 100 kat daha fazla saf altın çıkarılır!',
        'Elektronik devrelerdeki altın, gümüş ve paladyum doğayı tahrip etmeden ayrıştırılır.',
        'Akıllı şehirlerde sensörlü kutular sayesinde çöp toplama yakıt tüketimi yarı yarıya düşer.',
        'E-atıklar asla evsel çöpe atılmamalı; yetkili elektronik toplama merkezlerine teslim edilmelidir.',
      ],
    },
    {
      zone: 5,
      minLevel: 81,
      maxLevel: 100,
      regionName: 'Gezegen Zirvesi & Sıfır Atık Şampiyonası',
      musicTheme: 'Büyük Zirve & Zafer Marşı',
      themes: ['space', 'summit'] as const,
      categoryPools: [
        ['KAGIT', 'PLASTIK', 'CAM', 'ORGANIK', 'METAL', 'PIL', 'ELEKTRONIK'] as WasteCategory[],
      ],
      titlePrefixes: ['Yörünge İstasyonu', 'Eko Stratosfer', 'Gezegen Zirvesi', 'Sıfır Atık Arenası', 'Efsaneler Şampiyonası'],
      facts: [
        'Uzay istasyonlarında su ve atıkların %98\'i döngüsel sistemlerle tekrar tekrar dönüştürülür.',
        'Sıfır atık yaklaşımıyla bir kentin karbon ayak izi %70 oranında azaltılabilir.',
        'Dünyamızın sınırlı kaynaklarını korumak için döngüsel ekonomi tek sürdürülebilir yoldur.',
        'Tebrikler! 100 seviyeyi tamamlayan oyuncular dünyanın gerçek Sıfır Atık Kahramanlarıdır!',
      ],
    },
  ];

  for (let id = 1; id <= 100; id++) {
    const zoneCfg = zoneConfigs.find((z) => id >= z.minLevel && id <= z.maxLevel) || zoneConfigs[0];
    const zoneIndex = id - zoneCfg.minLevel; // 0..19

    // Progressive target items: from 8 at lvl 1 to 38-40 at lvl 100
    const targetItems = Math.min(38, 8 + Math.floor(id * 0.3));

    // Star score thresholds
    const baseScorePerItem = 100;
    const star1 = targetItems * baseScorePerItem * 0.8;
    const star2 = Math.round(targetItems * baseScorePerItem * 1.5);
    const star3 = Math.round(targetItems * baseScorePerItem * 2.3);

    // Progressive speed: 1.3 at lvl 1 up to 2.8 at lvl 100
    const baseSpeed = Number((1.3 + (id / 100) * 1.5).toFixed(2));

    // Spawn interval: 2500ms down to 1250ms
    const spawnInterval = Math.max(1250, Math.round(2500 - (id / 100) * 1250));

    // Categories
    const catPoolIdx = Math.min(
      zoneCfg.categoryPools.length - 1,
      Math.floor((zoneIndex / 20) * zoneCfg.categoryPools.length)
    );
    const allowedCategories = zoneCfg.categoryPools[catPoolIdx];

    // Titles
    const prefixIdx = zoneIndex % zoneCfg.titlePrefixes.length;
    const stageInGroup = Math.floor(zoneIndex / zoneCfg.titlePrefixes.length) + 1;
    const title =
      id === 100
        ? 'Büyük Sıfır Atık Zirve Finali'
        : id === 80
        ? 'Akıllı Metropol Ustası'
        : id === 60
        ? 'Sanayi Hattı Şampiyonu'
        : id === 40
        ? 'Mavi Sahil Koruyucusu'
        : id === 20
        ? 'Yeşil Bahçe Ustası'
        : `${zoneCfg.titlePrefixes[prefixIdx]} ${stageInGroup > 1 ? `Aşama ${stageInGroup}` : ''}`.trim();

    const subtitle =
      id === 100
        ? 'Gezegen Kurtarma Efsanesi'
        : id % 10 === 0
        ? 'Bölge Şampiyonluk Testi'
        : `${allowedCategories.length} Kategori • ${zoneCfg.regionName}`;

    const themeIdx = zoneIndex % zoneCfg.themes.length;
    const bgTheme = id === 100 ? 'summit' : zoneCfg.themes[themeIdx];
    const ecoFact = zoneCfg.facts[zoneIndex % zoneCfg.facts.length];

    levels.push({
      id,
      title,
      subtitle,
      region: `${zoneCfg.regionName} (Bölge ${zoneCfg.zone})`,
      description: `Seviye ${id}: ${zoneCfg.regionName} sahasındaki ${targetItems} atığı doğru kutulara ayrıştırarak 3 yıldız topla! Fon müziği: ${zoneCfg.musicTheme}.`,
      targetItems,
      starThresholds: [star1, star2, star3],
      allowedCategories,
      spawnInterval,
      baseSpeed,
      maxItemsOnScreen: Math.min(6, 3 + Math.floor(id / 25)),
      ecoFact,
      bgTheme,
    });
  }

  return levels;
}

export const LEVELS_CONFIG: LevelDefinition[] = generate100Levels();

// --- SONSUZ MOD AYARLARI (TÜM 7 ATIK TÜRÜ VE KUTUSU AKTİF) ---
export const ENDLESS_LEVEL_CONFIG: LevelDefinition = {
  id: 0,
  title: 'Sonsuz Eko Mod',
  subtitle: 'Tüm 7 Atık Türü Aktif',
  region: 'Sıfır Atık Dünyası',
  description: 'Tüm 7 geri dönüşüm kutusu devrede! Kağıt, Plastik, Cam, Organik, Metal, Pil ve E-Atık çeşitlerini hızlıca doğru kutulara ayrıştır!',
  targetItems: 999999, // Sonsuz arcade döngüsü
  starThresholds: [2000, 5000, 10000],
  allowedCategories: ['KAGIT', 'PLASTIK', 'CAM', 'ORGANIK', 'METAL', 'PIL', 'ELEKTRONIK'],
  spawnInterval: 1700,
  baseSpeed: 1.8,
  maxItemsOnScreen: 5,
  ecoFact: 'Sonsuz modda her 10 başarılı ayrıştırmada seviye atlar ve hız artar!',
  bgTheme: 'metropolis',
};

export const ZERO_WASTE_EDUCATIONAL_TIPS: string[] = [
  'Geri dönüştürülen 1 ton kağıt ile 17 yetişkin ağaç ve 26.500 litre su kurtarılır!',
  'Cam ambalaj saflığını hiç kaybetmeden sonsuz kez geri dönüştürülebilir.',
  'Plastik poşetin doğada kaybolması en az 450 yıl sürer; bez çanta ve file kullanın.',
  'Tek bir kalem pil doğaya atıldığında 800 bin litre temiz suyu kullanılmaz hale getirir.',
  'Alüminyum ve metal kutuların geri dönüşümü, madenden sıfır üretime göre %95 enerji tasarrufu sağlar.',
  'Organik atıkları kompost yaparak bahçenize kimyasalsız doğal gübre sağlayabilirsiniz.',
  '1 ton eski cep telefonundan, geleneksel altın madenlerinden çok daha verimli altın elde edilir.',
  'E-atıklar (eski bilgisayar, şarj aleti) asla evsel çöpe atılmamalı, belediye merkezlerine teslim edilmelidir.',
  'Metal konserve kutularını ezerek kutulara atarsanız taşıma sırasında tonlarca yakıt tasarrufu sağlanır.',
];
