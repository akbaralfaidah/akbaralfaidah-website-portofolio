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
    // MODE 1: Interactive 3D Stylized Developer Cat (Kucing 3D)
    // =========================================================================
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Subtle studio turntable base & sapphire ring anchored beneath the cat
    const catBaseGeom = track(new THREE.CylinderGeometry(1.36, 1.44, 0.08, 48));
    const catBaseMat = track(
      new THREE.MeshBasicMaterial({
        color: currentEnvDark ? 0x162033 : 0xdbeafe,
        transparent: true,
        opacity: currentEnvDark ? 0.88 : 0.76
      })
    );
    const catBaseMesh = new THREE.Mesh(catBaseGeom, catBaseMat);
    catBaseMesh.position.y = -1.26;
    coreGroup.add(catBaseMesh);

    const catStageRingGeom = track(new THREE.RingGeometry(1.48, 1.54, 64));
    const catStageRingMat = track(
      new THREE.MeshBasicMaterial({
        color: 0x2563eb,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide
      })
    );
    const catStageRing = new THREE.Mesh(catStageRingGeom, catStageRingMat);
    catStageRing.rotation.x = -Math.PI / 2;
    catStageRing.position.y = -1.21;
    coreGroup.add(catStageRing);

    const catRoot = new THREE.Group();
    catRoot.position.set(0, -0.08, 0);
    coreGroup.add(catRoot);

    const furMainMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xf59e42,
        roughness: 0.5,
        metalness: 0.03
      })
    );
    const furDarkMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.52,
        metalness: 0.03
      })
    );
    const creamMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xfffdf7,
        roughness: 0.48,
        metalness: 0.02
      })
    );
    const pinkMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xfda4af,
        roughness: 0.38,
        metalness: 0.04
      })
    );
    const noseMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xf472b6,
        roughness: 0.25,
        metalness: 0.08
      })
    );
    const collarMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x2563eb,
        roughness: 0.24,
        metalness: 0.18
      })
    );
    const bellMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        roughness: 0.18,
        metalness: 0.78
      })
    );
    const eyeMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.06,
        metalness: 0.18
      })
    );
    const sparkleWhiteMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const whiskerMat = track(new THREE.MeshBasicMaterial({ color: 0x334155 }));

    // Plump sitting cat torso
    const torsoGeom = track(new THREE.SphereGeometry(0.72, 32, 24));
    const torsoMesh = new THREE.Mesh(torsoGeom, furMainMat);
    torsoMesh.position.set(0, -0.45, -0.02);
    torsoMesh.scale.set(0.98, 1.15, 0.94);
    catRoot.add(torsoMesh);

    // Cozy cream chest bib
    const chestGeom = track(new THREE.SphereGeometry(0.48, 24, 18));
    const chestMesh = new THREE.Mesh(chestGeom, creamMat);
    chestMesh.position.set(0, -0.34, 0.39);
    chestMesh.scale.set(0.86, 1.02, 0.62);
    catRoot.add(chestMesh);

    // Back curled haunches + rear paws
    const haunchGeom = track(new THREE.SphereGeometry(0.36, 22, 16));
    [-1, 1].forEach((side) => {
      const haunch = new THREE.Mesh(haunchGeom, furMainMat);
      haunch.position.set(side * 0.54, -0.82, -0.06);
      haunch.scale.set(0.82, 0.88, 1.12);
      catRoot.add(haunch);

      const rearPaw = new THREE.Mesh(track(new THREE.SphereGeometry(0.18, 16, 14)), creamMat);
      rearPaw.position.set(side * 0.56, -1.06, 0.24);
      rearPaw.scale.set(0.95, 0.65, 1.25);
      catRoot.add(rearPaw);
    });

    // Articulated front legs & waving right paw
    const legGeom = track(new THREE.CapsuleGeometry(0.145, 0.42, 10, 18));
    const pawTipGeom = track(new THREE.SphereGeometry(0.17, 18, 14));
    const frontPaws = [];
    [-1, 1].forEach((side) => {
      const pawPivot = new THREE.Group();
      pawPivot.position.set(side * 0.26, -0.38, 0.44);

      const leg = new THREE.Mesh(legGeom, furMainMat);
      leg.position.set(0, -0.26, 0.06);
      leg.rotation.x = -0.18;
      pawPivot.add(leg);

      const tip = new THREE.Mesh(pawTipGeom, creamMat);
      tip.position.set(0, -0.58, 0.18);
      tip.scale.set(1.02, 0.72, 1.24);
      pawPivot.add(tip);

      catRoot.add(pawPivot);
      frontPaws.push(pawPivot);
    });

    // Signature cobalt developer collar & golden bell
    const collarGeom = track(new THREE.TorusGeometry(0.47, 0.072, 14, 36));
    const collarMesh = new THREE.Mesh(collarGeom, collarMat);
    collarMesh.position.set(0, 0.16, 0.08);
    collarMesh.rotation.x = Math.PI / 2 + 0.22;
    catRoot.add(collarMesh);

    const bellGeom = track(new THREE.SphereGeometry(0.115, 20, 16));
    const bellMesh = new THREE.Mesh(bellGeom, bellMat);
    bellMesh.position.set(0, 0.05, 0.57);
    catRoot.add(bellMesh);

    // Articulated head assembly for cursor gaze tracking & blinking
    const catHeadGroup = new THREE.Group();
    catHeadGroup.position.set(0, 0.62, 0.12);
    catRoot.add(catHeadGroup);

    const headGeom = track(new THREE.SphereGeometry(0.68, 32, 24));
    const headMesh = new THREE.Mesh(headGeom, furMainMat);
    headMesh.scale.set(1.16, 0.96, 1.02);
    catHeadGroup.add(headMesh);

    // Cheek fur tufts
    const tuftGeom = track(new THREE.ConeGeometry(0.14, 0.26, 4));
    [-1, 1].forEach((side) => {
      const tuft = new THREE.Mesh(tuftGeom, furMainMat);
      tuft.position.set(side * 0.76, -0.06, 0.08);
      tuft.rotation.z = -side * 1.32;
      catHeadGroup.add(tuft);
    });

    // Fluffy white muzzle pads & chin
    const muzzleGeom = track(new THREE.SphereGeometry(0.18, 18, 16));
    [-1, 1].forEach((side) => {
      const muzzle = new THREE.Mesh(muzzleGeom, creamMat);
      muzzle.position.set(side * 0.145, -0.14, 0.62);
      muzzle.scale.set(1.06, 0.84, 0.8);
      catHeadGroup.add(muzzle);
    });

    // Nose & smiling omega mouth
    const noseGeom = track(new THREE.ConeGeometry(0.072, 0.07, 3));
    const noseMesh = new THREE.Mesh(noseGeom, noseMat);
    noseMesh.position.set(0, -0.04, 0.74);
    noseMesh.rotation.set(Math.PI / 2, 0, Math.PI);
    catHeadGroup.add(noseMesh);

    const mouthArcGeom = track(new THREE.TorusGeometry(0.068, 0.016, 8, 18, Math.PI));
    const mouthMat = track(new THREE.MeshBasicMaterial({ color: 0x451a03 }));
    [-1, 1].forEach((side) => {
      const arc = new THREE.Mesh(mouthArcGeom, mouthMat);
      arc.position.set(side * 0.065, -0.15, 0.745);
      arc.rotation.z = Math.PI;
      catHeadGroup.add(arc);
    });

    // Forehead tabby stripes
    const stripeGeom = track(new THREE.CapsuleGeometry(0.032, 0.18, 6, 10));
    [-0.14, 0, 0.14].forEach((xOff, sIdx) => {
      const stripe = new THREE.Mesh(stripeGeom, furDarkMat);
      stripe.position.set(xOff, 0.56 - Math.abs(xOff) * 0.25, 0.36);
      stripe.rotation.set(-0.68, 0, sIdx === 0 ? 0.18 : sIdx === 2 ? -0.18 : 0);
      catHeadGroup.add(stripe);
    });

    // Rosy cheeks + expressive blinking eyes with dual specular highlights
    const blushGeom = track(new THREE.SphereGeometry(0.09, 14, 12));
    const eyeSphereGeom = track(new THREE.SphereGeometry(0.118, 20, 16));
    const glintMainGeom = track(new THREE.SphereGeometry(0.042, 12, 10));
    const glintSubGeom = track(new THREE.SphereGeometry(0.02, 10, 8));
    const catEyes = [];

    [-1, 1].forEach((side) => {
      const blush = new THREE.Mesh(blushGeom, pinkMat);
      blush.position.set(side * 0.44, -0.15, 0.54);
      blush.scale.set(1.28, 0.72, 0.42);
      catHeadGroup.add(blush);

      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(side * 0.29, 0.08, 0.62);

      const eyeball = new THREE.Mesh(eyeSphereGeom, eyeMat);
      eyeGroup.add(eyeball);

      const glint1 = new THREE.Mesh(glintMainGeom, sparkleWhiteMat);
      glint1.position.set(-0.035, 0.045, 0.095);
      eyeGroup.add(glint1);

      const glint2 = new THREE.Mesh(glintSubGeom, sparkleWhiteMat);
      glint2.position.set(0.035, -0.025, 0.105);
      eyeGroup.add(glint2);

      catHeadGroup.add(eyeGroup);
      catEyes.push(eyeGroup);
    });

    // Crisp 3D whiskers (3 per cheek)
    const whiskerGeom = track(new THREE.CylinderGeometry(0.008, 0.005, 0.44, 6));
    [-1, 1].forEach((side) => {
      [-0.08, -0.15, -0.22].forEach((yPos, wIdx) => {
        const w = new THREE.Mesh(whiskerGeom, whiskerMat);
        w.position.set(side * 0.48, yPos, 0.56);
        w.rotation.z = side * (1.42 + wIdx * 0.14);
        w.rotation.y = -side * 0.24;
        catHeadGroup.add(w);
      });
    });

    // Articulated perky ears with coral-pink inner cones
    const outerEarGeom = track(new THREE.ConeGeometry(0.26, 0.54, 4));
    const innerEarGeom = track(new THREE.ConeGeometry(0.15, 0.34, 4));
    const catEars = [];
    [-1, 1].forEach((side) => {
      const earPivot = new THREE.Group();
      earPivot.position.set(side * 0.46, 0.48, 0.04);
      const baseZRot = -side * 0.36;
      earPivot.rotation.set(0.14, side * 0.16, baseZRot);
      earPivot.userData = { side, baseZRot };

      const outerEar = new THREE.Mesh(outerEarGeom, furMainMat);
      outerEar.position.y = 0.22;
      outerEar.rotation.y = Math.PI / 4;
      outerEar.scale.set(1, 1, 0.56);
      earPivot.add(outerEar);

      const innerEar = new THREE.Mesh(innerEarGeom, pinkMat);
      innerEar.position.set(0, 0.19, 0.075);
      innerEar.rotation.y = Math.PI / 4;
      innerEar.scale.set(1, 1, 0.48);
      earPivot.add(innerEar);

      catHeadGroup.add(earPivot);
      catEars.push(earPivot);
    });

    // Multi-segment expressive curved cat tail ending in cream tip
    const tailSegGeom = track(new THREE.CapsuleGeometry(0.095, 0.24, 8, 14));
    const tailTipGeom = track(new THREE.SphereGeometry(0.115, 16, 14));
    const tailPivots = [];
    let parentTailNode = catRoot;
    for (let tIdx = 0; tIdx < 5; tIdx++) {
      const segPivot = new THREE.Group();
      if (tIdx === 0) {
        segPivot.position.set(0, -0.78, -0.58);
        segPivot.rotation.x = -0.78;
      } else {
        segPivot.position.set(0, 0.28, 0);
        segPivot.rotation.x = tIdx < 3 ? 0.34 : 0.22;
      }
      const isLast = tIdx === 4;
      const segMesh = new THREE.Mesh(isLast ? tailTipGeom : tailSegGeom, isLast ? creamMat : furMainMat);
      segMesh.position.y = isLast ? 0.1 : 0.14;
      segPivot.add(segMesh);
      parentTailNode.add(segPivot);
      tailPivots.push(segPivot);
      parentTailNode = segPivot;
    }

    // Playful floating dev sparkles orbiting cleanly behind & around the kitty
    const catSparkConfigs = [
      { radius: 1.92, yOff: 0.82, speed: 0.65, color: 0x2563eb, angle: 0.5 },
      { radius: 2.08, yOff: -0.25, speed: -0.52, color: 0x0ea5e9, angle: 2.1 },
      { radius: 1.85, yOff: 1.05, speed: 0.58, color: 0x10b981, angle: 3.9 },
      { radius: 2.0, yOff: -0.35, speed: -0.62, color: 0xf472b6, angle: 5.2 }
    ];
    const sparkOctGeom = track(new THREE.OctahedronGeometry(0.11, 0));
    const catSparks = catSparkConfigs.map((cfg) => {
      const sMat = track(
        new THREE.MeshStandardMaterial({
          color: cfg.color,
          emissive: cfg.color,
          emissiveIntensity: 0.28,
          roughness: 0.2,
          metalness: 0.35
        })
      );
      const sMesh = new THREE.Mesh(sparkOctGeom, sMat);
      sMesh.userData = cfg;
      coreGroup.add(sMesh);
      return sMesh;
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
        catBaseMat.color.setHex(darkNow ? 0x162033 : 0xdbeafe);
        catBaseMat.opacity = darkNow ? 0.88 : 0.76;
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

      // Apply inertial damping (cat faces viewer on idle rather than spinning backwards continuously)
      if (!dragState.active) {
        dragState.rotY += dragState.velY;
        dragState.rotX += dragState.velX;
        dragState.velY *= 0.92;
        dragState.velX *= 0.92;
      }

      explodeLerp = THREE.MathUtils.lerp(explodeLerp, isExploded ? 1 : 0, 0.11);

      // Update group visibility cleanly
      coreGroup.visible = activeMode === 'core';
      radarGroup.visible = activeMode === 'radar';
      deckGroup.visible = activeMode === 'deck';

      if (activeMode === 'core') {
        const idleSway = prefersReduced ? 0 : Math.sin(clockTime * 0.85) * 0.12;
        coreGroup.rotation.y = (dragState.rotY - 0.38) + idleSway + dragState.hoverX * 0.14;
        coreGroup.rotation.x = THREE.MathUtils.clamp((dragState.rotX - 0.14) - dragState.hoverY * 0.08, -0.4, 0.45);
        catStageRing.rotation.z += prefersReduced ? 0 : 0.005 + explodeLerp * 0.012;

        // Playful hop & tail speed-up when clicked / "Main!" is active
        const playHop = prefersReduced ? 0 : Math.abs(Math.sin(clockTime * 6.2)) * 0.34 * explodeLerp;
        const breathe = prefersReduced ? 0 : Math.sin(clockTime * 2.1) * 0.025;
        catRoot.position.y = -0.08 + playHop + breathe;
        catRoot.scale.set(1 + breathe * 0.35, 1 + breathe * 0.5, 1 + breathe * 0.35);

        // Curious head look-tracking toward pointer + joyful tilt in play mode
        const targetHeadY = dragState.hoverX * 0.42;
        const targetHeadX = -dragState.hoverY * 0.25 - explodeLerp * 0.08;
        const targetHeadZ = explodeLerp * Math.sin(clockTime * 4.5) * 0.14;
        catHeadGroup.rotation.y = THREE.MathUtils.lerp(catHeadGroup.rotation.y, targetHeadY, 0.12);
        catHeadGroup.rotation.x = THREE.MathUtils.lerp(catHeadGroup.rotation.x, targetHeadX, 0.12);
        catHeadGroup.rotation.z = THREE.MathUtils.lerp(catHeadGroup.rotation.z, targetHeadZ, 0.14);

        // Natural periodic kitty eye blink every ~3.4 seconds
        const blinkCycle = clockTime % 3.4;
        const blinkScaleY = !prefersReduced && blinkCycle > 3.24 ? 0.08 : 1;
        catEyes.forEach((eyeGrp) => {
          eyeGrp.scale.y = THREE.MathUtils.lerp(eyeGrp.scale.y, blinkScaleY, 0.42);
        });

        // Subtle ear twitch & joyful perk
        catEars.forEach((ear, eIdx) => {
          const twitchPhase = Math.sin(clockTime * (eIdx === 0 ? 3.1 : 2.5));
          const twitch = !prefersReduced && twitchPhase > 0.94 ? ear.userData.side * 0.18 : 0;
          const playWiggle = prefersReduced ? 0 : Math.sin(clockTime * 8 + eIdx) * 0.1 * explodeLerp;
          ear.rotation.z = THREE.MathUtils.lerp(
            ear.rotation.z,
            ear.userData.baseZRot + twitch + playWiggle,
            0.22
          );
        });

        // Cheerful waving right front paw during Play mode
        if (frontPaws[1]) {
          const wave = prefersReduced ? 0 : (-1.15 + Math.sin(clockTime * 11) * 0.42) * explodeLerp;
          frontPaws[1].rotation.x = THREE.MathUtils.lerp(frontPaws[1].rotation.x, wave, 0.18);
          frontPaws[1].rotation.z = THREE.MathUtils.lerp(frontPaws[1].rotation.z, -0.25 * explodeLerp, 0.18);
        }

        // Smooth multi-segment S-curve tail wagging
        tailPivots.forEach((seg, sIdx) => {
          const waveSpeed = 2.6 + explodeLerp * 4.8;
          const wag = prefersReduced ? 0 : Math.sin(clockTime * waveSpeed - sIdx * 0.55) * (0.2 + explodeLerp * 0.16);
          seg.rotation.z = wag;
        });

        // Orbiting Dev Sparkle Companions (sweeping wide & rearward so eyes stay unobstructed)
        catSparks.forEach((spark, sIdx) => {
          const ud = spark.userData;
          const ang = ud.angle + clockTime * (ud.speed * (1 + explodeLerp * 1.4));
          const rad = ud.radius + explodeLerp * 0.45;
          spark.position.set(
            Math.cos(ang) * rad,
            ud.yOff + Math.sin(clockTime * 2.2 + sIdx) * 0.16,
            Math.sin(ang) * (rad * 0.55) - 0.65
          );
          spark.rotation.x += 0.03;
          spark.rotation.y += 0.035;
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
