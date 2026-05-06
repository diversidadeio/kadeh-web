import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Node {
  id: number;
  x: number;
  y: number;
  locationId?: number;
  locationName?: string;
}

interface Edge {
  from: number;
  to: number;
  distance: number;
}

const LOCATIONS = [
  { id: 1, name: 'Óleos' },
  { id: 2, name: 'Temperos' },
  { id: 3, name: 'Massas' },
  { id: 4, name: 'Açúcar e Café' },
  { id: 5, name: 'Biscoitos' },
  { id: 6, name: 'Bebidas' },
  { id: 7, name: 'Bebidas Alcoólicas' },
  { id: 8, name: 'Laticínios e Bebidas Coalhadas Lácteas' },
  { id: 9, name: 'Detergentes e Desinfetantes' },
  { id: 10, name: 'Higiene Pessoal' },
  { id: 11, name: 'Materiais de Limpeza' },
  { id: 12, name: 'Limpadores' },
  { id: 13, name: 'Utilidades' },
  { id: 14, name: 'Talheres' },
  { id: 15, name: 'Pet' },
  { id: 16, name: 'Bebidas Alcoólicas' },
  { id: 17, name: 'Refrigerantes' },
  { id: 18, name: 'Refrigerantes Diet' },
  { id: 19, name: 'Cereais' },
  { id: 20, name: 'Infantis' },
  { id: 21, name: 'Higiene' },
  { id: 22, name: 'Limpeza' },
  { id: 23, name: 'Caixa 1' },
  { id: 24, name: 'Caixa 2' },
  { id: 25, name: 'Caixa 3' },
  { id: 26, name: 'Açougue' },
  { id: 27, name: 'Hortifruti' },
  { id: 28, name: 'Padaria' },
  { id: 29, name: 'Freezer Congelados' },
  { id: 30, name: 'Freezer Sorvetes' },
  { id: 31, name: 'Carnes Congeladas' },
  { id: 32, name: 'Expositor de Frutas' },
];

