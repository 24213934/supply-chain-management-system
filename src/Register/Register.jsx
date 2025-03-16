import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "SUPPLIER",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    userType: "",
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!formData.email) {
      formErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = "Email is invalid.";
      isValid = false;
    }

    if (!formData.password) {
      formErrors.password = "Password is required.";
      isValid = false;
    } else if (formData.password.length < 6) {
      formErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    if (!formData.userType) {
      formErrors.userType = "User type is required.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8085/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.userType,
        }),
      });

      let errorMessage = "Registration failed. Please try again.";

      if (!response.ok) {
        const contentType = response.headers.get("content-type");

        if (contentType?.includes("application/json")) {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        } else {
          errorMessage = await response.text();
        }

        throw new Error(errorMessage);
      }

      console.log("Registration Successful");
      navigate("/");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card p-4">
            <h2 className="text-center">Register</h2>

            {apiError && <div className="alert alert-danger">{apiError}</div>}

            <br />
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="mb-3">
                <input
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <div className="mb-3">
                <select
                  className={`form-select ${
                    errors.userType ? "is-invalid" : ""
                  }`}
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  required
                >
                  <option value="SUPPLIER">Supplier</option>
                  <option value="BUYER">Buyer</option>
                  <option value="MANAGER">Supply Chain Manager</option>
                </select>
                {errors.userType && (
                  <div className="invalid-feedback">{errors.userType}</div>
                )}
              </div>

              <button
                className="btn btn-primary w-100"
                type="submit"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            <div className="text-center mt-3">
              <p>Already have an account?</p>
              <button
                className="btn btn-outline-primary w-100"
                onClick={() => navigate("/")}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
