// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  validationErrors?: ValidationError[];
}

export interface ValidationError {
  PropertyName: string;
  ErrorMessage: string;
}

// User Master Types
export interface UserMasterData {
  userTypeNo: number;
  userProfileId: string;
  userName: string;
  emailId: string;
  contactNo: string;
  employeeId: string;
  designation: string;
  reportingManagerName: string;
  statusNo: number;
  statusRemarks?: string;
  userMasterBusinessUnitDetail?: BusinessUnitDetail[];
}

export interface BusinessUnitDetail {
  buId: number;
  statusNo: number;
  statusRemarks: string;
}

// Business Unit Types
export interface BusinessUnitData {
  code: string;
  name: string;
  gstIn?: string;
  parentBUQuery?: string;
  parentBUName?: string;
  address1: string;
  address2?: string;
  address3?: string;
  country: string;
  stateQuery: string;
  stateName: string;
  cityName: string;
  pin: string;
  status: string;
  statusRemarks?: string;
  userName?: string;
  contactNo?: string;
  industryType?: string;
  portalURL?: string;
}

// Test Data Types
export interface TestData<T> {
  save: T;
  update?: {
    save: T;
    update: T;
    searchQuery: Record<string, any>;
  };
  delete?: {
    save: T;
    searchQuery: Record<string, any>;
  };
  getById?: {
    save: T;
    searchQuery: Record<string, any>;
  };
  duplicateValidation?: T;
  get?: {
    save: T;
    getQuery: Record<string, any>;
  };
  search?: {
    save: T;
    searchQuery: Record<string, any>;
  };
  validationTestCases?: ValidationTestCase[];
}

export interface ValidationTestCase {
  id: number;
  description: string;
  input: Record<string, any>;
  expectedError: {
    PropertyName: string;
    ErrorMessage: string;
  };
}

// API Client Types
export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
}

export interface ApiRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
}
