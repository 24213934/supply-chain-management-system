import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BuyerDashboard.css";

const API_ORDERS_BASE_URL = "http://localhost:8085/orders";
const API_INVENTORY_BASE_URL = "http://localhost:8085/inventory/item";

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editableOrder, setEditableOrder] = useState(null);
  const [newOrder, setNewOrder] = useState({
    itemId: "",
    supplierId: "",
    itemName: "",
    quantity: 1,
  });
  const [error, setError] = useState("");
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchItems();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_ORDERS_BASE_URL}/list`);
      if (!response.ok) {
        throw new Error("Failed to fetch orders.");
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err.message);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch(API_INVENTORY_BASE_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch inventory items.");
      }
      const data = await response.json();

      const formattedItems = data.map(({ id, itemName }) => ({
        itemId: String(id),
        itemName,
      }));
      setItems(formattedItems);
    } catch (err) {
      console.error("Error fetching inventory items:", err.message);
    }
  };

  const handleCreateOrder = async () => {
    if (!newOrder.itemId) {
      setError("Please select a valid item.");
      return;
    }

    try {
      const response = await fetch(`${API_ORDERS_BASE_URL}/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: newOrder.itemId,
          supplierId: newOrder.supplierId || null,
          itemName: newOrder.itemName,
          quantity: newOrder.quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order.");
      }

      const createdOrder = await response.json();
      setOrders([...orders, createdOrder]);
      setNewOrder({
        itemId: "",
        supplierId: "",
        itemName: "",
        quantity: 1,
      });
      setError("");
    } catch (err) {
      console.error("Error creating order:", err.message);
      setError(
        "Error placing order. Try again with different quantity or item."
      );
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrderId(order.orderId);
    setEditableOrder({ ...order });
  };

  const handleSaveOrder = async (orderId) => {
    setUpdateError("");
    try {
      const response = await fetch(
        `${API_ORDERS_BASE_URL}/update-details/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itemId: editableOrder.itemId,
            itemName: editableOrder.itemName,
            quantity: editableOrder.quantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order details.");
      }

      const updatedOrder = await response.json();
      setOrders(
        orders.map((order) =>
          order.orderId === orderId ? updatedOrder : order
        )
      );

      setEditingOrderId(null);
      setEditableOrder(null);
    } catch (err) {
      console.error("Error updating order:", err.message);
      setUpdateError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Buyer Dashboard</h2>
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

      <div className="card p-4 mb-4">
        <h4>Create a New Order</h4>
        <div className="mb-3">
          <label htmlFor="newItem" className="form-label">
            Item Name
          </label>
          <select
            className={`form-select ${error ? "is-invalid" : ""}`}
            id="newItem"
            value={newOrder.itemId}
            onChange={(e) => {
              const selectedItem = items.find(
                (item) => item.itemId === e.target.value
              );
              if (selectedItem) {
                setNewOrder({
                  ...newOrder,
                  itemId: selectedItem.itemId,
                  itemName: selectedItem.itemName,
                  supplierId: "",
                });
              }
            }}
          >
            <option value="">Select an item</option>
            {items.map(({ itemId, itemName }) => (
              <option key={itemId} value={itemId}>
                {itemName}
              </option>
            ))}
          </select>
          {error && <div className="invalid-feedback">{error}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="newQuantity" className="form-label">
            Quantity
          </label>
          <input
            type="number"
            className={`form-control ${error ? "is-invalid" : ""}`}
            id="newQuantity"
            value={newOrder.quantity}
            onChange={(e) =>
              setNewOrder({
                ...newOrder,
                quantity: parseInt(e.target.value, 10) || 1,
              })
            }
          />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
        <button className="btn btn-primary" onClick={handleCreateOrder}>
          Create Order
        </button>
      </div>

      <div className="card p-4 mb-4">
        <h4>Order Tracking and Update</h4>
        <p>Track your orders and update the order details.</p>
        {orders.filter(
          (order) => order.status === "PENDING" || order.status === "SHIPPED"
        ).length === 0 ? (
          <div className="alert alert-info">No active orders to track.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Cost</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders
                .filter(
                  (order) =>
                    order.status === "PENDING" || order.status === "SHIPPED"
                )
                .map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>
                      {editingOrderId === order.orderId &&
                      order.status === "PENDING" ? (
                        <>
                          <select
                            className={`form-select ${
                              updateError ? "is-invalid" : ""
                            }`}
                            value={editableOrder.itemId}
                            onChange={(e) => {
                              const selectedItem = items.find(
                                (item) => item.itemId === e.target.value
                              );
                              if (selectedItem) {
                                setEditableOrder({
                                  ...editableOrder,
                                  itemId: selectedItem.itemId,
                                  itemName: selectedItem.itemName,
                                });
                              }
                            }}
                          >
                            {items.map(({ itemId, itemName }) => (
                              <option key={itemId} value={itemId}>
                                {itemName}
                              </option>
                            ))}
                          </select>
                          {updateError && (
                            <div className="invalid-feedback">
                              {updateError}
                            </div>
                          )}
                        </>
                      ) : (
                        order.itemName
                      )}
                    </td>
                    <td>
                      {editingOrderId === order.orderId &&
                      order.status === "PENDING" ? (
                        <>
                          <input
                            type="number"
                            className={`form-control ${
                              updateError ? "is-invalid" : ""
                            }`}
                            value={editableOrder.quantity}
                            onChange={(e) =>
                              setEditableOrder({
                                ...editableOrder,
                                quantity: parseInt(e.target.value, 10) || 1,
                              })
                            }
                          />
                          {updateError && (
                            <div className="invalid-feedback">
                              {updateError}
                            </div>
                          )}
                        </>
                      ) : (
                        order.quantity
                      )}
                    </td>
                    <td>{order.totalCost + "$"}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          order.status === "SHIPPED"
                            ? "warning"
                            : order.status === "DELIVERED"
                            ? "success"
                            : "primary"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {editingOrderId === order.orderId &&
                      order.status === "PENDING" ? (
                        <>
                          <button
                            className="btn btn-success me-2"
                            onClick={() => handleSaveOrder(order.orderId)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => setEditingOrderId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        order.status === "PENDING" && (
                          <button
                            className="btn btn-warning"
                            onClick={() => handleEditOrder(order)}
                          >
                            Update
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card p-4 mb-4">
        <h4>Order History</h4>
        {orders.filter(
          (order) =>
            order.status === "DELIVERED" || order.status === "CANCELLED"
        ).length === 0 ? (
          <div className="alert alert-info">No past orders found.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Cost</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders
                .filter(
                  (order) =>
                    order.status === "DELIVERED" || order.status === "CANCELLED"
                )
                .map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>{order.itemName}</td>
                    <td>{order.quantity}</td>
                    <td>{order.totalCost + "$"}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          order.status === "DELIVERED" ? "success" : "danger"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;
