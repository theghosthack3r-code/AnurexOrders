import React, { createContext, useState, useContext, useMemo } from 'react';
import { MOCK_ORDERS } from '../constants';
import { OrderStatus, type Order, Store, View } from '../types';
import { connectAmazonAccount, getAmazonOrders, handleAmazonAuthCallback } from '../src/services/amazonService';
import { connectEbayAccount, getEbayOrders, handleEbayAuthCallback } from '../src/services/ebayService';
import { connectPaypalAccount, getPaypalOrders, handlePaypalAuthCallback } from '../src/services/paypalService';
import { sendEmailNotification, sendSmsNotification } from '../src/services/notificationService';

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
  connectStore: (store: Store) => Promise<void>;
  disconnectStore: (store: Store) => void;
  syncOrders: () => Promise<void>;
  handleAuthCallback: () => Promise<void>;

  // Dashboard filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  storeFilter: Store | 'All';
  setStoreFilter: (store: Store | 'All') => void;

  // Settings
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;

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
  const [email, setEmail] = useState('your-business-email@example.com');
  const [phone, setPhone] = useState('+15551234567');

  const connectStore = async (store: Store) => {
    try {
      sessionStorage.setItem('connecting_store', store);
      let authUrl = '';
      switch (store) {
        case Store.Amazon:
          authUrl = await connectAmazonAccount();
          break;
        case Store.Ebay:
          authUrl = await connectEbayAccount();
          break;
        case Store.PayPal:
          authUrl = await connectPaypalAccount();
          break;
      }
      showToast(`Redirecting to: ${authUrl}`);
      window.location.href = authUrl;
    } catch (error) {
      showToast(`Failed to initiate connection to ${store}.`);
    }
  };

  const disconnectStore = (store: Store) => {
    setConnections(prev => ({ ...prev, [store]: false }));
    localStorage.removeItem(`${store.toLowerCase()}_access_token`);
    showToast(`${store} disconnected successfully.`);
  };

  const handleAuthCallback = async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const connectingStore = sessionStorage.getItem('connecting_store') as Store;

    if (code && connectingStore) {
      try {
        switch (connectingStore) {
          case Store.Amazon:
            await handleAmazonAuthCallback(code);
            break;
          case Store.Ebay:
            await handleEbayAuthCallback(code);
            break;
          case Store.PayPal:
            await handlePaypalAuthCallback(code);
            break;
        }
        setConnections(prev => ({ ...prev, [connectingStore]: true }));
        showToast(`${connectingStore} connected successfully!`);
      } catch (error) {
        showToast(`Failed to connect ${connectingStore}.`);
      } finally {
        sessionStorage.removeItem('connecting_store');
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  };
  
  const syncOrders = async () => {
    const newOrders: Order[] = [];
    if (connections[Store.Amazon]) {
      const amazonOrders = await getAmazonOrders();
      newOrders.push(...amazonOrders);
    }
    if (connections[Store.Ebay]) {
      const ebayOrders = await getEbayOrders();
      newOrders.push(...ebayOrders);
    }
    if (connections[Store.PayPal]) {
      const paypalOrders = await getPaypalOrders();
      newOrders.push(...paypalOrders);
    }

    if (newOrders.length > 0) {
      for (const order of newOrders) {
        sendEmailNotification(order, email);
        sendSmsNotification(order, phone);
      }
    }

    setOrders(prevOrders => [...prevOrders, ...newOrders]);
    showToast('Orders Synced Successfully!');
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
    connectStore,
    disconnectStore,
    syncOrders,
    handleAuthCallback,
    searchQuery,
    setSearchQuery,
    storeFilter,
    setStoreFilter,
    toastMessage,
    showToast,
    hideToast,
    email,
    setEmail,
    phone,
    setPhone
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
