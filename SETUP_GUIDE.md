# Payment Gateway Setup Guide

## 🎯 What We've Built

A comprehensive payment gateway that supports:

### ✅ Local Payments (India)
- INR currency payments
- Domestic Indian customers
- Simplified checkout flow

### ✅ International Payments (Export)
- Multi-currency support (USD, EUR, GBP, JPY, CAD)
- 3D Secure authentication for international transactions
- RBI compliant export transaction handling
- Physical goods export with shipping address
- Services export with detailed descriptions

## 📁 Created Files

### Frontend
- `src/components/AuthPages/Check.tsx` - Main payment component with comprehensive form

### Backend API
- `api/stripe/customers.js` - Customer creation endpoint
- `api/stripe/payment-intents.js` - Payment processing endpoint  
- `server.js` - Express server with API routes

### Configuration
- `package.json` - Updated with Stripe dependency and scripts
- `env.example` - Environment variables template
- `README.md` - Comprehensive documentation

## ⚙️ Setup Instructions

### 1. Environment Configuration
Create a `.env` file in the root directory with your Stripe keys:

```env
# Frontend (Note the VITE_ prefix for Vite)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key

# Backend
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Server
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 2. Get Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Developers > API keys
3. Copy your Publishable key and Secret key
4. Replace the placeholder values in `.env`

### 3. Start the Application

```bash
# Terminal 1 - Start the React frontend
npm run dev

# Terminal 2 - Start the Express backend
npm run dev:server
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Payment Component**: Navigate to the Check component in your app

## 🧪 Testing the Payment System

### Test Cards (Stripe Test Mode)
```
Success: 4242424242424242
3D Secure: 4000000000003220
Declined: 4000000000000002
```

### Test Scenarios

#### 1. Local Payment (India)
- Select "Local Payment (India)"
- Use INR currency
- Fill customer details with Indian address
- Use test card: 4242424242424242

#### 2. International Service Payment
- Select "International Payment"
- Choose "Services Export"
- Select USD currency
- Fill customer details with foreign address
- Add service description (e.g., "Software development services")
- Use test card: 4242424242424242

#### 3. International Goods Payment
- Select "International Payment"
- Choose "Physical Goods Export"
- Select USD currency
- Fill customer details with foreign address
- Add product description (e.g., "Electronics components")
- Fill shipping address
- Use test card: 4000000000003220 (tests 3D Secure)

## 🌍 Compliance Features Implemented

### As per Stripe India Documentation

#### For Services Export:
✅ Buyer's name  
✅ Billing address  
✅ Service description

#### For Goods Export:
✅ Buyer's name  
✅ Billing address  
✅ Product description  
✅ Shipping address

#### Security Features:
✅ 3D Secure authentication for international payments  
✅ Enhanced fraud protection  
✅ Secure API endpoints

## 📋 API Endpoints Available

```
POST /api/stripe/customers
- Creates a new customer with address information

POST /api/stripe/payment-intents  
- Creates payment intent with export compliance fields

POST /api/stripe/payment-intents/:id/confirm
- Confirms a payment intent

GET /api/stripe/payment-intents/:id
- Retrieves payment intent details

GET /health
- API health check
```

## 🚨 Important Notes

### For Production Use:
1. **Stripe Account**: Request Stripe India invite
2. **Export Setup**: Enable export transactions in Stripe dashboard
3. **IEC Code**: Add your Importer Exporter Code for physical goods
4. **Live Keys**: Replace test keys with live keys
5. **HTTPS**: Ensure secure connections
6. **Webhooks**: Set up webhook endpoints for payment confirmations

### Security Considerations:
- Never expose secret keys in frontend code
- Validate all inputs on the server side
- Implement proper error handling and logging
- Use HTTPS in production
- Set up monitoring and alerts

## 🎉 What This Accomplishes

This implementation provides:
- **Full RBI Compliance** for Indian export transactions
- **Automated 3D Secure** for international payments
- **Comprehensive Form Validation** for all required fields
- **Multi-Currency Support** with proper currency presentation
- **Export Documentation** with all required metadata
- **Production-Ready API** with proper error handling

The system handles all the requirements mentioned in the Stripe India documentation you provided, including the mandatory fields for export transactions and proper currency handling for international payments. 