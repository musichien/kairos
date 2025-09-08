const axios = require('axios');

const testHL7 = async () => {
  const hl7Message = `MSH|^~\\&|SENDING_APP|SENDING_FACILITY|RECEIVING_APP|RECEIVING_FACILITY|20250106120000||ADT^A01^ADT_A01|12345|P|2.5
EVN|A01|20250106120000
PID|1||123456789^^^MR^MGH||SMITH^JOHN^MICHAEL||19900515|M||C|123 MAIN ST^^NEW YORK^NY^10001||555-1234|||S||123456789
PV1|1|I|2000^2012^01||||004777^ATTEND^AARON^A|||SUR||||ADM|A0|`;

  try {
    const response = await axios.post(
      'http://localhost:3000/api/medical/hl7/process',
      {
        message: hl7Message,
        messageType: 'ADT'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer default-secret-key'
        }
      }
    );
    console.log('✅ HL7 processing successful:', response.data);
  } catch (error) {
    console.log('❌ HL7 processing failed:', error.response?.data || error.message);
  }
};

testHL7();


