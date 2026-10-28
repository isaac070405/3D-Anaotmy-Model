// Layered atlas: every mesh in the model is assigned to one of 14 body layers, from skin (0) to bones and cartilage (13).
// A depth slider peels layers from the outside in, and each layer also has its own visibility toggle.
const LAYERS = [
  { name: 'Skin', note: 'Epidermis, dermis and the fat layer beneath.', color: '#e7c3a5' },
  { name: 'Superficial veins', note: 'Veins in the subcutaneous fat: external jugular, facial, forearm veins.', color: '#4a6fa5' },
  { name: 'Investing fascia', note: 'Deep fascia and aponeuroses that wrap the muscles.', color: '#e6dccb' },
  { name: 'Superficial muscles', note: 'Muscles just under the fascia: trapezius, deltoid, pectoralis major, gluteus maximus.', color: '#b9473b' },
  { name: 'Second muscle group', note: 'Muscles under the superficial group: rhomboids, serratus anterior, rectus femoris, soleus.', color: '#a63d33' },
  { name: 'Intermediate muscles', note: 'Mid-depth muscles: erector spinae, brachialis, adductors, gluteus minimus.', color: '#933529' },
  { name: 'Deep muscles', note: 'Muscles next to bone: supraspinatus, subscapularis, piriformis, tibialis posterior.', color: '#7f2d23' },
  { name: 'Deepest muscles', note: 'Innermost muscles: diaphragm, intercostals, transversus abdominis, pharyngeal and laryngeal muscles.', color: '#6b251d' },
  { name: 'Visceral coverings', note: 'Serous membranes and sacs: pleura, pericardium, peritoneum, meninges, tunica vaginalis.', color: '#d9d2a3' },
  { name: 'Anterior organs', note: 'Heart, lungs, stomach, liver, intestines, bladder, thyroid, eyes, ears and reproductive organs.', color: '#d79a8b' },
  { name: 'Deep organs', note: 'Kidneys, ureters, pancreas, duodenum, oesophagus, brain and spinal cord.', color: '#a9646a' },
  { name: 'Deep nerves and vessels', note: 'Arteries, deep veins, nerves, plexuses and ganglia.', color: '#d9a441' },
  { name: 'Capsules and ligaments', note: 'Joint capsules, ligaments and intervertebral discs.', color: '#c9c2a6' },
  { name: 'Bones and cartilage', note: 'Skeleton, teeth, costal, articular and laryngeal cartilage.', color: '#e6d8b8' },
];

const MUSCLE = [
  [2, /fascia|aponeurosis|iliotibial|linea alba|retinaculum|inguinal ligament/i],
  [7, /^(Superior pharyngeal|Middle pharyngeal|Inferior pharyngeal|Palatopharyngeus|Levator veli|Cricothyroid|Lateral cricoarytenoid|Posterior cricoarytenoid|Thyroarytenoid|Vocalis|Oblique arytenoid|Transverse arytenoid|Internal intercostal|External intercostal|Transversus abdominis)/],
  [6, /^(Piriformis|Obturator|Gemellus|Quadratus femoris|Tibialis posterior|Pronator quadratus|Subclavius|Obliquus capitis|Rectus capitis|Genioglossus|Hyoglossus|Styloglossus|Stylohyoid|Levator palpebrae|Superior (rectus|oblique)|Inferior (rectus|oblique)|Lateral rectus|Medial rectus|Popliteus|Subscapularis|Supraspinatus|Flexor hallucis longus|Flexor digitorum longus|Geniohyoid)/],
  [3, /^(Trapezius|Latissimus|Deltoid|Pectoralis major|External oblique|Sternocleidomastoid|Platysma|Gluteus maximus|Rectus abdominis|Orbicularis|Zygomaticus|Depressor anguli|Procerus|Masseter|Temporalis|Gastrocnemius|Tensor fasciae|Sartorius|Gracilis|Semitendinosus|Biceps femoris, long|Brachioradialis|Biceps brachii|Triceps brachii, (lateral|long)|Flexor carpi|Palmaris longus|Extensor digitorum \(forearm\)|Extensor carpi radialis|Thenar|Calcaneal|Buccinator)/],
  [4, /^(Rhomboid|Serratus anterior|Levator scapulae|Splenius|Internal oblique|Gluteus medius|Rectus femoris|Vastus lateralis|Vastus medialis|Biceps femoris, short|Semimembranosus|Soleus|Extensor digitorum longus|Fibularis|Flexor digitorum superficialis|Pronator teres|Teres|Infraspinatus|Adductor longus|Pectoralis minor|Omohyoid|Digastric|Quadriceps)/],
];
const SUPERFICIAL_VEIN = /^(External jugular|Median (antebrachial|cubital)|Cephalic|Basilic|Facial vein|Superficial temporal vein|Supraorbital vein|Supratrochlear vein|Retromandibular)/;
const VESSEL = /artery|vein|nerve|vessel|plexus|lymphatic/i;
const PERIPHERAL = /nerve|plexus|ganglion|sympathetic|vagus|trunk|cauda equina|ansa|filum|root|ramus|rami/i;

// first line of the label with the side and tendon suffix removed, so "Biceps brachii, tendon of insertion (left)" sorts with the muscle
const stem = l => l.replace(/\s*\((right|left)\)/g, '');

