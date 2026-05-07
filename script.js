// If you want Albanian labels on the map, get a free MapTiler Cloud API key
// at https://www.maptiler.com/ and replace YOUR_MAPTILER_KEY below.
const MAPTILER_KEY = "yZn3JKo7lNscLEszvALo";
// Using Streets-v4 style with proper English/local language support
const mapStyleUrl = `https://api.maptiler.com/maps/streets-v4/style.json?key=${MAPTILER_KEY}`;

// English Wikipedia article slugs for each event id. Used to fetch a
// thumbnail photo via the public summary API (no key, CORS-enabled).
const wikiSlugs = {
  "albania-italian-1939": "Italian_invasion_of_Albania",
  "albania-peze-1942": "Conference_of_Pezë",
  "albania-german-1943": "German_occupation_of_Albania",
  "albania-liberation-1944": "Liberation_of_Tirana",
  "poland-1939": "Invasion_of_Poland",
  "soviet-poland-1939": "Soviet_invasion_of_Poland",
  "winter-war-1939": "Winter_War",
  "norway-1940": "Norwegian_campaign",
  "france-1940": "Battle_of_France",
  "britain-1940": "Battle_of_Britain",
  "balkan-1941": "Invasion_of_Yugoslavia",
  "barbarossa-1941": "Operation_Barbarossa",
  "pearl-harbor-1941": "Attack_on_Pearl_Harbor",
  "midway-1942": "Battle_of_Midway",
  "el-alamein-1942": "Second_Battle_of_El_Alamein",
  "stalingrad-1942": "Battle_of_Stalingrad",
  "torch-1942": "Operation_Torch",
  "warsaw-ghetto-1943": "Warsaw_Ghetto_Uprising",
  "sicily-1943": "Allied_invasion_of_Sicily",
  "italy-surrenders-1943": "Armistice_of_Cassibile",
  "leningrad-1944": "Siege_of_Leningrad",
  "dday-1944": "Normandy_landings",
  "paris-1944": "Liberation_of_Paris",
  "leyte-1944": "Battle_of_Leyte_Gulf",
  "bulge-1944": "Battle_of_the_Bulge",
  "iwo-jima-1945": "Battle_of_Iwo_Jima",
  "berlin-1945": "Battle_of_Berlin",
  "ve-day-1945": "Victory_in_Europe_Day",
  "hiroshima-1945": "Atomic_bombings_of_Hiroshima_and_Nagasaki",
  "nagasaki-1945": "Atomic_bombings_of_Hiroshima_and_Nagasaki",
  "japan-surrenders-1945": "Surrender_of_Japan"
};

// A short, weighty fact or casualty estimate per event. Shown as a
// highlighted pill in the selected card and presenter panel. Only events
// where the scale is the story get one — the rest stay clean.
const scaleFigures = {
  "albania-italian-1939": "Mbreti Zog ikën brenda 5 ditësh",
  "poland-1939": "≈200,000 viktima brenda 5 javësh",
  "winter-war-1939": "≈70,000 viktima sovjetike",
  "france-1940": "Francë e dorëzuar për 6 javë",
  "britain-1940": "≈1,500 pilotë britanikë të vrarë",
  "barbarossa-1941": "Front mbi 2,900 km i gjatë",
  "pearl-harbor-1941": "2,403 amerikanë të vrarë",
  "midway-1942": "4 portaaeroplanë japonezë të zhytur",
  "stalingrad-1942": "≈2 milionë viktima totale",
  "warsaw-ghetto-1943": "≈13,000 të vrarë në kryengritje",
  "leningrad-1944": "Rrethimi 872 ditë, ≈800,000 të vdekur",
  "dday-1944": "≈156,000 ushtarë aleatë në ditën e parë",
  "albania-liberation-1944": "Çlirim pa ndihmë të huaj ushtarake",
  "bulge-1944": "≈100,000 viktima nga të dyja palët",
  "iwo-jima-1945": "≈26,000 viktima amerikane",
  "berlin-1945": "≈80,000 ushtarë sovjetikë të vrarë",
  "hiroshima-1945": "≈140,000 të vdekur deri në fund të 1945",
  "nagasaki-1945": "≈74,000 të vdekur deri në fund të 1945"
};

const WIKI_SUMMARY_API = "https://en.wikipedia.org/api/rest_v1/page/summary/";
const wikiThumbCache = new Map();

function getWikiThumb(slug) {
  if (!slug) return Promise.resolve(null);
  if (wikiThumbCache.has(slug)) return wikiThumbCache.get(slug);
  const p = fetch(WIKI_SUMMARY_API + encodeURIComponent(slug))
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => data?.thumbnail?.source || data?.originalimage?.source || null)
    .catch(() => null);
  wikiThumbCache.set(slug, p);
  return p;
}

function hydrateEventPhoto(eventId) {
  const event = events.find((e) => e.id === eventId);
  const wraps = document.querySelectorAll(`[data-photo-for="${eventId}"]`);
  if (!wraps.length) return;

  const slug = wikiSlugs[eventId];
  if (!slug) {
    wraps.forEach((w) => w.remove());
    return;
  }

  getWikiThumb(slug).then((url) => {
    // Re-query in case the DOM changed while awaiting the network.
    document.querySelectorAll(`[data-photo-for="${eventId}"]`).forEach((w) => {
      if (!url) {
        w.remove();
        return;
      }
      if (w.dataset.loaded === "true") return;
      w.innerHTML = `<img src="${url}" alt="${event?.title ?? ""}" loading="lazy" />`;
      w.dataset.loaded = "true";
      w.classList.add("loaded");
    });
  });
}

let map;

function localizeStyleField(field) {
  if (!Array.isArray(field)) {
    return field;
  }

  if (field[0] === "concat") {
    return ["concat", 
      ["coalesce", ["get", "name:en"], ["get", "name:latin"], ["get", "name"]], 
      " / ", 
      ["get", "name:latin"]
    ];
  }

  if (field[0] === "get" && field[1] === "name:latin") {
    return ["concat", 
      ["coalesce", ["get", "name:en"], ["get", "name:latin"], ["get", "name"]], 
      " / ", 
      ["get", "name:latin"]
    ];
  }

  return field.map(localizeStyleField);
}

function localizeMapStyle(style) {
  style.layers.forEach((layer) => {
    if (layer.layout && layer.layout["text-field"]) {
      layer.layout["text-field"] = localizeStyleField(layer.layout["text-field"]);
    }
  });

  return style;
}

async function initMap() {
  const response = await fetch(mapStyleUrl);
  const style = await response.json();
  const localizedStyle = localizeMapStyle(style);

  map = new maplibregl.Map({
    container: "map",
    style: localizedStyle,
    center: [19.8171, 41.3275],
    zoom: 7,
    attributionControl: false
  });

  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-left");

  map.on("load", () => {
    createMarkers();
    state.selectedId = events[0].id;
    updateUI(true);
    map.resize();
  });
}

initMap();

