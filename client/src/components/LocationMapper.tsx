import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Edit2, Download, Upload, Search, X, Save, FolderOpen } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface Node {
  id: string;
  x: number;
  y: number;
  label?: string;
}

interface Edge {
  id: string;
  from: string;
  to: string;
  distance: number;
}

interface Location {
  id: string;
  nodeId: string;
  name: string;
  category?: string;
  subcategory?: string;
  customName?: string;
}

interface Route {
  id: string;
  from: string;
  to: string;
  waypoints: Array<{ x: number; y: number }>;
  distance: number;
}

interface LocationMapData {
  id: string;
  name: string;
  venueType: 'store' | 'market' | 'shopping' | 'event_pavilion' | 'parks' | 'hospital' | 'public_agency' | 'other';
  description?: string;
  floorPlanUrl?: string;
  floorPlanWidth?: number;
  floorPlanHeight?: number;
  nodes: Node[];
  edges: Edge[];
  locations: Location[];
  routes: Route[];
}

const VENUE_TYPES = [
  { value: 'store', label: 'Loja' },
  { value: 'market', label: 'Mercado' },
  { value: 'shopping', label: 'Shopping Center' },
  { value: 'event_pavilion', label: 'Pavilhão de Eventos' },
  { value: 'parks', label: 'Parques' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'public_agency', label: 'Órgão Público' },
  { value: 'other', label: 'Outro' },
];

const CATEGORIES_BY_VENUE: Record<string, string[]> = {
  market: ['Categoria', 'Subcategoria', 'Caixa', 'Saida', 'Banheiros'],
  store: ['Secao'],
  shopping: ['Entrada', 'Saida', 'Lojas', 'Ponto de Informacao', 'Pagamento de Estacionamento', 'Praca de Alimentacao', 'Fraldario', 'Banheiros', 'Caixas 24 Horas', 'Pontos de Interesse', 'Elevadores', 'Escadas'],
  event_pavilion: ['Entrada', 'Saida', 'Saida de Emergencia', 'Informacoes', 'Banheiros', 'Praca de Alimentacao', 'Acesso a Camarotes', 'Locais VIP', 'Bebedouros'],
  parks: ['Entrada', 'Saida', 'Saida de Emergencia', 'Informacoes', 'Banheiros', 'Praca de Alimentacao', 'Apoio Policial'],
  hospital: ['Entrada', 'Saida', 'Banheiros', 'Locais de Informacao', 'Consultorios', 'Salas de Raio X', 'Salas de Medicacao', 'Elevadores', 'Escadas'],
  public_agency: ['Entradas', 'Saidas', 'Pontos de Informacao'],
  other: [],
};

