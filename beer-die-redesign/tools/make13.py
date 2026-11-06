"""Build mockup 13 (Holo Thrower) from mockup 12: a blue wireframe figure throws the die into the cup."""
from pathlib import Path

d = Path(r"C:\Projects\sigma-chi-website\beer-die-redesign\mockups")
s = (d / "12-cup-sink.html").read_text(encoding="utf-8")


def rep(old, new, count=1):
    global s
    assert s.count(old) == count, f"{s.count(old)}x: {old[:70]!r}"
    s = s.replace(old, new)


def block(start, end, new):
    """Replace from the line containing `start` up to (not including) the line containing `end`."""
    global s
    i = s.index(start)
    i = s.rfind("\n", 0, i) + 1
    j = s.index(end, i)
    j = s.rfind("\n", 0, j) + 1
    s = s[:i] + new + s[j:]


# ---------- names, tokens, HUD tag ----------
rep("<title>Beer Die Cup Sink</title>", "<title>Beer Die Holo Thrower</title>")
rep("""/* Concept 12 · Cup Sink. Mockup 11 with one change: the toss ends in a cup.
   The die clears the rim on a gravity arc, drops in, rattles off the wall and
   settles crest up, and the cup answers with a gold flash. Everything else
   (one scroll plays it, the top of the page rewinds it) is as in 11. */""",
    """/* Concept 13 · Holo Thrower. Mockup 12 with a thrower: a featureless figure
   drawn only in blue contour lines prints itself in at the near end, lobs the
   die underhand, watches it and pumps a fist when it sinks. The figure is
   generated in code (no model file), so it stays inside the artifact CSP.
   Blue is the figure's alone; the table and die keep the navy and gold. */""")
rep('<div class="chip" aria-hidden="true"><b>12</b> Cup Sink</div>', '<div class="chip" aria-hidden="true"><b>13</b> Holo Thrower</div>')
rep("  --gold-dark: #8a6d1b;\n  --cream: #faf7f0;", "  --gold-dark: #8a6d1b;\n  --holo: #4aa8ff;\n  --holo-hi: #c6e6ff;\n  --cream: #faf7f0;")
rep(".hud__spec b { color: var(--gold-hi); font-weight: 600; text-shadow: 0 0 8px rgba(240, 207, 98, .5); }",
    """.hud__spec b { color: var(--gold-hi); font-weight: 600; text-shadow: 0 0 8px rgba(240, 207, 98, .5); }
.ptag { position: absolute; left: 0; top: 0; opacity: 0; padding: 5px 9px; font-size: .62rem; letter-spacing: .16em; line-height: 1.5; color: var(--holo-hi); text-shadow: 0 0 8px rgba(74, 168, 255, .85); background: rgba(3, 10, 22, .5); border: 1px solid rgba(74, 168, 255, .5); border-radius: 4px; white-space: nowrap; will-change: transform; }
.ptag span { color: rgba(198, 230, 255, .6); }
.ptag::before { content: ""; position: absolute; right: 100%; top: 100%; width: 22px; height: 1px; background: rgba(74, 168, 255, .7); transform-origin: right; transform: rotate(-38deg); }""")
rep('        <div class="hud__spec" id="spec">', '        <div class="ptag" id="ptag">PLAYER 01<br><span>NEAR END</span></div>\n        <div class="hud__spec" id="spec">')
rep('const reticle = $("reticle"), readout = $("readout"), spec = $("spec");',
    'const reticle = $("reticle"), readout = $("readout"), spec = $("spec"), ptag = $("ptag");')
rep("const SPOTS = [{ x: 0.0, z: 2.85 }, { x: 0.3, z: -2.6 }];   // throwing spots: near end, far end",
    "const FLOOR = -2.5;                         // the table top is y = 0, 30 in off the floor\nconst THROWER = { x: 0.2, z: 5.0 };         // where the figure stands, just off the near end")

