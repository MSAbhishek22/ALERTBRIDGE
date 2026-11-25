/* ALERTBRIDGE — 3D disaster-alert radar (hero).
 * Classic script, Three.js r160 UMD from jsDelivr (window.THREE).
 * Auto-inits on first load. Drag to rotate. One still frame under
 * prefers-reduced-motion; pauses off-screen. Guarded no-op if the
 * CDN or WebGL is unavailable. The India outline is stylised, and the
 * beacons are a picture of the idea — not live alert data. */
(function () {
  'use strict';
  var canvas = document.getElementById('hero3d');
  if (!canvas || typeof THREE === 'undefined') return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  } catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 6.8, 9.2);
  camera.lookAt(0, 0, 0.2);
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  var key = new THREE.DirectionalLight(0xffe0b3, 1.1);
  key.position.set(4, 8, 5);
  scene.add(key);
  var rim = new THREE.PointLight(0xff3b30, 12, 20);
  rim.position.set(-4, 2, -3);
  scene.add(rim);

  var world = new THREE.Group();
  scene.add(world);

  /* Ground disc + polar rings (the radar table). */
  var disc = new THREE.Mesh(
    new THREE.CircleGeometry(3.6, 64),
    new THREE.MeshBasicMaterial({ color: 0x0a1220, transparent: true, opacity: 0.92 })
  );
  disc.rotation.x = -Math.PI / 2;
  world.add(disc);
  [1.2, 2.2, 3.2].forEach(function (r) {
    var ring = new THREE.Mesh(
      new THREE.RingGeometry(r - 0.015, r + 0.015, 64),
      new THREE.MeshBasicMaterial({ color: 0x2a4a6b, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    world.add(ring);
  });

  /* Stylised India outline (lon/lat -> x/z, centred on 78.5E / 21N). */
  var outline = [
    [68.2, 23.7], [69.5, 22.0], [70.2, 20.8], [72.6, 20.0], [72.9, 18.9],
    [74.9, 13.3], [75.5, 11.5], [76.3, 10.0], [77.5, 8.1], [77.6, 10.5],
    [79.8, 14.5], [80.3, 16.0], [82.3, 17.0], [84.0, 18.5], [86.4, 20.1],
    [87.0, 21.7], [88.1, 21.8], [88.9, 22.0], [89.0, 24.5], [88.2, 26.5],
    [88.0, 27.5], [85.0, 28.5], [82.0, 30.0], [80.0, 31.5], [78.0, 32.5],
    [76.0, 34.5], [74.5, 34.0], [74.0, 32.0], [73.5, 30.5], [72.0, 28.0],
    [70.5, 26.5], [69.0, 25.0]
  ];
  var pts = outline.map(function (p) {
    return new THREE.Vector3((p[0] - 78.5) * 0.16, 0.03, (21 - p[1]) * 0.16);
  });
  var india = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({ color: 0xffb347 })
  );
  world.add(india);

  /* Alert beacons: red = red alert, amber = watch. */
  var beacons = [
    { lon: 86.5, lat: 20.2, color: 0xff3b30, label: 'red' },
    { lon: 85.1, lat: 25.6, color: 0xff3b30, label: 'red' },
    { lon: 80.3, lat: 13.1, color: 0xffb020, label: 'amber' },
    { lon: 76.3, lat: 10.0, color: 0xffb020, label: 'amber' },
    { lon: 72.6, lat: 21.0, color: 0xff3b30, label: 'red' }
  ];
  var pulses = [];
  beacons.forEach(function (b, i) {
    var x = (b.lon - 78.5) * 0.16, z = (21 - b.lat) * 0.16;
    var g = new THREE.Group();
    g.position.set(x, 0, z);
    var dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 16, 16),
      new THREE.MeshBasicMaterial({ color: b.color })
    );
    dot.position.y = 0.12;
    g.add(dot);
    var beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1.1, 8, 1, true),
      new THREE.MeshBasicMaterial({ color: b.color, transparent: true, opacity: 0.45 })
    );
    beam.position.y = 0.6;
    g.add(beam);
    var halo = new THREE.Mesh(
      new THREE.RingGeometry(0.12, 0.2, 32),
      new THREE.MeshBasicMaterial({ color: b.color, transparent: true, opacity: 0.7, side: THREE.DoubleSide })
    );
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = 0.04;
    g.add(halo);
    g.userData.phase = i * 1.3;
    g.userData.halo = halo;
    g.userData.beam = beam;
    world.add(g);
    pulses.push(g);
  });

  /* Rotating sweep wedge + outer ring. */
  var sweep = new THREE.Group();
  var wedge = new THREE.Mesh(
    new THREE.CircleGeometry(3.5, 32, 0, 0.65),
    new THREE.MeshBasicMaterial({ color: 0xff9a3c, transparent: true, opacity: 0.14, side: THREE.DoubleSide })
  );
  wedge.rotation.x = -Math.PI / 2;
  wedge.position.y = 0.02;
  sweep.add(wedge);
  var sweepEdge = new THREE.Mesh(
    new THREE.PlaneGeometry(3.5, 0.03),
    new THREE.MeshBasicMaterial({ color: 0xff9a3c, transparent: true, opacity: 0.85 })
  );
  sweepEdge.rotation.x = -Math.PI / 2;
  sweepEdge.rotation.z = 0;
  sweepEdge.position.set(1.75, 0.03, 0);
  sweep.add(sweepEdge);
  world.add(sweep);

  /* Drifting particles above the table. */
  var pCount = 140, pPos = new Float32Array(pCount * 3);
  for (var i = 0; i < pCount; i++) {
    var a = Math.random() * Math.PI * 2, r = 1 + Math.random() * 3.2;
    pPos[i * 3] = Math.cos(a) * r;
    pPos[i * 3 + 1] = 0.3 + Math.random() * 2.4;
    pPos[i * 3 + 2] = Math.sin(a) * r;
  }
  var pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  world.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xffc98a, size: 0.045, transparent: true, opacity: 0.8 })));

  /* Drag to rotate (with slow auto-rotate when idle). */
  var rotY = 0, targetRotY = 0, dragging = false, lastX = 0;
  canvas.addEventListener('pointerdown', function (e) { dragging = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    targetRotY += (e.clientX - lastX) * 0.008;
    lastX = e.clientX;
  });
  function endDrag() { dragging = false; }
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);

  function resize() {
    var w = canvas.clientWidth || 420, h = canvas.clientHeight || 300;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  var visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }, { threshold: 0.02 }).observe(canvas);
  }

  var clock = new THREE.Clock();
  var raf = null;
  function frame() {
    raf = null;
    var t = clock.getElapsedTime();
    if (!dragging) targetRotY += 0.0016;
    rotY += (targetRotY - rotY) * 0.08;
    world.rotation.y = rotY;
    sweep.rotation.y = -t * 0.55;
    pulses.forEach(function (g) {
      var s = 1 + 0.45 * Math.sin(t * 2.4 + g.userData.phase);
      g.userData.halo.scale.set(s, s, 1);
      g.userData.halo.material.opacity = 0.75 - 0.45 * Math.sin(t * 2.4 + g.userData.phase);
      g.userData.beam.material.opacity = 0.3 + 0.25 * Math.sin(t * 2.4 + g.userData.phase);
    });
    renderer.render(scene, camera);
    if (!reduced && visible && !document.hidden) raf = requestAnimationFrame(frame);
  }
  function kick() { if (raf === null) { clock.getDelta(); raf = requestAnimationFrame(frame); } }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) kick(); });
  if (reduced) { frame(); } else { kick(); }
  window.__alertbridge3DReady = true;
})();
