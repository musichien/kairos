/**
 * HL7 Message Processor
 * Handles HL7 v2 and v3 message processing and transformation
 */

const crypto = require('crypto');

class HL7Processor {
  constructor() {
    this.messageTypes = {
      'ADT': 'Admit, Discharge, Transfer',
      'ORU': 'Observation Result',
      'ORM': 'Order Message',
      'MDM': 'Medical Document Management',
      'SIU': 'Scheduling Information',
      'DFT': 'Detail Financial Transaction'
    };
    
    console.log('🏥 HL7 Processor initialized');
  }

  parseMessage(message) {
    const lines = message.split('\n');
    const segments = {};
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.length > 3) {
        const segmentType = trimmedLine.substring(0, 3);
        const fields = trimmedLine.split('|');
        segments[segmentType] = fields;
      }
    });

    return segments;
  }

  processAdtMessage(parsedMessage) {
    const patientData = this.extractPatientData(parsedMessage);
    const encounterData = this.extractEncounterData(parsedMessage);
    
    return {
      type: 'ADT',
      patient: patientData,
      encounter: encounterData,
      timestamp: new Date().toISOString()
    };
  }

  extractPatientData(parsedMessage) {
    const pid = parsedMessage.PID;
    if (!pid) return null;

    return {
      patientId: pid[3]?.[0]?.[0],
      name: {
        family: pid[5]?.[0]?.[0],
        given: pid[5]?.[0]?.[1]
      },
      birthDate: pid[7]?.[0],
      gender: pid[8]?.[0]
    };
  }

  extractEncounterData(parsedMessage) {
    const evn = parsedMessage.EVN;
    const pv1 = parsedMessage.PV1;
    
    return {
      eventType: evn?.[1],
      eventDateTime: evn?.[2],
      admissionType: pv1?.[2],
      patientClass: pv1?.[2]
    };
  }

  validateMessage(parsedMessage, messageType) {
    const errors = [];
    
    if (!parsedMessage.MSH) {
      errors.push('Missing MSH segment');
    }
    
    if (messageType === 'ADT' && !parsedMessage.PID) {
      errors.push('ADT message missing PID segment');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

module.exports = HL7Processor;
