import { useEffect, useRef, useState } from 'react';
import routesData from '../routes_final.json';

/**
 * Simulação de Navegação Completa - Kadeh
 * 61 localizações mapeadas conforme planta real (2048x1150)
 * Rotas calculadas por Dijkstra, seguindo APENAS corredores de trânsito
 */

// All 61 locations from the map with their categories and subcategories
const LOCATIONS: {
  id: number;
  name: string;
  category: string;
  subcategories: string[];
  color: string;
  x: number;
  y: number;
}[] = [
  // Main Gondolas (1-14)
  { id: 1, name: 'Óleos, Molhos e Conservas', category: 'Óleos Molhos e Azeites', subcategories: ['Óleo de soja em promoção', 'Molhos', 'Massas: Espaguete e lasanha', 'Maionese', 'Conservas', 'Azeites', 'Molhos em promoção'], color: '#cc6600', x: 20, y: 500 },
  { id: 2, name: 'Temperos, Arroz e Farinhas', category: 'Temperos Arroz e Farinhas', subcategories: ['Farinha de trigo - Promoção', 'Farinha de trigo', 'Farinha Milho / Rosca / Mandioca', 'Temperos', 'Arroz', 'Cereais', 'Feijão', 'Promoção Temperos'], color: '#996633', x: 148, y: 500 },
  { id: 3, name: 'Massas, Molhos e Importados', category: 'Massas molhos e importados', subcategories: ['Promoção de Massas', 'Espaguetes', 'Lasanhas', 'Outras massas', 'Pratos prontos importados', 'Azeitonas e conservas', 'Molhos importados', 'Promoção conservas importados'], color: '#cc9900', x: 265, y: 500 },
  { id: 4, name: 'Sucos e Refrescos', category: 'Sucos e Refrescos', subcategories: ['Sucos Promoção', 'Sucos', 'Xaropes', 'Refrescos', 'Promoção Refrescos'], color: '#ff9900', x: 385, y: 500 },
  { id: 5, name: 'Açúcares, Cafés e Chás', category: 'Açucares Cafés e Chás', subcategories: ['Promoção Cafés', 'Chás', 'Cafes pacotes', 'Cafés cápsulas', 'Açucar', 'Promoção Açucar'], color: '#663300', x: 385, y: 560 },
  { id: 6, name: 'Biscoitos, Bolachas e Cereais', category: 'Biscoitos Bolachas e Cereais', subcategories: ['Promoção Biscoito', 'Biscoito Salgados', 'Biscoitos Doces', 'Biscoitos Recheados', 'Cereais Matinais', 'Salgadinhos Mistos', 'Salgadinhos Batatas', 'Promoção Batatas Fritas'], color: '#cc6633', x: 506, y: 500 },
  { id: 7, name: 'Achocolatados e Granolas', category: 'Achocolatados e Granolas', subcategories: ['Promoção Achocolatados', 'Café com leite / capuccino', 'Achocolatados', 'Granolas', 'Leite em pó', 'Promoção leite em pó'], color: '#663333', x: 625, y: 500 },
  { id: 8, name: 'Higiene Pessoal', category: 'Higiene Pessoal', subcategories: ['Promoção Xampú', 'Condicionador', 'Xampu ou Shampoo', 'Sabonetes barra', 'Desodorantes', 'Hidratantes', 'Sabonetes líquidos', 'Promoção sabonete'], color: '#cc3399', x: 745, y: 500 },
  { id: 9, name: 'Detergentes e Desinfetantes', category: 'Detergentes e Desinfetantes', subcategories: ['Promoção detergentes', 'Alvejantes', 'Amaciantes', 'Sabão em pó', 'Lustra Móveis e Removedores', 'Multiuso', 'Detergentes', 'Promoção desinfetantes'], color: '#009999', x: 865, y: 500 },
  { id: 10, name: 'Higiene Geral', category: 'Higiene Geral', subcategories: ['Promoção Papel Higiênico', 'Lenços Umidecidos', 'Papel Higiênico', 'Hidratantes', 'Fraldas', 'Promoção Fraldas'], color: '#cc6699', x: 985, y: 500 },
  { id: 11, name: 'Materiais de Limpeza', category: 'Materiais de Limpeza', subcategories: ['Promoção Limpeza', 'Limpeza Pesada', 'Inseticidas', 'Ceras para pisos'], color: '#339966', x: 1105, y: 500 },
  { id: 12, name: 'Limpadores', category: 'Limpadores', subcategories: ['Sacos de Lixo', 'Panos de Limpeza', 'Desengordurantes', 'Papel Toalha', 'Esponjas'], color: '#669933', x: 1207, y: 500 },
  { id: 13, name: 'Utilidades', category: 'Utilidades', subcategories: ['Promoção jogo de jantar', 'Pratos', 'Talheres', 'Copos', 'Taças', 'Panelas'], color: '#666666', x: 1325, y: 500 },
  { id: 14, name: 'Acessórios de Decoração', category: 'Acessórios de Decoração', subcategories: ['Promoção acessórios', 'Velas Aromáticas', 'Quadros', 'Vasos', 'Estátuas', 'Centros de mesa', 'Potes', 'Promoção Vasos'], color: '#996699', x: 1445, y: 500 },

  // Bottom-right departments (15-17)
  { id: 15, name: 'Talheres', category: 'Talheres', subcategories: ['Promoção Talheres', 'Conjuntos de talheres', 'Conjuntos itens culinários'], color: '#333333', x: 1030, y: 670 },
  { id: 16, name: 'Pet - Rações e Acessórios', category: 'Pet - Rações e Acessórios Pet', subcategories: ['Promoção Rações', 'Rações cães filhotes', 'Rações Cães Pequenos', 'Rações Cães Grandes', 'Rações Gatos filhotes', 'Rações Gatos pequenos', 'Rações Gatos Grandes', 'Promoção acessórios Pet'], color: '#996633', x: 1150, y: 670 },
  { id: 17, name: 'Bebidas Alcoólicas', category: 'Bebidas Alcoólicas', subcategories: ['Promoção Bebidas alcoólicas', 'Uísque', 'Gin', 'Aguardente', 'Conhaque', 'Promoção Aguardente'], color: '#660033', x: 1330, y: 670 },

  // Refrigerantes gelados (18)
  { id: 18, name: 'Refrigerantes Gelados', category: 'Refrigerantes Gelados', subcategories: ['Refrigerantes Lata 300 ml', 'Refrigerantes Garrafa 600 ml', 'Refrigerantes Garrafa 1,0 l', 'Refrigerantes Garrafa 2,0 l', 'Refrigerantes Kit com 2'], color: '#009933', x: 540, y: 250 },

  // Freezers/Islands (19-22)
  { id: 19, name: 'Geladeira Danone', category: 'Geladeira Promocional', subcategories: ['Danone Iogurtes pote Natural', 'Danone Iogurtes pote Sabores', 'Danone Iogurtes pote Grego', 'Danone Iogurtes Garrafa 350 ml', 'Danone Iogurtes Garrafa 1,0 l', 'Danone Iogurtes Garrafa 1,5 l'], color: '#3399cc', x: 100, y: 680 },
  { id: 20, name: 'Ilha Glória', category: 'Ilha Promocional', subcategories: ['Leite em Pó Glória lata'], color: '#ffcc00', x: 200, y: 680 },
  { id: 21, name: 'Ilha Ninho', category: 'Ilha Promocional', subcategories: ['Leite em Pó Ninho'], color: '#0066cc', x: 300, y: 680 },
  { id: 22, name: 'Freezer Aurora', category: 'Ilha Promocional', subcategories: ['Freezer Aurora'], color: '#cc3300', x: 400, y: 680 },

  // Caixas (23-25)
  { id: 23, name: 'Caixa 1', category: 'Caixa de pagamento', subcategories: [], color: '#ffcc00', x: 60, y: 840 },
  { id: 24, name: 'Caixa A', category: 'Caixa de pagamento', subcategories: [], color: '#ffcc00', x: 200, y: 840 },
  { id: 25, name: 'Caixas 3/4', category: 'Caixa de pagamento', subcategories: [], color: '#ffcc00', x: 330, y: 840 },

  // Top wall (26-28)
  { id: 26, name: 'Açougue', category: 'Açougue', subcategories: ['Promoção Açougue', 'Bovinos - Bifes', 'Bovinos - Carne moida', 'Bovinos - Outras carnes', 'Carne de Porco', 'Frangos'], color: '#cc0000', x: 290, y: 100 },
  { id: 27, name: 'Hortifruti', category: 'Hortifruti', subcategories: ['Legumes', 'Verduras', 'Frutas'], color: '#0066cc', x: 830, y: 100 },
  { id: 28, name: 'Padaria', category: 'Padaria', subcategories: ['Pão Francês', 'Pães especiais', 'Bolos', 'Doces', 'Promoção doces'], color: '#e67300', x: 1305, y: 100 },

  // Behind-counter expositores (29-40)
  { id: 29, name: 'Freezer Congelados', category: 'Freezer Vertical', subcategories: ['Comidas congeladas'], color: '#336699', x: 60, y: 180 },
  { id: 30, name: 'Freezer Sorvetes', category: 'Freezer Vertical', subcategories: ['Sorvetes'], color: '#9933cc', x: 110, y: 180 },
  { id: 31, name: 'Carnes Congeladas', category: 'Carnes e fritas congeladas', subcategories: ['Promoção de carnes', 'Carnes - cortes especiais', 'Batatas congeladas'], color: '#cc3333', x: 60, y: 150 },
  { id: 32, name: 'Expositor de Frutas', category: 'Expositor de Frutas', subcategories: ['Frutas'], color: '#33cc33', x: 506, y: 240 },
  { id: 33, name: 'Expositor de Legumes', category: 'Expositor de Legumes', subcategories: ['Legumes e verduras'], color: '#009933', x: 720, y: 180 },
  { id: 34, name: 'Manteigas e Margarinas', category: 'Expositor de Manteigas e Margarinas', subcategories: ['Manteigas e Margarinas'], color: '#ffcc33', x: 950, y: 180 },
  { id: 35, name: 'Expositor de Pães', category: 'Expositor de Pães', subcategories: ['Pães finos'], color: '#cc9933', x: 1130, y: 180 },
  { id: 36, name: 'Expositor de Bolos', category: 'Expositor de Bolos', subcategories: ['Bolos finos'], color: '#cc6633', x: 1250, y: 180 },
  { id: 37, name: 'Massas Fabricação Própria', category: 'Expositor de Produtos', subcategories: ['Massas de Fabricação própria'], color: '#cc9966', x: 1350, y: 180 },
  { id: 38, name: 'Pães Doces', category: 'Expositor de pães doces', subcategories: ['Pães doces'], color: '#ff9966', x: 1450, y: 180 },
  { id: 39, name: 'Pães Recheados', category: 'Expositor de pães recheados', subcategories: ['Pães recheados'], color: '#ff6633', x: 1550, y: 180 },
  { id: 40, name: 'Biscoitos Marca Própria', category: 'Expositor de biscoitos', subcategories: ['Biscoitos Marca Própria'], color: '#cc6600', x: 1650, y: 180 },

  // Refrigerated wall (41-47)
  { id: 41, name: 'Laticínios e Bebidas Lácteas', category: 'Geladeira de Exposição', subcategories: ['Laticínios e bebidas lacteas', 'Iogurtes', 'Queijos'], color: '#ccaa00', x: 175, y: 350 },
  { id: 42, name: 'Refrigerantes e Xaropes', category: 'Refrigerantes e Xaropes', subcategories: ['Refrigerantes Diets', 'Refrigerantes Adoçados'], color: '#009933', x: 385, y: 390 },
  { id: 43, name: 'Cereais', category: 'Cereais', subcategories: ['Milho a granel', 'Soja a granel'], color: '#00aaaa', x: 625, y: 390 },
  { id: 44, name: 'Produtos Infantis', category: 'Produtos Infantis', subcategories: ['Xampu Infantil', 'Sabonete infantil', 'Talco Infantil'], color: '#0077cc', x: 830, y: 350 },
  { id: 45, name: 'Expositor de Higiene', category: 'Expositor de Higiene', subcategories: ['Lenços Umidecidos', 'Hidratantes'], color: '#cc6699', x: 960, y: 350 },
  { id: 46, name: 'Expositor de Limpeza', category: 'Expositor de limpeza', subcategories: ['Limpa limo'], color: '#cc3366', x: 1100, y: 350 },
  { id: 47, name: 'Utilidades (Expositor)', category: 'Utilidades', subcategories: ['Expositor de utilidades'], color: '#666666', x: 1260, y: 350 },

  // Orgânicos & Naturais (48-56)
  { id: 48, name: 'Biscoitos Finos', category: 'Biscoitos finos', subcategories: ['Expositor de biscoitos'], color: '#ff8800', x: 570, y: 700 },
  { id: 49, name: 'Massas (Orgânicos)', category: 'Massas', subcategories: ['Expositor de massas'], color: '#ff6600', x: 640, y: 750 },
  { id: 50, name: 'Zero Lactose', category: 'Laticínios Especiais', subcategories: ['Expositor Zero Lactose'], color: '#00cc99', x: 750, y: 700 },
  { id: 51, name: 'Biscoitos Light e Diet', category: 'Biscoitos Light e Diet', subcategories: ['Expositor Diets', 'Expositor Light'], color: '#ff9933', x: 570, y: 770 },
  { id: 52, name: 'Orgânicos (Vazio)', category: '', subcategories: [], color: '#99cc99', x: 640, y: 770 },
  { id: 53, name: 'Massas Especiais', category: 'Massas Especiais', subcategories: ['Massas diets', 'Massas Light'], color: '#cc9933', x: 710, y: 770 },
  { id: 54, name: 'Molhos Especiais', category: 'Molhos especiais', subcategories: ['Molhos Light'], color: '#996633', x: 780, y: 770 },
  { id: 55, name: 'Frutas Desidratadas', category: 'Frutas Desidratadas', subcategories: ['Frutas em passa', 'Frutas desidratadas'], color: '#cc6633', x: 850, y: 770 },
  { id: 56, name: 'Orgânicos', category: 'Orgânicos', subcategories: ['Azeites orgânicos', 'Óleos Orgânicos'], color: '#339933', x: 920, y: 770 },

  // Wine/Spirits (57-59)
  { id: 57, name: 'Vinhos Tinto', category: 'Vinhos Tinto', subcategories: ['Vinho Tinto'], color: '#660033', x: 1030, y: 780 },
  { id: 58, name: 'Vinho Branco', category: 'Vinho Branco', subcategories: ['Vinho Branco'], color: '#cccc66', x: 1100, y: 780 },
  { id: 59, name: 'Espumantes', category: 'Vinho Espumante', subcategories: ['Espumantes'], color: '#ffcc99', x: 1180, y: 780 },

  // Banheiros (60-61)
  { id: 60, name: 'Banheiro Masculino', category: 'Banheiro Masculino', subcategories: [], color: '#336699', x: 1750, y: 840 },
  { id: 61, name: 'Banheiro Feminino', category: 'Banheiro Feminino', subcategories: [], color: '#993366', x: 1870, y: 840 },
];

