

import { GoogleGenAI } from "@google/genai";
import type { Order } from '../types';

export async function generateConfirmationEmail(order: Order): Promise<string> {
  // FIX: Per coding guidelines, initialize GoogleGenAI directly with process.env.API_KEY
  // and assume the API key is available, removing the manual check.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  if (!order.shippingInfo) {
    throw new Error("Order does not have shipping information.");
  }

  const itemList = order.items.map(item => `${item.quantity}x ${item.name}`).join(', ');

  const prompt = `
    Generate a friendly and professional shipping confirmation email for a customer.
    The response should be plain text, suitable for copying into an email body.

    Here is the information:
    - Customer's name: ${order.customer.name}
    - Order ID: ${order.id}
    - Items purchased: ${itemList}
    - Shipping carrier: ${order.shippingInfo.carrier}
    - Tracking number: ${order.shippingInfo.trackingNumber}

    Please construct the email with the following structure:
    1.  Start with a warm greeting, addressing the customer by their name.
    2.  Announce that their order has been shipped.
    3.  List the items in the shipment.
    4.  Provide the tracking number clearly. You can suggest a placeholder tracking link like 'https://tracking.example.com/TRACKING_NUMBER'.
    5.  End with a thank you note and a professional closing.

    Keep the tone appreciative and helpful.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating confirmation email with Gemini:", error);
    return "We're sorry, but we couldn't generate the email content at this time. Please check the console for errors or try again later.";
  }
}