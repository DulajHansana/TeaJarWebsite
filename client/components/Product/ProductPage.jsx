"use client";
import React, { useState } from "react";
import { Star, Minus, Plus } from "lucide-react";
import ReviewSection from "@/components/Product/ReviewSection";
import Subscribe from "@/components/Common/Subscribe";
import Link from "next/link";

const KOKOLogo = () => (
  <Link
    href={`https://paykoko.com/customer-education`}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex"
  >
    <img
      className="relative h-5 w-auto mt-0 top-[3px]"
      src="https://paykoko.com/img/logo1.7ff549c0.png"
      alt="Koko"
    />
  </Link>
);

const ProductPage = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const images = product.images || [
    "https://kdu-admin.payshia.com/pos-system/assets/images/products/" +
      product.product_id +
      "/" +
      product.image_path,
    "/assets/products/1/cardamom.jpg",
  ];

  const features = product.features || [
    { icon: "🌿", label: "Vegan" },
    { icon: "🚫", label: "Paraben Free" },
    { icon: "🐾", label: "Cruelty Free" },
    { icon: "✨", label: "Natural" },
    { icon: "🔥", label: "Paraben Free" },
    { icon: "👍", label: "Non-toxic" },
  ];

  const productName = product.display_name;
  const price = product.selling_price;
  const imgUrl = product.image_path;
  const rate = product.selling_price;

  // Add to Cart function
  const addToCart = () => {
    const cartItem = { productName, price, rate, imgUrl };

    // Get existing cart items from local storage or initialize an empty array
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Add the new item to the cart
    cart.push(cartItem);

    // Save updated cart back to local storage
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8 mt-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <div className="aspect-square relative">
              <img
                src={images[selectedImage]}
                alt="Product"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-24 h-24 rounded-lg overflow-hidden border-2 ${
                    selectedImage === idx
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500">
                {product.department_id || "Category"}
              </p>
              <h1 className="text-3xl font-bold mt-1">
                {product.display_name || "Product Name"}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">26 reviews</span>
            </div>

            <div className="text-xl font-bold">
              Rs {product.selling_price}
              <p className="text-sm font-normal text-gray-600">
                or 3 x Rs {Math.round(product.selling_price / 3)} with{" "}
                <KOKOLogo />
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <button
                className="w-full bg-white border-2 border-black text-black py-3 rounded-md hover:bg-gray-50"
                onClick={addToCart}
              >
                Add to cart
              </button>
              <button
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800"
                onClick={addToCart}
              >
                Buy it now
              </button>
            </div>

            <p className="text-gray-600">{product.description}</p>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center"
                >
                  <span className="text-2xl mb-2">{feature.icon}</span>
                  <span className="text-xs text-gray-600">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md mt-10">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Good to Know</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Detailed Description</h3>
                <p className="text-sm text-gray-600">
                  {product.product_description}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">How To Use</h3>
                <p className="text-sm text-gray-600">{product.how_to_use}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t">
          <ReviewSection />
        </div>
      </div>

      <Subscribe />
    </div>
  );
};

export default ProductPage;
