"""Build mockup 15 (Studio) from mockup 14: the same throw, rendered as a crisp, realistic studio scene."""
from pathlib import Path

d = Path(r"C:\Projects\sigma-chi-website\beer-die-redesign\mockups")
s = (d / "14-jacked-thrower.html").read_text(encoding="utf-8")


def rep(old, new, count=1):
    global s
    assert s.count(old) == count, f"{s.count(old)}x: {old[:70]!r}"
    s = s.replace(old, new)


def between(start, end):
    i = s.index(start)
    return s[i:s.index(end, i)]


def block(start, end, new):
    global s
    i = s.index(start)
    i = s.rfind("\n", 0, i) + 1
    j = s.index(end, i)
    j = s.rfind("\n", 0, j) + 1
    s = s[:i] + new + s[j:]


# ---------- names ----------
rep("<title>Beer Die Jacked Thrower</title>", "<title>Beer Die Studio</title>")
rep("""/* Concept 14 · Jacked Thrower. Mockup 13 with a heavyweight build: every body
   part's cross-section is an ellipse swollen by Gaussian muscles (pecs, a
   six-pack, lats, traps, delts, biceps, quads, calves), and brighter lines
   trace the muscle borders. Still generated in code, still no model file.
   Blue is the figure's alone; the table and die keep the navy and gold. */""",
    """/* Concept 15 · Studio. Mockup 14's throw with the glow taken out: a crisp,
   realistic studio render. Native multisampling at up to 2x density and no
   post-processing keep every edge sharp; a softbox environment, soft shadows
   and physical materials (lacquer, brass, glass, gilded pips) do the rest. The
   thrower is a featureless athlete in polished marble, like a classical statue. */""")
rep('<div class="chip" aria-hidden="true"><b>14</b> Jacked Thrower</div>', '<div class="chip" aria-hidden="true"><b>15</b> Studio</div>')
rep("const THROWER = { x: -0.1, z: 5.0 };        // where the figure stands, just off the near end",
    "const THROWER = { x: -0.1, z: 5.6 };        // where the figure stands, off the near end and out of the hero's frame")

# ---------- CSS: strip the glow, go editorial after the scene ----------
rep("</style>", r"""
/* ---------- 15 · Studio: the glow and HUD come out; sections go back to the live site's editorial look ---------- */
.grain, .hud, .cue__die { display: none; }
.veil { background: radial-gradient(ellipse 130% 100% at 50% 45%, transparent 62%, rgba(3, 10, 22, .42) 100%); }
.hero h1 { text-shadow: none; }
.hero__rule { background: var(--gold); box-shadow: none; }
.btn { border-radius: 6px; letter-spacing: .03em; }
.btn--gold { background: var(--gold); color: var(--navy-dark); box-shadow: none; }
.btn--gold:hover { background: #d6b03a; box-shadow: none; transform: translateY(-1px); }
.btn--glass { background: transparent; border-color: rgba(250, 247, 240, .6); backdrop-filter: none; -webkit-backdrop-filter: none; }
.btn--glass:hover { background: rgba(250, 247, 240, .08); border-color: var(--cream); }
.cue { padding: 9px 16px; gap: 10px; background: rgba(7, 17, 31, .55); border: 1px solid rgba(250, 247, 240, .3); border-radius: 6px; font: 600 .72rem var(--font-body); letter-spacing: .2em; }
.mark svg { filter: none; }
.mark__face { box-shadow: inset 0 0 0 1.5px rgba(201, 162, 39, .8); }
.landed { background: rgba(7, 17, 31, .84); border: 1px solid rgba(250, 247, 240, .14); border-radius: 12px; box-shadow: 0 24px 60px rgba(0, 0, 0, .35); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
.sect .eyebrow { color: var(--gold-dark); }
.sect--aims { background: var(--cream); color: var(--ink); }
.sect--aims h2, .sect--join h2 { color: var(--navy); }
.lead { color: #4a4a4a; }
.card { background: var(--white, #fff); border: 1px solid rgba(11, 37, 69, .12); border-radius: 10px; }
.card::before { display: none; }
.card:hover { border-color: rgba(201, 162, 39, .7); transform: translateY(-2px); }
.card__n { color: var(--gold-dark); text-shadow: none; }
.card h3 { color: var(--navy); }
.card p { color: #4a4a4a; }
.band { background: var(--navy); border: 0; }
.stat__n { color: var(--gold); text-shadow: none; }
.sect--join { background: #ffffff; color: var(--ink); }
.badge { color: var(--navy); border-color: rgba(11, 37, 69, .25); }
.badge::before { background: var(--gold); box-shadow: none; }
.join .btn--glass { color: var(--navy); border-color: var(--navy); }
.join .btn--glass:hover { background: rgba(11, 37, 69, .06); }
.footer { background: var(--navy-dark); }
.chip { border-color: rgba(250, 247, 240, .2); }
</style>""")

