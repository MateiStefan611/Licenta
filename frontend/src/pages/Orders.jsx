import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;

  // Ascunde comanda în backend
  const hideUserOrder = async (orderId) => {
    try {
      const res = await axios.patch(
        `${backendUrl}/api/order/hide/${orderId}`,
        {},
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Order removed from your list");
        loadOrderData(); // reîncarcă lista după ascundere
      } else {
        toast.error(res.data.message || "Failed to remove order");
      }
    } catch (error) {
      console.log("Error in hideUserOrder:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Încarcă comenzile utilizatorului, filtrând pe cele ascunse
  const loadOrderData = async () => {
    try {
      if (!token) return;

      const res = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (res.data.success) {
        // Filtrăm comenzile care NU sunt ascunse (folosim hiddenFromUser)
        const visibleOrders = res.data.orders.filter(order => !order.hiddenFromUser);
        setOrderData(visibleOrders.reverse());
      } else {
        toast.error(res.data.message || "Failed to load orders");
      }
    } catch (error) {
      console.log("Error loading orders:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  // Paginația
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orderData.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orderData.length / ordersPerPage);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div>
        {currentOrders.length === 0 && (
          <p className="text-center py-10 text-gray-500">No orders to display.</p>
        )}
        {currentOrders.map((order) => (
          <div
            key={order._id}
            className="py-4 border-t border-b text-gray-700 flex flex-col gap-4"
          >
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Order Date: {new Date(order.createdAt).toDateString()}
              </p>
              <button
                onClick={() => hideUserOrder(order._id)}
                className="border px-4 py-2 text-sm text-red-600 rounded-sm hover:bg-red-100"
              >
                Remove Order
              </button>
            </div>

            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-6 text-sm border-t pt-4"
              >
                <img src={item.image[0]} className="w-16 sm:w-20" alt={item.name} />
                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                    <p>
                      {currency}
                      {item.price}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className="mt-1">
                    Payment:{" "}
                    <span className="text-gray-400">{order.paymentMethod}</span>
                  </p>
                  <p className="mt-1">
                    Status: <span className="text-gray-400">{order.status}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
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
    </div>
  );
};

export default Orders;
