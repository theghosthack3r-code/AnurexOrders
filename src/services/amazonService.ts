import { Order } from '../types';

const API_BASE_URL = 'https://sellingpartnerapi-na.amazon.com'; // North America endpoint

export const connectAmazonAccount = async (): Promise<string> => {
  const applicationId = import.meta.env.VITE_AMAZON_APPLICATION_ID;
  const redirectUri = import.meta.env.VITE_AMAZON_REDIRECT_URI;
  const version = 'beta'; // or 'v1' for production
  const state = 'some_random_string'; // Replace with a unique, randomly generated string for security

  const authUrl = `https://sellercentral.amazon.com/apps/authorize/consent?application_id=${applicationId}&redirect_uri=${redirectUri}&version=${version}&state=${state}`;

  return authUrl;
};

export const handleAmazonAuthCallback = async (code: string): Promise<void> => {
  const clientId = import.meta.env.VITE_AMAZON_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_AMAZON_CLIENT_SECRET;
  const tokenUrl = 'https://api.amazon.com/auth/o2/token';

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to exchange auth code for token: ${error.error_description}`);
  }

  const data = await response.json();
  localStorage.setItem('amazon_access_token', data.access_token);
  // You might also want to store the refresh token if you need to refresh the access token later
  // localStorage.setItem('amazon_refresh_token', data.refresh_token);
};

export const getAmazonOrders = async (): Promise<Order[]> => {
  console.log('Fetching Amazon orders...');
  const accessToken = localStorage.getItem('amazon_access_token');
  if (!accessToken) {
    throw new Error('Amazon account not connected');
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const response = await fetch(`${API_BASE_URL}/orders/v0/orders?CreatedAfter=${thirtyDaysAgo.toISOString()}`, {
    headers: {
      'x-amz-access-token': accessToken,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Amazon orders');
  }

  const data = await response.json();

  const orders: Order[] = data.payload.Orders.map((order: any) => ({
    id: order.AmazonOrderId,
    platform: 'amazon',
    customerName: order.ShippingAddress?.Name || 'N/A',
    items: [], // The Orders API does not return item details, a separate call to getOrderItems is needed
    status: order.OrderStatus,
  }));

  return orders;
};
