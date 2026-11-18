import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from "remotion";

export const RealEarth3D: React.FC<{
  width?: number;
  height?: number;
  startLon?: number;
  endLon?: number;
  startLat?: number;
  endLat?: number;
  cameraDist?: number;
  durationInFrames?: number;
  markerLon?: number;
  markerLat?: number;
  texturePath?: string;
  cloudsPath?: string;
  specularPath?: string;
}> = ({
  width = 820,
  height = 820,
  startLon = 30.33,
  endLon = 65.0,
  startLat = 35.0,
  endLat = 45.0,
  cameraDist = 2.6,
  durationInFrames = 120,
  markerLon,
  markerLat,
  texturePath = staticFile("assets/earth/nasa_blue_marble_2048.jpg"),
  cloudsPath = staticFile("assets/earth/nasa_clouds_1024.png"),
  specularPath = staticFile("assets/earth/nasa_specular_2048.jpg"),
}) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);
  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    earthGroup: THREE.Group;
    clouds: THREE.Mesh;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handle = delayRender("RealEarth3D-textures");

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0, cameraDist);

    scene.add(new THREE.AmbientLight(0x4a6b8a, 0.72));
    const sun = new THREE.DirectionalLight(0xfff4de, 2.35);
    sun.position.set(4.5, 2.2, 4.0);
    scene.add(sun);

    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const manager = new THREE.LoadingManager(
      () => {
        setReady(true);
        continueRender(handle);
      },
      undefined,
      () => {
        // Fallback cleanly if local textures have not been fetched yet
        setReady(true);
        continueRender(handle);
      },
    );

    const loader = new THREE.TextureLoader(manager);
    const colorMap = loader.load(texturePath);
    const specMap = loader.load(specularPath);
    const cloudMap = loader.load(cloudsPath);
    colorMap.colorSpace = THREE.SRGBColorSpace;

    const earthMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhongMaterial({
        color: new THREE.Color("#ffffff"),
        map: colorMap,
        specularMap: specMap,
        specular: new THREE.Color("#3b82f6"),
        shininess: 16,
      }),
    );
    earthGroup.add(earthMesh);

    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.013, 64, 64),
      new THREE.MeshPhongMaterial({
        map: cloudMap,
        transparent: true,
        opacity: 0.36,
        depthWrite: false,
      }),
    );
    earthGroup.add(clouds);

    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(1.06, 64, 64),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.16,
        side: THREE.BackSide,
      }),
    );
    scene.add(atmo);

    if (markerLon !== undefined && markerLat !== undefined) {
      const phi = (90 - markerLat) * (Math.PI / 180);
      const theta = (markerLon + 180) * (Math.PI / 180);
      const pin = new THREE.Mesh(
        new THREE.SphereGeometry(0.028, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffd60a }),
      );
      pin.position.set(
        -1.02 * Math.sin(phi) * Math.cos(theta),
        1.02 * Math.cos(phi),
        1.02 * Math.sin(phi) * Math.sin(theta),
      );
      earthGroup.add(pin);
    }

    threeRef.current = { renderer, scene, camera, earthGroup, clouds };
    return () => {
      renderer.dispose();
    };
  }, [width, height, cameraDist, markerLon, markerLat, texturePath, cloudsPath, specularPath]);

  useEffect(() => {
    const ctx = threeRef.current;
    if (!ctx || !ready) return;
    const lon = interpolate(frame, [0, durationInFrames], [startLon, endLon], {
      extrapolateRight: "clamp",
    });
    const lat = interpolate(frame, [0, durationInFrames], [startLat, endLat], {
      extrapolateRight: "clamp",
    });
    ctx.earthGroup.rotation.y = -((lon + 90) * Math.PI) / 180;
    ctx.earthGroup.rotation.x = (lat * Math.PI) / 180;
    ctx.clouds.rotation.y = frame * 0.0014;
    ctx.renderer.render(ctx.scene, ctx.camera);
  }, [frame, ready, startLon, endLon, startLat, endLat, durationInFrames]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width, height, display: "block" }}
    />
  );
};
