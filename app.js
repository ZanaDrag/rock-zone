/**
 * Rock Zone — Frontend Application
 * Управление плеером, навигацией, плейлистами, поиском
 */

/* ═══════════════════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════════════════ */
const state = {
  tracks:            [],
  playlists:         [],
  genres:            [],
  currentTrack:      null,
  currentIndex:      -1,
  queue:             [],
  isPlaying:         false,
  isShuffle:         false,
  isRepeat:          false,
  volume:            0.8,
  currentPage:       'home',
  filterGenre:       '',
  lyricsOpen:        false,
  lyrics:            [],
  currentLyricIndex: -1,
  activePlaylistId:  null,
};

/* ═══════════════════════════════════════════════════════════
   DOM REFS
═══════════════════════════════════════════════════════════ */
const dom = {
  audio:           document.getElementById('audio-element'),
  vinylDisc:       document.getElementById('vinyl-disc'),
  vinylNeedle:     document.getElementById('vinyl-needle'),
  trackCoverDyn:   document.getElementById('track-cover-dynamic'),
  trackCoverImg:   document.getElementById('track-cover-img'),
  npTitle:         document.getElementById('np-title'),
  npArtist:        document.getElementById('np-artist'),
  npGenre:         document.getElementById('np-genre'),
  homeTrackList:   document.getElementById('home-track-list'),
  catalogGrid:     document.getElementById('catalog-grid'),
  genreFilter:     document.getElementById('genre-filter'),
  playlistCont:    document.getElementById('playlist-container'),
  searchInput:     document.getElementById('search-input'),
  searchResults:   document.getElementById('search-results'),
  playerCoverImg:  document.getElementById('player-cover-img'),
  playerTitle:     document.getElementById('player-title'),
  playerArtist:    document.getElementById('player-artist'),
  btnPlay:         document.getElementById('btn-play'),
  btnPrev:         document.getElementById('btn-prev'),
  btnNext:         document.getElementById('btn-next'),
  btnShuffle:      document.getElementById('btn-shuffle'),
  btnRepeat:       document.getElementById('btn-repeat'),
  btnVolume:       document.getElementById('btn-volume'),
  playIcon:        document.getElementById('play-icon'),
  pauseIcon:       document.getElementById('pause-icon'),
  progressBar:     document.getElementById('progress-bar'),
  progressFill:    document.getElementById('progress-fill'),
  progressThumb:   document.getElementById('progress-thumb'),
  timeCurrent:     document.getElementById('time-current'),
  timeTotal:       document.getElementById('time-total'),
  volumeBar:       document.getElementById('volume-bar'),
  volumeFill:      document.getElementById('volume-fill'),
  playlistModal:   document.getElementById('playlist-modal'),
  modalClose:      document.getElementById('modal-close-btn'),
  modalTrackName:  document.getElementById('modal-track-name'),
  modalPlList:     document.getElementById('modal-playlist-list'),
  modalNewBtn:     document.getElementById('modal-new-btn'),
  toastContainer:    document.getElementById('toast-container'),
  navItems:          document.querySelectorAll('.nav-item'),
  pages:             document.querySelectorAll('.page'),
  // Lyrics
  btnLyrics:         document.getElementById('btn-lyrics'),
  lyricsPanel:       document.getElementById('lyrics-panel'),
  lyricsBackdrop:    document.getElementById('lyrics-backdrop'),
  lyricsBody:        document.getElementById('lyrics-body'),
  lyricsCover:       document.getElementById('lyrics-cover'),
  lyricsTrackTitle:  document.getElementById('lyrics-track-title'),
  lyricsTrackArtist: document.getElementById('lyrics-track-artist'),
  lyricsCloseBtn:    document.getElementById('lyrics-close-btn'),
  // Playlist detail page
  playlistDetailCoverWrap: document.getElementById('playlist-detail-cover-wrap'),
  playlistDetailCoverImg:  document.getElementById('playlist-detail-cover-img'),
  playlistDetailTitle:     document.getElementById('playlist-detail-title'),
  playlistDetailCount:     document.getElementById('playlist-detail-count'),
  playlistDetailTracks:    document.getElementById('playlist-detail-tracks'),
  playlistDetailPlayBtn:   document.getElementById('playlist-detail-play-btn'),
  playlistBackBtn:         document.getElementById('playlist-back-btn'),
  // Create playlist modal
  createPlaylistBtn:         document.getElementById('create-playlist-btn'),
  createPlModal:             document.getElementById('create-playlist-modal'),
  createPlCloseBtn:          document.getElementById('create-pl-close-btn'),
  createPlCoverInput:        document.getElementById('create-pl-cover-input'),
  createPlCoverPlaceholder:  document.getElementById('create-pl-cover-placeholder'),
  createPlCoverPreview:      document.getElementById('create-pl-cover-preview'),
  createPlNameInput:         document.getElementById('create-pl-name-input'),
  createPlSubmitBtn:         document.getElementById('create-pl-submit-btn'),
};