# ---------- module level: crest metalness mask, studio painters, the marble thrower ----------
rep('crestImg.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(CREST);',
    '''crestImg.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(CREST);
// The same crest as a metalness mask: the gold parts white, everything else black.
const CREST_METAL = CREST.replaceAll("#0b2545", "#000000").replaceAll("#faf7f0", "#000000").replaceAll("#c9a227", "#ffffff");
const crestMetalImg = new Image();
const crestMetalReady = new Promise((res) => { crestMetalImg.onload = res; crestMetalImg.onerror = res; });
crestMetalImg.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(CREST_METAL);''')
# pinstripes keep the hero's rhythm at any texture size
rep("  for (let x = 32; x < W; x += 64) g.fillRect(x, 0, 2, H);",
    "  for (let x = W / 32; x < W; x += W / 16) g.fillRect(x, 0, Math.max(2, W / 512), H);")
rep("// Lacquered table top: deep navy", r'''// Die faces for the studio render: albedo, metalness and roughness, so the pips
// and the crest's gold read as real gilding under the navy clear coat.
function paintFace15(c, n, kind) {
  const g = c.getContext("2d");
  g.fillStyle = { color: "#0b2545", metal: "#000000", rough: "#2a2a2a" }[kind];
  g.fillRect(0, 0, 512, 512);
  if (kind === "color") {   // a faint inner edge, like a polished bevel
    g.strokeStyle = "rgba(255, 255, 255, .05)"; g.lineWidth = 6;
    g.beginPath(); g.roundRect(36, 36, 440, 440, 52); g.stroke();
  }
  if (n === 1) {
    const img = kind === "metal" ? crestMetalImg : crestImg;
    if (kind !== "rough" && img.naturalWidth) g.drawImage(img, 100, 69, 313, 371);
    return;
  }
  g.fillStyle = { color: "#d4af37", metal: "#ffffff", rough: "#5a5a5a" }[kind];
  for (const [x, y] of PIPS[n]) { g.beginPath(); g.arc(x * 5.12, y * 5.12, 40, 0, Math.PI * 2); g.fill(); }
}

// Polished marble for the statue: a warm cream ground, soft clouding and a few
// fine veins, some with a gold cast.
function paintMarble(c) {
  const g = c.getContext("2d"), W = c.width, H = c.height, rnd = mulberry32(17);
  const base = g.createLinearGradient(0, 0, W, H);
  base.addColorStop(0, "#f2ede3"); base.addColorStop(0.5, "#ebe4d6"); base.addColorStop(1, "#f4efe7");
  g.fillStyle = base; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 70; i++) {
    const x = rnd() * W, y = rnd() * H, r = 40 + rnd() * 170;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(200, 190, 172, ${0.08 + rnd() * 0.1})`); gr.addColorStop(1, "rgba(200, 190, 172, 0)");
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  for (let v = 0; v < 28; v++) {
    let x = rnd() * W, y = rnd() * H, a = rnd() * Math.PI * 2;
    g.strokeStyle = rnd() < 0.3 ? `rgba(170, 140, 80, ${0.16 + rnd() * 0.2})` : `rgba(118, 114, 106, ${0.1 + rnd() * 0.16})`;
    g.lineWidth = 0.6 + rnd() * 1.8;
    g.beginPath(); g.moveTo(x, y);
    const steps = 40 + rnd() * 90;
    for (let k = 0; k < steps; k++) { a += (rnd() - 0.5) * 0.5; x += Math.cos(a) * 8; y += Math.sin(a) * 8; g.lineTo(x, y); }
    g.stroke();
  }
}

// Lacquered table top: deep navy''')

specs_src = between("const HIP_Y = 0.55", "// Rings every `step` feet along a profile")
resample_src = between("// Rings every `step` feet along a profile", "const wrapA")
section_src = between("const wrapA", "// One part's three geometries")
old_rig = between("// ---------- The thrower ----------", "// The projector pad under the thrower's feet.")
solve_src = old_rig[old_rig.index("  const tmp = new T.Vector3();"):]
solve_src = solve_src.replace("""  function shade(time, revealY) {
    uniforms.uTime.value = time;
    uniforms.uReveal.value = revealY;
    uniforms.uScan.value = FLOOR + ((time * 1.5) % 7.5);
  }""", """  function shade() {}   // stone needs no print-in; the camera reveals him""")
