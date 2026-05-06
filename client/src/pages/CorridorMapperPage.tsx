import CorridorMapper from '@/components/CorridorMapper';

export default function CorridorMapperPage() {
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Mapeador de Corredores</h1>
        <p className="text-gray-600 mb-6">
          Clique para criar nós de corredor, arraste para conectar. Depois atribua localizações e exporte o grafo.
        </p>
        <CorridorMapper />
      </div>
    </div>
  );
}
