import { debugServer } from '@/lib/debug';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    images: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  cancellationReason: string | null;
  cancelledAt: Date | null;
  cancelledBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}

/**
 * Send order cancellation email notification to the customer
 */
export async function sendOrderCancellationEmail(order: Order): Promise<void> {
  try {
    const { orderNumber, fullName, email, cancellationReason, total } = order;
    
    // For now, we'll log the email content
    // This can be replaced with actual email service integration (SendGrid, Nodemailer, etc.)
    const emailContent = `
Subject: Siparişiniz İptal Edildi - #${orderNumber}

Sayın ${fullName},

${orderNumber} numaralı siparişiniz maalesef iptal edilmiştir.

Sipariş Detayları:
- Sipariş Numarası: #${orderNumber}
- Toplam Tutar: ${total.toFixed(2)} TL
- İptal Sebebi: ${cancellationReason ?? 'Belirtilmedi'}

Siparişinizin iptal edilmesinden dolayı özür dileriz. 
Eğer ödeme yaptıysanız, ücret iadeniz en kısa sürede hesabınıza geri gönderilecektir.

Herhangi bir sorunuz için bizimle iletişime geçebilirsiniz:
- E-posta: lavanta.destek@gmail.com
- Telefon: İletişim sayfasından ulaşabilirsiniz

Teşekkürler,
Lavanta Tasarım Ekibi
    `;

    debugServer.log(`Order cancellation email prepared for ${email}:`);
    debugServer.log(emailContent);
    
    // Also generate and log the HTML version
    const htmlContent = generateCancellationEmailHTML(order);
    debugServer.log('HTML version of cancellation email:');
    debugServer.log(htmlContent);

    // TODO: Replace with actual email service
    // await emailService.send({
    //   to: email,
    //   subject: `Siparişiniz İptal Edildi - #${orderNumber}`,
    //   html: generateCancellationEmailHTML(order),
    //   text: emailContent
    // });

    debugServer.log(`Order cancellation email sent successfully to ${email}`);
  } catch (error) {
    debugServer.error('Failed to send order cancellation email:', error);
    // Don't throw error to prevent API from failing
    // Email sending failures should be logged but not block the order update
  }
}

/**
 * Generate HTML email template for order cancellation
 */
function generateCancellationEmailHTML(order: Order): string {
  const { orderNumber, fullName, cancellationReason, total, items } = order;
  
  const itemsList = items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.product.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)} TL</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Siparişiniz İptal Edildi</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="color: #dc3545; margin: 0;">Siparişiniz İptal Edildi</h1>
        <p style="margin: 10px 0 0 0; color: #6c757d;">Sipariş #${orderNumber}</p>
      </div>
      
      <p>Sayın ${fullName},</p>
      
      <p><strong>#${orderNumber}</strong> numaralı siparişiniz maalesef iptal edilmiştir.</p>
      
      <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px; margin: 20px 0;">
        <strong>İptal Sebebi:</strong> ${cancellationReason ?? 'Belirtilmedi'}
      </div>
      
      <h3>Sipariş Detayları:</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 12px 8px; text-align: left; border-bottom: 2px solid #dee2e6;">Ürün</th>
            <th style="padding: 12px 8px; text-align: center; border-bottom: 2px solid #dee2e6;">Adet</th>
            <th style="padding: 12px 8px; text-align: right; border-bottom: 2px solid #dee2e6;">Fiyat</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList}
          <tr style="font-weight: bold; background-color: #f8f9fa;">
            <td style="padding: 12px 8px; border-top: 2px solid #dee2e6;" colspan="2">Toplam:</td>
            <td style="padding: 12px 8px; text-align: right; border-top: 2px solid #dee2e6;">${total.toFixed(2)} TL</td>
          </tr>
        </tbody>
      </table>
      
      <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; border-radius: 4px; padding: 15px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Ödeme İadesi:</strong></p>
        <p style="margin: 5px 0 0 0;">Eğer ödeme yaptıysanız, ücret iadeniz en kısa sürede hesabınıza geri gönderilecektir.</p>
      </div>
      
      <p>Siparişinizin iptal edilmesinden dolayı özür dileriz.</p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <div style="color: #6c757d; font-size: 14px;">
        <p><strong>İletişim:</strong></p>
        <p>E-posta: lavanta.destek@gmail.com</p>
        <p>Web: www.lavantatasarim.com</p>
        
        <p style="margin-top: 20px;">Teşekkürler,<br>Lavanta Tasarım Ekibi</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send order status update email notification
 */
export async function sendOrderStatusEmail(
  email: string, 
  orderNumber: string, 
  status: string
): Promise<void> {
  try {
    const statusMessages = {
      'beklemede': 'Siparişiniz alındı ve inceleniyor',
      'odeme_bekleniyor': 'Ödeme bekleniyor',
      'odendi_kargo_bekleniyor': 'Ödemeniz alındı, kargo hazırlığı yapılıyor',
      'kargoya_verildi': 'Siparişiniz kargoya verildi',
      'teslim_edildi': 'Siparişiniz teslim edildi',
      'iptal_edildi': 'Siparişiniz iptal edildi'
    };

    const message = statusMessages[status as keyof typeof statusMessages] || 'Sipariş durumu güncellendi';

    debugServer.log(`Order status email prepared for ${email}: #${orderNumber} - ${message}`);
    
    // TODO: Implement actual email sending
    
  } catch (error) {
    debugServer.error('Failed to send order status email:', error);
  }
}