assert "function shade() {}" in solve_src

new_rig = r'''// ---------- The thrower ----------
// A featureless athlete in polished marble, like a classical statue caught
// mid-throw. The body is 14's (an ellipse per section, swollen by Gaussian
// muscles), now finely tessellated and solid so it takes real light and casts
// real shadows. Ball joints at the elbows, wrists, knees and ankles keep the
// surface continuous when the limbs bend.
''' + specs_src + resample_src + section_src + r'''// One part as a closed, smooth surface: rings of the muscled cross-section, both
// ends capped, normals matched across the wrap seam, outward-facing throughout.
function muscleSurface(T, spec) {
  const rings = resample(spec.prof, spec.step);
  const bumps = spec.bumps || [], segs = spec.segs, n = rings.length;
  const asc = rings[n - 1][0] > rings[0][0];
  const P = (th, y, rx, rz) => { const r = sectionRadius(rx, rz, th, y, bumps); return [Math.cos(th) * r, y, Math.sin(th) * r]; };
  const pos = [], uv = [], idx = [];
  rings.forEach(([y, rx, rz], i) => {
    for (let j = 0; j <= segs; j++) { pos.push(...P(j / segs * TAU, y, rx, rz)); uv.push(j / segs, i / (n - 1)); }
  });
  for (let i = 0; i < n - 1; i++) for (let j = 0; j < segs; j++) {
    const a = i * (segs + 1) + j, b = a + segs + 1;
    if (asc) idx.push(a, b, a + 1, b, b + 1, a + 1); else idx.push(a, a + 1, b, b, a + 1, b + 1);
  }
  for (const ri of [0, n - 1]) {
    const lower = ri === 0 ? asc : !asc, c = pos.length / 3;
    pos.push(0, rings[ri][0], 0); uv.push(0.5, ri ? 1 : 0);
    for (let j = 0; j < segs; j++) { const a = ri * (segs + 1) + j; if (lower) idx.push(c, a, a + 1); else idx.push(c, a + 1, a); }
  }
  const g = new T.BufferGeometry();
  g.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  const nr = g.attributes.normal;
  for (let i = 0; i < n; i++) {   // the first and last column are the same points: share one normal
    const a = i * (segs + 1), b = a + segs;
    const x = nr.getX(a) + nr.getX(b), y = nr.getY(a) + nr.getY(b), z = nr.getZ(a) + nr.getZ(b), l = Math.hypot(x, y, z) || 1;
    nr.setXYZ(a, x / l, y / l, z / l); nr.setXYZ(b, x / l, y / l, z / l);
  }
  return g;
}

function buildThrower(T, scene, marbleMap) {
  const stone = new T.MeshPhysicalMaterial({ map: marbleMap, roughness: 0.36, metalness: 0, clearcoat: 0.55, clearcoatRoughness: 0.22, envMapIntensity: 0.85 });
  const stats = { triangles: 0, drawCalls: 0 };
  const joint = (parent, x, y, z) => { const o = new T.Group(); o.position.set(x, y, z); parent.add(o); return o; };
  const fine = (spec) => ({ ...spec, step: Math.min(spec.step, 0.035), segs: Math.max(spec.segs, 56) });
  const part = (parent, spec, shape) => {
    const g = muscleSurface(T, fine(spec));
    if (shape) shape(g);
    const m = new T.Mesh(g, stone);
    m.castShadow = true; m.receiveShadow = true;
    parent.add(m);
    stats.triangles += g.index.count / 3; stats.drawCalls++;
  };
  const ball = (parent, r) => {
    const m = new T.Mesh(new T.SphereGeometry(r, 40, 28), stone);
    m.castShadow = true; m.receiveShadow = true;
    parent.add(m);
    stats.drawCalls++;
  };

  const root = joint(scene, THROWER.x, 0, THROWER.z);            // faces -z, toward the far end
  const pelvis = joint(root, 0, HIP_Y, 0);
  const spine = joint(pelvis, 0, 0.1, 0);
  part(spine, TRUNK.torso);
  const neck = joint(spine, 0, 1.76, 0);
  part(neck, TRUNK.neck);
  const head = joint(neck, 0, 0.22, 0);
  part(head, TRUNK.head);
  const headTop = joint(head, 0, 0.76, 0);
  const arm = (side) => {
    const B = limbSpec(side);
    const sh = joint(spine, side * 0.76, 1.5, 0);
    part(sh, B.upper);
    const el = joint(sh, 0, -1.0, 0);
    ball(el, 0.145);
    part(el, B.fore);
    const wr = joint(el, 0, -0.88, 0);
    ball(wr, 0.088);
    part(wr, B.hand);
    return { sh, el, wr };
  };
  const R = arm(1), L = arm(-1);
  const palm = joint(R.wr, 0, -0.36, -0.06 - HALF * 0.8);        // where the die sits; the palm faces local -z
  const leg = (side) => {
    const B = limbSpec(side);
    const hp = joint(pelvis, side * 0.36, 0, 0);
    part(hp, B.thigh);
    const kn = joint(hp, 0, -THIGH, 0);
    ball(kn, 0.175);
    part(kn, B.shin);
    const an = joint(kn, 0, -SHIN, 0);
    ball(an, 0.098);
    part(an, TRUNK.foot, (geo) => geo.rotateX(Math.PI / 2).translate(0, -0.14, 0));
    return { hp, kn, an };
  };
  const RL = leg(1), LL = leg(-1);
  window.__figureStats = stats;

  // Feet planted in a wide throwing stance: left foot forward, right foot back.
  const FOOT_R = new T.Vector3(THROWER.x + 0.4, FLOOR + 0.25, THROWER.z + 0.3);
  const FOOT_L = new T.Vector3(THROWER.x - 0.4, FLOOR + 0.25, THROWER.z - 0.5);
''' + solve_src