// Get route from pre-calculated data (keyed as "from->to" with numeric IDs)
const getPreCalculatedRoute = (fromId: number, toId: number): [number, number][] | null => {
  const key = `${fromId}-${toId}`;
  const route = (routesData as any)[key];
  return route ? route.waypoints : null;
};

export default function SimulacaoCompleta() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const [fromId, setFromId] = useState(26); // Açougue
  const [toId, setToId] = useState(27); // Hortifruti
  const [routeInfo, setRouteInfo] = useState('');
  const [error, setError] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);

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

    canvas.width = imageRef.current?.width || 1456;
    canvas.height = imageRef.current?.height || 816;

    const ctx = canvas.getContext('2d');
    if (ctx && imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0);
      drawMarkers(ctx);
    }
  }, [imageLoaded]);

  const drawMarkers = (ctx: CanvasRenderingContext2D) => {
    LOCATIONS.forEach(loc => {
      // Draw circle
      ctx.fillStyle = loc.color;
      ctx.beginPath();
      ctx.arc(loc.x, loc.y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw ID number
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(loc.id), loc.x, loc.y);
    });
  };

  const animateBall = (path: [number, number][]) => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const totalDistance = path.reduce((sum, _, i) => {
      if (i === 0) return 0;
      const dx = path[i][0] - path[i - 1][0];
      const dy = path[i][1] - path[i - 1][1];
      return sum + Math.sqrt(dx * dx + dy * dy);
    }, 0);

    const animationDuration = 5000;
    const startTime = Date.now();

    const drawFrame = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (imageRef.current) {
        ctx.drawImage(imageRef.current, 0, 0);
      }

      // Draw markers
      drawMarkers(ctx);

      // Draw path line
      ctx.strokeStyle = '#0066ff';
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(path[0][0], path[0][1]);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i][0], path[i][1]);
      }
      ctx.stroke();

      // Start point (green)
      ctx.fillStyle = '#00cc00';
      ctx.beginPath();
      ctx.arc(path[0][0], path[0][1], 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // End point (red)
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(path[path.length - 1][0], path[path.length - 1][1], 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Calculate ball position
      let distanceCovered = totalDistance * progress;
      let ballX = path[0][0];
      let ballY = path[0][1];

      for (let i = 1; i < path.length; i++) {
        const dx = path[i][0] - path[i - 1][0];
        const dy = path[i][1] - path[i - 1][1];
        const segmentDistance = Math.sqrt(dx * dx + dy * dy);

        if (distanceCovered <= segmentDistance) {
          const ratio = segmentDistance > 0 ? distanceCovered / segmentDistance : 0;
          ballX = path[i - 1][0] + dx * ratio;
          ballY = path[i - 1][1] + dy * ratio;
          break;
        }
        distanceCovered -= segmentDistance;
      }

      // Animated ball
      ctx.fillStyle = '#ffff00';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 8px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${Math.round(progress * 100)}%`, ballX, ballY);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(drawFrame);
      }
    };

    drawFrame();
  };

  const handleNavigate = () => {
    setError('');
    setRouteInfo('');

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const fromLoc = LOCATIONS.find(l => l.id === fromId);
    const toLoc = LOCATIONS.find(l => l.id === toId);

    if (!fromLoc || !toLoc) {
      setError('Localizações inválidas');
      return;
    }

    if (fromId === toId) {
      setError('Origem e destino são iguais');
      return;
    }

    const path = getPreCalculatedRoute(fromId, toId);

    if (!path) {
      setError('Rota não encontrada');
      return;
    }

    const distance = path.reduce((sum: number, _: any, i: number) => {
      if (i === 0) return 0;
      const dx = path[i][0] - path[i - 1][0];
      const dy = path[i][1] - path[i - 1][1];
      return sum + Math.sqrt(dx * dx + dy * dy);
    }, 0);

    setRouteInfo(`Rota de ${fromLoc.name} para ${toLoc.name} - Distância: ${distance.toFixed(0)} pixels`);
    animateBall(path);
  };

  // Group locations for the dropdown
  const locationGroups = [
    { label: '🥩 Parede Superior', ids: [26, 27, 28] },
    { label: '🧊 Expositores', ids: [29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
    { label: '🥛 Refrigerados', ids: [41, 42, 43, 44, 45, 46, 47, 18] },
    { label: '🛒 Gôndolas Principais', ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] },
    { label: '🧊 Freezers/Ilhas', ids: [19, 20, 21, 22] },
    { label: '🌿 Orgânicos & Naturais', ids: [48, 49, 50, 51, 52, 53, 54, 55, 56] },
    { label: '🍷 Vinhos e Bebidas', ids: [15, 16, 17, 57, 58, 59] },
    { label: '💳 Caixas', ids: [23, 24, 25] },
    { label: '🚻 Banheiros', ids: [60, 61] },
  ];

  const fromLoc = LOCATIONS.find(l => l.id === fromId);
  const toLoc = LOCATIONS.find(l => l.id === toId);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Simulação de Navegação Completa</h1>
      <p className="text-gray-600 mb-6">
        61 localizações mapeadas | 3660 rotas pré-calculadas | Rotas seguem APENAS corredores de trânsito
      </p>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Você está em:</label>
            <select
              value={fromId}
              onChange={(e) => setFromId(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              {locationGroups.map(group => (
                <optgroup key={group.label} label={group.label}>
                  {group.ids.map(id => {
                    const loc = LOCATIONS.find(l => l.id === id);
                    return loc ? (
                      <option key={id} value={id}>{id}. {loc.name}</option>
                    ) : null;
                  })}
                </optgroup>
              ))}
            </select>
            {fromLoc && fromLoc.subcategories.length > 0 && (
              <div className="mt-2">
                <label className="block text-xs font-medium mb-1 text-gray-500">Subcategorias disponíveis:</label>
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded max-h-24 overflow-y-auto">
                  {fromLoc.subcategories.map(sub => (
                    <span key={sub} className="inline-block bg-gray-200 rounded px-1 mr-1 mb-1">{sub}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Desejo ir para:</label>
            <select
              value={toId}
              onChange={(e) => setToId(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              {locationGroups.map(group => (
                <optgroup key={group.label} label={group.label}>
                  {group.ids.map(id => {
                    const loc = LOCATIONS.find(l => l.id === id);
                    return loc ? (
                      <option key={id} value={id}>{id}. {loc.name}</option>
                    ) : null;
                  })}
                </optgroup>
              ))}
            </select>
            {toLoc && toLoc.subcategories.length > 0 && (
              <div className="mt-2">
                <label className="block text-xs font-medium mb-1 text-gray-500">Subcategorias disponíveis:</label>
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded max-h-24 overflow-y-auto">
                  {toLoc.subcategories.map(sub => (
                    <span key={sub} className="inline-block bg-gray-200 rounded px-1 mr-1 mb-1">{sub}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-end">
            <button
              onClick={handleNavigate}
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            >
              Iniciar Navegação
            </button>
          </div>
        </div>

        {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        {routeInfo && <div className="mt-4 p-3 bg-blue-100 text-blue-700 rounded">{routeInfo}</div>}

        <div className="mt-6 border rounded overflow-hidden">
          <canvas ref={canvasRef} className="w-full" />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Informações da Simulação</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✓ 61 localizações mapeadas conforme planta real</li>
          <li>✓ 3660 rotas pré-calculadas por algoritmo Dijkstra</li>
          <li>✓ Rotas seguem APENAS corredores de trânsito (áreas claras)</li>
          <li>✓ Nenhuma rota passa por cima de gôndolas ou expositores</li>
          <li>✓ Subcategorias de cada gôndola conforme layout real (Term1, A-F, Term2)</li>
          <li>✓ Inclui: Açougue, Hortifruti, Padaria, 14 gôndolas, Orgânicos, Vinhos, Caixas, Banheiros</li>
        </ul>
      </div>
    </div>
  );
}
