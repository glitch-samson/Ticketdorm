import { useContext, useMemo } from "react";
import AppContext from "../context/AppContext";

const FALLBACK_IMAGES = [
    "https://cdn.builder.io/api/v1/image/assets%2Ff369ea9e51e743788e30f11c53b3d7a9%2Fe98b997f07fd4fb5b2f9aa5e02a2a6ec?format=webp&width=800",
    "https://cdn.builder.io/api/v1/image/assets%2Ff369ea9e51e743788e30f11c53b3d7a9%2Fbc3f87e20ef54cb7a0e079b9c001f70c?format=webp&width=800",
    "https://cdn.builder.io/api/v1/image/assets%2Ff369ea9e51e743788e30f11c53b3d7a9%2F6bb44b3fc30541d38c049a682649bdee?format=webp&width=800",
    "https://cdn.builder.io/api/v1/image/assets%2Ff369ea9e51e743788e30f11c53b3d7a9%2Feb488a9bc4c045ecbc7f94d3e05f718e?format=webp&width=800"
];

const Orders = () => {
    const { orderInformation, eventsInformation, allEvents } = useContext(AppContext);
    const safe = orderInformation || { tickets: [], ticketsSold: 0 };
    const tickets = Array.isArray(safe.tickets) ? safe.tickets : [];

    // Build a lookup of events from context to find exact images
    const eventsList = Array.isArray((eventsInformation && eventsInformation.events) ? eventsInformation.events : (allEvents || [])) ? ((eventsInformation && eventsInformation.events) ? eventsInformation.events : (allEvents || [])) : [];

    const rows = useMemo(() => tickets.map((t, idx) => {
        const eventName = (t.event || t.eventName || '').toString();

        // try to find the matching event object by id or name
        const match = eventsList.find(e => e && (e._id === t.event || e._id === t.eventID || (e.eventName && e.eventName.toString().toLowerCase() === eventName.toLowerCase()) || (e.name && e.name.toString().toLowerCase() === eventName.toLowerCase())));

        const imgFromMatch = match && match.eventCoverPhotos && match.eventCoverPhotos[0] ? match.eventCoverPhotos[0] : null;
        const img = imgFromMatch || (t.eventCover && t.eventCover[0]) || (t.eventCoverPhotos && t.eventCoverPhotos[0]) || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];

        return {
            id: t._id || idx,
            orderId: t.orderNumber || `#${Math.floor(Math.random()*1000000)}`,
            event: eventName || 'Untitled',
            buyer: t.buyer || t.purchaser || '—',
            qty: t.quantity || t.qty || 1,
            amount: t.amount || t.totalAmount || t.price || 0,
            date: t.date || t.createdAt || '',
            status: t.status || 'Confirmed',
            img
        };
    }), [tickets, eventsList]);

    return (
        <section>
            <div className="flex items-center justify-between">
                <h1 className="font-semibold text-[1.8rem] lg:text-[2rem]">Orders</h1>
                <div className="flex gap-[0.8rem]">
                    <input placeholder="Search orders" className="border rounded-[6px] px-[0.8rem] h-[3rem]" />
                </div>
            </div>

            <p className="my-[1.5rem]">Total number of tickets sold : <span className="font-medium">{safe.ticketsSold ? safe.ticketsSold : tickets.length}</span></p>

            <div className="bg-white border rounded-[8px] overflow-auto">
                <table className="w-full min-w-[900px]">
                    <thead className="bg-[#F8F9FA]">
                        <tr>
                            <th className="text-left p-[0.8rem]">Order ID</th>
                            <th className="text-left p-[0.8rem]">Event</th>
                            <th className="text-left p-[0.8rem]">Buyer</th>
                            <th className="text-left p-[0.8rem]">Quantity</th>
                            <th className="text-left p-[0.8rem]">Total Amount</th>
                            <th className="text-left p-[0.8rem]">Order Date</th>
                            <th className="text-left p-[0.8rem]">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr><td colSpan={7} className="p-[1rem] text-gray-500">No orders found</td></tr>
                        ) : rows.map(r => (
                            <tr key={r.id} className="border-t">
                                <td className="p-[0.8rem] align-top">{r.orderId}</td>
                                <td className="p-[0.8rem] align-top">
                                    <div className="flex items-center gap-[0.8rem]">
                                        <img src={r.img} alt={r.event} className="w-[48px] h-[48px] rounded-[6px] object-cover" />
                                        <div>
                                            <div className="font-medium">{r.event}</div>
                                            <small className="text-gray-500">Tickets</small>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-[0.8rem] align-top">{r.buyer}</td>
                                <td className="p-[0.8rem] align-top">{r.qty}</td>
                                <td className="p-[0.8rem] align-top">₦{(r.amount||0).toLocaleString()}</td>
                                <td className="p-[0.8rem] align-top">{r.date}</td>
                                <td className="p-[0.8rem] align-top"><span className={`font-medium ${r.status === 'Confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>{r.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default Orders;
