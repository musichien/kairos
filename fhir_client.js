/**
 * FHIR Client for Healthcare Data Integration
 * Implements FHIR R4 standard for medical data exchange
 * 
 * Features:
 * - Complete FHIR R4 Resource Management
 * - RESTful API Operations
 * - Bundle Operations
 * - Search and Query Capabilities
 * - Terminology Services
 */

const axios = require('axios');
const crypto = require('crypto');

class FHIRClient {
  constructor(baseUrl = 'http://localhost:8080/fhir') {
    this.baseUrl = baseUrl;
    this.headers = {
      'Content-Type': 'application/fhir+json',
      'Accept': 'application/fhir+json',
      'User-Agent': 'Kairos-Medical-Client/1.0'
    };
    
    // FHIR R4 Resource Types
    this.resourceTypes = {
      // Clinical Resources
      Patient: 'Patient',
      Practitioner: 'Practitioner',
      PractitionerRole: 'PractitionerRole',
      Organization: 'Organization',
      Location: 'Location',
      
      // Clinical Resources
      Encounter: 'Encounter',
      EpisodeOfCare: 'EpisodeOfCare',
      Flag: 'Flag',
      List: 'List',
      AllergyIntolerance: 'AllergyIntolerance',
      AdverseEvent: 'AdverseEvent',
      Condition: 'Condition',
      Procedure: 'Procedure',
      FamilyMemberHistory: 'FamilyMemberHistory',
      ClinicalImpression: 'ClinicalImpression',
      DetectedIssue: 'DetectedIssue',
      Observation: 'Observation',
      Media: 'Media',
      DiagnosticReport: 'DiagnosticReport',
      Specimen: 'Specimen',
      BodyStructure: 'BodyStructure',
      ImagingStudy: 'ImagingStudy',
      Questionnaire: 'Questionnaire',
      QuestionnaireResponse: 'QuestionnaireResponse',
      MolecularSequence: 'MolecularSequence',
      
      // Medication Resources
      Medication: 'Medication',
      MedicationAdministration: 'MedicationAdministration',
      MedicationDispense: 'MedicationDispense',
      MedicationKnowledge: 'MedicationKnowledge',
      MedicationRequest: 'MedicationRequest',
      MedicationStatement: 'MedicationStatement',
      
      // Care Provision Resources
      CarePlan: 'CarePlan',
      CareTeam: 'CareTeam',
      Goal: 'Goal',
      ServiceRequest: 'ServiceRequest',
      NutritionOrder: 'NutritionOrder',
      VisionPrescription: 'VisionPrescription',
      RiskAssessment: 'RiskAssessment',
      RequestGroup: 'RequestGroup',
      
      // Diagnostic Resources
      Appointment: 'Appointment',
      AppointmentResponse: 'AppointmentResponse',
      Schedule: 'Schedule',
      Slot: 'Slot',
      VerificationResult: 'VerificationResult',
      
      // Financial Resources
      Account: 'Account',
      ChargeItem: 'ChargeItem',
      ChargeItemDefinition: 'ChargeItemDefinition',
      Contract: 'Contract',
      Coverage: 'Coverage',
      CoverageEligibilityRequest: 'CoverageEligibilityRequest',
      CoverageEligibilityResponse: 'CoverageEligibilityResponse',
      EnrollmentRequest: 'EnrollmentRequest',
      EnrollmentResponse: 'EnrollmentResponse',
      Invoice: 'Invoice',
      PaymentNotice: 'PaymentNotice',
      PaymentReconciliation: 'PaymentReconciliation',
      Claim: 'Claim',
      ClaimResponse: 'ClaimResponse',
      InsurancePlan: 'InsurancePlan'
    };

    console.log('🏥 FHIR Client initialized');
  }

  /**
   * Basic CRUD Operations
   */
  async create(resourceType, resource) {
    try {
      const url = `${this.baseUrl}/${resourceType}`;
      
      // Add metadata if not present
      if (!resource.meta) {
        resource.meta = {
          versionId: '1',
          lastUpdated: new Date().toISOString()
        };
      }

      const response = await axios.post(url, resource, { headers: this.headers });
      
      console.log(`🏥 FHIR ${resourceType} created: ${response.data.id}`);
      return {
        success: true,
        resource: response.data,
        location: response.headers.location
      };
    } catch (error) {
      console.error(`FHIR create error for ${resourceType}:`, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  async read(resourceType, id) {
    try {
      const url = `${this.baseUrl}/${resourceType}/${id}`;
      const response = await axios.get(url, { headers: this.headers });
      
      console.log(`🏥 FHIR ${resourceType} read: ${id}`);
      return {
        success: true,
        resource: response.data
      };
    } catch (error) {
      console.error(`FHIR read error for ${resourceType}/${id}:`, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  async update(resourceType, id, resource) {
    try {
      const url = `${this.baseUrl}/${resourceType}/${id}`;
      
      // Update metadata
      resource.meta = {
        ...resource.meta,
        versionId: (parseInt(resource.meta?.versionId || '0') + 1).toString(),
        lastUpdated: new Date().toISOString()
      };

      const response = await axios.put(url, resource, { headers: this.headers });
      
      console.log(`🏥 FHIR ${resourceType} updated: ${id}`);
      return {
        success: true,
        resource: response.data
      };
    } catch (error) {
      console.error(`FHIR update error for ${resourceType}/${id}:`, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  async delete(resourceType, id) {
    try {
      const url = `${this.baseUrl}/${resourceType}/${id}`;
      await axios.delete(url, { headers: this.headers });
      
      console.log(`🏥 FHIR ${resourceType} deleted: ${id}`);
      return { success: true };
    } catch (error) {
      console.error(`FHIR delete error for ${resourceType}/${id}:`, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Search Operations
   */
  async search(resourceType, searchParams = {}) {
    try {
      const queryString = Object.entries(searchParams)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
      
      const url = `${this.baseUrl}/${resourceType}?${queryString}`;
      const response = await axios.get(url, { headers: this.headers });
      
      console.log(`🏥 FHIR search: ${resourceType} with ${Object.keys(searchParams).length} parameters`);
      return {
        success: true,
        bundle: response.data,
        total: response.data.total || 0,
        entries: response.data.entry || []
      };
    } catch (error) {
      console.error(`FHIR search error for ${resourceType}:`, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Bundle Operations
   */
  async createBundle(entries, type = 'collection') {
    try {
      const bundle = {
        resourceType: 'Bundle',
        id: this.generateId(),
        type: type,
        timestamp: new Date().toISOString(),
        entry: entries.map(entry => ({
          resource: entry.resource,
          request: entry.request || {
            method: 'POST',
            url: entry.resource.resourceType
          }
        }))
      };

      const url = `${this.baseUrl}`;
      const response = await axios.post(url, bundle, { headers: this.headers });
      
      console.log(`🏥 FHIR Bundle created with ${entries.length} entries`);
      return {
        success: true,
        bundle: response.data
      };
    } catch (error) {
      console.error('FHIR Bundle creation error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  async processBundle(bundle) {
    try {
      const url = `${this.baseUrl}`;
      const response = await axios.post(url, bundle, { headers: this.headers });
      
      console.log(`🏥 FHIR Bundle processed with ${bundle.entry?.length || 0} entries`);
      return {
        success: true,
        bundle: response.data
      };
    } catch (error) {
      console.error('FHIR Bundle processing error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Patient Operations
   */
  async createPatient(patientData) {
    const patient = {
      resourceType: 'Patient',
      id: this.generateId(),
      identifier: patientData.identifier || [],
      active: patientData.active !== false,
      name: patientData.name || [],
      telecom: patientData.telecom || [],
      gender: patientData.gender,
      birthDate: patientData.birthDate,
      address: patientData.address || [],
      maritalStatus: patientData.maritalStatus,
      contact: patientData.contact || [],
      communication: patientData.communication || [],
      generalPractitioner: patientData.generalPractitioner || [],
      managingOrganization: patientData.managingOrganization
    };

    return await this.create('Patient', patient);
  }

  async searchPatient(searchParams) {
    return await this.search('Patient', searchParams);
  }

  async getPatientById(patientId) {
    return await this.read('Patient', patientId);
  }

  /**
   * Observation Operations
   */
  async createObservation(observationData) {
    const observation = {
      resourceType: 'Observation',
      id: this.generateId(),
      status: observationData.status || 'final',
      category: observationData.category || [],
      code: observationData.code,
      subject: observationData.subject,
      effectiveDateTime: observationData.effectiveDateTime || new Date().toISOString(),
      valueQuantity: observationData.valueQuantity,
      valueString: observationData.valueString,
      valueBoolean: observationData.valueBoolean,
      valueDateTime: observationData.valueDateTime,
      valueCodeableConcept: observationData.valueCodeableConcept,
      interpretation: observationData.interpretation || [],
      referenceRange: observationData.referenceRange || [],
      component: observationData.component || []
    };

    return await this.create('Observation', observation);
  }

  async searchObservations(searchParams) {
    return await this.search('Observation', searchParams);
  }

  /**
   * Condition Operations
   */
  async createCondition(conditionData) {
    const condition = {
      resourceType: 'Condition',
      id: this.generateId(),
      clinicalStatus: conditionData.clinicalStatus,
      verificationStatus: conditionData.verificationStatus,
      category: conditionData.category || [],
      severity: conditionData.severity,
      code: conditionData.code,
      bodySite: conditionData.bodySite || [],
      subject: conditionData.subject,
      onsetDateTime: conditionData.onsetDateTime,
      onsetAge: conditionData.onsetAge,
      onsetPeriod: conditionData.onsetPeriod,
      onsetRange: conditionData.onsetRange,
      onsetString: conditionData.onsetString,
      abatementDateTime: conditionData.abatementDateTime,
      abatementAge: conditionData.abatementAge,
      abatementPeriod: conditionData.abatementPeriod,
      abatementRange: conditionData.abatementRange,
      abatementString: conditionData.abatementString,
      recordedDate: conditionData.recordedDate || new Date().toISOString(),
      recorder: conditionData.recorder,
      asserter: conditionData.asserter,
      stage: conditionData.stage || [],
      evidence: conditionData.evidence || [],
      note: conditionData.note || []
    };

    return await this.create('Condition', condition);
  }

  /**
   * Medication Operations
   */
  async createMedication(medicationData) {
    const medication = {
      resourceType: 'Medication',
      id: this.generateId(),
      identifier: medicationData.identifier || [],
      code: medicationData.code,
      status: medicationData.status,
      manufacturer: medicationData.manufacturer,
      form: medicationData.form,
      amount: medicationData.amount,
      ingredient: medicationData.ingredient || [],
      batch: medicationData.batch
    };

    return await this.create('Medication', medication);
  }

  async createMedicationRequest(medicationRequestData) {
    const medicationRequest = {
      resourceType: 'MedicationRequest',
      id: this.generateId(),
      identifier: medicationRequestData.identifier || [],
      status: medicationRequestData.status,
      intent: medicationRequestData.intent,
      category: medicationRequestData.category || [],
      priority: medicationRequestData.priority,
      doNotPerform: medicationRequestData.doNotPerform || false,
      reportedBoolean: medicationRequestData.reportedBoolean,
      reportedReference: medicationRequestData.reportedReference,
      medicationCodeableConcept: medicationRequestData.medicationCodeableConcept,
      medicationReference: medicationRequestData.medicationReference,
      subject: medicationRequestData.subject,
      encounter: medicationRequestData.encounter,
      authoredOn: medicationRequestData.authoredOn || new Date().toISOString(),
      requester: medicationRequestData.requester,
      reasonCode: medicationRequestData.reasonCode || [],
      reasonReference: medicationRequestData.reasonReference || [],
      instantiatesCanonical: medicationRequestData.instantiatesCanonical || [],
      instantiatesUri: medicationRequestData.instantiatesUri || [],
      basedOn: medicationRequestData.basedOn || [],
      groupIdentifier: medicationRequestData.groupIdentifier,
      courseOfTherapyType: medicationRequestData.courseOfTherapyType,
      insurance: medicationRequestData.insurance || [],
      note: medicationRequestData.note || [],
      dosageInstruction: medicationRequestData.dosageInstruction || [],
      dispenseRequest: medicationRequestData.dispenseRequest,
      substitution: medicationRequestData.substitution,
      priorPrescription: medicationRequestData.priorPrescription,
      detectedIssue: medicationRequestData.detectedIssue || [],
      eventHistory: medicationRequestData.eventHistory || []
    };

    return await this.create('MedicationRequest', medicationRequest);
  }

  /**
   * Diagnostic Report Operations
   */
  async createDiagnosticReport(reportData) {
    const diagnosticReport = {
      resourceType: 'DiagnosticReport',
      id: this.generateId(),
      identifier: reportData.identifier || [],
      basedOn: reportData.basedOn || [],
      status: reportData.status,
      category: reportData.category || [],
      code: reportData.code,
      subject: reportData.subject,
      encounter: reportData.encounter,
      effectiveDateTime: reportData.effectiveDateTime,
      effectivePeriod: reportData.effectivePeriod,
      issued: reportData.issued || new Date().toISOString(),
      performer: reportData.performer || [],
      resultsInterpreter: reportData.resultsInterpreter || [],
      specimen: reportData.specimen || [],
      result: reportData.result || [],
      imagingStudy: reportData.imagingStudy || [],
      media: reportData.media || [],
      conclusion: reportData.conclusion,
      conclusionCode: reportData.conclusionCode || [],
      presentedForm: reportData.presentedForm || []
    };

    return await this.create('DiagnosticReport', diagnosticReport);
  }

  /**
   * Encounter Operations
   */
  async createEncounter(encounterData) {
    const encounter = {
      resourceType: 'Encounter',
      id: this.generateId(),
      identifier: encounterData.identifier || [],
      status: encounterData.status,
      statusHistory: encounterData.statusHistory || [],
      class: encounterData.class,
      classHistory: encounterData.classHistory || [],
      type: encounterData.type || [],
      serviceType: encounterData.serviceType,
      priority: encounterData.priority,
      subject: encounterData.subject,
      episodeOfCare: encounterData.episodeOfCare || [],
      basedOn: encounterData.basedOn || [],
      participant: encounterData.participant || [],
      appointment: encounterData.appointment || [],
      period: encounterData.period,
      length: encounterData.length,
      reasonCode: encounterData.reasonCode || [],
      reasonReference: encounterData.reasonReference || [],
      diagnosis: encounterData.diagnosis || [],
      account: encounterData.account || [],
      hospitalization: encounterData.hospitalization,
      location: encounterData.location || [],
      serviceProvider: encounterData.serviceProvider,
      partOf: encounterData.partOf
    };

    return await this.create('Encounter', encounter);
  }

  /**
   * Terminology Services
   */
  async expandValueSet(url, filter = '') {
    try {
      const queryString = filter ? `?filter=${encodeURIComponent(filter)}` : '';
      const expandUrl = `${this.baseUrl}/ValueSet/$expand?url=${encodeURIComponent(url)}${queryString}`;
      
      const response = await axios.get(expandUrl, { headers: this.headers });
      
      console.log(`🏥 FHIR ValueSet expanded: ${url}`);
      return {
        success: true,
        valueSet: response.data
      };
    } catch (error) {
      console.error('FHIR ValueSet expansion error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  async validateCode(system, code, display = '') {
    try {
      const url = `${this.baseUrl}/CodeSystem/$validate-code?system=${encodeURIComponent(system)}&code=${encodeURIComponent(code)}&display=${encodeURIComponent(display)}`;
      
      const response = await axios.get(url, { headers: this.headers });
      
      console.log(`🏥 FHIR Code validated: ${system}#${code}`);
      return {
        success: true,
        result: response.data
      };
    } catch (error) {
      console.error('FHIR Code validation error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Utility Methods
   */
  generateId() {
    return crypto.randomBytes(8).toString('hex');
  }

  /**
   * Get Capability Statement
   */
  async getCapabilityStatement() {
    try {
      const url = `${this.baseUrl}/metadata`;
      const response = await axios.get(url, { headers: this.headers });
      
      console.log('🏥 FHIR Capability Statement retrieved');
      return {
        success: true,
        capabilityStatement: response.data
      };
    } catch (error) {
      console.error('FHIR Capability Statement error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Get Statistics
   */
  getStats() {
    return {
      resourceTypes: Object.keys(this.resourceTypes).length,
      baseUrl: this.baseUrl,
      lastUpdated: new Date().toISOString()
    };
  }
}

module.exports = FHIRClient;
