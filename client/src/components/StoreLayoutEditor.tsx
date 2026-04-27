import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { useLanguage } from '@/contexts/LanguageContext';

interface Category {
  id: number;
  code: string;
  name: string;
  nameEn?: string | null;
  x: number;
  y: number;
  radius: number;
  color: string;
  userId?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RoutePoint {
  x: number;
  y: number;
}

interface DrawingRoute {
  fromCategoryId: number | null;
  points: RoutePoint[];
  isDrawing: boolean;
}

export function StoreLayoutEditor() {
  const { language } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [drawingRoute, setDrawingRoute] = useState<DrawingRoute>({
    fromCategoryId: null,
    points: [],
    isDrawing: false,
  });
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [newCategoryCode, setNewCategoryCode] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#3b82f6');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [routes, setRoutes] = useState<any[]>([]);
  const [editingRouteId, setEditingRouteId] = useState<number | null>(null);
  const [editingRoutePoints, setEditingRoutePoints] = useState<RoutePoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch categories and routes
  const { data: fetchedCategories } = trpc.storeLayout.categories.list.useQuery();
  const { data: fetchedRoutes } = trpc.storeLayout.routes.list.useQuery();
  const createCategoryMutation = trpc.storeLayout.categories.create.useMutation();
  const deleteCategoryMutation = trpc.storeLayout.categories.delete.useMutation();
  const updateCategoryMutation = trpc.storeLayout.categories.update.useMutation();
  const createRouteMutation = trpc.storeLayout.routes.create.useMutation();
  const updateRouteMutation = trpc.storeLayout.routes.update.useMutation();
  const deleteRouteMutation = trpc.storeLayout.routes.delete.useMutation();

  useEffect(() => {
    if (fetchedCategories) {
      setCategories(fetchedCategories);
    }
  }, [fetchedCategories]);

  useEffect(() => {
    if (fetchedRoutes) {
      setRoutes(fetchedRoutes);
    }
  }, [fetchedRoutes]);

  // Load floor plan image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/pasted_file_h1C8DW_image_a64ee5f4.png';

    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
      redrawCanvas();
    };

