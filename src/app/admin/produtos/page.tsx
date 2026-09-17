'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Megaphone,
  Copy,
  Upload,
  Crop,
  RotateCw,
  ZoomIn,
  ZoomOut,
  CheckSquare,
  Square
} from 'lucide-react';
import { ALL_INITIAL_PRODUCTS, getStoredProducts, saveStoredProducts, getStoreSettings, saveStoreSettings, StoreSettings } from '@/data/db';
import { Product, CommercialStatus, ProductType, Intention } from '@/types';
import { formatCurrency } from '@/utils/currency';

// Componente Modal de Recorte / Edição de Imagem
interface CropperProps {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onApplyCrop: (croppedDataUrl: string) => void;
}

function ImageCropperModal({ imageSrc, isOpen, onClose, onApplyCrop }: CropperProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
      drawCanvas();
    };
    img.src = imageSrc;
  }, [imageSrc, isOpen]);

  useEffect(() => {
    drawCanvas();
  }, [zoom, rotation, pan]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 400;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);
    ctx.save();

    // Centro do canvas
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(pan.x, pan.y);

    // Escala
    const scale = (Math.max(size / img.width, size / img.height) * zoom);
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleConfirmCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Exporta imagem otimizada e nítida em 450x450 (~30KB)
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 450;
    exportCanvas.height = 450;
    const exportCtx = exportCanvas.getContext('2d');
    if (exportCtx && imgRef.current) {
      const img = imgRef.current;
      exportCtx.save();
      exportCtx.translate(225, 225);
      exportCtx.rotate((rotation * Math.PI) / 180);
      exportCtx.translate(pan.x * 1.125, pan.y * 1.125);
      const scale = (Math.max(450 / img.width, 450 / img.height) * zoom);
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;
      exportCtx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      exportCtx.restore();
      const croppedUrl = exportCanvas.toDataURL('image/jpeg', 0.8);
      onApplyCrop(croppedUrl);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#150d22] border-2 border-bazar-gold/50 rounded-3xl max-w-lg w-full p-6 text-center space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="font-mystic font-bold text-sm text-bazar-parchment flex items-center gap-2">
            <Crop className="w-4 h-4 text-bazar-gold" /> Ajustar & Recortar Imagem do Produto (1:1 Quadrado)
          </h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[11px] text-gray-300">
          Arraste a imagem para posicionar e use os controles abaixo para ajustar o zoom e a rotação.
        </p>

        {/* Viewport de Corte */}
        <div 
          className="relative mx-auto w-[320px] h-[320px] rounded-2xl overflow-hidden border-2 border-bazar-gold shadow-mystic bg-black cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <canvas ref={canvasRef} className="w-full h-full" />
          {/* Grade de enquadramento 3x3 */}
          <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-bazar-gold/30">
            <div className="border-r border-b border-bazar-gold/20" />
            <div className="border-r border-b border-bazar-gold/20" />
            <div className="border-b border-bazar-gold/20" />
            <div className="border-r border-b border-bazar-gold/20" />
            <div className="border-r border-b border-bazar-gold/20" />
            <div className="border-b border-bazar-gold/20" />
            <div className="border-r border-b border-bazar-gold/20" />
            <div className="border-r border-b border-bazar-gold/20" />
            <div />
          </div>
        </div>

        {/* Controles de Zoom e Rotação */}
        <div className="flex items-center justify-center gap-4 text-xs text-gray-300 pt-2">
          <div className="flex items-center gap-2">
            <ZoomOut className="w-4 h-4 text-bazar-gold" />
            <input
              type="range"
              min="0.8"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="accent-bazar-gold cursor-pointer w-32"
            />
            <ZoomIn className="w-4 h-4 text-bazar-gold" />
          </div>

          <button
            type="button"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="p-2 bg-bazar-charcoal hover:bg-bazar-gold/20 border border-bazar-gold/30 rounded-xl text-bazar-gold flex items-center gap-1 text-xs transition"
            title="Girar 90 graus"
          >
            <RotateCw className="w-3.5 h-3.5" /> 90°
          </button>
        </div>

        {/* Ações do Modal de Corte */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmCrop}
            className="px-5 py-2 bg-bazar-gold hover:bg-bazar-gold-light text-bazar-black font-bold rounded-xl text-xs transition shadow-md flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Aplicar Imagem
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'products' | 'store_info'>('products');

  // Seleção Múltipla de Produtos
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBatchDeleteModalOpen, setIsBatchDeleteModalOpen] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Upload & Cropper State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // --- SELEÇÃO MÚLTIPLA ---
  const filteredProducts = products.filter((p) => {
    const matchesCategory = filterCategory === 'all' || p.categorySlug === filterCategory;
    const matchesStatus = filterStatus === 'all' || p.commercialStatus === filterStatus;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const isAllSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((p) => selectedIds.includes(p.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      const filteredIdSet = new Set(filteredProducts.map((p) => p.id));
      setSelectedIds((prev) => prev.filter((id) => !filteredIdSet.has(id)));
    } else {
      const newSelected = Array.from(
        new Set([...selectedIds, ...filteredProducts.map((p) => p.id)])
      );
      setSelectedIds(newSelected);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // --- DUPLICAÇÃO DE PRODUTOS ---
  const handleDuplicateProduct = (product: Product) => {
    const newId = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newSku = `${product.sku}-COPY-${Math.floor(Math.random() * 900 + 100)}`;
    const newSlug = `${product.slug}-copia-${Date.now().toString().slice(-4)}`;
    const duplicated: Product = {
      ...product,
      id: newId,
      name: `${product.name} (Cópia)`,
      slug: newSlug,
      sku: newSku,
    };
    const updatedList = [duplicated, ...products];
    setProducts(updatedList);
    saveStoredProducts(updatedList);
    showNotification(`Produto "${product.name}" duplicado com sucesso!`);
  };

  const handleBatchDuplicate = () => {
    if (selectedIds.length === 0) return;
    const toDuplicate = products.filter((p) => selectedIds.includes(p.id));
    const duplicates: Product[] = toDuplicate.map((product, idx) => {
      const newId = `prod-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`;
      const newSku = `${product.sku}-COPY-${Math.floor(Math.random() * 900 + 100)}`;
      const newSlug = `${product.slug}-copia-${Date.now().toString().slice(-4)}-${idx}`;
      return {
        ...product,
        id: newId,
        name: `${product.name} (Cópia)`,
        slug: newSlug,
        sku: newSku,
      };
    });
    const updatedList = [...duplicates, ...products];
    setProducts(updatedList);
    saveStoredProducts(updatedList);
    setSelectedIds([]);
    showNotification(`${duplicates.length} produto(s) duplicado(s) com sucesso!`);
  };

  // --- EXCLUSÃO EM MASSA ---
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    const updatedList = products.filter((p) => !selectedIds.includes(p.id));
    const count = selectedIds.length;
    setProducts(updatedList);
    saveStoredProducts(updatedList);
    setSelectedIds([]);
    setIsBatchDeleteModalOpen(false);
    showNotification(`${count} produto(s) removido(s) do catálogo com sucesso.`);
  };

  // --- CRIAÇÃO E EDIÇÃO ---
  const handleOpenCreateModal = (isKit: boolean = false) => {
    setEditingProduct(null);
    setFormData({
      name: isKit ? 'Kit Sagrado ' : '',
      subtitle: isKit ? 'Combinação harmônica consagrada para seu ritual' : '',
      slug: '',
      sku: isKit ? `KIT-${Date.now().toString().slice(-5)}` : `PROD-${Date.now().toString().slice(-5)}`,
      price: isKit ? 120 : 50,
      promotionalPrice: undefined,
      costPrice: isKit ? 60 : 25,
      minAllowedPrice: isKit ? 80 : 35,
      stock: 10,
      category: isKit ? 'Kits Sagrados' : 'Cristais & Minerais',
      categorySlug: isKit ? 'kits' : 'cristais',
      type: 'proprio',
      commercialStatus: 'ativo',
      images: ['https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=1000&auto=format&fit=crop'],
      intentions: ['calma', 'protecao'],
      description: {
        whatIs: '',
        whyItCalledYou: 'Sentiu o chamado vibracional desta composição sagrada.',
        symbolism: 'Instrumento ancestral consagrado para harmonia energética.',
        howToUse: 'Posicione em seu altar ou utilize durante suas práticas contemplativas.',
      },
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsModalOpen(true);
  };

  // Upload e Cropper de Imagem
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target?.result as string;
      setImageToCrop(dataUrl);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleApplyCroppedImage = (croppedDataUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      images: [croppedDataUrl, ...(prev.images?.slice(1) || [])],
    }));
    showNotification('Imagem cortada e ajustada com perfeição!');
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
    setSelectedIds((prev) => prev.filter((item) => item !== id));
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
              CATÁLOGO, CUSTOS & ESTOQUE
            </h1>
            <p className="text-xs text-bazar-parchment/60">
              Selecione múltiplos itens para exclusão ou duplicação em massa, crie produtos e edite livremente
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

      {/* BARRA DE AÇÕES EM MASSA (QUANDO HÁ PRODUTOS SELECIONADOS) */}
      {activeTab === 'products' && selectedIds.length > 0 && (
        <div className="p-3.5 bg-gradient-to-r from-bazar-wine-deep via-[#201330] to-bazar-wine-deep border-2 border-bazar-gold/60 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl animate-in fade-in slide-in-from-top-2 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-bazar-gold animate-ping" />
            <span className="font-bold text-white">
              {selectedIds.length} {selectedIds.length === 1 ? 'item selecionado' : 'itens selecionados'}
            </span>
            <span className="text-bazar-gold/80 text-[11px] hidden sm:inline">
              (de {products.length} no catálogo)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBatchDuplicate}
              className="px-3.5 py-1.5 bg-bazar-charcoal hover:bg-bazar-charcoal-light border border-bazar-gold/40 text-bazar-gold font-bold rounded-xl flex items-center gap-1.5 transition shadow"
              title="Criar cópias dos itens selecionados"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplicar ({selectedIds.length})</span>
            </button>

            <button
              onClick={() => setIsBatchDeleteModalOpen(true)}
              className="px-3.5 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-200 font-bold rounded-xl flex items-center gap-1.5 transition shadow"
              title="Excluir todos os itens selecionados"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Excluir ({selectedIds.length})</span>
            </button>

            {selectedIds.length === 1 && (
              <button
                onClick={() => {
                  const target = products.find((p) => p.id === selectedIds[0]);
                  if (target) handleOpenEditModal(target);
                }}
                className="px-3.5 py-1.5 bg-bazar-gold text-bazar-black font-bold rounded-xl flex items-center gap-1.5 transition shadow"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
            )}

            <button
              onClick={() => setSelectedIds([])}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg transition"
              title="Desmarcar todos"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
                    {/* Checkbox Mestre (Selecionar Todos) */}
                    <th className="py-3.5 px-3 w-10 text-center">
                      <button
                        type="button"
                        onClick={handleToggleSelectAll}
                        className="p-1 rounded text-bazar-gold hover:bg-white/10 transition"
                        title={isAllSelected ? 'Desmarcar todos' : 'Selecionar todos os itens listados'}
                      >
                        {isAllSelected ? (
                          <CheckSquare className="w-4 h-4 text-bazar-gold" />
                        ) : (
                          <Square className="w-4 h-4 text-bazar-parchment/40" />
                        )}
                      </button>
                    </th>
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
                    const isSelected = selectedIds.includes(p.id);

                    return (
                      <tr 
                        key={p.id} 
                        className={`transition-colors ${
                          isSelected ? 'bg-bazar-gold/10' : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        {/* Checkbox Individual */}
                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleSelect(p.id)}
                            className="p-1 rounded hover:bg-white/10 text-bazar-gold transition"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-bazar-gold" />
                            ) : (
                              <Square className="w-4 h-4 text-bazar-parchment/40" />
                            )}
                          </button>
                        </td>

                        {/* Nome & Imagem */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0] || 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=1000&auto=format&fit=crop'}
                              alt={p.name}
                              className="w-11 h-11 rounded-xl object-cover border border-bazar-charcoal-border shrink-0 shadow-sm"
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
                            {marginPercent}% margem ({formatCurrency(marginValue)})
                          </span>
                        </td>

                        {/* Estoque */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStockChange(p.id, -1)}
                              className="w-6 h-6 rounded-lg bg-bazar-charcoal border border-bazar-charcoal-border hover:border-bazar-gold text-bazar-parchment flex items-center justify-center font-bold text-xs transition"
                              title="Reduzir 1 unidade"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={p.stock}
                              onChange={(e) => handleStockInput(p.id, e.target.value)}
                              className="w-14 bg-bazar-charcoal border border-bazar-charcoal-border rounded-lg text-center py-1 text-xs font-mono font-bold text-bazar-parchment focus:outline-none focus:border-bazar-gold"
                            />
                            <button
                              onClick={() => handleStockChange(p.id, 1)}
                              className="w-6 h-6 rounded-lg bg-bazar-charcoal border border-bazar-charcoal-border hover:border-bazar-gold text-bazar-parchment flex items-center justify-center font-bold text-xs transition"
                              title="Aumentar 1 unidade"
                            >
                              +
                            </button>
                          </div>
                          <div className="mt-1">
                            {isOutOfStock ? (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30">
                                Esgotado
                              </span>
                            ) : isLowStock ? (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                                Últimas {p.stock} un.
                              </span>
                            ) : (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                                Em estoque
                              </span>
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
                              title="Ver na loja virtual"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => handleDuplicateProduct(p)}
                              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-bazar-parchment/70 hover:text-bazar-gold transition"
                              title="Duplicar este item"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

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

            <div className="sm:col-span-2">
              <label className="block text-bazar-parchment/70 font-semibold mb-1">WhatsApp Oficial de Suporte</label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="Ex: 5513998039867"
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:outline-none focus:border-bazar-gold font-mono"
              />
              <span className="text-[10px] text-bazar-parchment/50 mt-1 block">Número oficial: 5513998039867 - (13) 99803-9867</span>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-bazar-parchment/70 font-semibold mb-1">Aviso Superior do Topo (Barra de Destaque)</label>
              <input
                type="text"
                value={settings.topBannerText}
                onChange={(e) => setSettings({ ...settings, topBannerText: e.target.value })}
                className="w-full bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2.5 text-bazar-parchment focus:outline-none focus:border-bazar-gold"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-bazar-charcoal-border">
            {settingsSaved && (
              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Alterações salvas com sucesso!
              </span>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 bg-bazar-gold hover:bg-bazar-gold-light text-bazar-charcoal font-bold text-xs rounded-xl flex items-center gap-2 shadow-mystic-gold transition-all ml-auto"
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
                  Faça upload de fotos, recorte na proporção da loja, ajuste estoque e valores.
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              {/* SEÇÃO DE IMAGEM: UPLOAD DIRETO + CORTE/EDIÇÃO + URL */}
              <div className="p-4 rounded-2xl bg-[#0c0714] border border-bazar-gold/30 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-bazar-gold font-bold flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                    <ImageIcon className="w-4 h-4" /> Imagem do Produto (Upload & Recorte)
                  </label>
                  <span className="text-[10px] text-gray-400 font-editorial italic">Proporção 1:1 recomendada</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Preview da Imagem Atual */}
                  <div className="relative shrink-0 group">
                    <img
                      src={formData.images?.[0] || 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=1000&auto=format&fit=crop'}
                      alt="Prévia do produto"
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-bazar-gold shadow-md"
                    />
                    {formData.images?.[0] && (
                      <button
                        type="button"
                        onClick={() => {
                          setImageToCrop(formData.images![0]);
                          setCropperOpen(true);
                        }}
                        className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-bazar-gold text-[10px] font-bold transition-opacity gap-1"
                        title="Editar / Cortar esta imagem"
                      >
                        <Crop className="w-4 h-4" />
                        <span>Recortar</span>
                      </button>
                    )}
                  </div>

                  {/* Ações de Upload e URL */}
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 py-2.5 px-3 bg-bazar-charcoal hover:bg-bazar-gold/20 border border-bazar-gold/40 text-bazar-gold font-bold rounded-xl flex items-center justify-center gap-2 transition text-xs shadow-sm"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Fazer Upload do Arquivo</span>
                      </button>

                      {formData.images?.[0] && (
                        <button
                          type="button"
                          onClick={() => {
                            setImageToCrop(formData.images![0]);
                            setCropperOpen(true);
                          }}
                          className="py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-bazar-parchment font-semibold rounded-xl flex items-center gap-1.5 transition text-xs"
                          title="Abrir editor de corte"
                        >
                          <Crop className="w-4 h-4 text-bazar-gold" />
                          <span>Cortar</span>
                        </button>
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageFileChange}
                    />

                    <div>
                      <input
                        type="url"
                        value={formData.images?.[0] || ''}
                        onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                        placeholder="Ou cole o link direto da imagem (https://...)"
                        className="w-full bg-[#0a0610] border border-bazar-charcoal-border rounded-xl px-3 py-1.5 text-[11px] text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-bazar-gold"
                      />
                    </div>
                  </div>
                </div>
              </div>

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

      {/* MODAL DO RECORTE DE IMAGEM */}
      <ImageCropperModal
        imageSrc={imageToCrop}
        isOpen={cropperOpen}
        onClose={() => setCropperOpen(false)}
        onApplyCrop={handleApplyCroppedImage}
      />

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO INDIVIDUAL */}
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

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO EM MASSA */}
      {isBatchDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#180f24] border-2 border-rose-500/50 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-rose-950/70 border border-rose-500/50 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="font-mystic text-lg font-bold text-white">
              Excluir {selectedIds.length} Itens Selecionados?
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Você está prestes a remover <strong className="text-rose-400 font-bold">{selectedIds.length} produtos</strong> de uma só vez do catálogo. Esta operação não poderá ser desfeita.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsBatchDeleteModalOpen(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleBatchDelete}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-rose-900/40"
              >
                Sim, Excluir {selectedIds.length} Itens
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
