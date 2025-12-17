export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-gray-900 to-transparent border-t border-white/10">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Humo<span className="text-cyan-400">eSport</span>
            </h3>
            <p className="text-gray-300">
              O'zbekistonning eng yirik eSport turnirlarini boshqarish platformasi
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Tez Havolalar</h4>
            <ul className="space-y-2">
              <li>
                <a href="/register" className="text-gray-300 hover:text-cyan-400 transition-colors">
                  Turnirga Ro'yxatdan O'tish
                </a>
              </li>
              <li>
                <a href="/admin/login" className="text-gray-300 hover:text-cyan-400 transition-colors">
                  Admin Panel
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Aloqa</h4>
            <p className="text-gray-300">
              Savollar uchun:<br />
              <a href="mailto:info@humoesport.uz" className="text-cyan-400">
                info@humoesport.uz
              </a>
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Humo eSport. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
}
