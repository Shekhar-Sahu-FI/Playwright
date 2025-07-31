// import { test, expect } from "@playwright/test";
// import {
//   saveMaster,
//   getByIdAndValidate,
//   duplicateCheck,
//   saveAndUpdate,
//   saveAndDelete,
//   getAndSearch,
//   saveAndSearch,
//   saveAndGet,
// } from "../../../../utils/apiClients";
// import { loadTestData } from "../../../../utils/data-provider";
// import { createUnit } from "../../../../utils/saveMasterData";

// const categoryURL = "/Master/ItemGroupMaster";
// const baseURL = "/Master/ItemSubgroupMaster";

// test.describe("ItemSubgroup Master API Testing", () => {
// //   const testData = loadTestData(
// //     "test-data/api/item-subgroup-master-api-data.json"
// //   );

//   test("🟢 Create ItemSubgroup 1 @saveItemSubgroupAPI", async () => {

//     await createUnit({
//         code: "saveUn",
//         unitName: "SaveUnit",
//         statusNo : 1,
//         statusRemarks : "" 
//     })

// //     const categroryRes = await saveMaster(
// //       `${categoryURL}/Save`,
// //       testData.save.itemSubgroup,
// //       true
// //     );
// //     expect(categroryRes.status(), "Status code should be 200").toBe(200);

// //     const getRes = await getAndSearch(`${categoryURL}/Search`, {
// //       ItemSubgroupName: testData.save.category.itemSubgroupName,
// //     });

// //     expect(getRes.length).toBeGreaterThan(0);

// //     const ItemSubgroupData = {
// //       ...testData.save.ItemSubgroup,
// //       code: `${getRes[0]?.code}${testData.save.ItemSubgroup.ItemSubgroupCode}`,
// //       itemCategoryId: getRes[0]?.id,
// //     };
// //     const response = await saveMaster(`${baseURL}/Save`, ItemSubgroupData, true);
// //     expect(response.status(), "Status code should be 200").toBe(200);

// //     const body = await response.json();
// //     expect(body, "Save response should be truthy").toBeTruthy();
//   });

//   test("🟢 Create ItemSubgroup 2 @saveItemSubgroupAPI", async () => {
//     const categroryRes = await saveMaster(
//       `${categoryURL}/Save`,
//       testData.save2.category,
//       true
//     );
//     expect(categroryRes.status(), "Status code should be 200").toBe(200);

//     const getRes = await getAndSearch(`${categoryURL}/Search`, {
//       ItemSubgroupName: testData.save2.category.ItemSubgroupName,
//     });

//     expect(getRes.length).toBeGreaterThan(0);

//     const ItemSubgroupData = {
//       ...testData.save2.ItemSubgroup,
//       code: `${getRes[0]?.code}${testData.save2.ItemSubgroup.ItemSubgroupCode}`,
//       itemCategoryId: getRes[0]?.id,
//     };

//     const response = await saveMaster(`${baseURL}/Save`, ItemSubgroupData, true);
//     expect(response.status(), "Status code should be 200").toBe(200);

//     const body = await response.json();
//     expect(body, "Save response should be truthy").toBeTruthy();
//   });

//   test("🔎 Get ItemSubgroup By ID and Validate @getById", async () => {
//     const searchData = await getAndSearch(`${categoryURL}/Search`, {});

//     const ItemSubgroupData = {
//       ...testData.getById.ItemSubgroup,
//       code: `${searchData[0]?.code}${testData.getById.ItemSubgroup.ItemSubgroupCode}`,
//       itemCategoryId: searchData[0]?.id,
//     };

//     await getByIdAndValidate(
//       baseURL,
//       validateResponseMatch,
//       ItemSubgroupData,
//       testData.getById.searchQuery
//     );
//   });

//   test("🚫 Duplicate ItemSubgroup Validation @duplicateCheckItemSubgroup", async () => {
//     const expectedErrors = {
//       ItemSubgroupName: "Duplicate ItemSubgroup Name is not allowed.",
//       Code: "Duplicate Code is not allowed.",
//     };
//     await duplicateCheck(baseURL, expectedErrors, testData.duplicateValidation);
//   });

//   test("✏️ Update ItemSubgroup @updateItemSubgroup", async () => {
//     const searchData = await getAndSearch(`${categoryURL}/Search`, {});

//     const ItemSubgroupData = {
//       ...testData.update.save,
//       code: `${searchData[0]?.code}${testData.update.save.ItemSubgroupCode}`,
//       itemCategoryId: searchData[0]?.id,
//     };