    img.onerror = () => {
      console.error('Failed to load floor plan image');
    };
  }, []);

  // Redraw canvas
  const redrawCanvas = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const img = imageRef.current;

    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw image
    ctx.drawImage(img, 0, 0);

    // Draw categories
    categories.forEach((cat) => {
      ctx.fillStyle = cat.color + '80'; // 50% opacity
      ctx.beginPath();
      ctx.arc(cat.x, cat.y, cat.radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw border
      ctx.strokeStyle = cat.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw code
      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cat.code, cat.x, cat.y);
    });

    // Draw drawing route
    if (drawingRoute.points.length > 0) {
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(drawingRoute.points[0].x, drawingRoute.points[0].y);

      for (let i = 1; i < drawingRoute.points.length; i++) {
        ctx.lineTo(drawingRoute.points[i].x, drawingRoute.points[i].y);
      }
      ctx.stroke();

      // Draw points
      drawingRoute.points.forEach((point) => {
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  };

  useEffect(() => {
    redrawCanvas();
  }, [categories, drawingRoute]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) * (canvasRef.current.width / rect.width));
    const y = Math.round((e.clientY - rect.top) * (canvasRef.current.height / rect.height));

    // Check if clicking on a category
    const clickedCategory = categories.find((cat) => {
      const dist = Math.hypot(cat.x - x, cat.y - y);
      return dist <= cat.radius;
    });

    if (clickedCategory) {
      if (drawingRoute.fromCategoryId === null) {
        // Start drawing route
        setDrawingRoute({
          fromCategoryId: clickedCategory.id,
          points: [{ x: clickedCategory.x, y: clickedCategory.y }],
          isDrawing: true,
        });
      } else if (drawingRoute.fromCategoryId !== clickedCategory.id) {
        // End drawing route
        handleSaveRoute(clickedCategory.id);
      }
    } else if (drawingRoute.isDrawing) {
      // Add point to route
      setDrawingRoute((prev) => ({
        ...prev,
        points: [...prev.points, { x, y }],
      }));
    }
  };

  const handleSaveRoute = async (toCategoryId: number) => {
    if (drawingRoute.fromCategoryId === null || drawingRoute.points.length < 2) return;

    try {
      // Calculate distance
      let distance = 0;
      for (let i = 1; i < drawingRoute.points.length; i++) {
        const dx = drawingRoute.points[i].x - drawingRoute.points[i - 1].x;
        const dy = drawingRoute.points[i].y - drawingRoute.points[i - 1].y;
        distance += Math.hypot(dx, dy);
      }

      await createRouteMutation.mutateAsync({
        fromCategoryId: drawingRoute.fromCategoryId,
        toCategoryId,
        pathPoints: drawingRoute.points,
        distance: Math.round(distance),
      });

      // Reset drawing
      setDrawingRoute({
        fromCategoryId: null,
        points: [],
        isDrawing: false,
      });
    } catch (error) {
      console.error('Failed to save route:', error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryCode || !newCategoryName) {
      setError(language === 'pt' ? 'Preencha código e nome' : 'Fill in code and name');
      return;
    }

    try {
      setError(null);
      const newCategory = await createCategoryMutation.mutateAsync({
        code: newCategoryCode,
        name: newCategoryName,
        x: 100,
        y: 100,
        color: newCategoryColor,
      });

      if (newCategory) {
        setCategories((prev) => [...prev, newCategory]);
        setNewCategoryCode('');
        setNewCategoryName('');
        setNewCategoryColor('#3b82f6');
        setSuccess(language === 'pt' ? 'Categoria adicionada com sucesso!' : 'Category added successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(language === 'pt' ? 'Erro ao adicionar categoria' : 'Failed to add category');
      }
    } catch (err: any) {
      console.error('Failed to add category:', err);
      setError(err.message || (language === 'pt' ? 'Erro ao adicionar categoria' : 'Failed to add category'));
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      setError(null);
      await deleteCategoryMutation.mutateAsync({ id });
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      setSuccess(language === 'pt' ? 'Categoria deletada com sucesso!' : 'Category deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Failed to delete category:', err);
      setError(err.message || (language === 'pt' ? 'Erro ao deletar categoria' : 'Failed to delete category'));
    }
  };

  const handleCancelRoute = () => {
    setDrawingRoute({
      fromCategoryId: null,
      points: [],
      isDrawing: false,
    });
  };

  const handleEditRoute = (routeId: number) => {
    const route = routes.find(r => r.id === routeId);
    if (route) {
      setEditingRouteId(routeId);
      setEditingRoutePoints(route.pathPoints);
      setDrawingRoute({
        fromCategoryId: null,
        points: route.pathPoints,
        isDrawing: false,
      });
    }
  };

  const handleSaveEditedRoute = async () => {
    if (editingRouteId === null || editingRoutePoints.length < 2) return;

    try {
      let distance = 0;
      for (let i = 1; i < editingRoutePoints.length; i++) {
        const dx = editingRoutePoints[i].x - editingRoutePoints[i - 1].x;
        const dy = editingRoutePoints[i].y - editingRoutePoints[i - 1].y;
        distance += Math.hypot(dx, dy);
      }

      await updateRouteMutation.mutateAsync({
        id: editingRouteId,
        pathPoints: editingRoutePoints,
        distance: Math.round(distance),
      });

      setEditingRouteId(null);
      setEditingRoutePoints([]);
      setDrawingRoute({
        fromCategoryId: null,
        points: [],
        isDrawing: false,
      });
    } catch (error) {
      console.error('Failed to save edited route:', error);
    }
  };

  const handleDeleteRoute = async (routeId: number) => {
    try {
      await deleteRouteMutation.mutateAsync({ id: routeId });
      setRoutes((prev) => prev.filter((r) => r.id !== routeId));
    } catch (error) {
      console.error('Failed to delete route:', error);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">
          {language === 'pt' ? 'Editor de Layout da Loja' : 'Store Layout Editor'}
        </h2>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-semibold">{success}</p>
          </div>
        )}

        {/* Canvas */}
        <div className="mb-6 border-2 border-gray-300 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-auto cursor-crosshair"
            style={{ maxHeight: '600px', objectFit: 'contain' }}
          />
        </div>

        {/* Drawing status */}
        {drawingRoute.isDrawing && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 mb-2">
              {language === 'pt'
                ? `Desenhando rota... Clique em outra categoria para finalizar ou clique em pontos para adicionar à rota`
                : 'Drawing route... Click another category to finish or click points to add to route'}
            </p>
            <Button onClick={handleCancelRoute} variant="outline" size="sm">
              {language === 'pt' ? 'Cancelar' : 'Cancel'}
            </Button>
          </div>
        )}

        {/* Category management */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add category */}
          <div className="space-y-3">
            <h3 className="font-semibold">
              {language === 'pt' ? 'Adicionar Categoria' : 'Add Category'}
            </h3>
            <Input
              placeholder={language === 'pt' ? 'Código (ex: A1)' : 'Code (e.g., A1)'}
              value={newCategoryCode}
              onChange={(e) => setNewCategoryCode(e.target.value.toUpperCase())}
            />
            <Input
              placeholder={language === 'pt' ? 'Nome' : 'Name'}
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="color"
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <Button onClick={handleAddCategory} className="flex-1">
                {language === 'pt' ? 'Adicionar' : 'Add'}
              </Button>
            </div>
          </div>

          {/* Category list */}
          <div className="space-y-3">
            <h3 className="font-semibold">
              {language === 'pt' ? 'Categorias ({categories.length})' : 'Categories ({categories.length})'}
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`p-2 rounded border-2 cursor-pointer ${
                    selectedCategory === cat.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-semibold">{cat.code}</span>
                      <span className="text-sm text-gray-600">{cat.name}</span>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(cat.id);
                      }}
                      variant="destructive"
                      size="sm"
                    >
                      {language === 'pt' ? 'Deletar' : 'Delete'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Routes list */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">
            {language === 'pt' ? `Rotas Salvas (${routes.length})` : `Saved Routes (${routes.length})`}
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {routes.length === 0 ? (
              <p className="text-gray-500 text-sm">
                {language === 'pt' ? 'Nenhuma rota salva ainda' : 'No routes saved yet'}
              </p>
            ) : (
              routes.map((route) => {
                const fromCat = categories.find(c => c.id === route.fromCategoryId);
                const toCat = categories.find(c => c.id === route.toCategoryId);
                const isEditing = editingRouteId === route.id;

                return (
                  <div
                    key={route.id}
                    className={`p-3 rounded border-2 ${
                      isEditing ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          {fromCat?.code} → {toCat?.code}
                        </p>
                        <p className="text-xs text-gray-600">
                          {fromCat?.name} para {toCat?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {language === 'pt' ? 'Distância' : 'Distance'}: {route.distance} px
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditRoute(route.id)}
                          variant="outline"
                          size="sm"
                        >
                          {language === 'pt' ? 'Editar' : 'Edit'}
                        </Button>
                        <Button
                          onClick={() => handleDeleteRoute(route.id)}
                          variant="destructive"
                          size="sm"
                        >
                          {language === 'pt' ? 'Deletar' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                    {isEditing && (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <p className="text-xs text-blue-700 mb-2">
                          {language === 'pt'
                            ? 'Clique no mapa para adicionar/modificar pontos da rota'
                            : 'Click on the map to add/modify route points'}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSaveEditedRoute}
                            size="sm"
                            className="flex-1"
                          >
                            {language === 'pt' ? 'Salvar Edição' : 'Save Edit'}
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingRouteId(null);
                              setEditingRoutePoints([]);
                              setDrawingRoute({
                                fromCategoryId: null,
                                points: [],
                                isDrawing: false,
                              });
                            }}
                            variant="outline"
                            size="sm"
                          >
                            {language === 'pt' ? 'Cancelar' : 'Cancel'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">
            {language === 'pt' ? 'Como usar:' : 'How to use:'}
          </h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>{language === 'pt' ? 'Adicione categorias com código alfanumérico' : 'Add categories with alphanumeric codes'}</li>
            <li>{language === 'pt' ? 'Clique em uma categoria para começar a desenhar uma rota' : 'Click a category to start drawing a route'}</li>
            <li>{language === 'pt' ? 'Clique em pontos no mapa para traçar a rota' : 'Click points on the map to trace the route'}</li>
            <li>{language === 'pt' ? 'Clique em outra categoria para finalizar a rota' : 'Click another category to finish the route'}</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
