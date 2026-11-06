"""Build mockup 12 (Cup Sink) from mockup 11: same page, the toss ends in a cup."""
from pathlib import Path

d = Path(r"C:\Projects\sigma-chi-website\beer-die-redesign\mockups")
s = (d / "11-glow-toss.html").read_text(encoding="utf-8")


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


# ---------- names ----------
rep("<title>Beer Die Glow Toss</title>", "<title>Beer Die Cup Sink</title>")
rep("""/* Concept 11 · Glow Toss. A lit, physically based table and die behind
   today's hero. One small scroll (or the cue) plays the whole toss on its own
   clock, so there is no long scrubbed scroll; scrolling back to the top
   rewinds it. Gold is the only light source colour that glows. */""",
    """/* Concept 12 · Cup Sink. Mockup 11 with one change: the toss ends in a cup.
   The die clears the rim on a gravity arc, drops in, rattles off the wall and
   settles crest up, and the cup answers with a gold flash. Everything else
   (one scroll plays it, the top of the page rewinds it) is as in 11. */""")
rep('<div class="chip" aria-hidden="true"><b>11</b> Glow Toss</div>', '<div class="chip" aria-hidden="true"><b>12</b> Cup Sink</div>')
rep('TOSS <b id="rRoll">01</b></div>', 'TOSS <b id="rRoll">01</b> · TARGET <b id="rTarget">FAR R</b></div>')
rep('const rAlt = $("rAlt"), rSpin = $("rSpin"), rPhase = $("rPhase"), rRoll = $("rRoll");',
    'const rAlt = $("rAlt"), rSpin = $("rSpin"), rPhase = $("rPhase"), rRoll = $("rRoll"), rTarget = $("rTarget");')
rep("const easeOut = (t) => 1 - Math.pow(1 - t, 3);",
    "const easeOut = (t) => 1 - Math.pow(1 - t, 3);\nconst easeOutBack = (t) => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2);")

# ---------- sizes: the die has to fit the cup ----------
rep("const S = 0.5, HALF = S / 2, ROUND = S * 0.15;    // die edge (stylised: a real one is 5/8 in)",
    "const S = 0.38, HALF = S / 2, ROUND = S * 0.15;   // die edge (stylised: a real one is 5/8 in)")
rep("const SPOTS = [{ x: 0.0, z: 2.85 }, { x: 0.35, z: -2.5 }];",
    """const SPOTS = [{ x: 0.0, z: 2.85 }, { x: 0.3, z: -2.6 }];   // throwing spots: near end, far end
// Cups are drawn larger than life (8 in across) so the stylised die fits inside.
const CUP_K = 1.35, CUP_H = 0.622 * CUP_K, CUP_R = 0.25 * CUP_K, REST_IN = 0.42;   // die bottom rests 5 in up inside
const CUPS = [{ x: -1.45, z: -3.35, name: "FAR L" }, { x: 1.45, z: -3.35, name: "FAR R" }, { x: -1.45, z: 3.35, name: "NEAR L" }, { x: 1.45, z: 3.35, name: "NEAR R" }];""")

