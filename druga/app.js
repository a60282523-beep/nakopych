(function () {
'use strict';
// «Друга я» — зірочка-тамагочі. Накопич.
var qs = new URLSearchParams(location.search);
var DEMO = !!window.DY_DEMO || qs.get('demo') === '1';
var KEY = DEMO ? 'drugaya_demo' : 'drugaya1';
var API = qs.get('api') || window.DY_API || 'https://hometechua.com.ua/dy-api';
var STARPTS = '100.0,40.0 121.2,82.9 168.5,89.8 134.2,123.1 142.3,170.2 100.0,148.0 57.7,170.2 65.8,123.1 31.5,89.8 78.8,82.9';
var ICON_STAR = 'M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.6 7.1 18.2 8 12.7 4 8.8l5.5-.8z';

var CARE = [
  { id: 'sleep', label: 'Сон', hint: '7–8 годин', icon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z',
    say: ['Виспалась? Я аж засвітилась від радості!', 'Сон — найкращий крем для сяйва. Дякую!', 'Відпочила — і я відпочила разом з тобою.'] },
  { id: 'water', label: 'Вода', hint: '6 склянок', icon: 'M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11z',
    say: ['Ммм, свіжо! Водичка — і я вже блищу.', 'Дякую за воду! Без неї зірки тьмяніють.', 'Ковток води — і в мене нові промінчики.'] },
  { id: 'rest', label: 'Пауза', hint: '15 хв для себе', icon: 'M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 3v3M12 3v3',
    say: ['15 хвилин тиші — і світ знову добрий.', 'Пауза — це не лінь. Це підзарядка для нас обох.', 'Ти вміла зупинитись. Я тобою пишаюся!'] },
  { id: 'move', label: 'Рух', hint: 'прогулянка', icon: 'M3 12h4l3-7 4 14 3-7h4',
    say: ['Прогулянка! Я ніби політала разом з тобою.', 'Рух — і в мене аж іскорки посипались!', 'Тіло дякує, а я сяю.'] },
  { id: 'money', label: 'Гроші', hint: 'відклала хоч 20 грн', icon: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM12 7v10M15 9.5h-4a1.5 1.5 0 0 0 0 3h2a1.5 1.5 0 0 1 0 3H9',
    say: ['Відклала! Маленька сума — велика зірка.', 'Твоя скарбничка росте, а я — разом з нею.', 'Спочатку собі — правильно! Я горда.'] },
  { id: 'joy', label: 'Радість', hint: 'щось приємне', icon: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z',
    say: ['Радість! Ось чому я сьогодні така тепла.', 'Ти зробила собі приємне — і я усміхаюсь.', 'Більше таких моментів, будь ласка!'] }
];
var STAGES = [
  { need: 0, name: 'Іскорка', sub: 'перший крок', scale: 0.72 },
  { need: 7, name: 'Зірочка', sub: '7 днів турботи', scale: 0.84 },
  { need: 30, name: 'Яскрава зірка', sub: '30 днів турботи', scale: 0.96 },
  { need: 90, name: 'Сузірʼя', sub: '90 днів турботи', scale: 1.04 },
  { need: 180, name: 'Твоя галактика', sub: '180 днів турботи', scale: 1.1 }
];
var SHOP = [
  { id: 'cloud', name: 'Хмаринка-плед', price: 0 },
  { id: 'moon', name: 'Місяць-подушка', price: 60 },
  { id: 'comet', name: 'Комета-подружка', price: 120 },
  { id: 'cat', name: 'Кіт на місяці', price: 200 },
  { id: 'rainbow', name: 'Нічна веселка', price: 300 },
  { id: 'aurora', name: 'Північне сяйво', price: 450 },
  { id: 'crown', name: 'Корона зірки', price: 600 },
  { id: 'lights', name: 'Гірлянда-вогники', price: 800 }
];
var SAY = {
  morning: ['Доброго ранку, {n}! Почнемо день з турботи?', 'Ранок! Я ще трохи сонна. Водички?', 'Новий день — нові промінчики. Я з тобою.'],
  sad: ['Я трохи згасаю… Ти знову про себе забула. Подбай про себе — і я засвічуся.', '{n}, я сумую. Хоч ковток води — і мені стане легше.', 'Мені холодно під хмаринкою. Може, 15 хвилин для себе?'],
  ok: ['Мені вже краще! Ще трохи турботи — і я засяю на все небо.', 'Я світлішаю! Ти на правильному шляху, {n}.', 'Тепленько. Ще кілька кроків — і буде сяйво.'],
  happy: ['Я сяю! Бо сьогодні ти подбала про себе. Ти — моя зірка.', '{n}, ти неймовірна! Дивись, як я горю.', 'Ось воно — сяйво. Так виглядає турбота про себе.']
};
var NAMES_UA = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

// ---------- state ----------
function blank() { return { v: 1, act: null, setup: null, days: {}, owned: { cloud: 1 }, spent: 0, stage: 0, settings: { less: false }, tab: 'today', updated: 0 }; }
var S;
try { S = JSON.parse(localStorage.getItem(KEY)) || blank(); } catch (e) { S = blank(); }
S.owned = S.owned || { cloud: 1 }; S.settings = S.settings || { less: false };
var syncTimer = null, lastSay = null, jumpNext = false;
function save(noSync) {
  S.updated = Date.now();
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  if (!noSync) { clearTimeout(syncTimer); syncTimer = setTimeout(sync, 2500); }
}

// ---------- dates ----------
function pad(n) { return (n < 10 ? '0' : '') + n; }
function keyOf(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function todayKey() { var o = qs.get('today'); return o && /^\d{4}-\d{2}-\d{2}$/.test(o) ? o : keyOf(new Date()); }
function dateOf(k) { var p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
function addDays(k, n) { var d = dateOf(k); d.setDate(d.getDate() + n); return keyOf(d); }
function hour() { var h = qs.get('hour'); return h ? +h : new Date().getHours(); }
function day(k) { return S.days[k] || { done: [] }; }
function today() { var k = todayKey(); if (!S.days[k]) { S.days[k] = { done: [] }; } return S.days[k]; }
function cnt(k) { return (day(k).done || []).length; }
function dayNo() { return S.setup ? Math.round((dateOf(todayKey()) - dateOf(S.setup.start)) / 864e5) + 1 : 1; }

// ---------- numbers ----------
function earned() { var t = 0; Object.keys(S.days).forEach(function (k) { var c = cnt(k); t += c * 5 + (c === 6 ? 10 : 0); }); return t; }
function balance() { return Math.max(0, earned() - (S.spent || 0)); }
function careDays() { return Object.keys(S.days).filter(function (k) { return cnt(k) >= 3; }).length; }
function stageIdx() { var d = careDays(), s = 0; STAGES.forEach(function (x, i) { if (d >= x.need) { s = i; } }); return s; }
function streak() {
  var k = todayKey(), n = 0;
  if (cnt(k) < 3) { k = addDays(k, -1); }
  while (cnt(k) >= 3) { n++; k = addDays(k, -1); }
  return n;
}
function mood() {
  var c = cnt(todayKey()), y = cnt(addDays(todayKey(), -1)), h = hour();
  if (c >= 5) { return 'happy'; }
  if (c >= 2) { return 'ok'; }
  if (h < 11 && c === 0) { return y >= 3 ? 'morning' : 'morning'; }
  if (c === 1 && y >= 3) { return 'ok'; }
  return 'sad';
}
var LOOK = {
  sad: { fill: '#BDBBD3', edge: '#A9A6C4', ery: 1.6, mouth: 'M90 132 Q100 124 110 132', blush: 0, spark: 0, glow: 0, cloud: 1, sparkles: 0, float: 'floatslow' },
  morning: { fill: '#FFE08A', edge: '#F5C54F', ery: 3, mouth: 'M92 129 Q100 133 108 129', blush: 0.3, spark: 1, glow: 0.2, cloud: 0, sparkles: 0.3, float: 'floaty' },
  ok: { fill: '#FFD66B', edge: '#F5BE3A', ery: 6, mouth: 'M90 128 Q100 135 110 128', blush: 0.45, spark: 1, glow: 0.35, cloud: 0, sparkles: 0.6, float: 'floaty' },
  happy: { fill: '#FFC23D', edge: '#F2A51C', ery: 7, mouth: 'M86 124 Q100 142 114 124', blush: 0.85, spark: 1, glow: 0.9, cloud: 0, sparkles: 1, float: 'floaty' }
};

// ---------- art ----------
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function ico(d, sz, col) { return '<svg width="' + (sz || 22) + '" height="' + (sz || 22) + '" viewBox="0 0 24 24" fill="none" stroke="' + (col || 'currentColor') + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>'; }
function rng(seed) { var x = seed % 2147483647; if (x <= 0) { x += 2147483646; } return function () { x = x * 16807 % 2147483647; return (x - 1) / 2147483646; }; }
function starSvg(m, opts) {
  opts = opts || {};
  var v = LOOK[m], sc = opts.scale || 1;
  var crown = opts.crown ? '<path d="M82 52 L86 34 L95 46 L100 30 L105 46 L114 34 L118 52 Z" fill="#FFE7A3" stroke="#F2A51C" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="30" r="3.5" fill="#FF8FA3"/>' : '';
  return '<svg viewBox="0 0 200 200" role="img" aria-label="Твоя зірочка">' +
    '<defs><radialGradient id="dyglow"><stop offset="0" stop-color="#FFF6D6" stop-opacity=".95"/><stop offset=".5" stop-color="#FFE7A3" stop-opacity=".5"/><stop offset="1" stop-color="#FFE7A3" stop-opacity="0"/></radialGradient></defs><g opacity="' + v.glow + '"><circle cx="100" cy="112" r="98" fill="url(#dyglow)" class="glow"/></g>' +
    '<g opacity="' + v.sparkles + '"><path class="tw" d="M30 46 L33 54 L41 57 L33 60 L30 68 L27 60 L19 57 L27 54z" fill="#FFF6D6"/><path class="tw" style="animation-delay:.8s" d="M170 40 L172 46 L178 48 L172 50 L170 56 L168 50 L162 48 L168 46z" fill="#FFF6D6"/><path class="tw" style="animation-delay:1.5s" d="M176 150 L178.5 157 L185 159.5 L178.5 162 L176 169 L173.5 162 L167 159.5 L173.5 157z" fill="#FFF6D6"/><path class="tw" style="animation-delay:1.1s" d="M22 150 L24 155 L29 157 L24 159 L22 164 L20 159 L15 157 L20 155z" fill="#FFF6D6"/></g>' +
    '<g transform="translate(100 112) scale(' + sc + ') translate(-100 -112)"><g class="' + (opts.jump ? 'jump' : '') + '"><g class="' + v.float + '"><g class="breathe">' +
    '<polygon points="' + STARPTS + '" fill="' + v.fill + '" stroke="' + v.edge + '" stroke-width="16" stroke-linejoin="round"/>' +
    '<polygon points="' + STARPTS + '" fill="' + v.fill + '" stroke="' + v.fill + '" stroke-width="10" stroke-linejoin="round"/>' + crown +
    '<ellipse cx="84" cy="92" rx="10" ry="5" fill="#fff" opacity=".45" transform="rotate(-20 84 92)"/>' +
    '<g class="blink"><ellipse cx="88" cy="114" rx="5.5" ry="' + v.ery + '" fill="#2B2440"/><ellipse cx="112" cy="114" rx="5.5" ry="' + v.ery + '" fill="#2B2440"/></g>' +
    '<circle cx="90" cy="111" r="1.8" fill="#fff" opacity="' + v.spark + '"/><circle cx="114" cy="111" r="1.8" fill="#fff" opacity="' + v.spark + '"/>' +
    '<ellipse cx="76" cy="128" rx="8" ry="4.5" fill="#FF8FA3" opacity="' + v.blush + '"/><ellipse cx="124" cy="128" rx="8" ry="4.5" fill="#FF8FA3" opacity="' + v.blush + '"/>' +
    '<path d="' + v.mouth + '" stroke="#2B2440" stroke-width="3.5" stroke-linecap="round" fill="none"/></g></g></g></g>' +
    '<g opacity="' + (v.cloud && S.owned.cloud ? 1 : 0) + '"><path d="M40 176 C30 176 26 164 34 158 C32 146 46 140 54 146 C58 134 76 132 82 142 C88 134 104 134 108 144 C116 136 132 138 134 150 C146 146 158 154 154 166 C160 172 156 180 148 180 L44 182 C40 182 40 178 40 176z" fill="#D9D3EE"/><path d="M50 168 Q100 160 150 168" stroke="#C2B9E2" stroke-width="3" fill="none" stroke-linecap="round"/></g>' +
    '</svg>';
}
function skyBg(m) {
  var r = rng(77), o = '<svg class="bg" viewBox="0 0 400 330" preserveAspectRatio="xMidYMid slice" aria-hidden="true">';
  if (S.owned.aurora) { o += '<g class="aurora"><path d="M0 60 C80 20 160 90 240 50 C300 20 360 60 400 40 L400 0 L0 0z" fill="#5BE3B0" opacity=".35"/><path d="M0 90 C90 50 170 110 260 70 C320 45 370 80 400 70 L400 30 C350 50 300 20 240 40 C160 80 80 10 0 40z" fill="#B49AF5" opacity=".35"/></g>'; }
  if (S.owned.rainbow) { ['#FF8FA3', '#FFC23D', '#9EE6B8', '#8FB8FF', '#B49AF5'].forEach(function (c, i) { o += '<path d="M10 330 A190 190 0 0 1 390 330" fill="none" stroke="' + c + '" stroke-width="7" opacity=".35" transform="translate(0 ' + (i * 8) + ')"/>'; }); }
  for (var i = 0; i < 26; i++) { o += '<circle class="tw" style="animation-delay:' + (r() * 2.4).toFixed(1) + 's" cx="' + (r() * 400).toFixed(0) + '" cy="' + (r() * 220).toFixed(0) + '" r="' + (1 + r() * 1.3).toFixed(1) + '" fill="#fff"/>'; }
  o += '<path d="M352 58 C330 58 318 76 322 92 C308 80 314 50 338 42 C346 40 352 48 352 58z" fill="#FFF3C8" opacity=".95"/>';
  if (S.owned.cat) { o += '<g transform="translate(326 34)"><path d="M6 14 C6 6 18 6 18 14 L18 20 L6 20z" fill="#2B2440"/><path d="M6 8 L7 2 L10 7 M18 8 L17 2 L14 7" fill="#2B2440" stroke="#2B2440" stroke-width="1.5"/><path d="M18 18 C26 18 26 10 22 9" stroke="#2B2440" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="10" cy="11" r="1" fill="#FFC23D"/><circle cx="14" cy="11" r="1" fill="#FFC23D"/></g>'; }
  if (S.owned.lights) { o += '<path d="M0 18 Q100 48 200 22 Q300 0 400 26" stroke="#8C84B8" stroke-width="1.5" fill="none"/>'; ['#FF8FA3', '#FFC23D', '#9EE6B8', '#8FB8FF'].forEach(function (c, i) { for (var j = 0; j < 4; j++) { var x = 20 + (i * 4 + j) * 24; var y = x < 200 ? 18 + 30 * Math.sin(x / 200 * Math.PI) * .95 : 22 - 18 * Math.sin((x - 200) / 200 * Math.PI) + (x - 200) / 50; o += '<circle class="tw" style="animation-delay:' + ((i + j) * .3).toFixed(1) + 's" cx="' + x + '" cy="' + (y + 4).toFixed(0) + '" r="4" fill="' + c + '"/>'; } }); }
  if (S.owned.comet) { o += '<g class="comet"><path d="M0 0 L-46 14" stroke="#FFF6D6" stroke-width="3" stroke-linecap="round" opacity=".7"/><circle r="5" fill="#FFF6D6"/></g>'; }
  if (S.owned.moon) { o += '<path d="M64 300 C34 300 22 278 28 258 C14 270 14 300 38 312 C52 318 64 312 64 300z" fill="#FFF3C8" opacity=".9"/>'; }
  return o + '</svg>';
}
function scene(m, extra) {
  return '<div class="scene ' + (m === 'sad' ? 'sad' : m === 'happy' ? 'happy' : '') + '">' + skyBg(m) + (extra || '') +
    '<button class="hero" data-a="poke" aria-label="Погладити зірочку">' + starSvg(m, { scale: STAGES[stageIdx()].scale, crown: S.owned.crown, jump: jumpNext }) + '</button></div>';
}
function pick(list, seed) { return list[Math.abs(seed) % list.length]; }
function nm() { return S.setup ? S.setup.name : ''; }
function voc(n) {
  n = n || ''; var l = n.toLowerCase();
  if (/ія$/.test(l)) { return n.slice(0, -1) + 'є'; }
  if (/я$/.test(l)) { return n.slice(0, -1) + 'ю'; }
  if (/а$/.test(l)) { return n.slice(0, -1) + 'о'; }
  return n;
}
function speechText(m) {
  if (lastSay) { return lastSay; }
  var seed = cnt(todayKey()) + dateOf(todayKey()).getDate();
  return pick(SAY[m], seed).replace('{n}', voc(nm()));
}

// ---------- screens ----------
function header(kick, title, right) {
  return '<div class="row between" style="margin-bottom:14px"><div class="col" style="gap:4px"><span class="kick">' + kick + '</span><h1>' + title + '</h1></div>' + (right || '') + '</div>';
}
function screenActivate() {
  return '<div class="col" style="gap:18px;padding-top:8px">' + scene('happy') +
    '<div class="col" style="text-align:center;gap:8px"><h1>Друга я</h1><p class="mut">Введи свій особистий код доступу. Він працює лише на одному телефоні.</p></div>' +
    '<div class="col"><label for="code">Код доступу</label><input id="code" autocomplete="off" autocapitalize="characters" placeholder="Напр. DY-7K4M-Q2PX" value="' + esc(qs.get('code') || '') + '"></div>' +
    '<button class="btn" data-a="activate">Зустріти зірочку</button><p id="err" class="small" style="color:#C0392B;text-align:center;min-height:20px" role="alert"></p>' +
    '<p class="small mut" style="text-align:center">Інтернет потрібен лише для першого входу.</p></div>';
}
function screenSetup() {
  return '<div class="col" style="gap:16px;padding-top:8px">' + scene('ok') +
    '<div class="col" style="gap:6px;text-align:center"><h1>Привіт! Я — твоя зірочка</h1><p class="mut">Я сяю, коли ти дбаєш про себе. Познайомимось?</p></div>' +
    '<div class="col"><label for="nm">Як тебе звати?</label><input id="nm" maxlength="20" placeholder="Напр. Олена" autocomplete="given-name"></div>' +
    '<div class="col"><label for="sn">Як назвеш мене?</label><input id="sn" maxlength="20" placeholder="Напр. Іскра, Зоря, Мія"></div>' +
    '<button class="btn" data-a="start">Почати разом</button>' +
    '<p class="small mut" style="text-align:center">Щодня — 6 маленьких кроків турботи. Не треба все одразу: навіть один крок мене зігріє.</p></div>';
}
function screenToday() {
  var m = mood(), c = cnt(todayKey()), d = today(), st = STAGES[stageIdx()];
  var h = header('День ' + dayNo() + ' · ' + st.name, 'Привіт, ' + esc(voc(nm())),
    '<div class="row" style="gap:8px"><span class="pill">' + ico(ICON_STAR, 18, '#F2A51C') + '<span>' + balance() + '</span></span><button class="gear" data-a="tab" data-t="settings" aria-label="Налаштування">' + ico('M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z', 20) + '</button></div>');
  h += scene(m, '<div class="speech">' + esc(speechText(m)) + '</div>');
  h += '<div class="col" style="gap:6px;margin:14px 2px"><div class="row between small" style="font-weight:800;color:var(--mut)"><span>Турбота сьогодні</span><span>' + c + ' з 6' + (c === 6 ? ' · +10 бонус' : '') + '</span></div><div class="bar"><i style="width:' + Math.round(c / 6 * 100) + '%"></i></div></div>';
  h += '<div class="care">' + CARE.map(function (x) {
    var on = d.done.indexOf(x.id) >= 0;
    return '<button data-a="care" data-id="' + x.id + '" class="' + (on ? 'on' : '') + '" aria-pressed="' + on + '">' + ico(x.icon, 26) + '<b>' + x.label + '</b><span>' + x.hint + '</span></button>';
  }).join('') + '</div>';
  h += '<p class="small mut" style="text-align:center;margin-top:12px">Натисни, коли зробила. Помилилась — натисни ще раз.</p>';
  return h;
}
function screenPath() {
  var k0 = todayKey(), si = stageIdx(), cd = careDays();
  var h = header('Мій шлях', 'Як ми сяємо разом');
  var w = '';
  for (var i = 6; i >= 0; i--) { var k = addDays(k0, -i), c = cnt(k), l = c >= 5 ? 'l3' : c >= 3 ? 'l2' : c >= 1 ? 'l1' : ''; w += '<div><i class="' + l + (i === 0 ? ' today' : '') + '"></i>' + NAMES_UA[dateOf(k).getDay()] + '</div>'; }
  var sk = streak();
  h += '<div class="card col" style="gap:10px"><div class="row between" style="font-weight:800"><span>Останні 7 днів</span><span style="color:var(--vio)">' + (sk ? sk + ' ' + plural(sk, 'день', 'дні', 'днів') + ' поспіль' : 'почнемо серію!') + '</span></div><div class="week">' + w + '</div></div>';
  h += '<div class="col" style="margin-top:14px;gap:10px">';
  STAGES.forEach(function (s, i) {
    var cls = i < si ? 'done' : i === si ? 'me' : '', sub;
    if (i < si) { sub = s.sub + ' · пройдено'; } else if (i === si) { var nx = STAGES[i + 1]; sub = nx ? 'до «' + nx.name + '» ще ' + (nx.need - cd) + ' ' + plural(nx.need - cd, 'день', 'дні', 'днів') + ' турботи' : 'ти дійшла до вершини!'; } else { sub = s.sub + ' · відкриється згодом'; }
    var prog = i === si && STAGES[i + 1] ? '<div class="bar" style="height:8px;background:#fff"><i style="width:' + Math.round((cd - s.need) / (STAGES[i + 1].need - s.need) * 100) + '%"></i></div>' : '';
    h += '<div class="stage ' + cls + '">' + miniStar(i, i <= si) + '<div class="col" style="gap:4px;flex:1"><b style="font-size:16px">' + s.name + (i === si ? ' · ти тут' : '') + '</b><span class="small mut" style="font-weight:600">' + sub + '</span>' + prog + '</div></div>';
  });
  h += '</div><p class="small mut" style="margin-top:12px">День турботи — це день, коли ти зробила хоча б 3 кроки з 6. Пропуск нічого не забирає: просто продовжуй.</p>';
  return h;
}
function miniStar(i, lit) {
  var c = lit ? '#FFC23D' : '#CFC8E3';
  if (i === 0) { return '<svg width="52" height="52" viewBox="0 0 60 60" aria-hidden="true"><path d="M30 16 L33 27 L44 30 L33 33 L30 44 L27 33 L16 30 L27 27z" fill="' + c + '"/></svg>'; }
  if (i === 3) { return '<svg width="52" height="52" viewBox="0 0 60 60" aria-hidden="true"><path d="M12 40 L26 18 L40 30 L50 12" stroke="' + c + '" stroke-width="2" fill="none"/><circle cx="12" cy="40" r="4" fill="' + c + '"/><circle cx="26" cy="18" r="5" fill="' + c + '"/><circle cx="40" cy="30" r="4" fill="' + c + '"/><circle cx="50" cy="12" r="3.5" fill="' + c + '"/></svg>'; }
  if (i === 4) { return '<svg width="52" height="52" viewBox="0 0 60 60" aria-hidden="true"><path d="M30 30 C30 22 40 20 44 28 C48 38 36 48 26 44 C14 40 12 24 22 16 C32 8 50 12 52 26" stroke="' + c + '" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="30" cy="30" r="4" fill="' + c + '"/></svg>'; }
  var s = i === 1 ? 12 : 16;
  return '<svg width="52" height="52" viewBox="0 0 24 24" aria-hidden="true"><path transform="translate(12 12) scale(' + (s / 14) + ') translate(-12 -12)" d="' + ICON_STAR + '" fill="' + c + '" stroke="' + c + '" stroke-width="2" stroke-linejoin="round"/></svg>';
}
function plural(n, a, b, c) { n = Math.abs(n) % 100; var n1 = n % 10; if (n > 10 && n < 20) { return c; } if (n1 > 1 && n1 < 5) { return b; } if (n1 === 1) { return a; } return c; }
function screenSky() {
  var h = header('Моє небо', 'Подарунки для зірочки', '<span class="pill">' + ico(ICON_STAR, 18, '#F2A51C') + '<span>' + balance() + '</span></span>');
  h += scene(mood() === 'sad' ? 'ok' : mood());
  h += '<p class="small mut" style="margin:12px 2px">За кожен крок турботи — 5 зірочок, за повний день — ще 10. Купуй подарунки, і вони зʼявляться на твоєму небі.</p><div class="shop">';
  SHOP.forEach(function (it) {
    var own = !!S.owned[it.id], can = balance() >= it.price;
    h += '<div class="item"><b>' + it.name + '</b>' + (own ? '<span class="own">вже твоє</span>' : '<button data-a="buy" data-id="' + it.id + '"' + (can ? '' : ' disabled') + '>' + (can ? 'Відкрити · ' + it.price : 'Ще ' + (it.price - balance()) + ' зірочок') + '</button>') + '</div>';
  });
  return h + '</div>';
}
function screenSettings() {
  return header('Налаштування', 'Про нас із тобою', '<button class="gear" data-a="tab" data-t="today" aria-label="Закрити">' + ico('M6 6l12 12M18 6L6 18', 20) + '</button>') +
    '<div class="col">' +
    '<div class="card col"><label for="nm2">Твоє імʼя</label><input id="nm2" maxlength="20" value="' + esc(nm()) + '"><label for="sn2">Імʼя зірочки</label><input id="sn2" maxlength="20" value="' + esc(S.setup.star) + '"><button class="btn soft" data-a="rename">Зберегти</button></div>' +
    '<div class="card"><label class="switch" for="less">Менше анімацій<input type="checkbox" id="less" data-a="less"' + (S.settings.less ? ' checked' : '') + '></label></div>' +
    '<div class="card col" style="gap:8px"><h2>Як це працює</h2><p class="small">Щодня відмічай 6 кроків турботи: сон, вода, пауза, рух, гроші, радість. Чим більше кроків — тим яскравіше сяє зірочка. Забула про себе — вона тьмяніє, але ніколи не зникає: один крок — і вона знову світиться.</p><p class="small">3 кроки за день — це «день турботи». Дні турботи ростять зірочку: іскорка → зірочка → яскрава зірка → сузірʼя → твоя галактика.</p></div>' +
    '<div class="card col" style="gap:6px"><b>Код доступу</b><span class="small mut">' + esc(S.act ? S.act.code : '') + '</span><span class="small mut">Питання чи новий телефон? Напиши в Instagram @nakopych_challenge</span></div>' +
    '</div>';
}
function nav() {
  var it = [['today', 'Сьогодні', 'M4 11l8-7 8 7v9H4z'], ['path', 'Мій шлях', ICON_STAR], ['sky', 'Моє небо', 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z']];
  return '<nav><div class="in">' + it.map(function (x) { return '<button data-a="tab" data-t="' + x[0] + '" class="' + (S.tab === x[0] ? 'on' : '') + '">' + ico(x[2]) + x[1] + '</button>'; }).join('') + '</div></nav>';
}
var app = document.getElementById('app');
function render() {
  document.body.classList.toggle('less', !!S.settings.less);
  var h;
  if (!S.act) { h = screenActivate(); }
  else if (!S.setup) { h = screenSetup(); }
  else {
    if (S.tab === 'path') { h = screenPath(); } else if (S.tab === 'sky') { h = screenSky(); } else if (S.tab === 'settings') { h = screenSettings(); } else { h = screenToday(); }
    if (S.tab !== 'settings') { h += nav(); }
  }
  app.innerHTML = h;
  jumpNext = false;
}
function toast(t) { var el = document.createElement('div'); el.className = 'toast'; el.textContent = t; document.body.appendChild(el); setTimeout(function () { el.remove(); }, 2600); }
function overlay(html) {
  var el = document.createElement('div'); el.className = 'overlay'; el.innerHTML = html + '<button class="btn" style="max-width:320px;background:#FFC23D;color:#2B2440" data-close>Дякую!</button>';
  document.body.appendChild(el);
  el.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) { el.remove(); render(); } });
}
function sparks(fromEl) {
  if (S.settings.less || !fromEl || !fromEl.animate) { return; }
  var a = fromEl.getBoundingClientRect(), hero = document.querySelector('.hero'), b = hero ? hero.getBoundingClientRect() : { left: innerWidth / 2, top: 200, width: 0, height: 0 };
  for (var i = 0; i < 5; i++) {
    var s = document.createElement('div'); s.className = 'spark';
    s.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14"><path d="' + ICON_STAR + '" fill="#FFC23D"/></svg>';
    document.body.appendChild(s);
    var x0 = a.left + a.width / 2, y0 = a.top + a.height / 2, x1 = b.left + b.width / 2 + (Math.random() - .5) * 80, y1 = b.top + b.height / 2 + (Math.random() - .5) * 60;
    s.animate([{ transform: 'translate(' + x0 + 'px,' + y0 + 'px) scale(.6)', opacity: 1 }, { transform: 'translate(' + ((x0 + x1) / 2) + 'px,' + (Math.min(y0, y1) - 60) + 'px) scale(1.2)', opacity: 1 }, { transform: 'translate(' + x1 + 'px,' + y1 + 'px) scale(.4)', opacity: 0 }], { duration: 700 + i * 90, easing: 'ease-out' }).onfinish = (function (el) { return function () { el.remove(); }; })(s);
  }
}

// ---------- server ----------
function deviceId() {
  var id = localStorage.getItem('dy_dev');
  if (!id) { id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2); localStorage.setItem('dy_dev', id); }
  return id;
}
function post(path, body) { return fetch(API + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(function (r) { return r.json(); }); }
function sync() {
  if (!S.act || DEMO || !navigator.onLine) { return; }
  var copy = JSON.parse(JSON.stringify(S)); delete copy.act;
  post('/sync', { code: S.act.code, device: S.act.device, state: copy }).catch(function () {});
}
window.addEventListener('online', sync);

// ---------- actions ----------
var A = {
  activate: function () {
    var code = (document.getElementById('code').value || '').trim().toUpperCase(), err = document.getElementById('err');
    if (code.length < 6) { err.textContent = 'Введи код повністю.'; return; }
    if (!navigator.onLine) { err.textContent = 'Для першого входу потрібен інтернет.'; return; }
    err.textContent = 'Перевіряю…';
    var dev = deviceId();
    post('/activate', { code: code, device: dev }).then(function (r) {
      if (!r.ok) { err.textContent = r.error === 'used' ? 'Цей код уже активовано на іншому телефоні. Напиши нам — допоможемо.' : r.error === 'limit' ? 'Забагато спроб. Спробуй за годину.' : 'Код не знайдено. Перевір, чи правильно введено.'; return; }
      if (r.state && r.state.setup) { var keep = S.settings; S = Object.assign(blank(), r.state); S.settings = S.settings || keep; }
      S.act = { code: code, device: dev, at: todayKey() };
      save(true); render();
    }).catch(function () { err.textContent = 'Немає звʼязку з сервером. Спробуй ще раз за хвилину.'; });
  },
  start: function () {
    var n = (document.getElementById('nm').value || '').trim(), s = (document.getElementById('sn').value || '').trim();
    if (!n) { document.getElementById('nm').focus(); toast('Напиши своє імʼя'); return; }
    S.setup = { name: n, star: s || 'Зірочка', start: todayKey() }; S.tab = 'today';
    lastSay = 'Привіт, ' + voc(n) + '! Я — ' + (s || 'твоя зірочка') + '. Подбай сьогодні про себе — і я засяю.';
    save(); render();
  },
  care: function (el) {
    var id = el.getAttribute('data-id'), d = today(), i = d.done.indexOf(id), before = stageIdx(), c0 = d.done.length;
    if (i >= 0) { d.done.splice(i, 1); lastSay = 'Добре, прибрала. Нічого страшного!'; }
    else {
      d.done.push(id); jumpNext = true;
      var x = CARE.filter(function (q) { return q.id === id; })[0];
      lastSay = pick(x.say, d.done.length + dateOf(todayKey()).getDate());
      sparks(el);
    }
    save(); render();
    if (i < 0 && c0 === 5 && d.done.length === 6 && !d.full) { d.full = 1; save(); setTimeout(function () { overlay('<div style="width:200px;height:200px">' + starSvg('happy', { crown: S.owned.crown }) + '</div><h1>Ти сьогодні — зірка!</h1><p>Усі 6 кроків турботи. +10 зірочок у подарунок.</p>'); }, 650); }
    var after = stageIdx();
    if (after > before && after > (S.stage || 0)) { S.stage = after; save(); setTimeout(function () { overlay('<div style="width:200px;height:200px">' + starSvg('happy', { scale: STAGES[after].scale, crown: S.owned.crown }) + '</div><h1>' + STAGES[after].name + '!</h1><p>' + esc(S.setup.star) + ' виросла. Це ' + STAGES[after].need + ' ' + plural(STAGES[after].need, 'день', 'дні', 'днів') + ' турботи про себе.</p>'); }, 800); }
  },
  poke: function () {
    var m = mood();
    var pool = m === 'sad' ? ['Ой… Погладила? Дякую. А тепер — про себе подбай.', 'Мені приємно. Але ще приємніше буде, коли ти вип’єш води.'] : ['Хі-хі, лоскотно!', 'Я тебе теж люблю!', 'Обійми прийнято!', 'Ти найкраща, ' + voc(nm()) + '!'];
    lastSay = pick(pool, Date.now() / 1000 | 0); jumpNext = true; render();
  },
  tab: function (el) { S.tab = el.getAttribute('data-t'); lastSay = null; save(true); render(); window.scrollTo(0, 0); },
  buy: function (el) {
    var it = SHOP.filter(function (x) { return x.id === el.getAttribute('data-id'); })[0];
    if (!it || S.owned[it.id] || balance() < it.price) { return; }
    S.spent = (S.spent || 0) + it.price; S.owned[it.id] = 1; save(); jumpNext = true; render();
    toast(it.name + ' — тепер на твоєму небі!');
  },
  rename: function () {
    var n = (document.getElementById('nm2').value || '').trim(), s = (document.getElementById('sn2').value || '').trim();
    if (n) { S.setup.name = n; } if (s) { S.setup.star = s; } save(); toast('Збережено');
  },
  less: function (el) { S.settings.less = !!el.checked; save(); render(); }
};
app.addEventListener('click', function (e) {
  var el = e.target.closest('[data-a]'); if (!el || el.tagName === 'INPUT') { return; }
  var a = A[el.getAttribute('data-a')]; if (a) { a(el); }
});
app.addEventListener('change', function (e) { if (e.target.getAttribute('data-a') === 'less') { A.less(e.target); } });
app.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.id === 'code') { A.activate(); } });

if (DEMO && !S.act) { S.act = { code: 'ДЕМО', device: 'demo', at: todayKey() }; }
if (S.tab === 'settings') { S.tab = 'today'; }
render();
if (!DEMO && 'serviceWorker' in navigator && location.protocol === 'https:') { navigator.serviceWorker.register('sw.js').catch(function () {}); }
if (S.act) { sync(); }
})();
