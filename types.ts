export enum Store {
  Amazon = 'Amazon',
  Ebay = 'Ebay',
  PayPal = 'PayPal',
}

export enum OrderStatus {
  NeedsShipping = 'Needs Shipping',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
}

export interface Address {
  line1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Customer {
  name: string;
  address: Address;
}

export interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
}

export interface ShippingInfo {
  carrier: string;
  trackingNumber: string;
}

export interface Order {
  id: string;
  store: Store;
  customer: Customer;
  items: OrderItem[];
  status: OrderStatus;
  shippingInfo?: ShippingInfo;
  orderDate: string;
  total: number;
}

export type View = 'dashboard' | 'stamps' | 'returns' | 'analytics' | 'settings';