/* ═══════════════════════════════════════════════════════════
   API HELPERS
═══════════════════════════════════════════════════════════ */
const api = {
  async get(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  },
  async post(url, body) {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  },
};

/* ═══════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════ */
async function init() {
  try {
    const [tracksRes, playlistsRes, genresRes] = await Promise.all([
      api.get('/api/tracks'),
      api.get('/api/playlists'),
      api.get('/api/genres'),
    ]);
    state.tracks    = tracksRes.tracks;
    state.playlists = playlistsRes;
    state.genres    = genresRes;
    state.queue     = [...state.tracks];
  } catch (e) {
    // Fallback demo data когда сервер недоступен
    state.tracks = getDemoTracks();
    state.playlists = [{ id: 1, name: 'My Playlist', tracks: [state.tracks[0], state.tracks[2]] }];
    state.genres    = ['Dark Rock', 'Gothic Rock', 'Post-Rock', 'Grunge', 'Heavy Metal'];
    state.queue     = [...state.tracks];
    console.warn('Server unavailable, using demo data');
  }

  renderGenreFilter();
  renderHomeTrackList();
  renderCatalog();
  renderPlaylist();
  setupEventListeners();
  dom.audio.volume = state.volume;
}

/* ═══════════════════════════════════════════════════════════
   DEMO DATA (когда сервер недоступен)
═══════════════════════════════════════════════════════════ */
function getDemoTracks() {
  return [
    { id:1, title:'Утренний рассвет', artist:'Король и шут',  album:'Акустический альбом', duration:159, cover:'/images/cover2.jpg', audio:'/api/stream/1', genre:'КиШ',
      lyrics:[{time:0,text:'♪'},{time:14,text:'Утренний рассвет'},{time:16,text:'Солнце поднималось над землёй'},{time:22,text:'Просыпался лес'},{time:24,text:'Восхищаясь розовой зарёй'},{time:28,text:'Над озером стоял, клубился белый туман'},{time:31,text:'В овраге под горою шелестела листва'},{time:35,text:'Луч солнца улыбался и с росою играл'},{time:39,text:'Особенно прекрасны утром эти места'},{time:42,text:'Продолженье сна, дивная пора'},{time:49,text:'Как божественна природа и проста'},{time:56,text:'В небе голубом'}, {time:59,text:'Облака плывут, как корабли'},{time:64,text:'Тёплый ветерок'},{time:66,text:'Мчится над поверхностью земли'},{time:70,text:'Ещё не пробудились петухи в деревнях'},{time:74,text:'И рыбаков на озере пока не видать'},{time:77,text:'Коровами истоптана трава на полях'},{time:81,text:'Как здорово, что здесь мне довелось побывать'},{time:84,text:'Продолженье сна, дивная пора'},{time:91,text:'Как божественна природа и проста'},{time:99,text:'♪'},{time:127,text:'Продолженье сна, дивная пора'},{time:133,text:'Как божественна природа и проста'},{time:138,text:'♪'}]},
    { id:2, title:'Путь в никуда',     artist:'Ария', album:'Химера', duration:328, cover:'/images/cover9.jpg', audio:'/api/stream/49', genre:'Ария',
      lyrics:[{time:0,text:"♪"},{time:28,text:'Вспышка в темноте, яркий свет в глазах,'},{ time: 31,  text: "Я ослеп на миг." },
        {time:37,text:'Кто-то так хотел разбудить мой страх,'},{time:41,text:'Разбудить мой крик.'},{time:46,text:'Снова все мои желанья, что я сжег дотла,'},{time:53,text:'Оживают и зовут меня...'},{time:60,text:'Я все время плыл по теченью дней,'},{time:64,text:'Были сном мечты.'},{time:69,text:'Но мираж ожил: словно жадный зверь'},{time:73,text:'Появилась ты.'},{time:78,text:'Я твое дыханье слышу за своей спиной,'},{time:85,text:'Только ветер глушит голос мой!'},{time:91,text:'Путь в никуда.'},{time:94,text:'Я зову, но мне в ответ ни слова.'},{time:98,text:'Путь в никуда.'},{time:101,text:'Из-под ног моих уходит земля.'},{time:105,text:'Путь в никуда.'},{time:108,text:'Я искал к тебе пути иного.'},{time:113,text:'Путь в никуда.'},{time:115,text:'Ничего уже исправить нельзя.'},{time:120,text:'♪'},{time:134,text:'«Для героев - рай, ад - для дураков»,'},{time:138,text:'Я - такой, как есть.'},{time:143,text:'Осветил мне грань, где легко пропасть'},{time:147,text:'Выстрел в темноте.'},{time:152,text:'Голоса грозы все громче, все трудней дышать...'},{time:159,text:'На свободу просится душа!'},{time:166,text:'Путь в никуда.'},{time:168,text:'Я зову, но мне в ответ ни слова.'},{time:173,text:'Путь в никуда.'},{time:175,text:'Из-под ног моих уходит земля.'},{time:180,text:'Путь в никуда.'},{time:182,text:'Я искал к тебе пути иного.'},{time:187,text:'Путь в никуда.'},{time:189,text:'Ничего уже исправить нельзя.'},{time:196,text:'ебейшее соло, пат!'},{time:224,text:'Пусть душа моя кричит от боли,'},{time:231,text:'Пусть в глазах стоит сплошной туман,'},{time:239,text:'Лучше камнем вниз, чем жить по чьей-то воле.'},{time:245,text:'Этот путь я выбрал сам.'},{time:252,text:'Снова все мои желанья, что я сжег дотла'},{time:260,text:'Оживают и ведут меня...'},{time:266,text:'Путь в никуда.'},{time:269,text:'Я зову, но мне в ответ ни слова.'},{time:273,text:'Путь в никуда.'},{time:276,text:'Из-под ног моих уходит земля.'},{time:280,text:'Путь в никуда.'},{time:283,text:'Я искал к тебе пути иного.'},{time:287,text:'Путь в никуда.'},{time:290,text:'Ничего уже исправить нельзя.'},{time:294,text:'Путь в никуда.'},{time:297,text:'Я зову, но мне в ответ ни слова.'},{time:301,text:'Путь в никуда.'},{time:304,text:'Из-под ног моих уходит земля.'},{time:308,text:'Путь в никуда.'},{time:311,text:'Я искал к тебе пути иного.'},{time:315,text:'Путь в никуда.'},{time:318,text:'Ничего уже исправить нельзя.'},{time:323,text:'Путь в никуда!'}]},
  ];
}

