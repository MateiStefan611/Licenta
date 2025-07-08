import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// function for add product
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes, 
      bestSeller,
      type,
      productInfo,
      lowStockThreshold,
      quantity,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    // Parsează sizes și quantity
    const parsedSizes = JSON.parse(sizes);
    let parsedQuantity = {};
    
    // Verifică dacă quantity este string (JSON) sau deja obiect
    if (typeof quantity === 'string') {
      parsedQuantity = JSON.parse(quantity);
    } else if (typeof quantity === 'object') {
      parsedQuantity = quantity;
    }

    // Validează că quantity are chei pentru toate mărimile
    const quantityMap = new Map();
    parsedSizes.forEach(size => {
      const qty = parsedQuantity[size] || 0;
      quantityMap.set(size, Number(qty));
    });

    const productData = {
      name,
      description,
      category,
      price: Number(price), 
      subCategory,
      bestSeller: bestSeller === "true",
      sizes: parsedSizes, 
      image: imagesUrl,
      date: Date.now(),
      type,
      productInfo,
      lowStockThreshold: Number(lowStockThreshold) || 5,
      quantity: quantityMap, // Salvează ca Map
    };

    console.log("Product Data to save:", productData);
    console.log("Quantity Map:", quantityMap);

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (e) {
    console.log("Add Product Error:", e);
    res.json({ success: false, message: e.message });
  }
};

// function for editing a product
export const editProduct = async (req, res) => {
  try {
    const {
      productId,
      name,
      description,
      price,
      category,
      subCategory,
      sizes, 
      bestSeller,
      type,
      productInfo,
      lowStockThreshold,
      quantity,
    } = req.body;

    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    // Handle new image uploads
    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const newImages = [image1, image2, image3, image4].filter(Boolean);

    let imagesUrl = product.image; 

    if (newImages.length > 0) {
      imagesUrl = await Promise.all(
        newImages.map(async (file) => {
          let result = await cloudinary.uploader.upload(file.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
    } else if (req.body.image) {
      imagesUrl = JSON.parse(req.body.image);
    }

    // Parsează sizes și quantity
    const parsedSizes = JSON.parse(sizes);
    let parsedQuantity = {};
    
    // Verifică dacă quantity este string (JSON) sau deja obiect
    if (typeof quantity === 'string') {
      parsedQuantity = JSON.parse(quantity);
    } else if (typeof quantity === 'object') {
      parsedQuantity = quantity;
    }

    // Creează Map pentru quantity
    const quantityMap = new Map();
    parsedSizes.forEach(size => {
      const qty = parsedQuantity[size] || 0;
      quantityMap.set(size, Number(qty));
    });

    // Update product fields
    product.name = name;
    product.description = description;
    product.price = Number(price);
    product.category = category;
    product.subCategory = subCategory;
    product.bestSeller = bestSeller === "true" || bestSeller === true;
    product.sizes = parsedSizes; 
    product.image = imagesUrl;
    product.type = type;
    product.productInfo = productInfo;
    product.lowStockThreshold = Number(lowStockThreshold) || 5;
    product.quantity = quantityMap; // Salvează ca Map

    await product.save();

    res.json({ success: true, message: "Product updated successfully" });
  } catch (e) {
    console.log("Edit Product Error:", e);
    res.json({ success: false, message: e.message });
  }
};

// function for list product
export const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    
    // Convertește Map-urile în obiecte pentru JSON serialization
    const productsWithQuantityObjects = products.map(product => {
      const productObj = product.toObject();
      if (productObj.quantity instanceof Map) {
        const quantityObj = {};
        productObj.quantity.forEach((value, key) => {
          quantityObj[key] = value;
        });
        productObj.quantity = quantityObj;
      }
      return productObj;
    });
    
    res.json({ success: true, products: productsWithQuantityObjects });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

// function for remove product
export const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

// function for single product info
export const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);

    if (product) {
      const productObj = product.toObject();
      // Convertește Map în obiect pentru JSON serialization
      if (productObj.quantity instanceof Map) {
        const quantityObj = {};
        productObj.quantity.forEach((value, key) => {
          quantityObj[key] = value;
        });
        productObj.quantity = quantityObj;
      }
      
      res.json({ success: true, product: productObj });
    } else {
      res.json({ success: false, message: "Product not found" });
    }
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};