//     const updateItemSubgroupData = {
//       ...testData.update.update,
//       code: ItemSubgroupData.code,
//       itemCategoryId: ItemSubgroupData.itemCategoryId,
//     };

//     await saveAndUpdate(
//       ItemSubgroupData,
//       updateItemSubgroupData,
//       baseURL,
//       testData.update.searchQuery
//     );
//   });

//   test("🗑️ Delete ItemSubgroup @deleteItemSubgroup", async () => {
    
//     const searchData = await getAndSearch(`${categoryURL}/Search`, {});

//     const ItemSubgroupData = {
//       ...testData.delete.save,
//       code: `${searchData[0]?.code}${testData.delete.save.ItemSubgroupCode}`,
//       itemCategoryId: searchData[0]?.id,
//     };
//     await saveAndDelete(
//       ItemSubgroupData,
//       baseURL,
//       testData.delete.searchQuery
//     );
//   });

//   test("testing GET for Group Master", async () => {
//     const searchData = await getAndSearch(`${categoryURL}/Search`, {});

//     const ItemSubgroupData = {
//       ...testData.get.ItemSubgroup,
//       code: `${searchData[0]?.code}${testData.get.ItemSubgroup.ItemSubgroupCode}`,
//       itemCategoryId: searchData[0]?.id,
//     };

//     await saveAndGet(
//       baseURL,
//       ItemSubgroupData,
//       testData.get.getQuery,
//       validateGetRes
//     );
//   });

//   test("testing Search for Group Master", async () => {
//     const searchData = await getAndSearch(`${categoryURL}/Search`, {});

//     const ItemSubgroupData = {
//       ...testData.search.ItemSubgroup,
//       code: `${searchData[0]?.code}${testData.search.ItemSubgroup.ItemSubgroupCode}`,
//       itemCategoryId: searchData[0]?.id,
//     };
//     saveAndSearch(
//       baseURL,
//       ItemSubgroupData,
//       testData.search.searchQuery,
//       validateSearchRes
//     );
//   });

// //    for (const testCase of testData.validationTestCases) {
// //     test(`Validation: ${testCase.description}`, async () => {
// //       if (testCase.precondition) {
// //         await saveMaster(`${baseURL}/Save`, testCase.precondition, true);
// //       }

// //       const response = await saveMaster(`${baseURL}/Save`, testCase.input, true);
// //       const body = await response.json();

// //       const match = body.validationErrors.find(
// //         (e) =>
// //           e.PropertyName === testCase.expectedError.PropertyName &&
// //           e.ErrorMessage === testCase.expectedError.ErrorMessage
// //       );

// //       expect(
// //         match,
// //         `Expected error not found: ${testCase.expectedError.PropertyName}`
// //       ).toBeTruthy();
// //     });
// //   }
// });

// const validateGetRes = (formData, getRes) => {
//   expect(getRes.code == formData.code).toBeTruthy();
//   expect(getRes.ItemSubgroupName == formData.ItemSubgroupName).toBeTruthy();
//   expect(getRes.itemCategoryId == formData.itemCategoryId).toBeTruthy();
//   expect(getRes.itemCategoryCode == formData.code.slice(0, 2)).toBeTruthy();
// };

// const validateSearchRes = (formData, searchRes) => {
//   expect(searchRes.code == formData.code).toBeTruthy();
//   expect(searchRes.ItemSubgroupName == formData.ItemSubgroupName).toBeTruthy();
//   expect(searchRes.itemCategoryId == formData.itemCategoryId).toBeTruthy();
//   expect(searchRes.statusNo == formData.statusNo).toBeTruthy();
//   expect(searchRes.itemCategoryCode == formData.code.slice(0, 2)).toBeTruthy();
// };

// function validateResponseMatch(formData: any, apiResponse: any) {
//   expect(apiResponse.code == formData.code).toBeTruthy();
//   expect(apiResponse.ItemSubgroupName == formData.ItemSubgroupName).toBeTruthy();
//   expect(apiResponse.status?.statusNo == formData.statusNo).toBeTruthy();
//   expect(apiResponse.itemCategory.id == formData.itemCategoryId).toBeTruthy();
//   expect(
//     apiResponse.itemCategory.code == formData.code.slice(0, 2)
//   ).toBeTruthy();
//   expect(apiResponse.statusRemarks == formData.statusRemarks).toBeTruthy();
// }
