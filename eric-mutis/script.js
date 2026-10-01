// Populate marginalia from MARGINALIA object (defined in marginalia.js)
function populateMarginalia() {
  if (typeof MARGINALIA === 'undefined') return;
  document.querySelectorAll('aside.marginalia').forEach(aside => {
    const id = aside.id;
    if (MARGINALIA[id]) {
      aside.innerHTML = MARGINALIA[id];
    }
  });
}

// Populate analysis section from ANALYSIS string (defined in marginalia.js)
function populateAnalysis() {
  if (typeof ANALYSIS === 'undefined') return;
  const el = document.querySelector('.analysis');
  if (el) el.innerHTML = ANALYSIS;
}

// Find the nearest .ref span before an aside
function findRef(aside) {
  let el = aside.previousElementSibling;
  while (el) {
    const ref = el.querySelector('.ref');
    if (ref) return ref;
    el = el.previousElementSibling;
  }
  return null;
}

// Position marginalia on wide screens, add tick marks
function setup() {
  const wide = window.innerWidth >= 1300;
  const story = document.querySelector('.story-section');
  if (!story) return;
  const storyTop = story.offsetTop;

  // Clean up old ticks
  story.querySelectorAll('.tick').forEach(t => t.remove());

  const asides = story.querySelectorAll('aside.marginalia');
  let idx = 0;

  asides.forEach(aside => {
    const ref = findRef(aside);
    if (!ref) return;
    aside._ref = ref;

    if (wide) {
      aside.style.top = (ref.offsetTop - storyTop + 50) + 'px';

      const tick = document.createElement('div');
      tick.className = 'tick';
      const isRight = idx % 2 === 0;

      const refTop = ref.offsetTop - storyTop + ref.offsetHeight / 2 + 50;
      tick.style.top = refTop + 'px';

      if (isRight) {
        tick.style.left = 'calc(100% + 8px)';
      } else {
        tick.style.right = 'calc(100% + 8px)';
      }

      aside._tick = tick;
      story.appendChild(tick);
    } else {
      aside.style.top = '';
    }

    idx++;
  });
}

// Hover on aside: highlight ref + tick
document.addEventListener('mouseover', e => {
  const aside = e.target.closest('aside.marginalia');
  if (aside && aside._ref) {
    aside._ref.classList.add('highlight');
    if (aside._tick) aside._tick.classList.add('active');
  }
});
document.addEventListener('mouseout', e => {
  const aside = e.target.closest('aside.marginalia');
  if (aside && aside._ref) {
    aside._ref.classList.remove('highlight');
    if (aside._tick) aside._tick.classList.remove('active');
  }
});

// Hover on ref: highlight aside + tick
document.addEventListener('mouseover', e => {
  const ref = e.target.closest('.ref');
  if (!ref) return;
  ref.classList.add('highlight');
  document.querySelectorAll('aside.marginalia').forEach(aside => {
    if (aside._ref === ref) {
      aside.style.color = 'var(--text)';
      if (aside._tick) aside._tick.classList.add('active');
    }
  });
});
document.addEventListener('mouseout', e => {
  const ref = e.target.closest('.ref');
  if (!ref) return;
  ref.classList.remove('highlight');
  document.querySelectorAll('aside.marginalia').forEach(aside => {
    if (aside._ref === ref) {
      aside.style.color = '';
      if (aside._tick) aside._tick.classList.remove('active');
    }
  });
});

window.addEventListener('load', () => {
  populateMarginalia();
  populateAnalysis();
  setup();
});
window.addEventListener('resize', setup);
