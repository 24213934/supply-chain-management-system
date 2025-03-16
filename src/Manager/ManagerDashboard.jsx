import { useState } from "react";

const ManagerDashboard = () => {
  const [orders, setOrders] = useState([
    { id: 1, item: "Item A", supplier: "Supplier 1", status: "Shipped" },
    { id: 2, item: "Item B", supplier: "Supplier 1", status: "Delivered" },
    { id: 3, item: "Item C", supplier: "Supplier 1", status: "Pending" },
    { id: 4, item: "Item D", supplier: "Supplier 1", status: "Cancelled" },
  ]);

  const supplier = {
    name: "Supplier 1",
    products: [
      { name: "Item A", quantity: 50 },
      { name: "Item B", quantity: 30 },
      { name: "Item C", quantity: 20 },
      { name: "Item D", quantity: 10 },
    ],
  };

  const handleUpdateOrder = (id, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Shipped":
        return "bg-success text-white";
      case "Delivered":
        return "bg-primary text-white";
      case "Pending":
        return "bg-warning text-dark";
      case "Cancelled":
        return "bg-danger text-white";
      default:
        return "";
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Supply Chain Manager Dashboard</h2>
      <br />

      <div className="card p-4 mb-4">
        <h4>Supplier Details</h4>
        <p>View details and product availability for the supplier.</p>
        <div>
          <h5>Supplier: {supplier.name}</h5>
          <p>Products Available:</p>
          <ul>
            {supplier.products.map((product, index) => (
              <li key={index}>
                {product.name} - Quantity: {product.quantity}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <h4>Order Management</h4>
        <p>Track, update, and manage orders.</p>
        {orders.length === 0 ? (
          <div className="alert alert-info">No orders to track.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Item</th>
                <th>Supplier</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.item}</td>
                  <td>{order.supplier}</td>
                  <td>
                    <span className={`badge ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {order.status === "Pending" && (
                      <>
                        <button
                          className="btn btn-success m-1"
                          onClick={() => handleUpdateOrder(order.id, "Shipped")}
                        >
                          Ship
                        </button>
                        <button
                          className="btn btn-danger m-1"
                          onClick={() =>
                            handleUpdateOrder(order.id, "Cancelled")
                          }
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {order.status === "Shipped" && (
                      <button
                        className="btn btn-success m-1"
                        onClick={() => handleUpdateOrder(order.id, "Delivered")}
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card p-4 mb-4">
        <h4>Supplier Performance</h4>
        <p>Analyze supplier performance through reports and dashboards.</p>
        <button className="btn btn-primary m-1">
          Generate Performance Report
        </button>
        <button className="btn btn-secondary m-1">View Dashboard</button>
      </div>
    </div>
  );
};

export default ManagerDashboard;
