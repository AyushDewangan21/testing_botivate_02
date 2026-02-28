
"use client";

import { useState } from 'react';
import {
  X, Gem, Sparkles, CheckCircle,
  Info, Heart, ShoppingBag, Clock,
  ChevronRight, Filter, Search, Star,
  Truck, Shield, RefreshCw, Calendar,
  Users, Package, Award, Tag
} from 'lucide-react';
import Image from "next/image";
import ring from "@/components/images/ring.webp";
import necklace from "@/components/images/necklace.webp";
import necklace2 from "@/components/images/necklace2.webp";
import earring from "@/components/images/earring2.jpg";
import bangle from "@/components/images/bangle.webp";
import chain from "@/components/images/chain.webp";

interface JewelleryFlowProps {
  onClose: () => void;
}

type Step = 'browse' | 'product' | 'customize' | 'delivery' | 'success';
type Category = 'all' | 'rings' | 'necklaces' | 'earrings' | 'bangles' | 'chains';

interface JewelleryProduct {
  id: number;
  name: string;
  category: Category;
  description: string;
  goldWeight: number;
  makingCharges: number;
  diamonds?: number;
  price: number;
  discountPrice?: number;
  image: any;
  rating: number;
  reviews: number;
  deliveryTime: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export function JewelleryFlow({ onClose }: JewelleryFlowProps) {
  const [step, setStep] = useState<Step>('browse');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedProduct, setSelectedProduct] = useState<JewelleryProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('18');
  const [deliveryOption, setDeliveryOption] = useState<'home' | 'store'>('home');
  const [address, setAddress] = useState('');
  const [selectedStore, setSelectedStore] = useState<number | null>(1);
  const [goldToUse, setGoldToUse] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const userGoldBalance = 12.547; // grams
  const currentGoldPrice = 6245.50; // per gram

  const categoryImages: Record<string, any> = {
    rings: ring,
    necklaces: necklace,
    earrings: earring,
    bangles: bangle,
    chains: chain,
    necklace2: necklace2,
  };

  const categories = [
    { id: 'all', name: 'All Jewellery', icon: Gem },
    { id: 'rings', name: 'Rings', icon: Gem },
    { id: 'necklaces', name: 'Necklaces', icon: Sparkles },
    { id: 'earrings', name: 'Earrings', icon: Sparkles },
    { id: 'bangles', name: 'Bangles', icon: Gem },
    { id: 'chains', name: 'Chains', icon: Sparkles },
  ];

  const jewelleryProducts: JewelleryProduct[] = [
    {
      id: 1,
      name: 'Classic Diamond Solitaire Ring',
      category: 'rings',
      description: 'Elegant solitaire ring with brilliant cut diamond',
      goldWeight: 3.5,
      makingCharges: 4500,
      diamonds: 0.5,
      price: 125000,
      discountPrice: 118000,
      image: ring,
      rating: 4.8,
      reviews: 342,
      deliveryTime: '7-10 days',
      isBestSeller: true
    },
    {
      id: 2,
      name: 'Traditional Gold Necklace Set',
      category: 'necklaces',
      description: 'Heavy traditional necklace with intricate work',
      goldWeight: 25.7,
      makingCharges: 18500,
      price: 345000,
      image: necklace,
      rating: 4.9,
      reviews: 218,
      deliveryTime: '15-20 days',
      isNew: true
    },
    {
      id: 3,
      name: 'Pearl & Gold Earrings',
      category: 'earrings',
      description: 'Elegant pearl drop earrings with gold base',
      goldWeight: 5.2,
      makingCharges: 3200,
      price: 78500,
      discountPrice: 69800,
      image: earring,
      rating: 4.7,
      reviews: 156,
      deliveryTime: '5-7 days'
    },
    {
      id: 4,
      name: 'Contemporary Gold Bangle',
      category: 'bangles',
      description: 'Modern design gold bangle with geometric patterns',
      goldWeight: 8.3,
      makingCharges: 5200,
      diamonds: 0.25,
      price: 124500,
      image: bangle,
      rating: 4.6,
      reviews: 89,
      deliveryTime: '10-12 days'
    },
    {
      id: 5,
      name: 'Gold Chain with Pendant',
      category: 'chains',
      description: 'Simple yet elegant chain with religious pendant',
      goldWeight: 7.1,
      makingCharges: 3800,
      price: 98500,
      discountPrice: 89900,
      image: chain,
      rating: 4.5,
      reviews: 203,
      deliveryTime: '3-5 days',
      isBestSeller: true
    },
    {
      id: 6,
      name: 'Bridal Gold Set',
      category: 'necklaces',
      description: 'Complete bridal set with necklace, earrings, and bangles',
      goldWeight: 45.2,
      makingCharges: 25000,
      diamonds: 2.5,
      price: 625000,
      image: necklace2,
      rating: 4.9,
      reviews: 127,
      deliveryTime: '25-30 days'
    }
  ];


