/**
 * UNDANGAN PERNIKAHAN — Muhamad Abduloh & Iis Trisnawati
 * main.js
 */
(function () {
  'use strict';

  var cover       = document.getElementById('cover');
  var openBtn     = document.getElementById('openBtn');
  var mainContent = document.getElementById('mainContent');
  var musicBtn    = document.getElementById('musicBtn');
  var bgMusic     = document.getElementById('bgMusic');
  var guestForm   = document.getElementById('guestForm');
  var guestList   = document.getElementById('guestList');
  var tamuName    = document.getElementById('tamuName');
  var coverTamu   = document.getElementById('coverTamu');
  var heroBanner  = document.getElementById('heroBanner');
  var ucapanCount = document.getElementById('ucapanCount');
  var musicPlaying = false;

  /* URL PARAM ?to=NamaTamu */
  function getParam(key) {
    return new URLSearchParams(window.location.search).get(key) || '';
  }
  var guestNameParam = getParam('to');
  if (guestNameParam) {
    var decoded = decodeURIComponent(guestNameParam);
    if (coverTamu)  { coverTamu.textContent = 'Kepada Yth. ' + decoded; coverTamu.classList.add('visible'); }
    if (tamuName)   { tamuName.value = decoded; }
    if (heroBanner) { heroBanner.textContent = 'Assalamu\'alaikum, ' + decoded + ' 👋'; heroBanner.style.display = 'block'; }
  }

  /* BUKA UNDANGAN */
  openBtn.addEventListener('click', function () {
    cover.classList.add('hide');
    mainContent.style.display = 'block';
    musicBtn.style.display = 'flex';
    playMusic();
    makePetals();
    setTimeout(initReveal, 120);
  });

  /* MUSIK */
  musicBtn.addEventListener('click', toggleMusic);
  function playMusic() {
    bgMusic.play().then(function () {
      musicPlaying = true;
      musicBtn.classList.add('on');
      musicBtn.querySelector('i').className = 'fas fa-compact-disc';
    }).catch(function () { musicPlaying = false; });
  }
  function toggleMusic() {
    if (musicPlaying) {
      bgMusic.pause(); musicPlaying = false;
      musicBtn.classList.remove('on');
      musicBtn.querySelector('i').className = 'fas fa-volume-mute';
    } else { playMusic(); }
  }

  /* SCROLL REVEAL */
  function initReveal() {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('vis'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.rv').forEach(function (el) { obs.observe(el); });
  }

  /* COUNTDOWN */
  var wDate = new Date('2026-06-03T08:00:00+07:00').getTime();
  function tickCD() {
    var diff = Math.max(0, wDate - Date.now());
    var d = Math.floor(diff / 864e5), h = Math.floor(diff % 864e5 / 36e5),
        m = Math.floor(diff % 36e5 / 6e4), s = Math.floor(diff % 6e4 / 1e3);
    document.getElementById('cdD').textContent = d < 10 ? '0'+d : d;
    document.getElementById('cdH').textContent = h < 10 ? '0'+h : h;
    document.getElementById('cdM').textContent = m < 10 ? '0'+m : m;
    document.getElementById('cdS').textContent = s < 10 ? '0'+s : s;
  }
  tickCD(); setInterval(tickCD, 1000);

  /* PETALS */
  function makePetals() {
    if (window.innerWidth < 768) return;
    for (var i = 0; i < 10; i++) {
      var p = document.createElement('div');
      p.className = 'petal';
      var x = Math.random()*100, dur = 9+Math.random()*12, del = Math.random()*12, sz = 10+Math.random()*10;
      p.style.cssText = 'left:'+x+'%;top:-20px;animation:pfall '+dur+'s linear '+del+'s infinite;';
      p.innerHTML = '<svg viewBox="0 0 20 20" width="'+sz+'" height="'+sz+'"><path d="M10 0C10 0 14 6 14 10C14 14 10 20 10 20C10 20 6 14 6 10C6 6 10 0 10 0Z" fill="#C8956C"/></svg>';
      document.body.appendChild(p);
    }
  }

  /* GUESTBOOK */
  var STORAGE_KEY = 'wedding_guests_abduloh_iis';
  var defaultMsgs = [
    { name:'Keluarga Besar', attend:'hadir', msg:'Barakallahu lakuma wa baraka alaikuma wa jama\'a bainakuma fi khair. Semoga menjadi keluarga sakinah mawaddah warahmah.', time: new Date().toLocaleString('id-ID') },
    { name:'Sahabat Kampus', attend:'hadir', msg:'Selamat menempuh hidup baru! Semoga selalu diberkahi kebahagiaan dan dilimpahi kasih sayang. Aamiin.', time: new Date().toLocaleString('id-ID') }
  ];
  function getMsgs() {
    try { var s = localStorage.getItem(STORAGE_KEY); if (s) return JSON.parse(s); } catch(e){}
    return defaultMsgs.slice();
  }
  function saveMsgs(a) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(a)); } catch(e){} }
  function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
  function attendBadge(a) {
    if (a==='hadir') return '<span class="badge-hadir"><i class="fas fa-check-circle"></i> Hadir</span>';
    if (a==='tidak') return '<span class="badge-tidak"><i class="fas fa-times-circle"></i> Berhalangan</span>';
    if (a==='ragu')  return '<span class="badge-ragu"><i class="fas fa-question-circle"></i> Masih Ragu</span>';
    return '';
  }

  var currentFilter = 'semua';
  function renderMsgs() {
    var msgs = getMsgs();
    var filtered = currentFilter === 'semua' ? msgs : msgs.filter(function(m){ return m.attend === currentFilter; });
    if (ucapanCount) ucapanCount.textContent = msgs.length + ' ucapan';
    guestList.innerHTML = '';
    if (filtered.length === 0) {
      guestList.innerHTML = '<div class="empty-state"><i class="fas fa-comment-dots" style="font-size:2rem;margin-bottom:8px;opacity:.3;display:block"></i>Belum ada ucapan.</div>';
      return;
    }
    filtered.forEach(function(m) {
      var c = document.createElement('div');
      c.className = 'gc';
      c.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><p style="font-weight:600;font-size:14px;color:var(--ivory)">'+esc(m.name)+'</p><div>'+attendBadge(m.attend)+'</div></div><p style="font-size:14px;line-height:1.6;color:var(--cream)">'+esc(m.msg)+'</p><p style="font-size:10px;margin-top:8px;color:var(--muted)">'+esc(m.time)+'</p>';
      guestList.appendChild(c);
    });
  }

  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      currentFilter = btn.dataset.filter;
      document.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      renderMsgs();
    });
  });

  guestForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var n = document.getElementById('gName').value.trim();
    var a = document.getElementById('gAttend').value;
    var m = document.getElementById('gMsg').value.trim();
    if (!n || !m) return;
    var msgs = getMsgs();
    msgs.unshift({ name:n, attend:a, msg:m, time: new Date().toLocaleString('id-ID') });
    saveMsgs(msgs);
    renderMsgs();
    guestForm.reset();
    if (guestNameParam && tamuName) tamuName.value = decodeURIComponent(guestNameParam);
    showToast('Ucapan berhasil dikirim! 🎉');
  });

  renderMsgs();

  /* COPY */
  window.copyText = function(text, label) {
    navigator.clipboard.writeText(text).then(function() {
      showToast('Nomor '+label+' berhasil disalin! ✅');
    }).catch(function() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.cssText = 'position:fixed;opacity:0;';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); showToast('Nomor '+label+' berhasil disalin! ✅'); }
      catch(err) { showToast('Gagal menyalin.'); }
      document.body.removeChild(ta);
    });
  };

  /* TOAST */
  function showToast(msg) {
    var t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function(){ if (t.parentNode) t.parentNode.removeChild(t); }, 2800);
  }

})();
