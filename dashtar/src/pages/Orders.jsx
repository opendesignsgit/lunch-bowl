import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Table,
  TableContainer,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  Button,
} from "@windmill/react-ui";
import PageTitle from "@/components/Typography/PageTitle";
import axios from "axios";

const PAGE_SIZE = 10;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5055/api/orders/get-all/food-order"
        );
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Pagination logic
  const pageCount = Math.ceil(orders.length / PAGE_SIZE);
  const paginatedOrders = orders.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <PageTitle>Orders</PageTitle>
      <Card className="min-w-0 shadow-xs overflow-hidden">
        <CardBody>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <TableContainer>
              <Table>
                <TableHeader>
                  <tr>
                    <TableCell>#</TableCell>
                    <TableCell>Child Name</TableCell>
                    <TableCell>School</TableCell>
                    <TableCell>Lunch Time</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Food</TableCell>
                  </tr>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map((order, idx) => (
                    <TableRow key={order.childId + order.date + order.food}>
                      <TableCell>{(page - 1) * PAGE_SIZE + idx + 1}</TableCell>
                      <TableCell>
                        {order.childFirstName} {order.childLastName}
                      </TableCell>
                      <TableCell>{order.school}</TableCell>
                      <TableCell>{order.lunchTime}</TableCell>
                      <TableCell>{order.location}</TableCell>
                      <TableCell>
                        {new Date(order.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{order.food}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination Controls */}
          {orders.length > 0 && (
            <div
              style={{
                marginTop: "1em",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button
                layout="outline"
                size="small"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                Prev
              </Button>
              <span style={{ margin: "0 1em" }}>
                Page {page} of {pageCount}
              </span>
              <Button
                layout="outline"
                size="small"
                onClick={() => setPage((p) => Math.min(p + 1, pageCount))}
                disabled={page === pageCount}
              >
                Next
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Orders;
