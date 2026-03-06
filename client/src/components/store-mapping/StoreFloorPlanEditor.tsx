/**
 * Store Floor Plan Editor
 * Interactive canvas editor for creating store layouts with measurements
 */

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, ZoomIn, ZoomOut, Grid3x3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface StoreDimensions {
  width: number; // in cm
  length: number; // in cm
  height: number; // in cm
}

interface CorridorData {
  id: string;
  name: string;
  x: number; // in cm
  y: number; // in cm
  width: number; // in cm
  length: number; // in cm
}

interface FloorPlanEditorProps {
  onSave?: (dimensions: StoreDimensions, corridors: CorridorData[]) => void;
}

const TRANSLATIONS = {
  pt: {
    floorPlanEditor: "Editor de Planta Baixa",
    storeDimensions: "Dimensões da Loja",
    width: "Largura",
    length: "Comprimento",
    height: "Altura",
    cm: "cm",
    m: "m",
    corridors: "Corredores",
    addCorridor: "Adicionar Corredor",
    corridorName: "Nome do Corredor",
    position: "Posição",
    dimensions: "Dimensões",
    x: "X",
    y: "Y",
    delete: "Deletar",
    save: "Salvar",
    preview: "Visualizar",
    grid: "Grade",
    zoom: "Zoom",
    canvas: "Canvas",
    measurements: "Medidas",
    noCorridors: "Nenhum corredor adicionado",
  },
  en: {
    floorPlanEditor: "Floor Plan Editor",
    storeDimensions: "Store Dimensions",
    width: "Width",
    length: "Length",
    height: "Height",
    cm: "cm",
    m: "m",
    corridors: "Corridors",
    addCorridor: "Add Corridor",
    corridorName: "Corridor Name",
    position: "Position",
    dimensions: "Dimensions",
    x: "X",
    y: "Y",
    delete: "Delete",
    save: "Save",
    preview: "Preview",
    grid: "Grid",
    zoom: "Zoom",
    canvas: "Canvas",
    measurements: "Measurements",
    noCorridors: "No corridors added",
  },
};

export default function StoreFloorPlanEditor({ onSave }: FloorPlanEditorProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(0.5);
  const [showGrid, setShowGrid] = useState(true);

  // Store dimensions in cm
  const [storeDimensions, setStoreDimensions] = useState<StoreDimensions>({
    width: 1000, // 10m
    length: 2000, // 20m
    height: 250, // 2.5m
  });

  // Corridors
  const [corridors, setCorridors] = useState<CorridorData[]>([]);
  const [newCorridor, setNewCorridor] = useState<Partial<CorridorData>>({
    name: "Corredor 1",
    x: 0,
    y: 0,
    width: 300,
    length: 2000,
  });

  // Draw canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    if (showGrid) {
      drawGrid(ctx, canvas);
    }

    // Draw store outline
    drawStoreOutline(ctx, canvas);

    // Draw corridors
    drawCorridors(ctx, canvas);

    // Draw measurements
    drawMeasurements(ctx, canvas);
  }, [storeDimensions, corridors, zoom, showGrid]);

  const drawGrid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const gridSize = 50 * zoom; // 50cm grid
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 0.5;

    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  const drawStoreOutline = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = storeDimensions.width * zoom;
    const length = storeDimensions.length * zoom;

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, width, length);

    // Add store dimensions label
    ctx.fillStyle = "#000000";
    ctx.font = "12px Arial";
    ctx.fillText(
      `${(storeDimensions.width / 100).toFixed(1)}m × ${(storeDimensions.length / 100).toFixed(1)}m`,
      60,
      40
    );
  };

  const drawCorridors = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    corridors.forEach((corridor, index) => {
      const x = 50 + corridor.x * zoom;
      const y = 50 + corridor.y * zoom;
      const width = corridor.width * zoom;
      const length = corridor.length * zoom;

      // Draw corridor
      ctx.fillStyle = `rgba(100, 150, 255, 0.3)`;
      ctx.fillRect(x, y, width, length);

      ctx.strokeStyle = "#4169ff";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, length);

      // Draw label
      ctx.fillStyle = "#4169ff";
      ctx.font = "bold 12px Arial";
      ctx.fillText(corridor.name, x + 5, y + 20);
    });
  };

  const drawMeasurements = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.fillStyle = "#666666";
    ctx.font = "10px Arial";

    // Top measurement
    const topY = 30;
    ctx.fillText(`${(storeDimensions.width / 100).toFixed(1)}m`, 50 + (storeDimensions.width * zoom) / 2 - 15, topY);

    // Left measurement
    const leftX = 20;
    ctx.save();
    ctx.translate(leftX, 50 + (storeDimensions.length * zoom) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${(storeDimensions.length / 100).toFixed(1)}m`, 0, 0);
    ctx.restore();
  };

  const handleAddCorridor = () => {
    if (!newCorridor.name) return;

    const corridor: CorridorData = {
      id: `corridor-${Date.now()}`,
      name: newCorridor.name || "Corredor",
      x: newCorridor.x || 0,
      y: newCorridor.y || 0,
      width: newCorridor.width || 300,
      length: newCorridor.length || 2000,
    };

    setCorridors([...corridors, corridor]);
    setNewCorridor({
      name: `Corredor ${corridors.length + 2}`,
      x: 0,
      y: 0,
      width: 300,
      length: 2000,
    });
  };

  const handleDeleteCorridor = (id: string) => {
    setCorridors(corridors.filter(c => c.id !== id));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(storeDimensions, corridors);
    }
  };

  const convertCmToM = (cm: number) => (cm / 100).toFixed(2);
  const convertMToCm = (m: number) => Math.round(m * 100);

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3x3 className="w-5 h-5" />
            {t.floorPlanEditor}
          </CardTitle>
          <CardDescription>
            Crie um esboço da sua loja com medidas precisas
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="measurements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="measurements">{t.measurements}</TabsTrigger>
          <TabsTrigger value="canvas">{t.preview}</TabsTrigger>
        </TabsList>

        {/* Measurements Tab */}
        <TabsContent value="measurements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t.storeDimensions}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>{t.width}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={convertCmToM(storeDimensions.width)}
                      onChange={(e) =>
                        setStoreDimensions({
                          ...storeDimensions,
                          width: convertMToCm(parseFloat(e.target.value) || 0),
                        })
                      }
                      placeholder="0.00"
                    />
                    <span className="flex items-center px-2 py-1 bg-muted rounded">{t.m}</span>
                  </div>
                </div>
                <div>
                  <Label>{t.length}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={convertCmToM(storeDimensions.length)}
                      onChange={(e) =>
                        setStoreDimensions({
                          ...storeDimensions,
                          length: convertMToCm(parseFloat(e.target.value) || 0),
                        })
                      }
                      placeholder="0.00"
                    />
                    <span className="flex items-center px-2 py-1 bg-muted rounded">{t.m}</span>
                  </div>
                </div>
                <div>
                  <Label>{t.height}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={convertCmToM(storeDimensions.height)}
                      onChange={(e) =>
                        setStoreDimensions({
                          ...storeDimensions,
                          height: convertMToCm(parseFloat(e.target.value) || 0),
                        })
                      }
                      placeholder="0.00"
                    />
                    <span className="flex items-center px-2 py-1 bg-muted rounded">{t.m}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t.corridors}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {corridors.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t.noCorridors}</p>
              ) : (
                <div className="space-y-2">
                  {corridors.map((corridor) => (
                    <div key={corridor.id} className="flex items-center justify-between p-3 bg-muted rounded">
                      <div>
                        <p className="font-medium">{corridor.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {convertCmToM(corridor.width)}m × {convertCmToM(corridor.length)}m
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCorridor(corridor.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t pt-4 space-y-3">
                <h4 className="font-medium text-sm">{t.addCorridor}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">{t.corridorName}</Label>
                    <Input
                      value={newCorridor.name || ""}
                      onChange={(e) =>
                        setNewCorridor({ ...newCorridor, name: e.target.value })
                      }
                      placeholder="Corredor 1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">{t.width} ({t.m})</Label>
                    <Input
                      type="number"
                      value={convertCmToM(newCorridor.width || 0)}
                      onChange={(e) =>
                        setNewCorridor({
                          ...newCorridor,
                          width: convertMToCm(parseFloat(e.target.value) || 0),
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">{t.x} ({t.cm})</Label>
                    <Input
                      type="number"
                      value={(newCorridor.x || 0).toString()}
                      onChange={(e) =>
                        setNewCorridor({
                          ...newCorridor,
                          x: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">{t.length} ({t.m})</Label>
                    <Input
                      type="number"
                      value={convertCmToM(newCorridor.length || 0)}
                      onChange={(e) =>
                        setNewCorridor({
                          ...newCorridor,
                          length: convertMToCm(parseFloat(e.target.value) || 0),
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">{t.y} ({t.cm})</Label>
                    <Input
                      type="number"
                      value={(newCorridor.y || 0).toString()}
                      onChange={(e) =>
                        setNewCorridor({
                          ...newCorridor,
                          y: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
                <Button onClick={handleAddCorridor} className="w-full" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  {t.addCorridor}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Canvas Preview Tab */}
        <TabsContent value="canvas" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{t.preview}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowGrid(!showGrid)}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(Math.min(zoom + 0.1, 1))}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(Math.max(zoom - 0.1, 0.2))}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-auto bg-white">
                <canvas
                  ref={canvasRef}
                  width={1200}
                  height={800}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="w-full" size="lg">
            {t.save}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
