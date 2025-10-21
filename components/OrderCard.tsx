import React from 'react';
import type { Order } from '../types';
import { OrderStatus } from '../types';
import { StoreLogo } from '../constants';
import { useAppContext } from '../contexts/AppContext';

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const { initiateShipping, openConfirmationModal } = useAppContext();
  
  const statusColors: Record<OrderStatus, string> = {
    [OrderStatus.NeedsShipping]: 'bg-amber-100 text-amber-800',
    [OrderStatus.Shipped]: 'bg-seafoam text-white font-semibold',
    [OrderStatus.Delivered]: 'bg-green-100 text-green-800',
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col border border-gray-200">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start">
            <div className="w-24">
                 <StoreLogo store={order.store} className="w-20 h-auto" />
            </div>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[order.status]}`}>
                {order.status}
            </span>
        </div>

        <div className="mt-4">
            <p className="text-sm text-cool-gray">Order #{order.id}</p>
            <p className="text-lg font-bold text-charcoal">{order.customer.name}</p>
            <p className="text-sm text-cool-gray">{order.customer.address.line1}, {order.customer.address.city}</p>
        </div>

        <div className="mt-4 border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-anurex-navy">Items:</h4>
            <ul className="list-disc list-inside text-cool-gray mt-2">
                {order.items.map(item => (
                    <li key={item.sku}>{item.quantity} x {item.name}</li>
                ))}
            </ul>
        </div>
        
        {order.status === OrderStatus.Shipped && order.shippingInfo && (
            <div className="mt-4 border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-anurex-navy">Tracking:</h4>
                <p className="text-sm text-cool-gray truncate">{order.shippingInfo.trackingNumber}</p>
            </div>
        )}
      </div>

      <div className="bg-gray-50 p-4 border-t border-gray-200">
        {order.status === OrderStatus.NeedsShipping && (
          <button 
            onClick={() => initiateShipping(order)}
            className="w-full bg-seafoam text-white font-bold py-2 px-4 rounded-lg hover:bg-ocean-teal focus:outline-none focus:ring-2 focus:ring-seafoam focus:ring-opacity-50 transition-colors duration-200"
          >
            Create Shipping Label
          </button>
        )}
        {order.status === OrderStatus.Shipped && (
          <button 
            onClick={() => openConfirmationModal(order)}
            className="w-full bg-seafoam text-white font-bold py-2 px-4 rounded-lg hover:bg-ocean-teal focus:outline-none focus:ring-2 focus:ring-seafoam focus:ring-opacity-50 transition-colors duration-200"
          >
            Generate Confirmation Email
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;