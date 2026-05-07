import React from 'react';
import LocationMapper from '@/components/LocationMapper';

export default function LocationMapperPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Mapeador de Locais</h1>
          <p className="text-lg text-slate-600">
            Crie mapas interativos de qualquer tipo de local: lojas, mercados, shopping centers, pavilhões, parques, hospitais e órgãos públicos.
          </p>
        </div>
        
        <LocationMapper />
      </div>
    </div>
  );
}
