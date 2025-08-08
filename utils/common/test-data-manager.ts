import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import { TestData } from '../../types/api-types';

export class TestDataManager {
  private ajv: Ajv;
  private schemas: Map<string, any> = new Map();

  constructor() {
    this.ajv = new Ajv({ allErrors: true });
    this.loadSchemas();
  }

  private loadSchemas(): void {
    const schemasDir = path.join(process.cwd(), 'test-data', 'schemas');
    if (fs.existsSync(schemasDir)) {
      const schemaFiles = fs.readdirSync(schemasDir).filter(file => file.endsWith('.json'));
      
      for (const file of schemaFiles) {
        const schemaPath = path.join(schemasDir, file);
        const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
        const schemaName = path.basename(file, '.json');
        this.schemas.set(schemaName, schema);
        this.ajv.addSchema(schema, schemaName);
      }
    }
  }

  loadTestData<T>(filePath: string, validateSchema?: string): TestData<T> {
    const fullPath = path.resolve(filePath);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Test data file not found: ${fullPath}`);
    }

    const rawData = fs.readFileSync(fullPath, 'utf-8');
    const data = JSON.parse(rawData);

    // Validate against schema if provided
    if (validateSchema && this.schemas.has(validateSchema)) {
      const valid = this.ajv.validate(validateSchema, data);
      if (!valid) {
        throw new Error(`Test data validation failed: ${this.ajv.errorsText()}`);
      }
    }

    return data;
  }

  generateTestData<T>(template: Partial<T>, overrides: Partial<T> = {}): T {
    return { ...template, ...overrides } as T;
  }

  async cleanupTestData(apiClient: any, endpoint: string, testData: any[]): Promise<void> {
    try {
      for (const data of testData) {
        if (data.code) {
          const searchResponse = await apiClient.search(endpoint, { code: data.code });
          if (searchResponse.data && searchResponse.data.length > 0) {
            await apiClient.deleteById(endpoint, searchResponse.data[0].id);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to cleanup test data:', error);
    }
  }

  createUniqueTestData<T>(baseData: T, uniqueField: keyof T): T {
    const timestamp = Date.now();
    const uniqueValue = `${baseData[uniqueField]}_${timestamp}`;
    return { ...baseData, [uniqueField]: uniqueValue };
  }

  validateTestDataStructure<T>(data: any, requiredFields: (keyof T)[]): void {
    const missingFields = requiredFields.filter(field => !(field in data));
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
  }

  // Data generators for common patterns
  generateEmail(prefix: string = 'test'): string {
    const timestamp = Date.now();
    return `${prefix}_${timestamp}@example.com`;
  }

  generateCode(prefix: string = 'TEST'): string {
    const timestamp = Date.now();
    return `${prefix}_${timestamp}`;
  }

  generatePhoneNumber(): string {
    return `98765${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
  }
}
