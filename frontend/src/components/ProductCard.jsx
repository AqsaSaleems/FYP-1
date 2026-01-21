import { Star } from 'lucide-react';

export function ProductCard({ image, name, price, rating, onClick }) {
  return (
    <div
      onClick={onClick}
      className="rounded-3xl overflow-hidden border hover:shadow-lg cursor-pointer"
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-800 mb-1">{name}</h3>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-black">
            PKR {price}
          </span>

          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
