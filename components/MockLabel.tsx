import React from 'react';
import type { Order } from '../types';
import { XIcon, PrintIcon } from '../constants';

interface MockLabelProps {
  order: Order;
  onClose: () => void;
}

const MockLabel: React.FC<MockLabelProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    const printContents = document.getElementById('printable-label')?.innerHTML;
    const originalContents = document.body.innerHTML;
    if (printContents) {
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // To re-attach React
    }
  };

  if (!order.shippingInfo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-charcoal">Shipping Label Ready</h2>
          <button onClick={onClose} className="p-1 rounded-full text-cool-gray hover:bg-gray-200 hover:text-charcoal">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
            <div id="printable-label" className="border-4 border-dashed border-cool-gray p-4 bg-white text-charcoal">
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <p className="text-xs">SHIP FROM:</p>
                        <p className="font-semibold">Anurex</p>
                        <p>123 Business Rd</p>
                        <p>Commerce City, CA 90210</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-2xl">USPS FIRST-CLASS PKG</p>
                    </div>
                </div>
                <div className="my-8 text-center">
                    <p className="text-xs">SHIP TO:</p>
                    <p className="font-bold text-lg">{order.customer.name}</p>
                    <p>{order.customer.address.line1}</p>
                    <p>{order.customer.address.city}, {order.customer.address.state} {order.customer.address.zip}</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <img src="https://barcode.tec-it.com/barcode.ashx?data=420902109405510200881900003924&code=GS1-128" alt="barcode" className="h-24" />
                    <p className="font-mono tracking-widest text-sm mt-1">{order.shippingInfo.trackingNumber}</p>
                </div>
            </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end border-t border-gray-200">
          <button onClick={handlePrint} className="bg-seafoam text-white font-bold py-2 px-4 rounded-lg hover:bg-ocean-teal flex items-center transition-colors duration-200">
            <PrintIcon className="w-5 h-5 mr-2" />
            Print Label
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockLabel;