import { ShoppingCart } from 'lucide-react';

export function Navigation({ onNavigate, cartItemCount = 0 }) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
            <span className="text-white font-bold">NG</span>
          </div>
          <span className="font-semibold text-gray-800">NextGen Custom Apparel</span>
        </button>

        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('login')} className="px-6 py-2 border rounded-md hover:bg-gray-100">Login</button>
          <button onClick={() => onNavigate('signup')} className="px-6 py-2 border rounded-md hover:bg-gray-100">Sign Up</button>
          <button onClick={() => onNavigate('cart')} className="relative p-2 rounded-md hover:bg-gray-100">
            <ShoppingCart className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
