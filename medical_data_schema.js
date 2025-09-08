/**
 * Medical Data Schema and Validation
 * Defines schemas for medical data and validation rules
 */

class MedicalDataSchema {
  constructor() {
    this.schemas = {
      patient: this.getPatientSchema(),
      observation: this.getObservationSchema(),
      condition: this.getConditionSchema(),
      medication: this.getMedicationSchema(),
      encounter: this.getEncounterSchema()
    };
    
    console.log('🏥 Medical Data Schema initialized');
  }

  getPatientSchema() {
    return {
      type: 'object',
      required: ['id', 'name', 'gender', 'birthDate'],
      properties: {
        id: { type: 'string', minLength: 1 },
        name: {
          type: 'array',
          items: {
            type: 'object',
            required: ['family'],
            properties: {
              family: { type: 'string' },
              given: { type: 'array', items: { type: 'string' } }
            }
          }
        },
        gender: { type: 'string', enum: ['male', 'female', 'other', 'unknown'] },
        birthDate: { type: 'string', format: 'date' },
        address: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              line: { type: 'array', items: { type: 'string' } },
              city: { type: 'string' },
              state: { type: 'string' },
              postalCode: { type: 'string' }
            }
          }
        }
      }
    };
  }

  getObservationSchema() {
    return {
      type: 'object',
      required: ['id', 'status', 'code', 'subject'],
      properties: {
        id: { type: 'string' },
        status: { type: 'string', enum: ['registered', 'preliminary', 'final', 'amended', 'corrected', 'cancelled', 'entered-in-error', 'unknown'] },
        code: {
          type: 'object',
          required: ['coding'],
          properties: {
            coding: {
              type: 'array',
              items: {
                type: 'object',
                required: ['system', 'code'],
                properties: {
                  system: { type: 'string' },
                  code: { type: 'string' },
                  display: { type: 'string' }
                }
              }
            }
          }
        },
        subject: {
          type: 'object',
          required: ['reference'],
          properties: {
            reference: { type: 'string' }
          }
        },
        effectiveDateTime: { type: 'string', format: 'date-time' },
        valueQuantity: {
          type: 'object',
          properties: {
            value: { type: 'number' },
            unit: { type: 'string' },
            system: { type: 'string' },
            code: { type: 'string' }
          }
        }
      }
    };
  }

  getConditionSchema() {
    return {
      type: 'object',
      required: ['id', 'code', 'subject'],
      properties: {
        id: { type: 'string' },
        code: {
          type: 'object',
          required: ['coding'],
          properties: {
            coding: {
              type: 'array',
              items: {
                type: 'object',
                required: ['system', 'code'],
                properties: {
                  system: { type: 'string' },
                  code: { type: 'string' },
                  display: { type: 'string' }
                }
              }
            }
          }
        },
        subject: {
          type: 'object',
          required: ['reference'],
          properties: {
            reference: { type: 'string' }
          }
        },
        onsetDateTime: { type: 'string', format: 'date-time' },
        abatementDateTime: { type: 'string', format: 'date-time' },
        clinicalStatus: {
          type: 'object',
          properties: {
            coding: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  system: { type: 'string' },
                  code: { type: 'string' },
                  display: { type: 'string' }
                }
              }
            }
          }
        }
      }
    };
  }

  getMedicationSchema() {
    return {
      type: 'object',
      required: ['id', 'code'],
      properties: {
        id: { type: 'string' },
        code: {
          type: 'object',
          required: ['coding'],
          properties: {
            coding: {
              type: 'array',
              items: {
                type: 'object',
                required: ['system', 'code'],
                properties: {
                  system: { type: 'string' },
                  code: { type: 'string' },
                  display: { type: 'string' }
                }
              }
            }
          }
        },
        form: {
          type: 'object',
          properties: {
            coding: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  system: { type: 'string' },
                  code: { type: 'string' },
                  display: { type: 'string' }
                }
              }
            }
          }
        },
        ingredient: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              itemCodeableConcept: {
                type: 'object',
                properties: {
                  coding: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        system: { type: 'string' },
                        code: { type: 'string' },
                        display: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
  }

  getEncounterSchema() {
    return {
      type: 'object',
      required: ['id', 'status', 'class'],
      properties: {
        id: { type: 'string' },
        status: { type: 'string', enum: ['planned', 'arrived', 'triaged', 'in-progress', 'onleave', 'finished', 'cancelled', 'entered-in-error', 'unknown'] },
        class: {
          type: 'object',
          required: ['system', 'code'],
          properties: {
            system: { type: 'string' },
            code: { type: 'string' },
            display: { type: 'string' }
          }
        },
        subject: {
          type: 'object',
          properties: {
            reference: { type: 'string' }
          }
        },
        period: {
          type: 'object',
          properties: {
            start: { type: 'string', format: 'date-time' },
            end: { type: 'string', format: 'date-time' }
          }
        },
        location: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              location: {
                type: 'object',
                properties: {
                  reference: { type: 'string' }
                }
              }
            }
          }
        }
      }
    };
  }

  validate(data, schemaType) {
    const schema = this.schemas[schemaType];
    if (!schema) {
      return { valid: false, errors: [`Unknown schema type: ${schemaType}`] };
    }

    // Basic validation logic
    const errors = [];
    
    // Check required fields
    if (schema.required) {
      schema.required.forEach(field => {
        if (!data[field]) {
          errors.push(`Missing required field: ${field}`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

module.exports = MedicalDataSchema;
