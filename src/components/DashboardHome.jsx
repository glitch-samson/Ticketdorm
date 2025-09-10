import { useContext } from "react";
import { Link } from "react-router-dom";
import AppContext from "../context/AppContext";

const DashboardHome = () => {
    const { user, eventsInformation } = useContext(AppContext);
    const safeEvents = eventsInformation || { events: [], eventsMade: 0 };

    const recentEvents = (Array.isArray(safeEvents.events) ? safeEvents.events : []).slice().reverse().slice(0, 6).map(event => (
        <section key={event._id || Math.random()} className="min-h-[4rem] flex items-center p-[0.5rem] font-medium border-b">{event.eventName || 'Untitled Event'}</section>
    ));

    return (
        <section>
            <h1 className="font-semibold text-[1.8rem] lg:text-[2rem]">Hello, {user?.firstname || 'User'}.</h1>
            <p className="my-[1.5rem]">{safeEvents.eventsMade > 0 ? "Here are the most recent events created by you;" : "Our records shows that you are yet to create an event, will you like to create one?"}</p>
            <section className="flex flex-col gap-[1rem]">
                {safeEvents.eventsMade > 0 ? recentEvents : <Link to="/sell-tickets" className="font-medium mt-[0.5rem]"><span className="border-b  border-[#007BFF] pb-[0.5rem] inline-block animate-bounce relative z-[-1]">Yes, I want to create an event</span></Link>}
            </section>
        </section>
    );
};

export default DashboardHome;