# ---------- toss physics + the figure (module level) ----------
block("// A toss from a throwing spot into a cup: one gravity arc that ends just over", "// ---------- Painters ----------", r'''// ---------- The throw ----------
// Times are seconds since the toss started. `delay` is the reload before a
// repeat throw: the die de-rezzes out of the last cup and re-rezzes in the hand.
const WIND_T = 0.5, REL_T = 0.8;
const smooth = (t) => t * t * (3 - 2 * t);
function makeToss(T, cup, prev, P0, q0, delay = 0) {
  const rnd = mulberry32(seed++);
  const tr = delay + REL_T;                                  // the hand lets go here
  const flight = 1.0;
  const P1 = new T.Vector3(cup.x, CUP_H + 0.04 + HALF, cup.z);   // die centre just over the rim
  const v0 = new T.Vector3().subVectors(P1, P0).divideScalar(flight);
  v0.y += 0.5 * G * flight;                                  // the launch that gravity bends into the cup
  const tE = tr + flight;
  const drop = Math.sqrt(2 * (CUP_H + 0.04 - REST_IN) / G);   // free fall inside the cup
  const hop = 0.07, dHop = 2 * Math.sqrt(2 * hop / G);       // one small bounce off the bottom
  const i2 = tE + drop, i3 = i2 + dHop;
  const dir = new T.Vector3(cup.x - P0.x, 0, cup.z - P0.z).normalize();
  const axis = new T.Vector3().crossVectors(new T.Vector3(0, 1, 0), dir);   // topspin
  axis.x += (rnd() - 0.5) * 0.4; axis.y += (rnd() - 0.5) * 0.3; axis.z += (rnd() - 0.5) * 0.4;
  axis.normalize();
  return { cup, prev, delay, tr, tE, P0, q0, v0, flight, drop, hop, dHop, i2, i3, settled: i3 + 0.55, end: tE + 1.4,
    axis, tiltAxis: new T.Vector3(rnd() - 0.5, 0, rnd() - 0.5).normalize(),
    rattle: { x: (rnd() - 0.5) * 0.12, z: (rnd() - 0.5) * 0.12 }, yaw: (rnd() - 0.5) * 1.6, turns: 3 };
}

// Pure state of the die at time t. In the hand its pose comes from the figure;
// in flight it's a gravity parabola; in the cup it drops, hops and rattles.
function tossState(k, t) {
  const T2 = k.turns * 2 * Math.PI;
  if (t < k.delay) return { mode: "reload", phase: "RELOAD", rate: 0 };
  if (t < k.tr) return { mode: "hand", phase: t < k.delay + WIND_T ? "WIND-UP" : "RELEASE", rate: 0 };
  if (t < k.tE) {
    const a = t - k.tr, u = a / k.flight, vy = k.v0.y - G * a;
    const phase = u < 0.08 ? "RELEASE" : u > 0.8 ? "ON TARGET" : Math.abs(vy) < 3 ? "APEX" : vy > 0 ? "RISING" : "FALLING";
    return { mode: "flight", x: k.P0.x + k.v0.x * a, y: k.P0.y + k.v0.y * a - 0.5 * G * a * a, z: k.P0.z + k.v0.z * a,
      u, ang: T2 * u, rate: T2 / k.flight, vy, phase };
  }
  const a = t - k.tE;
  const knock = Math.exp(-6 * a) * Math.sin(26 * a);
  let h = REST_IN, phase = t < k.settled ? "RATTLE" : "IN THE CUP";
  if (t < k.i2) { h = CUP_H + 0.04 - 0.5 * G * a * a; phase = "SINK"; }
  else if (t < k.i3) { const u = (t - k.i2) / k.dHop; h = REST_IN + 4 * k.hop * u * (1 - u); }
  return { mode: "cup", x: k.cup.x + k.rattle.x * knock, z: k.cup.z + k.rattle.z * knock, h, tilt: 0.08 + 0.3 * knock, rate: 0, phase };
}

// ---------- The thrower ----------
// A featureless figure drawn only in blue contour lines. Each body part is a
// loft: a stack of elliptical rings joined by a few long seams, plus a faint
// rim-lit shell. Joints are plain groups, so the throw is a set of joint
// angles, and the legs are solved every frame so the feet stay planted.
const HIP_Y = 0.55, THIGH = 1.45, SHIN = 1.42;
const PROFILE = {   // [height along the part, half-width, half-depth] in feet
  torso: [[-0.24, 0.4, 0.28], [-0.1, 0.52, 0.33], [0.12, 0.54, 0.34], [0.45, 0.45, 0.29], [0.8, 0.5, 0.31], [1.15, 0.6, 0.36], [1.42, 0.64, 0.35], [1.62, 0.56, 0.3], [1.76, 0.3, 0.22], [1.82, 0.2, 0.18]],
  neck: [[-0.08, 0.2, 0.18], [0.12, 0.17, 0.16], [0.3, 0.16, 0.15]],
  head: [[0, 0.14, 0.14], [0.06, 0.24, 0.26], [0.22, 0.3, 0.33], [0.42, 0.31, 0.34], [0.6, 0.27, 0.3], [0.72, 0.18, 0.21], [0.79, 0.04, 0.05]],
  upper: [[0.08, 0.15, 0.15], [-0.05, 0.19, 0.19], [-0.5, 0.16, 0.16], [-0.95, 0.12, 0.12], [-1.02, 0.11, 0.11]],
  fore: [[0.06, 0.12, 0.12], [-0.2, 0.15, 0.14], [-0.6, 0.11, 0.1], [-0.86, 0.08, 0.065], [-0.9, 0.075, 0.06]],
  hand: [[0.02, 0.075, 0.05], [-0.12, 0.1, 0.055], [-0.35, 0.1, 0.05], [-0.5, 0.07, 0.04], [-0.58, 0.02, 0.02]],
  thigh: [[0.1, 0.25, 0.25], [-0.1, 0.29, 0.3], [-0.7, 0.23, 0.24], [-1.35, 0.16, 0.17], [-1.48, 0.15, 0.16]],
  shin: [[0.06, 0.15, 0.16], [-0.3, 0.17, 0.19], [-0.85, 0.12, 0.13], [-1.38, 0.08, 0.09], [-1.44, 0.08, 0.09]],
  foot: [[0.18, 0.08, 0.08], [0.05, 0.12, 0.11], [-0.3, 0.14, 0.09], [-0.62, 0.13, 0.06], [-0.74, 0.06, 0.04]],
};
// Joint angles in radians. Positive swing at shoulder and elbow is forward, toward the far end.
const POSE = {
  idle:    { dy: 0, pt: 0, sx: 0.04, sy: 0, hx: 0.1, rsx: 0.3, rsz: 0.12, rex: 1.25, rwx: 0.1, lsx: 0.05, lsz: -0.12, lex: 0.25, lwx: 0 },
  wind:    { dy: -0.28, pt: -0.12, sx: 0.28, sy: -0.32, hx: -0.12, rsx: -0.75, rsz: 0.18, rex: 0.25, rwx: -0.45, lsx: 0.45, lsz: -0.2, lex: 0.55, lwx: 0 },
  release: { dy: 0.02, pt: 0.08, sx: 0.02, sy: 0.18, hx: -0.2, rsx: 1.45, rsz: 0.1, rex: 0.12, rwx: 0.35, lsx: -0.35, lsz: -0.25, lex: 0.35, lwx: 0 },
  follow:  { dy: 0.06, pt: 0.12, sx: -0.08, sy: 0.22, hx: -0.45, rsx: 2.35, rsz: 0.12, rex: 0.18, rwx: 0.4, lsx: -0.15, lsz: -0.3, lex: 0.4, lwx: 0 },
  watch:   { dy: 0, pt: 0.08, sx: -0.04, sy: 0.15, hx: -0.3, rsx: 1.2, rsz: 0.14, rex: 0.4, rwx: 0.2, lsx: 0, lsz: -0.18, lex: 0.35, lwx: 0 },
  pump:    { dy: 0.04, pt: 0.05, sx: -0.02, sy: 0.1, hx: -0.12, rsx: 1.75, rsz: 0.45, rex: 1.35, rwx: 0, lsx: 0.1, lsz: -0.2, lex: 0.5, lwx: 0 },
};

// Rings every `step` feet along a profile, smoothed with Catmull-Rom between the key rings.
function resample(prof, step) {
  const y0 = prof[0][0], y1 = prof[prof.length - 1][0];
  const n = Math.max(2, Math.round(Math.abs(y1 - y0) / step) + 1);
  const P = (i) => prof[Math.max(0, Math.min(prof.length - 1, i))];
  const out = [];
  for (let s = 0; s < n; s++) {
    const y = y0 + (y1 - y0) * s / (n - 1);
    let k = 0;
    while (k < prof.length - 2 && (y1 > y0 ? y > prof[k + 1][0] : y < prof[k + 1][0])) k++;
    const t = clamp((y - prof[k][0]) / ((prof[k + 1][0] - prof[k][0]) || 1));
    const cr = (j) => 0.5 * (2 * P(k)[j] + (P(k + 1)[j] - P(k - 1)[j]) * t
      + (2 * P(k - 1)[j] - 5 * P(k)[j] + 4 * P(k + 1)[j] - P(k + 2)[j]) * t * t
      + (3 * P(k)[j] - P(k - 1)[j] - 3 * P(k + 1)[j] + P(k + 2)[j]) * t * t * t);
    out.push([y, Math.max(0.005, cr(1)), Math.max(0.005, cr(2))]);
  }
  return out;
}
function loftLines(T, rings, segs, seams) {
  const pts = [];
  for (const [y, rx, rz] of rings) {
    for (let j = 0; j < segs; j++) {
      const a0 = j / segs * Math.PI * 2, a1 = (j + 1) / segs * Math.PI * 2;
      pts.push(Math.cos(a0) * rx, y, Math.sin(a0) * rz, Math.cos(a1) * rx, y, Math.sin(a1) * rz);
    }
  }
  for (let m = 0; m < seams; m++) {
    const a = m / seams * Math.PI * 2 + 0.2;
    for (let i = 0; i < rings.length - 1; i++) {
      const [ya, rxa, rza] = rings[i], [yb, rxb, rzb] = rings[i + 1];
      pts.push(Math.cos(a) * rxa, ya, Math.sin(a) * rza, Math.cos(a) * rxb, yb, Math.sin(a) * rzb);
    }
  }
  const g = new T.BufferGeometry();
  g.setAttribute("position", new T.Float32BufferAttribute(pts, 3));
  return g;
}
function loftShell(T, rings, segs) {
  const pos = [], idx = [];
  for (const [y, rx, rz] of rings) for (let j = 0; j <= segs; j++) { const a = j / segs * Math.PI * 2; pos.push(Math.cos(a) * rx, y, Math.sin(a) * rz); }
  for (let i = 0; i < rings.length - 1; i++) for (let j = 0; j < segs; j++) {
    const a = i * (segs + 1) + j, b = a + segs + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new T.BufferGeometry();
  g.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// Contour lines: printed in from the floor up (uReveal), with a scan band and a faint flicker.
const LINE_VS = `varying float vY;
void main() { vec4 w = modelMatrix * vec4(position, 1.0); vY = w.y; gl_Position = projectionMatrix * viewMatrix * w; }`;
const LINE_FS = `uniform vec3 uColor; uniform vec3 uHi; uniform float uTime; uniform float uReveal; uniform float uScan;
varying float vY;
void main() {
  float edge = uReveal - vY;
  if (edge < 0.0) discard;
  float printed = exp(-edge * 7.0);
  float scan = exp(-pow((vY - uScan) * 2.6, 2.0));
  float flick = 0.86 + 0.14 * sin(uTime * 31.0 + vY * 7.0) * sin(uTime * 7.3);
  gl_FragColor = vec4(uColor * flick + uHi * (0.9 * scan + 2.4 * printed), 1.0);
}`;
// The shell only glows at its silhouette, which is what makes the lines read as a body.
const SHELL_VS = `varying vec3 vN; varying vec3 vV; varying float vY;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vY = w.y; vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz);
  gl_Position = projectionMatrix * viewMatrix * w;
}`;
const SHELL_FS = `uniform vec3 uColor; uniform float uReveal;
varying vec3 vN; varying vec3 vV; varying float vY;
void main() {
  if (vY > uReveal) discard;
  float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.4);
  gl_FragColor = vec4(uColor * (0.04 + 0.8 * f), 1.0);
}`;

function buildThrower(T, scene) {
  const HOLO = new T.Color(0x4aa8ff), HOLO_HI = new T.Color(0xc6e6ff);
  const uniforms = { uColor: { value: HOLO.clone().multiplyScalar(1.7) }, uHi: { value: HOLO_HI.clone().multiplyScalar(1.5) },
    uTime: { value: 0 }, uReveal: { value: -10 }, uScan: { value: 0 } };
  const lineMat = new T.ShaderMaterial({ uniforms, vertexShader: LINE_VS, fragmentShader: LINE_FS, transparent: true, depthWrite: false, blending: T.AdditiveBlending });
  const shellMat = new T.ShaderMaterial({ uniforms: { uColor: { value: HOLO.clone().multiplyScalar(0.8) }, uReveal: uniforms.uReveal },
    vertexShader: SHELL_VS, fragmentShader: SHELL_FS, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide });
  const joint = (parent, x, y, z) => { const o = new T.Group(); o.position.set(x, y, z); parent.add(o); return o; };
  const part = (parent, prof, step, segs, seams, shape) => {
    const rings = resample(prof, step);
    const lg = loftLines(T, rings, segs, seams), sg = loftShell(T, rings, segs);
    if (shape) { shape(lg); shape(sg); }
    parent.add(new T.Mesh(sg, shellMat), new T.LineSegments(lg, lineMat));
  };

  const root = joint(scene, THROWER.x, 0, THROWER.z);            // faces -z, toward the far end
  const pelvis = joint(root, 0, HIP_Y, 0);
  const spine = joint(pelvis, 0, 0.1, 0);
  part(spine, PROFILE.torso, 0.1, 28, 10);
  const neck = joint(spine, 0, 1.74, 0);
  part(neck, PROFILE.neck, 0.1, 16, 6);
  const head = joint(neck, 0, 0.22, 0);
  part(head, PROFILE.head, 0.075, 24, 8);
  const headTop = joint(head, 0, 0.8, 0);
  const arm = (side) => {
    const sh = joint(spine, side * 0.62, 1.5, 0);
    part(sh, PROFILE.upper, 0.1, 16, 6);
    const el = joint(sh, 0, -1.0, 0);
    part(el, PROFILE.fore, 0.1, 14, 6);
    const wr = joint(el, 0, -0.88, 0);
    part(wr, PROFILE.hand, 0.08, 12, 4);
    return { sh, el, wr };
  };
  const R = arm(1), L = arm(-1);
  const palm = joint(R.wr, 0, -0.36, -0.05 - HALF * 0.8);        // where the die sits; the palm faces local -z
  const leg = (side) => {
    const hp = joint(pelvis, side * 0.32, 0, 0);
    part(hp, PROFILE.thigh, 0.11, 18, 6);
    const kn = joint(hp, 0, -THIGH, 0);
    part(kn, PROFILE.shin, 0.11, 16, 6);
    const an = joint(kn, 0, -SHIN, 0);
    part(an, PROFILE.foot, 0.09, 14, 5, (geo) => geo.rotateX(Math.PI / 2).translate(0, -0.14, 0));
    return { hp, kn, an };
  };
  const RL = leg(1), LL = leg(-1);

  // Feet planted in a throwing stance: left foot forward, right foot back.
  const FOOT_R = new T.Vector3(THROWER.x + 0.34, FLOOR + 0.25, THROWER.z + 0.3);
  const FOOT_L = new T.Vector3(THROWER.x - 0.34, FLOOR + 0.25, THROWER.z - 0.5);
  const tmp = new T.Vector3();
  // Two-bone IK in the leg's plane: knee forward, foot kept flat.
  function solveLeg(Lg, foot) {
    tmp.copy(foot);
    pelvis.worldToLocal(tmp);
    const dy = tmp.y - Lg.hp.position.y, dz = tmp.z - Lg.hp.position.z;
    const len = Math.min(Math.hypot(dy, dz), (THIGH + SHIN) * 0.999);
    const gam = Math.acos(clamp((THIGH * THIGH + SHIN * SHIN - len * len) / (2 * THIGH * SHIN), -1, 1));
    const del = Math.acos(clamp((THIGH * THIGH + len * len - SHIN * SHIN) / (2 * THIGH * len), -1, 1));
    Lg.hp.rotation.x = Math.atan2(-dz, -dy) + del;
    Lg.kn.rotation.x = -(Math.PI - gam);
    Lg.an.rotation.x = -(Lg.hp.rotation.x + Lg.kn.rotation.x);
  }
  function apply(p) {
    pelvis.position.y = HIP_Y + p.dy;
    pelvis.rotation.y = p.pt;
    spine.rotation.set(p.sx, p.sy, 0);
    neck.rotation.set(p.hx, 0, 0);
    R.sh.rotation.set(p.rsx, 0, p.rsz); R.el.rotation.x = p.rex; R.wr.rotation.x = p.rwx;
    L.sh.rotation.set(p.lsx, 0, p.lsz); L.el.rotation.x = p.lex; L.wr.rotation.x = p.lwx;
    root.updateMatrixWorld(true);
    solveLeg(RL, FOOT_R);
    solveLeg(LL, FOOT_L);
    root.updateMatrixWorld(true);
  }
  // The pose for a toss at time t: keyframes eased into each other, two fist
  // pumps after the sink, and the head tracking the die while it's in the air.
  function poseAt(t, k, dieY, dieDist) {
    if (!k) return { ...POSE.idle };
    const dl = k.delay;
    const keys = [[0, POSE.idle], [dl, POSE.idle], [dl + WIND_T, POSE.wind], [dl + REL_T, POSE.release, "in"], [dl + 1.1, POSE.follow, "out"],
      [k.tE - 0.15, POSE.watch], [k.tE + 0.2, POSE.pump], [k.tE + 0.8, POSE.pump], [k.end, POSE.idle]];
    let i = 0;
    while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
    const [t0, a] = keys[i], [t1, b, ease] = keys[i + 1];
    let u = t1 > t0 ? clamp((t - t0) / (t1 - t0)) : 1;
    u = ease === "in" ? u * u : ease === "out" ? 1 - (1 - u) * (1 - u) : smooth(u);
    const p = {};
    for (const key in a) p[key] = a[key] + (b[key] - a[key]) * u;
    const pa = t - (k.tE + 0.2);
    if (pa > 0 && pa < 0.6) { const wv = Math.sin(pa / 0.6 * Math.PI * 4) * (1 - pa / 0.6); p.rsx += 0.3 * wv; p.rex -= 0.2 * wv; }
    if (dieY !== undefined) {
      const wgt = Math.min(seg(t, dl + 0.85, dl + 1.05), 1 - seg(t, k.tE + 0.05, k.tE + 0.3));
      const headY = HIP_Y + p.dy + 1.84 + 0.4;
      const look = clamp(-Math.atan2(dieY - headY, Math.max(dieDist, 0.5)), -1.0, 0.35);
      p.hx = lerp(p.hx, look - p.sx, wgt);
    }
    return p;
  }
  function shade(time, revealY) {
    uniforms.uTime.value = time;
    uniforms.uReveal.value = revealY;
    uniforms.uScan.value = FLOOR + ((time * 1.5) % 7.5);
  }
  apply(POSE.idle);
  return { palm, headTop, apply, poseAt, shade };
}

// The projector pad under the thrower's feet.
function paintPad(c) {
  const g = c.getContext("2d"), W = c.width, r = W / 2;
  g.clearRect(0, 0, W, W);
  const grd = g.createRadialGradient(r, r, 0, r, r, r);
  grd.addColorStop(0, "rgba(255,255,255,.35)"); grd.addColorStop(0.5, "rgba(255,255,255,.08)"); grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd; g.fillRect(0, 0, W, W);
  g.strokeStyle = "rgba(255,255,255,.9)";
  for (const [k, lw, dash] of [[0.42, 3, []], [0.6, 2, [18, 10]], [0.78, 1.5, [4, 10]], [0.92, 1, []]]) {
    g.lineWidth = lw; g.setLineDash(dash); g.beginPath(); g.arc(r, r, r * k, 0, Math.PI * 2); g.stroke();
  }
  g.setLineDash([]);
}

''')

