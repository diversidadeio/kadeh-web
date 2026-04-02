interface Product {
  id: string;
  name: string;
  zone?: 'Altura dos olhos' | 'Altura das mãos' | 'Parte de Baixo';
  zona?: 'Altura dos olhos' | 'Altura das mãos' | 'Parte de Baixo';
  quadrantes: number;
  largura?: number;
  share?: number;
  giro?: string;
  margem?: string;
}

interface GondolaFrontViewProps {
  products: Product[];
  totalWidth?: number;
  shelfHeight?: number;
  numberOfShelves?: number;
  language?: 'pt' | 'en';
}

const zoneColors = {
  'Altura dos olhos': { bg: '#FEF3C7', border: '#FBBF24', label: 'Altura dos olhos' },
  'Altura das mãos': { bg: '#DBEAFE', border: '#3B82F6', label: 'Altura das mãos' },
  'Parte de Baixo': { bg: '#DCFCE7', border: '#22C55E', label: 'Parte de Baixo' },
};

const zoneColorsEn = {
  'Altura dos olhos': { bg: '#FEF3C7', border: '#FBBF24', label: 'Eye Level' },
  'Altura das mãos': { bg: '#DBEAFE', border: '#3B82F6', label: 'Hand Level' },
  'Parte de Baixo': { bg: '#DCFCE7', border: '#22C55E', label: 'Bottom Shelf' },
};

/**
 * Determina a zona de uma prateleira baseado em seu número
 * Prateleiras 1-2: Parte de Baixo
 * Prateleiras 3-4: Altura das Mãos
 * Prateleiras 5+: Altura dos Olhos
 */
function getShelfZone(shelfNumber: number): 'Parte de Baixo' | 'Altura das mãos' | 'Altura dos olhos' {
  if (shelfNumber <= 2) return 'Parte de Baixo';
  if (shelfNumber <= 4) return 'Altura das mãos';
  return 'Altura dos olhos'; // Prateleira 5 e acima
}

/**
 * Renderiza uma prateleira com produtos distribuídos proporcionalmente por percentual (share)
 */
