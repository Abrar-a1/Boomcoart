import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
import KidsLayout from '../../layouts/KidsLayout';

export default function Cart() {
  const navigate = useNavigate();
  // Using Zustand mapped array directly
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = useStore();

  // Phase 3: Total Calculation logic
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Fallback Empty State
  if (cart.length === 0) {
    return (
      <KidsLayout>
        <Helmet><title>Your Cart is Empty | Boomcoart</title></Helmet>
        <div className="flex flex-col items-center justify-center p-20 text-center animate-fade-in">
          <div className="text-8xl mb-6 opacity-30">🛒</div>
          <h2 className="text-3xl font-black text-gray-800 mb-4">Your cart is feeling a bit light!</h2>
          <p className="text-gray-500 font-bold mb-8 max-w-sm">
            Looks like you haven't added anything yet. Let's fix that!
          </p>
          <button 
            onClick={() => navigate('/kids')}
            className="bg-blue-600 text-white font-black py-4 px-10 rounded-2xl shadow-[0_4px_0_0_rgba(37,99,235,1)] hover:translate-y-1 hover:shadow-[0_0px_0_0_rgba(37,99,235,1)] transition-all">
            Start Shopping
          </button>
        </div>
      </KidsLayout>
    );
  }

  return (
    <KidsLayout>
      <Helmet><title>Checkout ({totalItems}) | Boomcoart</title></Helmet>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Cart Item List Segment */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b-2 border-gray-100 pb-4 mb-2">
            <h1 className="text-3xl font-black text-gray-800">Your Cart</h1>
            <button 
              onClick={clearCart} 
              className="text-red-500 font-bold hover:text-red-700 transition"
            >
              Empty Cart
            </button>
          </div>

          {cart.map((item) => (
            <div key={`${item.productId}-${item.selectedSize}`} className="flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
              <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">Img</div>
                )}
              </div>
              
              <div className="flex-grow">
                <h3 className="font-bold text-gray-800 text-lg leading-tight">{item.name}</h3>
                <p className="text-sm font-bold text-gray-400 mb-1 block">Size: {item.selectedSize || 'N/A'}</p>
                <p className="text-lg font-black text-blue-600">${item.price}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center bg-gray-100 rounded-full">
                  <button 
                    onClick={() => decreaseQuantity(item.productId, item.selectedSize)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="w-8 text-center font-bold text-gray-800 text-sm">{item.quantity}</span>
                  <button 
                    onClick={() => increaseQuantity(item.productId, item.selectedSize)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-200 transition"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.productId, item.selectedSize)}
                  className="text-red-400 hover:text-red-600 p-2 transition"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total Calculation Panel */}
        <div className="w-full lg:w-1/3 bg-gray-50 border-2 border-gray-100 rounded-3xl p-6 sticky top-8">
          <h2 className="text-xl font-black text-gray-800 border-b-2 border-gray-200 pb-4 mb-4">Order Summary</h2>
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-500 font-bold">Items ({totalItems})</span>
            <span className="font-black text-gray-800">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500 font-bold">Shipping</span>
            <span className="font-black text-green-500">Free!</span>
          </div>
          
          <div className="border-t-2 border-gray-200 pt-4 mb-6">
            <div className="flex justify-between items-end">
              <span className="text-gray-800 font-black text-lg">Total</span>
              <span className="text-3xl font-black text-blue-600">${subtotal.toFixed(2)}</span>
            </div>
          </div>

          <button 
            className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-[0_4px_0_0_rgba(37,99,235,1)] hover:translate-y-1 hover:shadow-[0_0px_0_0_rgba(37,99,235,1)] transition-all"
          >
            Secure Checkout
          </button>
        </div>

      </div>
    </KidsLayout>
  );
}