const LocationMapper: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<'addNode' | 'connectNode' | 'assignLocation' | 'view'>('addNode');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [connectFrom, setConnectFrom] = useState<string | null>(null);
  const [floorPlanImage, setFloorPlanImage] = useState<HTMLImageElement | null>(null);
  const [mapName, setMapName] = useState('Novo Mapa');
  const [venueType, setVenueType] = useState<'store' | 'market' | 'shopping' | 'event_pavilion' | 'parks' | 'hospital' | 'public_agency' | 'other'>('store');
  const [editingRoute, setEditingRoute] = useState<string | null>(null);
  const [showRouteList, setShowRouteList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{type: 'node' | 'location' | 'route', id: string, name: string, details?: string}>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [tooltipText, setTooltipText] = useState<string>('');
  const [routeMode, setRouteMode] = useState<'idle' | 'selectStart' | 'selectEnd' | 'drawWaypoints'>('idle');
  const [routeStart, setRouteStart] = useState<string | null>(null);
  const [routeEnd, setRouteEnd] = useState<string | null>(null);
  const [routeWaypoints, setRouteWaypoints] = useState<Array<{ x: number; y: number }>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [customLocationName, setCustomLocationName] = useState<string>('');
  const [saveMapName, setSaveMapName] = useState<string>('');
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);
  const [showLoadDialog, setShowLoadDialog] = useState<boolean>(false);
  const [savedMaps, setSavedMaps] = useState<any[]>([]);
  const [loadingMaps, setLoadingMaps] = useState<boolean>(false);
  const [savingMap, setSavingMap] = useState<boolean>(false);
  
  const saveMapMutation = trpc.locationMapper.saveMap.useMutation();
  const getMyMapsQuery = trpc.locationMapper.getMyMaps.useQuery();

  const NODE_RADIUS = 8;
  const EDGE_COLOR = '#3b82f6';
  const NODE_COLOR = '#3b82f6';
  const SELECTED_COLOR = '#ef4444';

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw floor plan image if available
    if (floorPlanImage) {
      ctx.drawImage(floorPlanImage, 0, 0, canvas.width, canvas.height);
    }

    // Draw edges
    edges.forEach((edge) => {
      const fromNode = nodes.find((n) => n.id === edge.from);
      const toNode = nodes.find((n) => n.id === edge.to);
      if (fromNode && toNode) {
        ctx.strokeStyle = EDGE_COLOR;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();

        // Draw distance label
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.fillText(`${Math.round(edge.distance)}px`, midX, midY - 5);
      }
    });

    // Draw nodes
    nodes.forEach((node) => {
      const isSelected = node.id === selectedNode;
      const isHighlighted = highlightedIds.has(node.id);
      ctx.fillStyle = isHighlighted ? '#fbbf24' : (isSelected ? SELECTED_COLOR : NODE_COLOR);
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      // Draw label
      if (node.label) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, node.x, node.y);
      }
    });

    // Draw locations
    locations.forEach((location) => {
      const node = nodes.find((n) => n.id === location.nodeId);
      if (node) {
        const isHovered = location.id === hoveredLocationId;
        ctx.fillStyle = isHovered ? 'rgba(59, 130, 246, 0.4)' : 'rgba(34, 197, 94, 0.3)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, NODE_RADIUS + 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isHovered ? '#3b82f6' : '#22c55e';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(location.name, node.x, node.y + NODE_RADIUS + 12);
      }
    });
  }, [nodes, edges, locations, selectedNode, floorPlanImage, highlightedIds, hoveredLocationId, routes, routeMode, routeStart, routeEnd, routeWaypoints]);

  // Search function
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      setHighlightedIds(new Set());
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results: Array<{type: 'node' | 'location' | 'route', id: string, name: string, details?: string}> = [];
    const highlighted = new Set<string>();

    // Search nodes
    nodes.forEach((node) => {
      if (node.label?.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'node',
          id: node.id,
          name: `Nó: ${node.label}`,
          details: `Posição: (${Math.round(node.x)}, ${Math.round(node.y)})`
        });
        highlighted.add(node.id);
      }
    });

    // Search locations
    locations.forEach((location) => {
      if (location.name.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'location',
          id: location.id,
          name: `Local: ${location.name}`,
          details: location.category ? `Categoria: ${location.category}` : undefined
        });
        highlighted.add(location.nodeId);
      }
    });

    // Search routes
    routes.forEach((route) => {
      const routeLabel = `${route.from} → ${route.to}`;
      if (routeLabel.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'route',
          id: route.id,
          name: `Rota: ${routeLabel}`,
          details: `Distância: ${Math.round(route.distance)}px`
        });
      }
    });

    setSearchResults(results);
    setShowSearchResults(true);
    setHighlightedIds(highlighted);
  };

  const handleResultClick = (result: typeof searchResults[0]) => {
    if (result.type === 'node') {
      const node = nodes.find((n) => n.id === result.id);
      if (node) {
        setSelectedNode(result.id);
      }
    } else if (result.type === 'location') {
      const location = locations.find((l) => l.id === result.id);
      if (location) {
        setSelectedNode(location.nodeId);
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    setHighlightedIds(new Set());
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Fix: Scale coordinates to match canvas resolution (1024x768) vs display size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (mode === 'addNode') {
      const newNode: Node = {
        id: `node-${Date.now()}`,
        x,
        y,
        label: `N${nodes.length + 1}`,
      };
      setNodes([...nodes, newNode]);
    } else if (mode === 'connectNode') {
      const clickedNode = nodes.find((n) => Math.hypot(n.x - x, n.y - y) < NODE_RADIUS + 5);
      if (clickedNode) {
        if (connectFrom === null) {
          setConnectFrom(clickedNode.id);
          setSelectedNode(clickedNode.id);
        } else if (connectFrom !== clickedNode.id) {
          const distance = Math.hypot(
            nodes.find((n) => n.id === connectFrom)!.x - clickedNode.x,
            nodes.find((n) => n.id === connectFrom)!.y - clickedNode.y
          );
          const newEdge: Edge = {
            id: `edge-${Date.now()}`,
            from: connectFrom,
            to: clickedNode.id,
            distance: Math.round(distance),
          };
          setEdges([...edges, newEdge]);
          setConnectFrom(null);
          setSelectedNode(null);
        }
      }
    } else if (mode === 'assignLocation') {
      const clickedNode = nodes.find((n) => Math.hypot(n.x - x, n.y - y) < NODE_RADIUS + 5);
      if (clickedNode) {
        setSelectedNode(clickedNode.id);
      }
    } else if (routeMode === 'selectStart') {
      const clickedLocation = locations.find((l) => {
        const node = nodes.find((n) => n.id === l.nodeId);
        return node && Math.hypot(node.x - x, node.y - y) < NODE_RADIUS + 8;
      });
      if (clickedLocation) {
        setRouteStart(clickedLocation.id);
        setRouteMode('selectEnd');
      }
    } else if (routeMode === 'selectEnd') {
      const clickedLocation = locations.find((l) => {
        const node = nodes.find((n) => n.id === l.nodeId);
        return node && Math.hypot(node.x - x, node.y - y) < NODE_RADIUS + 8;
      });
      if (clickedLocation && clickedLocation.id !== routeStart) {
        setRouteEnd(clickedLocation.id);
        setRouteMode('drawWaypoints');
        setRouteWaypoints([]);
      }
    } else if (routeMode === 'drawWaypoints') {
      setRouteWaypoints([...routeWaypoints, { x, y }]);
    }
  };

  const handleCanvasDrag = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'view' || !selectedNode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Fix: Scale coordinates to match canvas resolution
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setNodes(nodes.map((n) => (n.id === selectedNode ? { ...n, x, y } : n)));
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Fix: Scale coordinates to match canvas resolution
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Check if hovering over a location
    let foundLocation: Location | null = null;
    for (const location of locations) {
      const node = nodes.find((n) => n.id === location.nodeId);
      if (node && Math.hypot(node.x - x, node.y - y) < NODE_RADIUS + 12) {
        foundLocation = location;
        break;
      }
    }

    if (foundLocation) {
      setHoveredLocationId(foundLocation.id);
      setTooltipText(foundLocation.name);
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top - 30 });
    } else {
      setHoveredLocationId(null);
      setTooltipPos(null);
    }
  };

  const handleCanvasMouseLeave = () => {
    setHoveredLocationId(null);
    setTooltipPos(null);
  };

  const handleAssignLocation = (locationName: string, category?: string) => {
    if (!selectedNode) return;

    const newLocation: Location = {
      id: `loc-${Date.now()}`,
      nodeId: selectedNode,
      name: locationName,
      category,
    };
    setLocations([...locations, newLocation]);
    setSelectedNode(null);
  };

  const deleteRoute = (routeId: string) => {
    setRoutes(routes.filter((r) => r.id !== routeId));
  };

  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter((n) => n.id !== nodeId));
    setEdges(edges.filter((e) => e.from !== nodeId && e.to !== nodeId));
    setLocations(locations.filter((l) => l.nodeId !== nodeId));
  };

  const exportPackage = () => {
    const mapData: LocationMapData = {
      id: `map-${Date.now()}`,
      name: mapName,
      venueType,
      nodes,
      edges,
      locations,
      routes,
      floorPlanWidth: canvasRef.current?.width,
      floorPlanHeight: canvasRef.current?.height,
    };

    const dataStr = JSON.stringify(mapData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${mapName}-${venueType}.json`;
    link.click();
  };

  const handleFloorPlanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setFloorPlanImage(img);
        if (canvasRef.current) {
          canvasRef.current.width = img.width;
          canvasRef.current.height = img.height;
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Mapeador de Locais</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="mapName">Nome do Local</Label>
            <Input
              id="mapName"
              value={mapName}
              onChange={(e) => setMapName(e.target.value)}
              placeholder="Ex: Mercado Central"
            />
          </div>
          <div>
            <Label htmlFor="venueType">Tipo de Local</Label>
            <Select value={venueType} onValueChange={(value: any) => setVenueType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VENUE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="search">Buscar Nós, Locais ou Rotas</Label>
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="search"
                type="text"
                placeholder="Digite para buscar..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchQuery && (
              <Button
                onClick={clearSearch}
                variant="outline"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {showSearchResults && searchResults.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-bold mb-2 text-sm">Resultados da Busca ({searchResults.length})</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {searchResults.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left p-2 bg-white rounded border border-blue-100 hover:bg-blue-100 transition text-sm"
                >
                  <div className="font-semibold text-blue-900">{result.name}</div>
                  {result.details && <div className="text-xs text-gray-600">{result.details}</div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {showSearchResults && searchResults.length === 0 && searchQuery && (
          <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-sm text-yellow-800">
            Nenhum resultado encontrado para "{searchQuery}"
          </div>
        )}

        <div className="flex gap-2 mb-4 flex-wrap">
          <Button
            onClick={() => setMode('addNode')}
            variant={mode === 'addNode' ? 'default' : 'outline'}
          >
            Adicionar Nós
          </Button>
          <Button
            onClick={() => setMode('connectNode')}
            variant={mode === 'connectNode' ? 'default' : 'outline'}
          >
            Conectar Nós
          </Button>
          <Button
            onClick={() => setMode('assignLocation')}
            variant={mode === 'assignLocation' ? 'default' : 'outline'}
          >
            Atribuir Localizações
          </Button>
          <Button
            onClick={() => setMode('view')}
            variant={mode === 'view' ? 'default' : 'outline'}
          >
            Visualizar
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Planta Baixa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload de Planta Baixa</DialogTitle>
              </DialogHeader>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFloorPlanUpload}
              />
            </DialogContent>
          </Dialog>

          <Button onClick={exportPackage} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>

          <Button 
            onClick={() => {
              if (locations.length < 2) {
                alert('Crie pelo menos 2 localizações para criar uma rota');
                return;
              }
              if (routeMode === 'idle') {
                setRouteMode('selectStart');
              } else {
                setRouteMode('idle');
                setRouteStart(null);
                setRouteEnd(null);
                setRouteWaypoints([]);
              }
            }}
            variant={routeMode !== 'idle' ? 'default' : 'outline'}
          >
            {routeMode === 'idle' ? 'Criar Rota' : 'Cancelar Rota'}
          </Button>

          {routeMode === 'drawWaypoints' && routeStart && routeEnd && (
            <Button 
              onClick={() => {
                if (routeWaypoints.length > 0 || (routeStart && routeEnd)) {
                  const startLoc = locations.find(l => l.id === routeStart);
                  const endLoc = locations.find(l => l.id === routeEnd);
                  if (startLoc && endLoc) {
                    const distance = Math.hypot(
                      (nodes.find(n => n.id === startLoc.nodeId)?.x || 0) - (nodes.find(n => n.id === endLoc.nodeId)?.x || 0),
                      (nodes.find(n => n.id === startLoc.nodeId)?.y || 0) - (nodes.find(n => n.id === endLoc.nodeId)?.y || 0)
                    );
                    const newRoute: Route = {
                      id: `route-${Date.now()}`,
                      from: startLoc.name,
                      to: endLoc.name,
                      waypoints: routeWaypoints,
                      distance: Math.round(distance),
                    };
                    setRoutes([...routes, newRoute]);
                    setRouteMode('idle');
                    setRouteStart(null);
                    setRouteEnd(null);
                    setRouteWaypoints([]);
                  }
                }
              }}
              variant="default"
            >
              ✓ Concluir Rota
            </Button>
          )}

          <Button onClick={() => setShowRouteList(!showRouteList)} variant="outline">
            Rotas ({routes.length})
          </Button>

          <Button
            onClick={() => {
              setNodes([]);
              setEdges([]);
              setLocations([]);
              setRoutes([]);
            }}
            variant="destructive"
          >
            Limpar Tudo
          </Button>
          
          {/* Save Map Button */}
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button variant="default">
                <Save className="w-4 h-4 mr-2" />
                Salvar Mapa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Salvar Mapa</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="map-name">Nome do Mapa</Label>
                  <Input
                    id="map-name"
                    placeholder="Ex: Shopping Butantã - Piso L1"
                    value={saveMapName}
                    onChange={(e) => setSaveMapName(e.target.value)}
                  />
                </div>
                <Button
                  onClick={async () => {
                    if (!saveMapName.trim()) {
                      alert('Digite um nome para o mapa');
                      return;
                    }
                    
                    setSavingMap(true);
                    try {
                      await saveMapMutation.mutateAsync({
                        name: saveMapName,
                        venueType: venueType,
                        floorPlanUrl: undefined,
                        description: `Mapa com ${nodes.length} nós, ${edges.length} arestas, ${locations.length} localizações e ${routes.length} rotas`,
                        nodes: nodes.map(n => ({ nodeId: n.id, x: n.x, y: n.y })),
                        edges: edges.map(e => ({ fromNodeId: e.from, toNodeId: e.to, distance: e.distance })),
                        locations: locations.map(l => ({ nodeId: l.nodeId, name: l.name, category: l.category || '', subcategory: l.subcategory })),
                        routes: routes.map(r => ({ routeId: r.id, name: `${r.from} → ${r.to}`, fromLocationId: 0, toLocationId: 0, waypoints: r.waypoints, totalDistance: r.distance })),
                      });
                      alert('Mapa salvo com sucesso!');
                      setSaveMapName('');
                      setShowSaveDialog(false);
                      getMyMapsQuery.refetch();
                    } catch (error) {
                      alert('Erro ao salvar mapa: ' + (error as any).message);
                    } finally {
                      setSavingMap(false);
                    }
                  }}
                  disabled={savingMap || !saveMapName.trim()}
                  className="w-full"
                >
                  {savingMap ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Load Map Button */}
          <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderOpen className="w-4 h-4 mr-2" />
                Carregar Mapa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Carregar Mapa Salvo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {getMyMapsQuery.isLoading ? (
                  <p>Carregando mapas...</p>
                ) : !getMyMapsQuery.data || getMyMapsQuery.data.length === 0 ? (
                  <p>Nenhum mapa salvo encontrado</p>
                ) : (
                  getMyMapsQuery.data.map((map: any) => (
                    <div key={map.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">{map.name}</h3>
                          <p className="text-sm text-gray-600">{map.description}</p>
                          <p className="text-xs text-gray-500 mt-1">Tipo: {map.venueType} | Criado: {new Date(map.createdAt).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <Button
                          onClick={() => {
                            alert('Funcionalidade de carregamento será implementada em breve');
                            setShowLoadDialog(false);
                          }}
                          size="sm"
                        >
                          Carregar
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          Nós: {nodes.length} | Arestas: {edges.length} | Localizações: {locations.length} | Rotas: {routes.length}
        </div>
      </div>

      {routeMode !== 'idle' && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-lg text-sm text-blue-800">
          {routeMode === 'selectStart' && '📍 Clique no local de ORIGEM da rota'}
          {routeMode === 'selectEnd' && '📍 Clique no local de DESTINO da rota'}
          {routeMode === 'drawWaypoints' && '📍 Clique no canvas para adicionar waypoints ou clique em Concluir Rota'}
        </div>
      )}

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={1024}
          height={768}
          onClick={handleCanvasClick}
          onMouseMove={(e) => {
            handleCanvasDrag(e);
            handleCanvasMouseMove(e);
          }}
          onMouseLeave={handleCanvasMouseLeave}
          className="border-2 border-gray-300 rounded-lg w-full bg-gray-50 cursor-crosshair"
        />
        {tooltipPos && hoveredLocationId && (
          <div
            className="absolute bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`,
              transform: 'translate(-50%, -100%)',
              zIndex: 50,
            }}
          >
            {tooltipText}
          </div>
        )}
      </div>

      {showRouteList && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold mb-3">Rotas</h3>
          {routes.length === 0 ? (
            <p className="text-gray-600">Nenhuma rota criada</p>
          ) : (
            <div className="space-y-2">
              {routes.map((route) => (
                <div key={route.id} className="flex items-center justify-between bg-white p-3 rounded border">
                  <span>
                    {route.from} → {route.to} ({route.distance}px)
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingRoute(route.id)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteRoute(route.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {routeMode !== 'idle' && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-semibold text-blue-900 mb-2">
            {routeMode === 'selectStart' && '📍 Clique no local de ORIGEM da rota'}
            {routeMode === 'selectEnd' && '📍 Clique no local de DESTINO da rota'}
            {routeMode === 'drawWaypoints' && '📍 Clique no canvas para adicionar waypoints. Clique em "Concluir Rota" quando terminar.'}
          </p>
          {routeMode === 'drawWaypoints' && (
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={() => {
                  if (routeStart && routeEnd) {
                    const startLoc = locations.find((l) => l.id === routeStart);
                    const endLoc = locations.find((l) => l.id === routeEnd);
                    if (startLoc && endLoc) {
                      const newRoute: Route = {
                        id: `route-${Date.now()}`,
                        from: routeStart,
                        to: routeEnd,
                        distance: Math.round(Math.hypot(
                          (nodes.find((n) => n.id === startLoc.nodeId)?.x || 0) - (nodes.find((n) => n.id === endLoc.nodeId)?.x || 0),
                          (nodes.find((n) => n.id === startLoc.nodeId)?.y || 0) - (nodes.find((n) => n.id === endLoc.nodeId)?.y || 0)
                        )),
                        waypoints: routeWaypoints,
                      };
                      setRoutes([...routes, newRoute]);
                      setRouteMode('idle');
                      setRouteStart(null);
                      setRouteEnd(null);
                      setRouteWaypoints([]);
                    }
                  }
                }}
              >
                ✓ Concluir Rota
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setRouteWaypoints(routeWaypoints.slice(0, -1))}
                disabled={routeWaypoints.length === 0}
              >
                ← Desfazer Último
              </Button>
            </div>
          )}
        </div>
      )}

      {selectedNode && mode === 'assignLocation' && (
        <Dialog open={true} onOpenChange={() => {
          setSelectedNode(null);
          setSelectedCategory('');
          setCustomLocationName('');
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atribuir Localização</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES_BY_VENUE[venueType]?.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="customName">Nome Personalizado (opcional)</Label>
                <Input
                  id="customName"
                  placeholder="Ex: Caixa 1, Entrada Principal"
                  value={customLocationName}
                  onChange={(e) => setCustomLocationName(e.target.value)}
                />
              </div>
              <Button
                onClick={() => {
                  const finalName = customLocationName || selectedCategory || 'Localização';
                  handleAssignLocation(finalName, selectedCategory);
                  setSelectedNode(null);
                  setSelectedCategory('');
                  setCustomLocationName('');
                }}
              >
                Atribuir
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LocationMapper;
