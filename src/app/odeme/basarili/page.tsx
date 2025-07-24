'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import MainLayout from '~/components/layout/MainLayout';
import Link from 'next/link';
import { CheckCircle, Copy } from 'lucide-react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('orderCode');
  const total = searchParams.get('total');

  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text);
    alert('Kopyalandı!');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Siparişiniz Alındı!
            </h1>
            <p className="text-gray-600">
              Ödeme talimatlarını aşağıda bulabilirsiniz.
            </p>
          </div>

          {/* Order Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Sipariş Bilgileri
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Sipariş Kodu:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-lg text-primary-600">
                    {orderCode}
                  </span>
                  <button
                    onClick={() => copyToClipboard(orderCode ?? '')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Toplam Tutar:</span>
                <span className="font-bold text-lg">₺{total}</span>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Ödeme Talimatları
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Banka Bilgileri:
                </h3>
                <div className="bg-white border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">IBAN:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono">TR12 3456 7890 1234 5678 9012 34</span>
                      <button
                        onClick={() => copyToClipboard('TR12 3456 7890 1234 5678 9012 34')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hesap Sahibi:</span>
                    <span className="font-semibold">Emine Çetindağ</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  ÖNEMLİ NOTLAR:
                </h4>
                <ul className="space-y-1 text-blue-700 text-sm">
                  <li>• Kendi hesabınızdan gönderiyorsanız açıklama kısmını boş bırakabilirsiniz.</li>
                  <li>• Başka birinin hesabından gönderiyorsanız açıklamaya <strong>adınızı ve soyadınızı</strong> yazın.</li>
                  <li>• Ödemeniz onaylandıktan sonra e-posta ile bilgilendirileceksiniz.</li>
                  <li>• Ürünleriniz kargoya verildiğinde tekrar e-posta ile haberdar edileceksiniz.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/siparis-takip"
              className="flex-1 bg-blue-600 text-white text-center py-3 px-6 rounded-lg font-medium hover:bg-blue-700 border border-blue-600"
            >
              Sipariş Takip
            </Link>
            <Link
              href="/urunler"
              className="flex-1 border border-gray-300 text-gray-700 text-center py-3 px-6 rounded-lg font-medium hover:bg-gray-50"
            >
              Alışverişe Devam Et
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Herhangi bir sorunuz varsa{' '}
              <a href="mailto:lavanta.destek@gmail.com" className="text-primary-600 hover:underline">
lavanta.destek@gmail.com
              </a>{' '}
              adresinden bizimle iletişime geçebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}