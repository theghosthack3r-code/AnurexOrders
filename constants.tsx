import React from 'react';
import { Order, OrderStatus, Store } from './types';

// Mock Data
export const MOCK_ORDERS: Order[] = [
  {
    id: 'AMZ-789123',
    store: Store.Amazon,
    customer: {
      name: 'Jane Doe',
      address: {
        line1: '123 Maple St',
        city: 'Springfield',
        state: 'IL',
        zip: '62704',
        country: 'United States',
      },
    },
    items: [
      { sku: 'BK-001', name: 'The Art of Programming', quantity: 1 },
      { sku: 'GAD-004', name: 'Ergonomic Mouse', quantity: 1 },
    ],
    status: OrderStatus.NeedsShipping,
    orderDate: '2023-10-26T10:00:00Z',
    total: 74.98,
  },
  {
    id: 'EBY-456789',
    store: Store.Ebay,
    customer: {
      name: 'John Smith',
      address: {
        line1: '456 Oak Ave',
        city: 'Metropolis',
        state: 'NY',
        zip: '10001',
        country: 'United States',
      },
    },
    items: [{ sku: 'VIN-012', name: 'Vintage Leather Jacket', quantity: 1 }],
    status: OrderStatus.NeedsShipping,
    orderDate: '2023-10-26T11:30:00Z',
    total: 125.0,
  },
  {
    id: 'PPL-101112',
    store: Store.PayPal,
    customer: {
      name: 'Alice Johnson',
      address: {
        line1: '789 Pine Ln',
        city: 'Gotham',
        state: 'NJ',
        zip: '07001',
        country: 'United States',
      },
    },
    items: [{ sku: 'ART-003', name: 'Abstract Canvas Painting', quantity: 1 }],
    status: OrderStatus.NeedsShipping,
    orderDate: '2023-10-25T14:00:00Z',
    total: 350.0,
  },
  {
    id: 'AMZ-131415',
    store: Store.Amazon,
    customer: {
      name: 'Bob Brown',
      address: {
        line1: '101 Birch Rd',
        city: 'Star City',
        state: 'WA',
        zip: '98101',
        country: 'United States',
      },
    },
    items: [{ sku: 'ELE-007', name: 'Wireless Headphones', quantity: 1 }],
    status: OrderStatus.Shipped,
    shippingInfo: {
      carrier: 'Stamps.com / USPS',
      trackingNumber: '1Z9999999999999999',
    },
    orderDate: '2023-10-24T09:00:00Z',
    total: 89.99,
  },
  {
    id: 'EBY-161718',
    store: Store.Ebay,
    customer: {
      name: 'Charlie Davis',
      address: {
        line1: '212 Cedar Blvd',
        city: 'Central City',
        state: 'CO',
        zip: '80202',
        country: 'United States',
      },
    },
    items: [{ sku: 'COL-005', name: 'Rare Stamp Collection', quantity: 1 }],
    status: OrderStatus.Shipped,
    shippingInfo: {
      carrier: 'Stamps.com / USPS',
      trackingNumber: '1Z8888888888888888',
    },
    orderDate: '2023-10-23T16:45:00Z',
    total: 210.5,
  },
];


// Icons
export const XIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const PrintIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
);

