import { useContext } from "react";
import AppContext from "../context/AppContext";
import { Link } from "react-router-dom";

const FALLBACK_IMAGES = [
    "https://cdn.builder.io/api/v1/image/assets%2Ff369ea9e51e743788e30f11c53b3d7a9%2Fe98b997f07fd4fb5b2f9aa5e02a2a6ec?format=webp&width=800",
    "https://cdn.builder.io/api/v1/image/assets%2Ff369ea9e51e743788e30f11c53b3d7a9%2Fbc3f87e20ef54cb7a0e079b9c001f70c?format=webp&width=800",
    "https://cdn.builder.io/api/v1/image/assets%2Ff369ea9e51e743788e30f11c53b3d7a9%2F6bb44b3fc30541d38c049a682649bdee?format=webp&width=800",
    "https://cdn.builder.io/api/v1/image/assets%2Ff369ea9e51e743788e30f11c53b3d7a9%2Feb488a9bc4c045ecbc7f94d3e05f718e?format=webp&width=800"
];

const DashboardFinance = () => {
    const { orderInformation, eventsInformation, user } = useContext(AppContext);

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

    return (
        <section>
            <h1 className="font-semibold text-[1.8rem] lg:text-[2rem]">Finance</h1>
            <p className="my-[1rem]">Account Details</p>

            <section className="lg:flex gap-[2rem]">
                <section className="bg-white border rounded-[8px] p-[1.6rem] flex-1">
                    <h2 className="font-medium text-[1rem] mb-[1rem]">Account Details</h2>
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
