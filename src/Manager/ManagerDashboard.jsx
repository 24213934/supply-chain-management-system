import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const API_SUPPLIER_URL = "http://localhost:8085/supplier/details";
const API_ORDERS_LIST = "http://localhost:8085/orders/list";
const API_ORDER_UPDATE = "http://localhost:8085/orders/update-status";
const API_DASHBOARD_INSIGHTS = "http://localhost:8085/dashboard/insights";
const API_GENERATE_REPORT = "http://localhost:8085/dashboard/generate-report";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderError, setOrderError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);

  useEffect(() => {
    fetchSupplierDetails();
    fetchOrders();
  }, []);

  const fetchSupplierDetails = async () => {
    try {
      const response = await fetch(API_SUPPLIER_URL);
      if (!response.ok) throw new Error("Failed to fetch supplier details");
      const data = await response.json();
      setSupplier(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(API_ORDERS_LIST);
      if (!response.ok) throw new Error("Failed to fetch orders.");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      setOrderError(error.message);
    }
  };

  const fetchDashboardInsights = async () => {
    try {
      const response = await fetch(API_DASHBOARD_INSIGHTS);
      if (!response.ok) throw new Error("Failed to fetch dashboard insights.");
      const data = await response.json();
      setDashboardData(data);
      setShowDashboardModal(true);
    } catch (error) {
      setOrderError(error.message);
    }
  };

  const fetchPerformanceReport = async () => {
    try {
      const response = await fetch(API_GENERATE_REPORT);
      if (!response.ok)
        throw new Error("Failed to generate performance report.");
      const data = await response.json();
      setPerformanceData(data);
      setShowPerformanceModal(true);
    } catch (error) {
      setOrderError(error.message);
    }
  };

  const handleUpdateOrder = async (orderId, newStatus) => {
    setOrderError(null);
    try {
      const response = await fetch(
        `${API_ORDER_UPDATE}/${orderId}?status=${newStatus}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update order status.");
      }
      setOrders(
        orders.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      setOrderError(error.message);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "SHIPPED":
        return "bg-success text-white";
      case "DELIVERED":
        return "bg-primary text-white";
      case "PENDING":
        return "bg-warning text-dark";
      case "CANCELLED":
        return "bg-danger text-white";
      default:
        return "";
    }
  };
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="text-center">Manager Dashboard</h2>
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
        <h4>Supplier Details</h4>
        {loading ? (
          <p>Loading supplier details...</p>
        ) : error ? (
          <div
            className="alert alert-danger d-flex align-items-center mt-2"
            role="alert"
          >
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        ) : (
          <>
            <h5>Supplier: {supplier?.supplierName}</h5>
            <p>Products Available:</p>
            <ul>
              {supplier?.items?.map((product, index) => (
                <li key={index}>
                  {product.itemName} - Quantity: {product.quantity}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="card p-4 mb-4">
        <h4>Order Management</h4>
        {orderError && (
          <div
            className="alert alert-danger d-flex align-items-center mt-2"
            role="alert"
          >
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {orderError}
          </div>
        )}
        {orders.length === 0 ? (
          <div className="alert alert-info">No orders to track.</div>
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
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{order.itemName}</td>
                  <td>{order.quantity}</td>
                  <td>{order.totalCost + "$"}</td>
                  <td>
                    <span className={`badge ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {order.status === "PENDING" && (
                      <>
                        <button
                          className="btn btn-success m-1"
                          onClick={() =>
                            handleUpdateOrder(order.orderId, "SHIPPED")
                          }
                        >
                          Ship
                        </button>
                        <button
                          className="btn btn-danger m-1"
                          onClick={() =>
                            handleUpdateOrder(order.orderId, "CANCELLED")
                          }
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {order.status === "SHIPPED" && (
                      <button
                        className="btn btn-success m-1"
                        onClick={() =>
                          handleUpdateOrder(order.orderId, "DELIVERED")
                        }
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
        <button
          className="btn btn-primary m-1"
          onClick={fetchPerformanceReport}
        >
          Generate Performance Report
        </button>
        <button
          className="btn btn-secondary m-1"
          onClick={fetchDashboardInsights}
        >
          View Dashboard
        </button>
      </div>

      {showDashboardModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Dashboard</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDashboardModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {dashboardData ? (
                  <ul>
                    <li>
                      <strong>Total Inventory Items:</strong>{" "}
                      {dashboardData.totalInventoryItems}
                    </li>
                    <li>
                      <strong>Total Orders:</strong> {dashboardData.totalOrders}
                    </li>
                    <li>
                      <strong>Delivered Orders:</strong>{" "}
                      {dashboardData.deliveredOrders}
                    </li>
                    <li>
                      <strong>Shipped Orders:</strong>{" "}
                      {dashboardData.shippedOrders}
                    </li>
                    <li>
                      <strong>Pending Orders:</strong>{" "}
                      {dashboardData.pendingOrders}
                    </li>
                    <li>
                      <strong>Cancelled Orders:</strong>{" "}
                      {dashboardData.cancelledOrders}
                    </li>
                  </ul>
                ) : (
                  <p>Loading data...</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDashboardModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDashboardModal && (
        <div
          className="modal-backdrop fade show"
          onClick={() => setShowDashboardModal(false)}
        ></div>
      )}

      {showPerformanceModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Performance Report</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPerformanceModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {performanceData ? (
                  <>
                    <h5>Supplier: {performanceData.supplierName}</h5>
                    <div className="d-flex justify-content-center">
                      <div style={{ width: "250px", height: "250px" }}>
                        <Pie
                          data={{
                            labels: [
                              "Successful Deliveries",
                              "Failed Deliveries",
                            ],
                            datasets: [
                              {
                                data: [
                                  performanceData.successfulDeliveries,
                                  performanceData.failedDeliveries,
                                ],
                                backgroundColor: ["#28a745", "#dc3545"],
                              },
                            ],
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                          }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <p>Loading data...</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPerformanceModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
