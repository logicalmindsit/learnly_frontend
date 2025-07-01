import React, { useEffect, useState } from "react";
import { useNavigate  } from "react-router-dom";
import styled, { css } from "styled-components";

const PaymentPages = () => {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({});
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const limit = 5;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://learnly-backend-05ix.onrender.com/user/payment?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data.success) {
          setPayments(data.data.payments);
          setSummary(data.data.summary);
          setPagination(data.data.pagination);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to fetch payment history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [page]);

  // Format currency with proper symbols
  const formatCurrency = (amount, currency) => {
    if (currency === "USD") return `$${amount.toFixed(2)}`;
    return `₹${amount.toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Container>
      <Header>
         <HeaderTop>
          <BackButton onClick={() => navigate(-1)}>
           <BackCircle>
              <BackArrow viewBox="0 0 24 24">
                <path d="M15 18L9 12L15 6" />
              </BackArrow>
            </BackCircle>
           <BackText>Back</BackText>
          </BackButton>
        </HeaderTop>
        <h1>Payment History</h1>
        <p>View all your transaction details and payment history</p>
      </Header>
      
      {loading ? (
        <LoadingContainer>
          <Spinner />
          <p>Loading your payment history...</p>
        </LoadingContainer>
      ) : error ? (
        <ErrorContainer>
          <ErrorIcon>!</ErrorIcon>
          <p>{error}</p>
        </ErrorContainer>
      ) : payments.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📭</EmptyIcon>
          <h3>No payment history found</h3>
          <p>Your payment records will appear here once you make a transaction</p>
        </EmptyState>
      ) : (
        <>
          {/* Summary Cards */}
          <SummaryGrid>
            <SummaryCard>
              <SummaryTitle>Total Payments</SummaryTitle>
              <SummaryValue>{summary.totalPayments || 0}</SummaryValue>
              <SummaryTrend positive>
                <span>All transactions</span>
              </SummaryTrend>
            </SummaryCard>
            
            <SummaryCard accent="primary">
              <SummaryTitle>Total Spent</SummaryTitle>
              <SummaryValue>
                {summary.totalSpent && summary.totalSpent[0]?.total 
                  ? formatCurrency(summary.totalSpent[0].total, "INR") 
                  : formatCurrency(0, "INR")}
              </SummaryValue>
              <SummaryTrend positive>
                <span>Total amount paid</span>
              </SummaryTrend>
            </SummaryCard>
            
            <SummaryCard accent="success">
              <SummaryTitle>Completed</SummaryTitle>
              <SummaryValue>{summary.completed || 0}</SummaryValue>
              <SummaryTrend positive>
                <span>Successful payments</span>
              </SummaryTrend>
            </SummaryCard>
            
            <SummaryCard accent="warning">
              <SummaryTitle>Pending</SummaryTitle>
              <SummaryValue>{summary.pending || 0}</SummaryValue>
              <SummaryTrend>
                <span>Awaiting confirmation</span>
              </SummaryTrend>
            </SummaryCard>
          </SummaryGrid>

          {/* Payment Cards */}
          <PaymentList>
            {payments.map((payment) => (
              <PaymentCard key={payment._id}>
                <PaymentHeader>
                  <div>
                    <CourseTitle>{payment.courseId?.coursename || payment.courseName}</CourseTitle>
                    <PaymentDate>{formatDate(payment.createdAt)}</PaymentDate>
                  </div>
                  <PaymentAmount>
                    {formatCurrency(payment.amount, payment.currency)}
                  </PaymentAmount>
                </PaymentHeader>
                
                <PaymentDetails>
                  <DetailItem>
                    <DetailLabel>Status</DetailLabel>
                    <Badge status={payment.paymentStatus}>
                      {payment.paymentStatus}
                    </Badge>
                  </DetailItem>
                  
                  <DetailItem>
                    <DetailLabel>Payment Method</DetailLabel>
                    <DetailValue>
                      {payment.paymentMethod.replace(/_/g, ' ')}
                    </DetailValue>
                  </DetailItem>
                  
                  <DetailItem>
                    <DetailLabel>Transaction ID</DetailLabel>
                    <DetailValue>
                      {payment.transactionId}
                    </DetailValue>
                  </DetailItem>
                </PaymentDetails>
              </PaymentCard>
            ))}
          </PaymentList>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination>
              <PaginationButton 
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </PaginationButton>
              
              <PageIndicator>
                Page {page} of {pagination.totalPages}
              </PageIndicator>
              
              <PaginationButton
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
              >
                Next
              </PaginationButton>
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #2d3748;

  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const Header = styled.div`
  margin-bottom: 2.5rem;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1rem;
    color: #718096;
  }

  @media (min-width: 768px) {
    h1 {
      font-size: 2.5rem;
    }
  }
`;

const HeaderTop = styled.div`
  width: 100%;
  margin-bottom: 1rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #4f46e5;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 0;
  transition: color 0.2s;

  &:hover {
    color: #4338ca;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const BackCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  transition: all 0.2s ease;
`;

const BackArrow = styled.svg`
  width: 20px;
  height: 20px;
  color: #4f46e5;
  transition: all 0.2s ease;
`;

const BackText = styled.span`
  font-weight: 500;
  color: #64748b;
  transition: all 0.2s ease;
`;
const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const SummaryCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid ${props => {
    if (props.accent === 'primary') return '#4f46e5';
    if (props.accent === 'success') return '#10b981';
    if (props.accent === 'warning') return '#f59e0b';
    return '#6b7280';
  }};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
`;

const SummaryTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #718096;
  margin-bottom: 0.5rem;
`;

const SummaryValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const SummaryTrend = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: ${props => props.positive ? '#10b981' : '#ef4444'};

  span {
    color: #718096;
  }
`;

const PaymentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PaymentCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e2e8f0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
`;

const PaymentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const CourseTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.25rem;
`;

const PaymentDate = styled.div`
  font-size: 0.875rem;
  color: #718096;
`;

const PaymentAmount = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  white-space: nowrap;
`;

const PaymentDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const DetailItem = styled.div`
  margin-bottom: 0;
`;

const DetailLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #718096;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DetailValue = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #2d3748;
`;

const Badge = styled.div`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  color: white;
  background-color: ${props => {
    switch(props.status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  }};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 3rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background-color: #4f46e5;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  transition: background-color 0.2s;
  min-width: 100px;

  &:hover {
    background-color: #4338ca;
  }

  &:disabled {
    background-color: #e2e8f0;
    color: #a0aec0;
    cursor: not-allowed;
  }
`;

const PageIndicator = styled.span`
  font-size: 0.875rem;
  color: #4a5568;
  margin: 0 0.5rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  gap: 1rem;
  color: #4a5568;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #4f46e5;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fee2e2;
  padding: 1.5rem;
  border-radius: 8px;
  color: #b91c1c;
  margin: 2rem 0;
`;

const ErrorIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #b91c1c;
  color: white;
  font-weight: bold;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #718096;

  h3 {
    font-size: 1.25rem;
    color: #4a5568;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.875rem;
  }
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

export default PaymentPages;