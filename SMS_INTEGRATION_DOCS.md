# SMS Integration Documentation

This document explains how to use the SMS integration feature in the Lunch Bowl application.

## Overview

The SMS integration uses the smsintegra.com API to send various types of SMS notifications to customers. The system supports 6 different message templates as required by DLT (Distributed Ledger Technology) compliance.

## Configuration

### Backend Configuration (.env)

Add the following environment variables to your backend `.env` file:

```env
# SMS Integration Configuration
SMS_API_URL=http://www.smsintegra.com/api/smsapi.aspx
SMS_UID=lunchbowl
SMS_PWD=7650
SMS_SID=LNCHBO
SMS_ENTITY_ID=1601507175049953547
```

### Frontend Configuration (.env)

Add to your frontend `.env` file:

```env
# SMS Configuration (for display purposes only - actual SMS sending is handled by backend)
NEXT_PUBLIC_SMS_ENABLED=true
```

## SMS Templates

The system supports the following SMS templates:

1. **OTP** - One-time password for verification
2. **SIGNUP_CONFIRMATION** - Welcome message after successful registration
3. **PAYMENT_CONFIRMATION** - Payment received confirmation
4. **SUBSCRIPTION_RENEWAL** - Subscription renewal reminder
5. **TRIAL_FOOD_CONFIRMATION** - Trial meal booking confirmation
6. **TRIAL_FOOD_SMS** - Feedback request after trial meal

## API Endpoints

### Backend Endpoints

All SMS endpoints are available under `/api/sms/`:

#### Send OTP SMS
```
POST /api/sms/send-otp
Body: {
  "mobile": "9123456789",
  "otp": "1234",
  "customerId": "optional"
}
```

#### Send Signup Confirmation SMS
```
POST /api/sms/send-signup-confirmation
Body: {
  "mobile": "9123456789",
  "customerName": "John Doe",
  "customerId": "optional"
}
```

#### Send Payment Confirmation SMS
```
POST /api/sms/send-payment-confirmation
Body: {
  "mobile": "9123456789",
  "amount": "500",
  "customerId": "optional",
  "orderId": "optional"
}
```

#### Send Trial Food Confirmation SMS
```
POST /api/sms/send-trial-food-confirmation
Body: {
  "mobile": "9123456789",
  "childName": "Little John",
  "date": "2024-01-15",
  "location": "ABC School",
  "customerId": "optional"
}
```

#### Send Trial Food Feedback SMS
```
POST /api/sms/send-trial-food-feedback
Body: {
  "mobile": "9123456789",
  "parentName": "John Doe",
  "childName": "Little John",
  "feedbackLink": "https://lunchbowl.co.in/feedback",
  "customerId": "optional"
}
```

#### Get SMS Logs
```
GET /api/sms/logs?customerId=123&page=1&limit=10
Headers: Authorization: Bearer <token>
```

### Admin Endpoints

#### Send Trial Feedback SMS (Admin)
```
POST /api/admin/send-trial-feedback-sms
Body: {
  "customerId": "123",
  "mobile": "9123456789",
  "parentName": "John Doe",
  "childName": "Little John",
  "feedbackLink": "https://lunchbowl.co.in/feedback"
}
```

#### Get Trial Customers
```
GET /api/admin/trial-customers
```

## Frontend Usage

### Using the SMS Hook

```javascript
import useSMS from '@/hooks/useSMS';

const MyComponent = () => {
  const { sendOTPSMS, sendSignupConfirmationSMS, isSending } = useSMS();

  const handleSendOTP = async () => {
    try {
      await sendOTPSMS('9123456789', '1234', 'customerId');
      // Success toast will be shown automatically
    } catch (error) {
      // Error toast will be shown automatically
      console.error(error);
    }
  };

  return (
    <button onClick={handleSendOTP} disabled={isSending}>
      {isSending ? 'Sending...' : 'Send OTP'}
    </button>
  );
};
```

### Using the SMS Service Directly

```javascript
import SmsServices from '@/services/SmsServices';

// Send OTP
const result = await SmsServices.sendOTP('9123456789', '1234', 'customerId');

// Send signup confirmation
const result = await SmsServices.sendSignupConfirmation('9123456789', 'John Doe', 'customerId');
```

## Automatic SMS Triggers

The following SMS messages are sent automatically:

### 1. OTP SMS
- **Trigger**: When user requests OTP during signup
- **Location**: `SignUpPopup.js` and `customerController.js`

### 2. Signup Confirmation SMS
- **Trigger**: After successful user registration
- **Location**: `SignUpPopup.js` and `customerController.js`

### 3. Payment Confirmation SMS
- **Trigger**: After successful payment processing
- **Location**: `Payment.js` controller

### 4. Subscription Renewal SMS
- **Trigger**: Automated cron job (runs hourly)
- **Location**: `renewalReminder.js` job

### 5. Trial Food Confirmation SMS
- **Trigger**: When free trial request is submitted
- **Location**: `adminController.js`

## SMS Logging

All SMS messages are logged in the `smslogs` collection with the following information:

- Mobile number
- Message type
- Message content
- Template ID
- Message ID (from SMS provider)
- Status (sent/failed/pending)
- Error details (if any)
- Customer ID (if available)
- Order ID (if applicable)
- Variables used in template
- Timestamp

## Error Handling

The SMS service includes comprehensive error handling:

1. **Network failures**: If the SMS API is unreachable, the error is logged but doesn't break the user flow
2. **Invalid mobile numbers**: Validation is performed before sending
3. **Template errors**: Missing templates are caught and logged
4. **Rate limiting**: Can be implemented at the route level
5. **Graceful degradation**: If SMS fails, the main application flow continues

## Mobile Number Format

The system automatically formats mobile numbers:
- Accepts 10-digit Indian mobile numbers (starting with 6-9)
- Automatically adds country code (91) if not present
- Validates format before sending

## Testing

To test the SMS integration:

1. Ensure SMS configuration is set in `.env` files
2. Start the backend server
3. Use the API endpoints with Postman or frontend
4. Check SMS logs in the database
5. Monitor console logs for debugging

## Security Considerations

1. SMS credentials are stored in environment variables
2. SMS endpoints can be protected with authentication
3. Rate limiting should be implemented in production
4. Mobile numbers are validated before processing
5. Sensitive information is not logged in plain text

## Production Deployment

Before deploying to production:

1. Update SMS credentials with production values
2. Implement rate limiting on SMS endpoints
3. Monitor SMS usage and costs
4. Set up alerting for SMS failures
5. Regularly clean up old SMS logs
6. Test all SMS templates with actual mobile numbers

## Troubleshooting

### Common Issues

1. **SMS not sent**: Check SMS API credentials and network connectivity
2. **Invalid template ID**: Verify template IDs match DLT registration
3. **Mobile number validation fails**: Ensure number format is correct
4. **Database errors**: Check MongoDB connection and SmsLog model

### Debug Steps

1. Check backend console logs for SMS sending attempts
2. Verify SMS logs in database
3. Test SMS API directly with curl/Postman
4. Check network connectivity to SMS provider
5. Validate environment variables are loaded correctly