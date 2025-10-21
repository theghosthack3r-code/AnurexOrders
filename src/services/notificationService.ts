import { Order } from '../types';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';

// SendGrid configuration
sgMail.setApiKey(import.meta.env.VITE_SENDGRID_API_KEY);

// Twilio configuration
const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const sendEmailNotification = async (order: Order, email: string): Promise<void> => {
  console.log(`Sending email notification for order ${order.id} to ${email}`);

  const msg = {
    to: email,
    from: 'your-verified-sender@example.com', // Use a verified sender
    subject: `New Order Notification: ${order.id}`,
    text: `You have a new order from ${order.platform}. Order ID: ${order.id}. Customer: ${order.customerName}.`,
    html: `<strong>You have a new order from ${order.platform}.</strong><br>Order ID: ${order.id}<br>Customer: ${order.customerName}`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
};

export const sendSmsNotification = async (order: Order, phone: string): Promise<void> => {
  console.log(`Sending SMS notification for order ${order.id} to ${phone}`);

  try {
    await client.messages.create({
      body: `New order from ${order.platform}: ${order.id}. Customer: ${order.customerName}.`,
      from: import.meta.env.VITE_TWILIO_PHONE_NUMBER,
      to: phone,
    });
  } catch (error) {
    console.error('Error sending SMS notification:', error);
  }
};
