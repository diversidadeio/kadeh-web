import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Module, ModuleType, ModuleDimensions } from '@shared/types/storeMapping';
import { Plus, Trash2, Copy } from 'lucide-react';

interface ModuleLibraryProps {
  onModuleSelect: (module: Module) => void;
  language?: 'pt' | 'en';
}

const MODULE_TYPES: Record<ModuleType, { label: Record<'pt' | 'en', string>; defaultDimensions: ModuleDimensions }> = {
  gondola: {
    label: { pt: 'Gôndola', en: 'Gondola' },
    defaultDimensions: { width: 280, depth: 60, height: 150, shelfHeight: 30 },
  },
  freezer_horizontal: {
    label: { pt: 'Freezer Horizontal', en: 'Horizontal Freezer' },
    defaultDimensions: { width: 200, depth: 100, height: 80 },
  },
  freezer_vertical: {
    label: { pt: 'Freezer Vertical', en: 'Vertical Freezer' },
    defaultDimensions: { width: 120, depth: 70, height: 160, shelfHeight: 40 },
  },
  island: {
    label: { pt: 'Ilha de Produtos', en: 'Product Island' },
    defaultDimensions: { width: 150, depth: 150, height: 90, shelfHeight: 30 },
  },
  produce_stand: {
    label: { pt: 'Banca de Frutas/Legumes', en: 'Produce Stand' },
    defaultDimensions: { width: 200, depth: 100, height: 80 },
  },
  hanging_display: {
    label: { pt: 'Display Pendurado', en: 'Hanging Display' },
    defaultDimensions: { width: 100, depth: 30, height: 120 },
  },
};

