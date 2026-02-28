/**
 * Shelf3DVisualization Component
 * Interactive 3D visualization of shelf layout using Three.js
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useLanguage } from "@/contexts/LanguageContext";

interface Product {
  id: string;
  name: string;
  largura?: number;
  comprimento?: number;
  color: string;
  quadrantes: number;
  zone: string;
}

interface Shelf3DProps {
  products: Product[];
  gondolaWidth: number;
  shelfDepth: number;
  shelfHeight: number;
  numberOfShelves: number;
}

const zoneColors: Record<string, string> = {
  "Altura dos olhos": "#22c55e",
  "Altura das mãos": "#eab308",
  "Parte de Baixo": "#ef4444",
};

export default function Shelf3DVisualization({
  products,
  gondolaWidth,
  shelfDepth,
  shelfHeight,
  numberOfShelves,
}: Shelf3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    if (!containerRef.current || products.length === 0) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // Camera setup
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(gondolaWidth / 200, numberOfShelves * shelfHeight / 200, gondolaWidth / 150);
    camera.lookAt(0, numberOfShelves * shelfHeight / 200, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(gondolaWidth / 200, numberOfShelves * shelfHeight / 100, gondolaWidth / 200);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create shelf structure
    const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.7 });
    const backboardMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.5 });

    // Backboard
    const backboardGeometry = new THREE.BoxGeometry(gondolaWidth / 100, numberOfShelves * shelfHeight / 100, 0.5);
    const backboard = new THREE.Mesh(backboardGeometry, backboardMaterial);
    backboard.position.z = -shelfDepth / 200;
    backboard.castShadow = true;
    backboard.receiveShadow = true;
    scene.add(backboard);

    // Shelves
    for (let i = 0; i <= numberOfShelves; i++) {
      const shelfGeometry = new THREE.BoxGeometry(gondolaWidth / 100, 0.3, shelfDepth / 100);
      const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
      shelf.position.y = (i * shelfHeight) / 100 - (numberOfShelves * shelfHeight) / 200;
      shelf.castShadow = true;
      shelf.receiveShadow = true;
      scene.add(shelf);
    }

    // Add products
    let currentX = -gondolaWidth / 200;
    products.forEach((product) => {
      const productWidth = (product.largura || 10) / 100;
      const productDepth = (product.comprimento || 10) / 100;
      const productHeight = (shelfHeight * 0.8) / 100;

      // Distribute products across shelves
      for (let shelf = 0; shelf < numberOfShelves; shelf++) {
        const productGeometry = new THREE.BoxGeometry(productWidth, productHeight, productDepth);
        const colorHex = parseInt(product.color.replace("#", ""), 16);
        const productMaterial = new THREE.MeshStandardMaterial({
          color: colorHex,
          metalness: 0.3,
          roughness: 0.4,
        });

        const productMesh = new THREE.Mesh(productGeometry, productMaterial);
        productMesh.position.x = currentX + productWidth / 2;
        productMesh.position.y = (shelf * shelfHeight) / 100 - (numberOfShelves * shelfHeight) / 200 + productHeight / 2;
        productMesh.position.z = 0;
        productMesh.castShadow = true;
        productMesh.receiveShadow = true;
        scene.add(productMesh);

        // Add label
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 24px Arial";
          ctx.textAlign = "center";
          ctx.fillText(product.name.substring(0, 10), 128, 64);
        }

        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.MeshBasicMaterial({ map: texture });
        const labelGeometry = new THREE.PlaneGeometry(productWidth * 1.5, productHeight * 0.5);
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.copy(productMesh.position);
        label.position.z = productDepth / 2 + 0.1;
        scene.add(label);
      }

      currentX += productWidth;
    });

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    renderer.domElement.addEventListener("mousedown", (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    renderer.domElement.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * 0.01);
      camera.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), deltaY * 0.01);
      camera.lookAt(0, 0, 0);

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    renderer.domElement.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || width;
      const newHeight = containerRef.current?.clientHeight || height;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [products, gondolaWidth, shelfDepth, shelfHeight, numberOfShelves]);

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {language === "pt" ? "Visualização 3D da Gôndola" : "3D Shelf Visualization"}
      </h3>
      <div ref={containerRef} className="w-full h-96 bg-muted rounded-md border border-border" />
      <p className="text-xs text-muted-foreground mt-2">
        {language === "pt"
          ? "Arraste com o mouse para rotacionar a visualização 3D"
          : "Drag with mouse to rotate 3D view"}
      </p>
    </div>
  );
}