function layerOf(o, heart) {
  const sys = o.userData.sys, label = stem(o.userData.label || o.name || '');
  switch (sys) {
    case 'skin': case 'fat': return 0;
    case 'muscular': { for (const [i, re] of MUSCLE) if (re.test(label)) return i; return 5; }
    case 'skeletal': return /ligament|capsule|joint|disc/i.test(label) ? 12 : 13;
    case 'circulatory':
      if (heart(o)) return 9;
      if (/sinus|cerebral|communicating|meningeal/i.test(label)) return 10;
      return SUPERFICIAL_VEIN.test(label) ? 1 : 11;
    case 'respiratory':
      if (/^Diaphragm|Caval opening|Aortic hiatus/.test(label)) return 7;
      if (/^Pleura/.test(label)) return 8;
      if (/^(Thyrohyoid ligament|Cricothyroid ligament|Pulmonary ligament|.*arcuate ligament)/.test(label)) return 12;
      if (/cartilage|^Epiglottis/i.test(label)) return 13;
      return 9;
    case 'digestive':
      if (/serosa|peritoneum|tunica adventitia/i.test(label)) return 8;
      return /pancrea|duoden|ascending colon|descending colon|rectum|anal canal|esophag|oesophag|pharynx|Z-line/i.test(label) ? 10 : 9;
    case 'urinary': return /bladder|trigone|detrusor|urethr/i.test(label) && !/ureteric/i.test(label) ? 9 : 10;
    case 'reproductive':
      if (/Retromammary|pectoral fascia/i.test(label)) return 2;
      if (/Tunica vaginalis|spermatic fascia|Dartos/i.test(label)) return 8;
      if (/ligament/i.test(label)) return 12;
      return VESSEL.test(label) ? 11 : 9;
    case 'senses': case 'endocrine': return 9;
    case 'nervous':
      if (/Dura mater|meninges/i.test(label)) return 8;
      return PERIPHERAL.test(label) ? 11 : 10;
    default: return -1;
  }
}

function init() {
  const A = window.__anat, G = A.G, $ = id => document.getElementById(id);
  const hr = window.__heartRange || [0, 0], heartSet = new Set(G.circulatory.children.slice(hr[0], hr[1]));
  const heart = o => { for (let p = o; p && p !== G.circulatory; p = p.parent) if (heartSet.has(p)) return true; return /pulmonary_(artery|vein)/.test(o.name) && !/intrapulmonary/i.test(o.userData.label || ''); };
  const meshes = LAYERS.map(() => []), base = new Map();
  A.model.traverse(o => { if (!o.isMesh || !o.userData.sys) return; const k = layerOf(o, heart); if (k < 0) return; o.userData.layer = k; meshes[k].push(o); base.set(o, o.visible); });
  const on = LAYERS.map(() => true); let touched = null;

  const apply = () => { meshes.forEach((ms, k) => ms.forEach(o => { o.visible = base.get(o) && on[k]; })); };
  const engage = () => { // the atlas shows every system, so switch them all on once and remember the previous state
    if (touched) return; touched = {}; Object.keys(G).forEach(k => { if (G[k] && G[k].isObject3D && document.querySelector(`#systems [data-k="${k}"]`)) touched[k] = G[k].visible; });
    $('all').click();
  };
  const list = $('lylist'), slider = $('lyslider'), cur = $('lycur');
  LAYERS.forEach((L, k) => {
    const r = document.createElement('label'); r.className = 'ly'; r.dataset.k = k;
    r.innerHTML = `<span class="lyn">${k + 1}</span><span class="sw" style="background:${L.color}"></span><span class="lyt"><b>${L.name}</b><small>${L.note}</small></span><input type="checkbox" checked aria-label="Show ${L.name}">`;
    r.querySelector('input').addEventListener('change', e => { engage(); on[k] = e.target.checked; apply(); sync(); });
    list.appendChild(r);
  });
  function sync() {
    list.querySelectorAll('.ly').forEach((r, k) => { r.querySelector('input').checked = on[k]; r.classList.toggle('off', !on[k]); r.querySelector('.lyt small').style.display = on[k] ? '' : 'none'; });
    const first = on.indexOf(true); cur.textContent = first < 0 ? 'All layers hidden' : 'Outermost visible: ' + LAYERS[first].name;
    slider.value = Math.max(0, first < 0 ? 13 : first);
  }
  slider.addEventListener('input', () => { engage(); const p = +slider.value; on.forEach((_, k) => { on[k] = k >= p; }); apply(); sync(); });
  $('lyall').onclick = () => { on.fill(true); apply(); sync(); };
  $('lyreset').onclick = () => {
    on.fill(true); apply(); sync();
    if (touched) { Object.entries(touched).forEach(([k, v]) => { G[k].visible = v; const cb = document.querySelector(`#systems [data-k="${k}"] input`); if (cb) cb.checked = v; }); touched = null; }
  };
  sync();
  window.__layers = { LAYERS, meshes, layerOf, counts: () => meshes.map(m => m.length) };
  if (/[?&]view=layers/.test(location.search)) { const s = $('layerssec'); s.scrollIntoView(); s.classList.add('hl'); }
}

const wait = setInterval(() => {
  if (window.__anat && window.__anat.ready && document.querySelector('#systems [data-k]') && document.getElementById('lylist')) { clearInterval(wait); init(); }
}, 100);
