import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaSave } from "react-icons/fa";
import "./SupplierDashboard.css";

const API_BASE_URL = "http://localhost:8085";

export const SupplierDashboard = () => {
  const navigate = useNavigate();

  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [insights, setInsights] = useState(null);
  const [newItem, setNewItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchInventory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/item`);
      if (!response.ok) throw new Error("Failed to fetch inventory.");
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error("Error fetching inventory:", error.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/list`);
      if (!response.ok) throw new Error("Failed to fetch orders.");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    }
  };

  const fetchInsights = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/insights`);
      if (!response.ok) throw new Error("Failed to fetch insights.");
      const data = await response.json();
      setInsights(data);
    } catch (error) {
      console.error("Error fetching insights:", error.message);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchOrders();
    fetchInsights();
  }, []);

  const handleQuantityChangeField = (id, newQuantity) => {
    setInventory(
      inventory.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleQuantityChange = async (id, newQuantity, itemName, cost) => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemName: itemName,
          quantity: newQuantity,
          cost: cost,
        }),
      });

      if (!response.ok) throw new Error("Failed to update item quantity.");

      await fetchInventory();
    } catch (error) {
      console.error("Error updating item:", error.message);
      alert("Failed to update item quantity. Please try again.");
    }
  };

  const handleOrderStatusChange = async (id, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );

    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/update-status/${id}?status=${newStatus}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status.");
      }

      await fetchOrders();
      await fetchInsights();
    } catch (error) {
      console.error("Error updating order status:", error.message);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status: order.status } : order
        )
      );
    }
  };

  const handleAddItem = () => {
    setNewItem({ name: "", quantity: "" });
  };

  const handleSaveNewItem = async () => {
    if (!newItem?.name || !newItem?.quantity) return;

    try {
      const response = await fetch(`${API_BASE_URL}/inventory/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemName: newItem.name,
          quantity: newItem.quantity,
          cost: newItem.cost,
        }),
      });

      if (!response.ok) throw new Error("Failed to add item.");
      await fetchInventory();
      await fetchInsights();
      setNewItem(null);
    } catch (error) {
      console.error("Error adding item:", error.message);
    }
  };

  const showDeleteModal = (id) => {
    setItemToDelete(id);
    setIsModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await fetch(`${API_BASE_URL}/inventory/delete/${itemToDelete}`, {
        method: "DELETE",
      });

      setInventory(inventory.filter((item) => item.id !== itemToDelete));
      setIsModalVisible(false);
      await fetchInsights();
    } catch (error) {
      console.error("Error deleting item:", error.message);
    }
  };

  const handleCancelDelete = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="container mt-5">
      <div
        className={`modal fade ${isModalVisible ? "show" : ""}`}
        tabIndex="-1"
        style={{ display: isModalVisible ? "flex" : "none" }}
        aria-labelledby="modalLabel"
        aria-hidden={!isModalVisible}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalLabel">
                Confirm Deletion
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCancelDelete}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this item?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <h2>Supplier Dashboard</h2>
        <button
          className="btn btn-danger"
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
      <br />
      <div className="row">
        <div className="col-md-6">
          <div className="card p-4">
            <div className="d-flex justify-content-between align-items-center">
              <h4>Inventory Management</h4>
              <FaPlus
                className="text-primary cursor-pointer"
                onClick={handleAddItem}
                style={{
                  cursor: "pointer",
                }}
              />
            </div>
            <br />
            {inventory.length === 0 && !newItem ? (
              <div className="alert alert-info" role="alert">
                No items in the inventory.
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Item ID</th>
                    <th>Item Name</th>
                    <th>Cost</th>
                    <th>Quantity</th>
                    <th className="text-center">Update</th>
                    <th className="text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.itemName}</td>
                      <td>{item.cost + "$"}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChangeField(
                              item.id,
                              Number(e.target.value)
                            )
                          }
                        />
                      </td>
                      <td className="text-center">
                        <FaSave
                          className="text-success cursor-pointer"
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.quantity,
                              item.itemName,
                              item.cost
                            )
                          }
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                      <td className="text-center">
                        <FaTrash
                          className="text-danger cursor-pointer"
                          onClick={() => showDeleteModal(item.id)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                  ))}
                  {newItem && (
                    <tr>
                      <td></td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Item Name"
                          value={newItem.name}
                          onChange={(e) =>
                            setNewItem({ ...newItem, name: e.target.value })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Item Cost"
                          value={newItem.cost}
                          onChange={(e) =>
                            setNewItem({ ...newItem, cost: e.target.value })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Quantity"
                          value={newItem.quantity}
                          onChange={(e) =>
                            setNewItem({ ...newItem, quantity: e.target.value })
                          }
                        />
                      </td>
                      <td className="text-center">
                        <FaSave
                          className="text-success cursor-pointer"
                          onClick={handleSaveNewItem}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                      <td className="text-center">
                        <FaTrash
                          className="text-danger cursor-pointer"
                          onClick={() => setNewItem(null)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-4">
            <h4>Order Management</h4>
            <br />
            {orders.length === 0 ? (
              <div className="alert alert-info" role="alert">
                No orders placed.
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Cost</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.orderId}>
                      <td>{order.orderId}</td>
                      <td>{order.itemName}</td>
                      <td>{order.quantity}</td>
                      <td>{order.totalCost + "$"}</td>
                      <td>
                        <select
                          className="form-select"
                          value={order.status}
                          onChange={(e) =>
                            handleOrderStatusChange(
                              order.orderId,
                              e.target.value
                            )
                          }
                        >
                          <option value="PENDING">Pending</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <div className="card pt-4 ps-4 pe-4 mt-4 mb-4">
        <h4>Reports</h4>
        <br />
        <p>
          <strong>Total Inventory Items:</strong>{" "}
          {insights?.totalInventoryItems}
        </p>
        <div>
          <strong>Total Orders:</strong> {insights?.totalOrders}
          <ul>
            <li>
              <strong>Delivered Orders:</strong> {insights?.deliveredOrders}
            </li>
            <li>
              <strong>Shipped Orders:</strong> {insights?.shippedOrders}
            </li>
            <li>
              <strong>Pending Orders:</strong> {insights?.pendingOrders}
            </li>
            <li>
              <strong>Cancelled Orders:</strong> {insights?.cancelledOrders}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;