// Të dhënat janë renditur sipas kohës që lista dhe "story mode" të ecin natyrshëm.
const events = [
  {
    id: "albania-italian-1939",
    title: "Italia pushton Shqipërinë",
    dateLabel: "7 prill 1939",
    isoDate: "1939-04-07",
    year: 1939,
    month: "Prill",
    place: "Durrës, Shqipëri",
    coords: [41.3231, 19.4548],
    period: "fillimi",
    type: "sulm",
    front: "Ballkan",
    description: "Forcat italiane zbarkuan në Durrës dhe pushtuan Shqipërinë brenda pak ditësh. Mbreti Zog u largua në mërgim dhe vendi u përfshi në bllokun fashist."
  },
  {
    id: "poland-1939",
    title: "Pushtimi i Polonisë",
    dateLabel: "1 shtator 1939",
    isoDate: "1939-09-01",
    year: 1939,
    month: "Shtator",
    place: "Varshavë, Poloni",
    coords: [52.2297, 21.0122],
    period: "fillimi",
    type: "sulm",
    front: "Evropë",
    description: "Gjermania sulmoi Poloninë dhe kjo shihet si ndezja zyrtare e Luftës së Dytë Botërore në Evropë."
  },
  {
    id: "soviet-poland-1939",
    title: "Hyrja sovjetike në lindje të Polonisë",
    dateLabel: "17 shtator 1939",
    isoDate: "1939-09-17",
    year: 1939,
    month: "Shtator",
    place: "Brest, Poloni e atëhershme",
    coords: [52.0976, 23.7341],
    period: "fillimi",
    type: "sulm",
    front: "Evropë",
    description: "Pak javë pas sulmit gjerman, Bashkimi Sovjetik hyri nga lindja dhe Polonia u gjend mes dy forcave."
  },
  {
    id: "winter-war-1939",
    title: "Fillon Lufta e Dimrit",
    dateLabel: "30 nëntor 1939",
    isoDate: "1939-11-30",
    year: 1939,
    month: "Nëntor",
    place: "Helsinki, Finlandë",
    coords: [60.1699, 24.9384],
    period: "fillimi",
    type: "beteje",
    front: "Evropë",
    description: "Bashkimi Sovjetik sulmoi Finlandën. Edhe pse më e vogël, Finlanda rezistoi fort dhe lufta tërhoqi shumë vëmendje."
  },
  {
    id: "norway-1940",
    title: "Pushtimi i Norvegjisë",
    dateLabel: "9 prill 1940",
    isoDate: "1940-04-09",
    year: 1940,
    month: "Prill",
    place: "Oslo, Norvegji",
    coords: [59.9139, 10.7522],
    period: "fillimi",
    type: "sulm",
    front: "Evropë",
    description: "Gjermania pushtoi Norvegjinë për të siguruar rrugë detare dhe furnizime strategjike në veri."
  },
  {
    id: "france-1940",
    title: "Beteja e Francës",
    dateLabel: "10 maj 1940",
    isoDate: "1940-05-10",
    year: 1940,
    month: "Maj",
    place: "Sedan, Francë",
    coords: [49.7019, 4.9403],
    period: "fillimi",
    type: "beteje",
    front: "Evropë",
    description: "Forcat gjermane kaluan me shpejtësi nëpër Francë dhe ndryshuan krejt situatën në Evropën Perëndimore."
  },
  {
    id: "britain-1940",
    title: "Beteja e Britanisë",
    dateLabel: "10 korrik 1940",
    isoDate: "1940-07-10",
    year: 1940,
    month: "Korrik",
    place: "Londër, Mbretëria e Bashkuar",
    coords: [51.5072, -0.1276],
    period: "fillimi",
    type: "beteje",
    front: "Evropë",
    description: "Luftimet ajrore mbi Britani treguan se Gjermania nuk e kishte aq të lehtë të fitonte kontrollin e qiellit."
  },
  {
    id: "balkan-1941",
    title: "Sulmi ndaj Jugosllavisë",
    dateLabel: "6 prill 1941",
    isoDate: "1941-04-06",
    year: 1941,
    month: "Prill",
    place: "Beograd, Jugosllavi",
    coords: [44.7866, 20.4489],
    period: "fillimi",
    type: "sulm",
    front: "Ballkan",
    description: "Gjermania nisi sulmin ndaj Jugosllavisë dhe Greqisë, duke zgjeruar luftën edhe më shumë në Ballkan."
  },
  {
    id: "barbarossa-1941",
    title: "Operacioni Barbarossa",
    dateLabel: "22 qershor 1941",
    isoDate: "1941-06-22",
    year: 1941,
    month: "Qershor",
    place: "Minsk, Bjellorusi",
    coords: [53.9006, 27.559],
    period: "fillimi",
    type: "sulm",
    front: "Lindja",
    description: "Gjermania sulmoi Bashkimin Sovjetik në një front gjigant. Ky ishte një nga momentet më të mëdha të luftës."
  },
  {
    id: "pearl-harbor-1941",
    title: "Sulmi mbi Pearl Harbor",
    dateLabel: "7 dhjetor 1941",
    isoDate: "1941-12-07",
    year: 1941,
    month: "Dhjetor",
    place: "Hawaii, SHBA",
    coords: [21.3649, -157.9501],
    period: "fillimi",
    type: "sulm",
    front: "Paqësor",
    description: "Japonia sulmoi bazën amerikane në Pearl Harbor dhe SHBA hyri zyrtarisht në luftë."
  },
  {
    id: "midway-1942",
    title: "Beteja e Midway",
    dateLabel: "4 qershor 1942",
    isoDate: "1942-06-04",
    year: 1942,
    month: "Qershor",
    place: "Midway, Oqeani Paqësor",
    coords: [28.2072, -177.3735],
    period: "mesi",
    type: "kthese",
    front: "Paqësor",
    description: "Kjo betejë i dha një goditje shumë të fortë Japonisë dhe shpesh quhet pika e kthesës në Paqësor."
  },
  {
    id: "el-alamein-1942",
    title: "Beteja e El Alamein",
    dateLabel: "23 tetor 1942",
    isoDate: "1942-10-23",
    year: 1942,
    month: "Tetor",
    place: "El Alamein, Egjipt",
    coords: [30.8308, 28.955],
    period: "mesi",
    type: "kthese",
    front: "Afrikë e Veriut",
    description: "Forcat aleate ndalën avancimin gjerman në Afrikën e Veriut. Kjo ndryshoi ritmin e luftës në atë zonë."
  },
  {
    id: "stalingrad-1942",
    title: "Beteja e Stalingradit",
    dateLabel: "23 gusht 1942 - 2 shkurt 1943",
    isoDate: "1942-08-23",
    year: 1942,
    month: "Gusht",
    place: "Stalingrad, BRSS",
    coords: [48.708, 44.5133],
    period: "mesi",
    type: "kthese",
    front: "Lindja",
    description: "Një nga betejat më të ashpra të luftës. Fitorja sovjetike këtu e ktheu seriozisht rrjedhën e luftës në lindje."
  },
  {
    id: "albania-peze-1942",
    title: "Konferenca e Pezës",
    dateLabel: "16 shtator 1942",
    isoDate: "1942-09-16",
    year: 1942,
    month: "Shtator",
    place: "Pezë, Shqipëri",
    coords: [41.196, 19.728],
    period: "mesi",
    type: "kthese",
    front: "Ballkan",
    description: "Në fshatin Pezë u themelua Lëvizja Antifashiste Nacional-Çlirimtare, e cila bashkoi forcat e rezistencës shqiptare kundër pushtuesve."
  },
  {
    id: "torch-1942",
    title: "Operacioni Torch",
    dateLabel: "8 nëntor 1942",
    isoDate: "1942-11-08",
    year: 1942,
    month: "Nëntor",
    place: "Kazablanka, Marok",
    coords: [33.5731, -7.5898],
    period: "mesi",
    type: "sulm",
    front: "Afrikë e Veriut",
    description: "Aleatët zbarkuan në Afrikën e Veriut dhe hapën një tjetër presion të madh kundër Boshtit."
  },
  {
    id: "warsaw-ghetto-1943",
    title: "Kryengritja e Getos së Varshavës",
    dateLabel: "19 prill 1943",
    isoDate: "1943-04-19",
    year: 1943,
    month: "Prill",
    place: "Varshavë, Poloni",
    coords: [52.2355, 21.022],
    period: "mesi",
    type: "kthese",
    front: "Evropë",
    description: "Banorët hebrenj të getos u ngritën kundër forcave naziste. Ishte një akt i fortë rezistence, edhe pse brutaliteti ishte i madh."
  },
  {
    id: "sicily-1943",
    title: "Pushtimi i Sicilisë",
    dateLabel: "10 korrik 1943",
    isoDate: "1943-07-10",
    year: 1943,
    month: "Korrik",
    place: "Palermo, Itali",
    coords: [38.1157, 13.3615],
    period: "mesi",
    type: "sulm",
    front: "Mesdhe",
    description: "Aleatët zbarkuan në Sicili dhe kjo i afroi drejt Italisë, duke dobësuar më tej Boshtin në jug të Evropës."
  },
  {
    id: "italy-surrenders-1943",
    title: "Italia dorëzohet",
    dateLabel: "8 shtator 1943",
    isoDate: "1943-09-08",
    year: 1943,
    month: "Shtator",
    place: "Romë, Itali",
    coords: [41.9028, 12.4964],
    period: "mesi",
    type: "kthese",
    front: "Mesdhe",
    description: "Dorëzimi i Italisë ishte një goditje politike dhe ushtarake për Boshtin. Lufta, megjithatë, vazhdoi në territorin italian."
  },
  {
    id: "albania-german-1943",
    title: "Pushtimi gjerman i Shqipërisë",
    dateLabel: "10 shtator 1943",
    isoDate: "1943-09-10",
    year: 1943,
    month: "Shtator",
    place: "Tiranë, Shqipëri",
    coords: [41.3275, 19.8189],
    period: "mesi",
    type: "sulm",
    front: "Ballkan",
    description: "Pas dorëzimit të Italisë, Gjermania naziste mori kontrollin e Shqipërisë. Rezistenca shqiptare u forcua dhe luftimet u intensifikuan në mbarë vendin."
  },
  {
    id: "leningrad-1944",
    title: "Mbaron rrethimi i Leningradit",
    dateLabel: "27 janar 1944",
    isoDate: "1944-01-27",
    year: 1944,
    month: "Janar",
    place: "Leningrad, BRSS",
    coords: [59.9311, 30.3609],
    period: "fundi",
    type: "kthese",
    front: "Lindja",
    description: "Pas një rrethimi tepër të gjatë dhe të dhimbshëm, qyteti u çlirua. Kjo ishte një fitore me peshë morale dhe ushtarake."
  },
  {
    id: "dday-1944",
    title: "D-Day",
    dateLabel: "6 qershor 1944",
    isoDate: "1944-06-06",
    year: 1944,
    month: "Qershor",
    place: "Normandi, Francë",
    coords: [49.3228, -0.6217],
    period: "fundi",
    type: "beteje",
    front: "Evropë",
    description: "Aleatët zbarkuan në Normandi dhe hapën një front të madh perëndimor kundër Gjermanisë naziste."
  },
  {
    id: "paris-1944",
    title: "Çlirimi i Parisit",
    dateLabel: "25 gusht 1944",
    isoDate: "1944-08-25",
    year: 1944,
    month: "Gusht",
    place: "Paris, Francë",
    coords: [48.8566, 2.3522],
    period: "fundi",
    type: "kthese",
    front: "Evropë",
    description: "Parisi u çlirua dhe ky ishte një moment shumë simbolik për Evropën Perëndimore."
  },
  {
    id: "leyte-1944",
    title: "Beteja e Gjirit të Leyte",
    dateLabel: "23 tetor 1944",
    isoDate: "1944-10-23",
    year: 1944,
    month: "Tetor",
    place: "Leyte, Filipine",
    coords: [10.8897, 125.0147],
    period: "fundi",
    type: "kthese",
    front: "Paqësor",
    description: "Një nga betejat më të mëdha detare të historisë. Kjo e dobësoi rëndë flotën japoneze."
  },
  {
    id: "albania-liberation-1944",
    title: "Çlirimi i Tiranës",
    dateLabel: "17 nëntor 1944",
    isoDate: "1944-11-17",
    year: 1944,
    month: "Nëntor",
    place: "Tiranë, Shqipëri",
    coords: [41.3275, 19.8189],
    period: "fundi",
    type: "kthese",
    front: "Ballkan",
    description: "Partizanët shqiptarë çliruan Tiranën pa ndihmë të huaj ushtarake. Brenda dy javësh i gjithë vendi u çlirua nga okupatorët gjermanë."
  },
  {
    id: "bulge-1944",
    title: "Beteja e Ardenneve",
    dateLabel: "16 dhjetor 1944",
    isoDate: "1944-12-16",
    year: 1944,
    month: "Dhjetor",
    place: "Bastogne, Belgjikë",
    coords: [50.0259, 5.743],
    period: "fundi",
    type: "beteje",
    front: "Evropë",
    description: "Kundërsulmi i fundit i madh gjerman në perëndim. Aleatët e përballuan dhe ruajtën epërsinë."
  },
  {
    id: "iwo-jima-1945",
    title: "Beteja e Iwo Jimës",
    dateLabel: "19 shkurt 1945",
    isoDate: "1945-02-19",
    year: 1945,
    month: "Shkurt",
    place: "Iwo Jima, Japoni",
    coords: [24.784, 141.3228],
    period: "fundi",
    type: "beteje",
    front: "Paqësor",
    description: "Luftimet ishin jashtëzakonisht të ashpra. Ishulli u bë i rëndësishëm për operacionet ajrore amerikane."
  },
  {
    id: "berlin-1945",
    title: "Beteja e Berlinit",
    dateLabel: "16 prill 1945",
    isoDate: "1945-04-16",
    year: 1945,
    month: "Prill",
    place: "Berlin, Gjermani",
    coords: [52.52, 13.405],
    period: "fundi",
    type: "beteje",
    front: "Evropë",
    description: "Sulmi final mbi Berlinin çoi drejt rënies së regjimit nazist dhe fundit të luftës në Evropë."
  },
  {
    id: "ve-day-1945",
    title: "Fitorja në Evropë",
    dateLabel: "8 maj 1945",
    isoDate: "1945-05-08",
    year: 1945,
    month: "Maj",
    place: "Berlin, Gjermani",
    coords: [52.515, 13.39],
    period: "fundi",
    type: "kthese",
    front: "Evropë",
    description: "Gjermania u dorëzua dhe lufta në Evropë mori fund. Në Paqësor luftimet vazhduan edhe disa muaj."
  },
  {
    id: "hiroshima-1945",
    title: "Bombardimi i Hiroshimës",
    dateLabel: "6 gusht 1945",
    isoDate: "1945-08-06",
    year: 1945,
    month: "Gusht",
    place: "Hiroshima, Japoni",
    coords: [34.3853, 132.4553],
    period: "fundi",
    type: "sulm",
    front: "Paqësor",
    description: "SHBA hodhi bombën atomike mbi Hiroshimë. Pasojat ishin shkatërruese dhe humbjet njerëzore shumë të mëdha."
  },
  {
    id: "nagasaki-1945",
    title: "Bombardimi i Nagasakit",
    dateLabel: "9 gusht 1945",
    isoDate: "1945-08-09",
    year: 1945,
    month: "Gusht",
    place: "Nagasaki, Japoni",
    coords: [32.7503, 129.8777],
    period: "fundi",
    type: "sulm",
    front: "Paqësor",
    description: "Tre ditë pas Hiroshimës, një bombë tjetër atomike ra mbi Nagasaki. Japonia ishte tashmë nën presion ekstrem."
  },
  {
    id: "japan-surrenders-1945",
    title: "Japonia dorëzohet",
    dateLabel: "2 shtator 1945",
    isoDate: "1945-09-02",
    year: 1945,
    month: "Shtator",
    place: "Gjiri i Tokios, Japoni",
    coords: [35.45, 139.76],
    period: "fundi",
    type: "kthese",
    front: "Paqësor",
    description: "Me dorëzimin zyrtar të Japonisë, Lufta e Dytë Botërore mori fund edhe në Paqësor."
  }
];

