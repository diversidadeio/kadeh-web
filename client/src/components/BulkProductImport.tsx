import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { useLanguage } from '@/contexts/LanguageContext';
import * as XLSX from 'xlsx';

interface Product {
  productCode: string;
  gondolaNumber: number;
  position: string;
  category: string;
  subcategory: string;
}

export function BulkProductImport() {
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const importMutation = trpc.bulkProducts.importBulk.useMutation();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setError(null);
    setSuccess(null);

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Extract columns BN, BO, BP, BQ, BR (indices 66, 67, 68, 69, 70)
        // But since XLSX parses headers, we need to find the right columns
        const parsedProducts: Product[] = [];

        jsonData.forEach((row: any) => {
          // Try different column name variations
          const productCode = row['Código'] || row['productCode'] || row['BN'];
          const gondolaNumber = parseInt(row['Gondola'] || row['gondolaNumber'] || row['BO']);
          const position = row['Posição'] || row['position'] || row['BP'];
          const category = row['Categorias'] || row['category'] || row['BQ'];
          const subcategory = row['Sub categorias'] || row['subcategory'] || row['BR'];

          if (productCode && gondolaNumber && position && category && subcategory) {
            parsedProducts.push({
              productCode: String(productCode).trim(),
              gondolaNumber,
              position: String(position).trim(),
              category: String(category).trim(),
              subcategory: String(subcategory).trim(),
            });
          }
        });

        if (parsedProducts.length === 0) {
          setError(language === 'pt' 
            ? 'Nenhum produto válido encontrado no arquivo' 
            : 'No valid products found in file');
          return;
        }

        setProducts(parsedProducts);
        setPreviewMode(true);
        setSuccess(language === 'pt'
          ? `${parsedProducts.length} produtos carregados para preview`
          : `${parsedProducts.length} products loaded for preview`);
      };

      reader.readAsBinaryString(file);
    } catch (err) {
      setError(language === 'pt' 
        ? 'Erro ao ler o arquivo' 
        : 'Error reading file');
      console.error(err);
    }
  };

  const handleImport = async () => {
    if (products.length === 0) {
      setError(language === 'pt' 
        ? 'Nenhum produto para importar' 
        : 'No products to import');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await importMutation.mutateAsync({
        products,
      });

      setSuccess(language === 'pt'
        ? `${result.imported} produtos importados com sucesso!`
        : `${result.imported} products imported successfully!`);
      
      setProducts([]);
      setPreviewMode(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || (language === 'pt' 
        ? 'Erro ao importar produtos' 
        : 'Error importing products'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProducts([]);
    setPreviewMode(false);
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        {language === 'pt' ? 'Importar Produtos em Massa' : 'Bulk Product Import'}
      </h3>

      {/* Error and Success Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-semibold">{error}</p>
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-semibold">{success}</p>
        </div>
      )}

      {!previewMode ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            {language === 'pt'
              ? 'Selecione um arquivo Excel com as colunas: Código, Gondola, Posição, Categorias, Sub categorias'
              : 'Select an Excel file with columns: Code, Gondola, Position, Categories, Subcategories'}
          </p>
          <Input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            disabled={loading}
          />
          <div className="text-xs text-gray-500">
            {language === 'pt'
              ? 'Formatos suportados: .xlsx, .xls, .csv'
              : 'Supported formats: .xlsx, .xls, .csv'}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left">{language === 'pt' ? 'Código' : 'Code'}</th>
                    <th className="px-4 py-2 text-left">{language === 'pt' ? 'Gôndola' : 'Gondola'}</th>
                    <th className="px-4 py-2 text-left">{language === 'pt' ? 'Posição' : 'Position'}</th>
                    <th className="px-4 py-2 text-left">{language === 'pt' ? 'Categoria' : 'Category'}</th>
                    <th className="px-4 py-2 text-left">{language === 'pt' ? 'Sub-categoria' : 'Subcategory'}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 10).map((product, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2">{product.productCode}</td>
                      <td className="px-4 py-2">{product.gondolaNumber}</td>
                      <td className="px-4 py-2">{product.position}</td>
                      <td className="px-4 py-2">{product.category}</td>
                      <td className="px-4 py-2">{product.subcategory}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {products.length > 10 && (
              <div className="px-4 py-2 bg-gray-50 text-sm text-gray-600">
                {language === 'pt'
                  ? `... e mais ${products.length - 10} produtos`
                  : `... and ${products.length - 10} more products`}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleImport}
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                language === 'pt' ? 'Importando...' : 'Importing...'
              ) : (
                language === 'pt' ? 'Confirmar Importação' : 'Confirm Import'
              )}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={loading}
            >
              {language === 'pt' ? 'Cancelar' : 'Cancel'}
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            {language === 'pt'
              ? `Total de produtos a importar: ${products.length}`
              : `Total products to import: ${products.length}`}
          </div>
        </div>
      )}
    </div>
  );
}
