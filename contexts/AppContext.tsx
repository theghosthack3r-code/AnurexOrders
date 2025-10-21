import React, { createContext, useState, useContext, useMemo } from 'react';
import { MOCK_ORDERS } from '../constants';
import { OrderStatus, type Order, Store, View } from '../types';

interface AppContextType {
  orders: Order[];
  filteredOrders: Order[];
  activeView: View;
  setActiveView: (view: View) => void;
  activeOrder: Order | null;
  
  // Modals
  isLabelModalOpen: boolean;
  isConfirmationModalOpen: boolean;
  openConfirmationModal: (order: Order) => void;
  closeConfirmationModal: () => void;
  closeLabelModal: () => void;

  // Shipping flow
  initiateShipping: (order: Order) => void;
  cancelShipping: () => void;
  createLabel: (orderId: string, packageDetails: { size: string; weight: string }) => void;

  // Settings
  connections: Record<Store, boolean>;
  toggleConnection: (store: Store) => void;
  syncOrders: () => Promise<void>;

  // Dashboard filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  storeFilter: Store | 'All';
  setStoreFilter: (store: Store | 'All') => void;

  // Toast
  toastMessage: string | null;
  showToast: (message: string) => void;
  hideToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const [connections, setConnections] = useState<Record<Store, boolean>>({
    [Store.Amazon]: false,
    [Store.Ebay]: false,
    [Store.PayPal]: false,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [storeFilter, setStoreFilter] = useState<Store | 'All'>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleConnection = (store: Store) => {
    setConnections(prev => ({ ...prev, [store]: !prev[store] }));
  };
  
  const syncOrders = () => {
    return new Promise<void>(resolve => {
        setTimeout(() => {
            setOrders(MOCK_ORDERS);
            showToast('Orders Synced Successfully!');
            resolve();
        }, 1000);
    });
  };

  const initiateShipping = (order: Order) => {
    setActiveOrder(order);
    setActiveView('stamps');
  };
  
  const cancelShipping = () => {
      setActiveOrder(null);
      setActiveView('dashboard');
  };

  const createLabel = (orderId: string, packageDetails: { size: string; weight: string }) => {
    const trackingNumber = `1Z${Math.random().toString().slice(2, 18).toUpperCase()}`;
    setOrders(prevOrders =>
      prevOrders.map(o =>
        o.id === orderId
          ? { ...o, status: OrderStatus.Shipped, shippingInfo: { carrier: 'Stamps.com / USPS', trackingNumber } }
          : o
      )
    );
    setActiveOrder(prev => prev ? { ...prev, status: OrderStatus.Shipped, shippingInfo: { carrier: 'Stamps.com / USPS', trackingNumber } } : null);
    setIsLabelModalOpen(true);
    setActiveView('dashboard');
  };
  
  const closeLabelModal = () => {
      setIsLabelModalOpen(false);
      setActiveOrder(null);
  };
  
  const openConfirmationModal = (order: Order) => {
    setActiveOrder(order);
    setIsConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
      setIsConfirmationModalOpen(false);
      setActiveOrder(null);
  }

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const hideToast = () => {
    setToastMessage(null);
  }

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        order.customer.name.toLowerCase().includes(searchLower) ||
        order.id.toLowerCase().includes(searchLower);
      
      const matchesStore = storeFilter === 'All' || order.store === storeFilter;

      return matchesSearch && matchesStore;
    });
  }, [orders, searchQuery, storeFilter]);

  const value = {
    orders,
    filteredOrders,
    activeView,
    setActiveView,
    activeOrder,
    isLabelModalOpen,
    isConfirmationModalOpen,
    openConfirmationModal,
    closeConfirmationModal,
    closeLabelModal,
    initiateShipping,
    cancelShipping,
    createLabel,
    connections,
    toggleConnection,
    syncOrders,
    searchQuery,
    setSearchQuery,
    storeFilter,
    setStoreFilter,
    toastMessage,
    showToast,
    hideToast
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
