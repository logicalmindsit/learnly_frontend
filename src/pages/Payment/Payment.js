import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch course detail
    fetch(`https://learnly-backend-05ix.onrender.com/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCourse(data.data));
  }, [courseId]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Failed to load Razorpay script");
      setLoading(false);
      return;
    }

    // Step 1: Create order
    const createResponse = await fetch("https://learnly-backend-05ix.onrender.com/user/payment/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        courseId: courseId,
        amount: course.price.finalPrice,
        paymentMethod: "CARD"
      })
    });

    const { order, paymentId } = await createResponse.json();

    if (!order) {
      alert("Error creating Razorpay order");
      setLoading(false);
      return;
    }
console.log("Razorpay Key ID:", process.env.REACT_APP_RAZORPAY_KEY_ID);

    const options = {
        // key: process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay key_id or use env
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,

      amount: order.amount,
      currency: order.currency,
      name: "Course Payment",
      description: course.coursename,
      order_id: order.id,
      handler: async function (response) {
        const verifyResponse = await fetch("https://learnly-backend-05ix.onrender.com/user/payment/verify", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            paymentId: paymentId
          })
        });

        const verifyData = await verifyResponse.json();
        if (verifyData.success) {
          alert("Payment successful! Course enrolled.");
          navigate(`/course/${courseId}/content`);
        } else {
          alert("Payment verification failed.");
        }
      },
      prefill: {
        name: "", email: "", contact: ""
      },
      theme: {
        color: "#3399cc"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  if (!course) return <div style={{ padding: "20px" }}>Loading...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2 style={{ marginBottom: "10px" }}>{course.coursename}</h2>
      <img src={course.thumbnail} alt={course.coursename} style={{ width: "100%", borderRadius: "8px", marginBottom: "20px" }} />
      <p>Price: ₹{course.price.finalPrice}</p>
      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          padding: "12px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginTop: "20px",
          width: "100%",
          fontSize: "16px"
        }}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default PaymentPage;