function renderShelf(
  productsInZone: Product[],
  totalWidth: number,
  shelfHeight: number,
  zoneColor: any,
  language: string
) {
  if (productsInZone.length === 0) {
    return (
      <div className="w-full flex items-center justify-center text-gray-400 text-xs bg-gray-50">
        {language === 'pt' ? 'Sem produtos' : 'No products'}
      </div>
    );
  }

  // Calcular share total
  const totalShare = productsInZone.reduce((sum, p) => sum + (p.share || 0), 0);
  const useShare = totalShare > 0;

  return (
    <div className="flex w-full h-full overflow-hidden">
      {productsInZone.map((product, index) => {
        let widthPercent = 0;
        let displayValue = '';
        
        if (useShare) {
          widthPercent = product.share || 0;
          displayValue = `${(product.share || 0).toFixed(1)}%`;
        } else {
          const totalProductWidth = productsInZone.reduce((sum, p) => sum + (p.largura || 10), 0);
          const productWidth = product.largura || 10;
          widthPercent = (productWidth / totalProductWidth) * 100;
          displayValue = `${productWidth}cm`;
        }

        return (
          <div
            key={product.id}
            className="flex flex-col items-center justify-center border-r border-gray-300 last:border-r-0 p-2 overflow-hidden transition-all hover:opacity-80"
            style={{
              width: `${widthPercent}%`,
              backgroundColor: zoneColor.bg,
              minWidth: widthPercent > 5 ? '30px' : '20px',
            }}
            title={`${product.name} - ${displayValue}`}
          >
            <span className="text-xs font-bold text-gray-800 text-center truncate line-clamp-2">
              {product.name}
            </span>
            <span className="text-xs text-gray-600 font-semibold">
              {displayValue}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Renderiza uma seção de prateleira com número e label
 */
function renderShelfSection(
  shelfNumber: number,
  zone: string,
  productsInZone: Product[],
  totalWidth: number,
  shelfHeight: number,
  colors: any,
  language: string
) {
  const zoneColor = colors[zone as keyof typeof colors];
  
  // Calcular espaço utilizado
  const totalShare = productsInZone.reduce((sum, p) => sum + (p.share || 0), 0);
  const usedPercentage = Math.min(totalShare, 100);
  
  return (
    <div key={`shelf-${shelfNumber}`}>
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-4 h-4 rounded"
          style={{ backgroundColor: zoneColor.bg }}
        />
        <span className="text-sm font-semibold text-gray-700">
          {language === 'pt' 
            ? `Prateleira ${shelfNumber} - ${zoneColor.label}` 
            : `Shelf ${shelfNumber} - ${zoneColor.label}`}
        </span>
        <span className="text-xs text-gray-500">
          {usedPercentage.toFixed(1)}% / 100%
        </span>
      </div>
      <div
        className="border-2 rounded-md overflow-hidden"
        style={{
          borderColor: zoneColor.border,
          height: `${shelfHeight}px`,
        }}
      >
        {renderShelf(
          productsInZone,
          totalWidth,
          shelfHeight,
          zoneColor,
          language
        )}
      </div>
    </div>
  );
}

/**
 * Distribui produtos nas prateleiras respeitando hierarquia de preenchimento:
 * HIERARQUIA: Altura dos Olhos > Altura das Mãos > Parte de Baixo
 * 
 * Classificação de Prateleiras:
 * - Prateleiras 1-2: Parte de Baixo
 * - Prateleiras 3-4: Altura das Mãos
 * - Prateleiras 5+: Altura dos Olhos (qualquer prateleira acima da 5 também é Altura dos Olhos)
 */
function distributeProductsToShelves(products: Product[], numberOfShelves: number = 5): Map<number, Product[]> {
  const productsByZone = {
    'Altura dos olhos': products.filter(p => (p.zone || p.zona) === 'Altura dos olhos'),
    'Altura das mãos': products.filter(p => (p.zone || p.zona) === 'Altura das mãos'),
    'Parte de Baixo': products.filter(p => (p.zone || p.zona) === 'Parte de Baixo'),
  };

  // Mapa de prioridade de margem (A > B > C)
  const marginPriority = { 'A': 3, 'B': 2, 'C': 1, undefined: 0 };

  // Função auxiliar para ordenar por margem
  const sortByMargin = (products: Product[]) => {
    return [...products].sort((a, b) => {
      const priorityA = marginPriority[a.margem as keyof typeof marginPriority] || 0;
      const priorityB = marginPriority[b.margem as keyof typeof marginPriority] || 0;
      return priorityB - priorityA;
    });
  };

  // Rastrear produtos já usados
  const usedProductIds = new Set<string>();
  
  // Mapa de prateleiras
  const shelvesMap = new Map<number, Product[]>();
  for (let i = 1; i <= numberOfShelves; i++) {
    shelvesMap.set(i, []);
  }

  // ============ PRATELEIRAS 1-2 (Parte de Baixo) ============
  const bottomShelfNumbers = [1, 2].filter(n => n <= numberOfShelves);
  let spaceRemainingByShelf = new Map<number, number>();
  
  for (const shelfNum of bottomShelfNumbers) {
    spaceRemainingByShelf.set(shelfNum, 100);
  }

  // 1. Adicionar produtos da Parte de Baixo
  for (const product of productsByZone['Parte de Baixo']) {
    const productShare = product.share || 0;
    let placed = false;

    for (const shelfNum of bottomShelfNumbers) {
      const spaceRemaining = spaceRemainingByShelf.get(shelfNum) || 0;
      if (productShare <= spaceRemaining) {
        shelvesMap.get(shelfNum)!.push(product);
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(shelfNum, spaceRemaining - productShare);
        placed = true;
        break;
      }
    }

    if (!placed && productShare > 0) {
      // Adicionar à prateleira com mais espaço
      let maxShelfNum = bottomShelfNumbers[0];
      let maxSpace = spaceRemainingByShelf.get(maxShelfNum) || 0;
      
      for (const shelfNum of bottomShelfNumbers) {
        const space = spaceRemainingByShelf.get(shelfNum) || 0;
        if (space > maxSpace) {
          maxSpace = space;
          maxShelfNum = shelfNum;
        }
      }

      if (maxSpace > 5) {
        shelvesMap.get(maxShelfNum)!.push({ ...product, share: maxSpace });
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(maxShelfNum, 0);
      }
    }
  }

  // 2. Preencher com Altura das Mãos (melhor margem primeiro)
  const handLevelSorted = sortByMargin(productsByZone['Altura das mãos']);
  for (const product of handLevelSorted) {
    if (usedProductIds.has(product.id)) continue;
    
    const productShare = product.share || 0;
    let placed = false;

    for (const shelfNum of bottomShelfNumbers) {
      const spaceRemaining = spaceRemainingByShelf.get(shelfNum) || 0;
      if (productShare <= spaceRemaining && spaceRemaining > 0) {
        shelvesMap.get(shelfNum)!.push(product);
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(shelfNum, spaceRemaining - productShare);
        placed = true;
        break;
      }
    }

    if (!placed && productShare > 0) {
      let maxShelfNum = bottomShelfNumbers[0];
      let maxSpace = spaceRemainingByShelf.get(maxShelfNum) || 0;
      
      for (const shelfNum of bottomShelfNumbers) {
        const space = spaceRemainingByShelf.get(shelfNum) || 0;
        if (space > maxSpace) {
          maxSpace = space;
          maxShelfNum = shelfNum;
        }
      }

      if (maxSpace > 5) {
        shelvesMap.get(maxShelfNum)!.push({ ...product, share: maxSpace });
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(maxShelfNum, 0);
      }
    }
  }

  // 3. Se ainda houver espaço, preencher com Altura dos Olhos (melhor margem primeiro)
  const eyeLevelSorted = sortByMargin(productsByZone['Altura dos olhos']);
  for (const product of eyeLevelSorted) {
    if (usedProductIds.has(product.id)) continue;
    
    const productShare = product.share || 0;
    let placed = false;

    for (const shelfNum of bottomShelfNumbers) {
      const spaceRemaining = spaceRemainingByShelf.get(shelfNum) || 0;
      if (productShare <= spaceRemaining && spaceRemaining > 0) {
        shelvesMap.get(shelfNum)!.push(product);
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(shelfNum, spaceRemaining - productShare);
        placed = true;
        break;
      }
    }

    if (!placed && productShare > 0) {
      let maxShelfNum = bottomShelfNumbers[0];
      let maxSpace = spaceRemainingByShelf.get(maxShelfNum) || 0;
      
      for (const shelfNum of bottomShelfNumbers) {
        const space = spaceRemainingByShelf.get(shelfNum) || 0;
        if (space > maxSpace) {
          maxSpace = space;
          maxShelfNum = shelfNum;
        }
      }

      if (maxSpace > 5) {
        shelvesMap.get(maxShelfNum)!.push({ ...product, share: maxSpace });
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(maxShelfNum, 0);
      }
    }
  }

  // ============ PRATELEIRAS 3-4 (Altura das Mãos) ============
  const handShelfNumbers = [3, 4].filter(n => n <= numberOfShelves);
  spaceRemainingByShelf.clear();
  
  for (const shelfNum of handShelfNumbers) {
    spaceRemainingByShelf.set(shelfNum, 100);
  }

  // Distribuir produtos de Altura das Mãos
  const availableHandProducts = productsByZone['Altura das mãos'].filter(p => !usedProductIds.has(p.id));
  const handLevelSorted2 = sortByMargin(availableHandProducts);

  for (const product of handLevelSorted2) {
    if (usedProductIds.has(product.id)) continue;
    
    const productShare = product.share || 0;
    let placed = false;

    for (const shelfNum of handShelfNumbers) {
      const spaceRemaining = spaceRemainingByShelf.get(shelfNum) || 0;
      if (productShare <= spaceRemaining) {
        shelvesMap.get(shelfNum)!.push(product);
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(shelfNum, spaceRemaining - productShare);
        placed = true;
        break;
      }
    }

    if (!placed && productShare > 0) {
      let maxShelfNum = handShelfNumbers[0];
      let maxSpace = spaceRemainingByShelf.get(maxShelfNum) || 0;
      
      for (const shelfNum of handShelfNumbers) {
        const space = spaceRemainingByShelf.get(shelfNum) || 0;
        if (space > maxSpace) {
          maxSpace = space;
          maxShelfNum = shelfNum;
        }
      }

      if (maxSpace > 5) {
        shelvesMap.get(maxShelfNum)!.push({ ...product, share: maxSpace });
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(maxShelfNum, 0);
      }
    }
  }

  // Preencher espaço restante com Altura dos Olhos (melhor margem primeiro)
  const eyeLevelSorted2 = sortByMargin(productsByZone['Altura dos olhos'].filter(p => !usedProductIds.has(p.id)));
  
  for (const product of eyeLevelSorted2) {
    if (usedProductIds.has(product.id)) continue;
    
    const productShare = product.share || 0;
    let placed = false;

    for (const shelfNum of handShelfNumbers) {
      const spaceRemaining = spaceRemainingByShelf.get(shelfNum) || 0;
      if (spaceRemaining > 0) {
        const shareToUse = Math.min(productShare, spaceRemaining);
        if (shareToUse > 5) {
          shelvesMap.get(shelfNum)!.push({ ...product, share: shareToUse });
          usedProductIds.add(product.id);
          spaceRemainingByShelf.set(shelfNum, spaceRemaining - shareToUse);
          placed = true;
          break;
        }
      }
    }
  }

  // ============ PRATELEIRAS 5+ (Altura dos Olhos) ============
  const eyeShelfNumbers = Array.from({ length: numberOfShelves - 4 }, (_, i) => i + 5).filter(n => n <= numberOfShelves);
  spaceRemainingByShelf.clear();
  
  for (const shelfNum of eyeShelfNumbers) {
    spaceRemainingByShelf.set(shelfNum, 100);
  }

  // 1. Adicionar produtos de Altura dos Olhos
  for (const product of productsByZone['Altura dos olhos']) {
    if (usedProductIds.has(product.id)) continue;
    
    const productShare = product.share || 0;
    let placed = false;

    for (const shelfNum of eyeShelfNumbers) {
      const spaceRemaining = spaceRemainingByShelf.get(shelfNum) || 0;
      if (productShare <= spaceRemaining) {
        shelvesMap.get(shelfNum)!.push(product);
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(shelfNum, spaceRemaining - productShare);
        placed = true;
        break;
      }
    }

    if (!placed && productShare > 0) {
      let maxShelfNum = eyeShelfNumbers[0];
      let maxSpace = spaceRemainingByShelf.get(maxShelfNum) || 0;
      
      for (const shelfNum of eyeShelfNumbers) {
        const space = spaceRemainingByShelf.get(shelfNum) || 0;
        if (space > maxSpace) {
          maxSpace = space;
          maxShelfNum = shelfNum;
        }
      }

      if (maxSpace > 5) {
        shelvesMap.get(maxShelfNum)!.push({ ...product, share: maxSpace });
        usedProductIds.add(product.id);
        spaceRemainingByShelf.set(maxShelfNum, 0);
      }
    }
  }

  // 2. Preencher espaço restante com Altura das Mãos (melhor margem primeiro)
  const handLevelSorted3 = sortByMargin(productsByZone['Altura das mãos'].filter(p => !usedProductIds.has(p.id)));
  
  for (const product of handLevelSorted3) {
    if (usedProductIds.has(product.id)) continue;
    
    const productShare = product.share || 0;
    let placed = false;

    for (const shelfNum of eyeShelfNumbers) {
      const spaceRemaining = spaceRemainingByShelf.get(shelfNum) || 0;
      if (spaceRemaining > 0) {
        const shareToUse = Math.min(productShare, spaceRemaining);
        if (shareToUse > 5) {
          shelvesMap.get(shelfNum)!.push({ ...product, share: shareToUse });
          usedProductIds.add(product.id);
          spaceRemainingByShelf.set(shelfNum, spaceRemaining - shareToUse);
          placed = true;
          break;
        }
      }
    }
  }

  return shelvesMap;
}

export default function GondolaFrontView({
  products,
  totalWidth = 280,
  shelfHeight = 60,
  numberOfShelves = 5,
  language = 'pt',
}: GondolaFrontViewProps) {
  if (products.length === 0) {
    return (
      <div className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-gray-500 text-sm">
          {language === 'pt'
            ? 'Nenhum produto adicionado à simulação'
            : 'No products added to the simulation'}
        </p>
      </div>
    );
  }

  const colors = language === 'pt' ? zoneColors : zoneColorsEn;

  // Distribuir produtos nas prateleiras
  const shelvesMap = distributeProductsToShelves(products, numberOfShelves);

  return (
    <div className="w-full space-y-6">
      <div className="w-full bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
        <div className="bg-gradient-to-b from-gray-100 to-gray-50 p-4 space-y-4 flex flex-col-reverse">
          {/* Renderizar prateleiras em ordem normal (prateleira 1 na base, prateleira N no topo) */}
          {Array.from({ length: numberOfShelves }, (_, i) => i + 1).map((shelfNum) => {
            const zone = getShelfZone(shelfNum);
            const productsInShelf = shelvesMap.get(shelfNum) || [];

            return renderShelfSection(
              shelfNum,
              zone,
              productsInShelf,
              totalWidth,
              shelfHeight,
              colors,
              language
            );
          })}
        </div>
      </div>
    </div>
  );
}
