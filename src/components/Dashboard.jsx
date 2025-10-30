import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, HandCoins, WalletMinimal, CreditCard } from "lucide-react";
import { useAppContext } from '../context/context';
import dashboardAPI from '../api/dashboard';
import toast from 'react-hot-toast';

const Dashboard = ({ showPage }) => {
  const { internalActiveSection } = useAppContext();
  
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Category icons mapping
  const CATEGORY_ICONS = {
    'Shopping': '🛍️',
    'Travel': '✈️',
    'Salary': '💼',
    'Electricity Bill': '💡',
    'Loan Repayment': '🏦',
    'Food & Dining': '🍔',
    'Transportation': '🚗',
    'Bills & Utilities': '💡',
    'Entertainment': '🎬',
    'Healthcare': '🏥',
    'Education': '📚',
    'Rent': '🏠',
    'Interest from Savings': '💰',
    'E-commerce Sales': '🛒',
    'Graphing Design': '🎨',
    'Affiliate Marketing': '📈',
    'Others': '📝',
  };

  // Load dashboard data on mount
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await dashboardAPI.getDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to load dashboard', err);
        toast.error(err?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    if (internalActiveSection === "Dashboard") {
      loadDashboard();
    }
  }, [internalActiveSection]);

  // Helper function to get icon
  const getIcon = (category) => {
    return CATEGORY_ICONS[category] || '📝';
  };

  // Prepare chart data for Financial Overview (Pie Chart)
  const financialOverviewData = dashboardData ? [
    { name: "Total Balance", value: Math.abs(dashboardData.totalBalance), color: "#6B46C1" },
    { name: "Total Expenses", value: dashboardData.totalExpenses, color: "#EF4444" },
    { name: "Total Income", value: dashboardData.totalIncome, color: "#F97316" },
  ] : [];

  // Prepare data for Last 30 Days Expenses Bar Chart
  const last30DaysExpensesData = dashboardData?.last30DaysExpenses?.transactions
    ? dashboardData.last30DaysExpenses.transactions
        .reduce((acc, txn) => {
          const existing = acc.find(item => item.name === txn.category);
          if (existing) {
            existing.Amount += txn.amount;
          } else {
            acc.push({ name: txn.category, Amount: txn.amount });
          }
          return acc;
        }, [])
    : [];

  const last60DaysIncomeData = dashboardData?.last60DaysIncome?.transactions
    ? dashboardData.last60DaysIncome.transactions
        .reduce((acc, txn) => {
          const existing = acc.find(item => item.name === txn.category);
          if (existing) {
            existing.value += txn.amount;
          } else {
            acc.push({ 
              name: txn.category, 
              value: txn.amount,
              color: `#${Math.floor(Math.random()*16777215).toString(16)}`
            });
          }
          return acc;
        }, [])
    : [];

  const recentTransactions = dashboardData?.recentTransactions
    ? dashboardData.recentTransactions.map(txn => ({
        id: txn._id,
        name: txn.category,
        date: new Date(txn.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        amount: txn.type === 'income' ? txn.amount : -Math.abs(txn.amount),
        icon: getIcon(txn.category)
      }))
    : [];

  // Format expenses (last 30 days)
  const expenses = dashboardData?.last30DaysExpenses?.transactions
    ? dashboardData.last30DaysExpenses.transactions
        .slice(0, 4)
        .map(txn => ({
          id: txn._id,
          name: txn.category,
          date: new Date(txn.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
          amount: -Math.abs(txn.amount),
          icon: getIcon(txn.category)
        }))
    : [];

  // Format income (last 60 days)
  const income = dashboardData?.last60DaysIncome?.transactions
    ? dashboardData.last60DaysIncome.transactions
        .slice(0, 5)
        .map(txn => ({
          id: txn._id,
          name: txn.category,
          date: new Date(txn.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
          amount: txn.amount,
          icon: getIcon(txn.category)
        }))
    : [];

  if (loading) {
    return (
      <div className={`w-full h-screen flex items-center justify-center bg-gray-50 ${internalActiveSection === "Dashboard" ? "flex" : "hidden"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className={`w-full h-screen flex items-center justify-center bg-gray-50 ${internalActiveSection === "Dashboard" ? "flex" : "hidden"}`}>
        <div className="text-center">
          <p className="text-gray-600">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full mb-20 h-full flex-col lg:flex-row bg-gray-50 ${internalActiveSection === "Dashboard" ? "flex" : "hidden"}`}>
      <div className="flex-1 flex flex-col">
        <main className="p-6 max-sm:px-2 flex flex-col gap-6">
          {/* Summary Cards */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px] bg-white rounded-2xl p-5 shadow hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-600 text-white rounded-xl">
                  <CreditCard />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Balance</p>
                  <h2 className="text-xl font-semibold">
                    ${dashboardData.totalBalance.toLocaleString()}
                  </h2>
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-[250px] bg-white rounded-2xl p-5 shadow hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500 text-white rounded-xl">
                  <WalletMinimal />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Income</p>
                  <h2 className="text-xl font-semibold">
                    ${dashboardData.totalIncome.toLocaleString()}
                  </h2>
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-[250px] bg-white rounded-2xl p-5 shadow hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500 text-white rounded-xl">
                  <HandCoins />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Expenses</p>
                  <h2 className="text-xl font-semibold">
                    ${dashboardData.totalExpenses.toLocaleString()}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions & Financial Overview */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-white rounded-2xl p-5 shadow hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Recent Transactions</h3>
                <button className="text-sm text-gray-600 hover:text-purple-600 flex items-center gap-1">
                  See All <ArrowUpRight size={16} />
                </button>
              </div>
              <ul className="space-y-4">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((t) => (
                    <li
                      key={t.id}
                      className="flex justify-between items-center hover:bg-gray-50 rounded-lg p-2 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{t.icon}</span>
                        <div>
                          <p className="font-medium text-gray-800">{t.name}</p>
                          <p className="text-sm text-gray-500">{t.date}</p>
                        </div>
                      </div>
                      <div>
                        {t.amount > 0 ? (
                          <p className="text-green-600 bg-green-100 rounded-lg px-2 font-medium flex items-center gap-1">
                            +${t.amount.toLocaleString()} <ArrowUpRight size={14} />
                          </p>
                        ) : (
                          <p className="text-red-500 bg-red-100 rounded-lg px-2 font-medium flex items-center gap-1">
                            -${Math.abs(t.amount).toLocaleString()}{" "}
                            <ArrowDownRight size={14} />
                          </p>
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-center text-gray-500 py-4">No recent transactions</li>
                )}
              </ul>
            </div>

            <div className="flex-1 bg-white rounded-2xl p-5 shadow hover:shadow-md transition flex flex-col items-center justify-center">
              <h1 className="font-semibold text-lg mb-4">Financial Overview</h1>
              {financialOverviewData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={financialOverviewData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {financialOverviewData.map((v, i) => (
                          <Cell key={i} fill={v.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <p className="text-center mt-2 text-gray-600 font-medium">
                    Total Balance: <span className="text-black">${dashboardData.totalBalance.toLocaleString()}</span>
                  </p>
                </>
              ) : (
                <p className="text-gray-500">No data available</p>
              )}
            </div>
          </div>

          {/* Expenses Section */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-white rounded-2xl p-5 shadow hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Recent Expenses</h3>
                <button className="text-sm text-gray-600 hover:text-purple-600 flex items-center gap-1">
                  See All <ArrowUpRight size={16} />
                </button>
              </div>
              <ul className="space-y-4">
                {expenses.length > 0 ? (
                  expenses.map((t) => (
                    <li
                      key={t.id}
                      className="flex justify-between items-center hover:bg-gray-50 rounded-lg p-2 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{t.icon}</span>
                        <div>
                          <p className="font-medium text-gray-800">{t.name}</p>
                          <p className="text-sm text-gray-500">{t.date}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-red-500 bg-red-100 rounded-lg px-2 font-medium flex items-center gap-1">
                          -${Math.abs(t.amount).toLocaleString()}{" "}
                          <ArrowDownRight size={14} />
                        </p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-center text-gray-500 py-4">No expenses in last 30 days</li>
                )}
              </ul>
            </div>

            <div className="flex-1 bg-white rounded-2xl p-5 shadow hover:shadow-md transition flex flex-col items-center justify-center">
              <h1 className="text-start font-semibold text-lg mb-4">Last 30 Days Expenses</h1>
              {last30DaysExpensesData.length > 0 ? (
                <BarChart
                  style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
                  data={last30DaysExpensesData}
                  margin={{
                    top: 20,
                    right: 0,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <YAxis width={50} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 border border-gray-200 rounded-md shadow-sm text-sm">
                            <p className="font-semibold text-gray-800">{data.name}</p>
                            <p className="text-gray-600">Amount: ${data.Amount.toLocaleString()}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="Amount" fill="#8884d8" />
                </BarChart>
              ) : (
                <p className="text-gray-500">No expense data available</p>
              )}
            </div>
          </div>

          {/* Income Section */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-white rounded-2xl p-5 shadow hover:shadow-md transition flex flex-col items-center justify-center">
              <h1 className="font-semibold text-lg mb-4">Last 60 Days Income</h1>
              {last60DaysIncomeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={last60DaysIncomeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {last60DaysIncomeData.map((v, i) => (
                        <Cell key={i} fill={v.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500">No income data available</p>
              )}
            </div>

            <div className="flex-1 bg-white rounded-2xl p-5 shadow hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Recent Income</h3>
                <button className="text-sm text-gray-600 hover:text-purple-600 flex items-center gap-1">
                  See All <ArrowUpRight size={16} />
                </button>
              </div>
              <ul className="space-y-4">
                {income.length > 0 ? (
                  income.map((t) => (
                    <li
                      key={t.id}
                      className="flex justify-between items-center hover:bg-gray-50 rounded-lg p-2 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{t.icon}</span>
                        <div>
                          <p className="font-medium text-gray-800">{t.name}</p>
                          <p className="text-sm text-gray-500">{t.date}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-green-600 bg-green-100 rounded-lg px-2 font-medium flex items-center gap-1">
                          +${t.amount.toLocaleString()} <ArrowUpRight size={14} />
                        </p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-center text-gray-500 py-4">No income in last 60 days</li>
                )}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;