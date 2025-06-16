import React, { useState, useEffect } from 'react';
import {
  HiUsers,
  HiUserGroup,
  HiUserAdd,
  HiOutlineArrowSmUp,
  HiOutlineArrowSmDown,
  HiUserCircle,
  HiCalendar,
} from "react-icons/hi";
import { useSession } from "next-auth/react";
import AccountServices from "@services/AccountServices";
import Mainheader from "@layout/header/Mainheader";
import Mainfooter from "@layout/footer/Mainfooter";

const UserDashboard = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [dashboardData, setDashboardData] = useState({
    parentName: '',
    subscriptionCount: 0,
    subscriptionActive: false,
    subscriptionDates: { start: null, end: null },
    childrenCount: 0,
    recentChildren: [],
    loading: true
  });

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
            end: userData.subscriptionPlan?.endDate || null
          },
          childrenCount: userData.children?.length || 0,
          recentChildren: userData.children?.slice(0, 4) || [],
          loading: false
        });

      } catch (error) {
        console.error("Error fetching user data:", error);
        setDashboardData(prev => ({ ...prev, loading: false }));
      }
    };

    if (userId) fetchUserData();
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (dashboardData.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="steppage">
      <Mainheader title="Dashboard" description="User Dashboard" />
      
      <div className="pagebody">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {dashboardData.parentName}</h1>
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
                <span>Current plan: {dashboardData.subscriptionCount > 0 ? 'Active' : 'None'}</span>
              </div>
            </div>

            {/* Active Subscription Card */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Active Subscription
                  </p>
                  <p className="text-2xl font-semibold text-gray-800">
                    {dashboardData.subscriptionActive ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <HiUserGroup className="w-6 h-6" />
                </div>
              </div>
              {dashboardData.subscriptionDates.start && (
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <HiCalendar className="mr-2" />
                    <span>{formatDate(dashboardData.subscriptionDates.start)}</span>
                    <span className="mx-2">to</span>
                    <span>{formatDate(dashboardData.subscriptionDates.end)}</span>
                  </div>
                </div>
              )}
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
                        <div className="text-sm text-gray-900">{child.school}</div>
                        <div className="text-sm text-gray-500">{child.location}</div>
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
      </div>
      
      <Mainfooter />
    </div>
  );
};

export default UserDashboard;