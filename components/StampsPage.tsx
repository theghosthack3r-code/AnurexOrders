import React, { useState } from 'react';
import Spinner from './Spinner';
import { useAppContext } from '../contexts/AppContext';

const InfoCard: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-charcoal">{title}</h3>
        </div>
        <div className="p-4 space-y-2 text-cool-gray">
            {children}
        </div>
    </div>
);

const StampsPage: React.FC = () => {
  const { activeOrder, createLabel, cancelShipping } = useAppContext();
  const [packageType, setPackageType] = useState('Thick Envelope');
  const [weight, setWeight] = useState('5');
  const [service, setService] = useState('usps_ground_advantage');
  const [isCreating, setIsCreating] = useState(false);

  if (!activeOrder) {
      // Should not happen if routing is correct, but good practice to handle.
      return <div className="text-center p-8">No active order selected. Please return to the dashboard.</div>
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    // Simulate API call to Stamps.com
    setTimeout(() => {
      createLabel(activeOrder.id, { size: packageType, weight });
      // No need to set isCreating to false, as the component will unmount
    }, 1500);
  };
  
  const serviceOptions = {
      usps_ground_advantage: { name: 'USPS Ground Advantage™', cost: 4.75, delivery: '2-5 business days' },
      usps_priority_mail: { name: 'USPS Priority Mail®', cost: 9.25, delivery: '1-3 business days' },
      usps_priority_mail_express: { name: 'USPS Priority Mail Express®', cost: 30.50, delivery: 'Next-day to 2-day' },
  }

  const selectedCost = serviceOptions[service as keyof typeof serviceOptions].cost;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
                <InfoCard title="Addresses">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-charcoal">Ship From</p>
                            <p className="font-semibold">Anurex</p>
                            <p>123 Business Rd</p>
                            <p>Commerce City, CA 90210</p>
                            <p>United States</p>
                        </div>
                         <div>
                            <p className="text-sm font-medium text-charcoal">Ship To</p>
                            <p className="font-semibold">{activeOrder.customer.name}</p>
                            <p>{activeOrder.customer.address.line1}</p>
                            <p>{activeOrder.customer.address.city}, {activeOrder.customer.address.state} {activeOrder.customer.address.zip}</p>
                            <p>{activeOrder.customer.address.country}</p>
                        </div>
                    </div>
                </InfoCard>

                <InfoCard title="Package Details">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="packageType" className="block text-sm font-medium text-charcoal">Package Type</label>
                            <select id="packageType" value={packageType} onChange={(e) => setPackageType(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 text-charcoal rounded-md shadow-sm focus:outline-none focus:ring-seafoam focus:border-seafoam sm:text-sm">
                                <option>Thick Envelope</option>
                                <option>Package</option>
                                <option>Small Flat Rate Box</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="weight" className="block text-sm font-medium text-charcoal">Total Weight (oz)</label>
                            <input type="number" id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 text-charcoal rounded-md shadow-sm focus:outline-none focus:ring-seafoam focus:border-seafoam sm:text-sm" />
                        </div>
                     </div>
                </InfoCard>

                 <InfoCard title="Carrier & Service">
                    <div className="space-y-3">
                        {Object.entries(serviceOptions).map(([key, value]) => (
                             <label key={key} htmlFor={key} className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer transition-all ${service === key ? 'border-seafoam bg-seafoam/10 ring-2 ring-seafoam' : 'border-gray-300 bg-white'}`}>
                                <div>
                                    <p className="font-semibold text-charcoal">{value.name}</p>
                                    <p className="text-sm text-cool-gray">{value.delivery}</p>
                                </div>
                                <div className="flex items-center">
                                    <p className="text-lg font-bold text-charcoal mr-4">${value.cost.toFixed(2)}</p>
                                    <input type="radio" name="shipping-service" id={key} value={key} checked={service === key} onChange={e => setService(e.target.value)} className="h-4 w-4 text-seafoam focus:ring-seafoam border-gray-300" />
                                </div>
                            </label>
                        ))}
                    </div>
                 </InfoCard>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-1 space-y-6">
                 <InfoCard title="Order Summary">
                    <p className="text-sm text-cool-gray">Order #{activeOrder.id}</p>
                     <ul className="divide-y divide-gray-200">
                        {activeOrder.items.map(item => (
                            <li key={item.sku} className="py-2 flex justify-between">
                                <span className="text-charcoal">{item.quantity} x {item.name}</span>
                                <span className="font-medium text-cool-gray">({item.sku})</span>
                            </li>
                        ))}
                    </ul>
                 </InfoCard>
                 <InfoCard title="Cost Summary">
                    <div className="space-y-1 text-cool-gray">
                        <div className="flex justify-between"><span>Postage Price:</span> <span>${selectedCost.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Insurance:</span> <span>$0.00</span></div>
                        <div className="flex justify-between pb-2"><span>Signature Confirmation:</span> <span>$0.00</span></div>
                        <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-charcoal">
                            <span>Total Cost:</span>
                            <span className="text-xl text-seafoam">${selectedCost.toFixed(2)}</span>
                        </div>
                    </div>
                 </InfoCard>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-mist/90 backdrop-blur-sm shadow-md rounded-lg p-4 flex justify-end items-center space-x-4 sticky bottom-0 border-t border-gray-200">
             <button type="button" onClick={cancelShipping} className="bg-gray-200 text-charcoal font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors duration-200">
              Cancel
            </button>
            <button type="submit" disabled={isCreating} className="bg-seafoam text-white font-bold py-2 px-6 rounded-lg hover:bg-ocean-teal focus:outline-none focus:ring-2 focus:ring-seafoam focus:ring-opacity-50 transition-colors duration-200 disabled:bg-seafoam/50 disabled:cursor-not-allowed flex items-center min-w-[200px] justify-center">
              {isCreating && <Spinner />}
              {isCreating ? 'Creating Label...' : 'Create & Print Label'}
            </button>
        </div>
    </form>
  );
};

export default StampsPage;