const state = {
  period: "all",
  type: "all",
  year: "all",
  search: "",
  selectedId: null,
  storyPlaying: false,
  storyTimer: null,
  storyIndex: 0,
  storyInterval: 12000
};

const MOBILE_BREAKPOINT = 1100;
const isMobileLayout = () => window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
const scrollIntoViewIfMobile = (selector) => {
  if (!isMobileLayout()) return;
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const markers = new Map();

const searchInput = document.getElementById("searchInput");
const eventList = document.getElementById("eventList");
const selectedEvent = document.getElementById("selectedEvent");
const resultCount = document.getElementById("resultCount");
const yearFilters = document.getElementById("yearFilters");
const statVisible = document.getElementById("statVisible");
const statYears = document.getElementById("statYears");
const statFronts = document.getElementById("statFronts");
const storyBtn = document.getElementById("storyBtn");
const showAllBtn = document.getElementById("showAllBtn");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");

function getTypeLabel(type) {
  const labels = {
    sulm: "Sulm",
    beteje: "Betejë",
    kthese: "Pikë kthese"
  };

  return labels[type];
}

function createMarkerElement(type, isActive = false) {
  const markerEl = document.createElement("div");
  markerEl.className = `event-marker ${type}${isActive ? " active" : ""}`;
  return markerEl;
}

function popupTemplate(event) {
  return `
    <div class="popup-card">
      <div class="event-photo popup-photo" data-photo-for="${event.id}"></div>
      <h3>${event.title}</h3>
      <p class="popup-date">${event.dateLabel}</p>
      <p class="popup-place">${event.place}</p>
      <p class="popup-text">${event.description}</p>
    </div>
  `;
}

function createMarkers() {
  events.forEach((event) => {
    const markerEl = createMarkerElement(event.type, state.selectedId === event.id);
    const popup = new maplibregl.Popup({
      offset: 25,
      closeButton: false,
      closeOnClick: true
    }).setHTML(popupTemplate(event));

    const marker = new maplibregl.Marker(markerEl)
      .setLngLat([event.coords[1], event.coords[0]])
      .setPopup(popup)
      .addTo(map);

    markerEl.addEventListener("click", (e) => {
      e.stopPropagation();
      
      // Close all other popups
      markers.forEach((markerObj) => {
        if (markerObj && markerObj.popup && markerObj.popup.isOpen()) {
          markerObj.popup.remove();
        }
      });
      
      state.selectedId = event.id;
      updateUI(false);
      
      // Show the popup (skip in presenter mode — the panel already shows the info).
      if (popup && !inPresenterMode()) {
        popup.setHTML(popupTemplate(event));
        if (!popup.isOpen()) {
          popup.addTo(map);
        }
        hydrateEventPhoto(event.id);
      }

      // Show story controls when a marker is clicked
      if (!state.storyPlaying) {
        showStoryControls();
      }
    });

    markers.set(event.id, {
      marker,
      popup,
      element: markerEl,
      eventData: event,
      visible: true
    });
  });
}

function renderYearButtons() {
  const years = [...new Set(events.map((event) => event.year))];

  yearFilters.innerHTML = `
    <button class="chip-btn year-btn active" data-filter-group="year" data-value="all">Të gjitha</button>
    ${years.map((year) => `
      <button class="chip-btn year-btn" data-filter-group="year" data-value="${year}">${year}</button>
    `).join("")}
  `;
}

function getFilteredEvents() {
  const query = state.search.trim().toLowerCase();

  return events.filter((event) => {
    const matchesPeriod = state.period === "all" || event.period === state.period;
    const matchesType = state.type === "all" || event.type === state.type;
    const matchesYear = state.year === "all" || String(event.year) === state.year;
    const haystack = `${event.title} ${event.place} ${event.description} ${event.month}`.toLowerCase();
    const matchesSearch = query === "" || haystack.includes(query);

    return matchesPeriod && matchesType && matchesYear && matchesSearch;
  });
}

function setActiveButtons() {
  document.querySelectorAll("[data-filter-group]").forEach((button) => {
    const group = button.dataset.filterGroup;
    const value = button.dataset.value;
    const isActive = state[group] === value;

    button.classList.toggle("active", isActive);
  });
}

function updateStats(filteredEvents) {
  const fronts = new Set(filteredEvents.map((event) => event.front));
  const years = new Set(filteredEvents.map((event) => event.year));

  statVisible.textContent = filteredEvents.length;
  statYears.textContent = years.size;
  statFronts.textContent = fronts.size;
  resultCount.textContent = `${filteredEvents.length} ngjarje`;
}

function renderSelectedEvent(event, isStoryMode = false) {
  if (!event) {
    selectedEvent.innerHTML = `
      <p class="selected-empty">Nuk ka një ngjarje të zgjedhur tani. Kliko një kartelë ose një shenjë në hartë.</p>
    `;
    selectedEvent.classList.remove("story-active");
    return;
  }

  const scale = scaleFigures[event.id];
  selectedEvent.classList.toggle("story-active", isStoryMode);
  selectedEvent.innerHTML = `
    <div class="event-photo selected-photo" data-photo-for="${event.id}"></div>
    <h3>${event.title}</h3>
    <div class="selected-meta">
      <span class="meta-pill">${event.dateLabel}</span>
      <span class="meta-pill">${event.place}</span>
      <span class="meta-pill">${getTypeLabel(event.type)}</span>
      <span class="meta-pill">${event.front}</span>
    </div>
    ${scale ? `<p class="scale-figure">${scale}</p>` : ""}
    <p class="selected-text">${event.description}</p>
  `;
  hydrateEventPhoto(event.id);
  renderPresenterPanel(event);
}

function renderPresenterPanel(event) {
  const content = document.querySelector("#presenterPanel .presenter-content");
  if (!content) return;
  if (!event) {
    content.innerHTML = `<div class="presenter-text"><p class="presenter-eyebrow">—</p><h3 class="presenter-title">Asnjë ngjarje e zgjedhur</h3></div>`;
    return;
  }
  const scale = scaleFigures[event.id];
  content.innerHTML = `
    <div class="event-photo presenter-photo" data-photo-for="${event.id}"></div>
    <div class="presenter-text">
      <p class="presenter-eyebrow">${event.dateLabel} · ${event.place}</p>
      <h3 class="presenter-title">${event.title}</h3>
      ${scale ? `<p class="presenter-scale">${scale}</p>` : ""}
      <p class="presenter-desc">${event.description}</p>
    </div>
  `;
  hydrateEventPhoto(event.id);
}

function renderEventList(filteredEvents) {
  if (filteredEvents.length === 0) {
    eventList.innerHTML = `
      <div class="empty-state">
        <h3>Nuk u gjet asgjë</h3>
        <p>Provo një filtër tjetër ose hiqe kërkimin që të shfaqen më shumë ngjarje.</p>
      </div>
    `;
    return;
  }

  eventList.innerHTML = filteredEvents.map((event) => `
    <button class="event-card ${state.selectedId === event.id ? "active" : ""}" data-event-id="${event.id}">
      <div class="event-card-top">
        <h3 class="card-title">${event.title}</h3>
      </div>
      <p class="card-date">${event.dateLabel}</p>
      <p>${event.description}</p>
      <div class="card-tags">
        <span class="tag"><span class="tag-dot ${event.type}"></span>${getTypeLabel(event.type)}</span>
        <span class="tag">${event.month} ${event.year}</span>
        <span class="tag">${event.front}</span>
      </div>
    </button>
  `).join("");

  document.querySelectorAll(".event-card").forEach((card) => {
    card.addEventListener("click", () => {
      // Close all popups
      markers.forEach((markerObj) => {
        if (markerObj.popup.isOpen()) {
          markerObj.popup.remove();
        }
      });

      focusEvent(card.dataset.eventId);

      // Show story controls when an event card is clicked
      if (!state.storyPlaying) {
        showStoryControls();
      }

      // On mobile the map sits above the sidebar — bring it into view
      // so the user sees the marker animate to its location.
      scrollIntoViewIfMobile(".map-shell-card");
    });
  });
}

function updateMarkers(filteredEvents) {
  const visibleIds = new Set(filteredEvents.map((event) => event.id));
  const visibleMarkers = [];

  markers.forEach((markerObj, id) => {
    const event = markerObj.eventData;
    const isVisible = visibleIds.has(id);
    const isActive = state.selectedId === id;

    markerObj.element.classList.toggle("active", isActive);

    if (isVisible) {
      if (!markerObj.visible) {
        markerObj.marker.addTo(map);
        markerObj.visible = true;
      }
      visibleMarkers.push(markerObj);
    } else if (markerObj.visible) {
      markerObj.marker.remove();
      markerObj.visible = false;
    }
  });

  return visibleMarkers;
}

function fitMapToMarkers(visibleMarkers) {
  if (visibleMarkers.length === 0) {
    map.setCenter([15, 28]);
    map.setZoom(2);
    return;
  }

  const padBottom = getMapBottomPadding();

  if (visibleMarkers.length === 1) {
    const lngLat = visibleMarkers[0].marker.getLngLat();
    map.flyTo({
      center: [lngLat.lng, lngLat.lat],
      zoom: 4,
      speed: 1.1,
      padding: { top: 0, right: 0, bottom: padBottom, left: 0 }
    });
    return;
  }

  const bounds = new maplibregl.LngLatBounds();
  visibleMarkers.forEach((markerObj) => {
    bounds.extend(markerObj.marker.getLngLat());
  });

  map.fitBounds(bounds, {
    padding: { top: 60, right: 60, bottom: Math.max(60, padBottom), left: 60 },
    maxZoom: 4,
    duration: 800
  });
}

function ensureSelectedEvent(filteredEvents) {
  const selectedStillVisible = filteredEvents.some((event) => event.id === state.selectedId);

  if (!selectedStillVisible) {
    state.selectedId = filteredEvents.length > 0 ? filteredEvents[0].id : null;
  }
}

function updateUI(shouldFitMap = true, isStoryMode = false) {
  const filteredEvents = getFilteredEvents();
  ensureSelectedEvent(filteredEvents);

  const visibleMarkers = updateMarkers(filteredEvents);
  const activeEvent = filteredEvents.find((event) => event.id === state.selectedId) || null;

  setActiveButtons();
  updateStats(filteredEvents);
  renderSelectedEvent(activeEvent, isStoryMode);
  renderEventList(filteredEvents);

  if (shouldFitMap) {
    fitMapToMarkers(visibleMarkers);
  }

  // Only show popup during story mode or when actively selected (via click).
  // Skip in presenter mode — the panel already shows the info.
  if (activeEvent && isStoryMode && !inPresenterMode()) {
    const markerObj = markers.get(activeEvent.id);
    if (markerObj) {
      markerObj.popup.setHTML(popupTemplate(activeEvent));
      if (!markerObj.popup.isOpen()) {
        markerObj.popup.addTo(map);
      }
      hydrateEventPhoto(activeEvent.id);
    }
  }
}

function focusEvent(eventId, isStoryMode = false) {
  const event = events.find((item) => item.id === eventId);

  if (!event) {
    return;
  }

  state.selectedId = eventId;
  updateUI(false, isStoryMode);

  const markerObj = markers.get(eventId);
  if (markerObj) {
    // Close all other popups first
    markers.forEach((m) => {
      if (m && m.popup && m.popup.isOpen()) {
        m.popup.remove();
      }
    });
    
    const coords = [event.coords[1], event.coords[0]];
    const padBottom = getMapBottomPadding();
    map.flyTo({
      center: coords,
      zoom: Math.max(map.getZoom(), 4),
      speed: 1.1,
      padding: { top: 0, right: 0, bottom: padBottom, left: 0 }
    });
    
    // Add the popup with a small delay to ensure smooth transition.
    // Skip in presenter mode — the panel already shows the info and a popup
    // would overlap it at the bottom of the map.
    setTimeout(() => {
      if (markerObj.popup && !inPresenterMode()) {
        markerObj.popup.setHTML(popupTemplate(event));
        markerObj.popup.addTo(map);
        hydrateEventPhoto(event.id);
      }
    }, 200);
  }
}

function showStoryControls() {
  const storyControls = document.getElementById("storyControls");
  storyControls.style.display = "grid";
}

function hideStoryControls() {
  const storyControls = document.getElementById("storyControls");
  storyControls.style.display = "none";
}

function updateStoryProgress() {
  const filtered = getFilteredEvents();
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  if (!progressFill || !progressText || filtered.length === 0) return;
  const percentage = ((state.storyIndex + 1) / filtered.length) * 100;
  progressFill.style.width = percentage + "%";
  progressText.textContent = `Ngjarja ${state.storyIndex + 1} nga ${filtered.length}`;
}

function startStoryTimer() {
  window.clearInterval(state.storyTimer);
  state.storyTimer = window.setInterval(() => {
    const currentFiltered = getFilteredEvents();
    if (currentFiltered.length === 0) {
      toggleStoryMode();
      return;
    }
    state.storyIndex = (state.storyIndex + 1) % currentFiltered.length;
    focusEvent(currentFiltered[state.storyIndex].id, true);
    updateStoryProgress();
  }, state.storyInterval);
}

function goToOffset(offset) {
  const filtered = getFilteredEvents();
  if (filtered.length === 0) return;
  const i = filtered.findIndex((e) => e.id === state.selectedId);
  const base = i >= 0 ? i : 0;
  const next = (base + offset + filtered.length) % filtered.length;
  state.storyIndex = next;
  focusEvent(filtered[next].id, state.storyPlaying);
  updateStoryProgress();
  // Manual navigation should give the new event a full interval before the
  // next auto-advance — otherwise it can flip again almost immediately.
  if (state.storyPlaying) startStoryTimer();
}

function inPresenterMode() {
  return document.body.classList.contains("presenter");
}

function closeAllPopups() {
  markers.forEach((m) => {
    if (m?.popup?.isOpen()) m.popup.remove();
  });
}

// Bottom padding that should be reserved on the map so markers don't sit
// underneath the presenter panel. Returns 0 when not in presenter mode.
function getMapBottomPadding() {
  if (!inPresenterMode()) return 0;
  const panel = document.getElementById("presenterPanel");
  return panel ? panel.getBoundingClientRect().height + 24 : 0;
}

function setMapPaddingForPresenter(active) {
  if (!map) return;
  const padBottom = active ? getMapBottomPadding() : 0;
  map.setPadding({ top: 0, right: 0, bottom: padBottom, left: 0 });
}

function togglePresenterMode(force) {
  const next = typeof force === "boolean" ? force : !document.body.classList.contains("presenter");
  document.body.classList.toggle("presenter", next);
  document.getElementById("presenterPanel")?.setAttribute("aria-hidden", next ? "false" : "true");
  document.getElementById("presenterBtn")?.setAttribute("aria-pressed", next ? "true" : "false");
  // The presenter panel already shows the photo + description — popups would
  // duplicate that info and overlap the panel at the bottom of the map.
  if (next) closeAllPopups();
  // Re-render so the panel picks up the current event.
  const active = events.find((e) => e.id === state.selectedId);
  if (active) renderPresenterPanel(active);
  // Map needs a resize and padding update whenever the panel toggles.
  setTimeout(() => {
    map?.resize();
    setMapPaddingForPresenter(next);
    // Re-centre the active event so it sits above the panel, not under it.
    if (next && active) {
      const padBottom = getMapBottomPadding();
      map?.flyTo({
        center: [active.coords[1], active.coords[0]],
        speed: 1.1,
        padding: { top: 0, right: 0, bottom: padBottom, left: 0 }
      });
    }
  }, 350);
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.().catch(() => {});
  } else {
    document.exitFullscreen?.();
  }
}

