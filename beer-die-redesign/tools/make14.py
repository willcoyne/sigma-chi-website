"""Build mockup 14 (Jacked Thrower) from mockup 13: same scene, a heavily muscled holographic figure."""
from pathlib import Path

d = Path(r"C:\Projects\sigma-chi-website\beer-die-redesign\mockups")
s = (d / "13-holo-thrower.html").read_text(encoding="utf-8")


def rep(old, new, count=1):
    global s
    assert s.count(old) == count, f"{s.count(old)}x: {old[:70]!r}"
    s = s.replace(old, new)


def between(start, end):
    i = s.index(start)
    return s[i:s.index(end, i)]


rep("<title>Beer Die Holo Thrower</title>", "<title>Beer Die Jacked Thrower</title>")
rep("""/* Concept 13 · Holo Thrower. Mockup 12 with a thrower: a featureless figure
   drawn only in blue contour lines prints itself in at the near end, lobs the
   die underhand, watches it and pumps a fist when it sinks. The figure is
   generated in code (no model file), so it stays inside the artifact CSP.
   Blue is the figure's alone; the table and die keep the navy and gold. */""",
    """/* Concept 14 · Jacked Thrower. Mockup 13 with a heavyweight build: every body
   part's cross-section is an ellipse swollen by Gaussian muscles (pecs, a
   six-pack, lats, traps, delts, biceps, quads, calves), and brighter lines
   trace the muscle borders. Still generated in code, still no model file.
   Blue is the figure's alone; the table and die keep the navy and gold. */""")
rep('<div class="chip" aria-hidden="true"><b>13</b> Holo Thrower</div>', '<div class="chip" aria-hidden="true"><b>14</b> Jacked Thrower</div>')
rep("const THROWER = { x: 0.2, z: 5.0 };         // where the figure stands, just off the near end",
    "const THROWER = { x: -0.1, z: 5.0 };        // where the figure stands, just off the near end")

resample_src = between("// Rings every `step` feet along a profile", "function loftLines(")
shader_src = between("// Contour lines: printed in from the floor up", "function buildThrower(T, scene) {")
old_rig = between("// ---------- The thrower ----------", "// The projector pad under the thrower's feet.")
solve_to_end = old_rig[old_rig.index("  const tmp = new T.Vector3();"):]          # IK, apply, poseAt, shade, return

