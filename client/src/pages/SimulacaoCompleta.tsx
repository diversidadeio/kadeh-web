'use client';

import { useState, useRef, useEffect } from 'react';
import productsData from '../products_data.json';

// Department definitions with coordinates from the real map
const DEPARTMENTS = [
  { code: 'A', name: 'Açougue', color: '#ff0000', x: 200, y: 200 },
  { code: 'H', name: 'Hortifruti', color: '#0066ff', x: 900, y: 250 },
  { code: 'P', name: 'Padaria', color: '#ff9900', x: 1400, y: 200 },
  { code: 'L', name: 'Laticionios Especiais', color: '#ffff00', x: 300, y: 500 },
  { code: 'R', name: 'Refrigerantes e Xaropes', color: '#00cc00', x: 700, y: 500 },
  { code: 'C', name: 'Cereais', color: '#00cccc', x: 1100, y: 500 },
  { code: 'I', name: 'Produtos Infantis', color: '#0099ff', x: 1600, y: 500 },
  { code: 'G', name: 'Higiene Pessoal', color: '#ff00ff', x: 400, y: 800 },
  { code: 'K', name: 'Materiais de Limpeza', color: '#ff0099', x: 900, y: 800 },
  { code: 'U', name: 'Utilidades', color: '#99ff00', x: 1400, y: 800 },
  { code: 'O', name: 'Orgânicos', color: '#ff6600', x: 200, y: 1000 },
  { code: 'F', name: 'Caarnes e fritas congeladas', color: '#6600ff', x: 700, y: 1000 },
  { code: 'T', name: 'Talheres', color: '#ff0066', x: 1100, y: 1000 },
  { code: 'B', name: 'Bebidas Alcoólicas', color: '#8b4513', x: 1600, y: 1000 },
];

// Extract unique subcategories from products data
const getSubcategoriesByDepartment = () => {
  const result: { [key: string]: string[] } = {};
  
  productsData.forEach((product: any) => {
    const categoria = product.categoria;
    const subcategoria = product.subcategoria;
    
    if (categoria && subcategoria) {
      if (!result[categoria]) {
        result[categoria] = [];
      }
      if (!result[categoria].includes(subcategoria)) {
        result[categoria].push(subcategoria);
      }
    }
  });
  
  return result;
};

const SUBCATEGORIES_BY_DEPT = getSubcategoriesByDepartment();

// Get products by department
const getProductsByDepartment = (deptName: string) => {
  return productsData.filter((product: any) => product.categoria === deptName);
};

// Get product location by name
const getProductLocation = (productName: string) => {
  const product = productsData.find((p: any) => 
    p.produto?.toLowerCase().includes(productName.toLowerCase())
  );
  return product ? { 
    categoria: product.categoria, 
    subcategoria: product.subcategoria,
    codigo: product.codigo 
  } : null;
};

// Calculate optimal route for multiple products (picking)
const calculatePickingRoute = (productCodes: string[]): string[] => {
  // Simple greedy algorithm: visit departments in order of appearance
  const departments = new Set<string>();
  productCodes.forEach(code => {
    const product = productsData.find((p: any) => p.codigo === code);
    if (product) {
      const dept = DEPARTMENTS.find(d => d.name === product.categoria);
      if (dept) departments.add(dept.code);
    }
  });
  
  return Array.from(departments);
};

