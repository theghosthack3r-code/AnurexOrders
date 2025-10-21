import { Order } from '../types';

const API_BASE_URL = 'https://api-m.sandbox.paypal.com/v1'; // Using sandbox for development

export const connectPaypalAccount = async (): Promise<string> => {
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_PAYPAL_REDIRECT_URI;
  const scope = 'openid email profile';
  const responseType = 'code';

  const authUrl = `https://www.sandbox.paypal.com/connect?flowEntry=static&client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

  return authUrl;
};

export const handlePaypalAuthCallback = async (code: string): Promise<void> => {
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_PAYPAL_CLIENT_SECRET;
  const tokenUrl = 'https://api-m.sandbox.paypal.com/v1/oauth2/token';

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to exchange auth code for token: ${error.error_description}`);
  }

  const data = await response.json();
  localStorage.setItem('paypal_access_token', data.access_token);
  // You might also want to store the refresh token if you need to refresh the access token later
  // localStorage.setItem('paypal_refresh_token', data.refresh_token);
};

export const getPaypalOrders = async (): Promise<Order[]> => {
  console.log('Fetching PayPal orders...');
  const accessToken = localStorage.getItem('paypal_access_token');
  if (!accessToken) {
    throw new Error('PayPal account not connected');
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);

  const response = await fetch(`${API_BASE_URL}/v1/reporting/transactions?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}&fields=all`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch PayPal orders');
  }

  const data = await response.json();

  const orders: Order[] = data.transaction_details.map((transaction: any) => ({
    id: transaction.transaction_info.transaction_id,
    platform: 'paypal',
    customerName: transaction.payer_info.payer_name.alternate_full_name,
    items: transaction.cart_info.item_details.map((item: any) => ({
      id: item.item_code,
      name: item.item_name,
      quantity: parseInt(item.item_quantity),
    })),
    status: transaction.transaction_info.transaction_status,
  }));

  return orders;
};
