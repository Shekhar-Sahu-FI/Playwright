import { test, expect } from "@playwright/test";
import {
  saveMaster,
  getAndSearch,
  getByIdAndValidate,
  duplicateCheck,
  saveAndUpdate,
  saveAndDelete,
  saveAndGet,
  saveAndSearch,
} from "../../../../utils/apiClients";
import { loadTestData } from "../../../../utils/data-provider";

const baseURL = "/Master/UnitMaster";  


function expectValidationError(body, property, message) {
  const error = body.validationErrors.find(
    (e) => e.PropertyName === property && e.ErrorMessage === message
  );
  expect(error, `Expected ${property} error: "${message}"`).toBeTruthy();
}

const validateGetRes = (formData, apiRes) => {
  expect(apiRes.code).toBe(formData.code);
  expect(apiRes.unitName).toBe(formData.unitName);
};

const validateSearchRes = (formData, apiRes) => {
  expect(apiRes.code).toBe(formData.code);
  expect(apiRes.unitName).toBe(formData.unitName);
  expect(apiRes.statusNo).toBe(formData.statusNo);
};

const validateResponseMatch = (formData, apiRes) => {
  expect(apiRes.code).toBe(formData.code);
  expect(apiRes.unitName).toBe(formData.unitName);
  expect(apiRes.status?.statusNo).toBe(formData.statusNo);
  expect(apiRes.statusRemarks).toBe(formData.statusRemarks);
};

test.describe("Unit Master API Tests @UnitMasterAPI", () => {
  const testData = loadTestData("test-data/api/unit-master/unit-master-api-data.json");
  
  
  test("✏️ Update Unit", async () => {
    await saveAndUpdate(
      testData.updateCases.initial,
      testData.updateCases.updated,
      baseURL,
      testData.updateCases.searchData
    );
  });


  test("🗑️ Delete Unit @UnitAPIDelete", async () => {
    await saveAndDelete(
      baseURL,
      testData.deleteCases.record,
      testData.deleteCases.searchData
    );
  });


  test("🔍 Get Unit By ID", async () => {
    await getByIdAndValidate(
      baseURL,
      validateResponseMatch,
      testData.getBiIdCases.record,
      testData.getBiIdCases.query
    );
  });

  test("testing GET for Unit Master", async () => {
    await saveAndGet(
      baseURL,
      testData.getCases.record,
      testData.getCases.query,
      validateGetRes
    );
  });


  test("🔎 Search Unit", async () => {
    await saveAndSearch(
      baseURL,
      testData.searchCases.record,
      testData.searchCases.query,
      validateSearchRes
    );
  });


  test("🚫 Duplicate Unit Validation", async () => {
    await duplicateCheck(
      baseURL,
      testData.duplicateCases.expectedErrors,
      testData.duplicateCases.record
    );
  });

});
