/**
 * SMS Service Utility - Twilio Integration
 * 
 * This service uses Twilio to send real SMS messages.
 * 
 * Required environment variables:
 * - TWILIO_ACCOUNT_SID: Your Twilio Account SID
 * - TWILIO_AUTH_TOKEN: Your Twilio Auth Token
 * - TWILIO_PHONE_NUMBER: Your Twilio phone number (in E.164 format, e.g., +1234567890)
 * - SMS_ENABLED: Set to 'true' to enable real SMS sending (optional, defaults to false for safety)
 */

// Check if Twilio credentials are configured
const isTwilioConfigured = () => {
  const hasCredentials = !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN
  );
  const hasSender = !!(
    process.env.TWILIO_PHONE_NUMBER ||
    process.env.TWILIO_MESSAGING_SERVICE_SID
  );
  return hasCredentials && hasSender;
};

// Check if SMS is enabled
const isSmsEnabled = () => {
  return process.env.SMS_ENABLED === 'true';
};

// Initialize Twilio client only if configured
let twilioClient = null;
const getTwilioClient = () => {
  if (!twilioClient && isTwilioConfigured()) {
    const twilio = require('twilio');
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }
  return twilioClient;
};

/**
 * Format phone number to E.164 format for India (+91)
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} - Formatted phone number
 */
const formatPhoneNumber = (phoneNumber) => {
  // Remove any spaces, dashes, or parentheses
  let cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');

  // If number already starts with +, return as is
  if (cleaned.startsWith('+')) {
    return cleaned;
  }

  // If number starts with 91, add +
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`;
  }

  // If number is 10 digits, assume India and add +91
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }

  // Return with +91 prefix as default for India
  return `+91${cleaned}`;
};

/**
 * Send SMS to a single recipient
 * @param {string} phoneNumber - Recipient's phone number
 * @param {string} message - SMS content
 * @returns {Promise} - Promise resolving to SMS send status
 */
const sendSMS = async (phoneNumber, message) => {
  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);

    // If SMS is not enabled or Twilio not configured, simulate sending
    if (!isSmsEnabled() || !isTwilioConfigured()) {
      console.log(`[SMS SIMULATION] To: ${formattedNumber}`);
      console.log(`[SMS SIMULATION] Message: ${message}`);
      console.log('[SMS SIMULATION] Note: Set SMS_ENABLED=true and configure Twilio credentials to send real SMS');

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));

      return {
        success: true,
        simulated: true,
        to: formattedNumber,
        messageId: `sim_${Date.now()}`,
        timestamp: new Date().toISOString(),
        note: 'SMS not actually sent - simulation mode'
      };
    }

    // Send real SMS via Twilio
    const client = getTwilioClient();

    // Build message options - use messagingServiceSid if available, otherwise use phone number
    const messageOptions = {
      body: message,
      to: formattedNumber
    };

    if (process.env.TWILIO_MESSAGING_SERVICE_SID) {
      messageOptions.messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
    } else {
      messageOptions.from = process.env.TWILIO_PHONE_NUMBER;
    }

    console.log(`[SMS] Sending to: ${formattedNumber}`);
    console.log(`[SMS] Message options:`, JSON.stringify(messageOptions, null, 2));

    const result = await client.messages.create(messageOptions);

    // Log detailed status for debugging
    console.log(`[SMS SENT] ========================`);
    console.log(`[SMS SENT] To: ${formattedNumber}`);
    console.log(`[SMS SENT] SID: ${result.sid}`);
    console.log(`[SMS SENT] Status: ${result.status}`);
    console.log(`[SMS SENT] Error Code: ${result.errorCode || 'None'}`);
    console.log(`[SMS SENT] Error Message: ${result.errorMessage || 'None'}`);
    console.log(`[SMS SENT] ========================`);

    // Check for common issues
    if (result.status === 'undelivered' || result.status === 'failed') {
      console.error(`[SMS ERROR] Message failed to deliver!`);
      console.error(`[SMS ERROR] Error Code: ${result.errorCode}`);
      console.error(`[SMS ERROR] Error Message: ${result.errorMessage}`);
    }

    return {
      success: true,
      simulated: false,
      to: formattedNumber,
      messageId: result.sid,
      status: result.status,
      errorCode: result.errorCode,
      errorMessage: result.errorMessage,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[SMS ERROR] ========================');
    console.error('[SMS ERROR] Failed to send SMS:', error.message);
    console.error('[SMS ERROR] Full error:', error);
    console.error('[SMS ERROR] ========================');
    throw new Error(`Failed to send SMS to ${phoneNumber}: ${error.message}`);
  }
};

/**
 * Send bulk SMS to multiple recipients
 * @param {Array<string>} phoneNumbers - Array of recipient phone numbers
 * @param {string} message - SMS content
 * @returns {Promise} - Promise resolving to array of SMS send statuses
 */
const sendBulkSMS = async (phoneNumbers, message) => {
  try {
    const results = [];
    const errors = [];

    // Process each phone number
    for (const phoneNumber of phoneNumbers) {
      try {
        const result = await sendSMS(phoneNumber, message);
        results.push(result);
      } catch (error) {
        console.error(`Failed to send SMS to ${phoneNumber}:`, error.message);
        errors.push({
          phoneNumber,
          error: error.message
        });
      }

      // Small delay between messages to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const isSimulated = !isSmsEnabled() || !isTwilioConfigured();

    return {
      success: true,
      simulated: isSimulated,
      totalSent: results.length,
      totalFailed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined,
      note: isSimulated ? 'SMS messages were simulated. Set SMS_ENABLED=true and configure Twilio to send real SMS.' : undefined
    };
  } catch (error) {
    console.error('Bulk SMS sending error:', error);
    throw new Error(`Failed to send bulk SMS: ${error.message}`);
  }
};

/**
 * Check SMS service status
 * @returns {object} - Service status information
 */
const getServiceStatus = () => {
  return {
    twilioConfigured: isTwilioConfigured(),
    smsEnabled: isSmsEnabled(),
    provider: 'twilio',
    note: isSmsEnabled() && isTwilioConfigured()
      ? 'SMS service is active and will send real messages'
      : 'SMS service is in simulation mode'
  };
};

module.exports = {
  sendSMS,
  sendBulkSMS,
  getServiceStatus,
  formatPhoneNumber
};