/* ═══════════════════════════════════════════════════════════
   RENDER — HOME TRACK LIST
═══════════════════════════════════════════════════════════ */
function renderHomeTrackList(tracks = state.tracks) {
  dom.homeTrackList.innerHTML = '';
  tracks.forEach((track, i) => {
    const isActive = state.currentTrack?.id === track.id;
    const item = createTrackItem(track, i + 1, isActive, true);
    dom.homeTrackList.appendChild(item);
  });
}

/* ═══════════════════════════════════════════════════════════
   RENDER — CATALOG
═══════════════════════════════════════════════════════════ */
function renderCatalog(tracks = state.tracks) {
  dom.catalogGrid.innerHTML = '';
  tracks.forEach(track => {
    const isActive = state.currentTrack?.id === track.id;
    const card = document.createElement('div');
    card.className = `catalog-card${isActive ? ' active' : ''}`;
    card.dataset.id = track.id;
    card.innerHTML = `
      <div class="catalog-card-cover">
        <img src="${track.cover}" alt="${track.title}" loading="lazy" />
        <div class="catalog-card-overlay">
          <div class="catalog-play-btn">
            <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
      </div>
      <div class="catalog-card-info">
        <div class="catalog-card-title">${track.title}</div>
        <div class="catalog-card-artist">${track.artist}</div>
        <span class="catalog-card-genre">${track.genre}</span>
      </div>`;
    card.addEventListener('click', () => playTrack(track, tracks));
    dom.catalogGrid.appendChild(card);
  });
}

/* ═══════════════════════════════════════════════════════════
   RENDER — GENRE FILTER
═══════════════════════════════════════════════════════════ */
function renderGenreFilter() {
  const existing = dom.genreFilter.querySelector('[data-genre=""]');
  state.genres.forEach(g => {
    const btn = document.createElement('button');
    btn.className = 'genre-btn';
    btn.dataset.genre = g;
    btn.textContent = g;
    btn.addEventListener('click', () => filterByGenre(g));
    dom.genreFilter.appendChild(btn);
  });
  existing?.addEventListener('click', () => filterByGenre(''));
}