function toggleShortcutsHelp(force) {
  const next = typeof force === "boolean" ? force : !document.body.classList.contains("shortcuts-open");
  document.body.classList.toggle("shortcuts-open", next);
  document.getElementById("shortcutsOverlay")?.setAttribute("aria-hidden", next ? "false" : "true");
}

let splashDismissed = false;
function dismissSplash() {
  if (splashDismissed) return;
  splashDismissed = true;
  document.body.classList.add("splash-dismissed");
  // Resize the map after the overlay fade so tiles paint at the right size.
  setTimeout(() => map?.resize(), 700);
}

function isSplashVisible() {
  return !splashDismissed;
}

function updatePresenterPlayButton() {
  const btn = document.getElementById("presenterPlay");
  if (!btn) return;
  btn.textContent = state.storyPlaying ? "❚❚" : "▶";
  btn.setAttribute("aria-label", state.storyPlaying ? "Ndalo" : "Luaj");
}

function toggleStoryMode() {
  const filteredEvents = getFilteredEvents();

  if (filteredEvents.length === 0) {
    return;
  }

  const storyProgress = document.getElementById("storyProgress");

  if (state.storyPlaying) {
    window.clearInterval(state.storyTimer);
    state.storyPlaying = false;
    storyBtn.textContent = "Luaj kronologjinë";
    storyBtn.classList.remove("playing");
    document.body.classList.remove("playing");
    storyProgress.style.display = "none";
    showStoryControls();
    updatePresenterPlayButton();
    return;
  }

  state.storyPlaying = true;
  storyBtn.textContent = "Ndalo";
  storyBtn.classList.add("playing");
  document.body.classList.add("playing");
  storyProgress.style.display = "block";
  hideStoryControls();

  const currentIndex = filteredEvents.findIndex((event) => event.id === state.selectedId);
  state.storyIndex = currentIndex >= 0 ? currentIndex : 0;

  focusEvent(filteredEvents[state.storyIndex].id, true);
  updateStoryProgress();
  startStoryTimer();
  updatePresenterPlayButton();
}

