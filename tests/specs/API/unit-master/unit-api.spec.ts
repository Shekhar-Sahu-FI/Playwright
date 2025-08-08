import { test, expect } from "@playwright/test";
import {
  getByIdAndValidate,
  duplicateCheck,
  saveAndUpdate,
  saveAndDelete,
  saveAndGet,
  saveAndSearch,
  checkValidation,
  save,
} from "../../../../utils/apiClients";

import { loadTestData } from "../../../../utils/data-provider";
import { blankMandatoryField, exceedCharacterLength, getAPIValidationMessage, saveWithInMaxLength } from "../../../../test-data/api/unit-master/unit-master";


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
  
    checkValidation(getAPIValidationMessage, baseURL,"Get");

    //Validation for the more than max length
    checkValidation(exceedCharacterLength, baseURL, "Save");
  
    // //Validation for the blank non mandatory Field
    checkValidation(blankMandatoryField, baseURL,"Save");
  
    //save with in Max length
     save(saveWithInMaxLength, baseURL);
  
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

  // test("Delete all Unit in Unit Master",async ()=>{
  //   await deleteAll(baseURL);
  // })  

});


// import { test, expect } from "@playwright/test";
// import { allure } from "allure-playwright";
// import {
//   getByIdAndValidate,
//   duplicateCheck,
//   saveAndUpdate,
//   saveAndDelete,
//   saveAndGet,
//   saveAndSearch,
// } from "../../../../utils/apiClients";
// import { loadTestData } from "../../../../utils/data-provider";


// const baseURL = "/Master/UnitMaster";  

// function expectValidationError(body, property, message) {
//   const error = body.validationErrors.find(
//     (e) => e.PropertyName === property && e.ErrorMessage === message
//   );
//   expect(error, `Expected ${property} error: "${message}"`).toBeTruthy();
// }

// const validateGetRes = (formData, apiRes) => {
//   expect(apiRes.code).toBe(formData.code);
//   expect(apiRes.unitName).toBe(formData.unitName);
// };

// const validateSearchRes = (formData, apiRes) => {
//   expect(apiRes.code).toBe(formData.code);
//   expect(apiRes.unitName).toBe(formData.unitName);
//   expect(apiRes.statusNo).toBe(formData.statusNo);
// };

// const validateResponseMatch = (formData, apiRes) => {
//   expect(apiRes.code).toBe(formData.code);
//   expect(apiRes.unitName).toBe(formData.unitName);
//   expect(apiRes.status?.statusNo).toBe(formData.statusNo);
//   expect(apiRes.statusRemarks).toBe(formData.statusRemarks);
// };




// test.describe("📌 Unit Master API Tests  @UnitMasterAPI", () => {
//   const testData = loadTestData("test-data/api/unit-master/unit-master-api-data.json");
//   console.log(testData,"<=======================");

//   test("✏️ Update Unit @unit8458 master", async () => {

//     await allure.step("Update an existing Unit", async () => {
//       await saveAndUpdate(
//         testData.updateCases.initial,
//         testData.updateCases.updated,
//         baseURL,
//         testData.updateCases.searchData
//       );
//       allure.attachment("Updated Payload", JSON.stringify(testData.updateCases.updated, null, 2), "application/json");
//     });
//   });

//   test("🗑️ Delete Unit", async () => {
//     await allure.step("Delete Unit and verify deletion", async () => {
//       await saveAndDelete(
//         baseURL,
//         testData.deleteCases.record,
//         testData.deleteCases.searchData
//       );
//       allure.attachment("Deleted Record", JSON.stringify(testData.deleteCases.record, null, 2), "application/json");
//     });
//   });

//   test("🔍 Get Unit By ID", async () => {
//     await allure.step("Fetch Unit by ID", async () => {
//       await getByIdAndValidate(
//         baseURL,
//         validateResponseMatch,
//         testData.getBiIdCases.record,
//         testData.getBiIdCases.query
//       );
//     });
//   });

//   test("📥 GET Unit Master", async () => {
//     await allure.step("Verify GET endpoint returns correct Unit", async () => {
//       await saveAndGet(
//         baseURL,
//         testData.getCases.record,
//         testData.getCases.query,
//         validateGetRes
//       );
//     });
//   });

//   test("🔎 Search Unit", async () => {
//     await allure.step("Search Unit and validate response", async () => {
//       await saveAndSearch(
//         baseURL,
//         testData.searchCases.record,
//         testData.searchCases.query,
//         validateSearchRes
//       );
//     });
//   });

//   test("🚫 Duplicate Unit Validation", async () => {
//     await allure.step("Check Duplicate Unit Validation Errors", async () => {
//       await duplicateCheck(
//         baseURL,
//         testData.duplicateCases.expectedErrors,
//         testData.duplicateCases.record
//       );
//     });
//   });
// });