# ---------- in build(): sink effects, the figure, pad, rain, toss control and the frame ----------
block("  // Sink effects: a short column of light out of the cup mouth and a burst of sparks.", "  resize();\n  return { resize, frame, startToss", r'''  // Sink effects (as in 12): a short column of light out of the cup mouth and a burst of sparks.
  const colC = mk(16, 256);
  { const g = colC.getContext("2d"); const gr = g.createLinearGradient(0, 256, 0, 0); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 16, 256); }
  const column = new T.Mesh(new T.CylinderGeometry(CUP_R * 0.85, CUP_R * 0.9, 3, 40, 1, true).translate(0, 1.5, 0),
    new T.MeshBasicMaterial({ color: hot(0xf0cf62, 2.2), map: tex(colC), transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }));
  scene.add(column);
  const SPARKS = 36;
  const sparkGeo = new T.BufferGeometry();
  sparkGeo.setAttribute("position", new T.BufferAttribute(new Float32Array(SPARKS * 3), 3));
  sparkGeo.setAttribute("color", new T.BufferAttribute(new Float32Array(SPARKS * 3), 3));
  const sparks = new T.Points(sparkGeo, new T.PointsMaterial({ size: 0.16, map: dotTex, vertexColors: true, transparent: true, blending: T.AdditiveBlending, depthWrite: false }));
  sparks.frustumCulled = false;
  scene.add(sparks);
  const srnd = mulberry32(5), sparkV = [];
  for (let i = 0; i < SPARKS; i++) { const a = srnd() * Math.PI * 2, sp = 1.5 + srnd() * 3; sparkV.push([Math.cos(a) * sp * 0.45, 4 + srnd() * 5, Math.sin(a) * sp * 0.45]); }

  // The thrower, the projector pad under his feet, falling blue "code", and his blue spill on the table.
  const rig = buildThrower(T, scene);
  const padC = mk(512, 512);
  paintPad(padC);
  const pad = new T.Mesh(new T.PlaneGeometry(4.4, 4.4), new T.MeshBasicMaterial({ map: tex(padC), color: new T.Color(0x4aa8ff).multiplyScalar(1.3), transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false }));
  pad.rotation.x = -Math.PI / 2;
  pad.position.set(THROWER.x, FLOOR + 0.01, THROWER.z - 0.1);
  scene.add(pad);
  const holoLight = new T.PointLight(0x4aa8ff, 0, 12, 2);
  holoLight.position.set(THROWER.x, 1.4, THROWER.z - 0.6);
  scene.add(holoLight);
  const RAIN = 110, rain = [], rr = mulberry32(21);
  for (let i = 0; i < RAIN; i++) { const a = rr() * Math.PI * 2, rad = 0.5 + Math.sqrt(rr()) * 2.6; rain.push([THROWER.x + Math.cos(a) * rad, THROWER.z + Math.sin(a) * rad, 0.25 + rr() * 0.8, 2.5 + rr() * 4.5, rr()]); }
  const rainGeo = new T.BufferGeometry();
  rainGeo.setAttribute("position", new T.BufferAttribute(new Float32Array(RAIN * 6), 3));
  rainGeo.setAttribute("color", new T.BufferAttribute(new Float32Array(RAIN * 6), 3));
  const rainLines = new T.LineSegments(rainGeo, new T.LineBasicMaterial({ vertexColors: true, transparent: true, blending: T.AdditiveBlending, depthWrite: false }));
  rainLines.frustumCulled = false;
  scene.add(rainLines);
  // Each streak falls and wraps; the leading (lower) end is the bright one, like falling code.
  function updateRain(time, amt) {
    const p = rainGeo.attributes.position.array, col = rainGeo.attributes.color.array, top = 7.5, span = top - FLOOR;
    for (let i = 0; i < RAIN; i++) {
      const [x, z, len, sp, ph] = rain[i];
      const y = top - ((time * sp + ph * span) % span);
      p[i * 6] = x; p[i * 6 + 1] = y + len; p[i * 6 + 2] = z; p[i * 6 + 3] = x; p[i * 6 + 4] = y; p[i * 6 + 5] = z;
      const f = Math.min(1, (y - FLOOR) / 1.2) * amt;
      col[i * 6] = 0.02 * f; col[i * 6 + 1] = 0.08 * f; col[i * 6 + 2] = 0.22 * f;
      col[i * 6 + 3] = 0.3 * f; col[i * 6 + 4] = 0.75 * f; col[i * 6 + 5] = 1.7 * f;
    }
    rainGeo.attributes.position.needsUpdate = true;
    rainGeo.attributes.color.needsUpdate = true;
  }

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

  // Camera: a crane from straight overhead (the hero) to a side-on three-quarter
  // view from the right of the table, so the swing reads in profile and the arc
  // crosses the frame. Phones get a view from behind the thrower instead, where
  // the table's length runs up the tall screen. It rises with the die in flight.
  const P1W = new T.Vector3(12.5, 7.6, 3.0), T1W = new T.Vector3(0, 1.0, 0.4);
  const P1N = new T.Vector3(9.5, 9, 17.5), T1N = new T.Vector3(-0.4, 0.4, -0.4);
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

  function frame(time) {
    const c = easeInOut(seg(tau, 0, INTRO_END));
    const reveal = easeInOut(seg(tau, 0.45, 1.45));
    const st = toss ? tossState(toss, tossT) : null;

    // 1. The figure. While the die is out of the hand, he watches it.
    let dieY, dieDist;
    if (st && st.mode === "flight") { dieY = st.y; dieDist = Math.hypot(st.x - THROWER.x, st.z - THROWER.z); }
    else if (st && st.mode === "cup") { dieY = CUP_H; dieDist = Math.hypot(st.x - THROWER.x, st.z - THROWER.z); }
    rig.apply(rig.poseAt(toss ? tossT : 0, toss, dieY, dieDist));
    rig.shade(reduce ? 0 : time, FLOOR - 0.2 + 6.4 * reveal);

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
    if (toss && !reduce) { const a = tossT - toss.tE; if (a > 0 && a < 0.35) shake = 0.03 * Math.exp(-a * 14) * Math.sin(a * 80); }
    placeCamera(c, sf, shake);

    // 4. Table, cups and light (as in 12).
    strips.forEach((s) => { const k = easeOut(seg(tau, s.userData.t0, s.userData.t1)); s.scale.set(1, 1, Math.max(k, 0.0001)); s.visible = k > 0.001; });
    const grow = easeOut(seg(tau, 0.35, 1.1));
    cups.forEach((g, i) => {
      g.visible = grow > 0.01;
      const target = toss && toss.cup === CUPS[i];
      const a = target ? tossT - toss.tE : -1;
      const wob = a > 0 && !reduce ? 0.05 * Math.exp(-a * 5) * Math.sin(a * 30) : 0;
      g.rotation.set(wob, 0, wob * 0.6);
      g.scale.set(CUP_K, CUP_K * Math.max(grow, 0.01), CUP_K);
      const holds = (target && a > 0) || (!toss && restMode === "cup" && Math.hypot(restPos.x - CUPS[i].x, restPos.z - CUPS[i].z) < 0.3);
      g.userData.rim.color.copy(GOLD).multiplyScalar((holds ? 2.8 : 1.8) + (a > 0 ? 6 * Math.exp(-a * 4) : 0));
    });
    under.intensity = 6 * c;
    bloom.strength = lerp(0.25, 0.75, c);
    // Matte while overhead (the hero must read as a flat field); the lacquer's gloss arrives with the crane.
    topMat.clearcoat = lerp(0.001, 0.8, c * c);
    topMat.specularIntensity = lerp(0.08, 0.35, c);
    monoMat.opacity = 0.85 * seg(tau, 0.4, 1.2);

    // 5. The hologram's surroundings: pad, blue spill, and code rain that surges while he prints in.
    pad.material.opacity = 0.9 * seg(tau, 0.35, 0.9);
    pad.rotation.z = reduce ? 0 : time * 0.15;
    holoLight.intensity = 2.6 * reveal;
    updateRain(reduce ? 0 : time, 0.14 * seg(tau, 0.6, 1.4) + 0.8 * Math.sin(Math.PI * seg(tau, 0.3, 1.6)));

    // 6. Trail: the flight sampled a little in the past, fading toward black (additive).
    const pos = trailGeo.attributes.position.array, col = trailGeo.attributes.color.array;
    for (let i = 0; i < TRAIL; i++) {
      let a = 0;
      if (toss && !reduce) {
        const ti = tossT - i * 0.009;
        if (ti > toss.tr && ti < toss.tE) {
          const s2 = tossState(toss, ti);
          pos[i * 3] = s2.x; pos[i * 3 + 1] = s2.y; pos[i * 3 + 2] = s2.z;
          a = (1 - i / TRAIL) * clamp(Math.abs(s2.vy) / 8 + 0.35) * 0.9;
        }
      }
      col[i * 3] = a; col[i * 3 + 1] = a * 0.8; col[i * 3 + 2] = a * 0.35;
    }
    trailGeo.attributes.position.needsUpdate = true;
    trailGeo.attributes.color.needsUpdate = true;

    // 7. The sink (gold), and the reload (blue): out of the cup, then into the hand.
    ring.material.opacity = 0;
    column.material.opacity = 0;
    const spos = sparkGeo.attributes.position.array, scol = sparkGeo.attributes.color.array;
    scol.fill(0);
    if (toss && !reduce) {
      const a = tossT - toss.tE;
      if (a > 0 && a < 0.85) {
        const cx = toss.cup.x, cz = toss.cup.z;
        ring.position.set(cx, 0.01, cz);
        ring.scale.setScalar(0.9 + a * 5);
        ring.material.opacity = Math.pow(1 - a / 0.85, 2) * 0.8;
        column.position.set(cx, CUP_H, cz);
        column.scale.set(1, 0.3 + a * 1.4, 1);
        column.material.opacity = 0.55 * Math.exp(-a * 3.2);
        const f = clamp(1 - a / 0.85) * 0.9;
        for (let i = 0; i < SPARKS; i++) {
          const [vx, vy, vz] = sparkV[i];
          spos[i * 3] = cx + vx * a; spos[i * 3 + 1] = CUP_H + vy * a - 7 * a * a; spos[i * 3 + 2] = cz + vz * a;
          scol[i * 3] = f; scol[i * 3 + 1] = f * 0.8; scol[i * 3 + 2] = f * 0.35;
        }
      }
      if (st && st.mode === "reload") {
        const r = tossT / toss.delay, leaving = r < 0.4;
        const at = leaving ? toss.prev.p : pv, k = leaving ? r / 0.4 : (r - 0.4) / 0.6;
        const spread = leaving ? 0.15 + k * 0.9 : (1 - k) * 0.9, f = (leaving ? 1 - k : k) * 0.9;
        for (let i = 0; i < SPARKS; i++) {
          const [vx, vy, vz] = sparkV[i];
          spos[i * 3] = at.x + vx * 0.25 * spread; spos[i * 3 + 1] = at.y + (vy - 6.5) * 0.18 * spread; spos[i * 3 + 2] = at.z + vz * 0.25 * spread;
          scol[i * 3] = 0.15 * f; scol[i * 3 + 1] = 0.45 * f; scol[i * 3 + 2] = 1.1 * f;
        }
      }
    }
    sparkGeo.attributes.position.needsUpdate = true;
    sparkGeo.attributes.color.needsUpdate = true;

    if (!reduce) {
      const dd = dustGeo.attributes.position.array;
      for (let i = 0; i < DUST; i++) {
        dd[i * 3] = dustBase[i * 3] + Math.sin(time * 0.15 + i) * 0.25;
        dd[i * 3 + 1] = dustBase[i * 3 + 1] + Math.sin(time * 0.11 + i * 1.7) * 0.35;
      }
      dustGeo.attributes.position.needsUpdate = true;
    }

    composer.render();

    // HTML layers tied to the scene: the crest handoff, the die's reticle, the player tag.
    const out = { st: { h: Math.max(0, die.position.y - HALF), rate: st ? st.rate : 0, phase: st ? st.phase : restMode === "cup" ? "IN THE CUP" : "READY" } };
    if (tau < HANDOFF) out.face = screenBox(TOP);
    if (toss || tossCount) out.box = screenBox(ALL);
    rig.headTop.getWorldPosition(v).project(camera);
    out.tag = { x: (v.x + 1) / 2 * w, y: (1 - v.y) / 2 * h, o: seg(tau, 1.25, 1.6) };
    return out;
  }

''')

# ---------- page layer: place the player tag ----------
rep("""  landed.classList.toggle("on", tau >= INTRO_END && !live && tossCount > 0);""",
    """  landed.classList.toggle("on", tau >= INTRO_END && !live && tossCount > 0);
  if (out && out.tag && out.tag.o > 0) {
    ptag.style.opacity = out.tag.o;
    ptag.style.transform = `translate(${out.tag.x + 22}px, ${out.tag.y - 48}px)`;
  } else ptag.style.opacity = 0;""")

rep("  lamp.position.set(-8, 11, -2);   // off to the side, so its reflection never lands on the table as the camera cranes",
    "  lamp.position.set(8, 11, -2);    // on the camera's side, so its reflection never lands on the table as the camera cranes")
rep("""@media (max-width: 760px) {
  .hud__spec { display: none; }""",
    """@media (min-width: 761px) {
  .landed { left: auto; right: var(--gut-r); }   /* keeps the thrower clear */
}
@media (max-width: 760px) {
  .hud__spec { display: none; }""")
(d / "13-holo-thrower.html").write_text(s, encoding="utf-8")
print("wrote", d / "13-holo-thrower.html", len(s))
