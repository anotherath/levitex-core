"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface FloatingObject {
  mesh: THREE.Mesh | THREE.Points | THREE.LineSegments | THREE.Group;
  basePosition: THREE.Vector3;
  speed: number;
  amplitude: number;
  phase: number;
  rotationSpeed: THREE.Vector3;
}

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup — wider FOV to capture full-screen spread
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
    camera.position.z = 32;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Color palette
    const colors = [
      new THREE.Color("#8b5cf6"), // violet
      new THREE.Color("#38bdf8"), // sky blue
      new THREE.Color("#56d4c8"), // aqua
      new THREE.Color("#d946b8"), // magenta
      new THREE.Color("#34d399"), // mint
      new THREE.Color("#a78bfa"), // light violet
      new THREE.Color("#67e8f9"), // light cyan
    ];

    const floatingObjects: FloatingObject[] = [];

    // Helper: create a wireframe polyhedron group (edges + vertices)
    const createWireframePolyhedron = (
      geometry: THREE.BufferGeometry,
      color: THREE.Color,
      opacity: number
    ): THREE.Group => {
      const group = new THREE.Group();

      // Edges (connected lines)
      const edges = new THREE.EdgesGeometry(geometry);
      const lineMaterial = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: opacity * 0.9,
      });
      const wireframe = new THREE.LineSegments(edges, lineMaterial);
      group.add(wireframe);

      // Vertex dots at each corner
      const posAttr = geometry.getAttribute("position");
      const uniqueVertices: THREE.Vector3[] = [];
      for (let i = 0; i < posAttr.count; i++) {
        const v = new THREE.Vector3(
          posAttr.getX(i),
          posAttr.getY(i),
          posAttr.getZ(i)
        );
        // Deduplicate vertices
        const isDuplicate = uniqueVertices.some((uv) => uv.distanceTo(v) < 0.01);
        if (!isDuplicate) uniqueVertices.push(v);
      }

      const dotGeometry = new THREE.BufferGeometry();
      const dotPositions = new Float32Array(uniqueVertices.length * 3);
      uniqueVertices.forEach((v, i) => {
        dotPositions[i * 3] = v.x;
        dotPositions[i * 3 + 1] = v.y;
        dotPositions[i * 3 + 2] = v.z;
      });
      dotGeometry.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));

      const dotMaterial = new THREE.PointsMaterial({
        color,
        size: 0.12,
        transparent: true,
        opacity: opacity * 1.2,
        sizeAttenuation: true,
      });
      const dots = new THREE.Points(dotGeometry, dotMaterial);
      group.add(dots);

      return group;
    };

    // --- Zone-based positioning to avoid center ---
    // Each zone targets a specific edge/corner of the screen
    const zones = [
      // Top-left
      { xMin: -28, xMax: -14, yMin: 8, yMax: 18 },
      // Top-right
      { xMin: 14, xMax: 28, yMin: 8, yMax: 18 },
      // Bottom-left
      { xMin: -28, xMax: -14, yMin: -18, yMax: -8 },
      // Bottom-right
      { xMin: 14, xMax: 28, yMin: -18, yMax: -8 },
      // Left edge (mid)
      { xMin: -30, xMax: -16, yMin: -6, yMax: 6 },
      // Right edge (mid)
      { xMin: 16, xMax: 30, yMin: -6, yMax: 6 },
      // Top center (above headline)
      { xMin: -8, xMax: 8, yMin: 14, yMax: 22 },
      // Bottom edge
      { xMin: -10, xMax: 10, yMin: -20, yMax: -12 },
      // Far top-left
      { xMin: -32, xMax: -20, yMin: 14, yMax: 22 },
      // Far top-right
      { xMin: 20, xMax: 32, yMin: 14, yMax: 22 },
      // Far bottom-left
      { xMin: -32, xMax: -20, yMin: -22, yMax: -14 },
      // Far bottom-right
      { xMin: 20, xMax: 32, yMin: -22, yMax: -14 },
    ];

    const getZonePosition = (zoneIndex: number) => {
      const zone = zones[zoneIndex % zones.length];
      return {
        x: zone.xMin + Math.random() * (zone.xMax - zone.xMin),
        y: zone.yMin + Math.random() * (zone.yMax - zone.yMin),
        z: (Math.random() - 0.5) * 14 - 4,
      };
    };

    const addObject = (
      group: THREE.Group | THREE.Mesh,
      zoneIndex: number,
      speed: number,
      amplitude: number
    ) => {
      const pos = getZonePosition(zoneIndex);
      group.position.set(pos.x, pos.y, pos.z);
      group.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      scene.add(group);
      floatingObjects.push({
        mesh: group,
        basePosition: new THREE.Vector3(pos.x, pos.y, pos.z),
        speed,
        amplitude,
        phase: Math.random() * Math.PI * 2,
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.006,
          (Math.random() - 0.5) * 0.006,
          (Math.random() - 0.5) * 0.004
        ),
      });
    };

    // --- Create floating objects distributed across zones ---

    // 1. Wireframe Icosahedrons — corners
    for (let i = 0; i < 5; i++) {
      const radius = 1.0 + Math.random() * 2.0;
      const geometry = new THREE.IcosahedronGeometry(radius, 0);
      const color = colors[i % colors.length];
      const opacity = 0.3 + Math.random() * 0.25;
      const group = createWireframePolyhedron(geometry, color, opacity);
      addObject(group, i, 0.2 + Math.random() * 0.35, 1.0 + Math.random() * 1.8);
    }

    // 2. Wireframe Dodecahedrons — edges
    for (let i = 0; i < 4; i++) {
      const radius = 0.8 + Math.random() * 1.6;
      const geometry = new THREE.DodecahedronGeometry(radius, 0);
      const color = colors[(i + 2) % colors.length];
      const opacity = 0.25 + Math.random() * 0.2;
      const group = createWireframePolyhedron(geometry, color, opacity);
      addObject(group, i + 4, 0.15 + Math.random() * 0.3, 0.8 + Math.random() * 1.5);
    }

    // 3. Wireframe Octahedrons — far corners
    for (let i = 0; i < 4; i++) {
      const radius = 0.7 + Math.random() * 1.3;
      const geometry = new THREE.OctahedronGeometry(radius, 0);
      const color = colors[(i + 4) % colors.length];
      const opacity = 0.3 + Math.random() * 0.2;
      const group = createWireframePolyhedron(geometry, color, opacity);
      addObject(group, i + 8, 0.2 + Math.random() * 0.4, 1.0 + Math.random() * 1.6);
    }

    // 4. Translucent spheres — scattered at edges
    for (let i = 0; i < 4; i++) {
      const radius = 0.5 + Math.random() * 1.0;
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const material = new THREE.MeshPhysicalMaterial({
        color: colors[(i + 1) % colors.length],
        transparent: true,
        opacity: 0.12 + Math.random() * 0.14,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      addObject(mesh, (i + 3) % zones.length, 0.3 + Math.random() * 0.5, 1 + Math.random() * 2);
    }

    // 5. Wireframe Tetrahedrons — dispersed
    for (let i = 0; i < 3; i++) {
      const radius = 0.9 + Math.random() * 1.4;
      const geometry = new THREE.TetrahedronGeometry(radius, 0);
      const color = colors[(i + 5) % colors.length];
      const opacity = 0.28 + Math.random() * 0.22;
      const group = createWireframePolyhedron(geometry, color, opacity);
      addObject(group, (i + 6) % zones.length, 0.18 + Math.random() * 0.35, 1.0 + Math.random() * 1.5);
    }

    // 6. Glowing particles
    const particleCount = 150;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 55;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 35 - 5;

      const color = colors[Math.floor(Math.random() * colors.length)];
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particleGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(particleColors, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      transparent: true,
      opacity: 0.5,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x8b5cf6, 2, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x38bdf8, 2, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x34d399, 1.5, 40);
    pointLight3.position.set(0, 15, 5);
    scene.add(pointLight3);

    // Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Fade in logic — objects gradually appear over 1.5s
      const fadeInFactor = Math.min(elapsed / 1.5, 1.0);
      scene.traverse((child) => {
        const mesh = child as THREE.Mesh | THREE.Points | THREE.LineSegments;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            if (mat.userData.originalOpacity === undefined) {
              mat.userData.originalOpacity = mat.opacity;
            }
            mat.opacity = mat.userData.originalOpacity * fadeInFactor;
          });
        }
      });

      // Animate floating objects
      for (const obj of floatingObjects) {
        const { mesh, basePosition, speed, amplitude, phase, rotationSpeed } = obj;

        mesh.position.x =
          basePosition.x +
          Math.sin(elapsed * speed + phase) * amplitude * 0.5;
        mesh.position.y =
          basePosition.y +
          Math.cos(elapsed * speed * 0.8 + phase) * amplitude;
        mesh.position.z =
          basePosition.z +
          Math.sin(elapsed * speed * 0.3 + phase) * amplitude * 0.3;

        mesh.rotation.x += rotationSpeed.x;
        mesh.rotation.y += rotationSpeed.y;
        mesh.rotation.z += rotationSpeed.z;
      }

      // Animate particles
      const particlePositions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3 + 1] += Math.sin(elapsed * 0.5 + i * 0.1) * 0.003;
        particlePositions[i * 3] += Math.cos(elapsed * 0.3 + i * 0.05) * 0.002;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="three-canvas-container" />;
}