  const stores = [
    { id: 1, name: 'AT Plus Connaught Place', address: 'Connaught Place, Delhi', distance: '2.3 km' },
    { id: 2, name: 'AT Plus Saket', address: 'Select Citywalk, Saket', distance: '5.7 km' },
    { id: 3, name: 'AT Plus Karol Bagh', address: 'Karol Bagh, Delhi', distance: '7.2 km' },
  ];

  const filteredProducts = selectedCategory === 'all'
    ? jewelleryProducts
    : jewelleryProducts.filter(product => product.category === selectedCategory);

  const searchedProducts = searchQuery
    ? filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : filteredProducts;

  // Calculate price if product is selected
  const calculateProductPrice = () => {
    if (!selectedProduct) return 0;

    const goldValue = selectedProduct.goldWeight * currentGoldPrice;
    const makingCharges = selectedProduct.makingCharges;
    const totalValue = goldValue + makingCharges;

    // Apply discount if available
    return selectedProduct.discountPrice || totalValue;
  };

  const calculateGoldValue = () => {
    if (!selectedProduct) return 0;
    return selectedProduct.goldWeight * currentGoldPrice;
  };

  const calculateSavingFromGold = () => {
    if (!selectedProduct) return 0;
    return Math.min(goldToUse * currentGoldPrice, calculateGoldValue());
  };

  const finalPrice = calculateProductPrice() - calculateSavingFromGold();
  const maxGoldToUse = Math.min(userGoldBalance, selectedProduct?.goldWeight || 0);
  const goldValuePerGram = currentGoldPrice;

  return (
    <div
      className="
    fixed inset-0
    bg-gradient-to-br
    from-white
    via-white
    to-[#E6E0FA]
    dark:from-neutral-900
    dark:via-[#2A2440]
    dark:to-[#1F1B2E]
    z-50
    overflow-y-auto
  "
    >

      {/* Header */}
      <div
        className="
    sticky top-0 z-20
    bg-gradient-to-r from-[#2c1f52] via-[#4b3a79] to-purple-900
    backdrop-blur-xl
    border-b border-white/10
    shadow-[0_10px_20px_rgba(0,0,0,0.20)]
  "
      >
        <div className="w-full sm:h-[10vh] h-[18vh] sm:h-[10vh] max-w-7xl mx-auto px-4 py-3">

          {/* Top Row */}
          <div className="flex items-center justify-between">

            {/* Left : Close + Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-50/10 rounded-full transition-colors"
              >
                <X className="h-4 w-4 sm:w-5 sm:h-5 text-white" />
              </button>

              <h2 className="text-white text-sm sm:text-lg md:text-xl font-semibold whitespace-nowrap">
                Gold Jewellery
              </h2>
            </div>

            {/* Center Search (Desktop only) */}
            {step === "browse" && (
              <div className="hidden md:flex justify-center flex-1 px-6">
                <div className="relative w-full max-w-xl">


                  <input
                    type="text"
                    placeholder="Search jewellery..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="
                w-full pl-10 pr-3 py-2.5
                rounded-xl
                bg-gray-50/15
                border border-white/20
                backdrop-blur-lg
                text-white text-sm
                placeholder-white/60
                focus:outline-none
                focus:ring-2 focus:ring-white/30
              "
                  />
                </div>
              </div>
            )}

            {/* Right Step Indicator */}
            {step !== "browse" && (
              <div className="bg-gray-50/20 rounded-full px-3 py-1">
                <span className="text-white text-xs">
                  Step {step === "product" ? 1 : step === "customize" ? 2 : step === "delivery" ? 3 : 4} of 4
                </span>
              </div>
            )}
          </div>

          {/* Mobile Search */}
          {step === "browse" && (
            <div className="mt-3 md:hidden">
              <div className="relative w-full">
                <Image
                  src="/icons/search.svg"
                  alt="search"
                  width={18}
                  height={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-90"
                />

                <input
                  type="text"
                  placeholder="Search jewellery..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="
              w-full pl-10 pr-3 py-2.5
              rounded-xl
              bg-gray-50/15
              border border-white/20
              backdrop-blur-lg
              text-white text-sm
              placeholder-white/60
              focus:outline-none
              focus:ring-2 focus:ring-white/30
            "
                />
              </div>
            </div>
          )}
        </div>
      </div>







      <div className="max-w-4xl mx-auto p-2 pb-24">
        {step === 'browse' && (
          <div>
            {/* Categories */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-gray-900 dark:text-white text-sm sm:text-lg font-semibold tracking-wide">
                  Categories
                </h3>

                <button className="flex items-center gap-2 text-sm text-[#3D3066] dark:text-[#8B7FA8] bg-gray-50 dark:bg-neutral-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-700 shadow-sm">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>

              <div className="grid grid-cols-3 gap-5">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id as Category)}
                      className={`
                        h-20 sm:h-30 sm:w-full
    relative
    flex flex-col items-center justify-center
    p-1 sm:p-7 rounded-xl
    border
    backdrop-blur-xl
    transform transition-all duration-300 ease-out
    ${isSelected
                          ? `
        scale-105 
        bg-gradient-to-br 
        from-[#3D3066] 
        via-[#4C3C7A] 
        to-[#6E5FA3]
        text-white
        border-white/10
        
        ring-1 ring-white/20
      `
                          : `
        scale-100
        bg-gray-50/70 dark:bg-neutral-800/70
        border-gray-200/60 dark:border-neutral-700/60
        text-gray-700 dark:text-neutral-300
        shadow-md
        hover:scale-[1.05]
      `
                        }
  `}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 rounded-2xl" />
                      )}

                      <Icon
                        className={`
                          h-3 w-3
      sm:w-7 sm:h-7 mb-3
      transition-colors duration-300
      ${isSelected ? "text-white" : "text-[#3D3066] dark:text-[#8B7FA8]"}
    `}
                      />

                      <span
                        className={`
      text-xs font-semibold tracking-wide 
      ${isSelected ? "text-white" : "text-gray-800 dark:text-neutral-200"}
    `}
                      >
                        {category.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Products Grid */}
            <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 bg-transparent">

              {searchedProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    setStep('product');
                  }}
                  className="relative rounded-3xl overflow-hidden text-left bg-gray-50 shadow-[0_6px_10px_rgba(0,0,0,0.10)] transition-all duration-300 hover:shadow-[0_12px_15px_rgba(0,0,0,0.20)] hover:-translate-y-1"
                >

                  {/* Product Image */}
                  <div className="relative h-72 flex items-center justify-center bg-white overflow-hidden">

                    <div className="absolute inset-0"></div>

                    <Image
                      src={product.image}
                      alt={product.name}
                      className="object-contain pt-10"
                      fill
                    />

                  </div>


                  {/* Product Details */}
                  <div className="pl-5 pr-5 pb-5 rounded-t-[50px] bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-yellow-700 capitalize tracking-wide font-medium">
                        {product.category}
                      </span>
                      <Heart className="w-4 h-4 text-yellow-500" />
                    </div>

                    <h4 className="text-gray-900 text-sm font-semibold mb-2 line-clamp-1">
                      {product.name}
                    </h4>

                    <p className="text-gray-600 text-xs mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        {product.discountPrice ? (
                          <>
                            <span className="text-gray-900 font-bold text-[15px]">
                              ₹{product.discountPrice.toLocaleString()}
                            </span>
                            <span className="text-gray-400 line-through text-xs ml-2">
                              ₹{product.price.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-900 font-bold text-[15px]">
                            ₹{product.price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-yellow-700 flex items-center font-semibold">
                        View
                        <ChevronRight className="w-4 h-4 ml-0.5" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>



            {/* Info Section */}
            <div className=" mt-15 bg-gradient-to-r from-[#3D3066] to-[#5C4E7F] rounded-2xl p-6 text-white shadow-[0_10px_35px_rgba(61,48,102,0.35)]">
              More Info...
            </div>
          </div>

        )}

        {step === 'product' && selectedProduct && (
          <div>
            {/* Back Button */}
            <button
              onClick={() => setStep('browse')}
              className=" text-sm flex items-center gap-2 text-white mb-6 bg-[#3D3066] px-4 py-2 rounded-full transition-colors duration-200"

            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Jewellery
            </button>

            {/* Product Details */}
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-2 sm:p-6 mb-6 shadow-lg dark:shadow-neutral-900/50">
              <div className="flex flex-col lg:flex-row gap-6">

                {/* Product Image */}
                {/* Product Image */}
                <div className="lg:w-1/2">
                  <div
                    className="
      relative
      w-full
      aspect-square
      rounded-xl
      shadow-md
      bg-white
    "
                  >
                    <Image
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain p-6"
                      priority
                    />
                  </div>

                  {/* Product Badges */}
                  <div className="flex gap-2 ">
                    ...
                  </div>
                </div>


                {/* Product Info (Purple Theme Panel) */}
                <div
                  className="
          lg:w-1/2
          rounded-2xl
          p-4
          text-white
          bg-gradient-to-br from-[#3D3066] to-[#5C4E7F]
                        transition-all duration-300
          hover:shadow-[0_18px_40px_rgba(61,48,102,0.10)]
          hover:scale-101
        "
                >
                  <h2 className="text-lg sm:text-2xl font-semibold mb-3">{selectedProduct.name}</h2>
                  <p className="text-sm text-white/80 mb-4">{selectedProduct.description}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-white/30"
                              }`}
                          />
                        ))}
                      </div>
                      <span>{selectedProduct.rating}</span>
                    </div>
                    <span className="text-white/40">•</span>
                    <span className="text-white/70">
                      {selectedProduct.reviews} reviews
                    </span>
                  </div>

                  {/* Gold Details */}
                  <div className="space-y-4 mb-6 text-sm sm:text-base">
                    <div className="flex justify-between border-b border-white/20 pb-2">
                      <span className="text-white/70">Gold Weight</span>
                      <span>{selectedProduct.goldWeight} grams</span>
                    </div>

                    <div className="flex justify-between border-b border-white/20 pb-2">
                      <span className="text-white/70">Making Charges</span>
                      <span>
                        ₹{selectedProduct.makingCharges.toLocaleString()}
                      </span>
                    </div>

                    {selectedProduct.diamonds && (
                      <div className="flex justify-between border-b border-white/20 pb-2">
                        <span className="text-white/70">Diamonds</span>
                        <span>{selectedProduct.diamonds} carats</span>
                      </div>
                    )}

                    <div className="flex justify-between border-b border-white/20 pb-2">
                      <span className="text-white/70">Delivery Time</span>
                      <span>{selectedProduct.deliveryTime}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-end gap-3 mb-2">
                      {selectedProduct.discountPrice ? (
                        <>
                          <span className="text-3xl font-bold">
                            ₹{selectedProduct.discountPrice.toLocaleString()}
                          </span>
                          <span className="text-white/50 line-through">
                            ₹{selectedProduct.price.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="text-xl sm:text-3xl font-bold">
                          ₹{selectedProduct.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-white/70 text-xs">
                      Save more by using your gold from vault
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 text-sm">
                    <button className="flex-1 bg-gray-50/10 border border-white/20 py-3 rounded-lg font-semibold  hover:bg-gray-50/20 transition">
                      <Heart className="w-5 h-5 inline mr-2" />
                      Wishlist
                    </button>

                    <button
                      onClick={() => setStep("customize")}
                      className="flex-1 bg-gray-50 text-[#3D3066] py-3 rounded-lg font-semibold hover:opacity-90 transition"
                    >
                      Customize & Buy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        )}

        {step === 'customize' && selectedProduct && (
          <div>
            {/* Back Button */}
            <button
              onClick={() => setStep('product')}
              className="flex items-center gap-2 text-sm text-white mb-6 bg-[#3D3066] px-4 py-2 rounded-full transition-colors duration-200"

            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Product
            </button>

            <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-4 mb-6 shadow-lg dark:shadow-neutral-900/50">
              <h2 className="text-md sm:text-lg text-gray-900 dark:text-white mb-6">Customize Your Jewellery</h2>

              {/* Size Selection */}
              <div className="mb-8">
                <h4 className="text-sm sm:text-md text-gray-900 dark:text-white mb-4">Select Size</h4>
                <div className="grid grid-cols-5 gap-2">
                  {['16', '17', '18', '19', '20'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`text-sm sm:text-md py-1 sm:py-3 rounded-lg border-2 transition-colors ${selectedSize === size
                        ? 'border-[#3D3066] dark:border-[#8B7FA8] bg-[#F3F1F7] dark:bg-neutral-700 text-[#3D3066] dark:text-[#8B7FA8]'
                        : 'border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 hover:border-gray-300 dark:hover:border-neutral-600'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gold Usage */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-gray-900 dark:text-white">Use Your Gold</h4>
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-neutral-400 mr-2">Available:</span>
                    <span className="text-gray-900 dark:text-white">{userGoldBalance.toFixed(2)}g</span>
                    <Sparkles className="w-4 h-4 text-yellow-500 inline ml-1" />
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600 dark:text-neutral-400">Gold to use (grams)</span>
                    <span className="text-gray-900 dark:text-white">
                      Max: {maxGoldToUse.toFixed(2)}g
                    </span>
                  </div>

                  {/* Gold Slider */}
                  <input
                    type="range"
                    min="0"
                    max={maxGoldToUse}
                    step="0.1"
                    value={goldToUse}
                    onChange={(e) => setGoldToUse(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-neutral-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#3D3066] dark:[&::-webkit-slider-thumb]:bg-[#8B7FA8]"
                  />

                  <div className="flex justify-between text-sm text-gray-500 dark:text-neutral-400 mt-2">
                    <span>0g</span>
                    <span className="text-gray-900 dark:text-white font-medium">{goldToUse.toFixed(1)}g</span>
                    <span>{maxGoldToUse.toFixed(1)}g</span>
                  </div>
                </div>

                {/* Gold Value Calculation */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-neutral-400">Gold value used</span>
                    <span className="text-gray-900 dark:text-white">
                      ₹{(goldToUse * goldValuePerGram).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-neutral-400">Remaining gold in vault</span>
                    <span className="text-gray-900 dark:text-white">
                      {(userGoldBalance - goldToUse).toFixed(2)}g
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <h4 className="text-gray-900 dark:text-white mb-4">Quantity</h4>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-neutral-600 flex items-center justify-center text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700"
                  >
                    -
                  </button>
                  <span className="text-gray-900 dark:text-white text-xl">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-neutral-600 flex items-center justify-center text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700"
                  >
                    +
                  </button>
                  <span className="text-gray-600 dark:text-neutral-400 text-sm ml-4">
                    Multiple quantities may affect delivery time
                  </span>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4 mb-6">
                <h4 className="text-gray-900 dark:text-white mb-4">Order Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-neutral-400">Jewellery Price</span>
                    <span className="text-gray-900 dark:text-white">
                      ₹{calculateProductPrice().toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-neutral-400">Gold Used ({goldToUse}g)</span>
                    <span className="text-green-600 dark:text-green-400">
                      - ₹{calculateSavingFromGold().toLocaleString()}
                    </span>
                  </div>

                  {selectedProduct.discountPrice && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-neutral-400">Discount</span>
                      <span className="text-green-600 dark:text-green-400">
                        - ₹{(selectedProduct.price - selectedProduct.discountPrice).toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-gray-300 dark:border-neutral-600 pt-3 flex justify-between">
                    <span className="text-gray-900 dark:text-white font-semibold">Final Price</span>
                    <span className="text-[#3D3066] dark:text-[#8B7FA8] font-bold text-xl">
                      ₹{finalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep('delivery')}
                className="w-full bg-gradient-to-r from-[#3D3066] to-[#5C4E7F] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Proceed to Delivery
              </button>
            </div>
          </div>
        )}

        {step === 'delivery' && selectedProduct && (
          <div>
            {/* Back Button */}
            <button
              onClick={() => setStep('customize')}
              className="flex items-center gap-2 text-white mb-6 bg-[#3D3066] px-6 py-2 rounded-full transition-colors duration-200"

            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Customization
            </button>

            <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-6 mb-6 shadow-lg dark:shadow-neutral-900/50">
              <h2 className="text-gray-900 dark:text-white mb-6">Delivery Options</h2>

              {/* Delivery Method */}
              <div className="mb-8">
                <h4 className="text-gray-900 dark:text-white mb-4">Choose Delivery Method</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => setDeliveryOption('home')}
                    className={`w-full p-4 rounded-xl border-2 transition-colors text-left ${deliveryOption === 'home'
                      ? 'border-[#3D3066] dark:border-[#8B7FA8] bg-[#F3F1F7] dark:bg-neutral-700'
                      : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryOption === 'home'
                        ? 'border-[#3D3066] dark:border-[#8B7FA8]'
                        : 'border-gray-300 dark:border-neutral-600'
                        }`}>
                        {deliveryOption === 'home' && (
                          <div className="w-3 h-3 rounded-full bg-[#3D3066] dark:bg-[#8B7FA8]" />
                        )}
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white">Home Delivery</p>
                        <p className="text-gray-600 dark:text-neutral-400 text-sm">
                          Free shipping • {selectedProduct.deliveryTime}
                        </p>
                      </div>
                      <Truck className="w-5 h-5 text-gray-600 dark:text-neutral-500 ml-auto" />
                    </div>
                  </button>

                  <button
                    onClick={() => setDeliveryOption('store')}
                    className={`w-full p-4 rounded-xl border-2 transition-colors text-left ${deliveryOption === 'store'
                      ? 'border-[#3D3066] dark:border-[#8B7FA8] bg-[#F3F1F7] dark:bg-neutral-700'
                      : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryOption === 'store'
                        ? 'border-[#3D3066] dark:border-[#8B7FA8]'
                        : 'border-gray-300 dark:border-neutral-600'
                        }`}>
                        {deliveryOption === 'store' && (
                          <div className="w-3 h-3 rounded-full bg-[#3D3066] dark:bg-[#8B7FA8]" />
                        )}
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white">Store Pickup</p>
                        <p className="text-gray-600 dark:text-neutral-400 text-sm">
                          Pick up from nearest AT Plus store
                        </p>
                      </div>
                      <Package className="w-5 h-5 text-gray-600 dark:text-neutral-500 ml-auto" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Address or Store Selection */}
              {deliveryOption === 'home' ? (
                <div className="mb-8">
                  <h4 className="text-gray-900 dark:text-white mb-4">Delivery Address</h4>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your complete address"
                    className="text-black w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7FA8] focus:border-transparent min-h-[120px]"
                  />
                  <p className="text-gray-500 dark:text-neutral-400 text-sm mt-2">
                    Our executive will call you to confirm the address
                  </p>
                </div>
              ) : (
                <div className="mb-8">
                  <h4 className="text-gray-900 dark:text-white mb-4">Select Store</h4>
                  <div className="space-y-3">
                    {stores.map((store) => (
                      <button
                        key={store.id}
                        onClick={() => setSelectedStore(store.id)}
                        className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${selectedStore === store.id
                          ? 'border-[#3D3066] dark:border-[#8B7FA8] bg-[#F3F1F7] dark:bg-neutral-700'
                          : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                          }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedStore === store.id
                            ? 'border-[#3D3066] dark:border-[#8B7FA8]'
                            : 'border-gray-300 dark:border-neutral-600'
                            }`}>
                            {selectedStore === store.id && (
                              <div className="w-3 h-3 rounded-full bg-[#3D3066] dark:bg-[#8B7FA8]" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 dark:text-white">{store.name}</p>
                            <p className="text-gray-600 dark:text-neutral-400 text-sm">
                              {store.address} • {store.distance} away
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Final Summary */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4 mb-6">
                <h4 className="text-gray-900 dark:text-white mb-4">Order Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-neutral-400">{selectedProduct.name}</span>
                    <span className="text-gray-900 dark:text-white">×{quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-neutral-400">Gold Used</span>
                    <span className="text-green-600 dark:text-green-400">{goldToUse}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-neutral-400">Delivery</span>
                    <span className="text-gray-900 dark:text-white">
                      {deliveryOption === 'home' ? 'Home Delivery (Free)' : 'Store Pickup (Free)'}
                    </span>
                  </div>
                  <div className="border-t border-gray-300 dark:border-neutral-600 pt-3 flex justify-between">
                    <span className="text-gray-900 dark:text-white font-semibold">Total Amount</span>
                    <span className="text-[#3D3066] dark:text-[#8B7FA8] font-bold text-xl">
                      ₹{finalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep('success')}
                className="w-full bg-gradient-to-r from-[#3D3066] to-[#5C4E7F] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Place Order
              </button>
            </div>
          </div>
        )}

        {step === 'success' && selectedProduct && (
          <div className="text-center">
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-8 mb-6 shadow-lg dark:shadow-neutral-900/50">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-6 w-24 h-24 mx-auto mb-6 relative">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-500 absolute inset-0 m-auto" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#8B7FA8] animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>

              <h1 className="text-black mb-3 dark:text-white">Order Confirmed!</h1>
              <p className="text-gray-600 dark:text-neutral-400 mb-6">
                Your {selectedProduct.name} has been successfully ordered
              </p>

              <div className="space-y-4 mb-6">
                <div className="bg-[#F3F1F7] dark:bg-neutral-700 rounded-lg p-4">
                  <p className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Order Number</p>
                  <p className="text-gray-900 dark:text-white">#ZOLD-{Math.floor(Math.random() * 10000)}</p>
                </div>

                <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4">
                  <p className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Expected Delivery</p>
                  <p className="text-gray-900 dark:text-white">
                    {selectedProduct.deliveryTime}
                    {deliveryOption === 'store' ? ' (Store Pickup)' : ' (Home Delivery)'}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4">
                  <p className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Gold Used from Vault</p>
                  <p className="text-gray-900 dark:text-white">{goldToUse.toFixed(2)} grams</p>
                  <p className="text-gray-500 dark:text-neutral-500 text-xs">
                    Remaining: {(userGoldBalance - goldToUse).toFixed(2)}g
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={onClose}
                className="w-full bg-[#3D3066] dark:bg-[#4D3F7F] text-white py-4 rounded-lg hover:bg-[#5C4E7F] dark:hover:bg-[#5C4E9F] transition-colors"
              >
                View Order Details
              </button>
              <button className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 py-4 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                Track Order
              </button>
              <button className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 py-4 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JewelleryFlow;