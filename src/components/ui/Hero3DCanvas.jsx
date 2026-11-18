import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { heroProjects } from '../../data/heroProjects';

export function Hero3DCanvas({
  mode = 'core',
  exploded = false,
  isDark = false,
  activeProjectIndex = 0,
  radarTarget = null,
  onRadarMetrics,
  onToggleExplode,
  onSelectProjectIndex,
  className = ''
}) {
  const canvasRef = useRef(null);
  const [webglFailed, setWebglFailed] = useState(false);

  // Refs synced cleanly to keep WebGL context persistent across tab switches
  const stateRef = useRef({
    mode,
    exploded,
    isDark,
    activeProjectIndex,
    radarTarget,
    onRadarMetrics,
    onToggleExplode,
    onSelectProjectIndex
  });

  stateRef.current = {
    mode,
    exploded,
    isDark,
    activeProjectIndex,
    radarTarget,
    onRadarMetrics,
    onToggleExplode,
    onSelectProjectIndex
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch {
      setWebglFailed(true);
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    let currentEnvDark = stateRef.current.isDark;

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.25, 6.4);

    // Bright studio lighting rig (lightweight PBR without blocking PMREM shader compilation)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xdbeafe, 1.65);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.35);
    fillLight.position.set(-6, -2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x10b981, 0.95);
    rimLight.position.set(0, 4, -6);
    scene.add(rimLight);

    // Shared disposal tracking
    const disposables = [];
    const track = (item) => {
      disposables.push(item);
      return item;
    };

    // =========================================================================
    // MODE 1: Interactive 3D Engineering Architecture Core
    // =========================================================================
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const coreGeom = track(new THREE.IcosahedronGeometry(0.95, 1));
    const coreMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x2563eb,
        emissive: 0x1d4ed8,
        emissiveIntensity: 0.2,
        roughness: 0.22,
        metalness: 0.28,
        flatShading: true
      })
    );
    const crystalCore = new THREE.Mesh(coreGeom, coreMat);
    coreGroup.add(crystalCore);

    const innerWireGeom = track(new THREE.EdgesGeometry(track(new THREE.IcosahedronGeometry(1.18, 0))));
    const innerWireMat = track(
      new THREE.LineBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.72 })
    );
    const crystalCage = new THREE.LineSegments(innerWireGeom, innerWireMat);
    coreGroup.add(crystalCage);

    // Multi-axis metallic orbital gyros
    const gyroConfigs = [
      { radius: 1.48, tube: 0.036, color: 0x2563eb, rx: 0.85, ry: 0.25 },
      { radius: 1.76, tube: 0.032, color: 0x0ea5e9, rx: -0.6, ry: 0.95 },
      { radius: 2.02, tube: 0.028, color: 0x10b981, rx: 1.15, ry: -0.4 }
    ];
    const gyros = gyroConfigs.map((cfg) => {
      const gGeom = track(new THREE.TorusGeometry(cfg.radius, cfg.tube, 14, 60));
      const gMat = track(
        new THREE.MeshStandardMaterial({
          color: cfg.color,
          roughness: 0.24,
          metalness: 0.48
        })
      );
      const mesh = new THREE.Mesh(gGeom, gMat);
      mesh.rotation.set(cfg.rx, cfg.ry, 0);
      mesh.userData = { baseScale: 1, explodedScale: 1.24, baseRot: { x: cfg.rx, y: cfg.ry } };
      coreGroup.add(mesh);
      return mesh;
    });

    // Orbiting module satellites + glass UI shards
    const satColors = [0x2563eb, 0x0ea5e9, 0x10b981, 0xf59e0b, 0x3b82f6, 0x06b6d4];
    const satellites = [];
    const satGeomCube = track(new THREE.BoxGeometry(0.24, 0.24, 0.24));
    const satGeomOct = track(new THREE.OctahedronGeometry(0.19, 0));

    for (let i = 0; i < 6; i++) {
      const mat = track(
        new THREE.MeshStandardMaterial({
          color: satColors[i],
          roughness: 0.24,
          metalness: 0.28
        })
      );
      const mesh = new THREE.Mesh(i % 2 === 0 ? satGeomCube : satGeomOct, mat);
      const angle = (i / 6) * Math.PI * 2;
      const radius = i % 2 === 0 ? 1.85 : 2.15;
      const yOff = Math.sin(angle * 2) * 0.55;
      mesh.userData = {
        angle,
        baseRadius: radius,
        yOff,
        speed: 0.35 + (i % 3) * 0.12
      };
      coreGroup.add(mesh);
      satellites.push(mesh);
    }

    // Floating frosted architectural UI plates orbiting the core
    const plateGeom = track(new THREE.BoxGeometry(0.82, 0.52, 0.04));
    const plateEdgeGeom = track(new THREE.EdgesGeometry(plateGeom));
    const plates = [
      { pos: [1.55, 0.85, 0.55], rot: [0.15, -0.45, 0.08], color: 0xffffff, accent: 0x2563eb },
      { pos: [-1.62, -0.55, 0.7], rot: [-0.1, 0.45, -0.06], color: 0xe0f2fe, accent: 0x0ea5e9 },
      { pos: [0.35, -1.45, 0.9], rot: [-0.35, 0.15, 0.05], color: 0xecfdf5, accent: 0x10b981 }
    ].map((cfg) => {
      const group = new THREE.Group();
      const mat = track(
        new THREE.MeshStandardMaterial({
          color: cfg.color,
          roughness: 0.18,
          metalness: 0.1,
          transparent: true,
          opacity: 0.86
        })
      );
      const card = new THREE.Mesh(plateGeom, mat);
      group.add(card);

      const lineMat = track(
        new THREE.LineBasicMaterial({ color: cfg.accent, transparent: true, opacity: 0.85 })
      );
      group.add(new THREE.LineSegments(plateEdgeGeom, lineMat));

      // Header pill bar on glass card
      const barGeom = track(new THREE.BoxGeometry(0.45, 0.065, 0.05));
      const barMat = track(new THREE.MeshBasicMaterial({ color: cfg.accent }));
      const bar = new THREE.Mesh(barGeom, barMat);
      bar.position.set(-0.1, 0.12, 0.01);
      group.add(bar);

      const basePos = new THREE.Vector3(...cfg.pos);
      group.position.copy(basePos);
      group.rotation.set(...cfg.rot);
      group.userData = { basePos, dir: basePos.clone().normalize() };
      coreGroup.add(group);
      return group;
    });

    // =========================================================================
    // MODE 2: True 3D Spatial GPS Geofence Terrain (SiAbsen)
    // =========================================================================
    const radarGroup = new THREE.Group();
    radarGroup.rotation.x = 0.58; // Isometric perspective tilt
    radarGroup.visible = false;
    scene.add(radarGroup);

    const dishGeom = track(new THREE.CylinderGeometry(2.15, 2.22, 0.12, 42));
    const dishMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.24,
        metalness: 0.1,
        transparent: true,
        opacity: 0.94
      })
    );
    const dishMesh = new THREE.Mesh(dishGeom, dishMat);
    dishMesh.position.y = -0.06;
    radarGroup.add(dishMesh);

    // Subtle polar concentric floor rings
    [0.65, 1.35, 2.05].forEach((r, idx) => {
      const ringG = track(new THREE.RingGeometry(r - 0.018, r + 0.018, 72));
      const ringM = track(
        new THREE.MeshBasicMaterial({
          color: idx === 1 ? 0x10b981 : 0x94a3b8,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: idx === 1 ? 0.85 : 0.35
        })
      );
      const ring = new THREE.Mesh(ringG, ringM);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.01;
      radarGroup.add(ring);
    });

    // Extruded translucent 50m Geofence Wall (radius = 1.35 units === 50.0m)
    const wallGeom = track(new THREE.CylinderGeometry(1.35, 1.35, 0.44, 64, 1, true));
    const wallMat = track(
      new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    const geofenceWall = new THREE.Mesh(wallGeom, wallMat);
    geofenceWall.position.y = 0.22;
    radarGroup.add(geofenceWall);

    // Center school/campus beacon
    const anchorGeom = track(new THREE.CylinderGeometry(0.1, 0.14, 0.35, 18));
    const anchorMat = track(new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.25, metalness: 0.2 }));
    const anchorMesh = new THREE.Mesh(anchorGeom, anchorMat);
    anchorMesh.position.y = 0.175;
    radarGroup.add(anchorMesh);

    // Rotating 3D radar sweep wedge
    const sweepGeom = track(new THREE.RingGeometry(0.14, 1.35, 32, 1, 0, Math.PI / 3.5));
    const sweepMat = track(
      new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.28,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    const sweepMesh = new THREE.Mesh(sweepGeom, sweepMat);
    sweepMesh.rotation.x = -Math.PI / 2;
    sweepMesh.position.y = 0.025;
    radarGroup.add(sweepMesh);

    // Draggable 3D User Locator Pin
    const pinGroup = new THREE.Group();
    const pinHeadGeom = track(new THREE.SphereGeometry(0.17, 18, 18));
    const pinStemGeom = track(new THREE.ConeGeometry(0.11, 0.34, 18));
    const pinMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.22,
        roughness: 0.2,
        metalness: 0.15
      })
    );
    const pinHead = new THREE.Mesh(pinHeadGeom, pinMat);
    pinHead.position.y = 0.62;
    const pinStem = new THREE.Mesh(pinStemGeom, pinMat);
    pinStem.rotation.x = Math.PI;
    pinStem.position.y = 0.36;
    pinGroup.add(pinHead, pinStem);

    // Halo ring at pin shadow foot
    const footRingGeom = track(new THREE.RingGeometry(0.14, 0.24, 32));
    const footRingMat = track(
      new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
    );
    const footRing = new THREE.Mesh(footRingGeom, footRingMat);
    footRing.rotation.x = -Math.PI / 2;
    footRing.position.y = 0.03;
    pinGroup.add(footRing);

    const radarPinState = { x: 0.48, z: -0.32, targetX: 0.48, targetZ: -0.32 };
    pinGroup.position.set(radarPinState.x, 0, radarPinState.z);
    radarGroup.add(pinGroup);

    // 3D Line linking center anchor -> user pin
    const tetherGeom = track(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.06, 0),
      new THREE.Vector3(radarPinState.x, 0.06, radarPinState.z)
    ]));
    const tetherMat = track(new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.9 }));
    const tetherLine = new THREE.Line(tetherGeom, tetherMat);
    radarGroup.add(tetherLine);

    // Invisible large raycast plane aligned with dish for smooth 3D pointer dragging
    const radarHitPlaneGeom = track(new THREE.CircleGeometry(2.1, 48));
    const radarHitPlaneMat = track(new THREE.MeshBasicMaterial({ visible: false }));
    const radarHitPlane = new THREE.Mesh(radarHitPlaneGeom, radarHitPlaneMat);
    radarHitPlane.rotation.x = -Math.PI / 2;
    radarHitPlane.position.y = 0.02;
    radarGroup.add(radarHitPlane);

    // =========================================================================
    // MODE 3: 3D Project Showcase Spatial Arc Gallery (Centered + Layered Glass)
    // =========================================================================
    const deckGroup = new THREE.Group();
    deckGroup.position.set(0, 0.18, 0);
    deckGroup.visible = false;
    scene.add(deckGroup);

    // Subtle spatial stage orbital ring grounding the gallery
    const deckStageRingGeom = track(new THREE.RingGeometry(2.15, 2.19, 80));
    const deckStageRingMat = track(
      new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.32,
        side: THREE.DoubleSide
      })
    );
    const deckStageRing = new THREE.Mesh(deckStageRingGeom, deckStageRingMat);
    deckStageRing.rotation.x = -Math.PI / 2;
    deckStageRing.position.set(0, -1.25, 0);
    deckGroup.add(deckStageRing);

    const deckInnerRingGeom = track(new THREE.RingGeometry(1.42, 1.445, 64));
    const deckInnerRingMat = track(
      new THREE.MeshBasicMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.24,
        side: THREE.DoubleSide
      })
    );
    const deckInnerRing = new THREE.Mesh(deckInnerRingGeom, deckInnerRingMat);
    deckInnerRing.rotation.x = -Math.PI / 2;
    deckInnerRing.position.set(0, -1.25, 0);
    deckGroup.add(deckInnerRing);

    const deckCards = [];
    let deckBuilt = false;
    const ensureDeckBuilt = () => {
      if (deckBuilt) return;
      deckBuilt = true;
      const texLoader = new THREE.TextureLoader();
      const cardGeom = track(new THREE.PlaneGeometry(2.54, 1.43));
      const bezelGeom = track(new THREE.BoxGeometry(2.66, 1.55, 0.07));
      const bezelEdgeGeom = track(new THREE.EdgesGeometry(bezelGeom));
      const glassPlateGeom = track(new THREE.PlaneGeometry(2.82, 1.7));
      const isDarkNow = stateRef.current.isDark;
      const bezelColor = isDarkNow ? 0x1e293b : 0xf8fafc;

      heroProjects.forEach((proj, idx) => {
        const cardContainer = new THREE.Group();
        const bezelMat = track(
          new THREE.MeshStandardMaterial({
            color: bezelColor,
            emissive: isDarkNow ? 0x0f172a : 0xe2e8f0,
            emissiveIntensity: isDarkNow ? 0.25 : 0.42,
            roughness: 0.16,
            metalness: 0.08
          })
        );
        const bezel = new THREE.Mesh(bezelGeom, bezelMat);
        bezel.position.z = -0.05;
        cardContainer.add(bezel);

        const edgeMat = track(
          new THREE.LineBasicMaterial({
            color: idx === 0 ? 0x2563eb : 0x38bdf8,
            transparent: true,
            opacity: 0.45
          })
        );
        const edgeWire = new THREE.LineSegments(bezelEdgeGeom, edgeMat);
        edgeWire.position.z = -0.05;
        cardContainer.add(edgeWire);

        // Translucent frosted backing glass slab that separates in Explode/Urai mode
        const glassMat = track(
          new THREE.MeshBasicMaterial({
            color: 0x60a5fa,
            transparent: true,
            opacity: 0.14,
            side: THREE.DoubleSide
          })
        );
        const glassPlate = new THREE.Mesh(glassPlateGeom, glassMat);
        glassPlate.position.z = -0.18;
        cardContainer.add(glassPlate);

        const tex = track(texLoader.load(proj.src));
        tex.colorSpace = THREE.SRGBColorSpace;
        const screenMat = track(new THREE.MeshBasicMaterial({ map: tex }));
        const screen = new THREE.Mesh(cardGeom, screenMat);
        screen.userData = { projectIndex: idx };
        cardContainer.add(screen);

        cardContainer.userData = {
          index: idx,
          bezelMat,
          edgeMat,
          glassMat,
          glassPlate
        };
        deckGroup.add(cardContainer);
        deckCards.push(cardContainer);
      });
    };

    // =========================================================================
    // Shared Pointer Dragging & Raycasting Physics
    // =========================================================================
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2(0, 0);
    const dragState = {
      active: false,
      moved: false,
      startX: 0,
      lastX: 0,
      lastY: 0,
      rotY: 0.25,
      rotX: 0.18,
      velY: 0,
      velX: 0,
      hoverX: 0,
      hoverY: 0,
      isDraggingRadarPin: false
    };

    const emitRadarMetrics = (x, z) => {
      // 1.35 world units === 50.0 meters
      const dist = (Math.hypot(x, z) / 1.35) * 50;
      const inside = dist <= 50;
      const activeColor = inside ? 0x10b981 : 0xf43f5e;

      wallMat.color.setHex(activeColor);
      sweepMat.color.setHex(activeColor);
      pinMat.color.setHex(activeColor);
      pinMat.emissive.setHex(inside ? 0x059669 : 0xe11d48);
      footRingMat.color.setHex(activeColor);
      tetherMat.color.setHex(activeColor);

      if (stateRef.current.onRadarMetrics) {
        stateRef.current.onRadarMetrics({
          meters: Math.round(dist * 10) / 10,
          inside
        });
      }
    };
    emitRadarMetrics(radarPinState.x, radarPinState.z);

    let prevRadarTarget = null;

    const updateNdc = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const moveRadarPinFromPointer = () => {
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObject(radarHitPlane, false);
      if (hits.length > 0) {
        const localPt = radarGroup.worldToLocal(hits[0].point.clone());
        const r = Math.hypot(localPt.x, localPt.z);
        const maxR = 1.92;
        if (r > maxR) {
          localPt.x = (localPt.x / r) * maxR;
          localPt.z = (localPt.z / r) * maxR;
        }
        radarPinState.targetX = localPt.x;
        radarPinState.targetZ = localPt.z;
        emitRadarMetrics(localPt.x, localPt.z);
        return true;
      }
      return false;
    };

    const onPointerDown = (e) => {
      dragState.active = true;
      dragState.moved = false;
      dragState.startX = e.clientX;
      dragState.lastX = e.clientX;
      dragState.lastY = e.clientY;
      updateNdc(e.clientX, e.clientY);

      if (stateRef.current.mode === 'radar') {
        dragState.isDraggingRadarPin = moveRadarPinFromPointer();
      }
    };

    const onPointerMove = (e) => {
      updateNdc(e.clientX, e.clientY);
      dragState.hoverX = pointerNdc.x;
      dragState.hoverY = pointerNdc.y;

      if (!dragState.active) return;

      const dx = e.clientX - dragState.lastX;
      const dy = e.clientY - dragState.lastY;
      if (Math.hypot(dx, dy) > 4) {
        dragState.moved = true;
      }
      dragState.lastX = e.clientX;
      dragState.lastY = e.clientY;

      if (stateRef.current.mode === 'radar' && dragState.isDraggingRadarPin) {
        moveRadarPinFromPointer();
        return;
      }

      dragState.velY = dx * 0.0075;
      dragState.velX = dy * 0.0055;
      dragState.rotY += dragState.velY;
      dragState.rotX = THREE.MathUtils.clamp(dragState.rotX + dragState.velX, -0.65, 0.75);
    };

    const onPointerUp = (e) => {
      if (dragState.active) {
        const swipeDx = e.clientX - dragState.startX;
        if (
          dragState.moved &&
          stateRef.current.mode === 'deck' &&
          Math.abs(swipeDx) > 40 &&
          stateRef.current.onSelectProjectIndex &&
          deckCards.length > 1
        ) {
          const curIdx = stateRef.current.activeProjectIndex || 0;
          const total = deckCards.length;
          const nextIdx = swipeDx < 0 ? (curIdx + 1) % total : (curIdx - 1 + total) % total;
          stateRef.current.onSelectProjectIndex(nextIdx);
        } else if (!dragState.moved) {
          updateNdc(e.clientX, e.clientY);
          if (stateRef.current.mode === 'core' && stateRef.current.onToggleExplode) {
            stateRef.current.onToggleExplode();
          } else if (stateRef.current.mode === 'deck' && stateRef.current.onSelectProjectIndex) {
            raycaster.setFromCamera(pointerNdc, camera);
            const hits = raycaster.intersectObjects(deckCards, true);
            const hitIndex = hits.find((h) => typeof h.object.userData?.projectIndex === 'number')
              ?.object.userData.projectIndex;
            if (typeof hitIndex === 'number') {
              stateRef.current.onSelectProjectIndex(hitIndex);
            }
          }
        }
      }
      dragState.active = false;
      dragState.isDraggingRadarPin = false;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });

    // Responsive ResizeObserver
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const width = Math.max(1, parent.clientWidth);
      const height = Math.max(1, parent.clientHeight);
      camera.aspect = width / height;
      camera.position.z = width < 420 ? 7.1 : 6.2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    // Pause loop offscreen
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
      },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let clockTime = 0;
    let explodeLerp = 0;
    let rafId = 0;

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      if (!visible) return;

      const {
        mode: activeMode,
        exploded: isExploded,
        isDark: darkNow,
        activeProjectIndex: activeIdx,
        radarTarget: externalTarget
      } = stateRef.current;

      if (darkNow !== currentEnvDark) {
        currentEnvDark = darkNow;
        dishMat.color.setHex(darkNow ? 0x0f172a : 0xf8fafc);
        deckCards.forEach((c) => {
          if (c.userData?.bezelMat) {
            c.userData.bezelMat.color.setHex(darkNow ? 0x1e293b : 0xf8fafc);
            c.userData.bezelMat.emissive.setHex(darkNow ? 0x0f172a : 0xe2e8f0);
            c.userData.bezelMat.emissiveIntensity = darkNow ? 0.25 : 0.42;
          }
        });
      }

      if (externalTarget && externalTarget !== prevRadarTarget) {
        prevRadarTarget = externalTarget;
        radarPinState.targetX = externalTarget.x;
        radarPinState.targetZ = externalTarget.z;
        emitRadarMetrics(externalTarget.x, externalTarget.z);
      }

      if (!prefersReduced) {
        clockTime += 0.016;
      }

      // Apply inertial damping
      if (!dragState.active) {
        dragState.rotY += dragState.velY + (prefersReduced ? 0 : 0.0028);
        dragState.rotX += dragState.velX;
        dragState.velY *= 0.92;
        dragState.velX *= 0.92;
      }

      explodeLerp = THREE.MathUtils.lerp(explodeLerp, isExploded ? 1 : 0, 0.09);

      // Update group visibility cleanly
      coreGroup.visible = activeMode === 'core';
      radarGroup.visible = activeMode === 'radar';
      deckGroup.visible = activeMode === 'deck';

      if (activeMode === 'core') {
        coreGroup.rotation.y = dragState.rotY + dragState.hoverX * 0.22;
        coreGroup.rotation.x = dragState.rotX - dragState.hoverY * 0.18;
        coreGroup.position.y = Math.sin(clockTime * 1.4) * 0.08;

        crystalCore.rotation.y += prefersReduced ? 0 : 0.006;
        crystalCore.rotation.x += prefersReduced ? 0 : 0.003;
        crystalCage.rotation.y -= prefersReduced ? 0 : 0.004;
        const cageScale = 1 + explodeLerp * 0.34;
        crystalCage.scale.setScalar(cageScale);

        gyros.forEach((gyro, idx) => {
          gyro.rotation.x = gyro.userData.baseRot.x + clockTime * (0.28 + idx * 0.14);
          gyro.rotation.y = gyro.userData.baseRot.y + clockTime * (0.22 - idx * 0.11);
          const s = 1 + explodeLerp * (0.18 + idx * 0.06);
          gyro.scale.setScalar(s);
        });

        satellites.forEach((sat, idx) => {
          const a = sat.userData.angle + clockTime * sat.userData.speed;
          const r = sat.userData.baseRadius + explodeLerp * 0.62;
          sat.position.set(Math.cos(a) * r, sat.userData.yOff + Math.sin(clockTime + idx) * 0.12, Math.sin(a) * r);
          sat.rotation.x += 0.02;
          sat.rotation.y += 0.025;
        });

        plates.forEach((plate) => {
          plate.position.copy(plate.userData.basePos).addScaledVector(plate.userData.dir, explodeLerp * 0.72);
          plate.position.y += Math.sin(clockTime * 1.6 + plate.userData.basePos.x) * 0.05;
        });
      }

      if (activeMode === 'radar') {
        radarGroup.rotation.y = (dragState.rotY - 0.25) * 0.45 + dragState.hoverX * 0.15;
        radarGroup.rotation.x = THREE.MathUtils.clamp(0.56 + (dragState.rotX - 0.18) * 0.4 - dragState.hoverY * 0.1, 0.28, 0.92);

        sweepMesh.rotation.z -= prefersReduced ? 0 : 0.032;

        radarPinState.x = THREE.MathUtils.lerp(radarPinState.x, radarPinState.targetX, 0.16);
        radarPinState.z = THREE.MathUtils.lerp(radarPinState.z, radarPinState.targetZ, 0.16);
        pinGroup.position.set(radarPinState.x, Math.abs(Math.sin(clockTime * 3.2)) * 0.08, radarPinState.z);

        const posAttr = tetherGeom.getAttribute('position');
        posAttr.setXYZ(1, radarPinState.x, 0.06, radarPinState.z);
        posAttr.needsUpdate = true;

        const footScale = 1 + (Math.sin(clockTime * 4) + 1) * 0.18;
        footRing.scale.setScalar(footScale);
      }

      if (activeMode === 'deck') {
        ensureDeckBuilt();
        deckGroup.rotation.y = THREE.MathUtils.lerp(
          deckGroup.rotation.y,
          dragState.hoverX * 0.22 + dragState.velY * 2.5,
          0.12
        );
        deckGroup.rotation.x = THREE.MathUtils.lerp(
          deckGroup.rotation.x,
          -dragState.hoverY * 0.14 + 0.04,
          0.12
        );
        deckStageRing.rotation.z += prefersReduced ? 0 : 0.004;
        deckInnerRing.rotation.z -= prefersReduced ? 0 : 0.006;

        const count = deckCards.length;
        deckCards.forEach((card, i) => {
          let diff = i - activeIdx;
          if (diff > count / 2) diff -= count;
          if (diff < -count / 2) diff += count;

          const absD = Math.abs(diff);
          const angle = diff * (0.48 + explodeLerp * 0.14);
          const arcRadius = 3.25 + explodeLerp * 0.65;
          const targetX = Math.sin(angle) * arcRadius;
          const targetZ =
            Math.cos(angle) * 0.9 - absD * (0.95 + explodeLerp * 0.45) + (diff === 0 ? 0.55 : -0.25);
          const targetY =
            (diff === 0 ? 0.12 : -absD * 0.08) + Math.sin(clockTime * 1.35 + i) * 0.04;
          const targetRotY = -angle * 0.72;
          const targetScale =
            diff === 0 ? 1.0 : absD === 1 ? 0.72 : Math.max(0.5, 0.58 - absD * 0.08);

          card.position.x = THREE.MathUtils.lerp(card.position.x, targetX, 0.11);
          card.position.z = THREE.MathUtils.lerp(card.position.z, targetZ, 0.11);
          card.position.y = THREE.MathUtils.lerp(card.position.y, targetY, 0.11);
          card.rotation.y = THREE.MathUtils.lerp(card.rotation.y, targetRotY, 0.11);
          card.scale.setScalar(THREE.MathUtils.lerp(card.scale.x, targetScale, 0.11));

          if (card.userData?.edgeMat && card.userData?.glassPlate) {
            card.userData.edgeMat.color.setHex(diff === 0 ? 0x2563eb : 0x38bdf8);
            card.userData.edgeMat.opacity = diff === 0 ? 0.85 : 0.28;
            card.userData.glassPlate.position.z = -0.14 - explodeLerp * 0.38;
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(rafId);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      ro.disconnect();
      io.disconnect();

      disposables.forEach((item) => {
        if (item && typeof item.dispose === 'function') {
          item.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  if (webglFailed) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${className}`}>
        <div className="px-4 py-3 rounded-xl bg-surface border border-line text-sm text-ink-muted">
          WebGL 3D view unavailable on this browser.
        </div>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-label="Interactive 3D portfolio model viewer"
      className={`w-full h-full block cursor-grab active:cursor-grabbing touch-none ${className}`}
    />
  );
}

export default Hero3DCanvas;
