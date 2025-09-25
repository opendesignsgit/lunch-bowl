import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Chip,
  CircularProgress
} from "@mui/material";
import Mainheader from "@layout/header/Mainheader";
import Mainfooter from "@layout/footer/Mainfooter";
import { useSession } from "next-auth/react";
import useRegistration from "@hooks/useRegistration";

const TransactionHistoryPage = () => {
  const { data: session } = useSession();
  const _id = session?.user?.id;
  const { submitHandler } = useRegistration();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!_id) return;
      
      try {
        const response = await submitHandler({
          path: "get-transaction-history",
          _id,
        });
        
        if (response?.success) {
          setTransactions(response.data || []);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [_id, submitHandler]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const getTransactionType = (transaction) => {
    if (transaction.transactionType === "Renewal") {
      return transaction.planType; // "Renewal" or "Add Children"
    }
    if (transaction.transactionId?.includes("RENEWAL")) return "Renewal";
    if (transaction.transactionId?.includes("ADD_CHILD")) return "Add Children";
    return "Subscription";
  };

  const formatChildrenList = (childrenCovered) => {
    if (!childrenCovered || childrenCovered.length === 0) {
      return "No children specified";
    }
    if (childrenCovered.length <= 2) {
      return childrenCovered.join(", ");
    }
    return `${childrenCovered.slice(0, 2).join(", ")} +${childrenCovered.length - 2} more`;
  };

  if (loading) {
    return (
      <div className="steppage">
        <Mainheader
          title="Transaction History"
          description="View your payment history"
        />
        <div className="pagebody">
          <Box className="container mx-auto py-8 text-center">
            <CircularProgress />
            <Typography className="mt-4">Loading transaction history...</Typography>
          </Box>
        </div>
        <Mainfooter />
      </div>
    );
  }

  return (
    <div className="steppage">
      <Mainheader
        title="Transaction History"
        description="View your payment history"
      />

      <div className="pagebody">
        <Box className="container mx-auto py-8">
          <Card>
            <CardContent>
              <Typography variant="h5" className="mb-6">
                Transaction History
              </Typography>
              
              {transactions.length === 0 ? (
                <Box className="text-center py-8">
                  <Typography variant="h6" color="textSecondary">
                    No transactions found
                  </Typography>
                  <Typography color="textSecondary" className="mt-2">
                    Your payment history will appear here once you make transactions.
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Transaction ID</strong></TableCell>
                        <TableCell><strong>Type</strong></TableCell>
                        <TableCell><strong>Children Covered</strong></TableCell>
                        <TableCell><strong>Plan Type</strong></TableCell>
                        <TableCell><strong>Amount</strong></TableCell>
                        <TableCell><strong>Date & Time</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions.map((transaction, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Typography variant="body2" fontFamily="monospace">
                              {transaction.transactionId || transaction.orderId || "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={getTransactionType(transaction)} 
                              size="small" 
                              variant="outlined"
                              color={transaction.transactionType === "Renewal" ? "primary" : "default"}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatChildrenList(transaction.childrenCovered)}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              ({transaction.childrenCount || 0} child{(transaction.childrenCount || 0) !== 1 ? 'ren' : ''})
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {transaction.planType || "Standard"}
                            </Typography>
                            {transaction.renewalDetails && (
                              <Typography variant="caption" color="textSecondary" display="block">
                                {transaction.renewalDetails.workingDays} working days
                                {transaction.renewalDetails.offerApplied && ` • ${transaction.renewalDetails.offerApplied}`}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="bold">
                              ₹{transaction.amount?.toLocaleString('en-IN') || "0.00"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(transaction.paymentDate)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={transaction.status || "Pending"}
                              color={getStatusColor(transaction.status)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Box>
      </div>

      <Mainfooter />
    </div>
  );
};

export default TransactionHistoryPage;