new_rig = r'''// ---------- The thrower ----------
// A featureless, heavily muscled figure drawn only in blue contour lines.
// Each body part is a loft whose cross-section is an ellipse swollen by
// Gaussian "muscles": bulges placed by angle around the part and height
// along it. Brighter lines trace the muscle borders, so the definition reads
// from the front and not only in silhouette. Joints are plain groups, and
// the legs are solved every frame so the feet stay planted.
const HIP_Y = 0.55, THIGH = 1.45, SHIN = 1.42;
const TAU = Math.PI * 2, FR = -Math.PI / 2, BK = Math.PI / 2;   // around a part: +x is 0, the front (-z) FR, the back BK
// Joint angles in radians. Positive swing at shoulder and elbow is forward,
// toward the far end. The arms hang wider than 13's: the lats push them out.
const POSE = {
  idle:    { dy: 0, pt: 0, sx: 0.04, sy: 0, hx: 0.1, rsx: 0.3, rsz: 0.3, rex: 1.25, rwx: 0.1, lsx: 0.05, lsz: -0.3, lex: 0.3, lwx: 0 },
  wind:    { dy: -0.28, pt: -0.12, sx: 0.28, sy: -0.32, hx: -0.12, rsx: -0.75, rsz: 0.32, rex: 0.25, rwx: -0.45, lsx: 0.45, lsz: -0.32, lex: 0.55, lwx: 0 },
  release: { dy: 0.02, pt: 0.08, sx: 0.02, sy: 0.18, hx: -0.2, rsx: 1.45, rsz: 0.22, rex: 0.12, rwx: 0.35, lsx: -0.35, lsz: -0.34, lex: 0.35, lwx: 0 },
  follow:  { dy: 0.06, pt: 0.12, sx: -0.08, sy: 0.22, hx: -0.45, rsx: 2.35, rsz: 0.22, rex: 0.18, rwx: 0.4, lsx: -0.15, lsz: -0.36, lex: 0.4, lwx: 0 },
  watch:   { dy: 0, pt: 0.08, sx: -0.04, sy: 0.15, hx: -0.3, rsx: 1.2, rsz: 0.28, rex: 0.4, rwx: 0.2, lsx: 0, lsz: -0.3, lex: 0.35, lwx: 0 },
  pump:    { dy: 0.04, pt: 0.05, sx: -0.02, sy: 0.1, hx: -0.12, rsx: 1.75, rsz: 0.55, rex: 1.35, rwx: 0, lsx: 0.1, lsz: -0.3, lex: 0.5, lwx: 0 },
};

// Part specs. prof is [height along the part, half-width, half-depth] in feet;
// bumps are [angle, height, angular width, height width, swell];
// defs are muscle-border lines through [angle, height] points.
const ABS = [0.44, 0.66, 0.88];
const TRUNK = {
  torso: { prof: [[-0.26, 0.44, 0.3], [-0.1, 0.56, 0.36], [0.12, 0.56, 0.35], [0.42, 0.47, 0.31], [0.75, 0.56, 0.34], [1.05, 0.7, 0.4], [1.3, 0.76, 0.43], [1.5, 0.74, 0.39], [1.66, 0.6, 0.34], [1.8, 0.36, 0.27], [1.88, 0.25, 0.22]],
    step: 0.12, segs: 44, seams: 8,
    bumps: [
      [FR - 0.45, 1.3, 0.42, 0.16, 0.18], [FR + 0.45, 1.3, 0.42, 0.16, 0.18],                              // pecs
      ...ABS.flatMap((y) => [[FR - 0.22, y, 0.16, 0.085, 0.09], [FR + 0.22, y, 0.16, 0.085, 0.09]]),         // six-pack
      [0.45, 1.05, 0.5, 0.32, 0.16], [Math.PI - 0.45, 1.05, 0.5, 0.32, 0.16],                              // lats
      [BK, 1.66, 0.85, 0.15, 0.2], [BK - 0.9, 1.72, 0.45, 0.14, 0.16], [BK + 0.9, 1.72, 0.45, 0.14, 0.16],   // traps
      [BK - 0.14, 0.5, 0.12, 0.35, 0.05], [BK + 0.14, 0.5, 0.12, 0.35, 0.05],                              // spinal erectors
      [BK - 0.38, -0.08, 0.38, 0.15, 0.13], [BK + 0.38, -0.08, 0.38, 0.15, 0.13],                          // glutes
    ],
    defs: [
      [[FR, 0.3], [FR, 1.12]],                                                                              // down the middle
      [[FR - 0.36, 0.55], [FR + 0.36, 0.55]], [[FR - 0.36, 0.77], [FR + 0.36, 0.77]],                     // ab rows
      [[FR - 0.95, 1.4], [FR - 0.6, 1.16], [FR - 0.2, 1.12], [FR, 1.13], [FR + 0.2, 1.12], [FR + 0.6, 1.16], [FR + 0.95, 1.4]],   // under the pecs
      [[FR, 1.13], [FR, 1.52]],
      [[FR - 0.4, 0.3], [FR - 0.44, 0.7], [FR - 0.46, 1.08]], [[FR + 0.4, 0.3], [FR + 0.44, 0.7], [FR + 0.46, 1.08]],   // outer ab edges
      [[FR - 0.6, 0.38], [FR - 0.28, 0.12], [FR - 0.1, -0.05]], [[FR + 0.6, 0.38], [FR + 0.28, 0.12], [FR + 0.1, -0.05]],   // the V
      [[BK, 0.1], [BK, 1.6]],                                                                               // spine
      [[BK - 1.1, 1.7], [BK - 0.5, 1.5], [BK, 1.25], [BK + 0.5, 1.5], [BK + 1.1, 1.7]],                   // trap border
    ] },
  neck: { prof: [[-0.08, 0.27, 0.24], [0.12, 0.23, 0.21], [0.3, 0.21, 0.19]], step: 0.08, segs: 22, seams: 6,
    bumps: [[FR - 0.6, 0.1, 0.3, 0.15, 0.06], [FR + 0.6, 0.1, 0.3, 0.15, 0.06]] },
  head: { prof: [[0, 0.13, 0.13], [0.06, 0.23, 0.25], [0.21, 0.29, 0.31], [0.4, 0.29, 0.32], [0.57, 0.26, 0.28], [0.68, 0.17, 0.2], [0.75, 0.04, 0.05]], step: 0.07, segs: 28, seams: 8 },
  foot: { prof: [[0.18, 0.09, 0.08], [0.05, 0.13, 0.11], [-0.3, 0.15, 0.09], [-0.62, 0.14, 0.06], [-0.76, 0.06, 0.04]], step: 0.08, segs: 16, seams: 5 },
};
// Limbs, mirrored by side: s is +1 for the right, -1 for the left.
function limbSpec(s) {
  const lat = s > 0 ? 0 : Math.PI, med = s > 0 ? Math.PI : 0;
  return {
    upper: { prof: [[0.12, 0.21, 0.21], [0, 0.28, 0.28], [-0.2, 0.26, 0.26], [-0.55, 0.23, 0.23], [-0.9, 0.16, 0.16], [-1.02, 0.14, 0.14]], step: 0.11, segs: 28, seams: 6,
      bumps: [[lat, -0.12, 0.95, 0.2, 0.2], [FR + s * 0.55, -0.05, 0.5, 0.16, 0.12], [BK - s * 0.55, -0.05, 0.5, 0.16, 0.1],   // delts
        [FR, -0.55, 0.6, 0.22, 0.21], [BK, -0.42, 0.65, 0.26, 0.12], [BK - s * 0.5, -0.32, 0.4, 0.18, 0.08]],                  // biceps, triceps
      defs: [[[FR + s * 0.3, -0.02], [lat, -0.45], [BK - s * 0.3, -0.02]], [[lat, -0.48], [lat, -0.92]], [[med, -0.3], [med, -0.9]]] },
    fore: { prof: [[0.06, 0.15, 0.15], [-0.18, 0.19, 0.17], [-0.5, 0.15, 0.13], [-0.85, 0.095, 0.075], [-0.9, 0.09, 0.07]], step: 0.11, segs: 24, seams: 6,
      bumps: [[FR + s * 0.7, -0.2, 0.55, 0.2, 0.16], [FR - s * 0.6, -0.25, 0.5, 0.22, 0.08]],
      defs: [[[FR + s * 0.25, -0.05], [FR + s * 0.05, -0.6]]] },
    hand: { prof: [[0.02, 0.09, 0.06], [-0.12, 0.12, 0.065], [-0.35, 0.12, 0.06], [-0.5, 0.085, 0.05], [-0.6, 0.02, 0.02]], step: 0.08, segs: 14, seams: 4 },
    thigh: { prof: [[0.12, 0.3, 0.3], [-0.08, 0.35, 0.36], [-0.6, 0.29, 0.3], [-1.25, 0.2, 0.21], [-1.48, 0.17, 0.18]], step: 0.12, segs: 28, seams: 6,
      bumps: [[FR, -0.6, 0.45, 0.42, 0.13], [FR + s * 0.75, -0.65, 0.55, 0.4, 0.14], [FR - s * 0.55, -1.12, 0.38, 0.18, 0.18],      // quads, teardrop
        [BK, -0.6, 0.6, 0.45, 0.07], [med, -0.25, 0.5, 0.3, 0.06]],
      defs: [[[FR + s * 0.35, -0.15], [FR + s * 0.2, -1.2]], [[FR - s * 0.3, -0.3], [FR - s * 0.35, -0.95], [FR - s * 0.15, -1.3]]] },
    shin: { prof: [[0.06, 0.17, 0.18], [-0.32, 0.2, 0.22], [-0.85, 0.13, 0.14], [-1.38, 0.09, 0.1], [-1.44, 0.09, 0.1]], step: 0.12, segs: 26, seams: 6,
      bumps: [[BK + s * 0.38, -0.42, 0.38, 0.24, 0.26], [BK - s * 0.38, -0.36, 0.36, 0.22, 0.2], [FR + s * 0.3, -0.45, 0.3, 0.35, 0.07]],   // calves
      defs: [[[BK, -0.2], [BK, -0.65]], [[BK - 0.6, -0.55], [BK, -0.78], [BK + 0.6, -0.55]]] },
  };
}

''' + resample_src + r'''const wrapA = (a) => Math.atan2(Math.sin(a), Math.cos(a));
// Radius of a section at angle th: the ellipse, swollen by every muscle nearby.
function sectionRadius(rx, rz, th, y, bumps) {
  const c = Math.cos(th), sn = Math.sin(th);
  const r = (rx * rz) / Math.sqrt((rz * c) * (rz * c) + (rx * sn) * (rx * sn));
  let k = 0;
  for (const [tc, yc, wt, wy, amp] of bumps) {
    const dt = wrapA(th - tc) / wt, dh = (y - yc) / wy;
    k += amp * Math.exp(-dt * dt - dh * dh);
  }
  return r * (1 + k);
}
// One part's three geometries: contour rings and seams, muscle-border lines, and the rim-lit shell.
function muscleParts(T, spec) {
  const rings = resample(spec.prof, spec.step);
  const bumps = spec.bumps || [], segs = spec.segs, seams = spec.seams;
  const asc = rings[rings.length - 1][0] > rings[0][0];
  const radAt = (y) => {
    let i = 0;
    while (i < rings.length - 2 && (asc ? y > rings[i + 1][0] : y < rings[i + 1][0])) i++;
    const a = rings[i], b = rings[i + 1], t = clamp((y - a[0]) / ((b[0] - a[0]) || 1));
    return [lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  };
  const P = (th, y, rx, rz, out = 1) => { const r = sectionRadius(rx, rz, th, y, bumps) * out; return [Math.cos(th) * r, y, Math.sin(th) * r]; };
  const line = [], def = [], pos = [], idx = [];
  for (const [y, rx, rz] of rings) for (let j = 0; j < segs; j++) line.push(...P(j / segs * TAU, y, rx, rz), ...P((j + 1) / segs * TAU, y, rx, rz));
  for (let m = 0; m < seams; m++) {
    const a = m / seams * TAU + 0.2;
    for (let i = 0; i < rings.length - 1; i++) line.push(...P(a, rings[i][0], rings[i][1], rings[i][2]), ...P(a, rings[i + 1][0], rings[i + 1][1], rings[i + 1][2]));
  }
  for (const curve of spec.defs || []) {
    const pts = [];
    for (let k = 0; k < curve.length - 1; k++) {
      const [ta, ya] = curve[k], [tb, yb] = curve[k + 1], dt = wrapA(tb - ta);
      for (let n = k ? 1 : 0; n <= 8; n++) { const u = n / 8, y = lerp(ya, yb, u); pts.push(P(ta + dt * u, y, ...radAt(y), 1.012)); }
    }
    for (let k = 0; k < pts.length - 1; k++) def.push(...pts[k], ...pts[k + 1]);
  }
  for (const [y, rx, rz] of rings) for (let j = 0; j <= segs; j++) pos.push(...P(j / segs * TAU, y, rx, rz));
  for (let i = 0; i < rings.length - 1; i++) for (let j = 0; j < segs; j++) { const a = i * (segs + 1) + j, b = a + segs + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const geo = (arr) => { const g = new T.BufferGeometry(); g.setAttribute("position", new T.Float32BufferAttribute(arr, 3)); return g; };
  const shell = geo(pos);
  shell.setIndex(idx);
  shell.computeVertexNormals();
  return { line: geo(line), def: def.length ? geo(def) : null, shell };
}

''' + shader_src + r'''function buildThrower(T, scene) {
  const HOLO = new T.Color(0x4aa8ff), HOLO_HI = new T.Color(0xc6e6ff);
  const uniforms = { uColor: { value: HOLO.clone().multiplyScalar(1.0) }, uHi: { value: HOLO_HI.clone().multiplyScalar(1.2) },
    uTime: { value: 0 }, uReveal: { value: -10 }, uScan: { value: 0 } };
  const lineMat = new T.ShaderMaterial({ uniforms, vertexShader: LINE_VS, fragmentShader: LINE_FS, transparent: true, depthWrite: false, blending: T.AdditiveBlending });
  // Muscle borders: the same print-in and scan, drawn brighter and whiter.
  const defMat = new T.ShaderMaterial({ uniforms: { ...uniforms, uColor: { value: HOLO_HI.clone().multiplyScalar(1.5) } },
    vertexShader: LINE_VS, fragmentShader: LINE_FS, transparent: true, depthWrite: false, blending: T.AdditiveBlending });
  const shellMat = new T.ShaderMaterial({ uniforms: { uColor: { value: HOLO.clone().multiplyScalar(0.45) }, uReveal: uniforms.uReveal },
    vertexShader: SHELL_VS, fragmentShader: SHELL_FS, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide });
  const stats = { segments: 0, shellTriangles: 0, drawCalls: 0 };
  const joint = (parent, x, y, z) => { const o = new T.Group(); o.position.set(x, y, z); parent.add(o); return o; };
  const part = (parent, spec, shape) => {
    const m = muscleParts(T, spec);
    if (shape) for (const g of [m.line, m.def, m.shell]) if (g) shape(g);
    parent.add(new T.Mesh(m.shell, shellMat), new T.LineSegments(m.line, lineMat));
    if (m.def) parent.add(new T.LineSegments(m.def, defMat));
    stats.segments += (m.line.attributes.position.count + (m.def ? m.def.attributes.position.count : 0)) / 2;
    stats.shellTriangles += m.shell.index.count / 3;
    stats.drawCalls += m.def ? 3 : 2;
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
    part(el, B.fore);
    const wr = joint(el, 0, -0.88, 0);
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
    part(kn, B.shin);
    const an = joint(kn, 0, -SHIN, 0);
    part(an, TRUNK.foot, (geo) => geo.rotateX(Math.PI / 2).translate(0, -0.14, 0));
    return { hp, kn, an };
  };
  const RL = leg(1), LL = leg(-1);
  window.__figureStats = stats;

  // Feet planted in a wide throwing stance: left foot forward, right foot back.
  const FOOT_R = new T.Vector3(THROWER.x + 0.4, FLOOR + 0.25, THROWER.z + 0.3);
  const FOOT_L = new T.Vector3(THROWER.x - 0.4, FLOOR + 0.25, THROWER.z - 0.5);
''' + solve_to_end

