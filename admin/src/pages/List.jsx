import axios from "axios";
import { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import Add from "./Add";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 7;

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const onEditClick = (product) => {
    setEditingProduct(product);
    setShowEditForm(true);
  };

  const onEditSuccess = async () => {
    setShowEditForm(false);
    setEditingProduct(null);
    await fetchList();
  };

  // Funcție pentru a calcula cantitatea totală și status-ul stocului
  const getQuantityInfo = (product) => {
    let totalQuantity = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    const quantities = [];

    // Verifică dacă quantity este obiect sau număr
    if (typeof product.quantity === 'object' && product.quantity !== null) {
      // Quantity este obiect cu chei pentru fiecare mărime
      Object.entries(product.quantity).forEach(([size, qty]) => {
        const quantity = Number(qty) || 0;
        totalQuantity += quantity;
        quantities.push({ size, quantity });
        
        if (quantity === 0) {
          outOfStockCount++;
        } else if (quantity <= (product.lowStockThreshold || 50)) {
          lowStockCount++;
        }
      });
    } else {
      // Fallback pentru quantity ca număr simplu (compatibilitate înapoi)
      totalQuantity = Number(product.quantity) || 0;
      quantities.push({ size: 'total', quantity: totalQuantity });
      
      if (totalQuantity === 0) {
        outOfStockCount = 1;
      } else if (totalQuantity <= (product.lowStockThreshold || 50)) {
        lowStockCount = 1;
      }
    }

    // Determină status-ul general
    let status = 'In Stock';
    let statusClass = 'bg-green-100 text-green-800';
    
    if (totalQuantity === 0 || outOfStockCount === quantities.length) {
      status = 'Out of Stock';
      statusClass = 'bg-red-100 text-red-800';
    } else if (outOfStockCount > 0 || lowStockCount > 0) {
      status = 'Low Stock';
      statusClass = 'bg-yellow-100 text-yellow-800';
    }

    return { totalQuantity, quantities, status, statusClass };
  };

  useEffect(() => {
    fetchList();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = list.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(list.length / productsPerPage);

  return (
    <>
      <p className="mb-2">All Products Lists</p>

      {showEditForm && editingProduct && (
        <div className="mb-6 border p-4 rounded bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
          <Add
            token={token}
            product={editingProduct}
            isEdit={true}
            onEditSuccess={onEditSuccess}
          />
          <button
            onClick={() => setShowEditForm(false)}
            className="mt-3 text-red-500 underline"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_2fr_1fr_1fr_1fr] items-center py-1 px-2 border text-sm bg-gray-100">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Quantities by Size</b> 
          <b className="text-center">Action</b>
          <b className="text-center">Edit</b>
        </div>

        {currentProducts.map((item) => {
          const quantityInfo = getQuantityInfo(item);
          
          return (
            <div
              key={item._id}
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_2fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            >
              <img className="w-12" src={item.image[0]} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>
                {currency}
                {item.price}
              </p>
              
              {/* Afișează cantitățile pentru fiecare mărime */}
              <div className="text-xs">
                <div className="font-medium mb-1">
                  Total: {quantityInfo.totalQuantity}
                </div>
                <div className="flex flex-wrap gap-1">
                  {quantityInfo.quantities.map(({ size, quantity }) => (
                    <span
                      key={size}
                      className={`px-2 py-1 rounded text-xs ${
                        quantity === 0
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : quantity <= (item.lowStockThreshold || 50)
                          ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                          : 'bg-green-50 text-green-700 border border-green-200'
                      }`}
                    >
                      {size !== 'total' ? `${size}ml: ${quantity}` : quantity}
                    </span>
                  ))}
                </div>
              </div>

    

              <p
                onClick={() => removeProduct(item._id)}
                className="text-right md:text-center cursor-pointer text-lg hover:text-red-600"
                title="Delete product"
              >
                X
              </p>
              <p
                onClick={() => onEditClick(item)}
                className="text-right md:text-center cursor-pointer text-lg text-blue-600 hover:text-blue-800"
                title="Edit product"
              >
                ✎
              </p>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-6 text-sm">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded hover:bg-gray-100 ${
                currentPage === i + 1 ? "bg-gray-200 font-bold" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default List;