i = s.index("// ---------- The thrower ----------")
j = s.index("// The projector pad under the thrower's feet.")
s = s[:i] + new_rig + s[j:]

# ---------- build(): renderer, studio, lights ----------
block("// ---------- Scene ----------", "  const tex = (c, srgb = true) =>", r'''// ---------- Scene ----------
async function build() {
  const T = await import("three");
  const [{ RoundedBoxGeometry }, { RectAreaLightUniformsLib }] = await Promise.all([
    import("three/addons/geometries/RoundedBoxGeometry.js"),
    import("three/addons/lights/RectAreaLightUniformsLib.js"),
  ]);
  RectAreaLightUniformsLib.init();

  // Sharp by construction: native multisampling, up to 2x pixel density, no post-processing.
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.AgXToneMapping ?? T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  const aniso = renderer.capabilities.getMaxAnisotropy();

  // A seamless studio: a navy floor that fogs into a navy backdrop.
  const scene = new T.Scene();
  scene.background = new T.Color(0x07111f);
  scene.fog = new T.Fog(0x07111f, 26, 70);
  // Reflections from a product-photography rig: an overhead softbox, two strip lights, a warm card.
  const envScene = new T.Scene();
  envScene.add(new T.Mesh(new T.SphereGeometry(30, 32, 16), new T.MeshBasicMaterial({ color: 0x0a1626, side: T.BackSide })));
  const panel = (pw, ph, color, k, pos) => {
    const m = new T.Mesh(new T.PlaneGeometry(pw, ph), new T.MeshBasicMaterial({ color: new T.Color(color).multiplyScalar(k), side: T.DoubleSide }));
    m.position.set(...pos); m.lookAt(0, 0, 0); envScene.add(m);
  };
  panel(18, 10, 0xffffff, 2.2, [0, 20, 2]);
  panel(3, 16, 0xf3f6ff, 1.5, [-18, 7, 0]);
  panel(3, 16, 0xf3f6ff, 1.5, [18, 7, -2]);
  panel(14, 4, 0xffe6b8, 0.6, [0, 3, 20]);
  scene.environment = new T.PMREMGenerator(renderer).fromScene(envScene, 0.02).texture;

  const camera = new T.PerspectiveCamera(30, 1, 0.1, 140);

  // Light: a soft key over the camera's shoulder (it casts the shadows), a large
  // area light for clean highlights, and a cool rim from behind to cut the figure out.
  const key = new T.SpotLight(0xfff3e4, 2.1, 0, 0.62, 0.95, 0);
  key.position.set(8, 13, -1);
  key.target.position.set(0, 0, 1.4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.0002;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 6;
  key.shadow.camera.near = 6; key.shadow.camera.far = 32;
  scene.add(key, key.target);
  const box = new T.RectAreaLight(0xffffff, 2.6, 8, 4);
  box.position.set(2, 10, 3);
  box.lookAt(0, 0, 1);
  scene.add(box);
  const rim = new T.DirectionalLight(0xc4d6ff, 1.3);
  rim.position.set(-6, 8, -14);
  scene.add(rim);
  scene.add(new T.HemisphereLight(0xdfe8ff, 0x07111f, 0.22));

''')

