import React, { useState, useEffect } from 'react';
import {
  HiUsers,
  HiUserGroup,
  HiUserAdd,
  HiUserCircle,
  HiCalendar,
} from "react-icons/hi";
import { useSession } from "next-auth/react";
import AccountServices from "@services/AccountServices";
import { Button } from "@mui/material";
import Mainheader from "@layout/header/Mainheader";
import Mainfooter from "@layout/footer/Mainfooter";
import SubscriptionPlanStep from "@components/profile-Step-Form/subscriptionPlanStep";

const UserDashboard = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [dashboardData, setDashboardData] = useState({
    parentName: "",
    subscriptionCount: 0,
    subscriptionActive: false,
    subscriptionDates: { start: null, end: null },
    childrenCount: 0,
    recentChildren: [],
    loading: true,
  });
  const [showRenewalForm, setShowRenewalForm] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await AccountServices.getAccountDetails(userId);
        const userData = response.data;

        setDashboardData({
          parentName: `${userData.parentDetails.fatherFirstName} ${userData.parentDetails.fatherLastName}`,
          subscriptionCount: userData.subscriptionCount || 0,
          subscriptionActive: userData.paymentStatus || false,
          subscriptionDates: {
            start: userData.subscriptionPlan?.startDate || null,
            end: userData.subscriptionPlan?.endDate || null,
          },
          childrenCount: userData.children?.length || 0,
          recentChildren: userData.children?.slice(0, 4) || [],
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setDashboardData((prev) => ({ ...prev, loading: false }));
      }
    };

    if (userId) fetchUserData();
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // TEMPORARY FOR TESTING - Always return true to show renew button
  const isSubscriptionExpired = () => {
    return true; // Force show renew button for testing
    // Original implementation:
    // if (!dashboardData.subscriptionDates.end) return true;
    // const endDate = new Date(dashboardData.subscriptionDates.end);
    // return endDate < new Date();
  };

  const handleRenewSuccess = () => {
    setShowRenewalForm(false);
    // Refresh data after renewal
    const fetchUserData = async () => {
      const response = await AccountServices.getAccountDetails(userId);
      const userData = response.data;
      setDashboardData((prev) => ({
        ...prev,
        subscriptionCount: userData.subscriptionCount || 0,
        subscriptionActive: userData.paymentStatus || false,
        subscriptionDates: {
          start: userData.subscriptionPlan?.startDate || null,
          end: userData.subscriptionPlan?.endDate || null,
        },
        loading: false,
      }));
    };
    fetchUserData();
  };

  if (dashboardData.loading) {
    return (
      <div className="steppage">
        <Mainheader title="Dashboard" description="User Dashboard" />
        <div className="pagebody">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
        <Mainfooter />
      </div>
    );
  }

  return (
    <div className="steppage">
      <Mainheader title="Dashboard" description="User Dashboard" />

      <div className="pagebody">
        {showRenewalForm ? (
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setShowRenewalForm(false)}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Back to Dashboard
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Renew Your Subscription
              </h2>
              <SubscriptionPlanStep
                nextStep={handleRenewSuccess}
                prevStep={() => setShowRenewalForm(false)}
                _id={userId}
              />
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome, {dashboardData.parentName}
            </h1>
            <p className="text-gray-600 mb-8">Here's your account overview</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Subscriptions Card */}
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Subscriptions
                    </p>
                    <p className="text-2xl font-semibold text-gray-800">
                      {dashboardData.subscriptionCount}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <HiUsers className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <span>
                    Current plan:{" "}
                    {dashboardData.subscriptionCount > 0 ? "Active" : "None"}
                  </span>
                </div>
              </div>

              {/* Renew Subscription Button (forced to show for testing) */}
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500 flex flex-col items-center justify-center">
                <div className="text-center mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Your subscription has expired
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    Renew to continue
                  </p>
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => setShowRenewalForm(true)}
                >
                  Renew Subscription
                </Button>
              </div>

              {/* Children Card */}
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Registered Children
                    </p>
                    <p className="text-2xl font-semibold text-gray-800">
                      {dashboardData.childrenCount}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <HiUserAdd className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <span>Most recent additions</span>
                </div>
              </div>
            </div>

            {/* Children Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  Your Children ({dashboardData.childrenCount})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        School
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lunch Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.recentChildren.map((child, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <HiUserCircle className="h-10 w-10 text-gray-400" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {child.childFirstName} {child.childLastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(child.dob)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {child.school}
                          </div>
                          <div className="text-sm text-gray-500">
                            {child.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {child.childClass} - {child.section}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {child.lunchTime}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <Mainfooter />
    </div>
  );
};

export default UserDashboard;