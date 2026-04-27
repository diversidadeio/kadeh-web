import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { useLanguage } from '@/contexts/LanguageContext';
import { BulkProductImport } from '@/components/BulkProductImport';
import { useAuth } from '@/_core/hooks/useAuth';

interface Product {
  id: number;
  productCode: string;
  gondolaNumber: number;
  position: string;
  category: string;
  subcategory: string;
}

export default function AdminBulkProducts() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch products and categories
  const { data: fetchedProducts, refetch: refetchProducts } = trpc.bulkProducts.list.useQuery();
  const { data: fetchedCategories } = trpc.bulkProducts.getCategories.useQuery();
  const deleteAllMutation = trpc.bulkProducts.deleteAll.useMutation();

  useEffect(() => {
    if (fetchedProducts) {
      setProducts(fetchedProducts);
      filterProducts(fetchedProducts, searchTerm, selectedCategory);
    }
  }, [fetchedProducts]);

  useEffect(() => {
    if (fetchedCategories) {
      setCategories(fetchedCategories);
    }
  }, [fetchedCategories]);

  const filterProducts = (
    productsToFilter: Product[],
    search: string,
    category: string
  ) => {
    let filtered = productsToFilter;

    if (search) {
      filtered = filtered.filter(p =>
        p.productCode.toLowerCase().includes(search.toLowerCase()) ||
        p.subcategory.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterProducts(products, term, selectedCategory);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterProducts(products, searchTerm, category);
  };

  const handleDeleteAll = async () => {
    if (!confirm(language === 'pt' 
      ? 'Tem certeza que deseja deletar todos os produtos?' 
      : 'Are you sure you want to delete all products?')) {
      return;
    }

    try {
      setError(null);
      await deleteAllMutation.mutateAsync();
      setSuccess(language === 'pt'
        ? 'Todos os produtos foram deletados'
        : 'All products have been deleted');
      setProducts([]);
      setFilteredProducts([]);
      await refetchProducts();
    } catch (err: any) {
      setError(err.message || (language === 'pt'
        ? 'Erro ao deletar produtos'
        : 'Error deleting products'));
    }
  };

  // Check authorization
  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-semibold">
            {language === 'pt'
              ? 'Acesso restrito a administradores'
              : 'Access restricted to administrators'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {language === 'pt' ? 'Gerenciamento de Produtos em Massa' : 'Bulk Product Management'}
      </h1>

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

      {/* Import Section */}
      <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg">
        <BulkProductImport />
      </div>

      {/* Products List Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {language === 'pt' ? 'Produtos Cadastrados' : 'Registered Products'}
          </h2>
          <div className="text-sm text-gray-600">
            {language === 'pt'
              ? `Total: ${filteredProducts.length} de ${products.length}`
              : `Total: ${filteredProducts.length} of ${products.length}`}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder={language === 'pt' ? 'Buscar por código ou subcategoria...' : 'Search by code or subcategory...'}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />

          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              {language === 'pt' ? 'Todas as categorias' : 'All categories'}
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {products.length > 0 && (
            <Button
              onClick={handleDeleteAll}
              variant="destructive"
            >
              {language === 'pt' ? 'Deletar Todos' : 'Delete All'}
            </Button>
          )}
        </div>

        {/* Products Table */}
        {filteredProducts.length > 0 ? (
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
                  {filteredProducts.map((product, idx) => (
                    <tr key={product.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 font-semibold">{product.productCode}</td>
                      <td className="px-4 py-2">{product.gondolaNumber}</td>
                      <td className="px-4 py-2">{product.position}</td>
                      <td className="px-4 py-2">{product.category}</td>
                      <td className="px-4 py-2">{product.subcategory}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-8 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <p className="text-gray-600">
              {language === 'pt'
                ? 'Nenhum produto cadastrado'
                : 'No products registered'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