# ---------- build(): table, inlay, floor, cups, die (no trail, ring, dust or bloom) ----------
block("  const tex = (c, srgb = true) =>", "  // Camera framing. Start: straight down at the painted top, filling the screen.", r'''  const tex = (c, srgb = true) => { const t = new T.CanvasTexture(c); if (srgb) t.colorSpace = T.SRGBColorSpace; t.anisotropy = aniso; return t; };

  // Table: 4 x 8 ft with softened edges and a brushed-brass band, top at y = 0, 30 in off the floor.
  const topCanvas = mk(2048, 4096);
  paintTop(topCanvas);
  const topTex = tex(topCanvas);
  const topMat = new T.MeshPhysicalMaterial({ map: topTex, roughness: 0.42, metalness: 0, specularIntensity: 0.08, clearcoat: 0.001, clearcoatRoughness: 0.08, envMapIntensity: 0.55 });
  const trimMat = new T.MeshStandardMaterial({ color: 0x9c7b22, metalness: 1, roughness: 0.3, envMapIntensity: 1.2 });
  const darkMat = new T.MeshStandardMaterial({ color: 0x0b1424, metalness: 0.7, roughness: 0.38 });
  const table = new T.Mesh(new RoundedBoxGeometry(4, 0.14, 8, 4, 0.03), [trimMat, trimMat, topMat, darkMat, trimMat, trimMat]);
  table.position.y = -0.07;
  table.castShadow = true;
  table.receiveShadow = true;
  scene.add(table);
  const monoC = mk(1024, 512);
  paintMono(monoC);
  const monoTex = tex(monoC);
  const monoMat = new T.MeshStandardMaterial({ map: monoTex, transparent: true, opacity: 0, roughness: 0.35, metalness: 0.7, depthWrite: false });
  const mono = new T.Mesh(new T.PlaneGeometry(2.4, 1.2), monoMat);
  mono.rotation.x = -Math.PI / 2;
  mono.position.set(0, 0.004, 1.35);
  mono.receiveShadow = true;
  scene.add(mono);
  document.fonts.ready.then(() => { paintMono(monoC); monoTex.needsUpdate = true; });
  for (const [x, z] of [[-1.7, -3.7], [1.7, -3.7], [-1.7, 3.7], [1.7, 3.7]]) {
    const leg = new T.Mesh(new T.BoxGeometry(0.12, 2.36, 0.12), darkMat);
    leg.position.set(x, -1.32, z);
    leg.castShadow = true;
    scene.add(leg);
  }
  // Brass inlay, set flush: traces itself on from the centre line during the crane.
  const stripMat = new T.MeshStandardMaterial({ color: 0xd4b04a, metalness: 1, roughness: 0.22, envMapIntensity: 1.4 });
  const strips = [];
  const strip = (a, b, t0, t1) => {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const geo = new T.BoxGeometry(0.035, 0.008, len).translate(0, 0, len / 2);
    const m = new T.Mesh(geo, stripMat);
    m.position.set(a[0], 0.004, a[1]);
    m.lookAt(b[0], 0.004, b[1]);
    m.receiveShadow = true;
    m.userData = { t0, t1 };
    scene.add(m);
    strips.push(m);
  };
  const X = 1.8, Z = 3.8;
  strip([0, 0], [X, 0], 0.3, 0.7); strip([0, 0], [-X, 0], 0.3, 0.7);
  for (const sx of [X, -X]) for (const sz of [Z, -Z]) strip([sx, 0], [sx, sz], 0.62, 1.15);
  for (const sx of [X, -X]) for (const sz of [Z, -Z]) strip([sx, sz], [0, sz], 1.05, 1.5);

  // Studio floor: navy, satin, catching the shadows; the fog melts it into the backdrop.
  const floor = new T.Mesh(new T.PlaneGeometry(140, 140), new T.MeshStandardMaterial({ color: 0x0d1b30, roughness: 0.62, metalness: 0 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -2.5; floor.receiveShadow = true;
  scene.add(floor);

  // Cups: clear glass tumblers, empty, with a gilt rim.
  const profile = [[0, 0], [0.15, 0], [0.158, 0.015], [0.235, 0.6], [0.25, 0.615], [0.24, 0.622], [0.226, 0.6], [0.148, 0.03], [0, 0.03]].map(([x, y]) => new T.Vector2(x, y));
  const cupGeo = new T.LatheGeometry(profile, 96);
  const glass = new T.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transmission: 1, thickness: 0.04, ior: 1.5, specularIntensity: 1, envMapIntensity: 1.1,
    attenuationColor: new T.Color(0xf3ead6), attenuationDistance: 2.5, side: T.DoubleSide });
  const rimGeo = new T.TorusGeometry(0.245, 0.011, 16, 96);
  const gilt = new T.MeshStandardMaterial({ color: 0xd9b25a, metalness: 1, roughness: 0.2, envMapIntensity: 1.3 });
  const cups = CUPS.map(({ x, z }) => {
    const grp = new T.Group();
    const body = new T.Mesh(cupGeo, glass); body.castShadow = true;
    const rimMesh = new T.Mesh(rimGeo, gilt); rimMesh.rotation.x = Math.PI / 2; rimMesh.position.y = 0.613;
    grp.add(body, rimMesh); grp.position.set(x, 0, z);
    scene.add(grp);
    return grp;
  });

  // The die: navy under a clear coat, pips and crest gilded, engraved by a bump map.
  const order = [3, 4, 1, 6, 2, 5];             // box material order: +x, -x, +y, -y, +z, -z
  const faces = {};
  const mats = order.map((n) => {
    const cc = mk(512, 512), mc = mk(512, 512), rc = mk(512, 512), bc = mk(512, 512);
    paintFace15(cc, n, "color"); paintFace15(mc, n, "metal"); paintFace15(rc, n, "rough"); paintFace(bc, n, "bump");
    const map = tex(cc), metalnessMap = tex(mc, false), roughnessMap = tex(rc, false), bumpMap = tex(bc, false);
    faces[n] = { cc, mc, map, metalnessMap };
    return new T.MeshPhysicalMaterial({ map, metalnessMap, roughnessMap, bumpMap, bumpScale: 2.0, metalness: 1, roughness: 1,
      clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.0 });
  });
  Promise.all([crestReady, crestMetalReady]).then(() => {
    paintFace15(faces[1].cc, 1, "color"); paintFace15(faces[1].mc, 1, "metal");
    faces[1].map.needsUpdate = true; faces[1].metalnessMap.needsUpdate = true;
  });
  const die = new T.Mesh(new RoundedBoxGeometry(S, S, S, 8, ROUND), mats);
  die.castShadow = true;
  scene.add(die);

  const marbleC = mk(1024, 1024);
  paintMarble(marbleC);
  const marbleMap = tex(marbleC);
  marbleMap.wrapS = marbleMap.wrapT = T.RepeatWrapping;

''')

