import React from 'react';
import { OrderStatus, Store } from '../types';
import OrderCard from './OrderCard';
import { useAppContext } from '../contexts/AppContext';

const Dashboard: React.FC = () => {
  const { filteredOrders, searchQuery, setSearchQuery, storeFilter, setStoreFilter } = useAppContext();

  const ordersToShip = filteredOrders.filter(o => o.status === OrderStatus.NeedsShipping);
  const shippedOrders = filteredOrders.filter(o => o.status === OrderStatus.Shipped);
  
  const storeFilters: (Store | 'All')[] = ['All', Store.Amazon, Store.Ebay, Store.PayPal];

  return (
    <div className="space-y-8">
      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="search" className="sr-only">Search Orders</label>
            <input
              type="text"
              id="search"
              placeholder="Search by name or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-charcoal rounded-md shadow-sm placeholder-cool-gray focus:outline-none focus:ring-seafoam focus:border-seafoam"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {storeFilters.map(store => (
              <button
                key={store}
                onClick={() => setStoreFilter(store)}
                className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                  storeFilter === store
                    ? 'bg-seafoam text-white shadow'
                    : 'bg-white text-cool-gray hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {store}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-anurex-navy mb-4">Orders to Ship ({ordersToShip.length})</h2>
        {ordersToShip.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ordersToShip.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-cool-gray border border-gray-200">
            <p>No matching orders to ship. Great job!</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-anurex-navy mb-4">Recently Shipped ({shippedOrders.length})</h2>
         {shippedOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shippedOrders.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        ) : (
           <div className="bg-white rounded-lg shadow-md p-6 text-center text-cool-gray border border-gray-200">
            <p>No matching orders have been shipped recently.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;