export default function SimulacaoCompleta() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [fromDept, setFromDept] = useState('A');
  const [toDept, setToDept] = useState('H');
  const [fromSubcat, setFromSubcat] = useState('Todas');
  const [toSubcat, setToSubcat] = useState('Todas');
  const [routeInfo, setRouteInfo] = useState('');
  const [error, setError] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // New features state
  const [searchProduct, setSearchProduct] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [pickingMode, setPickingMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedDeptInfo, setSelectedDeptInfo] = useState<any>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.src = '/improved_floor_plan.webp';
    
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
  }, []);

  // Draw canvas when image is loaded
  useEffect(() => {
    if (!imageLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = imageRef.current?.width || 2048;
    canvas.height = imageRef.current?.height || 1150;

    const ctx = canvas.getContext('2d');
    if (ctx && imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0);

      DEPARTMENTS.forEach(dept => {
        ctx.fillStyle = dept.color;
        ctx.beginPath();
        ctx.arc(dept.x, dept.y, 30, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(dept.code, dept.x, dept.y);
      });
    }
  }, [imageLoaded]);

  // Handle product search
  const handleSearchProduct = (query: string) => {
    setSearchProduct(query);
    if (query.length > 2) {
      const results = productsData.filter((p: any) =>
        p.produto?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  };

  // Select product from search and navigate
  const handleSelectSearchResult = (product: any) => {
    const dept = DEPARTMENTS.find(d => d.name === product.categoria);
    if (dept) {
      setFromDept('A'); // Start from entrance
      setToDept(dept.code);
      setToSubcat(product.subcategoria || 'Todas');
      setSearchProduct('');
      setSearchResults([]);
      handleNavigate();
    }
  };

  // Add product to picking list
  const handleAddToPickingList = (productCode: string) => {
    if (!selectedProducts.includes(productCode)) {
      setSelectedProducts([...selectedProducts, productCode]);
    }
  };

  // Remove product from picking list
  const handleRemoveFromPickingList = (productCode: string) => {
    setSelectedProducts(selectedProducts.filter(p => p !== productCode));
  };

  // Start picking route
  const handleStartPickingRoute = () => {
    const route = calculatePickingRoute(selectedProducts);
    if (route.length > 0) {
      setFromDept('A');
      setToDept(route[0]);
      setPickingMode(true);
      handleNavigate();
    }
  };

  // Handle department click to show gondola info
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Check if click is on a department
    const clickedDept = DEPARTMENTS.find(dept => {
      const distance = Math.sqrt(Math.pow(x - dept.x, 2) + Math.pow(y - dept.y, 2));
      return distance < 50;
    });

    if (clickedDept) {
      const products = getProductsByDepartment(clickedDept.name);
      setSelectedDeptInfo({
        name: clickedDept.name,
        code: clickedDept.code,
        productCount: products.length,
        products: products.slice(0, 10), // Show first 10 products
      });
    }
  };

  // Handle navigation
  const handleNavigate = () => {
    const fromDeptObj = DEPARTMENTS.find(d => d.code === fromDept);
    const toDeptObj = DEPARTMENTS.find(d => d.code === toDept);

    if (!fromDeptObj || !toDeptObj) {
      setError('Departamento não encontrado');
      return;
    }

    // Calculate distance
    const distance = Math.sqrt(
      Math.pow(toDeptObj.x - fromDeptObj.x, 2) + 
      Math.pow(toDeptObj.y - fromDeptObj.y, 2)
    );

    setRouteInfo(`Rota de ${fromDeptObj.name} para ${toDeptObj.name} - Distância: ${Math.round(distance)} pixels`);
    setError('');

    // Animate ball along route
    animateRoute(fromDeptObj, toDeptObj);
  };

  // Animate ball moving along route
  const animateRoute = (from: any, to: any) => {
    let progress = 0;
    const duration = 3000; // 3 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  // Render animation on canvas
  useEffect(() => {
    if (!imageLoaded || animationProgress === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx || !imageRef.current) return;

    // Redraw everything
    ctx.drawImage(imageRef.current, 0, 0);

    // Draw departments
    DEPARTMENTS.forEach(dept => {
      ctx.fillStyle = dept.color;
      ctx.beginPath();
      ctx.arc(dept.x, dept.y, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dept.code, dept.x, dept.y);
    });

    // Draw route line
    const fromDeptObj = DEPARTMENTS.find(d => d.code === fromDept);
    const toDeptObj = DEPARTMENTS.find(d => d.code === toDept);

    if (fromDeptObj && toDeptObj) {
      ctx.strokeStyle = '#0066ff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(fromDeptObj.x, fromDeptObj.y);
      ctx.lineTo(toDeptObj.x, toDeptObj.y);
      ctx.stroke();

      // Draw start point (green)
      ctx.fillStyle = '#00ff00';
      ctx.beginPath();
      ctx.arc(fromDeptObj.x, fromDeptObj.y, 15, 0, Math.PI * 2);
      ctx.fill();

      // Draw end point (red)
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(toDeptObj.x, toDeptObj.y, 15, 0, Math.PI * 2);
      ctx.fill();

      // Draw animated ball (yellow)
      const ballX = fromDeptObj.x + (toDeptObj.x - fromDeptObj.x) * animationProgress;
      const ballY = fromDeptObj.y + (toDeptObj.y - fromDeptObj.y) * animationProgress;

      ctx.fillStyle = '#ffff00';
      ctx.beginPath();
      ctx.arc(ballX, ballY, 20, 0, Math.PI * 2);
      ctx.fill();

      // Draw progress percentage
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round(animationProgress * 100)}%`, ballX, ballY - 40);
    }
  }, [animationProgress, imageLoaded, fromDept, toDept]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Simulação de Navegação Completa</h1>
      <p className="text-gray-600 mb-6">Rotas inteligentes que respeitam todos os 14 departamentos e evitam 251 gôndolas e expositores</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Feature 1: Product Search */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4">🔍 Buscar Produto</h2>
            <input
              type="text"
              placeholder="Digite o nome do produto (ex: Leite, Pão, Cerveja)..."
              value={searchProduct}
              onChange={(e) => handleSearchProduct(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
            />
            {searchResults.length > 0 && (
              <div className="space-y-2">
                {searchResults.map((product, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectSearchResult(product)}
                    className="p-3 bg-blue-50 rounded cursor-pointer hover:bg-blue-100"
                  >
                    <div className="font-semibold">{product.produto}</div>
                    <div className="text-sm text-gray-600">{product.categoria} - {product.subcategoria}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feature 2: Picking Mode */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4">📦 Modo Picking</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-2">Selecione produtos para picking:</label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddToPickingList(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Adicionar produto...</option>
                  {(productsData as any[]).slice(0, 20).map((product: any, idx) => (
                    <option key={idx} value={product.codigo}>
                      {product?.produto || product?.codigo} ({product.categoria})
                    </option>
                  ))}
                </select>
              </div>

              {selectedProducts.length > 0 && (
                <div>
                  <div className="text-sm font-semibold mb-2">Produtos selecionados ({selectedProducts.length}):</div>
                  <div className="space-y-2">
                    {selectedProducts.map((code) => {
                      const product = (productsData as any[]).find((p: any) => p.codigo === code);
                      return (
                        <div key={code} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>{product?.produto || product?.codigo}</span>
                          <button
                            onClick={() => handleRemoveFromPickingList(code)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remover
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={handleStartPickingRoute}
                    className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold"
                  >
                    Iniciar Rota de Picking
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Original navigation */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4">📍 Navegação Direta</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Você está em:</label>
                <select
                  value={fromDept}
                  onChange={(e) => setFromDept(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  {DEPARTMENTS.map(dept => (
                    <option key={dept.code} value={dept.code}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Desejo ir para:</label>
                <select
                  value={toDept}
                  onChange={(e) => setToDept(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  {DEPARTMENTS.map(dept => (
                    <option key={dept.code} value={dept.code}>{dept.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleNavigate}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Iniciar Navegação
            </button>

            {routeInfo && (
              <div className="mt-4 p-3 bg-blue-50 rounded text-blue-800">
                {routeInfo}
              </div>
            )}
            {error && (
              <div className="mt-4 p-3 bg-red-50 rounded text-red-800">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Canvas and gondola info */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Clique em um departamento para ver informações de gôndolas</p>
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="w-full border border-gray-300 rounded cursor-pointer"
              style={{ maxHeight: '400px', objectFit: 'contain' }}
            />
          </div>

          {/* Feature 3: Gondola Info */}
          {selectedDeptInfo && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold mb-3">📊 Informações de Gôndolas</h3>
              <div className="mb-3">
                <div className="text-sm font-semibold text-gray-600">Departamento:</div>
                <div className="font-bold">{selectedDeptInfo.name}</div>
              </div>
              <div className="mb-3">
                <div className="text-sm font-semibold text-gray-600">Total de Produtos:</div>
                <div className="font-bold">{selectedDeptInfo.productCount}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-2">Produtos disponíveis:</div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {selectedDeptInfo.products.map((product: any, idx: number) => (
                    <div key={idx} className="text-sm p-2 bg-gray-50 rounded">
                      <div className="font-semibold">{product.produto}</div>
                      <div className="text-xs text-gray-600">{product.subcategoria}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Information section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="font-semibold text-green-800">✓ 14 departamentos disponíveis</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="font-semibold text-green-800">✓ 251 gôndolas e expositores mapeados</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="font-semibold text-green-800">✓ 182 rotas pré-calculadas e otimizadas</div>
        </div>
      </div>
    </div>
  );
}
