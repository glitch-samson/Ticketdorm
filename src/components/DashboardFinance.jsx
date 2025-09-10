import { useContext, useState } from "react";
import AppContext from "../context/AppContext";
import { Link } from "react-router-dom";
import { updateUserRequest } from "../requests/APIRequest";

const FALLBACK_IMAGES = [
    "https://cdn.builder.io/api/v1/image/assets%2Ff369ea9e51e743788e30f11c53b3d7a9%2Fe98b997f07fd4fb5b2f9aa5e02a2a6ec?format=webp&width=800",
    "https://cdn.builder.io/api/v1/image/assets%2Ff369ea9e51e743788e30f11c53b3d7a9%2Fbc3f87e20ef54cb7a0e079b9c001f70c?format=webp&width=800",
    "https://cdn.builder.io/api/v1/image/assets%2Ff369ea9e51e743788e30f11c53b3d7a9%2F6bb44b3fc30541d38c049a682649bdee?format=webp&width=800",
    "https://cdn.builder.io/api/v1/image/assets%2Ff369ea9e51e743788e30f11c53b3d7a9%2Feb488a9bc4c045ecbc7f94d3e05f718e?format=webp&width=800"
];

const DashboardFinance = () => {
    const { orderInformation, eventsInformation, user, token, setUser, setShowLoadingAnimation, setShowModal } = useContext(AppContext);

    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        fullname: user?.fullname || `${user?.firstname || ''} ${user?.lastname || ''}`,
        bankName: user?.bankName || '',
        accountNumber: user?.accountNumber || ''
    });

    const tickets = orderInformation && Array.isArray(orderInformation.tickets) ? orderInformation.tickets : [];
    const ticketsSold = orderInformation && typeof orderInformation.ticketsSold === "number" ? orderInformation.ticketsSold : tickets.length;

    const totalRevenue = tickets.reduce((acc, t) => {
        const candidates = [t.amount, t.price, t.ticketPrice, t.totalAmount, t.paymentAmount];
        const found = candidates.find(v => typeof v === "number" && !isNaN(v));
        if (found) return acc + found;
        const stringCandidate = candidates.find(v => typeof v === "string" && !isNaN(parseFloat(v)));
        if (stringCandidate) return acc + parseFloat(stringCandidate);
        return acc;
    }, 0);

    const totalEvents = eventsInformation && typeof eventsInformation.eventsMade === "number" ? eventsInformation.eventsMade : (eventsInformation && Array.isArray(eventsInformation.events) ? eventsInformation.events.length : 0);

    const recent = tickets.slice().reverse().slice(0,6).map((t, i) => ({
        id: t._id || i,
        event: t.event || t.eventName || "Untitled",
        buyer: t.buyer || t.purchaser || "—",
        amount: t.amount || t.price || t.ticketPrice || 0,
        date: t.date || t.createdAt || ""
    }));

    const change = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const submit = async e => {
        e.preventDefault();
        if (!user || !token) {
            setShowModal({ heading: "Unauthorized", message: "You must be logged in to update account details.", on: true, success: false });
            return;
        }

        setShowLoadingAnimation(true);
        try {
            const payload = { fullname: form.fullname, bankName: form.bankName, accountNumber: form.accountNumber };
            const res = await updateUserRequest(payload, user._id, token);
            setShowLoadingAnimation(false);
            if (res && res.success === false) {
                setShowModal({ heading: "Update Failed", message: res.message || 'Unable to update account details', on: true, success: false });
                return;
            }

            // If API returns updated user
            const updatedUser = res.user || res.data || payload;
            setUser(prev => ({ ...prev, ...updatedUser }));
            setShowModal({ heading: "Success", message: "Account details updated successfully.", on: true, success: true });
            setEditMode(false);
        } catch (error) {
            setShowLoadingAnimation(false);
            setShowModal({ heading: "Network Error", message: "Unable to connect to server. Try again.", on: true, success: false });
        }
    };

    return (
        <section>
            <div className="flex items-center justify-between">
                <h1 className="font-semibold text-[1.8rem] lg:text-[2rem]">Finance</h1>
                {!editMode && <button className="bg-primaryPurple text-white px-[1rem] py-[0.6rem] rounded-[6px]" onClick={() => setEditMode(true)}>Edit Account</button>}
            </div>
            <p className="my-[1rem]">Account Details</p>

            <section className="lg:flex gap-[2rem]">
                <section className="bg-white border rounded-[8px] p-[1.6rem] flex-1">
                    <h2 className="font-medium text-[1rem] mb-[1rem]">Account Details</h2>

                    {!editMode ? (
                        <div className="grid grid-cols-1 gap-[0.8rem] text-left">
                            <div>
                                <small className="text-gray-500">Full Name</small>
                                <div className="font-medium mt-[0.3rem]">{user?.fullname || `${user?.firstname || 'JOHN'} ${user?.lastname || 'DOE'}`}</div>
                            </div>
                            <div>
                                <small className="text-gray-500">Bank Name</small>
                                <div className="font-medium mt-[0.3rem]">{user?.bankName || 'FIRST BANK'}</div>
                            </div>
                            <div>
                                <small className="text-gray-500">Account Number</small>
                                <div className="font-medium mt-[0.3rem]">{user?.accountNumber || '2673451419'}</div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={submit} className="grid grid-cols-1 gap-[0.8rem] text-left">
                            <div>
                                <label className="text-gray-500">Full Name</label>
                                <input name="fullname" value={form.fullname} onChange={change} className="w-full border rounded-[6px] p-[0.6rem] mt-[0.3rem]" />
                            </div>
                            <div>
                                <label className="text-gray-500">Bank Name</label>
                                <input name="bankName" value={form.bankName} onChange={change} className="w-full border rounded-[6px] p-[0.6rem] mt-[0.3rem]" />
                            </div>
                            <div>
                                <label className="text-gray-500">Account Number</label>
                                <input name="accountNumber" value={form.accountNumber} onChange={change} className="w-full border rounded-[6px] p-[0.6rem] mt-[0.3rem]" />
                            </div>
                            <div className="flex gap-[0.6rem] mt-[0.6rem]">
                                <button className="bg-primaryPurple text-white px-[1rem] py-[0.6rem] rounded-[6px]">Save</button>
                                <button type="button" className="border px-[1rem] py-[0.6rem] rounded-[6px]" onClick={() => setEditMode(false)}>Cancel</button>
                            </div>
                        </form>
                    )}
                </section>

                <section className="flex-1">
                    <section className="grid grid-cols-1 sm:grid-cols-3 gap-[1rem] mb-[1rem]">
                        <div className="p-[1rem] bg-white border rounded-[8px] text-center">
                            <small className="text-gray-500">Total Events</small>
                            <div className="font-semibold text-[1.4rem]">{totalEvents}</div>
                        </div>
                        <div className="p-[1rem] bg-white border rounded-[8px] text-center">
                            <small className="text-gray-500">Tickets Sold</small>
                            <div className="font-semibold text-[1.4rem]">{ticketsSold}</div>
                        </div>
                        <div className="p-[1rem] bg-white border rounded-[8px] text-center">
                            <small className="text-gray-500">Total Revenue</small>
                            <div className="font-semibold text-[1.4rem]">₦{totalRevenue.toLocaleString()}</div>
                        </div>
                    </section>

                    <section className="bg-white border rounded-[8px] p-[1rem]">
                        <h3 className="font-medium mb-[0.5rem]">Recent Sales</h3>
                        {recent.length === 0 ? (
                            <p className="text-gray-500">No sales yet</p>
                        ) : (
                            <div className="divide-y">
                                {recent.map((r, idx) => (
                                    <div key={r.id} className="flex items-center justify-between py-[0.6rem]">
                                        <div>
                                            <div className="font-medium">{r.event}</div>
                                            <small className="text-gray-500">{r.buyer}</small>
                                        </div>
                                        <div className="text-right">
                                            <div>₦{(r.amount || 0).toLocaleString()}</div>
                                            <small className="text-gray-500">{r.date}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </section>
            </section>
        </section>
    );
};

export default DashboardFinance;
