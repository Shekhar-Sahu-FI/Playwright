import { test, expect } from "@playwright/test";
import {
  saveMaster,
  getByIdAndValidate,
  duplicateCheck,
  saveAndUpdate,
  saveAndDelete,
  saveAndSearch,
  saveAndGet,
  deleteSavedData,
  getAll,
} from "../../../../utils/apiClients";
import { loadTestData } from "../../../../utils/data-provider";

const baseURL = "/Master/CostCenterMaster";
const buURL = "/Admin/BusinessUnitMaster";

test.describe("CostCenter Master API Testing", () => {
  const testData = loadTestData(
    "test-data/api/cost-center-master-api-data.json"
  );

  test("🟢 Create CostCenter 1 @saveCostCenterAPI", async () => {
    const buList = await getAll(`${buURL}/GetAll`);

    const saveData = {
      ...testData.save,
      buId: buList[0].id,
    };

    const response = await saveMaster(`${baseURL}/Save`, saveData, true);
    expect(response.status(), "Status code should be 200").toBe(200);

    const body = await response.json();
    expect(body, "Save response should be truthy").toBeTruthy();
    await deleteSavedData(testData.save, baseURL);
  });

  test("🟢 Create CostCenter 2 @saveCostCenterAPI", async () => {
    const buList = await getAll(`${buURL}/GetAll`);
    const costCenterList = await getAll(`${baseURL}/GetAll`);
    const saveData = {
      ...testData.save2,
      buId: buList[0].id,
      parentCostCenterId: costCenterList[0].id,
    };

    const response = await saveMaster(`${baseURL}/Save`, saveData, true);
    expect(response.status(), "Status code should be 200").toBe(200);

    const body = await response.json();
    expect(body, "Save response should be truthy").toBeTruthy();
    await deleteSavedData(testData.save2, baseURL);
  });

  test("🔎 Get CostCenter By ID and Validate @getById", async () => {
    const buList = await getAll(`${buURL}/GetAll`);

    const saveData = {
      ...testData.getById.save,
      buId: buList[0].id,
    };
    await getByIdAndValidate(
      baseURL,
      validateResponseMatch,
      saveData,
      testData.getById.searchQuery
    );
    await deleteSavedData(saveData, baseURL);
  });

  //    test("🚫 Duplicate CostCenter Validation @duplicateCheckCostCenter", async () => {
  //      const expectedErrors = {
  //        CostCenterName: "Duplicate CostCenter Name is not allowed.",
  //        Code: "Duplicate Code is not allowed.",
  //      };
  //      await duplicateCheck(baseURL, expectedErrors, testData.duplicateValidation);
  //    });

  test("✏️ Update CostCenter @updateCostCenter", async () => {
    const buList = await getAll(`${buURL}/GetAll`);

    const saveData = {
      ...testData.getById.save,
      buId: buList[0].id,
    };
    await saveAndUpdate(
      saveData,
      testData.update.update,
      baseURL,
      testData.update.searchQuery
    );
    await deleteSavedData(testData.update.update, baseURL);
  });

  test("🗑️ Delete CostCenter @deleteCostCenter", async () => {
    const buList = await getAll(`${buURL}/GetAll`);

    const saveData = {
      ...testData.delete.save,
      buId: buList[0].id,
    };

    await saveAndDelete(baseURL, saveData, testData.delete.searchQuery);
  });

  test("testing GET for CostCenter Master", async () => {
    const buList = await getAll(`${buURL}/GetAll`);

    const saveData = {
      ...testData.get.save,
      buId: buList[0].id,
    };

    await saveAndGet(baseURL, saveData, testData.get.getQuery, validateGetRes);
    await deleteSavedData(saveData, baseURL);
  });

  test("testing Search for CostCenter Master", async () => {
    const buList = await getAll(`${buURL}/GetAll`);

    const saveData = {
      ...testData.search.save,
      buId: buList[0].id,
    };
    saveAndSearch(
      baseURL,
      saveData,
      testData.search.searchQuery,
      validateSearchRes
    );
    await deleteSavedData(saveData, baseURL);
  });

  //   for (const testCase of testData.validationTestCases) {
  //     test(`Validation: ${testCase.description}`, async () => {
  //       if (testCase.precondition) {
  //         await saveMaster(`${baseURL}/Save`, testCase.precondition, true);
  //       }

  //       const response = await saveMaster(
  //         `${baseURL}/Save`,
  //         testCase.input,
  //         true
  //       );
  //       const body = await response.json();

  //       const match = body.validationErrors.find(
  //         (e) =>
  //           e.PropertyName === testCase.expectedError.PropertyName &&
  //           e.ErrorMessage === testCase.expectedError.ErrorMessage
  //       );

  //       expect(
  //         match,
  //         `Expected error not found: ${testCase.expectedError.PropertyName}`
  //       ).toBeTruthy();
  //     });
  //   }
});

const validateGetRes = (formData, getRes) => {
  expect(getRes.code == formData.code).toBeTruthy();
  expect(getRes.costCenterName == formData.CostCenterName).toBeTruthy();
  expect(getRes.description == formData.CostCenterName).toBeTruthy();
  expect(getRes.parentCostCenterId == formData.CostCenterName).toBeTruthy();
};

const validateSearchRes = (formData, searchRes) => {
  console.log(formData, searchRes);
  expect(searchRes.code == formData.code).toBeTruthy();
  expect(searchRes.costCenterName == formData.costCenterName).toBeTruthy();
  expect(searchRes.statusNo == formData.statusNo).toBeTruthy();
};

function validateResponseMatch(formData: any, apiResponse: any) {
  expect(apiResponse.code == formData.code).toBeTruthy();
  expect(apiResponse.costCenterName == formData.costCenterName).toBeTruthy();
  expect(apiResponse.description == formData.description).toBeTruthy();
  expect(apiResponse.status?.statusNo == formData.statusNo).toBeTruthy();
  expect(apiResponse.statusRemarks == formData.statusRemarks).toBeTruthy();
}
