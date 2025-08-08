import { test, expect } from "@playwright/test";
import {
  saveMaster,
  getByIdAndValidate,
  duplicateCheck,
  saveAndUpdate,
  saveAndDelete,
  saveAndSearch,
  saveAndGet,
  checkValidation,
  save,
  deleteAll,
} from "../../../../utils/apiClients";
import { loadTestData } from "../../../../utils/data-provider";
import {
  blankMandatoryField,
  exceedCharacterLength,
  getAPIValidationMessage,
  saveWithInMaxLength,
  searchAPIValidationMessage,
} from "../../../../test-data/api/category-master/category-master";

const baseURL = "/Master/ItemCategoryMaster";

test.describe("Save Item Category within max length", () => {
  //save with in Max length
  save(saveWithInMaxLength, baseURL);
});

test.describe("Check Item Category Get Validation", () => {
  checkValidation(getAPIValidationMessage, baseURL, "Get");
});

test.describe("Check Item Category character length validation", () => {
  //Validation for the more than max length
  checkValidation(exceedCharacterLength, baseURL, "Save");
});

test.describe("Check Item Category mandatory validation", () => {
  // //Validation for the blank non mandatory Field
  checkValidation(blankMandatoryField, baseURL, "Save");
});

test.describe("Check Item Category Get Validation", () => {
  checkValidation(searchAPIValidationMessage, baseURL, "Search");
});

test.describe("Category Master API Testing", () => {
  const testData = loadTestData(
    "test-data/api/category-master/category-master-api-data.json"
  );

  test("🟢 Create Category 1 @saveCategoryAPI", async () => {
    const response = await saveMaster(`${baseURL}/Save`, testData.save, true);
    expect(response.status(), "Status code should be 200").toBe(200);

    const body = await response.json();
    expect(body, "Save response should be truthy").toBeTruthy();
  });

  test("🟢 Create Category 2 @saveCategoryAPI", async () => {
    const response = await saveMaster(`${baseURL}/Save`, testData.save2, true);
    expect(response.status(), "Status code should be 200").toBe(200);

    const body = await response.json();
    expect(body, "Save response should be truthy").toBeTruthy();
  });

  test("🔎 Get Category By ID and Validate @getById", async () => {
    await getByIdAndValidate(
      baseURL,
      validateResponseMatch,
      testData.getById.save,
      testData.getById.searchData
    );
  });

  test("🚫 Duplicate Category Validation @duplicateCheckCategory", async () => {
    const expectedErrors = {
      ItemCategoryName: "Duplicate Item Category Name is not allowed.",
      Code: "Duplicate Code is not allowed.",
    };
    await duplicateCheck(baseURL, expectedErrors, testData.duplicateValidation);
  });

  test("✏️ Update Category @updateCategory", async () => {
    await saveAndUpdate(
      testData.update.save,
      testData.update.update,
      baseURL,
      testData.update.searchData
    );
  });

  test("🗑️ Delete Category @deleteCategory", async () => {
    await saveAndDelete(
      baseURL,
      testData.delete.save,
      testData.delete.searchData
    );
  });

  test("testing GET for Category Master", async () => {
    await saveAndGet(
      baseURL,
      testData.get.save,
      testData.get.getQuery,
      validateGetRes
    );
  });

  test("testing Search for Category Master", async () => {
    saveAndSearch(
      baseURL,
      testData.search.save,
      testData.search.searchQuery,
      validateSearchRes
    );
  });

  // test("Delete all Category in Category Master", async () => {
  //   await deleteAll(baseURL);
  // });
});

const validateGetRes = (formData, getRes) => {
  return (
    getRes.code == formData.code &&
    getRes.itemCategoryName == formData.itemCategoryName
  );
};

const validateSearchRes = (formData, searchRes) => {
  console.log(formData, searchRes);
  expect(searchRes.code == formData.code).toBeTruthy();
  expect(searchRes.itemCategoryName == formData.itemCategoryName).toBeTruthy();
  expect(searchRes.statusNo == formData.statusNo).toBeTruthy();
};

function validateResponseMatch(formData: any, apiResponse: any) {
  expect(apiResponse.code == formData.code).toBeTruthy();
  expect(
    apiResponse.itemCategoryName == formData.itemCategoryName
  ).toBeTruthy();
  expect(apiResponse.status?.statusNo == formData.statusNo).toBeTruthy();
  expect(apiResponse.statusRemarks == formData.statusRemarks).toBeTruthy();
}
