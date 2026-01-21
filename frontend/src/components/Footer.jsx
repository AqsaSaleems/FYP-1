import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold">NG</div>
              <span className="font-semibold">NextGen</span>
            </div>
            <p className="text-sm text-gray-300">Custom apparel designed your way. Quality you can trust.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>About Us</li>
              <li>How It Works</li>
              <li>Pricing</li>
              <li>FAQs</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Contact Us</li>
              <li>Shipping</li>
              <li>Returns</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center gap-2"><Mail size={16} /> hello@nextgen.com</div>
              <div className="flex items-center gap-2"><Phone size={16} /> +92 300 1234567</div>
              <div className="flex items-center gap-2"><MapPin size={16} /> Karachi, Pakistan</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© 2025 NextGen Custom Apparel. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0"><Facebook /><Instagram /><Twitter /></div>
        </div>
      </div>
    </footer>
  );
}
