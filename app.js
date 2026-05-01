/* ============================================================
   ELDRITCH HUNT — Compendio della Campagna
   Single-page navigation + markdown rendering for each section.
   ============================================================ */

const SECTIONS = {
  razze: {
    title: 'Razze',
    file:  'content/Razze.md',
  },
  sottoclassi: {
    title: 'Sottoclassi',
    file:  'content/Sottoclassi.md',
  },
  backgrounds: {
    title: 'Backgrounds',
    file:  'content/Backgrounds.md',
  },
  missioni: {
    title: 'Missioni Personali',
    file:  'content/Missioni.md',
  },
  regole: {
    title: 'Regole Aggiuntive',
    file:  'content/Regole.md',
  },
};

const cache = Object.create(null);

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* -----------------------------------------------------------
   ROUTER
   ----------------------------------------------------------- */
function handleRoute() {
  const hash = (window.location.hash || '#/menu').replace(/^#\/?/, '');
  const path = hash.split('?')[0].toLowerCase();

  if (!path || path === 'menu') {
    showMenu();
    return;
  }
  if (SECTIONS[path]) {
    showSection(path);
    return;
  }
  // Unknown route -> menu
  showMenu();
}

function showMenu() {
  $('#menu-view').classList.add('active');
  $('#section-view').classList.remove('active');
  document.title = 'Eldritch Hunt — Compendio della Campagna';
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

function showSection(key) {
  const section = SECTIONS[key];
  if (!section) {
    showMenu();
    return;
  }

  $('#menu-view').classList.remove('active');
  $('#section-view').classList.add('active');
  $('#section-title').textContent = section.title;
  document.title = `${section.title} — Eldritch Hunt`;

  const contentEl = $('#section-content');
  contentEl.innerHTML = '<div class="loading">Apertura del tomo&hellip;</div>';

  loadContent(section)
    .then(html => {
      contentEl.innerHTML = html;
      // Re-trigger animation
      contentEl.style.animation = 'none';
      // eslint-disable-next-line no-unused-expressions
      contentEl.offsetHeight;
      contentEl.style.animation = '';
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    })
    .catch(() => {
      contentEl.innerHTML = renderEmpty();
    });
}

/* -----------------------------------------------------------
   CONTENT LOADING
   ----------------------------------------------------------- */
async function loadContent(section) {
  if (cache[section.file] !== undefined) {
    return renderMarkdown(cache[section.file], section);
  }

  try {
    const res = await fetch(section.file, { cache: 'no-cache' });
    if (!res.ok) {
      cache[section.file] = '';
      return renderEmpty();
    }
    const text = await res.text();
    cache[section.file] = text;

    // Treat blank or comment-only files as empty
    const stripped = text.replace(/<!--[\s\S]*?-->/g, '').trim();
    if (stripped === '') return renderEmpty();

    return renderMarkdown(text, section);
  } catch (err) {
    console.warn('[EldritchHunt] Could not load', section.file, err);
    cache[section.file] = '';
    return renderEmpty();
  }
}

/* -----------------------------------------------------------
   RENDERING
   ----------------------------------------------------------- */
function renderMarkdown(md, section) {
  const stripped = md.replace(/<!--[\s\S]*?-->/g, '').trim();
  if (stripped === '') return renderEmpty();

  // If the document contains H2 headings (## ...), split each into a
  // collapsible card. Otherwise render as a single content block.
  if (/^##\s+/m.test(stripped)) {
    // Split BEFORE every "## " heading. The split keeps the heading
    // on the new chunk (positive look-ahead).
    const chunks = stripped
      .split(/(?=^##\s+)/m)
      .map(c => c.trim())
      .filter(c => c.length > 0);

    return chunks.map(renderEntry).join('');
  }

  return `<div class="rendered-content">${replaceImagePlaceholders(marked.parse(stripped))}</div>`;
}

function renderEntry(chunk) {
  // Strip a leading or trailing "---" divider if present
  let md = chunk
    .replace(/^---\s*$/m, '')
    .replace(/\n---\s*$/, '')
    .trim();

  const titleMatch = md.match(/^##\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : 'Senza Titolo';

  // Remove the heading line from the body — it lives in the summary
  const body = md.replace(/^##\s+.+$/m, '').trim();

  let html = marked.parse(body);
  html = replaceImagePlaceholders(html);

  return `
    <details class="race-card">
      <span class="race-corner tl" aria-hidden="true"></span>
      <span class="race-corner tr" aria-hidden="true"></span>
      <span class="race-corner bl" aria-hidden="true"></span>
      <span class="race-corner br" aria-hidden="true"></span>
      <summary>
        <span class="card-title">${escapeHtml(title)}</span>
        <span class="summary-icon" aria-hidden="true">&#x271A;</span>
      </summary>
      <div class="race-body">${html}</div>
    </details>
  `;
}

/**
 * Replace text-only IMAGE.PNG markers with a styled visual placeholder.
 * The user uses the literal token "IMAGE.PNG" inside the markdown to
 * indicate where an illustration will eventually go.
 */
function replaceImagePlaceholders(html) {
  return html.replace(
    /<p>\s*IMAGE\.PNG\s*<\/p>/gi,
    `<div class="image-placeholder" role="img" aria-label="Illustrazione (segnaposto)">
       <span class="ip-symbol">&#x269C;</span>
       <span class="ip-label">Illustrazione</span>
     </div>`
  );
}

function renderEmpty() {
  return `
    <div class="empty-section">
      <span class="empty-symbol" aria-hidden="true">&#x269C;</span>
      <h2 class="empty-title">Le Pagine Sono Ancora Vuote</h2>
      <p class="empty-text">
        I tomi di questa sezione non sono ancora stati vergati.
        Tornate piu tardi, viaggiatori&mdash; quando il Maestro avr&agrave;
        steso l&rsquo;inchiostro su nuove pergamene.
      </p>
    </div>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* -----------------------------------------------------------
   BOOT
   ----------------------------------------------------------- */
window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', () => {
  if (typeof marked !== 'undefined') {
    marked.setOptions({
      gfm: true,
      breaks: false,
      smartypants: false,
    });
  }
  handleRoute();
});
