import dotenv from "dotenv";
import Category from "../models/Category.js";
import MenuItem from "../models/MenuItem.js";
import connectDB from "../config/db.js";
import type mongoose from "mongoose";

dotenv.config();

const indianCategories = [
    {
        name: "Starters",
        slug: "starters",
        image: { url: "https://example.com/starters.jpg", public_id: "starters_img" },
        sortOrder: 1,
    },
    {
        name: "Main Course",
        slug: "main-course",
        image: { url: "https://example.com/main.jpg", public_id: "main_img" },
        sortOrder: 2,
    },
    {
        name: "Breads",
        slug: "breads",
        image: { url: "https://example.com/breads.jpg", public_id: "breads_img" },
        sortOrder: 3,
    },
    {
        name: "Desserts",
        slug: "desserts",
        image: { url: "https://example.com/desserts.jpg", public_id: "desserts_img" },
        sortOrder: 4,
    },
    {
        name: "Beverages",
        slug: "beverages",
        image: { url: "https://example.com/beverages.jpg", public_id: "beverages_img" },
        sortOrder: 5,
    },
];

const indianMenuItems = [
    // Starters
    {
        name: "Paneer Tikka",
        description: "Cubes of paneer marinated in spices and grilled in a tandoor.",
        price: 180,
        isVeg: true,
        isTrending: true,
        rating: 4.5,
        available: true,
        categorySlug: "starters",
        image: { url: "https://example.com/paneer-tikka.jpg", public_id: "paneer-tikka_img" }
    },
    {
        name: "Chicken Tikka",
        description: "Boneless chicken pieces marinated in yogurt and spices, grilled perfectly.",
        price: 220,
        isVeg: false,
        isTrending: true,
        rating: 4.6,
        available: true,
        categorySlug: "starters",
        image: { url: "https://example.com/chicken-tikka.jpg", public_id: "chicken-tikka_img" }
    },
    {
        name: "Vegetable Samosa",
        description: "Crispy pastry filled with spiced potatoes and peas.",
        price: 60,
        isVeg: true,
        isTrending: false,
        rating: 4.2,
        available: true,
        categorySlug: "starters",
        image: { url: "https://example.com/samosa.jpg", public_id: "samosa_img" }
    },
    {
        name: "Aloo Tikki",
        description: "Spiced potato patties served with chutney.",
        price: 100,
        isVeg: true,
        isTrending: false,
        rating: 4.3,
        available: true,
        categorySlug: "starters",
        image: { url: "https://example.com/aloo-tikki.jpg", public_id: "aloo-tikki_img" }
    },
    {
        name: "Fish Amritsari",
        description: "Deep-fried fish fillets coated in a spiced gram flour batter.",
        price: 250,
        isVeg: false,
        isTrending: false,
        rating: 4.4,
        available: true,
        categorySlug: "starters",
        image: { url: "https://example.com/fish-amritsari.jpg", public_id: "fish-amritsari_img" }
    },
    {
        name: "Hara Bhara Kabab",
        description: "Patties made from spinach, peas, and potatoes.",
        price: 150,
        isVeg: true,
        isTrending: false,
        rating: 4.1,
        available: true,
        categorySlug: "starters",
        image: { url: "https://example.com/hara-bhara.jpg", public_id: "hara-bhara_img" }
    },

    // Main Course
    {
        name: "Butter Chicken",
        description: "Tender chicken cooked in a rich, creamy tomato gravy.",
        price: 350,
        isVeg: false,
        isTrending: true,
        rating: 4.8,
        available: true,
        categorySlug: "main-course",
        image: { url: "https://example.com/butter-chicken.jpg", public_id: "butter-chicken_img" }
    },
    {
        name: "Palak Paneer",
        description: "Paneer cubes in a smooth, spiced spinach puree.",
        price: 280,
        isVeg: true,
        isTrending: true,
        rating: 4.6,
        available: true,
        categorySlug: "main-course",
        image: { url: "https://example.com/palak-paneer.jpg", public_id: "palak-paneer_img" }
    },
    {
        name: "Dal Makhani",
        description: "Slow-cooked black lentils and kidney beans with butter and cream.",
        price: 220,
        isVeg: true,
        isTrending: true,
        rating: 4.7,
        available: true,
        categorySlug: "main-course",
        image: { url: "https://example.com/dal-makhani.jpg", public_id: "dal-makhani_img" }
    },
    {
        name: "Chicken Biryani",
        description: "Aromatic basmati rice cooked with spiced chicken.",
        price: 320,
        isVeg: false,
        isTrending: true,
        rating: 4.9,
        available: true,
        categorySlug: "main-course",
        image: { url: "https://example.com/chicken-biryani.jpg", public_id: "chicken-biryani_img" }
    },
    {
        name: "Mutton Rogan Josh",
        description: "A classic Kashmiri dish of tender lamb cooked in a rich, red sauce.",
        price: 450,
        isVeg: false,
        isTrending: false,
        rating: 4.7,
        available: true,
        categorySlug: "main-course",
        image: { url: "https://example.com/rogan-josh.jpg", public_id: "rogan-josh_img" }
    },
    {
        name: "Paneer Butter Masala",
        description: "Paneer cooked in a rich and creamy tomato-onion gravy.",
        price: 290,
        isVeg: true,
        isTrending: true,
        rating: 4.6,
        available: true,
        categorySlug: "main-course",
        image: { url: "https://example.com/paneer-butter-masala.jpg", public_id: "pbm_img" }
    },
    {
        name: "Chana Masala",
        description: "Spicy and tangy chickpea curry.",
        price: 180,
        isVeg: true,
        isTrending: false,
        rating: 4.3,
        available: true,
        categorySlug: "main-course",
        image: { url: "https://example.com/chana-masala.jpg", public_id: "chana-masala_img" }
    },
    {
        name: "Vegetable Biryani",
        description: "Flavorful rice dish with assorted vegetables and spices.",
        price: 250,
        isVeg: true,
        isTrending: false,
        rating: 4.4,
        available: true,
        categorySlug: "main-course",
        image: { url: "https://example.com/veg-biryani.jpg", public_id: "veg-biryani_img" }
    },
    {
        name: "Fish Curry",
        description: "Fish simmered in a tangy and spicy coconut gravy.",
        price: 380,
        isVeg: false,
        isTrending: false,
        rating: 4.5,
        available: true,
        categorySlug: "main-course",
        image: { url: "https://example.com/fish-curry.jpg", public_id: "fish-curry_img" }
    },
    {
        name: "Kadhai Paneer",
        description: "Paneer cubes cooked with bell peppers, tomatoes, and freshly ground spices.",
        price: 270,
        isVeg: true,
        isTrending: false,
        rating: 4.5,
        available: true,
        categorySlug: "main-course",
        image: { url: "https://example.com/kadhai-paneer.jpg", public_id: "kadhai-paneer_img" }
    },

    // Breads
    {
        name: "Butter Naan",
        description: "Soft Indian bread baked in a tandoor and brushed with butter.",
        price: 50,
        isVeg: true,
        isTrending: true,
        rating: 4.8,
        available: true,
        categorySlug: "breads",
        image: { url: "https://example.com/butter-naan.jpg", public_id: "butter-naan_img" }
    },
    {
        name: "Garlic Naan",
        description: "Naan bread topped with minced garlic and cilantro.",
        price: 70,
        isVeg: true,
        isTrending: true,
        rating: 4.7,
        available: true,
        categorySlug: "breads",
        image: { url: "https://example.com/garlic-naan.jpg", public_id: "garlic-naan_img" }
    },
    {
        name: "Tandoori Roti",
        description: "Whole wheat bread baked in a clay oven.",
        price: 30,
        isVeg: true,
        isTrending: false,
        rating: 4.2,
        available: true,
        categorySlug: "breads",
        image: { url: "https://example.com/tandoori-roti.jpg", public_id: "tandoori-roti_img" }
    },
    {
        name: "Lachha Paratha",
        description: "Multi-layered flaky whole wheat bread.",
        price: 60,
        isVeg: true,
        isTrending: false,
        rating: 4.5,
        available: true,
        categorySlug: "breads",
        image: { url: "https://example.com/lachha-paratha.jpg", public_id: "lachha-paratha_img" }
    },
    {
        name: "Cheese Naan",
        description: "Naan stuffed with gooey melted cheese.",
        price: 100,
        isVeg: true,
        isTrending: true,
        rating: 4.6,
        available: true,
        categorySlug: "breads",
        image: { url: "https://example.com/cheese-naan.jpg", public_id: "cheese-naan_img" }
    },

    // Desserts
    {
        name: "Gulab Jamun",
        description: "Deep-fried milk dumplings soaked in sugar syrup.",
        price: 80,
        isVeg: true,
        isTrending: true,
        rating: 4.9,
        available: true,
        categorySlug: "desserts",
        image: { url: "https://example.com/gulab-jamun.jpg", public_id: "gulab-jamun_img" }
    },
    {
        name: "Rasmalai",
        description: "Soft paneer discs soaked in thickened, sweetened milk with cardamom.",
        price: 120,
        isVeg: true,
        isTrending: true,
        rating: 4.8,
        available: true,
        categorySlug: "desserts",
        image: { url: "https://example.com/rasmalai.jpg", public_id: "rasmalai_img" }
    },
    {
        name: "Gajar Ka Halwa",
        description: "A rich, sweet dessert made from grated carrots, milk, and nuts.",
        price: 150,
        isVeg: true,
        isTrending: false,
        rating: 4.7,
        available: true,
        categorySlug: "desserts",
        image: { url: "https://example.com/gajar-halwa.jpg", public_id: "gajar-halwa_img" }
    },
    {
        name: "Kheer",
        description: "Traditional Indian rice pudding flavored with cardamom and saffron.",
        price: 100,
        isVeg: true,
        isTrending: false,
        rating: 4.5,
        available: true,
        categorySlug: "desserts",
        image: { url: "https://example.com/kheer.jpg", public_id: "kheer_img" }
    },
    {
        name: "Kulfi",
        description: "Traditional Indian dense ice cream.",
        price: 90,
        isVeg: true,
        isTrending: false,
        rating: 4.6,
        available: true,
        categorySlug: "desserts",
        image: { url: "https://example.com/kulfi.jpg", public_id: "kulfi_img" }
    },

    // Beverages
    {
        name: "Mango Lassi",
        description: "A refreshing blend of yogurt, mango pulp, and sugar.",
        price: 110,
        isVeg: true,
        isTrending: true,
        rating: 4.8,
        available: true,
        categorySlug: "beverages",
        image: { url: "https://example.com/mango-lassi.jpg", public_id: "mango-lassi_img" }
    },
    {
        name: "Masala Chai",
        description: "Indian tea brewed with milk and aromatic spices.",
        price: 40,
        isVeg: true,
        isTrending: true,
        rating: 4.9,
        available: true,
        categorySlug: "beverages",
        image: { url: "https://example.com/masala-chai.jpg", public_id: "masala-chai_img" }
    },
    {
        name: "Sweet Lassi",
        description: "Classic sweetened yogurt drink.",
        price: 90,
        isVeg: true,
        isTrending: false,
        rating: 4.5,
        available: true,
        categorySlug: "beverages",
        image: { url: "https://example.com/sweet-lassi.jpg", public_id: "sweet-lassi_img" }
    },
    {
        name: "Jal Jeera",
        description: "A tangy, spicy cumin-flavored cooling drink.",
        price: 60,
        isVeg: true,
        isTrending: false,
        rating: 4.3,
        available: true,
        categorySlug: "beverages",
        image: { url: "https://example.com/jal-jeera.jpg", public_id: "jal-jeera_img" }
    },
    {
        name: "Fresh Lime Soda",
        description: "Refreshing soda with fresh lime juice, sweet or salted.",
        price: 70,
        isVeg: true,
        isTrending: false,
        rating: 4.4,
        available: true,
        categorySlug: "beverages",
        image: { url: "https://example.com/lime-soda.jpg", public_id: "lime-soda_img" }
    },
];


const seedData = async () => {
    try {
        await connectDB();
        console.log("Connected to MongoDB");

        // Clear existing data for these models
        if (process.env.NODE_ENV === "production" && process.env.ALLOW_PROD_SEED !== "true") {
            throw new Error("Refusing destructive seed in production without ALLOW_PROD_SEED=true");
        }

        await Category.deleteMany({});
        await MenuItem.deleteMany({});
        console.log("Cleared existing categories and menu items.");

        // Insert categories
        const createdCategories = await Category.insertMany(indianCategories);
        console.log(`Inserted ${createdCategories.length} categories.`);

        // Map category slugs to ObjectIds
        const categoryMap = createdCategories.reduce<Record<string, mongoose.Types.ObjectId>>((acc, cat) => {
            acc[cat.slug] = cat._id;
            return acc;
        }, {});

        // Prepare and insert menu items
        const menuItemsToInsert = indianMenuItems.map(item => {
            const { categorySlug, ...rest } = item;
            const categoryId = categoryMap[categorySlug];
            if (!categoryId) {
                throw new Error(`Unknown categorySlug "${categorySlug}" in seed data`);
            }
            return {
                ...rest,
                category: categoryId, // Resolve object reference
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