i = s.index("// ---------- The thrower ----------")
j = s.index("// The projector pad under the thrower's feet.")
s = s[:i] + new_rig + s[j:]
assert "FOOT_R = new T.Vector3(THROWER.x + 0.34" not in s
rep("""  // Camera: a crane from straight overhead (the hero) to a side-on three-quarter
  // view from the right of the table, so the swing reads in profile and the arc
  // crosses the frame. Phones get a view from behind the thrower instead, where
  // the table's length runs up the tall screen. It rises with the die in flight.
  const P1W = new T.Vector3(12.5, 7.6, 3.0), T1W = new T.Vector3(0, 1.0, 0.4);""",
    """  // Camera: a crane from straight overhead (the hero) to a front three-quarter
  // view from the far half of the right side, looking back at the thrower, so
  // his build faces the camera (chest, abs, the V) and the arc still crosses
  // the frame toward the cups. Phones get a view from behind the thrower, where
  // the table's length runs up the tall screen. It rises with the die in flight.
  const P1W = new T.Vector3(11, 6.5, -2), T1W = new T.Vector3(0, 1.2, 1.5);""")
rep("  .landed { left: auto; right: var(--gut-r); }   /* keeps the thrower clear */",
    "  .landed { left: auto; right: var(--gut-r); bottom: auto; top: calc(var(--nav-h) + 84px); }   /* clear of the thrower and the cups */")
(d / "14-jacked-thrower.html").write_text(s, encoding="utf-8")
print("wrote", d / "14-jacked-thrower.html", len(s))
