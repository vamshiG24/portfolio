"use client";
/* eslint-disable react-hooks/immutability -- three.js objects are driven imperatively in the frame loop by design */

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { SKILLS_CLUSTER as C } from "@/config/motion";
import { clamp, damp, lerp, mulberry32 } from "@/lib/rig";
import { makeHaloTexture } from "@/lib/textures";
import { buildCluster, groupColor, groupHue, type ClusterUI } from "./cluster";

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
/** Overshoots a little, so the stars settle rather than stop. */
const easeOutBack = (t: number) => {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/** A crisp core for the stars: solid to 55% of the radius, then a short falloff. */
function makeCoreTexture(size = 64): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.55, "rgba(255,255,255,1)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* Per-point size, colour and alpha; size attenuates with depth and the far side dims. */
function makeStarMaterial(map: THREE.Texture): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { uMap: { value: map }, uScale: { value: 1 }, uNear: { value: C.camera.z - C.shell[3] }, uSpan: { value: 2 * C.shell[3] } },
    vertexShader: `
      attribute float aSize;
      attribute vec3 aColor;
      attribute float aAlpha;
      uniform float uScale;
      uniform float uNear;
      uniform float uSpan;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * uScale / max(0.1, -mv.z);
        float depth = clamp((-mv.z - uNear) / uSpan, 0.0, 1.0);
        vColor = aColor;
        vAlpha = aAlpha * mix(1.0, 0.32, depth);
      }`,
    fragmentShader: `
      uniform sampler2D uMap;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float a = texture2D(uMap, gl_PointCoord).a;
        gl_FragColor = vec4(vColor, a * vAlpha);
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });
}

/** One point with the star attributes, for the beads that ride the rings. */
function makePointGeometry(size: number, color: [number, number, number], alpha: number): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(3), 3));
  g.setAttribute("aSize", new THREE.BufferAttribute(new Float32Array([size]), 1));
  g.setAttribute("aColor", new THREE.BufferAttribute(new Float32Array(color), 3));
  g.setAttribute("aAlpha", new THREE.BufferAttribute(new Float32Array([alpha]), 1));
  return g;
}

type Props = {
  ui: RefObject<ClusterUI>;
  /** One element per star; the scene positions them itself, in the canvas' CSS pixels. */
  labels: RefObject<(HTMLElement | null)[]>;
  reduced: boolean;
};

const _v = new THREE.Vector3();
const _c = new THREE.Color();

/**
 * The constellation. One frame loop drives everything: spin (idle + scroll
 * velocity), pointer tilt, the assembly from the centre on first view, the
 * hover flare, and the projection of the DOM labels through this same camera
 * so they sit exactly beside their stars.
 */
export function ClusterScene({ ui, labels, reduced }: Props) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);

  const { stars, links } = useMemo(() => buildCluster(), []);
  const n = stars.length;
  /** Each star's resting tone and the colour it warms to under the pointer. */
  const palette = useMemo(
    () => stars.map((s) => ({ base: new THREE.Color(groupColor[s.skill.group]), hue: new THREE.Color(groupHue[s.skill.group]) })),
    [stars],
  );

  /* ---- geometry: stars (glow + core share positions), links, rings, beads, dust --------- */
  const halo = useMemo(() => makeHaloTexture(128), []);
  const coreTex = useMemo(() => makeCoreTexture(64), []);
  const glowMat = useMemo(() => makeStarMaterial(halo), [halo]);
  const coreMat = useMemo(() => makeStarMaterial(coreTex), [coreTex]);

  const starGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(new Float32Array(n), 1));
    g.setAttribute("aColor", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute("aAlpha", new THREE.BufferAttribute(new Float32Array(n), 1));
    const col = g.getAttribute("aColor") as THREE.BufferAttribute;
    stars.forEach((s, i) => {
      _c.set(groupColor[s.skill.group]);
      col.setXYZ(i, _c.r, _c.g, _c.b);
    });
    return g;
  }, [stars, n]);
  const coreGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", starGeo.getAttribute("position")); // shared: one update moves both
    g.setAttribute("aSize", new THREE.BufferAttribute(new Float32Array(n), 1));
    g.setAttribute("aColor", starGeo.getAttribute("aColor"));
    g.setAttribute("aAlpha", new THREE.BufferAttribute(new Float32Array(n), 1));
    return g;
  }, [starGeo, n]);

  const linkGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(links.length * 6), 3));
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(links.length * 6), 3));
    return g;
  }, [links]);
  const linkMat = useMemo(
    () => new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: C.linkOpacity, blending: THREE.AdditiveBlending, depthWrite: false }),
    [],
  );

  const dustGeo = useMemo(() => {
    const rnd = mulberry32(7);
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(C.dust.count * 3);
    const sz = new Float32Array(C.dust.count);
    const col = new Float32Array(C.dust.count * 3);
    const al = new Float32Array(C.dust.count);
    for (let i = 0; i < C.dust.count; i++) {
      // uniform in a shell between the two radii
      const u = rnd() * 2 - 1;
      const t = rnd() * Math.PI * 2;
      const r = lerp(C.dust.range[0], C.dust.range[1], Math.cbrt(rnd()));
      const s = Math.sqrt(1 - u * u);
      pos.set([Math.cos(t) * s * r, u * r, Math.sin(t) * s * r], i * 3);
      sz[i] = C.dust.size * (0.6 + rnd() * 0.8);
      const tone = 0.55 + rnd() * 0.45;
      col.set([tone, tone, tone], i * 3);
      al[i] = 0.35 + rnd() * 0.4;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sz, 1));
    g.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    g.setAttribute("aAlpha", new THREE.BufferAttribute(al, 1));
    return g;
  }, []);

  const ringGeo = useMemo(() => C.rings.map((r) => new THREE.TorusGeometry(r.r, 0.007, 6, 200)), []);
  const ringMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false }),
    [],
  );
  const beadGeo = useMemo(() => C.rings.map(() => makePointGeometry(0.34, [1, 0.94, 0.82], 0.9)), []);

  useEffect(
    () => () => {
      [starGeo, coreGeo, linkGeo, dustGeo, ...beadGeo, ...ringGeo].forEach((g) => g.dispose());
      [glowMat, coreMat, linkMat, ringMat].forEach((m) => m.dispose());
      halo.dispose();
      coreTex.dispose();
    },
    [starGeo, coreGeo, linkGeo, dustGeo, beadGeo, ringGeo, glowMat, coreMat, linkMat, ringMat, halo, coreTex],
  );

  /* ---- frame state ---------------------------------------------------------------------- */
  const tiltGroup = useRef<THREE.Group>(null);
  const spinGroup = useRef<THREE.Group>(null);
  const dustGroup = useRef<THREE.Group>(null);
  const st = useRef({
    spin: 0.6,
    tiltX: 0,
    tiltY: 0,
    /** Per-star assembly (0 → 1), hover glow and hover colour (damped). */
    grow: new Float32Array(n),
    glow: new Float32Array(n).fill(1),
    heat: new Float32Array(n),
    /** 0 → 1 while anything is hovered: the rest of the links dim with it. */
    dim: 0,
    assembled: false,
    beadAngle: C.rings.map((_, i) => i * 2.1),
    /** Last styles written per label, so a still cluster stops touching the DOM. */
    written: Array.from({ length: n }, () => ({ t: "", o: "", z: "" })),
  });

  // Distance-based depth of a star (0 front … 1 back), from its current local position.
  const depthOf = (pos: THREE.BufferAttribute, i: number, spin: THREE.Group) => {
    _v.set(pos.getX(i), pos.getY(i), pos.getZ(i));
    spin.localToWorld(_v);
    return clamp((camera.position.distanceTo(_v) - (camera.position.z - C.shell[3])) / (2 * C.shell[3]), 0, 1);
  };

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const u = ui.current;
    const S = st.current;
    const tilt = tiltGroup.current;
    const spin = spinGroup.current;
    if (!u || !tilt || !spin) return;

    // The camera frames by height; on a narrow box it backs off until the cluster fits the width too.
    const cam = camera as THREE.PerspectiveCamera;
    const tanHalf = Math.tan((cam.fov * Math.PI) / 360);
    const fitWidth = (C.shell[3] + 0.45) / (tanHalf * (size.width / size.height));
    const z = Math.max(C.camera.z, fitWidth);
    if (Math.abs(cam.position.z - z) > 1e-3) {
      cam.position.z = z;
      glowMat.uniforms.uNear.value = z - C.shell[3];
      coreMat.uniforms.uNear.value = z - C.shell[3];
    }

    // spin: idle + scroll velocity; still while hovering, paused, or under reduced motion
    const v = Math.abs(u.velocity());
    const speed = Math.min(C.maxSpeed, C.baseSpeed + v * C.velocityGain);
    if (!reduced && !u.paused && u.hovered === null) S.spin += speed * dt;
    S.tiltX = damp(S.tiltX, u.pointer.y * C.tilt.x, C.tilt.damp, dt);
    S.tiltY = damp(S.tiltY, u.pointer.x * C.tilt.y, C.tilt.damp, dt);
    tilt.rotation.set(C.lean + S.tiltX, S.tiltY, 0);
    spin.rotation.y = S.spin;
    if (dustGroup.current) dustGroup.current.rotation.y -= C.dust.drift * dt;

    // assembly from the centre on first view (instant under reduced motion)
    const pos = starGeo.getAttribute("position") as THREE.BufferAttribute;
    if (!S.assembled) {
      const t = u.seenAt === null ? -1 : (performance.now() - u.seenAt) / 1000;
      let done = u.seenAt !== null;
      for (let i = 0; i < n; i++) {
        const k = reduced ? 1 : t < 0 ? 0 : clamp((t - i * C.intro.stagger) / C.intro.duration, 0, 1);
        S.grow[i] = k;
        if (k < 1) done = false;
        const r = stars[i].radius * (reduced ? 1 : easeOutBack(k));
        pos.setXYZ(i, stars[i].dir[0] * r, stars[i].dir[1] * r, stars[i].dir[2] * r);
      }
      pos.needsUpdate = true;
      if (done || reduced) S.assembled = true;
    }

    // hover flare (damped so nothing pops); the dimmed keep their size and lose light
    const gAlpha = starGeo.getAttribute("aAlpha") as THREE.BufferAttribute;
    const gSize = starGeo.getAttribute("aSize") as THREE.BufferAttribute;
    const cAlpha = coreGeo.getAttribute("aAlpha") as THREE.BufferAttribute;
    const cSize = coreGeo.getAttribute("aSize") as THREE.BufferAttribute;
    const gColor = starGeo.getAttribute("aColor") as THREE.BufferAttribute; // shared with the cores
    let recolored = false;
    for (let i = 0; i < n; i++) {
      // colour warms in and cools off; snapped at the ends so a still cluster stops re-uploading it
      const hot = u.hovered === i ? 1 : 0;
      const h = Math.abs(S.heat[i] - hot) < 0.004 ? hot : damp(S.heat[i], hot, 5, dt);
      if (h !== S.heat[i]) {
        S.heat[i] = h;
        _c.copy(palette[i].base).lerp(palette[i].hue, h);
        gColor.setXYZ(i, _c.r, _c.g, _c.b);
        recolored = true;
      }
      const target = u.hovered === null ? 1 : u.hovered === i ? C.hoverFlare : C.dimOthers;
      S.glow[i] = damp(S.glow[i], target, 6, dt);
      const g = S.glow[i];
      const born = reduced ? 1 : Math.min(1, S.grow[i] * 3);
      gSize.setX(i, stars[i].size * Math.max(1, g));
      gAlpha.setX(i, Math.min(1, g) * born);
      cSize.setX(i, stars[i].size * C.core * Math.min(1.35, Math.max(1, g)));
      cAlpha.setX(i, Math.min(1, 0.5 + g * 0.5) * born);
    }
    gAlpha.needsUpdate = gSize.needsUpdate = cAlpha.needsUpdate = cSize.needsUpdate = true;
    if (recolored) gColor.needsUpdate = true;

    // links follow the stars; the hovered star's links brighten and take its colour, the rest
    // dim — all damped through the stars' heat, so nothing pops — otherwise they fade with depth
    const lp = linkGeo.getAttribute("position") as THREE.BufferAttribute;
    const lc = linkGeo.getAttribute("color") as THREE.BufferAttribute;
    S.dim = damp(S.dim, u.hovered === null ? 0 : 1, 6, dt);
    const tint = (slot: number, i: number, k: number, hue: THREE.Color, heat: number) => {
      const depth = depthOf(pos, i, spin);
      _c.copy(palette[i].base).lerp(hue, heat).multiplyScalar(k * (1 - 0.7 * depth) * (reduced ? 1 : S.grow[i]));
      lc.setXYZ(slot, _c.r, _c.g, _c.b);
    };
    for (let l = 0; l < links.length; l++) {
      const [a, b] = links[l];
      lp.setXYZ(l * 2, pos.getX(a), pos.getY(a), pos.getZ(a));
      lp.setXYZ(l * 2 + 1, pos.getX(b), pos.getY(b), pos.getZ(b));
      const src = S.heat[a] >= S.heat[b] ? a : b;
      const heat = S.heat[src];
      const k = lerp(lerp(1, 0.25, S.dim), 2.4, heat);
      tint(l * 2, a, k, palette[src].hue, heat);
      tint(l * 2 + 1, b, k, palette[src].hue, heat);
    }
    lp.needsUpdate = lc.needsUpdate = true;

    // beads ride their rings
    C.rings.forEach((r, i) => {
      if (!reduced) S.beadAngle[i] += r.speed * dt * 6;
      const bp = beadGeo[i].getAttribute("position") as THREE.BufferAttribute;
      bp.setXYZ(0, Math.cos(S.beadAngle[i]) * r.r, Math.sin(S.beadAngle[i]) * r.r, 0);
      bp.needsUpdate = true;
    });

    // point sizes are in device pixels: world size → px at unit depth
    const uScale = (size.height * gl.getPixelRatio()) / (2 * tanHalf);
    glowMat.uniforms.uScale.value = uScale;
    coreMat.uniforms.uScale.value = uScale;

    // labels: project each star through this camera into the canvas' CSS pixels
    const els = labels.current;
    if (els) {
      for (let i = 0; i < n; i++) {
        const el = els[i];
        if (!el) continue;
        const front = 1 - depthOf(pos, i, spin);
        _v.project(camera); // _v still holds the world position from depthOf
        const x = (_v.x * 0.5 + 0.5) * size.width;
        const y = (-_v.y * 0.5 + 0.5) * size.height;
        const scale = lerp(C.labelScale[0], C.labelScale[1], front) * (u.hovered === i ? 1.12 : 1) * (size.width < 640 ? 0.82 : 1);
        const dim = u.hovered === null || u.hovered === i ? 1 : C.dimOthers;
        const gap = 10 + stars[i].skill.weight * 4;
        const t = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(${gap}px, -50%) scale(${scale.toFixed(3)})`;
        const o = (lerp(C.labelAlpha[0], C.labelAlpha[1], easeOut(front)) * dim * (reduced ? 1 : S.grow[i])).toFixed(2);
        const z = String(Math.round(front * 40) + (u.hovered === i ? 100 : 0));
        const w = S.written[i];
        if (w.t !== t) el.style.transform = w.t = t;
        if (w.o !== o) el.style.opacity = w.o = o;
        if (w.z !== z) el.style.zIndex = w.z = z;
      }
    }
  });

  return (
    <>
      <group ref={tiltGroup}>
        <group ref={spinGroup}>
          <lineSegments geometry={linkGeo} material={linkMat} frustumCulled={false} />
          <points geometry={starGeo} material={glowMat} frustumCulled={false} />
          <points geometry={coreGeo} material={coreMat} frustumCulled={false} />
        </group>
        {C.rings.map((r, i) => (
          <group key={i} rotation={[r.tilt[0], 0, r.tilt[1]]}>
            <mesh geometry={ringGeo[i]} material={ringMat} />
            <points geometry={beadGeo[i]} material={glowMat} frustumCulled={false} />
          </group>
        ))}
      </group>
      <group ref={dustGroup}>
        <points geometry={dustGeo} material={glowMat} frustumCulled={false} />
      </group>
    </>
  );
}