function filterByGenre(genre) {
  state.filterGenre = genre;
  dom.genreFilter.querySelectorAll('.genre-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.genre === genre);
  });
  const filtered = genre
    ? state.tracks.filter(t => t.genre === genre)
    : state.tracks;
  renderCatalog(filtered);
}

/* ═══════════════════════════════════════════════════════════
   RENDER — PLAYLIST PAGE (сетка карточек)
═══════════════════════════════════════════════════════════ */
function renderPlaylist() {
  dom.playlistCont.innerHTML = '';

  if (!state.playlists.length) {
    dom.playlistCont.innerHTML = `
      <div class="playlist-empty">
        <svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        <p>Нет плейлистов.<br>Нажмите «Создать плейлист», чтобы добавить первый.</p>
      </div>`;
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'playlist-cards-grid';

  state.playlists.forEach(pl => {
    const tracks = pl.tracks || [];
    const card = document.createElement('div');
    card.className = 'playlist-card';
    card.dataset.id = pl.id;

    const coverHtml = pl.coverUrl
      ? `<img src="${pl.coverUrl}" alt="${pl.name}" />`
      : `<svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`;

    card.innerHTML = `
      <div class="playlist-card-cover">
        ${coverHtml}
        <div class="playlist-card-play-icon">
          <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
      </div>
      <div class="playlist-card-name">${pl.name}</div>
      <div class="playlist-card-count">${tracks.length} ${pluralTrack(tracks.length)}</div>`;

    card.addEventListener('click', () => openPlaylistDetail(pl.id));
    grid.appendChild(card);
  });

  dom.playlistCont.appendChild(grid);
}

/* ═══════════════════════════════════════════════════════════
   PLAYLIST DETAIL
═══════════════════════════════════════════════════════════ */
function openPlaylistDetail(playlistId) {
  const pl = state.playlists.find(p => p.id === playlistId);
  if (!pl) return;

  state.activePlaylistId = playlistId;
  const tracks = pl.tracks || [];

  // Обложка
  if (pl.coverUrl) {
    dom.playlistDetailCoverImg.src = pl.coverUrl;
    dom.playlistDetailCoverImg.classList.remove('hidden');
    dom.playlistDetailCoverWrap.querySelector('.playlist-detail-cover-icon')?.remove();
  } else {
    dom.playlistDetailCoverImg.classList.add('hidden');
    if (!dom.playlistDetailCoverWrap.querySelector('.playlist-detail-cover-icon')) {
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('viewBox', '0 0 24 24');
      icon.setAttribute('class', 'playlist-detail-cover-icon');
      icon.innerHTML = '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>';
      dom.playlistDetailCoverWrap.appendChild(icon);
    }
  }

  // Мета
  dom.playlistDetailTitle.textContent = pl.name;
  dom.playlistDetailCount.textContent = `${tracks.length} ${pluralTrack(tracks.length)}`;

  // Треки
  dom.playlistDetailTracks.innerHTML = '';
  if (tracks.length === 0) {
    dom.playlistDetailTracks.innerHTML = `<p class="playlist-detail-empty">Нет треков. Добавьте их через значок <strong>+</strong> в каталоге.</p>`;
  } else {
    const list = document.createElement('div');
    list.className = 'track-list';
    tracks.forEach((track, i) => {
      list.appendChild(createTrackItem(track, i + 1, state.currentTrack?.id === track.id, false, playlistId));
    });
    dom.playlistDetailTracks.appendChild(list);
  }

  // Кнопка «Слушать»
  dom.playlistDetailPlayBtn.onclick = () => {
    if (tracks.length) playTrack(tracks[0], tracks);
  };

  navigateTo('playlist-detail');
}

function refreshPlaylistDetail() {
  if (state.currentPage === 'playlist-detail' && state.activePlaylistId != null) {
    openPlaylistDetail(state.activePlaylistId);
  }
}

function pluralTrack(n) {
  if (n % 10 === 1 && n % 100 !== 11) return 'трек';
  if ([2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100)) return 'трека';
  return 'треков';
}

/* ═══════════════════════════════════════════════════════════
   CREATE TRACK ITEM (general)
═══════════════════════════════════════════════════════════ */
function createTrackItem(track, num, isActive, showAdd = true, playlistId = null) {
  const item = document.createElement('div');
  item.className = `track-item${isActive ? ' active' : ''}`;
  item.dataset.id = track.id;

  const inPlaylist = isInAnyPlaylist(track.id);
  const addedClass = inPlaylist ? ' added' : '';

  const eqBars = isActive && state.isPlaying
    ? `<div class="eq-bars"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div>`
    : `<span class="track-num">${num}</span>`;

  item.innerHTML = `
    ${eqBars}
    <div class="track-thumb"><img src="${track.cover}" alt="${track.title}" loading="lazy" /></div>
    <div class="track-meta">
      <div class="track-name">${track.title}</div>
      <div class="track-artist">${track.artist}</div>
    </div>
    <span class="track-duration">${formatTime(track.duration)}</span>
    ${showAdd ? `<button class="track-add-btn${addedClass}" data-track-id="${track.id}" title="Добавить в плейлист">+</button>` : ''}`;

  // Клик по строке — воспроизвести
  item.addEventListener('click', (e) => {
    if (e.target.closest('.track-add-btn')) return;
    playTrack(track, playlistId ? (state.playlists.find(p => p.id === playlistId)?.tracks || state.tracks) : state.queue);
  });

  // Клик по "+"
  const addBtn = item.querySelector('.track-add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openPlaylistModal(track);
    });
  }

  return item;
}

function isInAnyPlaylist(trackId) {
  return state.playlists.some(pl =>
    (pl.tracks || []).some(t => t.id === trackId) ||
    (pl.trackIds || []).includes(trackId)
  );
}

/* ═══════════════════════════════════════════════════════════
   LYRICS
═══════════════════════════════════════════════════════════ */
function openLyrics() {
  state.lyricsOpen = true;
  dom.lyricsPanel.classList.add('open');
  dom.lyricsBackdrop.classList.add('visible');
  dom.btnLyrics.classList.add('active');
}

function closeLyrics() {
  state.lyricsOpen = false;
  dom.lyricsPanel.classList.remove('open');
  dom.lyricsBackdrop.classList.remove('visible');
  dom.btnLyrics.classList.remove('active');
}

function toggleLyrics() {
  state.lyricsOpen ? closeLyrics() : openLyrics();
}

async function loadLyrics(track) {
  dom.lyricsCover.src             = track.cover;
  dom.lyricsTrackTitle.textContent  = track.title;
  dom.lyricsTrackArtist.textContent = track.artist;
  dom.lyricsBody.innerHTML = '<div class="lyrics-loading">загрузка текста...</div>';
  state.lyrics = [];
  state.currentLyricIndex = -1;

  try {
    const data = await api.get(`/api/tracks/${track.id}/lyrics`);
    state.lyrics = data.lyrics || [];
  } catch {
    // Fallback: берём из demo-данных если сервер недоступен
    const demo = getDemoTracks().find(t => t.id === track.id);
    state.lyrics = demo?.lyrics || [];
  }

  renderLyricsLines();
}

function renderLyricsLines() {
  if (!state.lyrics.length) {
    dom.lyricsBody.innerHTML = '<div class="lyrics-placeholder">Текст для этого трека недоступен</div>';
    return;
  }
  dom.lyricsBody.innerHTML = state.lyrics.map((line, i) => {
    const isInstrumental = line.text === '♪';
    return `<div class="lyrics-line${isInstrumental ? ' is-instrumental' : ''}" data-index="${i}" data-time="${line.time}">${line.text}</div>`;
  }).join('');

  dom.lyricsBody.querySelectorAll('.lyrics-line').forEach(el => {
    el.addEventListener('click', () => {
      if (dom.audio.duration) dom.audio.currentTime = parseFloat(el.dataset.time);
    });
  });
}

function syncLyrics(currentTime) {
  if (!state.lyrics.length) return;

  let activeIdx = -1;
  for (let i = 0; i < state.lyrics.length; i++) {
    if (state.lyrics[i].time <= currentTime) activeIdx = i;
    else break;
  }
  if (activeIdx === state.currentLyricIndex) return;
  state.currentLyricIndex = activeIdx;

  dom.lyricsBody.querySelectorAll('.lyrics-line').forEach((el, i) => {
    el.classList.toggle('active', i === activeIdx);
    el.classList.toggle('past',   i < activeIdx);
  });

  const activeLine = dom.lyricsBody.querySelector('.lyrics-line.active');
  if (activeLine) activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ═══════════════════════════════════════════════════════════
   PLAYER — воспроизведение
═══════════════════════════════════════════════════════════ */
function playTrack(track, queue = state.tracks) {
  state.currentTrack = track;
  state.queue = queue;
  state.currentIndex = queue.findIndex(t => t.id === track.id);

  // Audio source
  dom.audio.src = `/api/stream/${track.id}`;
  dom.audio.load();
  dom.audio.play()
    .then(() => setPlaying(true))
    .catch(() => setPlaying(false));

  updatePlayerUI(track);
  updateVinyl(true);
  refreshAllTrackLists();
  loadLyrics(track);
}

function setPlaying(playing) {
  state.isPlaying = playing;
  dom.playIcon.classList.toggle('hidden', playing);
  dom.pauseIcon.classList.toggle('hidden', !playing);
  dom.vinylDisc.classList.toggle('spinning', playing);
  dom.vinylNeedle.classList.toggle('playing', playing);
  dom.trackCoverDyn.classList.toggle('playing', playing);
}

function updatePlayerUI(track) {
  dom.playerCoverImg.src = track.cover;
  dom.playerTitle.textContent = track.title;
  dom.playerArtist.textContent = track.artist;
  dom.npTitle.textContent = track.title;
  dom.npArtist.textContent = track.artist;
  dom.npGenre.textContent = track.genre || 'Rock Zone';
  dom.trackCoverImg.src = track.cover;
  dom.timeTotal.textContent = formatTime(track.duration);
}

function updateVinyl(hasTrack) {
  const placeholder = dom.trackCoverDyn.querySelector('.cover-placeholder-text');
  if (placeholder) placeholder.style.display = hasTrack ? 'none' : '';
}

function refreshAllTrackLists() {
  renderHomeTrackList(state.tracks);
  renderCatalog(state.filterGenre
    ? state.tracks.filter(t => t.genre === state.filterGenre)
    : state.tracks);
  renderPlaylist();
  refreshPlaylistDetail();
}

/* ═══════════════════════════════════════════════════════════
   PLAYLIST MODAL
═══════════════════════════════════════════════════════════ */
let _pendingTrack = null;

function openPlaylistModal(track) {
  _pendingTrack = track;
  dom.modalTrackName.textContent = `${track.title} — ${track.artist}`;
  renderModalPlaylists();
  dom.playlistModal.classList.remove('hidden');
}

function closePlaylistModal() {
  dom.playlistModal.classList.add('hidden');
  _pendingTrack = null;
}

function renderModalPlaylists() {
  dom.modalPlList.innerHTML = '';
  state.playlists.forEach(pl => {
    const li = document.createElement('li');
    li.className = 'modal-pl-item';
    li.innerHTML = `
      <svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/></svg>
      <span>${pl.name} (${(pl.tracks || []).length})</span>`;
    li.addEventListener('click', () => addToPlaylist(pl.id));
    dom.modalPlList.appendChild(li);
  });
}

async function addToPlaylist(playlistId) {
  if (!_pendingTrack) return;
  const trackId = _pendingTrack.id;

  try {
    const updated = await api.post(`/api/playlists/${playlistId}/tracks`, { trackId });
    const idx = state.playlists.findIndex(p => p.id === playlistId);
    if (idx !== -1) state.playlists[idx] = updated;
  } catch {
    // Оффлайн режим — обновляем state напрямую
    const pl = state.playlists.find(p => p.id === playlistId);
    if (pl) {
      if (!pl.tracks) pl.tracks = [];
      if (!pl.tracks.find(t => t.id === trackId)) {
        pl.tracks.push(_pendingTrack);
      }
    }
  }

  toast(`Добавлено в "${state.playlists.find(p => p.id === playlistId)?.name}"`);
  renderPlaylist();
  closePlaylistModal();
  refreshAllTrackLists();
}

async function createNewPlaylist() {
  // вызывается из модалки "добавить в плейлист" → открываем модал создания
  closePlaylistModal();
  openCreatePlaylistModal();
}

/* ═══════════════════════════════════════════════════════════
   CREATE PLAYLIST MODAL
═══════════════════════════════════════════════════════════ */
let _createPlCoverDataUrl = null;

function openCreatePlaylistModal() {
  _createPlCoverDataUrl = null;
  dom.createPlNameInput.value = '';
  dom.createPlCoverPreview.classList.add('hidden');
  dom.createPlCoverPreview.src = '';
  dom.createPlCoverPlaceholder.style.display = '';
  dom.createPlModal.classList.remove('hidden');
  setTimeout(() => dom.createPlNameInput.focus(), 60);
}

function closeCreatePlaylistModal() {
  dom.createPlModal.classList.add('hidden');
  _createPlCoverDataUrl = null;
}

function setupCreatePlaylistModal() {
  dom.createPlaylistBtn.addEventListener('click', openCreatePlaylistModal);

  dom.createPlCloseBtn.addEventListener('click', closeCreatePlaylistModal);

  dom.createPlModal.addEventListener('click', (e) => {
    if (e.target === dom.createPlModal) closeCreatePlaylistModal();
  });

  dom.createPlCoverInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      _createPlCoverDataUrl = ev.target.result;
      dom.createPlCoverPreview.src = _createPlCoverDataUrl;
      dom.createPlCoverPreview.classList.remove('hidden');
      dom.createPlCoverPlaceholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  });

  dom.createPlSubmitBtn.addEventListener('click', submitCreatePlaylist);

  dom.createPlNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitCreatePlaylist();
  });
}