function resetFilters() {
  state.period = "all";
  state.type = "all";
  state.year = "all";
  state.search = "";
  searchInput.value = "";
  document.querySelectorAll(".legend-item").forEach((item) => item.classList.remove("active"));
  updateUI(true);
}

function bindControls() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter-group]");

    if (!button) {
      return;
    }

    const group = button.dataset.filterGroup;
    state[group] = button.dataset.value;
    updateUI(true);
  });

  searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    updateUI(true);
  });

  storyBtn.addEventListener("click", () => {
    toggleStoryMode();
    if (state.storyPlaying) scrollIntoViewIfMobile(".map-shell-card");
  });

  const paceFilters = document.getElementById("paceFilters");
  if (paceFilters) {
    paceFilters.addEventListener("click", (event) => {
      const btn = event.target.closest(".pace-btn");
      if (!btn) return;

      const next = Number(btn.dataset.pace);
      if (!Number.isFinite(next) || next <= 0) return;

      state.storyInterval = next;
      paceFilters.querySelectorAll(".pace-btn").forEach((b) => {
        b.classList.toggle("active", b === btn);
      });

      if (state.storyPlaying) startStoryTimer();
    });
  }

  // Story control buttons
  const playFromStartBtn = document.getElementById("playFromStartBtn");
  const continuePlayBtn = document.getElementById("continuePlayBtn");

  playFromStartBtn.addEventListener("click", () => {
    const filteredEvents = getFilteredEvents();
    if (filteredEvents.length === 0) return;
    
    // Set to first event
    state.storyIndex = 0;
    state.selectedId = filteredEvents[0].id;
    
    // Start playing from beginning
    toggleStoryMode();
  });

  continuePlayBtn.addEventListener("click", () => {
    const filteredEvents = getFilteredEvents();
    if (filteredEvents.length === 0) return;
    
    // Continue from current event
    const currentIndex = filteredEvents.findIndex((event) => event.id === state.selectedId);
    state.storyIndex = currentIndex >= 0 ? currentIndex : 0;
    
    // Start playing from current position
    toggleStoryMode();
  });

  showAllBtn.addEventListener("click", () => {
    fitMapToMarkers(updateMarkers(getFilteredEvents()));
  });

  resetFiltersBtn.addEventListener("click", () => {
    if (state.storyPlaying) {
      toggleStoryMode();
    }

    resetFilters();
  });

  document.querySelectorAll(".legend-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      const type = item.dataset.type;

      if (state.type === type) {
        state.type = "all";
        item.classList.remove("active");
      } else {
        document.querySelectorAll(".legend-item").forEach((li) => li.classList.remove("active"));
        state.type = type;
        item.classList.add("active");
      }

      updateUI(true);
    });
  });

  // Presenter mode + shortcuts overlay buttons
  document.getElementById("presenterBtn")?.addEventListener("click", () => togglePresenterMode());
  document.getElementById("presenterExit")?.addEventListener("click", () => {
    if (state.storyPlaying) toggleStoryMode();
    togglePresenterMode(false);
  });
  document.getElementById("presenterPrev")?.addEventListener("click", () => goToOffset(-1));
  document.getElementById("presenterNext")?.addEventListener("click", () => goToOffset(1));
  document.getElementById("presenterPlay")?.addEventListener("click", () => toggleStoryMode());

  document.getElementById("shortcutsBtn")?.addEventListener("click", () => toggleShortcutsHelp(true));
  document.getElementById("shortcutsClose")?.addEventListener("click", () => toggleShortcutsHelp(false));
  document.getElementById("shortcutsOverlay")?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) toggleShortcutsHelp(false);
  });

  // Splash intro: any click/tap or any key dismisses it.
  const splash = document.getElementById("splashIntro");
  splash?.addEventListener("click", () => dismissSplash());
  document.getElementById("splashStart")?.addEventListener("click", (e) => {
    e.stopPropagation();
    dismissSplash();
  });

  // Keyboard shortcuts. Don't intercept while typing in inputs or with modifier keys.
  document.addEventListener("keydown", (e) => {
    const inField = e.target.matches?.("input, textarea, [contenteditable='true']");
    if (inField || e.metaKey || e.ctrlKey || e.altKey) return;

    if (isSplashVisible()) {
      e.preventDefault();
      dismissSplash();
      return;
    }

    switch (e.key) {
      case " ":
        e.preventDefault();
        toggleStoryMode();
        break;
      case "ArrowRight":
        e.preventDefault();
        goToOffset(1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        goToOffset(-1);
        break;
      case "p":
      case "P":
        e.preventDefault();
        togglePresenterMode();
        break;
      case "f":
      case "F":
        e.preventDefault();
        toggleFullscreen();
        break;
      case "?":
        e.preventDefault();
        toggleShortcutsHelp();
        break;
      case "Escape":
        if (document.body.classList.contains("shortcuts-open")) {
          toggleShortcutsHelp(false);
        } else if (document.body.classList.contains("presenter")) {
          togglePresenterMode(false);
        }
        break;
    }
  });
}

renderYearButtons();
bindControls();

state.selectedId = events[0].id;

window.addEventListener("load", () => {
  if (map) {
    window.setTimeout(() => {
      map.resize();
    }, 150);
  }
});

window.addEventListener("resize", () => {
  if (map) {
    window.requestAnimationFrame(() => {
      map.resize();
    });
  }
});
