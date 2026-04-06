const map = L.map("map", {
  worldCopyJump: true,
  scrollWheelZoom: false,
}).setView([28, 15], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  referrerPolicy: "strict-origin-when-cross-origin"
}).addTo(map);

// Të dhënat janë renditur sipas kohës që lista dhe "story mode" të ecin natyrshëm.
const events = [
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
  storyIndex: 0
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

function createMarkerIcon(type, isActive = false) {
  const activeClass = isActive ? "active" : "";

  return L.divIcon({
    className: "",
    html: `<div class="event-marker ${type} ${activeClass}"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10]
  });
}

function popupTemplate(event) {
  return `
    <div class="popup-card">
      <h3>${event.title}</h3>
      <p class="popup-date">${event.dateLabel}</p>
      <p class="popup-place">${event.place}</p>
      <p class="popup-text">${event.description}</p>
    </div>
  `;
}

function createMarkers() {
  events.forEach((event) => {
    const marker = L.marker(event.coords, {
      icon: createMarkerIcon(event.type)
    });

    marker.bindPopup(popupTemplate(event));
    marker.eventData = event;
    marker.on("click", () => {
      state.selectedId = event.id;
      updateUI(false);
    });

    markers.set(event.id, marker);
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

function renderSelectedEvent(event) {
  if (!event) {
    selectedEvent.innerHTML = `
      <p class="selected-empty">Nuk ka një ngjarje të zgjedhur tani. Kliko një kartelë ose një shenjë në hartë.</p>
    `;
    return;
  }

  selectedEvent.innerHTML = `
    <h3>${event.title}</h3>
    <div class="selected-meta">
      <span class="meta-pill">${event.dateLabel}</span>
      <span class="meta-pill">${event.place}</span>
      <span class="meta-pill">${getTypeLabel(event.type)}</span>
      <span class="meta-pill">${event.front}</span>
    </div>
    <p class="selected-text">${event.description}</p>
  `;
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
      focusEvent(card.dataset.eventId);
    });
  });
}

function updateMarkers(filteredEvents) {
  const visibleIds = new Set(filteredEvents.map((event) => event.id));
  const visibleMarkers = [];

  markers.forEach((marker, id) => {
    const event = marker.eventData;
    const isVisible = visibleIds.has(id);
    const isActive = state.selectedId === id;

    marker.setIcon(createMarkerIcon(event.type, isActive));

    if (isVisible) {
      marker.addTo(map);
      visibleMarkers.push(marker);
    } else {
      map.removeLayer(marker);
    }
  });

  return visibleMarkers;
}

function fitMapToMarkers(visibleMarkers) {
  if (visibleMarkers.length === 0) {
    map.setView([28, 15], 2);
    return;
  }

  const group = L.featureGroup(visibleMarkers);
  map.fitBounds(group.getBounds().pad(0.28));
}

function ensureSelectedEvent(filteredEvents) {
  const selectedStillVisible = filteredEvents.some((event) => event.id === state.selectedId);

  if (!selectedStillVisible) {
    state.selectedId = filteredEvents.length > 0 ? filteredEvents[0].id : null;
  }
}

function updateUI(shouldFitMap = true) {
  const filteredEvents = getFilteredEvents();
  ensureSelectedEvent(filteredEvents);

  const visibleMarkers = updateMarkers(filteredEvents);
  const activeEvent = filteredEvents.find((event) => event.id === state.selectedId) || null;

  setActiveButtons();
  updateStats(filteredEvents);
  renderSelectedEvent(activeEvent);
  renderEventList(filteredEvents);

  if (shouldFitMap) {
    fitMapToMarkers(visibleMarkers);
  }

  if (activeEvent) {
    const marker = markers.get(activeEvent.id);
    marker.setPopupContent(popupTemplate(activeEvent));
  }
}

function focusEvent(eventId) {
  const event = events.find((item) => item.id === eventId);

  if (!event) {
    return;
  }

  state.selectedId = eventId;
  updateUI(false);

  const marker = markers.get(eventId);
  map.flyTo(event.coords, Math.max(map.getZoom(), 4), {
    duration: 1.1
  });
  marker.openPopup();
}

function toggleStoryMode() {
  const filteredEvents = getFilteredEvents();

  if (filteredEvents.length === 0) {
    return;
  }

  if (state.storyPlaying) {
    window.clearInterval(state.storyTimer);
    state.storyPlaying = false;
    storyBtn.textContent = "Luaj Kronologjinë";
    return;
  }

  state.storyPlaying = true;
  storyBtn.textContent = "Ndalo";

  const currentIndex = filteredEvents.findIndex((event) => event.id === state.selectedId);
  state.storyIndex = currentIndex >= 0 ? currentIndex : 0;

  focusEvent(filteredEvents[state.storyIndex].id);

  state.storyTimer = window.setInterval(() => {
    const currentFiltered = getFilteredEvents();

    if (currentFiltered.length === 0) {
      toggleStoryMode();
      return;
    }

    state.storyIndex = (state.storyIndex + 1) % currentFiltered.length;
    focusEvent(currentFiltered[state.storyIndex].id);
  }, 3200);
}

function resetFilters() {
  state.period = "all";
  state.type = "all";
  state.year = "all";
  state.search = "";
  searchInput.value = "";
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

  storyBtn.addEventListener("click", toggleStoryMode);

  showAllBtn.addEventListener("click", () => {
    fitMapToMarkers(updateMarkers(getFilteredEvents()));
  });

  resetFiltersBtn.addEventListener("click", () => {
    if (state.storyPlaying) {
      toggleStoryMode();
    }

    resetFilters();
  });
}

createMarkers();
renderYearButtons();
bindControls();

state.selectedId = events[0].id;
updateUI(true);

map.whenReady(() => {
  window.requestAnimationFrame(() => {
    map.invalidateSize();
  });
});

window.addEventListener("load", () => {
  window.setTimeout(() => {
    map.invalidateSize();
  }, 150);
});

// Kur layout-i ndryshon, Leaflet ka nevojë të rifreskojë madhësinë e hartës.
window.addEventListener("resize", () => {
  window.requestAnimationFrame(() => {
    map.invalidateSize();
  });
});