// SVGs for stores
const AmazonLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M512 0C229.232 0 0 229.232 0 512s229.232 512 512 512 512-229.232 512-512S794.768 0 512 0zm-99.2 698.88l-68.48-68.48-152.96 152.96-74.88-74.88 152.96-152.96-68.48-68.48 74.88-74.88 68.48 68.48 106.88-106.88 74.88 74.88-106.88 106.88 68.48 68.48-74.88 74.88-68.48-68.48-42.56 42.56-61.44 61.44zm260.48 95.36c-24.96 0-44.8-19.84-44.8-44.8s19.84-44.8 44.8-44.8 44.8 19.84 44.8 44.8-19.84 44.8-44.8 44.8zm-1.28-115.2c-52.48 0-95.36 42.88-95.36 95.36s42.88 95.36 95.36 95.36 95.36-42.88 95.36-95.36-42.88-95.36-95.36-95.36zm-25.6-35.84c-3.2-11.52-4.48-23.04-4.48-35.2 0-70.4 56.96-127.36 127.36-127.36s127.36 56.96 127.36 127.36-56.96 127.36-127.36 127.36c-12.16 0-23.68-1.28-35.2-4.48-43.52 35.84-100.48 56.32-162.56 56.32-123.52 0-224-100.48-224-224s100.48-224 224-224c62.08 0 119.04 20.48 162.56 56.32z" fill="#FF9900"/>
    <path d="M673.28 793.6c-24.96 0-44.8-19.84-44.8-44.8s19.84-44.8 44.8-44.8 44.8 19.84 44.8 44.8-19.84 44.8-44.8 44.8zm-1.28-115.2c-52.48 0-95.36 42.88-95.36 95.36s42.88 95.36 95.36 95.36 95.36-42.88 95.36-95.36-42.88-95.36-95.36-95.36z" fill="#232F3E"/>
    <path d="M716.8 642.56c11.52 3.2 23.04 4.48 35.2 4.48 70.4 0 127.36-56.96 127.36-127.36s-56.96-127.36-127.36-127.36-127.36 56.96-127.36 127.36c0 12.16 1.28 23.68 4.48 35.2 35.84-43.52 56.32-100.48 56.32-162.56 0-123.52-100.48-224-224-224s-224 100.48-224 224 100.48 224 224 224c62.08 0 119.04-20.48 162.56-56.32z" fill="#232F3E"/>
  </svg>
);

const EbayLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm134.4 313.6c0 11.2-9.6 20.8-20.8 20.8h-78.4c-11.2 0-20.8-9.6-20.8-20.8v-72c0-11.2 9.6-20.8 20.8-20.8h78.4c11.2 0 20.8 9.6 20.8 20.8v72zm-128-193.6H120c-11.2 0-20.8 9.6-20.8 20.8v72c0 11.2 9.6 20.8 20.8 20.8h142.4c11.2 0 20.8-9.6 20.8-20.8v-72c0-11.2-9.6-20.8-20.8-20.8z" fill="#e53238"/>
    <path d="M262.4 128H120c-11.2 0-20.8 9.6-20.8 20.8v72c0 11.2 9.6 20.8 20.8 20.8h142.4c11.2 0 20.8-9.6 20.8-20.8v-72c0-11.2-9.6-20.8-20.8-20.8z" fill="#0064d2"/>
    <path d="M390.4 128h-78.4c-11.2 0-20.8 9.6-20.8 20.8v72c0 11.2 9.6 20.8 20.8 20.8h78.4c11.2 0 20.8-9.6 20.8-20.8v-72c0-11.2-9.6-20.8-20.8-20.8z" fill="#f5af02"/>
    <path d="M219.2 249.6H120c-11.2 0-20.8 9.6-20.8 20.8v72c0 11.2 9.6 20.8 20.8 20.8h99.2c11.2 0 20.8-9.6 20.8-20.8v-72c0-11.2-9.6-20.8-20.8-20.8z" fill="#86b817"/>
  </svg>
);

const PayPalLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm-30.4 360h-57.6c-4.8 0-8-3.2-8-8l-16-104c-1.6-9.6 4.8-19.2 14.4-20.8l108.8-17.6c8-1.6 14.4 4.8 12.8 12.8l-17.6 108.8c-1.6 9.6-11.2 16-20.8 14.4l-16-.8z" fill="#0070ba"/>
      <path d="M275.2 368h57.6c4.8 0 8-3.2 8-8l16-104c1.6-9.6-4.8-19.2-14.4-20.8L233.6 217.6c-8-1.6-14.4 4.8-12.8 12.8l17.6 108.8c1.6 9.6 11.2 16 20.8 14.4l16-.8z" fill="#009cde"/>
    </svg>
);

export const StoreLogo: React.FC<{ store: Store; className?: string }> = ({ store, className }) => {
  switch (store) {
    case Store.Amazon:
      return <AmazonLogo className={className} />;
    case Store.Ebay:
      return <EbayLogo className={className} />;
    case Store.PayPal:
      return <PayPalLogo className={className} />;
    default:
      return null;
  }
};