# ---------- toss physics ----------
block("function makeToss(from, to, q0, T) {", "// ---------- Painters ----------", r'''// A toss from a throwing spot into a cup: one gravity arc that ends just over
// the rim, a free fall inside, a hop off the bottom and a rattle against the
// wall that settles crest up. `delay` holds the die on its spot first (used
// when it has to pop back out of a cup before the next throw).
function makeToss(from, cup, q0, T, delay = 0) {
  const rnd = mulberry32(seed++);
  const flight = 1.2;
  const A = G * flight * flight / 8;                       // gravity term of the arc (≈ 5.8 ft)
  const entry = CUP_H + 0.04;                              // die bottom just clears the rim
  const drop = Math.sqrt(2 * (entry - REST_IN) / G);       // free fall inside the cup
  const hop = 0.07, dHop = 2 * Math.sqrt(2 * hop / G);     // one small bounce off the bottom
  const settle = 0.55;
  const i1 = delay + flight, i2 = i1 + drop, i3 = i2 + dHop, end = i3 + settle;
  const dir = new T.Vector3(cup.x - from.x, 0, cup.z - from.z).normalize();
  const axis = new T.Vector3().crossVectors(new T.Vector3(0, 1, 0), dir);   // topspin
  axis.x += (rnd() - 0.5) * 0.4; axis.y += (rnd() - 0.5) * 0.3; axis.z += (rnd() - 0.5) * 0.4;
  axis.normalize();
  const tiltAxis = new T.Vector3(rnd() - 0.5, 0, rnd() - 0.5).normalize();
  const rattle = { x: (rnd() - 0.5) * 0.12, z: (rnd() - 0.5) * 0.12 };
  return { from: { ...from }, cup, q0: q0.clone(), axis, tiltAxis, rattle, yaw: (rnd() - 0.5) * 1.6,
    A, entry, flight, drop, hop, dHop, settle, delay, i1, i2, i3, end, turns: 3 };
}

// Pure pose for a toss at time t. h is the height of the die's lowest point
// above the table; the flight spins whole turns, so it enters crest up.
function tossState(k, t) {
  const yawT = easeInOut(clamp((t - k.delay) / (k.end - k.delay)));
  const T2 = k.turns * 2 * Math.PI;
  if (t <= k.delay) return { x: k.from.x, z: k.from.z, h: 0, ang: 0, tilt: 0, rate: 0, yawT: 0, phase: "READY", vy: 0, inCup: false };
  if (t < k.i1) {
    const u = (t - k.delay) / k.flight;
    const vy = (k.entry + 4 * k.A * (1 - 2 * u)) / k.flight;
    const phase = u < 0.1 ? "RELEASE" : u > 0.8 ? "ON TARGET" : Math.abs(vy) < 3 ? "APEX" : vy > 0 ? "RISING" : "FALLING";
    return { x: lerp(k.from.x, k.cup.x, u), z: lerp(k.from.z, k.cup.z, u), h: k.entry * u + 4 * k.A * u * (1 - u),
      ang: T2 * u, tilt: 0, rate: T2 / k.flight, yawT, phase, vy, inCup: false };
  }
  const a = t - k.i1;                                       // time since it cleared the rim
  const knock = Math.exp(-6 * a) * Math.sin(26 * a);
  const x = k.cup.x + k.rattle.x * knock, z = k.cup.z + k.rattle.z * knock;
  const tilt = 0.08 + 0.3 * knock;                          // knocks the wall, ends leaning a little
  if (t < k.i2) {
    const td = t - k.i1;
    return { x, z, h: k.entry - 0.5 * G * td * td, ang: T2, tilt, rate: 0, yawT, phase: "SINK", vy: -G * td, inCup: true };
  }
  if (t < k.i3) {
    const u = (t - k.i2) / k.dHop;
    return { x, z, h: REST_IN + 4 * k.hop * u * (1 - u), ang: T2, tilt, rate: 0, yawT, phase: "RATTLE", vy: 0, inCup: true };
  }
  return { x, z, h: REST_IN, ang: T2, tilt, rate: 0, yawT, phase: t < k.end ? "RATTLE" : "IN THE CUP", vy: 0, inCup: true };
}

''')

# ---------- cups: bigger, each with its own rim so the target can flash ----------
block("  // Cups: frosted glass, empty, with a lit gold rim.", "  // The die: rounded, clear-coated navy", r'''  // Cups: frosted glass, empty, with a lit gold rim. Each rim has its own
  // material so the cup that catches the die can flash and stay lit.
  const profile = [[0, 0], [0.15, 0], [0.158, 0.015], [0.235, 0.6], [0.25, 0.615], [0.24, 0.622], [0.226, 0.6], [0.148, 0.03], [0, 0.03]].map(([x, y]) => new T.Vector2(x, y));
  const cupGeo = new T.LatheGeometry(profile, 64);
  const glass = new T.MeshPhysicalMaterial({ color: 0xfff4dc, roughness: 0.18, transmission: 0.92, thickness: 0.05, ior: 1.5, clearcoat: 1, envMapIntensity: 1.2, side: T.DoubleSide });
  const rimGeo = new T.TorusGeometry(0.245, 0.012, 10, 64);
  const GOLD = new T.Color(0xc9a227);
  const cups = CUPS.map(({ x, z }) => {
    const grp = new T.Group();
    const body = new T.Mesh(cupGeo, glass); body.castShadow = true;
    const rimMat = new T.MeshBasicMaterial({ color: GOLD.clone().multiplyScalar(1.8) });
    const rimMesh = new T.Mesh(rimGeo, rimMat); rimMesh.rotation.x = Math.PI / 2; rimMesh.position.y = 0.613;
    grp.add(body, rimMesh); grp.position.set(x, 0, z);
    grp.userData.rim = rimMat;
    scene.add(grp);
    return grp;
  });

''')

