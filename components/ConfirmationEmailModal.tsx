import React, { useState, useEffect } from 'react';
import type { Order } from '../types';
import { generateConfirmationEmail } from '../services/geminiService';
import { XIcon } from '../constants';
import Spinner from './Spinner';

interface ConfirmationEmailModalProps {
  order: Order;
  onClose: () => void;
}

const ConfirmationEmailModal: React.FC<ConfirmationEmailModalProps> = ({ order, onClose }) => {
  const [emailBody, setEmailBody] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const generatedEmail = await generateConfirmationEmail(order);
        setEmailBody(generatedEmail);
      } catch (e) {
        setError('Failed to generate email. Please try again.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const handleCopy = () => {
    navigator.clipboard.writeText(emailBody);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl transform transition-all flex flex-col" style={{height: '70vh'}}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-charcoal">Generated Confirmation Email</h2>
          <button onClick={onClose} className="p-1 rounded-full text-cool-gray hover:bg-gray-200 hover:text-charcoal">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full">
              <Spinner large />
              <p className="mt-4 text-cool-gray">Generating email with Gemini...</p>
            </div>
          )}
          {error && <div className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
          {!isLoading && !error && (
            <textarea
              readOnly
              value={emailBody}
              className="w-full h-full p-3 font-mono text-sm bg-gray-100 border-gray-300 text-charcoal rounded-md resize-none focus:ring-2 focus:ring-seafoam focus:outline-none"
            />
          )}
        </div>
        <div className="bg-white px-6 py-4 rounded-b-lg flex justify-end border-t border-gray-200">
          <button 
            onClick={handleCopy} 
            disabled={isLoading || !!error}
            className="bg-seafoam text-white font-bold py-2 px-4 rounded-lg hover:bg-ocean-teal transition-colors duration-200 disabled:bg-slate-300"
          >
            {isCopied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationEmailModal;