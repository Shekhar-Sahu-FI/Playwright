import { test, expect } from "@playwright/test";
import {
  saveMaster,
  getByIdAndValidate,
  duplicateCheck,
  saveAndUpdate,
  saveAndDelete,
  saveAndSearch,
  saveAndGet,
} from "../../../../utils/apiClients";
import { loadTestData } from "../../../../utils/data-provider";

const baseURL = "/Master/ItemCategoryMaster";

test.describe("Category Master API Testing", () => {
  const testData = loadTestData("test-data/api/category-master-api-data.json");

  // test("🟢 Create Category 1 @saveCategoryAPI", async () => {
  //   const response = await saveMaster(`${baseURL}/Save`, testData.save, true);
  //   expect(response.status(), "Status code should be 200").toBe(200);

  //   const body = await response.json();
  //   expect(body, "Save response should be truthy").toBeTruthy();
  // });

  // test("🟢 Create Category 2 @saveCategoryAPI", async () => {
  //   const response = await saveMaster(`${baseURL}/Save`, testData.save2, true);
  //   expect(response.status(), "Status code should be 200").toBe(200);

  //   const body = await response.json();
  //   expect(body, "Save response should be truthy").toBeTruthy();
  // });

  // test("🔎 Get Category By ID and Validate @getById", async () => {
  //   await getByIdAndValidate(
  //     baseURL,
  //     validateResponseMatch,
  //     testData.getById.save,
  //     testData.getById.searchData
  //   );
  // });

  // test("🚫 Duplicate Category Validation @duplicateCheckCategory", async () => {
  //   const expectedErrors = {
  //     ItemCategoryName: "Duplicate Item Category Name is not allowed.",
  //     Code: "Duplicate Code is not allowed.",
  //   };
  //   await duplicateCheck(baseURL, expectedErrors, testData.duplicateValidation);
  // });

  // test("✏️ Update Category @updateCategory", async () => {
  //   await saveAndUpdate(
  //     testData.update.save,
  //     testData.update.update,
  //     baseURL,
  //     testData.update.searchData
  //   );
  // });

  // test("🗑️ Delete Category @deleteCategory", async () => {
  //   await saveAndDelete(
    //     baseURL,
  //     testData.delete.save,
  //     testData.delete.searchData
  //   );
  // });

  // test("testing GET for Category Master", async () => {
  //   await saveAndGet(
  //     baseURL,
  //     testData.get.save,
  //     testData.get.getQuery,
  //     validateGetRes
  //   );
  // });

  // test("testing Search for Category Master", async () => {
  //   saveAndSearch(
  //     baseURL,
  //     testData.search.save,
  //     testData.search.searchQuery,
  //     validateSearchRes
  //   );
  // });

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

const validateGetRes = (formData, getRes) => {
  return getRes.code == formData.code && getRes.itemCategoryName == formData.itemCategoryName;
};

const validateSearchRes = (formData, searchRes) => {
  console.log(formData, searchRes);
  expect(searchRes.code == formData.code).toBeTruthy();
  expect(searchRes.itemCategoryName == formData.itemCategoryName).toBeTruthy();
  expect(searchRes.statusNo == formData.statusNo).toBeTruthy();
};

function validateResponseMatch(formData: any, apiResponse: any) {
  expect(apiResponse.code == formData.code).toBeTruthy();
  expect(apiResponse.itemCategoryName == formData.itemCategoryName).toBeTruthy();
  expect(apiResponse.status?.statusNo == formData.statusNo).toBeTruthy();
  expect(apiResponse.statusRemarks == formData.statusRemarks).toBeTruthy();
}



// import { test, expect } from "@playwright/test";
// import {
//   saveMaster,
//   getAndSearch,
//   getByIdAndValidate,
//   duplicateCheck,
//   saveAndUpdate,
//   saveAndDelete,
//   saveAndGet,
//   saveAndSearch,
// } from "../../../utils/apiClients";
// import { loadTestData } from "../../../utils/data-provider";

// const baseURL = "/Master/ItemCategory"; // ✅ Changed to ItemCategory
// const testData = loadTestData("test-data/api/item-category-api-data.json");

// // 🔹 Generic Helper for Validation Errors
// function expectValidationError(body, property, message) {
//   const error = body.validationErrors.find(
//     (e) => e.PropertyName === property && e.ErrorMessage === message
//   );
//   expect(
//     error,
//     `Expected error ${property} with message "${message}"`
//   ).toBeTruthy();
// }

// // 🔹 Response Match Validators
// const validateGetRes = (formData, apiRes) => {
//   expect(apiRes.code).toBe(formData.code);
//   expect(apiRes.itemCategoryName).toBe(formData.itemCategoryName);
// };

// const validateSearchRes = (formData, apiRes) => {
//   expect(apiRes.code).toBe(formData.code);
//   expect(apiRes.itemCategoryName).toBe(formData.itemCategoryName);
//   expect(apiRes.statusNo).toBe(formData.statusNo);
// };

// const validateResponseMatch = (formData, apiRes) => {
//   expect(apiRes.code).toBe(formData.code);
//   expect(apiRes.itemCategoryName).toBe(formData.itemCategoryName);
//   expect(apiRes.status?.statusNo).toBe(formData.statusNo);
//   expect(apiRes.statusRemarks).toBe(formData.statusRemarks);
// };

// // ✅ TEST SUITE
// test.describe("🔁 Item Category Master API Tests", () => {
//   // 🟢 CREATE TESTS (Data-driven)
//   for (const [key, data] of Object.entries(testData.positiveCases)) {
//     test(`🟢 Create Item Category - ${key}`, async () => {
//       const res = await saveMaster(`${baseURL}/Save`, data, true);
//       expect(res.status()).toBe(200);
//       expect(await res.json()).toBeTruthy();
//     });
//   }

//   // ✏️ UPDATE TEST
//   test("✏️ Update Item Category", async () => {
//     await saveAndUpdate(
//       testData.updateCases.initial,
//       testData.updateCases.updated,
//       baseURL,
//       testData.updateCases.searchData
//     );
//   });

//   // 🗑️ DELETE TEST
//   test("🗑️ Delete Item Category", async () => {
//     await saveAndDelete(
  //       baseURL,
//       testData.deleteCases.record,
//       testData.deleteCases.searchData
//     );
//   });

//   // 🔍 GET BY ID TEST
//   test("🔍 Get Item Category By ID", async () => {
//     await getByIdAndValidate(
//       baseURL,
//       validateResponseMatch,
//       testData.getCases.record,
//       testData.getCases.query
//     );
//   });

//   // 🔎 SEARCH TEST
//   test("🔎 Search Item Category", async () => {
//     await saveAndSearch(
//       baseURL,
//       testData.searchCases.record,
//       testData.searchCases.query,
//       validateSearchRes
//     );
//   });

//   test("testing GET for Make Master", async () => {
//     await saveAndGet(
//       baseURL,
//       testData.get.save,
//       testData.get.getQuery,
//       validateGetRes
//     );
//   });

//   // 🚫 DUPLICATE VALIDATION TEST
//   test("🚫 Duplicate Item Category Validation", async () => {
//     await duplicateCheck(
//       baseURL,
//       testData.duplicateCases.expectedErrors,
//       testData.duplicateCases.record
//     );
//   });

//   // ❌ VALIDATION ERROR TESTS (Data-driven)
//   for (const tc of testData.validationCases) {
//     test(`Validation: ${tc.description}`, async () => {
//       if (tc.precondition) {
//         await saveMaster(`${baseURL}/Save`, tc.precondition, true);
//       }
//       const res = await saveMaster(`${baseURL}/Save`, tc.input, true);
//       const body = await res.json();
//       expectValidationError(
//         body,
//         tc.expectedError.PropertyName,
//         tc.expectedError.ErrorMessage
//       );
//     });
//   }
// });