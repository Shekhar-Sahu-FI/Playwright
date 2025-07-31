import { test, expect } from "@playwright/test";
import {
  saveMaster,
  getByIdAndValidate,
  duplicateCheck,
  saveAndUpdate,
  saveAndDelete,
  getAndSearch,
  saveAndSearch,
  saveAndGet,
} from "../../../../utils/apiClients";
import { loadTestData } from "../../../../utils/data-provider";

const categoryURL = "/Master/ItemCategoryMaster";
const baseURL = "/Master/ItemGroupMaster";

test.describe("ItemGroup Master API Testing", () => {
  const testData = loadTestData(
    "test-data/api/item-group-master-api-data.json"
  );

  test("🟢 Create ItemGroup 1 @saveItemGroupAPI", async () => {
    const categroryRes = await saveMaster(
      `${categoryURL}/Save`,
      testData.save.category,
      true
    );
    expect(categroryRes.status(), "Status code should be 200").toBe(200);

    const getRes = await getAndSearch(`${categoryURL}/Search`, {
      itemGroupName: testData.save.category.itemGroupName,
    });

    expect(getRes.length).toBeGreaterThan(0);

    const itemGroupData = {
      ...testData.save.itemGroup,
      code: `${getRes[0]?.code}${testData.save.itemGroup.itemGroupCode}`,
      itemCategoryId: getRes[0]?.id,
    };
    const response = await saveMaster(`${baseURL}/Save`, itemGroupData, true);
    expect(response.status(), "Status code should be 200").toBe(200);

    const body = await response.json();
    expect(body, "Save response should be truthy").toBeTruthy();
  });

  test("🟢 Create ItemGroup 2 @saveItemGroupAPI", async () => {
    const categroryRes = await saveMaster(
      `${categoryURL}/Save`,
      testData.save2.category,
      true
    );
    expect(categroryRes.status(), "Status code should be 200").toBe(200);

    const getRes = await getAndSearch(`${categoryURL}/Search`, {
      itemGroupName: testData.save2.category.itemGroupName,
    });

    expect(getRes.length).toBeGreaterThan(0);

    const itemGroupData = {
      ...testData.save2.itemGroup,
      code: `${getRes[0]?.code}${testData.save2.itemGroup.itemGroupCode}`,
      itemCategoryId: getRes[0]?.id,
    };

    const response = await saveMaster(`${baseURL}/Save`, itemGroupData, true);
    expect(response.status(), "Status code should be 200").toBe(200);

    const body = await response.json();
    expect(body, "Save response should be truthy").toBeTruthy();
  });

  test("🔎 Get ItemGroup By ID and Validate @getById", async () => {
    const searchData = await getAndSearch(`${categoryURL}/Search`, {});

    const itemGroupData = {
      ...testData.getById.itemGroup,
      code: `${searchData[0]?.code}${testData.getById.itemGroup.itemGroupCode}`,
      itemCategoryId: searchData[0]?.id,
    };

    await getByIdAndValidate(
      baseURL,
      validateResponseMatch,
      itemGroupData,
      testData.getById.searchQuery
    );
  });

  test("🚫 Duplicate ItemGroup Validation @duplicateCheckItemGroup", async () => {
    const expectedErrors = {
      ItemGroupName: "Duplicate ItemGroup Name is not allowed.",
      Code: "Duplicate Code is not allowed.",
    };
    await duplicateCheck(baseURL, expectedErrors, testData.duplicateValidation);
  });

  test("✏️ Update ItemGroup @updateItemGroup", async () => {
    const searchData = await getAndSearch(`${categoryURL}/Search`, {});

    const itemGroupData = {
      ...testData.update.save,
      code: `${searchData[0]?.code}${testData.update.save.itemGroupCode}`,
      itemCategoryId: searchData[0]?.id,
    };

    const updateItemGroupData = {
      ...testData.update.update,
      code: itemGroupData.code,
      itemCategoryId: itemGroupData.itemCategoryId,
    };

    await saveAndUpdate(
      itemGroupData,
      updateItemGroupData,
      baseURL,
      testData.update.searchQuery
    );
  });

  test("🗑️ Delete ItemGroup @deleteItemGroup", async () => {
    
    const searchData = await getAndSearch(`${categoryURL}/Search`, {});

    const itemGroupData = {
      ...testData.delete.save,
      code: `${searchData[0]?.code}${testData.delete.save.itemGroupCode}`,
      itemCategoryId: searchData[0]?.id,
    };
    await saveAndDelete(
      baseURL,
      itemGroupData,
      testData.delete.searchQuery
    );
  });

  test("testing GET for Group Master", async () => {
    const searchData = await getAndSearch(`${categoryURL}/Search`, {});

    const itemGroupData = {
      ...testData.get.itemGroup,
      code: `${searchData[0]?.code}${testData.get.itemGroup.itemGroupCode}`,
      itemCategoryId: searchData[0]?.id,
    };

    await saveAndGet(
      baseURL,
      itemGroupData,
      testData.get.getQuery,
      validateGetRes
    );
  });

  test("testing Search for Group Master", async () => {
    const searchData = await getAndSearch(`${categoryURL}/Search`, {});

    const itemGroupData = {
      ...testData.search.itemGroup,
      code: `${searchData[0]?.code}${testData.search.itemGroup.itemGroupCode}`,
      itemCategoryId: searchData[0]?.id,
    };
    saveAndSearch(
      baseURL,
      itemGroupData,
      testData.search.searchQuery,
      validateSearchRes
    );
  });

   for (const testCase of testData.validationTestCases) {
    test(`Validation: ${testCase.description}`, async () => {
      if (testCase.precondition) {
        await saveMaster(`${baseURL}/Save`, testCase.precondition, true);
      }

      const response = await saveMaster(`${baseURL}/Save`, testCase.input, true);
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

const validateGetRes = (formData, getRes) => {
  expect(getRes.code == formData.code).toBeTruthy();
  expect(getRes.itemGroupName == formData.itemGroupName).toBeTruthy();
  expect(getRes.itemCategoryId == formData.itemCategoryId).toBeTruthy();
  expect(getRes.itemCategoryCode == formData.code.slice(0, 2)).toBeTruthy();
};

const validateSearchRes = (formData, searchRes) => {
  expect(searchRes.code == formData.code).toBeTruthy();
  expect(searchRes.itemGroupName == formData.itemGroupName).toBeTruthy();
  expect(searchRes.itemCategoryId == formData.itemCategoryId).toBeTruthy();
  expect(searchRes.statusNo == formData.statusNo).toBeTruthy();
  expect(searchRes.itemCategoryCode == formData.code.slice(0, 2)).toBeTruthy();
};

function validateResponseMatch(formData: any, apiResponse: any) {
  expect(apiResponse.code == formData.code).toBeTruthy();
  expect(apiResponse.itemGroupName == formData.itemGroupName).toBeTruthy();
  expect(apiResponse.status?.statusNo == formData.statusNo).toBeTruthy();
  expect(apiResponse.itemCategory.id == formData.itemCategoryId).toBeTruthy();
  expect(
    apiResponse.itemCategory.code == formData.code.slice(0, 2)
  ).toBeTruthy();
  expect(apiResponse.statusRemarks == formData.statusRemarks).toBeTruthy();
}
