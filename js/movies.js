renderHeader('movies');
renderFooter();

let allMovies = [];

function posterHTML(url, title){
  return `<div class="poster">
      <span class="poster-fallback">${esc(title || 'STREAMFLIX')}</span>
      ${url ? `<img src="${esc(url)}" alt="" onerror="this.remove()">` : ''}
    </div>`;
}

function movieCardHTML(m){
  return `<a class="mcard" href="movie.html?id=${m.id}" aria-label="View ${esc(m.title)}">
    ${posterHTML(m.thumbnailUrl, m.title)}
    ${m.rating != null ? `<div class="stamp">${Number(m.rating).toFixed(1)} ${esc(m.requiredPlan)}</div>` : ''}
    <div class="mcard-info">
      <h3>${esc(m.title)}</h3>
      <p>${esc(m.genre || '')} ${m.releaseYear ? '· ' + m.releaseYear : ''}</p>
    </div>
  </a>`;
}

function renderHero(movie){
  const el = document.getElementById('hero');
  if (!movie){ el.innerHTML = ''; return; }
  el.innerHTML = `
    <div class="hero">
      ${movie.bannerUrl ? `<img class="hero-bg" src="${esc(movie.bannerUrl)}" alt="" onerror="this.remove()">` : ''}
      <div class="hero-fade"></div>
      <div class="hero-content">
        <span class="hero-eyebrow">Featured · ${esc(movie.requiredPlan || 'FREE')}</span>
        <h1 class="hero-title display">${esc(movie.title)}</h1>
        <div class="hero-meta">${esc(movie.genre||'')} ${movie.releaseYear ? '· '+movie.releaseYear:''} ${movie.language ? '· '+esc(movie.language):''} ${movie.duration ? '· '+movie.duration+' min':''}</div>
        <div class="hero-desc">${esc(movie.description || '')}</div>
        <div class="hero-actions">
          <a class="btn btn-gold" href="movie.html?id=${movie.id}">View details</a>
        </div>
      </div>
    </div>`;
}

function renderGrid(movies){
  const grid = document.getElementById('movieGrid');
  document.getElementById('resultCount').textContent = `${movies.length} title${movies.length===1?'':'s'}`;
  grid.innerHTML = movies.length
    ? `<div class="grid">${movies.slice().reverse().map(movieCardHTML).join('')}</div>`
    : `<div class="empty">No movies found. Try clearing filters, or add one from the Admin Panel.</div>`;
}

function populateGenreOptions(movies){
  const sel = document.getElementById('genreFilter');
  const current = sel.value;
  const genres = [...new Set(movies.map(m => m.genre).filter(Boolean))];
  sel.innerHTML = `<option value="">All genres</option>` + genres.map(g => `<option value="${esc(g)}">${esc(g)}</option>`).join('');
  sel.value = current;
}

async function loadAllMovies(){
  document.getElementById('movieGrid').innerHTML = `<div class="empty">Loading titles…</div>`;
  try{
    allMovies = await apiRequest('/movies') || [];
    populateGenreOptions(allMovies);
    renderHero(allMovies[Math.floor(Math.random() * allMovies.length)]);
    renderGrid(allMovies);
  }catch(err){
    showApiError(err);
    document.getElementById('movieGrid').innerHTML = `<div class="error-banner">Could not load movies. Check the API base URL above.</div>`;
  }
}

async function runSearch(){
  const title = document.getElementById('searchInput').value.trim();
  if (!title) return loadAllMovies();
  try{
    const m = await apiRequest(`/movies/title/${encodeURIComponent(title)}`);
    renderGrid(m ? [m] : []);
    renderHero(m || null);
  }catch(err){
    renderGrid([]);
    showToast('No movie found with that title.', true);
  }
}

async function applyGenre(genre){
  if (!genre) return loadAllMovies();
  try{
    const list = await apiRequest(`/movies/genre/${encodeURIComponent(genre)}`) || [];
    renderGrid(list);
  }catch(err){ showApiError(err); renderGrid([]); }
}

async function applyPlan(plan){
  if (!plan) return loadAllMovies();
  try{
    const list = await apiRequest(`/movies/plan/${encodeURIComponent(plan)}`) || [];
    renderGrid(list);
  }catch(err){ showApiError(err); renderGrid([]); }
}

document.getElementById('searchForm').addEventListener('submit', (e) => { e.preventDefault(); runSearch(); });
document.getElementById('genreFilter').addEventListener('change', (e) => {
  document.getElementById('planFilter').value = '';
  applyGenre(e.target.value);
});
document.getElementById('planFilter').addEventListener('change', (e) => {
  document.getElementById('genreFilter').value = '';
  applyPlan(e.target.value);
});
document.getElementById('clearFiltersBtn').addEventListener('click', () => {
  document.getElementById('searchInput').value = '';
  document.getElementById('genreFilter').value = '';
  document.getElementById('planFilter').value = '';
  loadAllMovies();
});

loadAllMovies();
