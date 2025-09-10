import { useContext } from "react";
import AppContext from "../context/AppContext";

const Orders = () => {
    const { orderInformation } = useContext(AppContext);
    const safeOrderInfo = orderInformation || { tickets: [], ticketsSold: 0 };
    const tickets = Array.isArray(safeOrderInfo.tickets) ? safeOrderInfo.tickets : [];

    const orderID = tickets.map((order, i) => <section className="min-h-[4rem] flex items-center max-w-[30rem] overflow-hidden whitespace-nowrap" key={order._id || i}>{order.orderNumber || '—'}</section>);
    const eventName = tickets.map((order, i) => <section className="min-h-[4rem] flex items-center max-w-[30rem] overflow-hidden whitespace-nowrap" key={order._id || i}>{order.event || order.eventName || '—'}</section>);
    const buyer = tickets.map((order, i) => <section className="min-h-[4rem] flex items-center max-w-[30rem] overflow-hidden whitespace-nowrap" key={order._id || i}>{order.buyer || order.purchaser || '—'}</section>);
    const amount = tickets.map((order, i) => <section className="min-h-[4rem] flex items-center max-w-[30rem] overflow-hidden whitespace-nowrap" key={order._id || i}>{order.ticketType || order.type || '—'}</section>);
    const orderDate = tickets.map((order, i) => <section className="min-h-[4rem] flex items-center max-w-[30rem] overflow-hidden whitespace-nowrap" key={order._id || i}>{order.date || order.createdAt || '—'}</section>);

    return (
        <section>
            <h1 className="font-semibold text-[1.8rem] lg:text-[2rem]">Orders</h1>
            <p className="my-[1.5rem]">Total number of tickets sold : <span className="font-medium">{safeOrderInfo.ticketsSold ? safeOrderInfo.ticketsSold : tickets.length}</span> </p>
                <section className="dashboard-scroll flex justify-between overflow-auto gap-[1.2rem] h-[calc(100vh-17rem)] lg:h-[calc(100vh-24rem)]">
                    <section className="flex-[0_0_7rem]">
                        <h2 className="text-[1.65] font-medium h-[3rem]">Order ID</h2>
                        {tickets.length ? orderID : <p className="text-gray-500">No orders found</p>}
                    </section>
                    <section className="flex-[0_0_13rem]">
                        <h2 className="text-[1.65] font-medium h-[3rem]">Event Name</h2>
                        {tickets.length ? eventName : <p className="text-gray-500">—</p>}
                    </section>
                    <section className="flex-[0_0_13rem]">
                        <h2 className="text-[1.65] font-medium h-[3rem]">Buyer</h2>
                        {tickets.length ? buyer : <p className="text-gray-500">—</p>}
                    </section>
                    <section className="flex-[0_0_13rem]">
                        <h2 className="text-[1.65] font-medium h-[3rem]">Admission Type</h2>
                        {tickets.length ? amount : <p className="text-gray-500">—</p>}
                    </section>
                    <section className="flex-[0_0_10rem]">
                        <h2 className="text-[1.65] font-medium h-[3rem]">Order Date</h2>
                        {tickets.length ? orderDate : <p className="text-gray-500">—</p>}
                    </section>
                </section>
        </section>
    );
};

export default Orders;
