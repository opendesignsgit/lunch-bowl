import React, { useEffect, useState, useRef } from "react";
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
  Input,
} from "@windmill/react-ui";
import PageTitle from "@/components/Typography/PageTitle";
import axios from "axios";

const PAGE_SIZE = 10;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search states
  const [childName, setChildName] = useState("");
  const [date, setDate] = useState("");

  const childNameRef = useRef(null);
  const dateRef = useRef(null);

  // Fetch orders function (search or get all based on if filters are used)
  const fetchOrders = async (
    pageNumber = 1,
    childNameVal = "",
    dateVal = ""
  ) => {
    setLoading(true);
    setError(null);
    try {
      let url;
      const params = new URLSearchParams({
        page: pageNumber,
        limit: PAGE_SIZE,
      });
      if (childNameVal) params.append("childName", childNameVal);
      if (dateVal) params.append("date", dateVal);

      // Use search API if filters applied, else use get-all API
      if (childNameVal || dateVal) {
        url = `http://localhost:5055/api/orders/search?${params.toString()}`;
      } else {
        url = `http://localhost:5055/api/orders/get-all/food-order?${params.toString()}`;
      }

      const response = await axios.get(url);
      setOrders(response.data.orders || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Initial and page change effect
  useEffect(() => {
    fetchOrders(page, childName, date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders(1, childName, date);
  };

  // Reset search
  const handleReset = () => {
    setChildName("");
    setDate("");
    if (childNameRef.current) childNameRef.current.value = "";
    if (dateRef.current) dateRef.current.value = "";
    setPage(1);
    fetchOrders(1, "", "");
  };

  const pageCount = Math.ceil((total || 0) / PAGE_SIZE);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <PageTitle>Orders</PageTitle>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form
            onSubmit={handleSearch}
            className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
          >
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                ref={childNameRef}
                type="search"
                name="childName"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Search by Child Name"
                className="mb-2"
              />
            </div>
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                ref={dateRef}
                type="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mb-2"
              />
            </div>
            <div className="flex items-center gap-2 flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Button type="submit" className="h-12 w-full bg-emerald-700">
                Filter
              </Button>
              <Button
                layout="outline"
                onClick={handleReset}
                type="reset"
                className="px-4 md:py-1 py-2 h-12 text-sm dark:bg-gray-700"
              >
                <span className="text-black dark:text-gray-200">Reset</span>
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card className="min-w-0 shadow-xs overflow-hidden">
        <CardBody>
          {Array.isArray(orders) && orders.length === 0 ? (
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
                  {orders.map((order, idx) => (
                    <TableRow key={order.childId + order.date + order.food}>
                      <TableCell>{(page - 1) * PAGE_SIZE + idx + 1}</TableCell>
                      <TableCell>
                        {order.childFirstName} {order.childLastName}
                      </TableCell>
                      <TableCell>{order.school}</TableCell>
                      <TableCell>{order.lunchTime}</TableCell>
                      <TableCell>{order.location}</TableCell>
                      <TableCell>
                        {order.date
                          ? new Date(order.date).toLocaleDateString()
                          : ""}
                      </TableCell>
                      <TableCell>{order.food}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination Controls */}
          {total > 0 && (
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