# ---------- build(): camera framing ----------
block("  // Camera framing. Start: straight down at the painted top, filling the screen.", "  // Sink effects (as in 12):", r'''  // Camera framing. Start: straight down at the painted top, filling the screen.
  let w = 1, h = 1, r0 = 3, r1 = 12, zc0 = 0.6, tanH = 1;
  function resize() {
    w = pin.clientWidth; h = pin.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = camera.aspect < 0.8 ? 45 : 30;   // a longer lens: less distortion, more like a product photograph
    camera.updateProjectionMatrix();
    tanH = Math.tan((camera.fov / 2) * Math.PI / 180);
    zc0 = camera.aspect < 0.8 ? 0.3 : 0.6;
    r0 = 0.92 * Math.min(1.9 / (tanH * camera.aspect), (3.9 - Math.abs(zc0)) / tanH);
    r1 = Math.max(11.5, 3.1 / (tanH * camera.aspect));
  }
  // If frames run slow on this machine, drop to a lighter pixel density once.
  function degrade() { if (dpr > 1.25) { dpr = 1.25; renderer.setPixelRatio(dpr); resize(); } }

''')

# ---------- build(): the thrower, toss control and the frame ----------
block("  // Sink effects (as in 12):", "  resize();\n  return { resize, frame, startToss", r'''  // The thrower.
  const rig = buildThrower(T, scene, marbleMap);

  const qa = new T.Quaternion(), qy = new T.Quaternion(), qt = new T.Quaternion(), qf = new T.Quaternion(), UP = new T.Vector3(0, 1, 0);
  const HOLD = new T.Quaternion().setFromEuler(new T.Euler(-Math.PI / 2, 0, 0));   // die +y (the crest) out of the palm
  const m4 = new T.Matrix4(), v = new T.Vector3(), pv = new T.Vector3(), hq = new T.Quaternion();
  let restMode = "hand", again = 0;
  const restQ = new T.Quaternion(), restPos = new T.Vector3();
  let mx = 0, my = 0, smx = 0, smy = 0, sf = 0;
  addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });

  // The intro aims at the far-right cup; "Toss again" alternates far left and far right.
  const AGAIN = [0, 1];
  function startToss(kind) {
    let cupI = 1;
    if (kind !== "intro") { cupI = AGAIN[again % AGAIN.length]; again++; }
    const reload = restMode === "cup";
    const delay = reload ? 0.6 : 0;
    const prev = reload ? { p: restPos.clone(), q: restQ.clone() } : null;
    // Pose the figure at the release instant to find where, and how, the hand lets go.
    rig.apply(rig.poseAt(delay + REL_T, { delay, tE: Infinity, end: Infinity }));
    rig.palm.getWorldPosition(pv);
    rig.palm.getWorldQuaternion(hq);
    toss = makeToss(T, CUPS[cupI], prev, pv.clone(), hq.clone().multiply(HOLD), delay);
    tossT = 0;
    tossCount++;
    rRoll.textContent = String(tossCount).padStart(2, "0");
    rTarget.textContent = CUPS[cupI].name;
  }
  function finishToss() {
    if (!toss) return;
    poseDie(toss, tossState(toss, toss.end));
    restQ.copy(die.quaternion);
    restPos.copy(die.position);
    restMode = "cup";
    toss = null;
  }
  // Rewinding to the hero: the die goes back into the hand so the crest can return from it.
  function reset() { if (toss) finishToss(); restMode = "hand"; }

  function holdDie() {
    rig.palm.getWorldPosition(pv);
    rig.palm.getWorldQuaternion(hq);
    die.position.copy(pv);
    die.quaternion.copy(hq).multiply(HOLD);
  }
  function poseDie(k, st) {
    if (st.mode === "flight") {
      qy.setFromAxisAngle(UP, k.yaw);
      qf.copy(k.q0).slerp(qy, smooth(clamp(st.u * 1.15)));   // from how it left the hand to crest up
      qa.setFromAxisAngle(k.axis, st.ang);                    // whole turns, so the tumble ends where it began
      die.quaternion.copy(qa).multiply(qf);
      die.position.set(st.x, st.y, st.z);
    } else if (st.mode === "cup") {
      qt.setFromAxisAngle(k.tiltAxis, st.tilt);
      qy.setFromAxisAngle(UP, k.yaw);
      die.quaternion.copy(qt).multiply(qy);
      m4.makeRotationFromQuaternion(die.quaternion);
      const e = m4.elements;
      const low = (HALF - ROUND) * (Math.abs(e[1]) + Math.abs(e[5]) + Math.abs(e[9])) + ROUND;
      die.position.set(st.x, low + st.h, st.z);
    } else holdDie();
  }

  function screenBox(points) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const p of points) {
      v.copy(p).applyMatrix4(die.matrixWorld).project(camera);
      const sx = (v.x + 1) / 2 * w, sy = (1 - v.y) / 2 * h;
      x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy);
    }
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }
  const TOP = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => new T.Vector3(a * HALF, HALF, b * HALF));
  const ALL = [];
  for (const a of [-1, 1]) for (const b of [-1, 1]) for (const c of [-1, 1]) ALL.push(new T.Vector3(a * HALF, b * HALF, c * HALF));

  // Camera: a crane from straight overhead (the hero) to a front three-quarter
  // view from the far half of the right side, looking back at the thrower,
  // through a longer lens. Phones get a view from behind the thrower, where the
  // table's length runs up the tall screen. It rises with the die in flight.
  const P1W = new T.Vector3(14.3, 8.1, -3.05), T1W = new T.Vector3(0, 1.2, 1.6);
  const P1N = new T.Vector3(10.75, 10.1, 20.4), T1N = new T.Vector3(-0.4, 0.4, -0.2);
  const cpos = new T.Vector3(), ctgt = new T.Vector3(), U0 = new T.Vector3(0, 0, -1);
  function placeCamera(c, follow, shake) {
    const narrow = camera.aspect < 0.8;
    cpos.set(0, r0, zc0).lerp(narrow ? P1N : P1W, c);
    cpos.x += smx * 0.9 * c;
    cpos.y += 2.2 * Math.sin(Math.PI * c) + 0.3 * follow - smy * 0.4 * c + shake;
    ctgt.set(0, 0, zc0).lerp(narrow ? T1N : T1W, c);
    ctgt.y += 0.45 * follow;
    camera.up.copy(U0).lerp(UP, smooth(c)).normalize();
    camera.position.copy(cpos);
    camera.lookAt(ctgt);
    camera.updateMatrixWorld();
  }
  // Something still settling? (pointer parallax, the camera's follow)
  const busy = () => Math.abs(mx - smx) > 0.0008 || Math.abs(my - smy) > 0.0008 || sf > 0.002;

  function frame() {
    const c = easeInOut(seg(tau, 0, INTRO_END));
    const st = toss ? tossState(toss, tossT) : null;

    // 1. The figure. While the die is out of his hand, he watches it.
    let dieY, dieDist;
    if (st && st.mode === "flight") { dieY = st.y; dieDist = Math.hypot(st.x - THROWER.x, st.z - THROWER.z); }
    else if (st && st.mode === "cup") { dieY = CUP_H; dieDist = Math.hypot(st.x - THROWER.x, st.z - THROWER.z); }
    rig.apply(rig.poseAt(toss ? tossT : 0, toss, dieY, dieDist));

    // 2. The die. A reload shrinks it out of the last cup and grows it back in the hand.
    let scale = 1;
    if (st && st.mode === "reload") {
      const r = tossT / toss.delay;
      if (r < 0.4) { die.position.copy(toss.prev.p); die.quaternion.copy(toss.prev.q); scale = 1 - easeOut(r / 0.4); }
      else { holdDie(); scale = easeOutBack(clamp((r - 0.4) / 0.6)); }
    } else if (st) poseDie(toss, st);
    else if (restMode === "hand") holdDie();
    else { die.position.copy(restPos); die.quaternion.copy(restQ); }
    die.scale.setScalar(Math.max(scale, 0.001));
    die.updateMatrixWorld();
    die.visible = tau >= HANDOFF;

    // 3. Camera.
    sf += ((st && st.mode === "flight" ? Math.max(0, st.y - 1.5) : 0) - sf) * 0.12;
    smx += (mx - smx) * 0.05; smy += (my - smy) * 0.05;
    let shake = 0;
    if (toss && !reduce) { const a = tossT - toss.tE; if (a > 0 && a < 0.3) shake = 0.012 * Math.exp(-a * 14) * Math.sin(a * 80); }
    placeCamera(c, sf, shake);

    // 4. Table and cups.
    strips.forEach((sp) => { const k = easeOut(seg(tau, sp.userData.t0, sp.userData.t1)); sp.scale.set(1, 1, Math.max(k, 0.0001)); sp.visible = k > 0.001; });
    const grow = easeOut(seg(tau, 0.35, 1.1));
    cups.forEach((g, i) => {
      g.visible = grow > 0.01;
      const a = toss && toss.cup === CUPS[i] ? tossT - toss.tE : -1;
      const wob = a > 0 && !reduce ? 0.04 * Math.exp(-a * 5) * Math.sin(a * 30) : 0;
      g.rotation.set(wob, 0, wob * 0.6);
      g.scale.set(CUP_K, CUP_K * Math.max(grow, 0.01), CUP_K);
    });
    // Matte while overhead (the hero must read as a flat field); the lacquer's gloss arrives with the crane.
    topMat.clearcoat = lerp(0.001, 0.85, c * c);
    topMat.specularIntensity = lerp(0.08, 0.4, c);
    monoMat.opacity = 0.85 * seg(tau, 0.4, 1.2);

    renderer.render(scene, camera);

    const out = { st: { h: Math.max(0, die.position.y - HALF), rate: st ? st.rate : 0, phase: st ? st.phase : restMode === "cup" ? "IN THE CUP" : "READY" } };
    if (tau < HANDOFF) out.face = screenBox(TOP);
    if (toss || tossCount) out.box = screenBox(ALL);
    return out;
  }

''')
rep("  return { resize, frame, startToss, finishToss, reset, get toss() { return toss; } };",
    "  return { resize, frame, startToss, finishToss, reset, degrade, busy, get toss() { return toss; } };")

# ---------- page loop: render only while something moves; degrade once if frames are slow ----------
rep("""  let out = null;
  if (gl && visible) out = gl.frame(now / 1000);
  paintHTML(out);""", """  let out = lastOut;
  if (gl && visible && (dir !== 0 || gl.toss || paused || gl.busy() || dirty > 0)) {
    out = lastOut = gl.frame();
    dirty = Math.max(0, dirty - 1);
    // Frames over ~30 ms for a sustained stretch: drop the pixel density once.
    slow = dt > 0.03 ? slow + 1 : Math.max(0, slow - 2);
    if (slow > 45 && !degraded) { gl.degrade(); degraded = true; dirty = 3; }
  }
  paintHTML(out);""")
rep("let lastTime = performance.now(), visible = true, fallbackMode = false;",
    "let lastTime = performance.now(), visible = true, fallbackMode = false, lastOut = null, dirty = 4, slow = 0, degraded = false;")
rep('addEventListener("resize", layout);', 'addEventListener("resize", () => { layout(); dirty = 3; });')
rep("""function onScroll() {""", """function onScroll() {
  dirty = Math.max(dirty, 2);""")

(d / "15-studio.html").write_text(s, encoding="utf-8")
print("wrote", d / "15-studio.html", len(s))
