import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import AppContext from "../context/AppContext";

const FALLBACK_IMAGES = [
    "https://cdn.builder.io/api/v1/image/assets%2Ff369ea9e51e743788e30f11c53b3d7a9%2Fe98b997f07fd4fb5b2f9aa5e02a2a6ec?format=webp&width=800",
    "https://cdn.builder.io/api/v1/image/assets%2Ff369ea9e51e743788e30f11c53b3d7a9%2Fbc3f87e20ef54cb7a0e079b9c001f70c?format=webp&width=800",
    "https://cdn.builder.io/api/v1/image/assets%2Ff369ea9e51e743788e30f11c53b3d7a9%2F6bb44b3fc30541d38c049a682649bdee?format=webp&width=800",
    "https://cdn.builder.io/api/v1/image/assets%2Ff369ea9e51e743788e30f11c53b3d7a9%2Feb488a9bc4c045ecbc7f94d3e05f718e?format=webp&width=800"
];

const DashboardEvents = () => {
    const { user, eventsInformation } = useContext(AppContext);
    const safe = eventsInformation || { events: [], eventsMade: 0 };
    const events = Array.isArray(safe.events) ? safe.events : [];

    const rows = useMemo(() => events.slice().reverse().map((event, idx) => {
        const img = event.eventCoverPhotos && event.eventCoverPhotos[0] ? event.eventCoverPhotos[0] : FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
        const sold = event.ticketsSold || event.tickets_sold || (event.tickets && event.tickets.length) || 0;
        const capacity = event.ticketsCapacity || event.capacity || event.totalTickets || 150;
        const revenue = event.revenue || event.totalRevenue || (event.tickets ? event.tickets.reduce((a,t)=>a + (t.amount||t.price||0),0) : 0);

        return {
            id: event._id || idx,
            date: event.date || event.startsAt || event.startDate || '',
            img,
            name: event.eventName || event.name || 'Untitled Event',
            sold,
            capacity,
            revenue
        };
    }), [events]);

    return (
        <section>
            <div className="flex items-center justify-between">
                <h1 className="font-semibold text-[1.8rem] lg:text-[2rem]">Events</h1>
                <div className="flex gap-[0.8rem]">
                    <input placeholder="Search events" className="border rounded-[6px] px-[0.8rem] h-[3rem]" />
                    <button className="bg-primaryPurple text-white px-[1rem] rounded-[6px]">Create event</button>
                </div>
            </div>

            <div className="mt-[1rem] bg-white border rounded-[8px] overflow-auto">
                <table className="w-full min-w-[700px]">
                    <thead className="bg-[#F8F9FA]">
                        <tr>
                            <th className="text-left p-[0.8rem]">Date</th>
                            <th className="text-left p-[0.8rem]">Event</th>
                            <th className="text-left p-[0.8rem]">Sold</th>
                            <th className="text-left p-[0.8rem]">Total Revenue</th>
                            <th className="text-left p-[0.8rem]">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr><td colSpan={5} className="p-[1rem] text-gray-500">No events found. <Link to="/sell-tickets" className="text-blue-700">Create an event</Link></td></tr>
                        ) : rows.map(r => (
                            <tr key={r.id} className="border-t">
                                <td className="p-[0.8rem] align-top">{r.date}</td>
                                <td className="p-[0.8rem] align-top">
                                    <div className="flex items-center gap-[0.8rem]">
                                        <img src={r.img} alt={r.name} className="w-[56px] h-[56px] rounded-[6px] object-cover" />
                                        <div>
                                            <div className="font-medium">{r.name}</div>
                                            <small className="text-gray-500">Starts soon</small>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-[0.8rem] align-top">{`${r.sold}/${r.capacity}`}</td>
                                <td className="p-[0.8rem] align-top">₦{(r.revenue || 0).toLocaleString()}</td>
                                <td className="p-[0.8rem] align-top"><span className="text-green-600">On sale</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default DashboardEvents;
