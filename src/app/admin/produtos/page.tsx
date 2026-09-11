'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Sparkles, 
  Package, 
  DollarSign, 
  Layers, 
  AlertCircle,
  TrendingUp,
  Save,
  Image as ImageIcon,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Eye,
  Megaphone
} from 'lucide-react';
import { ALL_INITIAL_PRODUCTS, getStoredProducts, saveStoredProducts, getStoreSettings, saveStoreSettings, StoreSettings } from '@/data/db';
import { Product, CommercialStatus, ProductType, Intention } from '@/types';
import { formatCurrency } from '@/utils/currency';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'products' | 'store_info'>('products');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Store Settings State
  const [settings, setSettings] = useState<StoreSettings>(getStoreSettings());
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Form State for Create/Edit
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    subtitle: '',
    slug: '',
    sku: '',
    price: 0,
    promotionalPrice: undefined,
    costPrice: 0,
    minAllowedPrice: 0,
    stock: 10,
    category: 'Cristais & Minerais',
    categorySlug: 'cristais',
    type: 'proprio',
    commercialStatus: 'ativo',
    images: ['https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=1000&auto=format&fit=crop'],
    intentions: ['calma'],
    description: {
      whatIs: '',
      whyItCalledYou: '',
      symbolism: '',
      howToUse: '',
    },
  });

  useEffect(() => {
    const loaded = getStoredProducts();
    setProducts(loaded);
    setSettings(getStoreSettings());
  }, []);

  const showNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleOpenCreateModal = (isKit: boolean = false) => {
    setEditingProduct(null);
    setFormData({
      name: isKit ? 'Kit Sagrado ' : '',
      subtitle: isKit ? 'Combinação harmônica consagrada para seu ritual' : '',
      slug: '',
      sku: isKit ? `KIT-${Date.now().toString().slice(-5)}` : `PROD-${Date.now().toString().slice(-5)}`,
      price: isKit ? 149.00 : 79.90,
      promotionalPrice: undefined,
      costPrice: isKit ? 50.00 : 25.00,
      minAllowedPrice: isKit ? 110.00 : 55.00,
      stock: 15,
      category: isKit ? 'Kits Sagrados' : 'Cristais & Minerais',
      categorySlug: isKit ? 'kits' : 'cristais',
      type: isKit ? 'proprio' : 'proprio',
      commercialStatus: 'ativo',
      images: ['https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=1000&auto=format&fit=crop'],
      intentions: ['calma', 'intuicao'],
      description: {
        whatIs: '',
        whyItCalledYou: '',
        symbolism: '',
        howToUse: '',
      },
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const slug = formData.slug?.trim() || formData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `item-${Date.now()}`;
    const productToSave: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      slug,
      name: formData.name || 'Sem Nome',
      subtitle: formData.subtitle || '',
      price: Number(formData.price) || 0,
      promotionalPrice: formData.promotionalPrice ? Number(formData.promotionalPrice) : undefined,
      costPrice: Number(formData.costPrice) || 0,
      minAllowedPrice: Number(formData.minAllowedPrice) || Number(formData.costPrice) || 0,
      pixDiscountPercent: 5,
      maxInstallments: 6,
      images: formData.images && formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=1000&auto=format&fit=crop'],
      category: formData.category || 'Cristais & Minerais',
      categorySlug: formData.categorySlug || 'cristais',
      intentions: formData.intentions && formData.intentions.length > 0 ? formData.intentions : ['calma'],
      stock: Number(formData.stock) || 0,
      isAvailable: Number(formData.stock) > 0,
      type: (formData.type as ProductType) || 'proprio',
      commercialStatus: (formData.commercialStatus as CommercialStatus) || 'ativo',
      description: {
        whatIs: formData.description?.whatIs || formData.name || '',
        whyItCalledYou: formData.description?.whyItCalledYou || 'Atraído pela força harmônica da peça.',
        symbolism: formData.description?.symbolism || 'Instrumento ancestral consagrado para o equilíbrio.',
        howToUse: formData.description?.howToUse || 'Posicione em seu altar ou espaço de contemplação.',
      },
      details: editingProduct?.details || {
        origin: 'Brasil',
        material: 'Natural',
        dimensions: 'Peça selecionada',
        weight: 'Aprox. 200g',
        care: 'Limpar com pano macio e seco.',
      },
      sku: formData.sku || `SKU-${Date.now().toString().slice(-6)}`,
      relatedProductIds: editingProduct?.relatedProductIds || [],
      upsellProductIds: editingProduct?.upsellProductIds || [],
      crossSellProductIds: editingProduct?.crossSellProductIds || [],
      seoTitle: formData.name ? `${formData.name} | O Bazar do Bruxo` : 'O Bazar do Bruxo',
      seoDescription: formData.subtitle || formData.name || 'Instrumento místico e ritualístico.',
      rating: editingProduct?.rating || 5.0,
      reviewCount: editingProduct?.reviewCount || 1,
    };

    let updatedList: Product[];
    if (editingProduct) {
      updatedList = products.map((p) => (p.id === editingProduct.id ? productToSave : p));
      showNotification(`Produto "${productToSave.name}" atualizado com sucesso!`);
    } else {
      updatedList = [productToSave, ...products];
      showNotification(`Novo item "${productToSave.name}" criado com sucesso!`);
    }

    setProducts(updatedList);
    saveStoredProducts(updatedList);
    setIsModalOpen(false);

    // Sync via API
    try {
      if (editingProduct) {
        await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productToSave),
        });
      } else {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productToSave),
        });
      }
    } catch (err) {
      console.warn('API sync fallback', err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const toDelete = products.find((p) => p.id === id);
    const updatedList = products.filter((p) => p.id !== id);
    setProducts(updatedList);
    saveStoredProducts(updatedList);
    setDeleteConfirmId(null);
    showNotification(`Item "${toDelete?.name || 'Item'}" removido com sucesso.`);

    try {
      await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    } catch (err) {}
  };

  const handleStockChange = (productId: string, delta: number) => {
    const updatedList = products.map((p) => {
      if (p.id === productId) {
        const newStock = Math.max(0, p.stock + delta);
        return { ...p, stock: newStock, isAvailable: newStock > 0 };
      }
      return p;
    });
    setProducts(updatedList);
    saveStoredProducts(updatedList);
  };

  const handleStockInput = (productId: string, value: string) => {
    const num = parseInt(value, 10);
    const validNum = isNaN(num) ? 0 : Math.max(0, num);
    const updatedList = products.map((p) => {
      if (p.id === productId) {
        return { ...p, stock: validNum, isAvailable: validNum > 0 };
      }
      return p;
    });
    setProducts(updatedList);
    saveStoredProducts(updatedList);
  };

  const handleStatusChange = (productId: string, newStatus: CommercialStatus) => {
    const updatedList = products.map((p) =>
      p.id === productId ? { ...p, commercialStatus: newStatus } : p
    );
    setProducts(updatedList);
    saveStoredProducts(updatedList);
  };

  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoreSettings(settings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
    showNotification('Informações e configurações da loja salvas com sucesso!');
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = filterCategory === 'all' || p.categorySlug === filterCategory;
    const matchesStatus = filterStatus === 'all' || p.commercialStatus === filterStatus;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const categoriesList = [
    { slug: 'all', name: 'Todas as Categorias' },
    { slug: 'cristais', name: 'Cristais & Minerais' },
    { slug: 'incensos-aromas', name: 'Incensos & Aromas' },
    { slug: 'ervas-natureza', name: 'Ervas & Natureza' },
    { slug: 'rituais', name: 'Rituais & Práticas' },
    { slug: 'bruxaria', name: 'Bruxaria Ancestral' },
    { slug: 'energia', name: 'Energia & Proteção' },
    { slug: 'casa-mistica', name: 'Casa Mística & Altar' },
    { slug: 'presentes', name: 'Presentes Significativos' },
    { slug: 'kits', name: 'Kits Sagrados' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Alerta de Sucesso */}
      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-mystic animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Topo / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-bazar-charcoal-border">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-xl bg-bazar-charcoal-light border border-bazar-charcoal-border hover:border-bazar-gold text-bazar-parchment transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-bazar-gold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3.5 h-3.5" /> Gestão Completa do Catálogo
            </div>
            <h1 className="font-mystic text-2xl sm:text-3xl font-bold text-bazar-parchment">
              PRODUTOS, KITS & ESTOQUE
            </h1>
            <p className="text-xs text-bazar-parchment/60">
              Crie itens, monte kits, ajuste preços, controle o estoque e altere avisos da loja
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => handleOpenCreateModal(false)}
            className="px-4 py-2.5 bg-bazar-gold hover:bg-bazar-gold-light text-bazar-charcoal font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-mystic-gold transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Produto</span>
          </button>
          <button
            onClick={() => handleOpenCreateModal(true)}
            className="px-4 py-2.5 bg-bazar-purple/80 hover:bg-bazar-purple border border-bazar-gold/50 text-bazar-parchment font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-mystic transition-all"
          >
            <Layers className="w-4 h-4 text-bazar-gold" />
            <span>Criar Kit</span>
          </button>
        </div>
      </div>

      {/* Navegação de Abas */}
      <div className="flex border-b border-bazar-charcoal-border gap-2 text-xs">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-4 font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'products'
              ? 'border-bazar-gold text-bazar-gold'
              : 'border-transparent text-bazar-parchment/60 hover:text-bazar-parchment'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Itens Vendíveis & Estoque ({products.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('store_info')}
          className={`pb-3 px-4 font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'store_info'
              ? 'border-bazar-gold text-bazar-gold'
              : 'border-transparent text-bazar-parchment/60 hover:text-bazar-parchment'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Avisos & Informações da Loja</span>
        </button>
      </div>

      {/* CONTEÚDO DA ABA 1: PRODUTOS & ESTOQUE */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          
          {/* Barra de Filtros e Busca */}
          <div className="p-4 rounded-2xl bg-bazar-charcoal-light border border-bazar-charcoal-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-bazar-gold absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por nome, SKU, categoria..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl pl-9 pr-3 py-2 text-bazar-parchment placeholder-bazar-parchment/40 focus:outline-none focus:border-bazar-gold"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:outline-none focus:border-bazar-gold text-xs"
              >
                {categoriesList.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-bazar-parchment focus:outline-none focus:border-bazar-gold text-xs"
              >
                <option value="all">Todos os Status</option>
                <option value="ativo">Ativo</option>
                <option value="revisao">Revisão</option>
                <option value="restrito">Restrito</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>

          {/* Tabela de Produtos */}
          <div className="bg-bazar-charcoal-light rounded-3xl border border-bazar-charcoal-border overflow-hidden shadow-mystic">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-bazar-parchment divide-y divide-bazar-charcoal-border">
                <thead className="bg-bazar-charcoal text-bazar-parchment/60 uppercase font-bold tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Item / SKU</th>
                    <th className="py-3 px-4">Categoria / Tipo</th>
                    <th className="py-3 px-4">Preço Venda</th>
                    <th className="py-3 px-4">Custo</th>
                    <th className="py-3 px-4">Estoque Atual</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bazar-charcoal-border">
                  {filteredProducts.map((p) => {
                    const marginValue = p.price - p.costPrice;
                    const marginPercent = p.price > 0 ? Math.round((marginValue / p.price) * 100) : 0;
                    const isLowStock = p.stock > 0 && p.stock < 5;
                    const isOutOfStock = p.stock === 0;

                    return (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                        {/* Nome & Imagem */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0] || 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=1000&auto=format&fit=crop'}
                              alt={p.name}
                              className="w-10 h-10 rounded-xl object-cover border border-bazar-charcoal-border shrink-0"
                            />
                            <div>
                              <div className="font-bold text-bazar-parchment hover:text-bazar-gold transition-colors">
                                {p.name}
                              </div>
                              <div className="text-[10px] font-mono text-bazar-parchment/50">
                                SKU: {p.sku}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Categoria & Tipo */}
                        <td className="py-3.5 px-4">
                          <div className="text-bazar-parchment/90 font-medium">{p.category}</div>
                          <span className="text-[9px] px-1.5 py-0.5 rounded uppercase font-mono bg-white/5 border border-white/10 text-bazar-gold/80">
                            {p.type}
                          </span>
                        </td>

                        {/* Preço de Venda */}
                        <td className="py-3.5 px-4 font-mono font-bold">
                          <div className="text-bazar-gold">{formatCurrency(p.price)}</div>
                          {p.promotionalPrice && (
                            <div className="text-[10px] text-emerald-400 line-through">
                              {formatCurrency(p.promotionalPrice)}
                            </div>
                          )}
                        </td>

                        {/* Custo & Margem */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono text-bazar-parchment/70">{formatCurrency(p.costPrice)}</div>
                          <span className={`text-[10px] font-semibold ${marginPercent < 30 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {marginPercent}% margem
                          </span>
                        </td>

                        {/* Controle Rápido de Estoque */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleStockChange(p.id, -1)}
                              className="w-6 h-6 rounded-lg bg-bazar-charcoal hover:bg-bazar-charcoal-border border border-bazar-charcoal-border flex items-center justify-center font-bold text-bazar-parchment hover:text-bazar-gold transition"
                              title="Diminuir 1 do estoque"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={p.stock}
                              onChange={(e) => handleStockInput(p.id, e.target.value)}
                              className="w-14 text-center bg-bazar-charcoal border border-bazar-charcoal-border rounded-lg py-1 font-mono font-bold text-xs text-bazar-parchment focus:outline-none focus:border-bazar-gold"
                            />
                            <button
                              onClick={() => handleStockChange(p.id, 1)}
                              className="w-6 h-6 rounded-lg bg-bazar-charcoal hover:bg-bazar-charcoal-border border border-bazar-charcoal-border flex items-center justify-center font-bold text-bazar-parchment hover:text-bazar-gold transition"
                              title="Aumentar 1 no estoque"
                            >
                              +
                            </button>
                          </div>
                          <div className="mt-1">
                            {isOutOfStock ? (
                              <span className="text-[10px] text-rose-400 font-bold">Esgotado</span>
                            ) : isLowStock ? (
                              <span className="text-[10px] text-amber-400 font-bold">Últimas {p.stock} un.</span>
                            ) : (
                              <span className="text-[10px] text-emerald-400">Em estoque</span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <select
                            value={p.commercialStatus}
                            onChange={(e) => handleStatusChange(p.id, e.target.value as CommercialStatus)}
                            className="bg-bazar-charcoal border border-bazar-charcoal-border rounded-lg px-2 py-1 text-[11px] text-bazar-parchment focus:outline-none focus:border-bazar-gold"
                          >
                            <option value="ativo">Ativo</option>
                            <option value="revisao">Revisão</option>
                            <option value="restrito">Restrito</option>
                            <option value="inativo">Inativo</option>
                          </select>
                        </td>

                        {/* Ações */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/produto/${p.slug}`}
                              target="_blank"
                              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-bazar-parchment/70 hover:text-bazar-gold transition"
                              title="Ver na loja"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="p-2 bg-bazar-gold/10 hover:bg-bazar-gold/20 border border-bazar-gold/30 rounded-lg text-bazar-gold transition"
                              title="Editar este produto"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(p.id)}
                              className="p-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 rounded-lg text-rose-300 transition"
                              title="Remover produto da loja"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 2: AVISOS & INFORMAÇÕES DA LOJA */}
      {activeTab === 'store_info' && (
        <form onSubmit={handleSaveStoreSettings} className="bg-bazar-charcoal-light rounded-3xl border border-bazar-charcoal-border p-6 sm:p-8 space-y-6 max-w-3xl shadow-mystic">
          <div className="border-b border-bazar-charcoal-border pb-4">
            <h2 className="font-mystic text-lg font-bold text-bazar-parchment">
              Configurações Comerciais & Mensagens da Loja
            </h2>
            <p className="text-xs text-bazar-parchment/60">
              Altere informações públicas exibidas no site, prazos, WhatsApp e políticas
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-bazar-parchment/70 font-semibold mb-1">Nome Oficial da Loja</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:outline-none focus:border-bazar-gold"
              />
            </div>

            <div>
              <label className="block text-bazar-parchment/70 font-semibold mb-1">Slogan</label>
              <input
                type="text"
                value={settings.slogan}
                onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:outline-none focus:border-bazar-gold"
              />
            </div>

            <div>
              <label className="block text-bazar-parchment/70 font-semibold mb-1">Valor Mínimo para Frete Grátis (R$)</label>
              <input
                type="number"
                step="0.01"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:outline-none focus:border-bazar-gold font-mono"
              />
            </div>

            <div>
              <label className="block text-bazar-parchment/70 font-semibold mb-1">Desconto Automático no PIX (%)</label>
              <input
                type="number"
                value={settings.defaultPixDiscount}
                onChange={(e) => setSettings({ ...settings, defaultPixDiscount: parseInt(e.target.value, 10) || 0 })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:outline-none focus:border-bazar-gold font-mono"
              />
            </div>

            <div>
              <label className="block text-bazar-parchment/70 font-semibold mb-1">WhatsApp Oficial de Suporte</label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:outline-none focus:border-bazar-gold font-mono"
              />
              <span className="text-[10px] text-emerald-400 block mt-0.5">Usado em todos os botões e links de atendimento</span>
            </div>

            <div>
              <label className="block text-bazar-parchment/70 font-semibold mb-1">E-mail de Suporte</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:outline-none focus:border-bazar-gold"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-bazar-gold hover:bg-bazar-gold-light text-bazar-charcoal font-bold text-xs rounded-xl flex items-center gap-2 shadow-mystic-gold transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Configurações da Loja</span>
            </button>
          </div>
        </form>
      )}

      {/* MODAL DE CRIAÇÃO / EDIÇÃO DE PRODUTO OU KIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#140d1e] border border-bazar-gold/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-mystic text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-bazar-gold" />
                  {editingProduct ? `Editar: ${editingProduct.name}` : 'Cadastrar Novo Item / Kit de Venda'}
                </h3>
                <p className="text-[11px] text-gray-400">
                  Preencha os dados do item. Ele será refletido instantaneamente na loja virtual.
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-gray-300 font-semibold mb-1">Nome do Produto ou Kit *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Drusa de Ametista Natural ou Kit Altar Sagrado"
                    className="w-full bg-[#0a0610] border border-bazar-gold/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-bazar-gold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-300 font-semibold mb-1">Subtítulo Místico (Frase de impacto)</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Ex: Cristal de serenidade, introspecção e equilíbrio mental"
                    className="w-full bg-[#0a0610] border border-bazar-gold/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-bazar-gold"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Categoria *</label>
                  <select
                    value={formData.categorySlug}
                    onChange={(e) => {
                      const selected = categoriesList.find((c) => c.slug === e.target.value);
                      setFormData({
                        ...formData,
                        categorySlug: e.target.value,
                        category: selected?.name || 'Cristais & Minerais',
                      });
                    }}
                    className="w-full bg-[#0a0610] border border-bazar-gold/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-bazar-gold"
                  >
                    {categoriesList.filter((c) => c.slug !== 'all').map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Tipo de Produto</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ProductType })}
                    className="w-full bg-[#0a0610] border border-bazar-gold/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-bazar-gold"
                  >
                    <option value="proprio">Estoque Próprio (Próprio)</option>
                    <option value="dropshipping">Dropshipping (Envio Fornecedor)</option>
                    <option value="afiliado">Afiliado Parceiro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Preço de Venda (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#0a0610] border border-bazar-gold/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-bazar-gold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Preço Promocional (Opcional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.promotionalPrice || ''}
                    onChange={(e) => setFormData({ ...formData, promotionalPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                    placeholder="Deixe vazio se não houver promoção"
                    className="w-full bg-[#0a0610] border border-bazar-gold/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-bazar-gold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Custo de Aquisição (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#0a0610] border border-bazar-gold/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-bazar-gold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Estoque (Unidades) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-[#0a0610] border border-bazar-gold/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-bazar-gold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Código SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="Ex: CRIS-AME-001"
                    className="w-full bg-[#0a0610] border border-bazar-gold/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-bazar-gold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Status Comercial</label>
                  <select
                    value={formData.commercialStatus}
                    onChange={(e) => setFormData({ ...formData, commercialStatus: e.target.value as CommercialStatus })}
                    className="w-full bg-[#0a0610] border border-bazar-gold/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-bazar-gold"
                  >
                    <option value="ativo">Ativo (Visível na loja)</option>
                    <option value="revisao">Revisão Regulatória</option>
                    <option value="restrito">Restrito</option>
                    <option value="inativo">Inativo (Oculto)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-300 font-semibold mb-1">URL da Imagem Principal</label>
                  <input
                    type="url"
                    value={formData.images?.[0] || ''}
                    onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#0a0610] border border-bazar-gold/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-bazar-gold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-300 font-semibold mb-1">O Que É? (Descrição da Peça)</label>
                  <textarea
                    rows={2}
                    value={formData.description?.whatIs || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      description: { ...formData.description, whatIs: e.target.value } as any,
                    })}
                    placeholder="Descreva as características visuais e materiais da peça..."
                    className="w-full bg-[#0a0610] border border-bazar-gold/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-bazar-gold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-300 font-semibold mb-1">Como Usar (Instruções Rituais)</label>
                  <textarea
                    rows={2}
                    value={formData.description?.howToUse || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      description: { ...formData.description, howToUse: e.target.value } as any,
                    })}
                    placeholder="Orientações seguras de uso no lar, altar ou meditação..."
                    className="w-full bg-[#0a0610] border border-bazar-gold/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-bazar-gold"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-bazar-gold hover:bg-bazar-gold-light text-bazar-charcoal font-bold shadow-mystic-gold transition"
                >
                  {editingProduct ? 'Salvar Alterações' : 'Publicar na Loja'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#180f24] border border-rose-500/40 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-mystic text-lg font-bold text-white">
              Remover Item da Loja?
            </h3>
            <p className="text-xs text-gray-300">
              Esta ação removerá o produto do catálogo e ele deixará de estar disponível para os clientes.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-rose-900/30"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
