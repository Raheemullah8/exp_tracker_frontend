import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Dot, Tooltip } from 'recharts';
import { ArrowDownRight, ArrowUpRight, Download, Plus, Trash2, X } from 'lucide-react';
import { useAppContext } from '../context/context'
import * as ExpenseAPI from '../api/expense';
import toast from 'react-hot-toast';

const Expenses = () => {
    const { internalActiveSection } = useAppContext();
    const [expenses, setExpenses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({ category: '', amount: '', date: '' });

    // Common expense categories
    const CATEGORIES = [
        { name: 'Food & Dining', icon: '🍔' },
        { name: 'Transportation', icon: '🚗' },
        { name: 'Shopping', icon: '🛍️' },
        { name: 'Bills & Utilities', icon: '💡' },
        { name: 'Entertainment', icon: '🎬' },
        { name: 'Healthcare', icon: '🏥' },
        { name: 'Education', icon: '📚' },
        { name: 'Travel', icon: '✈️' },
        { name: 'Rent', icon: '🏠' },
        { name: 'Others', icon: '📝' },
    ];

    // Load expenses on mount
    useEffect(() => {
        const load = async () => {
            try {
                const res = await ExpenseAPI.getExpenses();
                const list = res?.data || res || [];
                setExpenses(Array.isArray(list) ? list : (list.expenses || []));
            } catch (err) {
                console.error('Failed to load expenses', err);
                toast.error('Failed to load expenses');
            }
        };
        load();
    }, []);

    const refreshExpenses = async () => {
        try {
            const res = await ExpenseAPI.getExpenses();
            const list = res?.data || res || [];
            setExpenses(Array.isArray(list) ? list : (list.expenses || []));
        } catch (err) {
            console.error('Failed to refresh expenses', err);
        }
    };

    const onChangeField = (key) => (e) => {
        setForm((f) => ({ ...f, [key]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                category: form.category,
                amount: Number(form.amount),
                date: form.date || undefined,
            };
            await ExpenseAPI.createExpense(payload);
            toast.success('Expense added successfully');
            setForm({ category: '', amount: '', date: '' });
            setIsModalOpen(false);
            await refreshExpenses();
        } catch (err) {
            console.error('Failed to create expense', err);
            toast.error('Failed to add expense');
        }
    };

 
    // Chart data: process expenses into time-series
    const data = expenses
        .slice()
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(exp => ({
            date: new Date(exp.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
            amount: Number(exp.amount)
        }));

    // Recent transactions from expenses
    const transactions = expenses
        .slice()
        .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
        .map(exp => ({
            id: exp._id,
            name: exp.category,
            date: new Date(exp.date).toLocaleDateString(),
            amount: -Math.abs(Number(exp.amount)), // expenses are negative
            icon: CATEGORIES.find(c => c.name === exp.category)?.icon || '📝'
        }));

    const CustomDot = (props) => {
        const { cx, cy } = props;
        return (
            <circle
                cx={cx}
                cy={cy}
                r={4}
                fill="#6366f1"
                stroke="#6366f1"
                strokeWidth={2}
            />
        );
    };

  const handleDownload = async () => {
  try {
    // 1️⃣ Get all expenses
    const res = await ExpenseAPI.getExpenses(); // ✅ correct API call
    const list = res?.data || res || [];

    // 2️⃣ If no data found
    if (!list.length) return alert("No expense data available to download");

    // 3️⃣ Get all keys from first expense object (header row)
    const headers = Object.keys(list[0]);

    // 4️⃣ Convert JSON → CSV format
    const csvRows = [
      headers.join(","), // header line
      ...list.map(obj =>
        headers.map(header => JSON.stringify(obj[header] ?? "")).join(",")
      ),
    ];

    // 5️⃣ Join all rows with newlines
    const csvString = csvRows.join("\n");

    // 6️⃣ Create a Blob (virtual CSV file)
    const blob = new Blob([csvString], { type: "text/csv" });

    // 7️⃣ Generate temporary download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expense_details.csv"; // ✅ correct file name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // 8️⃣ Success toast
    toast.success("Expense data downloaded successfully!");
  } catch (error) {
    console.error("Error downloading expense data:", error);
    toast.error("Failed to download expense data");
  }
};


    return (
        <section className={`mb-20 flex-col  ${internalActiveSection === "Expenses" ? "flex" : "hidden"}`}>
            <div className="w-full h-screen bg-gray-50 p-8">
                <div className="bg-white rounded-lg shadow-sm p-8 h-full">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                                Expense Overview
                            </h1>
                            <p className="text-sm text-gray-500">
                                Track your spending trends over time and gain insights into where your money goes.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm"
                        >
                            <Plus size={16} />
                            Add Expense
                        </button>
                    </div>

                    <div className="w-full" style={{ height: 'calc(100% - 100px)' }}>
                        <ResponsiveContainer minWidth="100%" width="100%" minHeight="300px" height="80%">
                            <AreaChart
                                data={data}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    ticks={[0, 250, 500, 750, 1000]}
                                    dx={-10}
                                />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#6366f1"
                                    strokeWidth={2.5}
                                    fill="url(#colorAmount)"
                                    dot={<CustomDot />}
                                    activeDot={{ r: 5, fill: '#6366f1' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl m-8 p-5 shadow hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">All Expenses</h3>
                    <button
                        onClick={handleDownload}
                        className="text-sm text-gray-600 border border-gray-400 cursor-pointer px-2 rounded-md hover:border-purple-600 hover:text-purple-600 flex items-center transition-colors gap-1"
                    >
                        download <Download size={16} />
                    </button>
                </div>
                <ul className="space-y-4 flex flex-wrap px-5 justify-between gap-5">
                    {transactions.map((t) => (
                        <li
                            key={t.id}
                            className="flex justify-between min-w-100 items-center hover:bg-gray-50 rounded-lg p-2 transition"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{t.icon}</span>
                                <div>
                                    <p className="font-medium text-gray-800">{t.name}</p>
                                    <p className="text-sm text-gray-500">{t.date}</p>
                                </div>
                            </div>
                            <div className='flex justify-center '>
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
                                <button
                                    onClick={async () => {
                                        try {
                                            await ExpenseAPI.deleteExpense(t._id || t.id);
                                            await refreshExpenses();
                                            
                                        }
                                        catch (err) {
                                            console.error('Failed to delete expence', err);
                                        }
                                    }}
                                     className="ml-4 flex items-center gap-2 text-sm text-white bg-red-500 hover:bg-red-600 active:scale-95 transition-all px-4 py-1.5 rounded-md shadow-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>


                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Add Expense Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">Add New Expense</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    value={form.category}
                                    onChange={onChangeField('category')}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    required
                                >
                                    <option value="">Select category</option>
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.name} value={cat.name}>
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Amount ($)
                                </label>
                                <input
                                    type="number"
                                    value={form.amount}
                                    onChange={onChangeField('amount')}
                                    placeholder="Enter amount"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={onChangeField('date')}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                                Add Expense
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}; export default Expenses;