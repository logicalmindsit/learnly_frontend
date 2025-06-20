import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBook,
  FiTrendingUp,
  FiAward,
  FiActivity,
  FiDollarSign,
  FiUser,
  FiChevronRight
} from "react-icons/fi";

const MainDashBoard = () => {
  const navigate = useNavigate();

  const items = [
    { name: "Lesson Status", path: "/lesson-status", icon: <FiBook /> },
    { name: "Performance Record", path: "/performance-record", icon: <FiTrendingUp /> },
    { name: "Exam Mark Record", path: "/Examrecord", icon: <FiAward /> },
    { name: "Practice Class Record", path: "/pratice", icon: <FiActivity /> },
    { name: "Fees Record", path: "/payment", icon: <FiDollarSign /> },
    { name: "Profile", path: "/profile", icon: <FiUser /> },
  ];

  const handleItemClick = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p>Access your learning resources and records</p>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-card">
          {items.map((item, index) => (
            <div
              key={index}
              className="dashboard-item"
              onClick={() => handleItemClick(item.path)}
            >
              <div className="item-icon">{item.icon}</div>
              <div className="item-text">{item.name}</div>
              <div className="item-arrow">
                <FiChevronRight />
              </div>
            </div>
          ))}
        </div>
        
        <div className="dashboard-image">
          <img 
            src="https://i.postimg.cc/k4YrL54T/yoga.jpg" 
            alt="Education illustration" 
          />
        </div>
      </div>
    </div>
  );
};

export default MainDashBoard;

// CSS (can be placed in a separate file or using CSS-in-JS)
const styles = `
  .dashboard-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f9ff 0%, #e6f0ff 100%);
    padding: 2rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .dashboard-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }
  
  .dashboard-header h1 {
    color: #1a3e72;
    font-size: 2.2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .dashboard-header p {
    color: #5a7eb5;
    font-size: 1rem;
    margin: 0;
  }
  
  .dashboard-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 3rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .dashboard-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 82, 190, 0.1);
    padding: 1.5rem;
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .dashboard-item {
    display: flex;
    align-items: center;
    padding: 1rem 1.25rem;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(234, 242, 255, 0.5);
  }
  
  .dashboard-item:hover {
    background: rgba(0, 102, 245, 0.1);
    transform: translateY(-2px);
  }
  
  .item-icon {
    color: #0066f5;
    font-size: 1.25rem;
    margin-right: 1rem;
    display: flex;
    align-items: center;
  }
  
  .item-text {
    color: #1a3e72;
    font-weight: 500;
    font-size: 1rem;
    flex-grow: 1;
  }
  
  .item-arrow {
    color: #5a7eb5;
    font-size: 1.1rem;
  }
  
  .dashboard-image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 500px;
  }
  
  .dashboard-image img {
    width: 100%;
    height: auto;
    max-width: 400px;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .dashboard-container {
      padding: 1.5rem;
    }
    
    .dashboard-header h1 {
      font-size: 1.8rem;
    }
    
    .dashboard-content {
      gap: 2rem;
    }
    
    .dashboard-card {
      padding: 1rem;
    }
    
    .dashboard-item {
      padding: 0.9rem 1rem;
    }
  }
  
  @media (max-width: 480px) {
    .dashboard-container {
      padding: 1rem;
    }
    
    .dashboard-header h1 {
      font-size: 1.5rem;
    }
    
    .dashboard-header p {
      font-size: 0.9rem;
    }
    
    .item-text {
      font-size: 0.9rem;
    }
    
    .item-icon {
      font-size: 1.1rem;
      margin-right: 0.75rem;
    }
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);