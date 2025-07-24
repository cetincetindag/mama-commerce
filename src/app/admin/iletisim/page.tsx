'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '~/components/layout/AdminLayout';
import { useAdmin } from '@/hooks/useAdmin';
import { Mail, Calendar, Eye, CheckCircle, XCircle } from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ContactManagement() {
  const { isAuthenticated, isLoading, getAuthHeaders } = useAdmin();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const fetchContacts = async () => {
    try {
      const authHeaders = getAuthHeaders();
      const response = await fetch('/api/iletisim', {
        headers: authHeaders.Authorization ? authHeaders : {}
      });

      if (response.ok) {
        const data = (await response.json()) as Contact[];
        setContacts(data);
      }
    } catch {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      void fetchContacts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); // Intentionally not including fetchContacts to avoid infinite loop

  const updateContactStatus = async (id: number, status: string) => {
    try {
      const authHeaders = getAuthHeaders();
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeaders.Authorization ? authHeaders : {})
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setContacts(contacts.map(contact => 
          contact.id === id ? { ...contact, status } : contact
        ));
        if (selectedContact && selectedContact.id === id) {
          setSelectedContact({ ...selectedContact, status });
        }
      }
    } catch {
      // Handle error silently
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1"></div>
            Yeni
          </span>
        );
      case 'read':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Eye className="w-3 h-3 mr-1" />
            Okundu
          </span>
        );
      case 'responded':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Yanıtlandı
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircle className="w-3 h-3 mr-1" />
            Kapatıldı
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">İletişim Formları</h1>
          <div className="text-sm text-gray-500">
            Toplam {contacts.length} mesaj
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-gray-600">Yükleniyor...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact List */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Mesajlar</h2>
                </div>
                
                {contacts.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    Henüz mesaj bulunmuyor.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedContact?.id === contact.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        }`}
                        onClick={() => setSelectedContact(contact)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {contact.name}
                              </h3>
                              {getStatusBadge(contact.status)}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{contact.subject}</p>
                            <div className="flex items-center text-xs text-gray-500 space-x-4">
                              <span className="flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {contact.email}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(contact.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Detail */}
            <div className="lg:col-span-1">
              {selectedContact ? (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Mesaj Detayı</h2>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">İsim</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedContact.name}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">E-posta</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedContact.email}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Telefon</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedContact.phone}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Konu</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedContact.subject}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Mesaj</label>
                      <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tarih</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(selectedContact.createdAt)}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                      <div className="space-y-2">
                        {['new', 'read', 'responded', 'closed'].map((status) => (
                          <button
                            key={status}
                            onClick={() => updateContactStatus(selectedContact.id, status)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              selectedContact.status === status
                                ? 'bg-blue-100 text-blue-800 border-blue-200'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {status === 'new' && 'Yeni'}
                            {status === 'read' && 'Okundu'}
                            {status === 'responded' && 'Yanıtlandı'}
                            {status === 'closed' && 'Kapatıldı'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow-md rounded-lg p-6">
                  <div className="text-center text-gray-500">
                    <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p>Detaylarını görmek için bir mesaj seçin</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
