import dotenv from "dotenv";
import Category from "../models/Category.js";
import MenuItem from "../models/MenuItem.js";
import connectDB from "../config/db.js";
import type mongoose from "mongoose";

dotenv.config();

// All image URLs use Wikimedia Commons Special:FilePath redirects.
// These are freely licensed (CC BY-SA) and resolve to upload.wikimedia.org.

const indianCategories = [
  {
    "name": "Starters",
    "slug": "starters",
    "image": {
      "url": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782886827/restaurant_menu/p6xzitqt57ywiabnpy4s.jpg",
      "public_id": "starters_img"
    },
    "sortOrder": 1
  },
  {
    "name": "Main Course",
    "slug": "main-course",
    "image": {
      "url": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782887208/restaurant_menu/ay6sxpjuku3wvmsei6pp.jpg",
      "public_id": "main-course_img"
    },
    "sortOrder": 2
  },
  {
    "name": "Breads",
    "slug": "breads",
    "image": {
      "url": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782886838/restaurant_menu/xfxn2hgdilwpkd5slrya.jpg",
      "public_id": "breads_img"
    },
    "sortOrder": 3
  },
  {
    "name": "Desserts",
    "slug": "desserts",
    "image": {
      "url": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782886871/restaurant_menu/gyfsoppw1ttwnxmdrprj.jpg",
      "public_id": "desserts_img"
    },
    "sortOrder": 4
  },
  {
    "name": "Beverages",
    "slug": "beverages",
    "image": {
      "url": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782886913/restaurant_menu/zysiim7razzybl6gsuke.jpg",
      "public_id": "beverages_img"
    },
    "sortOrder": 5
  }
];

