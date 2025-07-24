'use client';

import { useState } from 'react';
import { XCircle } from 'lucide-react';

interface OrderCancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  orderNumber: string;
  isLoading: boolean;
}

const CANCELLATION_REASONS = [
  'Müşteri talebi',
  'Stok yetersizliği',
  'Ödeme sorunu',
  'Teslimat problemi',
  'Ürün hatası',
  'Diğer'
];

export default function OrderCancellationModal({
  isOpen,
  onClose,
  onConfirm,
  orderNumber,
  isLoading
}: OrderCancellationModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const handleSubmit = () => {
    const reason = selectedReason === 'Diğer' ? customReason : selectedReason;
    if (reason.trim()) {
      onConfirm(reason.trim());
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setCustomReason('');
    onClose();
  };

  const isValid = selectedReason && (selectedReason !== 'Diğer' || customReason.trim());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Siparişi İptal Et
              </h2>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <p className="text-gray-600 mb-2">
              <strong>#{orderNumber}</strong> numaralı siparişi iptal etmek istediğinizden emin misiniz?
            </p>
            <p className="text-sm text-gray-500">
              Lütfen iptal sebebini belirtiniz:
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {CANCELLATION_REASONS.map((reason) => (
              <label key={reason} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="cancellation-reason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  disabled={isLoading}
                  className="text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">{reason}</span>
              </label>
            ))}
          </div>

          {selectedReason === 'Diğer' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İptal sebebini açıklayın:
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                disabled={isLoading}
                placeholder="İptal sebebini detaylı olarak açıklayın..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {customReason.length}/500 karakter
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Vazgeç
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid || isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              )}
              <span>Siparişi İptal Et</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}