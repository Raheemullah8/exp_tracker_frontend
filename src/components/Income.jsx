import React, { useEffect, useState } from 'react'
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';
import { useAppContext } from '../context/context'
import { ArrowDownRight, ArrowUpRight, Download, Plus } from 'lucide-react';
import { Income as IncomeAPI } from '../api';

const Income = () => {
    const { internalActiveSection } = useAppContext();
    const [incomes, setIncomes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({ source: '', amount: '', icon: '', date: '' });
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // small emoji set to choose from (can be extended)
    const EMOJIS = [
        '💰','💵','🧾','💼','🏦','🪙','📈','🛍️','🎁','🍔','🚗','✈️','🏠','🧸','🎮','🩺','📚','🎓','⚽','🎵'
    ];

    // Fetch incomes from server
    useEffect(() => {
        const load = async () => {
            try {
                const res = await IncomeAPI.getIncomes();
                // assume API returns array in res.data or directly
                const list = res?.data || res || [];
                setIncomes(Array.isArray(list) ? list : (list.incomes || []));
            } catch (err) {
                console.error('Failed to load incomes', err);
            }
        };
        load();
    }, []);

    const refreshIncomes = async () => {
        try {
            const res = await IncomeAPI.getIncomes();
            const list = res?.data || res || [];
            setIncomes(Array.isArray(list) ? list : (list.incomes || []));
        } catch (err) {
            console.error('Failed to refresh incomes', err);
        }
    };

    const onChangeField = (key) => (e) => {
        setForm((f) => ({ ...f, [key]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                source: form.source,
                amount: Number(form.amount),
                icon: form.icon,
                date: form.date || undefined,
            };
            await IncomeAPI.createIncome(payload);
            // clear form and close
            setForm({ source: '', amount: '', icon: '', date: '' });
            setIsModalOpen(false);
            await refreshIncomes();
        } catch (err) {
            console.error('Failed to create income', err);
        }
    };

    // Chart data is derived from incomes grouped by source
    const data = Object.values(incomes.reduce((acc, inc) => {
        const key = inc.source || 'Other';
        if (!acc[key]) acc[key] = { name: key, Amount: 0 };
        acc[key].Amount += Number(inc.amount || 0);
        return acc;
    }, {}));

    const transactions = incomes.slice().sort((a,b)=> new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
    return (
        <section className={`mb-20 flex-col  ${internalActiveSection === "Income" ? "flex" : "hidden"}`}>
            <div className={`bg-white shadow-md overflow-hidden rounded-2xl m-8 p-8 transition flex-col justify-center`}>
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-start font-semibold text-lg">Income Overview</h1>
                        <p className='text-gray-500 mb-4 text-sm'>Track your earnings over time and analye your income trends.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex h-max items-center cursor-pointer gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm">
                        <Plus size={16} />
                        Add Income
                    </button>
                </div>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4">Add Income</h3>
                            <form onSubmit={onSubmit} className="space-y-3">
                                <div>
                                    <label className="block text-sm text-gray-700">Source</label>
                                    <input required value={form.source} onChange={onChangeField('source')} className="w-full px-3 py-2 border rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700">Amount</label>
                                    <input required type="number" value={form.amount} onChange={onChangeField('amount')} className="w-full px-3 py-2 border rounded-md" />
                                </div>
                                <div className="relative">
                                    <label className="block text-sm text-gray-700">Icon</label>
                                    <div className="flex items-center gap-2">
                                        <button type="button" onClick={() => setShowEmojiPicker((s) => !s)} className="px-3 py-2 border rounded-md flex items-center gap-2">
                                            <span className="text-xl">{form.icon || '✨'}</span>
                                            <span className="text-sm text-gray-600">Choose</span>
                                        </button>
                                        <input readOnly value={form.icon} placeholder="Selected emoji" className="w-full px-3 py-2 border rounded-md" />
                                    </div>

                                    {showEmojiPicker && (
                                        <div className="absolute left-0 mt-2 p-2 bg-white border rounded shadow-md z-50 w-64">
                                            <div className="grid grid-cols-6 gap-2">
                                                {EMOJIS.map((emj) => (
                                                    <button
                                                        key={emj}
                                                        type="button"
                                                        onClick={() => {
                                                            setForm((f) => ({ ...f, icon: emj }));
                                                            setShowEmojiPicker(false);
                                                        }}
                                                        className="p-2 hover:bg-gray-100 rounded text-lg"
                                                    >
                                                        {emj}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700">Date</label>
                                    <input type="date" value={form.date} onChange={onChangeField('date')} className="w-full px-3 py-2 border rounded-md" />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-md border">Cancel</button>
                                    <button type="submit" className="px-4 py-2 rounded-md bg-purple-600 text-white">Add</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <BarChart
                    style={{ width: '100%', maxHeight: '50vh', aspectRatio: 1.618 }}
                    responsive
                    data={data}
                    margin={{
                        top: 20,
                        right: 0,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <YAxis width="auto" />
                    <XAxis width="auto" />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                    <div className="bg-white p-2 border border-gray-200 rounded-md shadow-sm text-sm">
                                        <p className="font-semibold text-gray-800">{data.name}</p>
                                        <p className="text-gray-600">Amount: ${data.Amount}</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar dataKey="Amount" fill="#8884d8" />
                </BarChart>
            </div>

            <div className="flex-1 bg-white rounded-2xl m-8 p-5 shadow hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Income Sources</h3>
                    <button className="text-sm text-gray-600 border border-gray-400 cursor-pointer px-2 rounded-md hover:border-purple-600 hover:text-purple-600 flex items-center transition-colors gap-1">
                        download <Download size={16} />
                    </button>
                </div>
                <ul className="space-y-4 flex flex-wrap px-2 justify-between gap-5">
                    {transactions.map((t) => (
                        <li
                            key={t._id || t.id}
                            className="flex justify-between min-w-100 items-center hover:bg-gray-50 rounded-lg p-2 transition"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{t.icon || '💰'}</span>
                                <div>
                                    <p className="font-medium text-gray-800">{t.source || t.name}</p>
                                    <p className="text-sm text-gray-500">{new Date(t.createdAt || t.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div>
                                {Number(t.amount) > 0 ? (
                                    <p className="text-green-600 bg-green-100 rounded-lg px-2 font-medium flex items-center gap-1">
                                        +${Number(t.amount).toLocaleString()} <ArrowUpRight size={14} />
                                    </p>
                                ) : (
                                    <p className="text-red-500 bg-red-100 rounded-lg px-2 font-medium flex items-center gap-1">
                                        -${Math.abs(Number(t.amount)).toLocaleString()} <ArrowDownRight size={14} />
                                    </p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default Income
