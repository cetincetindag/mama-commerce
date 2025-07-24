import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Product data extracted from folder structure and image names
const productsData = [
  {
    name: "Süni Deri Kapak Telefon Çantası",
    description: "Süni deri kapak ve süni deri askı ile üretilmiş telefon çantası. Kompakt ve şık tasarım.",
    materialInfo: "Süni deri kapak, süni deri askı",
    type: "çanta",
    width: 17,
    height: 18,
    price: 299.99,
    folder: "c1",
    images: [
      "17x18-suniderikapak-sunideriaski-telefoncantasi.jpg",
      "IMG_20250419_172040.jpg",
      "IMG_20250419_172043.jpg",
      "IMG_20250419_172046.jpg",
      "IMG_20250419_172050.jpg"
    ]
  },
  {
    name: "Süni Deri Kapak Kağıt İp Çanta",
    description: "Süni deri kapak, süni deri askı ve kağıt ip detayları ile üretilmiş çanta. İç cepli astar ile pratik kullanım.",
    materialInfo: "Süni deri kapak, süni deri askı, kağıt ip, iç cepli astar",
    type: "çanta",
    width: 25,
    height: 22,
    price: 349.99,
    folder: "c2",
    images: [
      "25x22-suniderikapak-sunideriaski-kagitip-iccepliastar.jpg",
      "IMG_20250419_172216.jpg"
    ]
  },
  {
    name: "Oval Bürs Şimli Kağıt İç Astar Çanta",
    description: "Oval bürs detayı, şimli kağıt ve iç astar ile üretilmiş modern çanta.",
    materialInfo: "Oval bürs, şimli kağıt, iç astar",
    type: "çanta",
    width: 26,
    height: 15,
    price: 279.99,
    folder: "c3",
    images: [
      "26x15-ovalburs-simlikagit-icastar.jpg",
      "IMG_20250419_171840.jpg",
      "IMG_20250419_174903.jpg"
    ]
  },
  {
    name: "Bürslu Cepli Astar Şimli Kağıt İp Çanta",
    description: "22cm bürslu detay, cepli astar ve şimli kağıt ip ile üretilmiş fonksiyonel çanta.",
    materialInfo: "22cm bürs, cepli astar, şimli kağıt ip",
    type: "çanta",
    width: 32,
    height: 20,
    price: 399.99,
    folder: "c4",
    images: [
      "32x20-22cmburslu-cepliastar-simlikagitip.jpg",
      "IMG_20250419_171245.jpg",
      "IMG_20250419_171258.jpg",
      "IMG_20250419_171354.jpg",
      "IMG_20250419_171416.jpg",
      "IMG_20250419_171451.jpg",
      "IMG_20250419_171615.jpg",
      "IMG_20250419_171844.jpg",
      "IMG_20250419_174945.jpg"
    ]
  },
  {
    name: "Süni Deri Sap İç Cepli Kağıt İp Çanta",
    description: "Süni deri sap, iç cepli astar ve kağıt ip detayları ile üretilmiş pratik çanta.",
    materialInfo: "Süni deri sap, iç cepli astar, kağıt ip",
    type: "çanta",
    width: 33,
    height: 36,
    price: 429.99,
    folder: "c5",
    images: [
      "33x36-suniderisap-iccepliastar-kagitip.jpg",
      "IMG_20250419_170725.jpg",
      "IMG_20250419_170734.jpg",
      "IMG_20250419_174647.jpg",
      "IMG_20250419_174649.jpg"
    ]
  },
  {
    name: "Cepli Astar Kağıt İp Çıtçıt Çanta",
    description: "Cepli astar, kağıt ip ve çıtçıt kapama sistemi ile üretilmiş kullanışlı çanta.",
    materialInfo: "Cepli astar, kağıt ip, çıtçıt",
    type: "çanta",
    width: 40,
    height: 33,
    price: 459.99,
    folder: "c6",
    images: [
      "40x33-cepliastar-kagitip-citcit.jpg",
      "IMG_20250419_170823.jpg",
      "IMG_20250419_170907.jpg",
      "IMG_20250419_170910.jpg"
    ]
  },
  {
    name: "Süni Deri Kapak Askı Cepli Astar Çanta",
    description: "Süni deri kapak, süni deri askı ve cepli astar ile üretilmiş şık çanta.",
    materialInfo: "Süni deri kapak, süni deri askı, cepli astar",
    type: "çanta",
    width: 34,
    height: 21,
    price: 379.99,
    folder: "c7",
    images: [
      "34x21-suniderikapak-sunideraski-cepliastar.jpg",
      "IMG_20250419_172623.jpg",
      "IMG_20250419_172634.jpg",
      "IMG_20250419_172651.jpg",
      "IMG_20250419_175028.jpg",
      "IMG_20250419_175032.jpg"
    ]
  },
  {
    name: "Metalik Renk Püsküllü Kağıt İp Taşlı Sap Çanta",
    description: "Metalik renk püsküllü detay, kağıt ip, taşlı sap ve cepli astar ile üretilmiş özel tasarım çanta.",
    materialInfo: "Metalik renk püskül, kağıt ip, taşlı sap, cepli astar",
    type: "çanta",
    width: 27,
    height: 18,
    price: 449.99,
    folder: "c8",
    images: [
      "27x18-metalikrenkpuskullukagitip-taslisap-cepliastar.jpg",
      "IMG_20250419_172324.jpg"
    ]
  },
  {
    name: "Çıtçıt Astar Askı Takılabilir Clutch",
    description: "Çıtçıt kapama, astar ve askı takılabilir özelliği ile üretilmiş çok amaçlı clutch çanta.",
    materialInfo: "Çıtçıt, astar, askı takılabilir",
    type: "çanta",
    width: 27,
    height: 21,
    price: 319.99,
    folder: "c9",
    images: [
      "27x21-citcit-astar-askitakilabilir-clutch.jpg",
      "IMG_20250419_173532.jpg",
      "IMG_20250419_173720.jpg"
    ]
  },
  {
    name: "Süni Deri Taban Sap İç Astar Çıtçıt Çanta",
    description: "Süni deri taban, süni deri sap, iç astar ve çıtçıt kapama sistemi ile üretilmiş dayanıklı çanta.",
    materialInfo: "Süni deri taban, süni deri sap, iç astar, çıtçıt",
    type: "çanta",
    width: 40,
    height: 36,
    price: 499.99,
    folder: "c10",
    images: [
      "40x36-sunideritaban-suniderisap-icastar-citcit.jpg",
      "IMG_20250419_174838.jpg",
      "IMG_20250419_174842.jpg"
    ]
  },
  {
    name: "Astarlı Fermuarlı Çanta",
    description: "Astarlı iç yapı ve fermuarlı kapama sistemi ile üretilmiş pratik çanta.",
    materialInfo: "Astar, fermuar",
    type: "çanta",
    width: 30,
    height: 23,
    price: 329.99,
    folder: "c11",
    images: [
      "30x23-astarli-fermuarli.jpg",
      "30x23-.jpg"
    ]
  },
  {
    name: "Süpra İp Metalik İp Kapak Cepli Astar Çanta",
    description: "Süpra ip, metalik ip kapak ve cepli astar ile üretilmiş modern çanta.",
    materialInfo: "Süpra ip, metalik ip kapak, cepli astar",
    type: "çanta",
    width: 33,
    height: 22,
    price: 419.99,
    folder: "c12",
    images: [
      "33x22-supraip-metalikipkapak-cepliastar-.jpg",
      "IMG_20250419_172456.jpg",
      "IMG_20250419_174809.jpg"
    ]
  },
  {
    name: "İç Astar Cepli Çıtçıt Çanta",
    description: "İç astar, cepli yapı ve çıtçıt kapama sistemi ile üretilmiş fonksiyonel çanta.",
    materialInfo: "İç astar, cep, çıtçıt",
    type: "çanta",
    width: 41,
    height: 31,
    price: 439.99,
    folder: "c13",
    images: [
      "41x31-icastarcepli-citcit.jpg"
    ]
  },
  {
    name: "Süni Deri Taban Askı Cepli Astar Kağıt İp Çanta",
    description: "Süni deri taban, süni deri askı, cepli astar ve kağıt ip detayları ile üretilmiş premium çanta.",
    materialInfo: "Süni deri taban, süni deri askı, cepli astar, kağıt ip",
    type: "çanta",
    width: 41,
    height: 36,
    price: 519.99,
    folder: "c14",
    images: [
      "41x36-sunideritaban-sunideriaski-cepliastar-kagitip.jpg"
    ]
  },
  {
    name: "Duka Astar Cepli Çıtçıtlı Kağıt İp Çanta",
    description: "Duka astar, cepli yapı, çıtçıt kapama ve kağıt ip detayları ile üretilmiş şık çanta.",
    materialInfo: "Duka astar, cep, çıtçıt, kağıt ip",
    type: "çanta",
    width: 42,
    height: 30,
    price: 469.99,
    folder: "c15",
    images: [
      "42x30-dukastarcepli-citcitli-kagitip.jpg",
      "IMG_20250419_170103.jpg",
      "IMG_20250419_170106.jpg"
    ]
  },
  {
    name: "Kağıt İp Süni Deri Leopar Astar Çıtçıtlı Çanta",
    description: "Kağıt ip, süni deri askı ve taban, leopar astar ve çıtçıt kapama ile üretilmiş özel tasarım çanta.",
    materialInfo: "Kağıt ip, süni deri askı, süni deri taban, leopar astar, çıtçıt",
    type: "çanta",
    width: 42,
    height: 30,
    price: 549.99,
    folder: "c16",
    images: [
      "42x30-kagitip-sunideriaski-sunideritaban-leoparastar-citcitli.jpg",
      "IMG_20250419_174727.jpg"
    ]
  },
  {
    name: "Kağıt İp Duka Astar Çıtçıt Cepli Astar Çanta",
    description: "Kağıt ip, duka astar, çıtçıt kapama ve cepli astar ile üretilmiş büyük boy çanta.",
    materialInfo: "Kağıt ip, duka astar, çıtçıt, cepli astar",
    type: "çanta",
    width: 50,
    height: 40,
    price: 589.99,
    folder: "c17",
    images: [
      "50x40-kagitip-dukastar-citcit-cepliastar.jpg",
      "IMG_20250419_165917.jpg",
      "IMG_20250419_165935.jpg",
      "IMG_20250419_170004.jpg"
    ]
  },
  {
    name: "El Yapımı Şapka",
    description: "El yapımı özel tasarım şapka. Çeşitli renkler ve desenlerde mevcuttur.",
    materialInfo: "El yapımı örgü",
    type: "şapka",
    width: null,
    height: null,
    price: 199.99,
    folder: "sapka1",
    images: [
      "IMG_20250419_173024.jpg",
      "IMG_20250419_173058.jpg"
    ]
  }
];