# ---------- toss control, sink effects and the frame ----------
block("  const q = new T.Quaternion(), qa = new T.Quaternion()", "  resize();\n  return { resize, frame, startToss", r'''  // Sink effects: a short column of light out of the cup mouth and a burst of sparks.
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

  const q = new T.Quaternion(), qa = new T.Quaternion(), qy = new T.Quaternion(), qt = new T.Quaternion(), UP = new T.Vector3(0, 1, 0);
  const m4 = new T.Matrix4(), v = new T.Vector3();
  let restQ = new T.Quaternion(), rest = { ...SPOTS[0] }, restH = 0, again = 0;
  let mx = 0, my = 0, smx = 0, smy = 0, sf = 0, aimX = 0;
  addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });

  // The intro throws from the near end into the far-right cup. "Toss again"
  // alternates ends, as players do, and works round the other cups.
  const AGAIN = [[1, 2], [0, 0], [1, 3], [0, 1]];          // [throwing spot, cup]
  function place(spot) { rest = { ...SPOTS[spot] }; restH = 0; restQ = new T.Quaternion(); }
  function startToss(kind) {
    let from = 0, cupI = 1;
    if (kind !== "intro") { [from, cupI] = AGAIN[again % AGAIN.length]; again++; }
    const moved = restH > 0 || Math.hypot(rest.x - SPOTS[from].x, rest.z - SPOTS[from].z) > 0.05;
    if (moved) place(from);
    toss = makeToss(rest, CUPS[cupI], restQ, T, moved ? 0.45 : 0);
    tossT = 0;
    tossCount++;
    rRoll.textContent = String(tossCount).padStart(2, "0");
    rTarget.textContent = CUPS[cupI].name;
  }
  function finishToss() {
    if (!toss) return;
    const st = tossState(toss, toss.end);
    poseDie(toss, st);
    restQ = die.quaternion.clone();
    rest = { x: st.x, z: st.z };
    restH = st.h;
    toss = null;
  }
  // Rewinding to the hero: the die goes back to the near spot so the crest can return from it.
  function reset() { if (toss) finishToss(); if (restH > 0) place(0); }

  // Die pose from a toss state: tumble, then the lean inside the cup, then lift
  // the centre so the lowest corner sits at the requested height.
  function poseDie(k, st) {
    if (k) {
      qa.setFromAxisAngle(k.axis, st.ang);
      qt.setFromAxisAngle(k.tiltAxis, st.tilt);
      qy.setFromAxisAngle(UP, k.yaw * st.yawT);
      q.copy(qt).multiply(qa).multiply(qy).multiply(k.q0);
    } else q.copy(restQ);
    die.quaternion.copy(q);
    m4.makeRotationFromQuaternion(q);
    const e = m4.elements;
    const low = (HALF - ROUND) * (Math.abs(e[1]) + Math.abs(e[5]) + Math.abs(e[9])) + ROUND;
    die.position.set(st.x, low + st.h, st.z);
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

  function frame(time) {
    // Camera crane: an arc from straight down to a player's-eye view at the near end.
    const c = easeInOut(seg(tau, 0, INTRO_END));
    const phi = 1.02 * c;
    const r = Math.exp(lerp(Math.log(r0), Math.log(r1), c));
    const st = toss ? tossState(toss, tossT)
      : { x: rest.x, z: rest.z, h: restH, ang: 0, tilt: 0, rate: 0, yawT: 0, phase: restH > 0 ? "IN THE CUP" : "READY", vy: 0, inCup: restH > 0 };
    poseDie(toss, st);
    // Popping back out onto the throwing spot before the next toss.
    const pop = toss && toss.delay > 0 && tossT < toss.delay ? easeOutBack(clamp(tossT / (toss.delay * 0.8))) : 1;
    die.scale.setScalar(Math.max(pop, 0.001));
    die.updateMatrixWorld();

    // The camera rises with the die in flight and leans toward the target cup.
    sf += ((toss && !st.inCup ? st.h : 0) - sf) * 0.12;
    aimX += ((toss ? toss.cup.x : restH > 0 ? rest.x : 0) * 0.25 * c - aimX) * 0.04;
    smx += (mx - smx) * 0.05; smy += (my - smy) * 0.05;
    let shake = 0;
    if (toss && !reduce) { const a = tossT - toss.i1; if (a > 0 && a < 0.35) shake = 0.03 * Math.exp(-a * 14) * Math.sin(a * 80); }
    const ty = lerp(0, 0.75, c) + 0.42 * sf;
    const tz = lerp(zc0, 0.3, c);
    camera.position.set(aimX + smx * 0.9 * c, ty + r * Math.cos(phi) + shake - smy * 0.4 * c, tz + r * Math.sin(phi));
    camera.rotation.set(-Math.PI / 2 + phi + 0.035 * sf, -smx * 0.035 * c - aimX * 0.06, 0);
    camera.updateMatrixWorld();

    strips.forEach((s) => { const k = easeOut(seg(tau, s.userData.t0, s.userData.t1)); s.scale.set(1, 1, Math.max(k, 0.0001)); s.visible = k > 0.001; });
    const grow = easeOut(seg(tau, 0.35, 1.1));
    cups.forEach((g, i) => {
      g.visible = grow > 0.01;
      const target = toss && toss.cup === CUPS[i];
      const a = target ? tossT - toss.i1 : -1;
      const wob = a > 0 && !reduce ? 0.05 * Math.exp(-a * 5) * Math.sin(a * 30) : 0;
      g.rotation.set(wob, 0, wob * 0.6);
      g.scale.set(CUP_K, CUP_K * Math.max(grow, 0.01), CUP_K);
      const holds = (target && a > 0) || (!toss && restH > 0 && Math.hypot(rest.x - CUPS[i].x, rest.z - CUPS[i].z) < 0.3);
      g.userData.rim.color.copy(GOLD).multiplyScalar((holds ? 2.8 : 1.8) + (a > 0 ? 6 * Math.exp(-a * 4) : 0));
    });
    die.visible = tau >= HANDOFF;
    under.intensity = 6 * c;
    bloom.strength = lerp(0.25, 0.75, c);
    // Matte while overhead (the hero must read as a flat field); the lacquer's gloss arrives with the crane.
    topMat.clearcoat = lerp(0.001, 0.8, c * c);
    topMat.specularIntensity = lerp(0.08, 0.35, c);
    monoMat.opacity = 0.85 * seg(tau, 0.4, 1.2);

    // Trail: the same deterministic path sampled a little in the past, fading toward black (additive).
    const pos = trailGeo.attributes.position.array, col = trailGeo.attributes.color.array;
    for (let i = 0; i < TRAIL; i++) {
      let a = 0;
      if (toss && !reduce) {
        const ti = tossT - i * 0.009;
        if (ti > toss.delay && ti < toss.i1) {
          const s2 = tossState(toss, ti);
          pos[i * 3] = s2.x; pos[i * 3 + 1] = HALF + s2.h; pos[i * 3 + 2] = s2.z;
          a = (1 - i / TRAIL) * clamp(Math.abs(s2.vy) / 8 + 0.35) * 0.9;
        }
      }
      col[i * 3] = a; col[i * 3 + 1] = a * 0.8; col[i * 3 + 2] = a * 0.35;
    }
    trailGeo.attributes.position.needsUpdate = true;
    trailGeo.attributes.color.needsUpdate = true;

    // The sink: ring round the cup's foot, light out of its mouth, sparks.
    ring.material.opacity = 0;
    column.material.opacity = 0;
    const spos = sparkGeo.attributes.position.array, scol = sparkGeo.attributes.color.array;
    scol.fill(0);
    if (toss && !reduce) {
      const a = tossT - toss.i1;
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
    }
    sparkGeo.attributes.position.needsUpdate = true;
    sparkGeo.attributes.color.needsUpdate = true;

    if (!reduce) {
      const d = dustGeo.attributes.position.array;
      for (let i = 0; i < DUST; i++) {
        d[i * 3] = dustBase[i * 3] + Math.sin(time * 0.15 + i) * 0.25;
        d[i * 3 + 1] = dustBase[i * 3 + 1] + Math.sin(time * 0.11 + i * 1.7) * 0.35;
      }
      dustGeo.attributes.position.needsUpdate = true;
    }

    composer.render();

    // HTML layers tied to the 3D die.
    const out = { st };
    if (tau < HANDOFF) out.face = screenBox(TOP);
    if (toss || tossCount) out.box = screenBox(ALL);
    return out;
  }

''')
rep("  return { resize, frame, startToss, finishToss, get toss() { return toss; } };",
    "  return { resize, frame, startToss, finishToss, reset, get toss() { return toss; } };")

# ---------- page loop ----------
rep("      if (tau >= TOSS_AT && !tossedThisIntro && dir >= 0) { gl.startToss(); tossedThisIntro = true; }",
    "      if (tau >= TOSS_AT && !tossedThisIntro && dir >= 0) { gl.startToss(\"intro\"); tossedThisIntro = true; }")
rep("""        if (tossT >= gl.toss.end) gl.finishToss();
      }""", """        if (tossT >= gl.toss.end) gl.finishToss();
      }
      if (dir < 0) gl.reset();""")
rep('$("again").addEventListener("click", () => { if (gl && !gl.toss) { gl.startToss(); } });',
    '$("again").addEventListener("click", () => { if (gl && !gl.toss) { gl.startToss("again"); } });')
rep("    if (t >= TOSS_AT && !gl.toss && tossCount === 0) gl.startToss();",
    "    if (t >= TOSS_AT && !gl.toss && tossCount === 0) gl.startToss(\"intro\");")

(d / "12-cup-sink.html").write_text(s, encoding="utf-8")
print("wrote", d / "12-cup-sink.html", len(s))
