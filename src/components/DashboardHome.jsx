import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import AppContext from "../context/AppContext";

const FALLBACK_IMAGES = [
    "https://cdn.builder.io/api/v1/image/assets%2Ff369ea9e51e743788e30f11c53b3d7a9%2Fe98b997f07fd4fb5b2f9aa5e02a2a6ec?format=webp&width=800",
    "https://cdn.builder.io/api/v1/image/assets%2Ff369ea9e51e743788e30f11c53b3d7a9%2Fbc3f87e20ef54cb7a0e079b9c001f70c?format=webp&width=800",
    "https://cdn.builder.io/api/v1/image/assets%2Ff369ea9e51e743788e30f11c53b3d7a9%2F6bb44b3fc30541d38c049a682649bdee?format=webp&width=800",
    "https://cdn.builder.io/api/v1/image/assets%2Ff369ea9e51e743788e30f11c53b3d7a9%2Feb488a9bc4c045ecbc7f94d3e05f718e?format=webp&width=800"
];

const DashboardHome = () => {
    const { user, eventsInformation, orderInformation } = useContext(AppContext);
    const safe = eventsInformation || { events: [], eventsMade: 0 };
    const events = Array.isArray(safe.events) ? safe.events : [];
    const tickets = orderInformation && Array.isArray(orderInformation.tickets) ? orderInformation.tickets : [];

    const totalRevenue = tickets.reduce((acc, t) => acc + (t.amount || t.price || 0), 0);

    const nextEvent = useMemo(() => {
        if (!events.length) return null;
        const e = events[0];
        return {
            id: e._id,
            name: e.eventName || e.name || 'Untitled',
            date: e.date || e.startDate || '',
            img: (e.eventCoverPhotos && e.eventCoverPhotos[0]) || FALLBACK_IMAGES[0],
            sold: e.ticketsSold || e.tickets_sold || (e.tickets ? e.tickets.length : 0),
            capacity: e.ticketsCapacity || e.capacity || 150
        };
    }, [events]);

    return (
        <section>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-semibold text-[1.8rem] lg:text-[2rem]">Hello, {user?.firstname || 'Goodluck'}.</h1>
                    <p className="text-gray-500">Welcome back — here is your dashboard snapshot.</p>
                </div>
            </div>

            <section className="grid grid-cols-1 sm:grid-cols-4 gap-[1rem] my-[1.2rem]">
                <div className="p-[1rem] bg-white border rounded-[8px] text-center">
                    <small className="text-gray-500">Total Sales</small>
                    <div className="font-semibold text-[1.2rem]">₦{totalRevenue.toLocaleString()}</div>
                </div>
                <div className="p-[1rem] bg-white border rounded-[8px] text-center">
                    <small className="text-gray-500">Events</small>
                    <div className="font-semibold text-[1.2rem]">{safe.eventsMade || events.length}</div>
                </div>
                <div className="p-[1rem] bg-white border rounded-[8px] text-center">
                    <small className="text-gray-500">Tickets Sold</small>
                    <div className="font-semibold text-[1.2rem]">{tickets.length}</div>
                </div>
                <div className="p-[1rem] bg-white border rounded-[8px] text-center">
                    <small className="text-gray-500">Active Events</small>
                    <div className="font-semibold text-[1.2rem]">{events.filter(e => e.active !== false).length}</div>
                </div>
            </section>

            <section className="lg:flex gap-[2rem]">
                <section className="flex-1 bg-white border rounded-[8px] p-[1rem]">
                    <h2 className="font-medium mb-[0.5rem]">Your next event</h2>
                    {nextEvent ? (
                        <div className="flex items-center gap-[1rem]">
                            <img src={nextEvent.img} alt={nextEvent.name} className="w-[84px] h-[84px] object-cover rounded-[6px]" />
                            <div>
                                <div className="font-medium">{nextEvent.name}</div>
                                <small className="text-gray-500">{nextEvent.date}</small>
                                <div className="mt-[0.5rem] text-sm">{`${nextEvent.sold}/${nextEvent.capacity} Tickets sold`}</div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="text-gray-500">You have no upcoming events. <Link to="/sell-tickets" className="text-blue-700">Create one</Link></p>
                        </div>
                    )}

                    <div className="mt-[1rem]">
                        <h3 className="font-medium">Your Checklist</h3>
                        <ul className="mt-[0.5rem] space-y-[0.5rem] text-gray-600">
                            <li>• Create event</li>
                            <li>• Set up your organizer profile</li>
                            <li>• Add account details</li>
                        </ul>
                    </div>
                </section>

                <section className="w-[24rem] bg-white border rounded-[8px] p-[1rem]">
                    <h3 className="font-medium mb-[0.5rem]">Quick Actions</h3>
                    <div className="flex flex-col gap-[0.6rem]">
                        <Link to="/sell-tickets" className="p-[0.6rem] bg-primaryPurple text-white rounded-[6px] text-center">Create Event</Link>
                        <Link to="/dashboard" className="p-[0.6rem] border rounded-[6px] text-center">View Orders</Link>
                        <Link to="/dashboard" className="p-[0.6rem] border rounded-[6px] text-center">FAQ</Link>
                    </div>
                </section>
            </section>
        </section>
    );
};

export default DashboardHome;
