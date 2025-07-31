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

const baseURL = "/Master/DepartmentMaster";
const buURL = "/Admin/BusinessUnitMaster";

test.describe("Department Master API Testing", () => {
  const testData = loadTestData(
    "test-data/api/department-master-api-data.json"
  );

  test("🟢 Create Department 1 @saveDepartmentAPI", async () => {
    const buList = await getAll(`${buURL}/GetAll`);

    const saveData = {
      ...testData.save,
      departmentMasterBusinessUnitDetail: [
        {
          buId: buList[0].id,
        },
        {
          buId: buList[1].id,
        },
      ],
    };

    const response = await saveMaster(`${baseURL}/Save`, saveData, true);
    expect(response.status(), "Status code should be 200").toBe(200);

    const body = await response.json();
    expect(body, "Save response should be truthy").toBeTruthy();
    await deleteSavedData(testData.save, baseURL);
  });

  test("🟢 Create Department 2 @saveDepartmentAPI", async () => {
    const buList = await getAll(`${buURL}/GetAll`);
    const saveData = {
      ...testData.save2,
      departmentMasterBusinessUnitDetail: [
        {
          buId: buList[0].id,
        },
        {
          buId: buList[1].id,
        },
      ],
    };

    const response = await saveMaster(`${baseURL}/Save`, saveData, true);
    expect(response.status(), "Status code should be 200").toBe(200);

    const body = await response.json();
    expect(body, "Save response should be truthy").toBeTruthy();
    await deleteSavedData(testData.save2, baseURL);
  });

  test("🔎 Get Department By ID and Validate @getById", async () => {
    const buList = await getAll(`${buURL}/GetAll`);

     const saveData = {
      ...testData.getById.save,
      departmentMasterBusinessUnitDetail: [
        {
          buId: buList[0].id,
        },
        {
          buId: buList[1].id,
        },
      ],
    };
    await getByIdAndValidate(
      baseURL,
      validateResponseMatch,
      saveData,
      testData.getById.searchQuery
    );
    await deleteSavedData(saveData, baseURL);
  });

  //    test("🚫 Duplicate Department Validation @duplicateCheckDepartment", async () => {
  //      const expectedErrors = {
  //        DepartmentName: "Duplicate Department Name is not allowed.",
  //        Code: "Duplicate Code is not allowed.",
  //      };
  //      await duplicateCheck(baseURL, expectedErrors, testData.duplicateValidation);
  //    });

  test("✏️ Update Department @updateDepartment", async () => {
    const buList = await getAll(`${buURL}/GetAll`);

    const saveData = {
      ...testData.update.save,
      departmentMasterBusinessUnitDetail: [
        {
          buId: buList[0].id,
        },
        {
          buId: buList[1].id,
        },
      ],
    };

    await saveAndUpdate(
      saveData,
      testData.update.update,
      baseURL,
      testData.update.searchQuery
    );
    await deleteSavedData(testData.update.update, baseURL);
  });

  test("🗑️ Delete Department @deleteDepartment", async () => {
    const buList = await getAll(`${buURL}/GetAll`);

     const saveData = {
      ...testData.delete.save,
      departmentMasterBusinessUnitDetail: [
        {
          buId: buList[0].id,
        },
        {
          buId: buList[1].id,
        },
      ],
    };

    await saveAndDelete(baseURL,saveData, testData.delete.searchQuery);
  });

  test("testing GET for Department Master", async () => {
    const buList = await getAll(`${buURL}/GetAll`);

     const saveData = {
      ...testData.get.save,
      departmentMasterBusinessUnitDetail: [
        {
          buId: buList[0].id,
        },
        {
          buId: buList[1].id,
        },
      ],
    };

    await saveAndGet(baseURL, saveData, testData.get.getQuery, validateGetRes);
    await deleteSavedData(saveData, baseURL);
  });

  test("testing Search for Department Master", async () => {
    const buList = await getAll(`${buURL}/GetAll`);

     const saveData = {
      ...testData.search.save,
      departmentMasterBusinessUnitDetail: [
        {
          buId: buList[0].id,
        },
        {
          buId: buList[1].id,
        },
      ],
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
  expect(getRes.DepartmentName == formData.DepartmentName).toBeTruthy();
};

const validateSearchRes = (formData, searchRes) => {
  console.log(formData, searchRes);
  expect(searchRes.code == formData.code).toBeTruthy();
  expect(searchRes.DepartmentName == formData.DepartmentName).toBeTruthy();
  expect(searchRes.statusNo == formData.statusNo).toBeTruthy();
};

function validateResponseMatch(formData: any, apiResponse: any) {
  expect(apiResponse.code == formData.code).toBeTruthy();
  expect(apiResponse.DepartmentName == formData.DepartmentName).toBeTruthy();
  expect(apiResponse.status?.statusNo == formData.statusNo).toBeTruthy();
  expect(apiResponse.statusRemarks == formData.statusRemarks).toBeTruthy();
}