async function seedProducts() {
  try {
    console.log('🌱 Seeding products...');

    // Check if products already exist
    const existingProducts = await prisma.product.findMany();
    if (existingProducts.length > 0) {
      console.log(`⚠️ Found ${existingProducts.length} existing products. Skipping seed to avoid duplicates.`);
      console.log('If you want to reseed, please clear the Product table first.');
      return;
    }

    let seededCount = 0;

    for (const productData of productsData) {
      // Generate image URLs
      const imageUrls = productData.images.map(img => 
        `/uploads/products/${productData.folder}/${img}`
      ).join(',');

      const product = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          materialInfo: productData.materialInfo,
          price: productData.price,
          salePrice: null, // No sale prices initially
          images: imageUrls,
          type: productData.type,
          width: productData.width,
          height: productData.height,
        },
      });

      console.log(`✅ Created product: ${product.name} (${product.id})`);
      seededCount++;
    }

    console.log(`🎉 Successfully seeded ${seededCount} products!`);
    
    // Print summary
    const bagCount = productsData.filter(p => p.type === 'çanta').length;
    const hatCount = productsData.filter(p => p.type === 'şapka').length;
    console.log(`📊 Summary: ${bagCount} bags, ${hatCount} hat(s)`);

  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedProducts()
  .then(() => {
    console.log('✨ Product seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Product seeding failed:', error);
    process.exit(1);
  });

export { seedProducts };
