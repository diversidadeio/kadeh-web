import { useState, useRef } from 'react';
import { StoreLayoutEditor } from '@/components/StoreLayoutEditor';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as XLSX from 'xlsx';

interface Product {
  id?: number;
  productCode: string;
  gondolaNumber: number;
  position: string;
  category: string;
  subcategory: string;
}

export default function AdminStoreLayout() {
  const { user, loading } = useAuth();
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Product management state
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<Product>({
    productCode: '',
    gondolaNumber: 1,
    position: '',
    category: '',
    subcategory: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'layout' | 'products'>('layout');

  // Fetch products and categories
  const { data: fetchedProducts, refetch: refetchProducts } = trpc.bulkProducts.list.useQuery();
  const { data: fetchedCategories } = trpc.bulkProducts.getCategories.useQuery();
  const importMutation = trpc.bulkProducts.importBulk.useMutation();
  const deleteAllMutation = trpc.bulkProducts.deleteAll.useMutation();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      setLocation('/');
    }
  }, [user, loading, setLocation]);

  useEffect(() => {
    if (fetchedProducts) {
      setProducts(fetchedProducts);
    }
  }, [fetchedProducts]);

  useEffect(() => {
    if (fetchedCategories) {
      setCategories(fetchedCategories);
    }
  }, [fetchedCategories]);

  // Auto-dismiss messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gondolaNumber' ? parseInt(value) || 1 : value,
    }));
  };

  const handleAddProduct = async () => {
    if (!formData.productCode || !formData.position || !formData.category || !formData.subcategory) {
      setError(language === 'pt' ? 'Preencha todos os campos' : 'Fill in all fields');
      return;
    }

    try {
      setError(null);
      await importMutation.mutateAsync({
        products: [formData],
      });

      setSuccess(language === 'pt'
        ? 'Produto adicionado com sucesso!'
        : 'Product added successfully!');

      setFormData({
        productCode: '',
        gondolaNumber: 1,
        position: '',
        category: '',
        subcategory: '',
      });

      await refetchProducts();
    } catch (err: any) {
      setError(err.message || (language === 'pt' ? 'Erro ao adicionar produto' : 'Error adding product'));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const parsedProducts: Product[] = [];
        jsonData.forEach((row: any) => {
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
          setError(language === 'pt' ? 'Nenhum produto válido encontrado' : 'No valid products found');
          return;
        }

        importMutation.mutate(
          { products: parsedProducts },
          {
            onSuccess: () => {
              setSuccess(language === 'pt'
                ? `${parsedProducts.length} produtos importados com sucesso!`
                : `${parsedProducts.length} products imported successfully!`);
              refetchProducts();
              if (fileInputRef.current) fileInputRef.current.value = '';
            },
            onError: (err: any) => {
              setError(err.message || (language === 'pt' ? 'Erro ao importar' : 'Import error'));
            },
          }
        );
      };
      reader.readAsBinaryString(file);
    } catch (err) {
      setError(language === 'pt' ? 'Erro ao ler arquivo' : 'Error reading file');
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm(language === 'pt'
      ? 'Tem certeza que deseja deletar todos os produtos?'
      : 'Are you sure you want to delete all products?')) {
      return;
    }

    try {
      await deleteAllMutation.mutateAsync();
      setSuccess(language === 'pt' ? 'Todos os produtos foram deletados' : 'All products deleted');
      setProducts([]);
      await refetchProducts();
    } catch (err: any) {
      setError(err.message || (language === 'pt' ? 'Erro ao deletar' : 'Delete error'));
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subcategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>{language === 'pt' ? 'Carregando...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {language === 'pt' ? 'Acesso Negado' : 'Access Denied'}
          </h1>
          <p className="text-gray-600">
            {language === 'pt'
              ? 'Você precisa ser um administrador para acessar esta página.'
              : 'You need to be an administrator to access this page.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {language === 'pt' ? 'Gerenciador de Layout da Loja' : 'Store Layout Manager'}
          </h1>
          <p className="text-gray-600">
            {language === 'pt'
              ? 'Crie e gerencie categorias, desenhe rotas e cadastre produtos'
              : 'Create and manage categories, draw routes and register products'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('layout')}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'layout'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {language === 'pt' ? 'Layout e Rotas' : 'Layout & Routes'}
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'products'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {language === 'pt' ? 'Cadastro de Produtos' : 'Product Registration'}
          </button>
        </div>

        {/* Messages */}
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

        {/* Layout Tab */}
        {activeTab === 'layout' && <StoreLayoutEditor />}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Manual Entry Form */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-4">
                {language === 'pt' ? 'Adicionar Produto' : 'Add Product'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Input
                  placeholder={language === 'pt' ? 'Código' : 'Code'}
                  name="productCode"
                  value={formData.productCode}
                  onChange={handleInputChange}
                />
                <Input
                  type="number"
                  placeholder={language === 'pt' ? 'Gôndola' : 'Gondola'}
                  name="gondolaNumber"
                  value={formData.gondolaNumber}
                  onChange={handleInputChange}
                  min="1"
                />
                <Input
                  placeholder={language === 'pt' ? 'Posição' : 'Position'}
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                />
                <Input
                  placeholder={language === 'pt' ? 'Categoria' : 'Category'}
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                />
                <Input
                  placeholder={language === 'pt' ? 'Sub-categoria' : 'Subcategory'}
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                />
              </div>
              <Button onClick={handleAddProduct} className="mt-4 w-full">
                {language === 'pt' ? 'Adicionar Produto' : 'Add Product'}
              </Button>
            </div>

            {/* Excel Upload */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-4">
                {language === 'pt' ? 'Importar do Excel' : 'Import from Excel'}
              </h2>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  {language === 'pt'
                    ? 'Colunas esperadas: Código, Gondola, Posição, Categorias, Sub categorias'
                    : 'Expected columns: Code, Gondola, Position, Categories, Subcategories'}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
            </div>

            {/* Products List */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Input
                  placeholder={language === 'pt' ? 'Buscar...' : 'Search...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">
                    {language === 'pt' ? 'Todas as categorias' : 'All categories'}
                  </option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {products.length > 0 && (
                  <Button onClick={handleDeleteAll} variant="destructive">
                    {language === 'pt' ? 'Deletar Todos' : 'Delete All'}
                  </Button>
                )}
              </div>

              {/* Table */}
              {filteredProducts.length > 0 ? (
                <div className="overflow-x-auto max-h-96 overflow-y-auto border rounded-lg">
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
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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
              ) : (
                <div className="p-8 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600">
                    {language === 'pt' ? 'Nenhum produto cadastrado' : 'No products registered'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
