// Homepage "ROIN takes those jobs off your plate": shows one job at a time.
// Moves to the next job every 7 seconds; clicking a tab jumps to it and
// hovering pauses. With reduced motion turned on, it never rotates by itself.
(function () {
  var root = document.querySelector('[data-jobs]');
  if (!root) return;
  var DUR = 7000;
  var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
  var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var active = 0, paused = false, timer;

  function addBar() {
    var old = root.querySelector('.job-bar');
    if (old) old.remove();
    var bar = document.createElement('i');
    bar.className = 'job-bar';
    bar.setAttribute('aria-hidden', 'true');
    tabs[active].appendChild(bar);
  }

  function start() {
    clearTimeout(timer);
    if (paused || reduce.matches) return;
    timer = setTimeout(function () { show((active + 1) % tabs.length); }, DUR);
  }

  function show(i) {
    active = i;
    tabs.forEach(function (t, j) {
      var on = j === i;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      // Hiding and re-showing a panel restarts its screen animation.
      panels[j].hidden = !on;
    });
    addBar();
    start();
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { show(i); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var n = (active + d + tabs.length) % tabs.length;
      show(n);
      tabs[n].focus();
    });
  });

  root.addEventListener('mouseenter', function () {
    paused = true;
    clearTimeout(timer);
    root.classList.add('is-paused');
  });
  root.addEventListener('mouseleave', function () {
    paused = false;
    root.classList.remove('is-paused');
    addBar();
    start();
  });

  show(0);
})();
