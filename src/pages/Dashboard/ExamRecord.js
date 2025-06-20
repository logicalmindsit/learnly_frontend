import React, { useEffect, useState } from "react";
import axios from "axios";

const ExamRecord = ({ courseId = "", examId = "" }) => {
  const [attempts, setAttempts] = useState([]);
  const [message, setMessage] = useState("");
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [expandedAttempt, setExpandedAttempt] = useState(null);

  const fetchExamAttempts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get("https://learnly-backend-05ix.onrender.com/user/exam/result", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          courseId,
          examId,
          page,
          limit,
        },
      });

      const { data, message, pagination } = response.data;
      setAttempts(data);
      setMessage(message);
      setPagination(pagination);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to fetch exam attempts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamAttempts();
  }, [page]);

  const styles = {
    container: {
      maxWidth: "960px",
      margin: "20px auto",
      padding: "20px",
      borderRadius: "12px",
      backgroundColor: "#f1f5f9",
      fontFamily: "'Segoe UI', sans-serif",
    },
    title: {
      fontSize: "26px",
      fontWeight: "600",
      marginBottom: "20px",
      color: "#1e3a8a",
      textAlign: "center",
    },
    card: {
      border: "1px solid #e2e8f0",
      borderRadius: "10px",
      padding: "16px",
      marginBottom: "16px",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    },
    attemptHeader: {
      display: "flex",
      flexDirection: "column",
      rowGap: "6px",
      fontSize: "16px",
      color: "#1e293b",
    },
    marks: {
      fontSize: "15px",
      fontWeight: "500",
      color: "#0f766e",
    },
    dropdownButton: {
      marginTop: "12px",
      padding: "10px 18px",
      fontSize: "14px",
      fontWeight: "500",
      border: "none",
      backgroundColor: "#1e3a8a",
      color: "#ffffff",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    },
    answerItem: {
      marginTop: "12px",
      fontSize: "15px",
      lineHeight: "1.6",
      padding: "14px",
      backgroundColor: "#f9fafb",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
    },
    correct: {
      color: "#16a34a",
      fontWeight: "bold",
    },
    wrong: {
      color: "#dc2626",
      fontWeight: "bold",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "12px",
      marginTop: "30px",
      flexWrap: "wrap",
    },
    button: {
      padding: "8px 16px",
      borderRadius: "8px",
      border: "none",
      backgroundColor: "#1e3a8a",
      color: "#fff",
      fontWeight: "500",
      cursor: "pointer",
      transition: "0.3s",
    },
    disabledButton: {
      backgroundColor: "#cbd5e1",
      cursor: "not-allowed",
    },
    message: {
      textAlign: "center",
      fontSize: "16px",
      color: "#475569",
      marginTop: "20px",
    },
  };

  const toggleAnswers = (index) => {
    setExpandedAttempt(expandedAttempt === index ? null : index);
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>📘 Your Exam Attempts</div>

      {loading ? (
        <p style={styles.message}>Loading...</p>
      ) : attempts.length > 0 ? (
        attempts.map((attempt, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.attemptHeader}>
              <span><strong>Chapter:</strong> {attempt.chapterTitle}</span>
              <span><strong>Date:</strong> {new Date(attempt.attemptedAt).toLocaleString()}</span>
              <span style={styles.marks}>
                ✅ Marks: {attempt.obtainedMarks} / {attempt.totalMarks}
              </span>
            </div>

            <button
              onClick={() => toggleAnswers(index)}
              style={styles.dropdownButton}
            >
              {expandedAttempt === index ? "Hide Answers" : "Show Answers"}
            </button>

            {expandedAttempt === index && (
              <div>
                {attempt.answers.map((ans, idx) => (
                  <div key={idx} style={styles.answerItem}>
                    <div><strong>Q:</strong> {ans.question}</div>
                    <div>
                      <strong>Your Answer:</strong> {ans.selectedAnswer} –{" "}
                      <span style={ans.isCorrect ? styles.correct : styles.wrong}>
                        {ans.isCorrect ? "Correct" : "Wrong"}
                      </span>
                    </div>
                    <div><strong>Marks Awarded:</strong> {ans.marksAwarded}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p style={styles.message}>{message}</p>
      )}

      {pagination?.totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            style={{
              ...styles.button,
              ...(page === 1 ? styles.disabledButton : {}),
            }}
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ⬅️ Previous
          </button>

          <span style={{ fontSize: "15px", fontWeight: "500" }}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            style={{
              ...styles.button,
              ...(page === pagination.totalPages ? styles.disabledButton : {}),
            }}
            disabled={page === pagination.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next ➡️
          </button>
        </div>
      )}
    </div>
  );
};

export default ExamRecord;

