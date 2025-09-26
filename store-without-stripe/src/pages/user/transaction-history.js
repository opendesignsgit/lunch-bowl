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
import Image from "next/image";
import Mainheader from "@layout/header/Mainheader";
import Mainfooter from "@layout/footer/Mainfooter";
import { useSession } from "next-auth/react";
import useRegistration from "@hooks/useRegistration";
import abbanicon1 from "../../../public/enterrequireddetails/redroundedandlines.svg";
import abbanicon2 from "../../../public/enterrequireddetails/yellowroundedflower.svg";
import abbanicon3 from "../../../public/enterrequireddetails/redlittleheart.svg";
import abbanicon4 from "../../../public/enterrequireddetails/lighergreenarrow.svg";
import abbanicon5 from "../../../public/enterrequireddetails/violetyellow-star.svg";
import abbanicon6 from "../../../public/enterrequireddetails/redtriangle.svg";
import abbanicon7 from "../../../public/enterrequireddetails/redlittleflower.svg";
import abbanicon8 from "../../../public/enterrequireddetails/layerflower.svg";

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
      <div className="transhistorypage samepagedesingss">
        <Mainheader title="Transaction History" description="View your payment history" />
        <div className="pagebody"> 
        <section className="pagebansec setpbanersec relative">
          <div className="container mx-auto relative h-full">
            <div className="pageinconter relative h-full w-full flex items-center justify-center text-center">
              <div className="hworkTitle combtntb comtilte relative">
                <h1 className="flex flex-row textFF6514">
                  <span className="block firstspan">Enter Required </span>
                  <span className="block ml-2">Details</span>
                </h1>
                <p>
                  We have got you covered. Let us cover you by filling in the
                  details below.
                </p>
                <div className="psfbanIconss">
                  <div className="psfbanicn iconone absolute">
                    <Image src={abbanicon1} priority alt="Icon" className="iconrotates" />
                  </div>
                  <div className="psfbanicn icontwo absolute">
                    <Image src={abbanicon2} priority alt="Icon" className="iconrotates" />
                  </div>
                  <div className="psfbanicn iconthree absolute">
                    <Image src={abbanicon3} priority alt="Icon" className="iconrubberband" />
                  </div>
                  <div className="psfbanicn iconfour absolute">
                    <Image src={abbanicon4} priority alt="Icon" />
                  </div>
                  <div className="psfbanicn iconfive absolute">
                    <Image src={abbanicon5} priority alt="Icon" />
                  </div>
                  <div className="psfbanicn iconsix absolute">
                    <Image src={abbanicon6} priority alt="Icon" className="iconrotates" />
                  </div>
                  <div className="psfbanicn iconseven absolute">
                    <Image src={abbanicon7} priority alt="Icon" className="iconrotates" />
                  </div>
                  <div className="psfbanicn iconeight absolute">
                    <Image src={abbanicon8} priority alt="Icon" className="iconrotates" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
          <Box className="loadsec">
            <div className="container mx-auto">
              <CircularProgress />
              <Typography className="mt-4">Loading transaction history...</Typography>
            </div>
          </Box>
        </div>
        <Mainfooter />
      </div>
    );
  }

  return (
    <div className="transhistorypage samepagedesingss">
      <Mainheader title="Transaction History" description="View your payment history"/>
      
      <div className="pagebody">        
        <section className="pagebansec setpbanersec relative">
          <div className="container mx-auto relative h-full">
            <div className="pageinconter relative h-full w-full flex items-center justify-center text-center">
              <div className="hworkTitle combtntb comtilte relative">
                <h1 className="flex flex-row textFF6514">
                  <span className="block firstspan">Enter Required </span>
                  <span className="block ml-2">Details</span>
                </h1>
                <p>
                  We have got you covered. Let us cover you by filling in the
                  details below.
                </p>
                <div className="psfbanIconss">
                  <div className="psfbanicn iconone absolute">
                    <Image src={abbanicon1} priority alt="Icon" className="iconrotates" />
                  </div>
                  <div className="psfbanicn icontwo absolute">
                    <Image src={abbanicon2} priority alt="Icon" className="iconrotates" />
                  </div>
                  <div className="psfbanicn iconthree absolute">
                    <Image src={abbanicon3} priority alt="Icon" className="iconrubberband" />
                  </div>
                  <div className="psfbanicn iconfour absolute">
                    <Image src={abbanicon4} priority alt="Icon" />
                  </div>
                  <div className="psfbanicn iconfive absolute">
                    <Image src={abbanicon5} priority alt="Icon" />
                  </div>
                  <div className="psfbanicn iconsix absolute">
                    <Image src={abbanicon6} priority alt="Icon" className="iconrotates" />
                  </div>
                  <div className="psfbanicn iconseven absolute">
                    <Image src={abbanicon7} priority alt="Icon" className="iconrotates" />
                  </div>
                  <div className="psfbanicn iconeight absolute">
                    <Image src={abbanicon8} priority alt="Icon" className="iconrotates" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <Box className="transhistrySec secpaddblock">
          <div className="container mx-auto">
            <Card className="transhistryBox">
              <CardContent className="transhistryCol">
                <h4>Transaction History</h4>
                
                {transactions.length === 0 ? (
                  <Box className="text-center transhistryNO">
                    <h6> No transactions found </h6>
                    <p>Your payment history will appear here once you make transactions.</p>
                  </Box>
                ) : (
                  <TableContainer component={Paper} className="transhistryTableBox">
                    <Table className="transhistryTable">
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
          </div>
        </Box>
      </div>

      <Mainfooter />
    </div>
  );
};

export default TransactionHistoryPage;