import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'wouter';
import StoreFloorPlanEditor from '@/components/store-mapping/StoreFloorPlanEditor';
import { ModuleLibrary } from '@/components/store-mapping/ModuleLibrary';
import { Store, Module, Corridor } from '@shared/types/storeMapping';
import { generateStoreLayoutRecommendations, calculateRecommendationImpact } from '@/lib/storeSmartLayout';
import { AlertCircle, MapPin, Package, TrendingUp, Settings } from 'lucide-react';

interface StoreMappingState {
  store: Store | null;
  modules: Module[];
  selectedModule: Module | null;
  recommendations: any[];
}

export default function StoreMapping() {
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');
  const [state, setState] = useState<StoreMappingState>({
    store: null,
    modules: [],
    selectedModule: null,
    recommendations: [],
  });

  const [activeTab, setActiveTab] = useState('editor');

  const handleCreateStore = (dimensions: any, corridors: any) => {
    const newStore: Store = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Loja ${new Date().toLocaleDateString()}`,
      dimensions: {
        width: dimensions.width,
        length: dimensions.length,
        height: dimensions.height,
        unit: 'cm',
      },
      corridors: corridors.map((c: any) => ({
        id: c.id,
        name: c.name,
        position: { x: c.x, y: c.y },
        dimensions: { width: c.width, length: c.length },
        modules: [],
      })),
      layoutType: 'linear',
      modules: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setState(prev => ({ ...prev, store: newStore }));
    setActiveTab('modules');
  };

  const handleModuleSelect = (module: Module) => {
    setState(prev => ({
      ...prev,
      modules: [...prev.modules, { ...module, storeId: prev.store?.id || 'temp' }],
      selectedModule: module,
    }));
  };

  const handleGenerateRecommendations = () => {
    if (state.modules.length === 0) {
      alert(language === 'pt' ? 'Adicione módulos primeiro' : 'Add modules first');
      return;
    }

    // Gera recomendações para cada módulo
    const allRecommendations = state.modules.map(module => {
      const mockProducts = [
        { name: 'Produto Premium', margin: 'Alta' as const, velocity: 'Alto' as const },
        { name: 'Produto Padrão', margin: 'Média' as const, velocity: 'Médio' as const },
        { name: 'Produto Econômico', margin: 'Baixa' as const, velocity: 'Alto' as const },
      ];

      return generateStoreLayoutRecommendations(module, mockProducts);
    });

    setState(prev => ({ ...prev, recommendations: allRecommendations }));
    setActiveTab('recommendations');
  };

  const handleRemoveModule = (moduleId: string) => {
    setState(prev => ({
      ...prev,
      modules: prev.modules.filter(m => m.id !== moduleId),
    }));
  };

  const labels = {
    pt: {
      title: 'Mapeamento de Loja',
      subtitle: 'Crie a planta baixa da sua loja e otimize o posicionamento de produtos',
      editor: 'Editor de Planta',
      modules: 'Biblioteca de Módulos',
      summary: 'Resumo',
      createStore: 'Criar Loja',
      addModules: 'Adicionar Módulos',
      generateRec: 'Gerar Recomendações',
      storeInfo: 'Informações da Loja',
      noStore: 'Nenhuma loja criada. Comece criando uma nova loja no editor de planta.',
      modulesAdded: 'Módulos Adicionados',
      noModules: 'Nenhum módulo adicionado ainda.',
      recommendationsTitle: 'Recomendações de Posicionamento',
      impact: 'Impacto Estimado',
      salesIncrease: 'Aumento de Vendas',
      marginIncrease: 'Aumento de Margem',
      ruptureReduction: 'Redução de Ruptura',
    },
    en: {
      title: 'Store Mapping',
      subtitle: 'Create your store floor plan and optimize product positioning',
      editor: 'Floor Plan Editor',
      modules: 'Module Library',
      summary: 'Summary',
      createStore: 'Create Store',
      addModules: 'Add Modules',
      generateRec: 'Generate Recommendations',
      storeInfo: 'Store Information',
      noStore: 'No store created. Start by creating a new store in the floor plan editor.',
      modulesAdded: 'Added Modules',
      noModules: 'No modules added yet.',
      recommendationsTitle: 'Positioning Recommendations',
      impact: 'Estimated Impact',
      salesIncrease: 'Sales Increase',
      marginIncrease: 'Margin Increase',
      ruptureReduction: 'Rupture Reduction',
    },
  };

  const t = labels[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">{t.title}</h1>
              <p className="text-slate-600 mt-2">{t.subtitle}</p>
            </div>
            <div className="flex gap-2 items-center">
              <Link href="/admin/categories">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  {language === 'pt' ? 'Admin Categorias' : 'Admin Categories'}
                </Button>
              </Link>
              <Button
                variant={language === 'pt' ? 'default' : 'outline'}
                onClick={() => setLanguage('pt')}
                size="sm"
              >
                PT
              </Button>
              <Button
                variant={language === 'en' ? 'default' : 'outline'}
                onClick={() => setLanguage('en')}
                size="sm"
              >
                EN
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {t.editor}
            </TabsTrigger>
            <TabsTrigger value="modules" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              {t.modules}
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t.recommendationsTitle}
            </TabsTrigger>
            <TabsTrigger value="summary">{t.summary}</TabsTrigger>
          </TabsList>

          {/* Tab: Editor */}
          <TabsContent value="editor" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.editor}</CardTitle>
                <CardDescription>
                  {language === 'pt'
                    ? 'Crie um esboço da sua loja e defina as medidas em metros/centímetros'
                    : 'Create a sketch of your store and set measurements in meters/centimeters'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {state.store ? (
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {language === 'pt'
                          ? `Loja "${state.store.name}" criada com sucesso. Dimensões: ${state.store.dimensions.width}cm × ${state.store.dimensions.length}cm`
                          : `Store "${state.store.name}" created successfully. Dimensions: ${state.store.dimensions.width}cm × ${state.store.dimensions.length}cm`}
                      </AlertDescription>
                    </Alert>
                    <Button onClick={() => setActiveTab('modules')} className="w-full">
                      {t.addModules}
                    </Button>
                  </div>
                ) : (
                  <StoreFloorPlanEditor onSave={handleCreateStore} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Modules */}
          <TabsContent value="modules" className="space-y-4">
            {state.store ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <ModuleLibrary onModuleSelect={handleModuleSelect} language={language} />
                </div>
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t.modulesAdded}</CardTitle>
                      <CardDescription>
                        {state.modules.length} {language === 'pt' ? 'módulo(s) adicionado(s)' : 'module(s) added'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {state.modules.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">{t.noModules}</p>
                      ) : (
                        <div className="space-y-3">
                          {state.modules.map(module => (
                            <Card key={module.id} className="p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold">{module.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {module.dimensions.width}cm × {module.dimensions.depth}cm × {module.dimensions.height}cm
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveModule(module.id)}
                                  className="text-destructive"
                                >
                                  {language === 'pt' ? 'Remover' : 'Remove'}
                                </Button>
                              </div>
                            </Card>
                          ))}
                          <Button onClick={handleGenerateRecommendations} className="w-full mt-4">
                            {t.generateRec}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{t.noStore}</AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Tab: Recommendations */}
          <TabsContent value="recommendations" className="space-y-4">
            {state.recommendations.length > 0 ? (
              <div className="space-y-4">
                {state.recommendations.map((rec, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle>{rec.moduleName}</CardTitle>
                      <CardDescription>
                        {language === 'pt' ? 'Score de Otimização' : 'Optimization Score'}: {rec.optimizationScore.toFixed(1)}%
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {rec.recommendations.map((prod: any, pidx: number) => (
                          <Card key={pidx} className="p-3">
                            <p className="font-semibold text-sm">{prod.productName}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {language === 'pt' ? 'Zona:' : 'Zone:'} {prod.recommendedZone}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {language === 'pt' ? 'Prioridade:' : 'Priority:'} {prod.priority}/10
                            </p>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {language === 'pt'
                    ? 'Nenhuma recomendação gerada. Adicione módulos e clique em "Gerar Recomendações".'
                    : 'No recommendations generated. Add modules and click "Generate Recommendations".'}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Tab: Summary */}
          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t.storeInfo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {state.store ? (
                    <>
                      <p>
                        <strong>{language === 'pt' ? 'Nome:' : 'Name:'}</strong> {state.store.name}
                      </p>
                      <p>
                        <strong>{language === 'pt' ? 'Dimensões:' : 'Dimensions:'}</strong> {state.store.dimensions.width}cm × {state.store.dimensions.length}cm
                      </p>
                      <p>
                        <strong>{language === 'pt' ? 'Corredores:' : 'Corridors:'}</strong> {state.store.corridors.length}
                      </p>
                    </>
                  ) : (
                    <p className="text-muted-foreground">{t.noStore}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t.modulesAdded}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    <strong>{language === 'pt' ? 'Total:' : 'Total:'}</strong> {state.modules.length}
                  </p>
                  {state.modules.length > 0 && (
                    <>
                      <p>
                        <strong>{language === 'pt' ? 'Capacidade Total:' : 'Total Capacity:'}</strong>{' '}
                        {state.modules.reduce((acc, m) => acc + m.dimensions.width * m.dimensions.depth * m.dimensions.height, 0)} cm³
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
