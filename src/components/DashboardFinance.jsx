import { useContext } from "react";
import AppContext from "../context/AppContext";
import { Link } from "react-router-dom";

const DashboardFinance = () => {
    const { orderInformation, eventsInformation } = useContext(AppContext);

    const tickets = orderInformation && Array.isArray(orderInformation.tickets) ? orderInformation.tickets : [];
    const ticketsSold = orderInformation && typeof orderInformation.ticketsSold === "number" ? orderInformation.ticketsSold : tickets.length;

    // Try to derive revenue from common fields
    const totalRevenue = tickets.reduce((acc, t) => {
        const candidates = [t.amount, t.price, t.ticketPrice, t.totalAmount, t.paymentAmount];
        const found = candidates.find(v => typeof v === "number" && !isNaN(v));
        if (found) return acc + found;
        // sometimes price could be string
        const stringCandidate = candidates.find(v => typeof v === "string" && !isNaN(parseFloat(v)));
        if (stringCandidate) return acc + parseFloat(stringCandidate);
        return acc;
    }, 0);

    const totalEvents = eventsInformation && typeof eventsInformation.eventsMade === "number" ? eventsInformation.eventsMade : (eventsInformation && Array.isArray(eventsInformation.events) ? eventsInformation.events.length : 0);

    return (
        <section>
            <h1 className="font-semibold text-[1.8rem] lg:text-[2rem]">Finance</h1>
            <p className="my-[1rem]">Overview of your sales and events.</p>
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-[1rem] my-[1.2rem]">
                <section className="p-[1.2rem] bg-white rounded-[8px] border">
                    <h2 className="text-sm text-gray-500">Total Events</h2>
                    <p className="text-[1.5rem] font-semibold">{totalEvents}</p>
                </section>
                <section className="p-[1.2rem] bg-white rounded-[8px] border">
                    <h2 className="text-sm text-gray-500">Tickets Sold</h2>
                    <p className="text-[1.5rem] font-semibold">{ticketsSold}</p>
                </section>
                <section className="p-[1.2rem] bg-white rounded-[8px] border">
                    <h2 className="text-sm text-gray-500">Total Revenue</h2>
                    <p className="text-[1.5rem] font-semibold">{`₦${totalRevenue.toLocaleString()}`}</p>
                </section>
            </section>

            {tickets.length < 1 && (
                <p className="mt-[1.5rem]">You have not sold any tickets yet. <Link to="/sell-tickets" className="text-blue-700">Create an event</Link></p>
            )}

            {tickets.length > 0 && (
                <section className="mt-[1.5rem]">
                    <h3 className="font-medium mb-[0.5rem]">Recent Sales</h3>
                    <section className="dashboard-scroll max-h-[50vh] overflow-auto border rounded-[6px]">
                        {tickets.slice().reverse().map((t, idx) => (
                            <div key={t._id || idx} className="p-[0.8rem] border-b flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="font-medium">{t.event || t.eventName || 'Event'}</span>
                                    <small className="text-gray-500">{t.buyer || t.purchaser || '—'}</small>
                                </div>
                                <div className="text-right">
                                    <div>₦{((t.amount || t.price || t.ticketPrice || 0)).toLocaleString()}</div>
                                    <small className="text-gray-500">{t.date || t.createdAt || ''}</small>
                                </div>
                            </div>
                        ))}
                    </section>
                </section>
            )}
        </section>
    );
};

export default DashboardFinance;