export const ModuleLibrary: React.FC<ModuleLibraryProps> = ({ onModuleSelect, language = 'pt' }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedType, setSelectedType] = useState<ModuleType>('gondola');
  const [dimensions, setDimensions] = useState<ModuleDimensions>(MODULE_TYPES.gondola.defaultDimensions);
  const [moduleName, setModuleName] = useState('');

  const handleAddModule = () => {
    if (!moduleName.trim()) {
      alert(language === 'pt' ? 'Digite um nome para o módulo' : 'Enter a name for the module');
      return;
    }

    const newModule: Module = {
      id: `module-${Date.now()}`,
      storeId: 'temp-store',
      type: selectedType,
      name: moduleName,
      dimensions,
      position: { x: 0, y: 0 },
      shelves: [],
      totalCapacity: 0,
      totalOccupied: 0,
      occupancyPercentage: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setModules([...modules, newModule]);
    setModuleName('');
    setDimensions(MODULE_TYPES[selectedType].defaultDimensions);
  };

  const handleSelectModule = (module: Module) => {
    onModuleSelect(module);
  };

  const handleDeleteModule = (id: string) => {
    setModules(modules.filter(m => m.id !== id));
  };

  const handleDuplicateModule = (module: Module) => {
    const duplicated: Module = {
      ...module,
      id: `module-${Date.now()}`,
      name: `${module.name} (${language === 'pt' ? 'cópia' : 'copy'})`,
    };
    setModules([...modules, duplicated]);
  };

  const handleDimensionChange = (key: keyof ModuleDimensions, value: number) => {
    setDimensions(prev => ({ ...prev, [key]: value }));
  };

  const handleTypeChange = (type: ModuleType) => {
    setSelectedType(type);
    setDimensions(MODULE_TYPES[type].defaultDimensions);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">
            {language === 'pt' ? 'Criar Módulo' : 'Create Module'}
          </TabsTrigger>
          <TabsTrigger value="library">
            {language === 'pt' ? 'Biblioteca' : 'Library'} ({modules.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'pt' ? 'Novo Módulo' : 'New Module'}</CardTitle>
              <CardDescription>
                {language === 'pt'
                  ? 'Configure as dimensões do módulo'
                  : 'Configure module dimensions'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Nome do Módulo */}
              <div className="space-y-2">
                <Label htmlFor="module-name">
                  {language === 'pt' ? 'Nome do Módulo' : 'Module Name'}
                </Label>
                <Input
                  id="module-name"
                  placeholder={language === 'pt' ? 'Ex: Gôndola Principal' : 'Ex: Main Gondola'}
                  value={moduleName}
                  onChange={e => setModuleName(e.target.value)}
                />
              </div>

              {/* Tipo de Módulo */}
              <div className="space-y-2">
                <Label htmlFor="module-type">
                  {language === 'pt' ? 'Tipo de Módulo' : 'Module Type'}
                </Label>
                <Select value={selectedType} onValueChange={handleTypeChange}>
                  <SelectTrigger id="module-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(MODULE_TYPES).map(([type, config]) => (
                      <SelectItem key={type} value={type}>
                        {config.label[language]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dimensões */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">
                    {language === 'pt' ? 'Largura (cm)' : 'Width (cm)'}
                  </Label>
                  <Input
                    id="width"
                    type="number"
                    value={dimensions.width || ''}
                    onChange={e => handleDimensionChange('width', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="depth">
                    {language === 'pt' ? 'Profundidade (cm)' : 'Depth (cm)'}
                  </Label>
                  <Input
                    id="depth"
                    type="number"
                    value={dimensions.depth || ''}
                    onChange={e => handleDimensionChange('depth', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">
                    {language === 'pt' ? 'Altura (cm)' : 'Height (cm)'}
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    value={dimensions.height || ''}
                    onChange={e => handleDimensionChange('height', parseFloat(e.target.value))}
                  />
                </div>
                {(selectedType === 'gondola' || selectedType === 'freezer_vertical' || selectedType === 'island') && (
                  <div className="space-y-2">
                    <Label htmlFor="shelf-height">
                      {language === 'pt' ? 'Altura Prateleira (cm)' : 'Shelf Height (cm)'}
                    </Label>
                    <Input
                      id="shelf-height"
                      type="number"
                      value={dimensions.shelfHeight || ''}
                      onChange={e => handleDimensionChange('shelfHeight', parseFloat(e.target.value))}
                    />
                  </div>
                )}
              </div>

              <Button onClick={handleAddModule} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                {language === 'pt' ? 'Adicionar à Biblioteca' : 'Add to Library'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          {modules.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  {language === 'pt'
                    ? 'Nenhum módulo criado. Crie um novo módulo na aba anterior.'
                    : 'No modules created. Create a new module in the previous tab.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {modules.map(module => (
                <Card key={module.id} className="cursor-move hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{module.name}</CardTitle>
                        <CardDescription>
                          {MODULE_TYPES[module.type].label[language]}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicateModule(module)}
                          title={language === 'pt' ? 'Duplicar' : 'Duplicate'}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteModule(module.id)}
                          title={language === 'pt' ? 'Deletar' : 'Delete'}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {module.dimensions.width && (
                        <div>
                          <span className="text-muted-foreground">
                            {language === 'pt' ? 'Largura:' : 'Width:'}
                          </span>
                          <p className="font-medium">{module.dimensions.width} cm</p>
                        </div>
                      )}
                      {module.dimensions.depth && (
                        <div>
                          <span className="text-muted-foreground">
                            {language === 'pt' ? 'Profundidade:' : 'Depth:'}
                          </span>
                          <p className="font-medium">{module.dimensions.depth} cm</p>
                        </div>
                      )}
                      {module.dimensions.height && (
                        <div>
                          <span className="text-muted-foreground">
                            {language === 'pt' ? 'Altura:' : 'Height:'}
                          </span>
                          <p className="font-medium">{module.dimensions.height} cm</p>
                        </div>
                      )}
                      {module.dimensions.shelfHeight && (
                        <div>
                          <span className="text-muted-foreground">
                            {language === 'pt' ? 'Alt. Prateleira:' : 'Shelf Height:'}
                          </span>
                          <p className="font-medium">{module.dimensions.shelfHeight} cm</p>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => handleSelectModule(module)}
                      className="w-full"
                      variant="outline"
                    >
                      {language === 'pt' ? 'Usar este Módulo' : 'Use this Module'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
