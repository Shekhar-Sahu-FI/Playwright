import { test, expect } from "@playwright/test";
import {
  saveMaster,
  getByIdAndValidate,
  duplicateCheck,
  saveAndUpdate,
  saveAndDelete,
  saveAndSearch,
  saveAndGet,
  deleteAll,
  checkValidation,
  save,
} from "../../../../utils/apiClients";
import { loadTestData } from "../../../../utils/data-provider";
import {
  blankMandatoryField,
  exceedCharacterLength,
  getAPIValidationMessage,
  saveWithInMaxLength,
} from "../../../../test-data/api/make-master/make-master";

const baseURL = "/Master/MakeMaster";

test.describe("Make Master API Testing @MakeMasterAPI", () => {
  const testData = loadTestData(
    "test-data/api/make-master/make-master-api-data.json"
  );

  checkValidation(getAPIValidationMessage, baseURL, "Get");

  //Validation for the more than max length
  checkValidation(exceedCharacterLength, baseURL, "Save");

  // //Validation for the blank non mandatory Field
  checkValidation(blankMandatoryField, baseURL, "Save");

  //save with in Max length
  save(saveWithInMaxLength, baseURL);

  test("🟢 Create Make 1 @saveMakeAPI", async () => {
    const response = await saveMaster(`${baseURL}/Save`, testData.save, true);
    expect(response.status(), "Status code should be 200").toBe(200);

    const body = await response.json();
    expect(body, "Save response should be truthy").toBeTruthy();
  });

  test("🟢 Create Make 2 @saveMakeAPI", async () => {
    const response = await saveMaster(`${baseURL}/Save`, testData.save2, true);
    expect(response.status(), "Status code should be 200").toBe(200);

    const body = await response.json();
    expect(body, "Save response should be truthy").toBeTruthy();
  });

  test("🔎 Get Make By ID and Validate @getById", async () => {
    await getByIdAndValidate(
      baseURL,
      validateResponseMatch,
      testData.getById.save,
      testData.getById.searchData
    );
  });

  test("🚫 Duplicate Make Validation @duplicateCheckMake", async () => {
    const expectedErrors = {
      MakeName: "Duplicate Make Name is not allowed.",
      Code: "Duplicate Code is not allowed.",
    };
    await duplicateCheck(baseURL, expectedErrors, testData.duplicateValidation);
  });

  test("✏️ Update Make @updateMake", async () => {
    await saveAndUpdate(
      testData.update.save,
      testData.update.update,
      baseURL,
      testData.update.searchData
    );
  });

  test("🗑️ Delete Make @deleteMake", async () => {
    await saveAndDelete(
      baseURL,
      testData.delete.save,
      testData.delete.searchData
    );
  });

  test("testing GET for Make Master", async () => {
    await saveAndGet(
      baseURL,
      testData.get.save,
      testData.get.getQuery,
      validateGetRes
    );
  });

  test("testing Search for Make Master", async () => {
    saveAndSearch(
      baseURL,
      testData.search.save,
      testData.search.searchQuery,
      validateSearchRes
    );
  });

  // test("Delete all Make in Make Master", async () => {
  //   await deleteAll(baseURL);
  // });
});

const validateGetRes = (formData, getRes) => {
  expect(getRes.code == formData.code).toBeTruthy();
  expect(getRes.makeName == formData.makeName).toBeTruthy();
};

const validateSearchRes = (formData, searchRes) => {
  console.log(formData, searchRes);
  expect(searchRes.code == formData.code).toBeTruthy();
  expect(searchRes.makeName == formData.makeName).toBeTruthy();
  expect(searchRes.statusNo == formData.statusNo).toBeTruthy();
};

function validateResponseMatch(formData: any, apiResponse: any) {
  expect(apiResponse.code == formData.code).toBeTruthy();
  expect(apiResponse.makeName == formData.makeName).toBeTruthy();
  expect(apiResponse.status?.statusNo == formData.statusNo).toBeTruthy();
  expect(apiResponse.statusRemarks == formData.statusRemarks).toBeTruthy();
}