export default function CorridorMapper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [draggingNode, setDraggingNode] = useState<number | null>(null);
  const [drawingMode, setDrawingMode] = useState<'add' | 'connect' | 'assign'>('add');
  const [nextNodeId, setNextNodeId] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const floorPlanRef = useRef<HTMLImageElement | null>(null);

  // Load floor plan image
  useEffect(() => {
    const img = new Image();
    img.src = '/improved_floor_plan.webp';
    img.onload = () => {
      floorPlanRef.current = img;
      redraw();
    };
  }, []);

  // Redraw canvas
  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw floor plan
    if (floorPlanRef.current) {
      ctx.drawImage(floorPlanRef.current, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw edges
    ctx.strokeStyle = '#0066cc';
    ctx.lineWidth = 3;
    edges.forEach((edge) => {
      const fromNode = nodes.find((n) => n.id === edge.from);
      const toNode = nodes.find((n) => n.id === edge.to);
      if (fromNode && toNode) {
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
      const isDragging = node.id === draggingNode;
      ctx.fillStyle = isDragging ? '#ffcc00' : isSelected ? '#ff0000' : '#00cc00';
      ctx.beginPath();
      ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
      ctx.fill();

      // Draw node ID
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.id.toString(), node.x, node.y);

      // Draw location name if assigned
      if (node.locationName) {
        ctx.fillStyle = '#000000';
        ctx.font = '10px Arial';
        ctx.fillText(node.locationName, node.x, node.y + 20);
      }
    });
  };

  // Calculate distance between two points
  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  // Handle canvas mouse down
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNode = nodes.find((n) => Math.hypot(n.x - x, n.y - y) < 15);

    if (drawingMode === 'add') {
      if (clickedNode) {
        setSelectedNode(clickedNode.id);
        setDraggingNode(clickedNode.id);
      } else {
        const newNode: Node = { id: nextNodeId, x, y };
        setNodes([...nodes, newNode]);
        setNextNodeId(nextNodeId + 1);
      }
    } else if (drawingMode === 'connect') {
      if (clickedNode) {
        setSelectedNode(clickedNode.id);
      }
    } else if (drawingMode === 'assign') {
      if (clickedNode) {
        setSelectedNode(clickedNode.id);
      }
    }

    redraw();
  };

  // Handle canvas mouse move
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingNode === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNodes(
      nodes.map((n) => (n.id === draggingNode ? { ...n, x, y } : n))
    );
    redraw();
  };

  // Handle canvas mouse up
  const handleCanvasMouseUp = () => {
    setDraggingNode(null);
  };

  // Handle canvas click for connecting
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawingMode !== 'connect' || selectedNode === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNode = nodes.find((n) => Math.hypot(n.x - x, n.y - y) < 15);
    if (!clickedNode || clickedNode.id === selectedNode) return;

    const distance = calculateDistance(
      nodes.find((n) => n.id === selectedNode)!.x,
      nodes.find((n) => n.id === selectedNode)!.y,
      clickedNode.x,
      clickedNode.y
    );

    const newEdge: Edge = {
      from: selectedNode,
      to: clickedNode.id,
      distance,
    };

    setEdges([...edges, newEdge]);
    setSelectedNode(null);
    redraw();
  };

  // Assign location to selected node
  const assignLocation = () => {
    if (selectedNode === null || !selectedLocation) return;

    const location = LOCATIONS.find((l) => l.id.toString() === selectedLocation);
    if (!location) return;

    setNodes(
      nodes.map((n) =>
        n.id === selectedNode
          ? { ...n, locationId: location.id, locationName: location.name }
          : n
      )
    );

    setSelectedLocation('');
    redraw();
  };

  // Export graph
  const exportGraph = () => {
    const graph = {
      nodes: nodes.map((n) => ({
        id: n.id,
        x: n.x,
        y: n.y,
        locationId: n.locationId,
        locationName: n.locationName,
      })),
      edges: edges,
    };

    const dataStr = JSON.stringify(graph, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'corridor-graph.json';
    link.click();

    console.log('Graph exported:', graph);
  };

  return (
    <div className="w-full space-y-4 p-4">
      <Card className="p-4">
        <h2 className="text-2xl font-bold mb-4">Mapeador de Corredores</h2>

        <div className="space-y-4 mb-4">
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setDrawingMode('add')}
              variant={drawingMode === 'add' ? 'default' : 'outline'}
            >
              Adicionar Nós
            </Button>
            <Button
              onClick={() => setDrawingMode('connect')}
              variant={drawingMode === 'connect' ? 'default' : 'outline'}
            >
              Conectar Nós
            </Button>
            <Button
              onClick={() => setDrawingMode('assign')}
              variant={drawingMode === 'assign' ? 'default' : 'outline'}
            >
              Atribuir Localizações
            </Button>
            <Button onClick={exportGraph} variant="outline">
              Exportar Grafo
            </Button>
            <Button
              onClick={() => {
                setNodes([]);
                setEdges([]);
                setSelectedNode(null);
                setNextNodeId(1);
                redraw();
              }}
              variant="destructive"
            >
              Limpar Tudo
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            {drawingMode === 'add' && 'Clique para adicionar nós. Arraste para mover nós.'}
            {drawingMode === 'connect' && 'Clique em um nó, depois clique em outro para conectar.'}
            {drawingMode === 'assign' && 'Clique em um nó para selecioná-lo, depois escolha uma localização.'}
          </div>

          <div className="text-sm font-semibold">
            Nós: {nodes.length} | Arestas: {edges.length} | Nó Selecionado: {selectedNode || 'Nenhum'}
          </div>

          {drawingMode === 'assign' && selectedNode !== null && (
            <div className="flex gap-2">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Escolha uma localização" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id.toString()}>
                      {loc.id}. {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={assignLocation}>Atribuir</Button>
            </div>
          )}
        </div>

        <canvas
          ref={canvasRef}
          width={2048}
          height={1150}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          onClick={handleCanvasClick}
          className="border-2 border-gray-300 w-full bg-gray-100 cursor-crosshair"
        />
      </Card>

      {/* Node List */}
      <Card className="p-4">
        <h3 className="text-xl font-bold mb-4">Nós Criados</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {nodes.map((node) => (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node.id)}
              className={`p-2 rounded border cursor-pointer ${
                selectedNode === node.id
                  ? 'bg-red-200 border-red-500'
                  : 'bg-gray-100 border-gray-300'
              }`}
            >
              <div className="font-bold">Nó {node.id}</div>
              <div className="text-xs">({Math.round(node.x)}, {Math.round(node.y)})</div>
              {node.locationName && (
                <div className="text-xs text-green-600">{node.locationName}</div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Edge List */}
      <Card className="p-4">
        <h3 className="text-xl font-bold mb-4">Conexões</h3>
        <div className="space-y-2">
          {edges.map((edge, idx) => (
            <div key={idx} className="p-2 bg-gray-100 rounded border">
              Nó {edge.from} → Nó {edge.to} ({Math.round(edge.distance)}px)
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
