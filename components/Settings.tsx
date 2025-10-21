import React, { useState } from 'react';
import { Store } from '../types';
import { StoreLogo } from '../constants';
import Spinner from './Spinner';
import { useAppContext } from '../contexts/AppContext';

const Settings: React.FC = () => {
  const { connections, connectStore, syncOrders, email, setEmail, phone, setPhone } = useAppContext();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const STORES_TO_CONNECT: Store[] = [Store.Amazon, Store.Ebay, Store.PayPal];

  const handleSyncClick = () => {
    setIsSyncing(true);
    syncOrders().finally(() => setIsSyncing(false));
  };
  
  const isAnyStoreConnected = Object.values(connections).some(status => status);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Store Connections Card */}
      <div className="bg-white shadow-md rounded-lg p-8 border border-gray-200">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div>
                <h2 className="text-2xl font-bold text-charcoal">Store Connections</h2>
                <p className="text-cool-gray mt-1">Connect your stores to automatically pull in orders.</p>
            </div>
            <button
                onClick={handleSyncClick}
                disabled={!isAnyStoreConnected || isSyncing}
                className="bg-seafoam text-white font-bold py-2 px-4 rounded-lg hover:bg-ocean-teal focus:outline-none focus:ring-2 focus:ring-seafoam focus:ring-opacity-50 transition-colors duration-200 disabled:bg-cool-gray disabled:cursor-not-allowed flex items-center"
            >
                {isSyncing && <Spinner />}
                {isSyncing ? 'Syncing...' : 'Sync Orders'}
            </button>
        </div>

        <div className="space-y-4">
            {STORES_TO_CONNECT.map(store => {
                const isConnected = connections[store];
                return (
                    <div key={store} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-center">
                            <StoreLogo store={store} className="h-8 w-auto mr-4"/>
                            <span className="font-medium text-charcoal">{store}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                             <div className="flex items-center">
                                <span className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                <span className={`text-sm font-semibold ${isConnected ? 'text-green-600' : 'text-cool-gray'}`}>
                                    {isConnected ? 'Connected' : 'Not Connected'}
                                </span>
                            </div>
                            <button
                            {isConnected ? (
                                <button
                                    onClick={() => disconnectStore(store)}
                                    className="font-bold py-2 px-4 rounded-lg text-sm transition-colors duration-200 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                >
                                    Disconnect
                                </button>
                            ) : (
                                <button
                                    onClick={() => connectStore(store)}
                                    className="font-bold py-2 px-4 rounded-lg text-sm transition-colors duration-200 border border-seafoam text-seafoam hover:bg-seafoam hover:text-white"
                                >
                                    Connect
                                </button>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
        <p className="text-xs text-cool-gray mt-6">
            Note: Clicking 'Connect' simulates an OAuth flow. In a real application, this would redirect you to the platform to grant permissions.
        </p>
      </div>


      {/* Notification Settings Card */}
      <div className="bg-white shadow-md rounded-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-charcoal mb-6">Notification Settings</h2>
        <p className="text-cool-gray mb-8">
            Configure how you receive alerts for new orders. (Note: This is a UI demonstration. No actual notifications will be sent.)
        </p>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div>
              <label htmlFor="emailToggle" className="font-medium text-charcoal">Email Notifications</label>
              <p className="text-sm text-cool-gray">Receive an email for every new order.</p>
            </div>
            <label htmlFor="emailToggle" className="flex items-center cursor-pointer">
              <div className="relative">
                <input type="checkbox" id="emailToggle" className="sr-only" checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
                <div className="block bg-cool-gray w-14 h-8 rounded-full"></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${emailNotifications ? 'translate-x-full !bg-seafoam' : ''}`}></div>
              </div>
            </label>
          </div>
          {emailNotifications && (
             <div className="pl-4">
                <label htmlFor="email" className="block text-sm font-medium text-charcoal">Email Address</label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 text-charcoal rounded-md shadow-sm placeholder-cool-gray focus:outline-none focus:ring-seafoam focus:border-seafoam sm:text-sm"/>
            </div>
          )}

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div>
              <label htmlFor="smsToggle" className="font-medium text-charcoal">SMS Notifications</label>
              <p className="text-sm text-cool-gray">Get a text message for urgent orders.</p>
            </div>
            <label htmlFor="smsToggle" className="flex items-center cursor-pointer">
              <div className="relative">
                <input type="checkbox" id="smsToggle" className="sr-only" checked={smsNotifications} onChange={() => setSmsNotifications(!smsNotifications)} />
                <div className="block bg-cool-gray w-14 h-8 rounded-full"></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${smsNotifications ? 'translate-x-full !bg-seafoam' : ''}`}></div>
              </div>
            </label>
          </div>

           {smsNotifications && (
             <div className="pl-4">
                <label htmlFor="phone" className="block text-sm font-medium text-charcoal">Phone Number</label>
                <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 text-charcoal rounded-md shadow-sm placeholder-cool-gray focus:outline-none focus:ring-seafoam focus:border-seafoam sm:text-sm"/>
            </div>
          )}
        </div>
        <div className="mt-8 text-right">
            <button className="bg-seafoam text-white font-bold py-2 px-6 rounded-lg hover:bg-ocean-teal focus:outline-none focus:ring-2 focus:ring-seafoam focus:ring-opacity-50 transition-colors duration-200">
                Save Changes
            </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;