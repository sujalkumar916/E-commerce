const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");

dotenv.config();

const sampleProducts = [
  {
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium over-ear wireless headphones with active noise cancellation, 30-hour battery life, and high-fidelity sound.",
    price: 4999,
    category: "Electronics",
    stock: 15,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    ratings: 4.8,
    numReviews: 24,
  },
  {
    name: "Classic Running Sneakers",
    description: "Lightweight and breathable athletic sneakers with cushioned sole, ideal for daily running and training.",
    price: 2499,
    category: "Sports",
    stock: 20,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    ratings: 4.5,
    numReviews: 18,
  },
  {
    name: "Smart Fitness Watch",
    description: "Waterproof smartwatch with AMOLED display, heart rate monitor, SPO2 tracking, and 7-day battery life.",
    price: 3299,
    category: "Electronics",
    stock: 8,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    ratings: 4.6,
    numReviews: 32,
  },
  {
    name: "Vintage Minimalist Backpack",
    description: "Durable canvas travel backpack with padded laptop sleeve, water-resistant coating, and ergonomic straps.",
    price: 1899,
    category: "Clothing",
    stock: 12,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    ratings: 4.4,
    numReviews: 15,
  },
  {
    name: "Stainless Steel Insulated Bottle",
    description: "Double-walled vacuum insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    price: 799,
    category: "Other",
    stock: 25,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
    ratings: 4.7,
    numReviews: 40,
  },
  {
    name: "The Pragmatic Programmer (Book)",
    description: "Classic software engineering guide focusing on best practices, career tips, and practical development advice.",
    price: 999,
    category: "Books",
    stock: 10,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    ratings: 4.9,
    numReviews: 50,
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Products seed
    await Product.deleteMany({});
    console.log("Cleared existing products.");
    await Product.insertMany(sampleProducts);
    console.log("✅ 6 Sample products seeded successfully!");

    // Default Admin user check/seed
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (!existingAdmin) {
      await User.create({
        name: "Admin User",
        email: "admin@example.com",
        password: "adminpassword123",
        role: "admin",
      });
      console.log("✅ Default Admin account created: admin@example.com / adminpassword123");
    } else {
      console.log("ℹ️ Admin account already exists.");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  }
};

seedData();