async function submitCreatePlaylist() {
  const name = dom.createPlNameInput.value.trim();
  if (!name) {
    dom.createPlNameInput.focus();
    dom.createPlNameInput.style.borderColor = 'var(--red-glow)';
    setTimeout(() => dom.createPlNameInput.style.borderColor = '', 1200);
    return;
  }

  const newPl = { id: Date.now(), name, tracks: [], coverUrl: _createPlCoverDataUrl || null };

  try {
    const pl = await api.post('/api/playlists', { name });
    newPl.id = pl.id;
    state.playlists.push({ ...newPl, ...pl });
  } catch {
    state.playlists.push(newPl);
  }

  renderPlaylist();
  renderModalPlaylists();
  toast(`Плейлист «${name}» создан`);
  closeCreatePlaylistModal();
}

/* ═══════════════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════════════ */
function navigateTo(page) {
  state.currentPage = page;

  // Страница деталей плейлиста не имеет nav-кнопки, подсвечиваем «Плейлист»
  const navPage = page === 'playlist-detail' ? 'playlist' : page;

  dom.pages.forEach(p => p.classList.toggle('active', p.id === `page-${page}`));
  dom.navItems.forEach(n => n.classList.toggle('active', n.dataset.page === navPage));

  if (page === 'search') {
    setTimeout(() => dom.searchInput.focus(), 60);
  }
}

/* ═══════════════════════════════════════════════════════════
   SEARCH
═══════════════════════════════════════════════════════════ */
function handleSearch(query) {
  const q = query.toLowerCase().trim();
  dom.searchResults.innerHTML = '';

  if (!q) {
    dom.searchResults.innerHTML = `<p class="search-hint">Начните вводить запрос...</p>`;
    return;
  }

  const results = state.tracks.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.artist.toLowerCase().includes(q) ||
    t.genre.toLowerCase().includes(q) ||
    t.album.toLowerCase().includes(q)
  );

  if (!results.length) {
    dom.searchResults.innerHTML = `<p class="search-hint">Ничего не найдено по запросу «${query}»</p>`;
    return;
  }

  const list = document.createElement('div');
  list.className = 'track-list';
  results.forEach((t, i) => list.appendChild(createTrackItem(t, i + 1, state.currentTrack?.id === t.id, true)));
  dom.searchResults.appendChild(list);
}

/* ═══════════════════════════════════════════════════════════
   AUDIO EVENTS
═══════════════════════════════════════════════════════════ */
function setupAudioEvents() {
  dom.audio.addEventListener('timeupdate', () => {
    if (!dom.audio.duration) return;
    const pct = (dom.audio.currentTime / dom.audio.duration) * 100;
    dom.progressFill.style.width = pct + '%';
    dom.progressThumb.style.left = pct + '%';
    dom.timeCurrent.textContent = formatTime(dom.audio.currentTime);
    syncLyrics(dom.audio.currentTime);
  });

  dom.audio.addEventListener('loadedmetadata', () => {
    dom.timeTotal.textContent = formatTime(dom.audio.duration);
  });

  dom.audio.addEventListener('ended', () => {
    if (state.isRepeat) {
      dom.audio.currentTime = 0;
      dom.audio.play();
    } else {
      playNext();
    }
  });

  dom.audio.addEventListener('play',  () => setPlaying(true));
  dom.audio.addEventListener('pause', () => setPlaying(false));
  dom.audio.addEventListener('error', () => {
    // Трек не загрузился (нет MP3-файла) — просто останавливаем анимацию
    setPlaying(false);
    toast('⚠ Аудиофайл не найден. Добавьте MP3 в public/audio/');
  });
}

/* ═══════════════════════════════════════════════════════════
   CONTROLS
═══════════════════════════════════════════════════════════ */
function playNext() {
  if (!state.queue.length) return;
  let nextIdx;
  if (state.isShuffle) {
    nextIdx = Math.floor(Math.random() * state.queue.length);
  } else {
    nextIdx = (state.currentIndex + 1) % state.queue.length;
  }
  playTrack(state.queue[nextIdx], state.queue);
}