const indianMenuItems = [
    {
    "name": "Paneer Tikka",
    "description": "Cubes of paneer marinated in spices and grilled in a tandoor.",
    "price": 180,
    "isVeg": true,
    "isTrending": true,
    "rating": 4.5,
    "available": true,
    "categorySlug": "starters",
    "image": {
      "url": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782887062/restaurant_menu/ejo5jagvenr771fo7d7b.jpg",
      "public_id": "paneer-tikka_img"
    }
  },
  {
    "name": "Chicken Tikka",
    "description": "Boneless chicken pieces marinated in yogurt and spices, grilled perfectly.",
    "price": 220,
    "isVeg": false,
    "isTrending": true,
    "rating": 4.6,
    "available": true,
    "categorySlug": "starters",
    "image": {
      "url": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782887066/restaurant_menu/eqaw11djf1ojntd9ip4d.jpg",
      "public_id": "chicken-tikka_img"
    }
  },
  {
    "name": "Vegetable Samosa",
    "description": "Crispy pastry filled with spiced potatoes and peas.",
    "price": 60,
    "isVeg": true,
    "isTrending": false,
    "rating": 4.2,
    "available": true,
    "categorySlug": "starters",
    "image": {
      "url": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782887117/restaurant_menu/qat05rhc3du1fonpcuh4.jpg",
      "public_id": "samosa_img"
    }
  },
  {
    "name": "Aloo Tikki",
    "description": "Spiced potato patties served with chutney.",
    "price": 100,
    "isVeg": true,
    "isTrending": false,
    "rating": 4.3,
    "available": true,
    "categorySlug": "starters",
    "image": {
      "url": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782887146/restaurant_menu/tirvmp41b0xp4kzpw05n.jpg",
      "public_id": "aloo-tikki_img"
    }
  },
    // Main Course
    {
    "name": "Butter Chicken",
    "description": "Tender chicken cooked in a rich, creamy tomato gravy.",
    "price": 350,
    "isVeg": false,
    "isTrending": true,
    "rating": 4.8,
    "available": true,
    "categorySlug": "main-course",
    "image": {
      "url": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782887208/restaurant_menu/ay6sxpjuku3wvmsei6pp.jpg",
      "public_id": "butter-chicken_img"
    }
  },
  {
    "name": "Palak Paneer",
    "description": "Paneer cubes in a smooth, spiced spinach puree.",
    "price": 280,
    "isVeg": true,
    "isTrending": true,
    "rating": 4.6,
    "available": true,
    "categorySlug": "main-course",
    "image": {
      "url": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782887250/restaurant_menu/w5j13mqddq36pcljuogb.jpg",
      "public_id": "palak-paneer_img"
    }
  },
      {
    "name": "Chicken Biryani",
    "description": "Aromatic basmati rice cooked with spiced chicken.",
    "price": 320,
    "isVeg": false,
    "isTrending": true,
    "rating": 4.9,
    "available": true,
    "categorySlug": "main-course",
    "image": {
      "url": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782887318/restaurant_menu/l0n0vsyd3aup9wref6qq.jpg",
      "public_id": "chicken-biryani_img"
    }
  },
      {
    "name": "Paneer Butter Masala",
    "description": "Paneer cooked in a rich and creamy tomato-onion gravy.",
    "price": 290,
    "isVeg": true,
    "isTrending": true,
    "rating": 4.6,
    "available": true,
    "categorySlug": "main-course",
    "image": {
      "url": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782887343/restaurant_menu/agl1d1zxb1adzhmphds7.jpg",
      "public_id": "pbm_img"
    }
  },
  {
    "name": "Fish Curry",
    "description": "Fish simmered in a tangy and spicy coconut gravy.",
    "price": 380,
    "isVeg": false,
    "isTrending": false,
    "rating": 4.5,
    "available": true,
    "categorySlug": "main-course",
    "image": {
      "url": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782890053/restaurant_menu/pefwsy08vsqpx2zuiyvh.jpg",
      "public_id": "fish-curry_img"
    }
},
    {
    "name": "Kadhai Paneer",
    "description": "Paneer cubes cooked with bell peppers, tomatoes, and freshly ground spices.",
    "price": 270,
    "isVeg": true,
    "isTrending": false,
    "rating": 4.5,
    "available": true,
    "categorySlug": "main-course",
    "image": {
      "url": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782890057/restaurant_menu/cc7ubac8khohsdiitqij.jpg",
      "public_id": "kadhai-paneer_img"
    }
  },

    // Breads
    {
    "name": "Butter Naan",
    "description": "Soft Indian bread baked in a tandoor and brushed with butter.",
    "price": 50,
    "isVeg": true,
    "isTrending": true,
    "rating": 4.8,
    "available": true,
    "categorySlug": "breads",
    "image": {
      "url": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782887349/restaurant_menu/xfzi0bzmxd09onbtt8vu.jpg",
      "public_id": "butter-naan_img"
    }
  },
{
    "name": "Garlic Naan",
    "description": "Naan bread topped with minced garlic and cilantro.",
    "price": 70,
    "isVeg": true,
    "isTrending": true,
    "rating": 4.7,
    "available": true,
    "categorySlug": "breads",
    "image": {
      "url": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782890105/restaurant_menu/pbc0kknn80a1vtqkzzdp.jpg",
      "public_id": "garlic-naan_img"
    }
  },
    // Desserts
      {
    "name": "Gulab Jamun",
    "description": "Deep-fried milk dumplings soaked in sugar syrup.",
    "price": 80,
    "isVeg": true,
    "isTrending": true,
    "rating": 4.9,
    "available": true,
    "categorySlug": "desserts",
    "image": {
      "url": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782890140/restaurant_menu/amevgp43grcdmla0bllx.jpg",
      "public_id": "gulab-jamun_img"
    }
  },
  {
    "name": "Rasmalai",
    "description": "Soft paneer discs soaked in thickened, sweetened milk with cardamom.",
    "price": 120,
    "isVeg": true,
    "isTrending": true,
    "rating": 4.8,
    "available": true,
    "categorySlug": "desserts",
    "image": {
      "url": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782890172/restaurant_menu/czzx5pzyu8mbqewleqpq.jpg",
      "public_id": "rasmalai_img"
    }
  },
    {
    "name": "Kulfi",
    "description": "Traditional Indian dense ice cream.",
    "price": 90,
    "isVeg": true,
    "isTrending": false,
    "rating": 4.6,
    "available": true,
    "categorySlug": "desserts",
    "image": {
      "url": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782890204/restaurant_menu/csabl23djxjj8moz0xvb.jpg",
      "public_id": "kulfi_img"
    }
  },

    // Beverages
    {
    "name": "Mango Lassi",
    "description": "A refreshing blend of yogurt, mango pulp, and sugar.",
    "price": 110,
    "isVeg": true,
    "isTrending": true,
    "rating": 4.8,
    "available": true,
    "categorySlug": "beverages",
    "image": {
      "url": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782890234/restaurant_menu/sgmtnl7eqzvjdrfxzvgt.jpg",
      "public_id": "mango-lassi_img"
    }
  },
    {
    "name": "Masala Chai",
    "description": "Indian tea brewed with milk and aromatic spices.",
    "price": 40,
    "isVeg": true,
    "isTrending": true,
    "rating": 4.9,
    "available": true,
    "categorySlug": "beverages",
    "image": {
      "url": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782890266/restaurant_menu/j0cuycg8yevqgrdci64l.jpg",
      "public_id": "masala-chai_img"
    }
  },
{
    "name": "Jal Jeera",
    "description": "A tangy, spicy cumin-flavored cooling drink.",
    "price": 60,
    "isVeg": true,
    "isTrending": false,
    "rating": 4.3,
    "available": true,
    "categorySlug": "beverages",
    "image": {
      "url": "https://res.cloudinary.com/jjfdbcxj/image/upload/v1782890272/restaurant_menu/hrpluml04bt0mzkpcix8.jpg",
      "public_id": "jal-jeera_img"
    }
  }
];


const seedData = async () => {
    try {
        await connectDB();
        console.log("Connected to MongoDB");

        if (process.env.NODE_ENV === "production" && process.env.ALLOW_PROD_SEED !== "true") {
            throw new Error("Refusing destructive seed in production without ALLOW_PROD_SEED=true");
        }

        await Category.deleteMany({});
        await MenuItem.deleteMany({});
        console.log("Cleared existing categories and menu items.");

        const createdCategories = await Category.insertMany(indianCategories);
        console.log(`Inserted ${createdCategories.length} categories.`);

        const categoryMap = createdCategories.reduce<Record<string, mongoose.Types.ObjectId>>((acc, cat) => {
            acc[cat.slug] = cat._id;
            return acc;
        }, {});

        const menuItemsToInsert = indianMenuItems.map(item => {
            const { categorySlug, ...rest } = item;
            const categoryId = categoryMap[categorySlug];
            if (!categoryId) {
                throw new Error(`Unknown categorySlug "${categorySlug}" in seed data`);
            }
            return {
                ...rest,
                category: categoryId,
            };
        });

        const createdMenuItems = await MenuItem.insertMany(menuItemsToInsert);
        console.log(`Inserted ${createdMenuItems.length} menu items.`);

        console.log("Successfully seeded database!");
        process.exit(0);

    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedData();