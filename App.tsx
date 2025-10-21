import React, { useEffect } from 'react';
import { useAppContext } from './contexts/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import StampsPage from './components/StampsPage';
import Analytics from './components/Analytics';
import Returns from './components/Returns';
import MockLabel from './components/MockLabel';
import ConfirmationEmailModal from './components/ConfirmationEmailModal';
import Toast from './components/Toast';

const App: React.FC = () => {
  const {
    activeView,
    activeOrder,
    isLabelModalOpen,
    closeLabelModal,
    isConfirmationModalOpen,
    closeConfirmationModal,
    toastMessage,
    hideToast,
    handleAuthCallback,
  } = useAppContext();

  useEffect(() => {
    handleAuthCallback();
  }, [handleAuthCallback]);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'stamps':
        return <StampsPage />;
      case 'settings':
        return <Settings />;
      case 'analytics':
        return <Analytics />;
      case 'returns':
        return <Returns />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          {renderView()}
        </main>
      </div>
      {isLabelModalOpen && activeOrder && <MockLabel order={activeOrder} onClose={closeLabelModal} />}
      {isConfirmationModalOpen && activeOrder && <ConfirmationEmailModal order={activeOrder} onClose={closeConfirmationModal} />}
      <Toast message={toastMessage} onClose={hideToast} />
    </div>
  );
};

export default App;