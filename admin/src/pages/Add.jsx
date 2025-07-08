/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token, product = null, isEdit = false, onEditSuccess }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Parfum");
  const [type, setType] = useState("Floral");
  const [bestSeller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [productInfo, setProductInfo] = useState("");
  
 
  const [quantities, setQuantities] = useState({
    "50": "",
    "100": "",
    "150": ""
  });
  const [lowStockThreshold, setLowStockThreshold] = useState("5");

  useEffect(() => {
    if (isEdit && product?._id) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price?.toString() || "");
      setCategory(product.category || "Men");
      setSubCategory(product.subCategory || "Parfum");
      setType(product.type || "Floral");
      setBestSeller(product.bestSeller || false);
      setSizes(product.sizes || []);
      setProductInfo(product.productInfo || "");
      setLowStockThreshold(product.lowStockThreshold?.toString() || "5");

      // Handle the Map structure for quantities
      if (product.quantity) {
        const productQuantities = {};
        if (typeof product.quantity === 'object') {
          productQuantities["50"] = product.quantity["50"]?.toString() || "";
          productQuantities["100"] = product.quantity["100"]?.toString() || "";
          productQuantities["150"] = product.quantity["150"]?.toString() || "";
        }
        setQuantities(productQuantities);
      }

      setImage1(product.image?.[0] || false);
      setImage2(product.image?.[1] || false);
      setImage3(product.image?.[2] || false);
      setImage4(product.image?.[3] || false);
    }
  }, [isEdit, product]);

  const handleQuantityChange = (size, value) => {
    setQuantities(prev => ({
      ...prev,
      [size]: value
    }));
  };

  const getStockStatus = (quantity, threshold) => {
    const qty = parseInt(quantity) || 0;
    const thresh = parseInt(threshold) || 0;
    
    if (qty === 0) return { status: 'Out of Stock', class: 'bg-red-100 text-red-800' };
    if (qty <= thresh) return { status: 'Low Stock', class: 'bg-yellow-100 text-yellow-800' };
    return { status: 'In Stock', class: 'bg-green-100 text-green-800' };
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    // Validate that at least one size has quantity
    const hasValidQuantity = Object.values(quantities).some(qty => 
      qty !== "" && parseInt(qty) >= 0
    );
    
    if (!hasValidQuantity) {
      toast.error("Please enter valid quantities for at least one size");
      return;
    }
    
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestSeller", bestSeller.toString());
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("type", type);
      formData.append("productInfo", productInfo);
      formData.append("lowStockThreshold", lowStockThreshold);

      // Convert quantities object to the format expected by the backend
      const quantityMap = {};
      Object.keys(quantities).forEach(size => {
        if (quantities[size] !== "") {
          quantityMap[size] = parseInt(quantities[size]) || 0;
        }
      });
      formData.append("quantity", JSON.stringify(quantityMap));

   
      const appendImage = (fieldName, imageValue) => {
        if (imageValue && typeof imageValue !== "string") {
          formData.append(fieldName, imageValue);
        }
      };

      appendImage("image1", image1);
      appendImage("image2", image2);
      appendImage("image3", image3);
      appendImage("image4", image4);

      let response;

      if (isEdit && product?._id) {
        console.log("Editing product with id:", product._id);
        formData.append("productId", product._id);
        response = await axios.post(
          backendUrl + "/api/product/edit",
          formData,
          { headers: { token } }
        );
      } else {
        response = await axios.post(backendUrl + "/api/product/add", formData, {
          headers: { token },
        });
      }

      if (response.data.success) {
        toast.success(response.data.message);
        if (!isEdit) {
          
          setName("");
          setDescription("");
          setImage1(false);
          setImage2(false);
          setImage3(false);
          setImage4(false);
          setPrice("");
          setCategory("Men");
          setSubCategory("Parfum");
          setType("Floral");
          setBestSeller(false);
          setSizes([]);
          setProductInfo("");
          setQuantities({
            "50": "",
            "100": "",
            "150": ""
          });
          setLowStockThreshold("5");
        } else {
          if (onEditSuccess) onEditSuccess();
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      {/* Images upload UI */}
      <div>
        <p className="mb-2 ">Upload Image</p>
        <div className="flex gap-2">
          <label htmlFor="image1">
            <img
              src={
                image1
                  ? typeof image1 === "string"
                    ? image1
                    : URL.createObjectURL(image1)
                  : assets.upload_area
              }
              className="w-20"
              alt=""
            />
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>

          <label htmlFor="image2">
            <img
              src={
                image2
                  ? typeof image2 === "string"
                    ? image2
                    : URL.createObjectURL(image2)
                  : assets.upload_area
              }
              className="w-20"
              alt=""
            />
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              hidden
            />
          </label>

          <label htmlFor="image3">
            <img
              src={
                image3
                  ? typeof image3 === "string"
                    ? image3
                    : URL.createObjectURL(image3)
                  : assets.upload_area
              }
              className="w-20"
              alt=""
            />
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              hidden
            />
          </label>

          <label htmlFor="image4">
            <img
              src={
                image4
                  ? typeof image4 === "string"
                    ? image4
                    : URL.createObjectURL(image4)
                  : assets.upload_area
              }
              className="w-20"
              alt=""
            />
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>
      </div>

      {/* Other inputs */}
      <div className="w-full ">
        <p className="mb-2">Product name</p>
        <input
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>

      <div className="w-full ">
        <p className="mb-2">Product description</p>
        <textarea
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Write content here"
          required
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
      </div>

      <div className="w-full ">
        <p className="mb-2">Product informations</p>
        <textarea
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Write content here"
          required
          onChange={(e) => setProductInfo(e.target.value)}
          value={productInfo}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full px-3 py-2"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Sub category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="w-full px-3 py-2"
          >
            <option value="Parfum">Parfum</option>
            <option value="Eau de Parfum">Eau de Parfum</option>
            <option value="Eau de Toilette">Eau de Toilette</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Type</p>
          <select
            onChange={(e) => setType(e.target.value)}
            value={type}
            className="w-full px-3 py-2"
          >
            <option value="Floral">Floral</option>
            <option value="Oriental">Oriental</option>
            <option value="Woody">Woody</option>
            <option value="Leather">Leather</option>
            <option value="Fresh">Fresh</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input
            type="number"
            className="w-full px-3 py-2 sm:w-[120px]"
            placeholder="25"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
          />
        </div>
      </div>

      {/* Inventory Management Section */}
      <div className="w-full rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">📦 Inventory Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-6">
          {/* 50ml Quantity */}
          <div className="flex flex-col space-y-1">
            <p className="mb-2 font-medium text-gray-700">Stock Quantity for 50ml</p>
            <input
              type="number"
              min="0"
              className="w-40 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quantity"
              onChange={(e) => handleQuantityChange("50", e.target.value)}
              value={quantities["50"]}
            />
            {quantities["50"] && (
              <div className="mt-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getStockStatus(quantities["50"], lowStockThreshold).class}`}>
                  {getStockStatus(quantities["50"], lowStockThreshold).status}
                </span>
              </div>
            )}
          </div>

          {/* 100ml Quantity */}
          <div className=" flex flex-col space-y-1">
            <p className="mb-2 font-medium text-gray-700">Stock Quantity for 100ml</p>
            <input
              type="number"
              min="0"
              className="w-40 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quantity"
              onChange={(e) => handleQuantityChange("100", e.target.value)}
              value={quantities["100"]}
            />
            {quantities["100"] && (
              <div className="mt-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getStockStatus(quantities["100"], lowStockThreshold).class}`}>
                  {getStockStatus(quantities["100"], lowStockThreshold).status}
                </span>
              </div>
            )}
          </div>

          {/* 150ml Quantity */}
          <div className=" flex flex-col space-y-1 ">
            <p className="mb-2 font-medium text-gray-700">Stock Quantity for 150ml</p>
            <input
              type="number"
              min="0"
              className="w-40 px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quantity"
              onChange={(e) => handleQuantityChange("150", e.target.value)}
              value={quantities["150"]}
            />
            {quantities["150"] && (
              <div className="mt-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getStockStatus(quantities["150"], lowStockThreshold).class}`}>
                  {getStockStatus(quantities["150"], lowStockThreshold).status}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Threshold */}
        <div className=" p-3 ">
          <p className="mb-2 font-medium text-gray-700">Low Stock Alert Threshold</p>
          <input
            type="number"
            min="1"
            className="w-40 max-w-[200px] px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="5"
            onChange={(e) => setLowStockThreshold(e.target.value)}
            value={lowStockThreshold}
          />
          <p className="text-sm text-gray-500 mt-1">Alert when stock drops below this number for any size</p>
        </div>

        {/* Total Stock Summary */}
        {(quantities["50"] || quantities["100"] || quantities["150"]) && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">📊 Stock Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">50ml:</span>
                <span className="font-medium ml-1">{quantities["50"] || "0"} units</span>
              </div>
              <div>
                <span className="text-gray-600">100ml:</span>
                <span className="font-medium ml-1">{quantities["100"] || "0"} units</span>
              </div>
              <div>
                <span className="text-gray-600">150ml:</span>
                <span className="font-medium ml-1">{quantities["150"] || "0"} units</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-blue-200">
              <span className="text-blue-800 font-medium">
                Total Units: {(parseInt(quantities["50"]) || 0) + (parseInt(quantities["100"]) || 0) + (parseInt(quantities["150"]) || 0)}
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestSeller((p) => !p)}
          checked={bestSeller}
          type="checkbox"
          id="bestSeller"
        />
        <label className="cursor-pointer" htmlFor="bestSeller">
          Add to bestseller
        </label>
      </div>

      <button className="w-28 py-3 mt-4 bg-black text-white" type="submit">
        {isEdit ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default Add;