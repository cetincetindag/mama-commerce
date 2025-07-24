import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-16 bg-gray-100 pt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 pb-8 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <h2 className="mb-4 text-xl font-bold text-primary-700">Lavanta Tasarım</h2>
            <p className="mb-4 text-gray-600">
              El yapımı, özel tasarım kadın çantaları sunan butik markamız.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 font-bold text-gray-900">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/urunler" className="text-gray-600 hover:text-primary-700">
                  Ürünler
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-gray-600 hover:text-primary-700">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 font-bold text-gray-900">Kategoriler</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/urunler?tip=el-çantası" className="text-gray-600 hover:text-primary-700">
                  El Çantaları
                </Link>
              </li>
              <li>
                <Link href="/urunler?tip=omuz-çantası" className="text-gray-600 hover:text-primary-700">
                  Omuz Çantaları
                </Link>
              </li>
              <li>
                <Link href="/urunler?tip=sırt-çantası" className="text-gray-600 hover:text-primary-700">
                  Sırt Çantaları
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 font-bold text-gray-900">İletişim</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>lavanta.destek@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 py-6 text-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Lavanta Tasarım. Tüm Hakları Saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 