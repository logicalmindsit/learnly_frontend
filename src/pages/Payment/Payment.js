

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState("full");
  const [emiDueDay, setEmiDueDay] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [emiDetails, setEmiDetails] = useState(null);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({
    show: false,
    message: "",
    isSuccess: false,
  });

  const token = localStorage.getItem("token");
  const API_BASE = process.env.REACT_APP_API_BASE || "https://learnly-backend-05ix.onrender.com";

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseRes, emiRes] = await Promise.all([
          fetch(`${API_BASE}/courses/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/user/payment/emi-details/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        
        const courseData = await courseRes.json();
        const emiData = await emiRes.json();
        
        if (!courseData.success) throw new Error("Failed to fetch course details");
        setCourse(courseData.data);
        
        if (emiData.success && emiData.eligible) setEmiDetails(emiData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load course details. Please try again.");
      }
    };
    
    fetchCourseData();
  }, [courseId, token, API_BASE]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setError("");
    
    // Validation
    if (!agreedToTerms) return setError("Please agree to the terms and conditions.");
    if (paymentType === "emi" && !emiDueDay) return setError("Please select an EMI due date.");
    
    setLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Payment gateway failed to load.");

      const paymentData = {
        courseId,
        paymentType,
        paymentMethod: "CARD",
        emiDueDay: paymentType === "emi" ? Number(emiDueDay) : undefined,
        amount: paymentType === "emi"
          ? emiDetails?.monthlyAmount || 2000
          : course?.price?.finalPrice || 0
      };

      const createResponse = await fetch(`${API_BASE}/user/payment/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const responseData = await createResponse.json();
      if (!responseData.success) throw new Error(responseData.message || "Error creating payment order");

      const { order, paymentId } = responseData;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Learnly Course Payment",
        description: `${course.coursename} - ${paymentType === "emi" ? "First EMI" : "Full Payment"}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyResponse = await fetch(`${API_BASE}/user/payment/verify`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                paymentId,
                paymentType,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              setModal({
                show: true,
                message: paymentType === "emi"
                  ? "EMI enrollment successful! Your first payment is complete."
                  : "Payment successful! You've enrolled in the course.",
                isSuccess: true,
              });
            } else {
              setError(`Payment verification failed: ${verifyData.message || "Unknown error"}`);
            }
          } catch (err) {
            console.error("Verification error:", err);
            setError("Error verifying payment. Please try again.");
          } finally {
            setLoading(false);
          }
        },
        prefill: { name: "", email: "", contact: "" },
        theme: { color: "#4361EE" },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message || "Payment processing failed. Please try again.");
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModal({ show: false, message: "", isSuccess: false });
    if (modal.isSuccess) navigate(`/course/${courseId}/content`);
  };

  if (!course) {
    return (
      <div className="payment-loading-container">
        <div className="payment-loading-card">
          <div className="payment-loading-spinner"></div>
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-layout">
        {/* Main Content */}
        <div className="payment-main-content">
          {/* Header */}
          <div className="payment-header">
            <h1>Complete Your Purchase</h1>
            <p>
              You're one step away from enrolling in <strong>{course.coursename}</strong>
            </p>
          </div>

          {/* Course Info */}
          <div className="payment-course-card">
            <img
              src={course.thumbnail}
              alt={course.coursename}
              className="course-thumbnail"
            />
            <div>
              <h3>{course.coursename}</h3>
              <p>
                {course.courseduration} • By{" "}
                {course.instructor?.name || "Learnly Instructor"}
              </p>
            </div>
          </div>

          {/* Payment Options */}
          <div className="payment-options-card">
            <h2>Choose Payment Option</h2>
            <div className="payment-options-group">
              {/* Full Payment */}
              <div 
                className={`payment-option ${paymentType === "full" ? "selected" : ""}`}
                onClick={() => setPaymentType("full")}
              >
                <label>
                  <input
                    type="radio"
                    name="paymentType"
                    checked={paymentType === "full"}
                    onChange={() => setPaymentType("full")}
                    aria-label="Full Payment"
                  />
                  <span>Pay in Full</span>
                </label>
                <div className="payment-option-details">
                  <span className="payment-price">
                    ₹{course.price.finalPrice.toLocaleString("en-IN")}
                  </span>
                  {course.price.discount > 0 && (
                    <span className="payment-original-price">
                      ₹{course.price.amount.toLocaleString("en-IN")}
                    </span>
                  )}
                  <p>One-time payment for lifetime course access.</p>
                </div>
              </div>

              {/* EMI Payment */}
              {emiDetails?.eligible && (
                <div 
                  className={`payment-option ${paymentType === "emi" ? "selected" : ""}`}
                  onClick={() => setPaymentType("emi")}
                >
                  <label>
                    <input
                      type="radio"
                      name="paymentType"
                      checked={paymentType === "emi"}
                      onChange={() => setPaymentType("emi")}
                      aria-label="EMI Payment"
                    />
                    <span>Pay with EMI</span>
                  </label>
                  <div className="payment-option-details">
                    <p className="payment-price">
                      ₹{emiDetails.monthlyAmount.toLocaleString("en-IN")} / month
                    </p>
                    <p>
                      Total: ₹{emiDetails.totalAmount.toLocaleString("en-IN")}{" "}
                      over {emiDetails.emiPeriod} months
                    </p>
                    {paymentType === "emi" && (
                      <div className="emi-due-date-selector">
                        <label>Select EMI Due Date</label>
                        <select
                          value={emiDueDay}
                          onChange={(e) => setEmiDueDay(parseInt(e.target.value))}
                          aria-label="EMI Due Date"
                        >
                          {[1, 2, 3, 4, 5,6,7,8,9,10,11,12,13,14,15].map((day) => (
                            <option key={day} value={day}>
                              {day}
                              {day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th"} date
                            </option>
                          ))}
                        </select>
                        <p>
                          EMI payments are due on the selected date each month.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="terms-card">
            <h2>Terms & Conditions</h2>
            <ul>
              <li>
                <strong>No Refunds:</strong> All payments, whether full or EMI,
                are non-refundable once processed.
              </li>
              <li>
                <strong>EMI Policy:</strong> ₹
                {emiDetails?.monthlyAmount.toLocaleString("en-IN") || "2,000"}{" "}
                due monthly on your selected date. Non-payment after a 3-day
                grace period will restrict course access until cleared.
              </li>
            </ul>
            <label className="terms-agreement">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                aria-label="Agree to Terms"
              />
              <span>
                I agree to the terms and conditions, including the no-refund
                policy.
              </span>
            </label>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="payment-summary">
          <div className="summary-card">
            <h2>Order Summary</h2>
            <div className="summary-item">
              <span>{course.coursename}</span>
              <span>
                {paymentType === "emi"
                  ? `₹${emiDetails?.monthlyAmount.toLocaleString("en-IN")} x ${
                      emiDetails?.emiPeriod
                    } months`
                  : `₹${course.price.finalPrice.toLocaleString("en-IN")}`}
              </span>
            </div>
            {paymentType === "emi" && (
              <div className="emi-details">
                <div className="summary-row">
                  <span>First Payment</span>
                  <span>Today</span>
                </div>
                <div className="summary-row">
                  <span>Due Date</span>
                  <span>
                    {emiDueDay}
                    {emiDueDay === 1 ? "st" : emiDueDay === 2 ? "nd" : emiDueDay === 3 ? "rd" : "th"} of each month
                  </span>
                </div>
              </div>
            )}
            <div className="summary-total">
              <span>Total</span>
              <span>
                {paymentType === "emi"
                  ? `₹${emiDetails?.monthlyAmount.toLocaleString("en-IN")} (First EMI)`
                  : `₹${course.price.finalPrice.toLocaleString("en-IN")}`}
              </span>
            </div>

            {error && (
              <div className="payment-error">
                <span>{error}</span>
                <button onClick={() => setError("")}>×</button>
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={loading || !agreedToTerms}
              className={`payment-button ${loading || !agreedToTerms ? "disabled" : ""}`}
              aria-label="Complete Purchase"
            >
              {loading ? (
                <div className="payment-button-loading">
                  <div className="payment-spinner"></div>
                  Processing...
                </div>
              ) : paymentType === "emi" ? (
                `Pay ₹${emiDetails?.monthlyAmount.toLocaleString("en-IN")} (First EMI)`
              ) : (
                `Pay ₹${course.price.finalPrice.toLocaleString("en-IN")}`
              )}
            </button>
            <p className="payment-security">
              Secured by <strong>Razorpay</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal.show && (
        <div className="payment-modal-overlay">
          <div className="payment-modal modern-modal">
            <div className={`modal-icon ${modal.isSuccess ? "success" : "error"}`}> 
              {modal.isSuccess ? (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="#E8F5E9"/>
                  <path d="M16 24.5L22 30.5L32 18.5" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="#FFEBEE"/>
                  <path d="M17 31L31 17" stroke="#F44336" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M17 17L31 31" stroke="#F44336" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              )}
            </div>
            <p className="modal-message">{modal.message}</p>
            <button
              onClick={closeModal}
              className="modal-button modern-modal-button"
              aria-label={modal.isSuccess ? "Continue to Course" : "Close Modal"}
            >
              {modal.isSuccess ? "Start Learning Now" : "Close"}
            </button>
          </div>
        </div>
      )}

      {/* CSS Styles */}
      <style jsx>{`
        .payment-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
          background-color: #f8f9fa;
          min-height: 100vh;
          color: #333;
        }
        
        .payment-layout {
          display: flex;
          gap: 32px;
          flex-wrap: wrap;
        }
        
        .payment-main-content {
          flex: 2;
          min-width: 320px;
        }
        
        .payment-summary {
          flex: 1;
          min-width: 300px;
          position: sticky;
          top: 40px;
          align-self: flex-start;
        }
        
        .payment-header {
          margin-bottom: 32px;
        }
        
        .payment-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: #212121;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }
        
        .payment-header p {
          font-size: 16px;
          color: #5f6368;
          line-height: 24px;
          max-width: 600px;
        }
        
        .payment-course-card,
        .payment-options-card,
        .terms-card,
        .summary-card {
          background-color: #ffffff;
          border-radius: 16px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.06);
          margin-bottom: 24px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .payment-course-card:hover,
        .payment-options-card:hover,
        .terms-card:hover,
        .summary-card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }
        
        .payment-course-card {
          padding: 24px;
          display: flex;
          gap: 20px;
          align-items: center;
        }
        
        .course-thumbnail {
          width: 120px;
          height: 72px;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .payment-course-card h3 {
          font-size: 20px;
          font-weight: 600;
          color: #212121;
          margin: 0 0 8px;
        }
        
        .payment-course-card p {
          font-size: 14px;
          color: #5f6368;
          margin: 0;
        }
        
        .payment-options-card,
        .terms-card,
        .summary-card {
          padding: 32px;
        }
        
        .payment-options-card h2,
        .terms-card h2,
        .summary-card h2 {
          font-size: 24px;
          font-weight: 600;
          color: #212121;
          margin-bottom: 24px;
          position: relative;
          padding-bottom: 16px;
        }
        
        .payment-options-card h2::after,
        .terms-card h2::after,
        .summary-card h2::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, #4361EE, #3A56D4);
          border-radius: 2px;
        }
        
        .payment-options-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .payment-option {
          padding: 24px;
          border: 2px solid #E8EAED;
          border-radius: 12px;
          background-color: #ffffff;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .payment-option.selected {
          border-color: #4361EE;
          background-color: #F0F5FF;
          box-shadow: 0 4px 12px rgba(67, 97, 238, 0.15);
        }
        
        .payment-option label {
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
        }
        
        .payment-option input[type="radio"] {
          width: 20px;
          height: 20px;
          accent-color: #4361EE;
        }
        
        .payment-option span {
          font-size: 18px;
          font-weight: 500;
          color: #212121;
        }
        
        .payment-option-details {
          margin-left: 36px;
          margin-top: 16px;
        }
        
        .payment-price {
          font-size: 18px;
          font-weight: 700;
          color: #212121;
          display: block;
          margin-bottom: 8px;
        }
        
        .payment-original-price {
          font-size: 14px;
          color: #9E9E9E;
          text-decoration: line-through;
          margin-left: 12px;
        }
        
        .payment-option p {
          font-size: 14px;
          color: #5f6368;
          margin: 8px 0 0;
          line-height: 20px;
        }
        
        .emi-due-date-selector {
          margin-top: 24px;
        }
        
        .emi-due-date-selector label {
          font-size: 14px;
          font-weight: 500;
          color: #212121;
          display: block;
          margin-bottom: 8px;
        }
        
        .emi-due-date-selector select {
          width: 100%;
          padding: 14px;
          border: 1px solid #E0E0E0;
          border-radius: 10px;
          font-size: 14px;
          color: #212121;
          background-color: #ffffff;
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s ease;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235a5a5a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1em;
        }
        
        .emi-due-date-selector select:focus {
          border-color: #4361EE;
          box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
        }
        
        .terms-card ul {
          list-style: none;
          padding: 0;
          margin: 0 0 24px;
          font-size: 14px;
          color: #5f6368;
          line-height: 22px;
        }
        
        .terms-card li {
          margin-bottom: 16px;
          padding-left: 24px;
          position: relative;
        }
        
        .terms-card li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #4361EE;
          font-size: 18px;
        }
        
        .terms-agreement {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
        }
        
        .terms-agreement input[type="checkbox"] {
          margin-top: 3px;
          width: 20px;
          height: 20px;
          accent-color: #4361EE;
        }
        
        .terms-agreement span {
          font-size: 14px;
          color: #212121;
          line-height: 20px;
        }
        
        .summary-item {
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          color: #5f6368;
          margin-bottom: 16px;
        }
        
        .emi-details {
          margin: 16px 0;
          padding: 16px 0;
          border-top: 1px solid #F0F0F0;
          border-bottom: 1px solid #F0F0F0;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #5f6368;
          margin-bottom: 8px;
        }
        
        .summary-total {
          display: flex;
          justify-content: space-between;
          font-size: 18px;
          font-weight: 700;
          color: #212121;
          padding-top: 16px;
          margin-top: 16px;
          border-top: 1px solid #E8EAED;
        }
        
        .payment-error {
          margin-top: 20px;
          padding: 16px;
          background-color: #FFF0F0;
          border: 1px solid #FFD1D1;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: #D93025;
          animation: fadeIn 0.3s ease;
        }
        
        .payment-error button {
          background: none;
          border: none;
          color: #D93025;
          font-weight: 700;
          cursor: pointer;
          font-size: 18px;
          padding: 0 8px;
        }
        
        .payment-button {
          width: 100%;
          padding: 16px;
          background-color: #4361EE;
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          margin-top: 24px;
          transition: background-color 0.2s ease, transform 0.1s ease;
          box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
        }
        
        .payment-button:hover:not(:disabled) {
          background-color: #3A56D4;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(67, 97, 238, 0.4);
        }
        
        .payment-button:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .payment-button:disabled {
          background-color: #BDBDBD;
          cursor: not-allowed;
          box-shadow: none;
        }
        
        .payment-button-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        
        .payment-security {
          font-size: 12px;
          color: #9E9E9E;
          text-align: center;
          margin-top: 16px;
        }
        
        .payment-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        .payment-loading-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f8f9fa;
        }
        
        .payment-loading-card {
          background-color: #ffffff;
          padding: 48px;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 400px;
          width: 90%;
        }
        
        .payment-loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #F0F5FF;
          border-top-color: #4361EE;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 24px;
        }
        
        .payment-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        
        .modern-modal {
          background: #fff;
          padding: 32px 28px 28px 28px;
          border-radius: 24px;
          max-width: 95vw;
          width: 100%;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          text-align: center;
          margin: 0 12px;
          position: relative;
          animation: fadeIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .modern-modal .modal-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto 18px;
          background: none;
          box-shadow: none;
        }
        .modern-modal .modal-message {
          font-size: 18px;
          color: #212121;
          margin: 0 0 28px;
          line-height: 26px;
        }
        .modern-modal-button {
          width: 100%;
          padding: 16px 0;
          background: linear-gradient(90deg, #4361EE, #3A56D4);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 8px;
          box-shadow: 0 4px 16px rgba(67, 97, 238, 0.18);
          transition: background 0.2s, transform 0.1s;
        }
        .modern-modal-button:active {
          transform: scale(0.98);
        }
        @media (max-width: 600px) {
          .modern-modal {
            padding: 18px 8px 16px 8px;
            border-radius: 16px;
            max-width: 98vw;
            width: 100vw;
            margin: 0 2vw;
          }
          .modern-modal .modal-icon {
            width: 56px;
            height: 56px;
            margin-bottom: 12px;
          }
          .modern-modal .modal-message {
            font-size: 16px;
            margin-bottom: 18px;
          }
          .modern-modal-button {
            font-size: 16px;
            padding: 14px 0;
            border-radius: 10px;
          }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
          .payment-layout {
            flex-direction: column;
          }
          
          .payment-summary {
            position: static;
          }
          
          .payment-header h1 {
            font-size: 28px;
          }
          
          .payment-course-card,
          .payment-options-card,
          .terms-card,
          .summary-card {
            padding: 24px;
          }
          
          .payment-course-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
        }
        
        @media (max-width: 480px) {
          .payment-container {
            padding: 24px 16px;
          }
          
          .payment-header h1 {
            font-size: 24px;
          }
          
          .payment-option-details {
            margin-left: 0;
          }
          
          .payment-option {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentPage;