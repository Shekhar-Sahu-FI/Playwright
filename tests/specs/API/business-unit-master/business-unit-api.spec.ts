import { test, expect } from "@playwright/test";
import {
  saveMaster,
  duplicateCheck,
  getAll,
  getByIdWithGetAll,
  deleteSavedData,
} from "../../../../utils/apiClients";
import { loadTestData } from "../../../../utils/data-provider";

const baseURL = "/Admin/BusinessUnitMaster";

test.describe("Business Unit Master API Testing", () => {
  const testData = loadTestData("test-data/api/business-unit-api-data.json");

  test("🟢 Create Business Unit 1 @saveBusiness UnitAPI", async () => {
    const response = await saveMaster(`${baseURL}/Save`, testData.save, true);
    expect(response.status(), "Status code should be 200").toBe(200);

    const body = await response.json();
    expect(body, "Save response should be truthy").toBeTruthy();

    await deleteSavedData(testData.save, baseURL);
  });

  test("🟢 Create Business Unit 2 @saveBusiness UnitAPI", async () => {
    const getAllRes = await getAll(`${baseURL}/GetAll`);
    console.log(getAllRes[0], "Search res");

    const updatedData = {
      ...testData.save2,
      parentBuId: getAllRes[0].id,
    };

    const response = await saveMaster(`${baseURL}/Save`, updatedData, true);
    expect(response.status(), "Status code should be 200").toBe(200);

    const body = await response.json();
    expect(body, "Save response should be truthy").toBeTruthy();

    await deleteSavedData(testData.save2, baseURL);
  });

  test("🔎 Get Business Unit By ID and Validate @getById", async () => {
    await getByIdWithGetAll(baseURL, testData.getById, validateResponse);

    await deleteSavedData(testData.getById, baseURL);
  });

  test("🚫 Duplicate Business Unit Validation @duplicateCheckBusiness Unit", async () => {
    const expectedErrors = {
      BuName: "Duplicate Business Unit Name is not allowed.",
      Code: "Duplicate Code is not allowed.",
    };
    await duplicateCheck(baseURL, expectedErrors, testData.duplicateValidation);
  });

  test("✏️ Update Business Unit @updateBusiness Unit", async () => {
    const saveRes = await saveMaster(
      `${baseURL}/Save`,
      testData.update.save,
      true
    );
    expect(saveRes.status(), "Status code should be 200").toBe(200);

    const getAllRes = await getAll(`${baseURL}/GetAll`);
    const savedData = getAllRes.find((ele) => {
      return (
        ele.businessUnitName == testData.update.save.businessUnitName &&
        ele.code == testData.update.save.code
      );
    });

    const updateData = {
      id: savedData.id,
      ...testData.update.update,
    };

    const updateRes = await saveMaster(`${baseURL}/Update`, updateData, false);
    expect(updateRes.status(), "Status code should be 200").toBe(200);

    const body = await updateRes.json();
    expect(body, "Response Body should be true").toBeTruthy();

    await deleteSavedData(updateData, baseURL);
  });

  test("🗑️ Delete Business Unit @deleteBusiness Unit", async () => {
    const response = await saveMaster(
      `${baseURL}/Save`,
      testData.delete.save,
      true
    );
    expect(response.status(), "Status code should be 200").toBe(200);
    await deleteSavedData(testData.delete.save, baseURL);
  });

    for (const testCase of testData.validationTestCases) {
      test(`Validation: ${testCase.description}`, async () => {
        if (testCase.precondition) {
          await saveMaster(`${baseURL}/Save`, testCase.precondition, true);
        }

        const response = await saveMaster(
          `${baseURL}/Save`,
          testCase.input,
          true
        );
        const body = await response.json();

        const match = body.validationErrors.find(
          (e) =>
            e.PropertyName === testCase.expectedError.PropertyName &&
            e.ErrorMessage === testCase.expectedError.ErrorMessage
        );

        expect(
          match,
          `Expected error not found: ${testCase.expectedError.PropertyName}`
        ).toBeTruthy();
      });
    }
});

function validateResponse(formData: any, apiResponse: any) {
  expect(apiResponse.code == formData.code).toBeTruthy();
  expect(apiResponse.address1 == formData.address1).toBeTruthy();
  expect(apiResponse.address2 == formData.address2).toBeTruthy();
  expect(apiResponse.address3 == formData.address3).toBeTruthy();
  expect(apiResponse.country.countryNo == formData.countryNo).toBeTruthy();
  expect(apiResponse.state.id == formData.stateId).toBeTruthy();
  expect(apiResponse.gstinNo == formData.gstinNo).toBeTruthy();
  expect(apiResponse.pincode == formData.pincode).toBeTruthy();
  expect(apiResponse.cityName == formData.cityName).toBeTruthy();
  expect(
    apiResponse.BusinessUnitName == formData.BusinessUnitName
  ).toBeTruthy();
  expect(apiResponse.status?.statusNo == formData.statusNo).toBeTruthy();
  expect(apiResponse.statusRemarks == formData.statusRemarks).toBeTruthy();
}

