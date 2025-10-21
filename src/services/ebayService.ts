import { Order } from '../types';

const API_BASE_URL = 'https://api.ebay.com/sell/fulfillment/v1';

export const connectEbayAccount = async (): Promise<string> => {
  const clientId = import.meta.env.VITE_EBAY_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_EBAY_REDIRECT_URI;
  const scope = 'https://api.ebay.com/oauth/api_scope/sell.fulfillment';
  const responseType = 'code';
  const prompt = 'login';

  const authUrl = `https://auth.ebay.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&prompt=${prompt}`;

  return authUrl;
};

export const handleEbayAuthCallback = async (code: string): Promise<void> => {
  const clientId = import.meta.env.VITE_EBAY_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_EBAY_CLIENT_SECRET;
  const redirectUri = import.meta.env.VITE_EBAY_REDIRECT_URI;
  const tokenUrl = 'https://api.ebay.com/identity/v1/oauth2/token';

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to exchange auth code for token: ${error.error_description}`);
  }

  const data = await response.json();
  localStorage.setItem('ebay_access_token', data.access_token);
};

export const getEbayOrders = async (): Promise<Order[]> => {
  console.log('Fetching eBay orders...');
  const accessToken = localStorage.getItem('ebay_access_token');
  if (!accessToken) {
    throw new Error('eBay account not connected');
  }

  const response = await fetch(`${API_BASE_URL}/order`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch eBay orders');
  }

  const data = await response.json();

  const orders: Order[] = data.orders.map((order: any) => ({
    id: order.orderId,
    platform: 'ebay',
    customerName: order.buyer.username,
    items: order.lineItems.map((item: any) => ({
      id: item.lineItemId,
      name: item.title,
      quantity: item.quantity,
    })),
    status: order.orderFulfillmentStatus,
  }));

  return orders;
};