function playPrev() {
  if (!state.queue.length) return;
  if (dom.audio.currentTime > 3) {
    dom.audio.currentTime = 0;
    return;
  }
  const prevIdx = (state.currentIndex - 1 + state.queue.length) % state.queue.length;
  playTrack(state.queue[prevIdx], state.queue);
}

/* ═══════════════════════════════════════════════════════════
   PROGRESS BAR — click & drag
═══════════════════════════════════════════════════════════ */
function setupProgressBar() {
  let dragging = false;

  function seek(e) {
    const rect = dom.progressBar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (dom.audio.duration) {
      dom.audio.currentTime = pct * dom.audio.duration;
    }
  }

  dom.progressBar.addEventListener('mousedown', (e) => { dragging = true; seek(e); });
  document.addEventListener('mousemove', (e) => { if (dragging) seek(e); });
  document.addEventListener('mouseup', () => { dragging = false; });
  dom.progressBar.addEventListener('touchstart', (e) => seek(e.touches[0]), { passive: true });
}

/* ═══════════════════════════════════════════════════════════
   VOLUME BAR
═══════════════════════════════════════════════════════════ */
function setupVolumeBar() {
  let dragging = false;

  function setVol(e) {
    const rect = dom.volumeBar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    state.volume = pct;
    dom.audio.volume = pct;
    dom.volumeFill.style.width = (pct * 100) + '%';
  }

  dom.volumeBar.addEventListener('mousedown', (e) => { dragging = true; setVol(e); });
  document.addEventListener('mousemove', (e) => { if (dragging) setVol(e); });
  document.addEventListener('mouseup', () => { dragging = false; });
}

/* ═══════════════════════════════════════════════════════════
   EVENT LISTENERS
═══════════════════════════════════════════════════════════ */
function setupEventListeners() {
  // Navigation
  dom.navItems.forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.page));
  });

  // Play / Pause
  dom.btnPlay.addEventListener('click', () => {
    if (!state.currentTrack) {
      if (state.tracks.length) playTrack(state.tracks[0]);
      return;
    }
    if (state.isPlaying) {
      dom.audio.pause();
    } else {
      dom.audio.play().catch(() => {});
    }
  });

  dom.btnNext.addEventListener('click', playNext);
  dom.btnPrev.addEventListener('click', playPrev);

  dom.btnShuffle.addEventListener('click', () => {
    state.isShuffle = !state.isShuffle;
    dom.btnShuffle.classList.toggle('active', state.isShuffle);
  });

  dom.btnRepeat.addEventListener('click', () => {
    state.isRepeat = !state.isRepeat;
    dom.btnRepeat.classList.toggle('active', state.isRepeat);
  });

  dom.btnVolume.addEventListener('click', () => {
    dom.audio.muted = !dom.audio.muted;
    dom.btnVolume.classList.toggle('active', dom.audio.muted);
    dom.volumeFill.style.width = dom.audio.muted ? '0%' : (state.volume * 100) + '%';
  });

  // Modal
  dom.modalClose.addEventListener('click', closePlaylistModal);
  dom.playlistModal.addEventListener('click', (e) => {
    if (e.target === dom.playlistModal) closePlaylistModal();
  });
  dom.modalNewBtn.addEventListener('click', createNewPlaylist);

  // Playlist back button
  dom.playlistBackBtn.addEventListener('click', () => {
    state.activePlaylistId = null;
    navigateTo('playlist');
  });

  // Search
  dom.searchInput.addEventListener('input', (e) => handleSearch(e.target.value));

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space')      { e.preventDefault(); dom.btnPlay.click(); }
    if (e.code === 'ArrowRight') { e.preventDefault(); playNext(); }
    if (e.code === 'ArrowLeft')  { e.preventDefault(); playPrev(); }
    if (e.code === 'KeyL')       { e.preventDefault(); toggleLyrics(); }
  });

  // Lyrics
  dom.btnLyrics.addEventListener('click', toggleLyrics);
  dom.lyricsCloseBtn.addEventListener('click', closeLyrics);
  dom.lyricsBackdrop.addEventListener('click', closeLyrics);

  setupAudioEvents();
  setupProgressBar();
  setupVolumeBar();
  setupCreatePlaylistModal();
}

/* ═══════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════ */
function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  dom.toastContainer.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

/* ═══════════════════════════════════════════════════════════
   UTILS
═══════════════════════════════════════════════════════════ */
function formatTime(sec) {
  const s = Math.floor(sec || 0);
  const m = Math.floor(s / 60);
  const ss = String(s % 60).padStart(2, '0');
  return `${m}:${ss}`;
}

/* ═══════════════════════════════════════════════════════════
   BOOT
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', init);
