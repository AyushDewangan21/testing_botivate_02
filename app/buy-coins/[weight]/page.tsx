"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../components/store/cartSlice";
import { RootState } from "../../../components/store/store";

import {
    ArrowLeft,
    ShoppingCart,
    Heart,
    Truck,
    ShieldCheck,
    RefreshCcw,
    Star,
    ChevronDown,
    Minus,
    Plus,
    CreditCard,
    Facebook,
    Twitter,
    Instagram
} from "lucide-react";

import LumenHeader from "../../../components/LumenHeader";
import AnimatedBackground from "../../../components/AnimatedBackground";
import CartDrawer from "../../../components/CartDrawer";

// Import images
import img1 from "../../../components/images/1gmZold.webp";
import img2 from "../../../components/images/2gmZold.webp";
import img5 from "../../../components/images/5gmZold.webp";
import img10 from "../../../components/images/10gmZold.webp";

// Import Box images
import box1 from "../../../components/images/1gmZoldBox.jpg";
import box2 from "../../../components/images/2gmZoldBox.jpg";
import box5 from "../../../components/images/5gmZoldBox.jpg";
import box10 from "../../../components/images/10gmZoldBox.jpg";

const coinImages: Record<number, any> = {
    1: img1,
    2: img2,
    5: img5,
    10: img10,
};

const coinGallery: Record<number, any[]> = {
    1: [img1, box1],
    2: [img2, box2],
    5: [img5, box5],
    10: [img10, box10],
};

const coinDetails: any = {
    1: {
        weight: 1,
        displayName: "ZG 1 Gram Gold Mint Bar 24k (99.9%)",
        description: "This ZOLD GOLD 24 Karat gold mint bar with a high-polished finish weighs 1 gram. The best-in-class quality.",
        price: 6245.5
    },
    2: {
        weight: 2,
        displayName: "ZG 2 Gram Gold Mint Bar 24k (99.9%)",
        description: "This ZOLD GOLD 24 Karat gold mint bar with a high-polished finish weighs 2 grams. The best-in-class quality.",
        price: 12491.0
    },
    5: {
        weight: 5,
        displayName: "ZG 5 Gram Gold Mint Bar 24k (99.9%)",
        description: "This ZOLD GOLD 24 Karat gold mint bar with a high-polished finish weighs 5 grams. The best-in-class quality.",
        price: 31227.5
    },
    10: {
        weight: 10,
        displayName: "ZG 10 Gram Gold Mint Bar 24k (99.9%)",
        description: "This ZOLD GOLD 24 Karat gold mint bar with a high-polished finish weighs 10 grams. The best-in-class quality.",
        price: 62455.0
    }
};

export default function ProductDetailPage() {
    useEffect(() => {
        document.documentElement.classList.add("hide-scrollbar");

        return () => {
            document.documentElement.classList.remove("hide-scrollbar");
        };
    }, []);

    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch();

    const weight = Number(params?.weight);
    const coin = coinDetails[weight];

    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Refs for swipe functionality
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const currentImages = coinGallery[weight] || [];
    const displayImage = currentImages[activeImageIndex];

    // Swipe handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const swipeThreshold = 50; // minimum distance for swipe
        const swipeDistance = touchEndX.current - touchStartX.current;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe right - previous image
                setActiveImageIndex(prev =>
                    prev === 0 ? currentImages.length - 1 : prev - 1
                );
            } else {
                // Swipe left - next image
                setActiveImageIndex(prev =>
                    prev === currentImages.length - 1 ? 0 : prev + 1
                );
            }
        }

        // Reset touch positions
        touchStartX.current = 0;
        touchEndX.current = 0;
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                setActiveImageIndex(prev =>
                    prev === 0 ? currentImages.length - 1 : prev - 1
                );
            } else if (e.key === 'ArrowRight') {
                setActiveImageIndex(prev =>
                    prev === currentImages.length - 1 ? 0 : prev + 1
                );
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentImages.length]);

    // Ultra-compact mobile styles
    const styles = `
    .main-content {
      position: relative;
      z-index: 10;
      padding-top: 70px;
      max-width: 1160px;
      margin: 0 auto;   
      padding-bottom: 30px;
      padding-left: 12px;
      padding-right: 12px;
    }

    /* Aggressive mobile scaling */
    @media (max-width: 480px) {
      .main-content {
        padding-top: 60px;
        padding-left: 8px;
        padding-right: 8px;
      }
      
      .gallery-card {
        padding: 12px !important;
        border-radius: 16px !important;
      }
      
      .product-image-container {
        padding: 12px !important;
        margin-bottom: 12px !important;
      }
      
      .product-image {
        width: 65% !important;
        height: 65% !important;
      }
      
      .right-panel-card {
        padding: 16px !important;
        border-radius: 18px !important;
      }
      
      .trust-badge {
        padding: 8px 4px !important;
      }
      
      .trust-badge-icon {
        width: 14px !important;
        height: 14px !important;
      }
      
      .action-button {
        height: 42px !important;
        font-size: 13px !important;
      }
      
      .delivery-badge {
        padding: 12px !important;
      }
      
      .delivery-icon {
        width: 32px !important;
        height: 32px !important;
      }
      
      .dot-navigation {
        gap: 8px !important;
        margin-top: 8px !important;
      }
      
      .nav-dot {
        width: 8px !important;
        height: 8px !important;
      }
    }

    /* Extra small devices */
    @media (max-width: 360px) {
      .product-image {
        width: 55% !important;
        height: 55% !important;
      }
      
      .right-panel-card {
        padding: 12px !important;
      }
      
      .trust-badge span {
        font-size: 9px !important;
      }
    }

    .gallery-card {
        background: white;
        border-radius: 20px;
        padding: 20px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.03);
        border: 1px solid rgba(184, 150, 12, 0.08);
    }
    
    .text-micro {
      font-size: 0.65rem;
      line-height: 0.9rem;
    }
    
    .text-nano {
      font-size: 0.6rem;
      line-height: 0.8rem;
    }
    
    /* Dot Navigation */
    .dot-navigation {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-top: 16px;
    }
    
    .nav-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #e5e7eb;
      border: 1px solid transparent;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    
    .nav-dot:hover {
      background-color: #d1d5db;
    }
    
    .nav-dot.active {
      background-color: #B8960C;
      transform: scale(1.2);
      box-shadow: 0 0 0 2px rgba(184, 150, 12, 0.2);
    }
    
    /* Swipe hint animation */
    .swipe-hint {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.5);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 11px;
      opacity: 0;
      animation: fadeInOut 2s ease-in-out;
      pointer-events: none;
      white-space: nowrap;
      backdrop-filter: blur(4px);
    }
    
    @keyframes fadeInOut {
      0% { opacity: 0; }
      20% { opacity: 1; }
      80% { opacity: 1; }
      100% { opacity: 0; }
    }
    
    /* Image container for swipe */
    .swipe-container {
      cursor: grab;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
    
    .swipe-container:active {
      cursor: grabbing;
    }
  `;

    if (!coin) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-xl font-bold mb-3">Coin Not Found</h1>
                    <button onClick={() => router.back()} className="text-[#B8960C] underline text-sm">Go Back</button>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        dispatch(addToCart({
            weight: coin.weight,
            quantity: qty,
            price: coin.price,
            displayName: coin.displayName
        }));
    };

    const handleDotClick = (index: number) => {
        setActiveImageIndex(index);
    };

    return (
        <>
            <style jsx>{styles}</style>

            {/* Shared Components */}
            <LumenHeader />
            <CartDrawer />
            <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(135deg,#fdfcf5_0%,#ffffff_100%)]">
                <AnimatedBackground />
            </div>

            {/* Main Content */}
            <main className="main-content ">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-start sm:mt-15">

                    {/* Left Column: Gallery - Smaller on mobile */}
                    <div className="gallery-section">
                        <div className="gallery-card relative shadow-none ">
                            <div
                                ref={imageContainerRef}
                                className="h-50 w-full sm:h-100  relative aspect-square rounded-xl flex items-center justify-center p-2 product-image-container mb-2 border border-gray-100 swipe-container"
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                <Image
                                    src={displayImage}
                                    alt="Gold Coin"
                                    className="scale-150 sm:scale-100 w-[90%] h-[90%] product-image object-contain transition-all duration-200"
                                    draggable={false}
                                />
                                <div className="absolute top-2 left-2 bg-gray-50/90 backdrop-blur px-1.5 py-0.5 rounded-full text-nano font-semibold text-gray-700 flex items-center gap-0.5 shadow-xs border border-gray-200">
                                    <ShieldCheck size={10} className="text-[#B8960C]" />
                                    <span className="hidden xs:inline">24K</span>
                                    <span className="xs:hidden">HALLMARK</span>
                                </div>


                            </div>

                            {/* Circular Navigation Dots */}
                            {currentImages.length > 1 && (
                                <div className="dot-navigation">
                                    {currentImages.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleDotClick(index)}
                                            className={`nav-dot ${activeImageIndex === index ? 'active' : ''}`}
                                            aria-label={`View image ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>


                    </div>

                    {/* Right Column: Panel - Smaller on mobile */}
                    <div className="relative">
                        <div className="sticky top-16 space-y-3">
                            <div className="bg-gray-50 rounded-2xl p-4 right-panel-card border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-start mb-1.5">
                                    <div>
                                        <h1 className="text-lg sm:text-xl font-bold text-gray-700">{coin.weight} Gram</h1>
                                        <span className="text-nano font-medium text-[#B8960C]">Gold Mint Bar (24K)</span>
                                    </div>
                                    <button
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                        className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${isWishlisted ? 'bg-red-50 border-red-100' : 'bg-white border-gray-200'}`}
                                    >
                                        <Heart className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-300"} size={16} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-1 mb-2">
                                    <div className="flex text-yellow-400">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} className="fill-current" />)}
                                    </div>
                                    <span className="text-nano text-gray-400">(120)</span>
                                </div>

                                <div className="pb-3 mb-3 border-b border-gray-200">
                                    <div className="text-xl sm:text-2xl font-bold text-gray-700">₹ {(coin.price * qty).toLocaleString()}</div>
                                    <div className="text-nano text-gray-500">Incl. taxes</div>
                                </div>

                                {/* Trust Badges - Ultra compact */}
                                <div className="grid grid-cols-2 gap-1 mb-4">
                                    {[
                                        { icon: ShieldCheck, label: "Secure" },

                                        { icon: RefreshCcw, label: "Buyback" }
                                    ].map((badge, idx) => (
                                        <div key={idx} className="flex flex-col items-center justify-center p-1.5 trust-badge rounded-lg bg-white border border-gray-100 text-center">
                                            <badge.icon size={14} className="text-[#B8960C] trust-badge-icon" />
                                            <span className="text-nano font-medium text-gray-600">{badge.label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Action Buttons - Compact */}
                                <div className="flex gap-2">
                                    <div className="flex items-center bg-white rounded-lg border border-gray-200 h-10">
                                        <button className="w-7 h-full flex items-center justify-center text-gray-400 hover:text-[#B8960C]" onClick={() => setQty(Math.max(1, qty - 1))}>
                                            <Minus size={12} />
                                        </button>
                                        <div className="w-7 text-center font-semibold text-gray-700 text-sm">{qty}</div>
                                        <button className="w-7 h-full flex items-center justify-center text-gray-400 hover:text-[#B8960C]" onClick={() => setQty(qty + 1)}>
                                            <Plus size={12} />
                                        </button>
                                    </div>

                                    <button
                                        className="flex-1 h-10 bg-[#B8960C] text-xs font-bold text-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 action-button"
                                        onClick={handleAddToCart}
                                    >
                                        Add <ShoppingCart size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Delivery Badge - Ultra compact */}
                            <div className="bg-gradient-to-br from-[#fdfcf5] to-white rounded-xl p-3 delivery-badge border border-[#faeeb1] flex gap-2 items-center">
                                <div className="w-8 h-8 delivery-icon rounded-full bg-[#faeeb1] flex items-center justify-center text-[#B8960C] shrink-0">
                                    <Truck size={16} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-700 text-xs sm:text-sm">Fast & Insured</h4>
                                    <p className=" text-xs sm:text-sm text-gray-500">Delivered in <span className="font-medium text-[#B8960C]">2 Days</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Product Description Accordion - Smaller on mobile */}
                    <div className="mt-3 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden shadow-xs">
                        <div className="border-b border-gray-100">
                            <button className="w-full px-3 py-2.5 flex justify-between items-center text-left font-semibold text-gray-700 text-xs sm:text-sm hover:bg-gray-50" onClick={() => setActiveTab(activeTab === 'desc' ? '' : 'desc')}>
                                <span>Description</span>
                                <ChevronDown className={`transition-transform text-gray-400 ${activeTab === 'desc' ? 'rotate-180' : ''}`} size={14} />
                            </button>
                            {activeTab === 'desc' && (
                                <div className="px-3 pb-3 text-gray-500 text-nano leading-relaxed">
                                    <p className="mb-1.5 text-xs text-gray-800 sm:text-sm ">{coin.description}</p>
                                    <ul className="list-disc pl-3 space-y-0.5 marker:text-[#B8960C] text-xs">
                                        <li>24K (999 Purity)</li>
                                        <li>High Polish Finish</li>
                                        <li>Tamper-proof Packaging</li>
                                        <li>Certificate Included</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div>
                            <button className="w-full px-3 py-2.5 flex justify-between items-center text-left font-semibold text-gray-700 text-xs sm:text-sm  hover:bg-gray-50" onClick={() => setActiveTab(activeTab === 'specs' ? '' : 'specs')}>
                                <span>Specs</span>
                                <ChevronDown className={`transition-transform text-gray-400 ${activeTab === 'specs' ? 'rotate-180' : ''}`} size={14} />
                            </button>
                            {activeTab === 'specs' && (
                                <div className="px-3 pb-3">
                                    <div className="grid grid-cols-2 gap-1.5">
                                        <div className="p-1.5 bg-white rounded-lg border border-gray-100">
                                            <span className="block text-nano text-gray-400 uppercase tracking-wider">Weight</span>
                                            <span className="font-semibold text-gray-800 text-xs">{coin.weight}g</span>
                                        </div>
                                        <div className="p-1.5 bg-white rounded-lg border border-gray-100">
                                            <span className="block text-nano text-gray-400 uppercase tracking-wider">Purity</span>
                                            <span className="font-semibold text-gray-800 text-xs">999</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer - Ultra compact */}
            <footer className="border-t border-gray-200 bg-gray-50 py-6 mt-6 relative z-10">
                <div className="max-w-[1160px] mx-auto px-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-1 mb-2">
                            <div className="w-6 h-6 sm:h-8 sm:w-8 relative overflow-hidden rounded-md  p-[2px]">
                                <Image
                                    src="/02.png"
                                    alt="ZOLD"
                                    fill
                                    sizes="20px"
                                    className="object-contain"
                                />
                            </div>
                            <div className="text-gray-700 font-semibold text-sm">ZOLD</div>
                        </div>

                    </div>
                    <div>
                        <h4 className="font-semibold mb-2 text-gray-800 text-sm">Nav</h4>
                        <ul className="space-y-1 text-xs text-gray-500">
                            <li><a href="#" className="hover:text-[#B8960C]">Buy</a></li>
                            <li><a href="#" className="hover:text-[#B8960C]">Sell</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2 text-gray-800 text-sm">Support</h4>
                        <ul className="space-y-1 text-xs text-gray-500">
                            <li><a href="#" className="hover:text-[#B8960C]">FAQ</a></li>
                            <li><a href="#" className="hover:text-[#B8960C]">Contact</a></li>
                        </ul>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <h4 className="font-semibold mb-2 text-gray-800 text-sm">Follow</h4>
                        <div className="flex gap-1.5">
                            <button className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#B8960C] hover:text-white">
                                <Facebook size={12} />
                            </button>
                            <button className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#B8960C] hover:text-white">
                                <Twitter size={12} />
                            </button>
                            <button className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#B8960C] hover:text-white">
                                <Instagram size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}