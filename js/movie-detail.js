renderHeader('movies');
renderFooter();

const movieId = qs('id');
const content = document.getElementById('movieContent');

async function loadMovie(){
  if (!movieId){
    content.innerHTML = `<div class="error-banner">No movie id given. Go back to Browse and pick a title.</div>`;
    return;
  }
  content.innerHTML = `<div class="empty" style="margin-top:24px;">Loading…</div>`;
  try{
    const m = await apiRequest(`/movies/${encodeURIComponent(movieId)}`);
    renderMovie(m);
  }catch(err){
    showApiError(err);
    content.innerHTML = `<div class="error-banner">Could not load this movie. It may have been deleted, or the API base URL is wrong.</div>`;
  }
}

function renderMovie(m){
  const user = getSession();
  const canWatch = userCanWatch(m, user);

  content.innerHTML = `
    <div class="detail-banner">${m.bannerUrl ? `<img src="${esc(m.bannerUrl)}" onerror="this.remove()">` : ''}</div>
    <div class="detail-body">
      <h1 class="display" style="font-size:40px; margin:0 0 6px;">${esc(m.title)}</h1>
      <div class="modal-meta">${esc(m.genre||'')} ${m.releaseYear?'· '+m.releaseYear:''} ${m.language?'· '+esc(m.language):''} ${m.duration?'· '+m.duration+' min':''} ${m.rating!=null?'· ★ '+m.rating:''}</div>
      <div class="modal-desc">${esc(m.description || 'No description provided.')}</div>
      <div class="kv-grid">
        <div class="kv"><span>Director</span>${esc(m.director || '—')}</div>
        <div class="kv"><span>Lead cast</span>${esc(m.hero || '—')}${m.heroine ? ', ' + esc(m.heroine) : ''}</div>
        <div class="kv"><span>Required plan</span>${esc(m.requiredPlan || 'FREE')}</div>
        <div class="kv"><span>Trailer</span>${m.trailerUrl ? `<a href="${esc(m.trailerUrl)}" target="_blank" rel="noopener">Watch trailer ↗</a>` : '—'}</div>
      </div>
      ${canWatch
        ? `<a class="btn btn-gold" href="${esc(m.videoUrl || '#')}" target="_blank" rel="noopener">▶ Watch now</a>`
        : `<div class="lock-msg">This title needs the ${esc(m.requiredPlan)} plan${user ? '' : ' — and an account'}.
             ${user ? `<a class="btn btn-gold btn-sm" style="margin-left:8px" href="plans.html">See plans</a>`
                    : `<a class="btn btn-gold btn-sm" style="margin-left:8px" href="login.html">Log in</a>`}
           </div>`
      }
    </div>
  `;
}

loadMovie();
