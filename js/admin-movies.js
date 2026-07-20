requireAdmin();
renderAdminHeader('movies');
document.getElementById('site-footer').innerHTML = `StreamFlix Admin &nbsp;·&nbsp; API base: <span class="mono">${esc(getApiBase())}</span>`;

const emptyMovie = {
  title:'', description:'', genre:'', director:'', hero:'', heroine:'',
  releaseYear:2024, rating:0, language:'', duration:0, thumbnailUrl:'', bannerUrl:'',
  trailerUrl:'', videoUrl:'', requiredPlan:'FREE'
};

let movies = [];
let editing = null; // { data, isNew }

async function loadMovies(){
  const wrap = document.getElementById('movieTableWrap');
  wrap.innerHTML = `<div class="empty">Loading movies…</div>`;
  try{
    movies = await apiRequest('/movies') || [];
    document.getElementById('movieCount').textContent = `${movies.length} movie${movies.length===1?'':'s'}`;
    renderTable();
  }catch(err){
    showApiError(err);
    wrap.innerHTML = `<div class="error-banner">Could not load movies. Check the API base URL from the Admin landing page.</div>`;
  }
}

function renderTable(){
  const wrap = document.getElementById('movieTableWrap');
  wrap.innerHTML = `<div class="table-wrap"><table>
    <thead><tr><th>ID</th><th>Title</th><th>Genre</th><th>Plan</th><th>Rating</th><th>Year</th><th></th></tr></thead>
    <tbody>
      ${movies.map(m => `<tr>
        <td class="mono">${m.id}</td><td>${esc(m.title)}</td><td>${esc(m.genre||'')}</td>
        <td><span class="badge">${esc(m.requiredPlan||'FREE')}</span></td><td>${m.rating ?? ''}</td><td>${m.releaseYear ?? ''}</td>
        <td><div class="row-actions">
          <button class="btn btn-sm" data-edit="${m.id}">Edit</button>
          <button class="btn btn-danger btn-sm" data-delete="${m.id}">Delete</button>
        </div></td>
      </tr>`).join('') || `<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:24px;">No movies yet.</td></tr>`}
    </tbody>
  </table></div>`;

  wrap.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => openForm(movies.find(m => m.id == btn.dataset.edit), false));
  });
  wrap.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => deleteMovie(btn.dataset.delete));
  });
}

async function deleteMovie(id){
  if (!confirm('Delete this movie? This cannot be undone.')) return;
  try{
    await apiRequest(`/movies/${id}`, { method:'DELETE' });
    showToast('Movie deleted.');
    loadMovies();
  }catch(err){ showApiError(err); }
}

function fieldRow(key, label, type, value){
  return `<div class="field"><label>${label}</label>
    <input type="${type}" data-field="${key}" value="${esc(value ?? '')}" ${type==='number' ? 'step="any"' : ''}/>
  </div>`;
}

function openForm(data, isNew){
  editing = { data: data ? {...data} : {...emptyMovie}, isNew };
  const mount = document.getElementById('formMount');
  const d = editing.data;
  mount.innerHTML = `
    <div class="overlay" id="formOverlay">
      <div class="modal">
        <button class="modal-close" id="closeFormBtn">✕</button>
        <div class="modal-body">
          <h2 class="display" style="font-size:26px;">${isNew ? 'Add movie' : 'Edit movie'}</h2>
          <form id="movieForm">
            <div class="form-grid">
              ${fieldRow('title','Title','text', d.title)}
              ${fieldRow('genre','Genre','text', d.genre)}
              ${fieldRow('director','Director','text', d.director)}
              ${fieldRow('hero','Hero','text', d.hero)}
              ${fieldRow('heroine','Heroine','text', d.heroine)}
              ${fieldRow('language','Language','text', d.language)}
              ${fieldRow('releaseYear','Release year','number', d.releaseYear)}
              ${fieldRow('duration','Duration (min)','number', d.duration)}
              ${fieldRow('rating','Rating','number', d.rating)}
              ${fieldRow('thumbnailUrl','Thumbnail URL','text', d.thumbnailUrl)}
              ${fieldRow('bannerUrl','Banner URL','text', d.bannerUrl)}
              ${fieldRow('trailerUrl','Trailer URL','text', d.trailerUrl)}
              ${fieldRow('videoUrl','Video URL','text', d.videoUrl)}
              <div class="field"><label>Required plan</label>
                <select data-field="requiredPlan">
                  ${['FREE','BASIC','STANDARD','PREMIUM'].map(p => `<option value="${p}" ${d.requiredPlan===p?'selected':''}>${p}</option>`).join('')}
                </select>
              </div>
              <div class="field" style="grid-column:1/-1;"><label>Description</label>
                <textarea data-field="description">${esc(d.description||'')}</textarea>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-gold">${isNew ? 'Create' : 'Save changes'}</button>
              <button type="button" class="btn btn-ghost" id="cancelFormBtn">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  document.getElementById('closeFormBtn').addEventListener('click', closeForm);
  document.getElementById('cancelFormBtn').addEventListener('click', closeForm);
  document.getElementById('formOverlay').addEventListener('click', (e) => { if (e.target.id === 'formOverlay') closeForm(); });
  document.getElementById('movieForm').addEventListener('submit', submitForm);
}

function closeForm(){
  document.getElementById('formMount').innerHTML = '';
  editing = null;
}

async function submitForm(e){
  e.preventDefault();
  const form = e.target;
  form.querySelectorAll('[data-field]').forEach(input => {
    editing.data[input.dataset.field] = input.value;
  });
  const payload = {
    ...editing.data,
    releaseYear: Number(editing.data.releaseYear),
    rating: Number(editing.data.rating),
    duration: Number(editing.data.duration)
  };
  try{
    if (editing.isNew){
      await apiRequest('/movies', { method:'POST', body: JSON.stringify(payload) });
      showToast('Movie added.');
    } else {
      await apiRequest(`/movies/${payload.id}`, { method:'PUT', body: JSON.stringify(payload) });
      showToast('Movie updated.');
    }
    closeForm();
    loadMovies();
  }catch(err){ showApiError(err); }
}

document.getElementById('addMovieBtn').addEventListener('click', () => openForm(null, true));

loadMovies();
