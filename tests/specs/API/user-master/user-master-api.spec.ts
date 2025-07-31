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
  deleteById,
  save,
  checkValidation
} from "../../../../utils/apiClients";
import { loadTestData } from "../../../../utils/data-provider";
import {
  exceedCharacterLength,
  blankNonMandatoryField,
  saveWithInMaxLength,
  blankMandatoryField,
} from "../../../../test-data/api/userTest";

const baseURL = "/Admin/UserMaster";





test.describe("User Master Full API Flow", () => {
  const testData = loadTestData("test-data/api/user-master-api-data.json");

  //Validation for the more than max length
  checkValidation(exceedCharacterLength, baseURL);

  //Validation for the blank non mandatory Field
  checkValidation(blankMandatoryField, baseURL);

  // save for non Mandatory empty field
  save(blankNonMandatoryField, baseURL);

  //save with in Max length
  save(saveWithInMaxLength, baseURL);

  
    test("🔎 Get User By ID and Validate @getById", async () => {
      await getByIdAndValidate(baseURL, validateResponseMatch, testData.getById.save, testData.getById.searchQuery );
    });

    test("🚫 Duplicate User Validation @duplicateCheckUser", async () => {
      const expectedErrors = {
        EmployeeId: 'Duplicate Employee Id is not allowed.',
        UserProfileId: "Duplicate User Profile Id is not allowed.",
        EmailId: "Duplicate Email Id is not allowed.",
      };
      await duplicateCheck(baseURL, expectedErrors, testData.duplicateValidation);
    });

    test("✏️ Update User @updateUser", async () => {
      await saveAndUpdate(
        testData.update.save,
        testData.update.update,
        baseURL,
        testData.update.searchQuery
      );
    });

    test("🗑️ Delete User @deleteUser", async () => {
      await saveAndDelete(
        baseURL,
        testData.delete.save,
        testData.delete.searchQuery
      );
    });

    test("Testing GET for User Master", async () => {
       await saveAndGet(baseURL, testData.get.save,testData.get.getQuery, validateGetRes);
    });

    test("Testing Search for User Master", async () => {
        await saveAndSearch(baseURL, testData.search.save,testData.search.searchQuery, validateSearchRes);
    });

    test("Update Owner Type",async () =>{
        const getRes = await getAndSearch(`${baseURL}/Search`,{ userProfileId: "Admin"})
        const updatedData = {
            ...getRes[0],
            userTypeNo : 2,
        }
        const res = await saveMaster(`${baseURL}/Update`,updatedData,false);
        const response = await res.json();
        expect(response.validationErrors[0].PropertyName == "UserTypeNo").toBeTruthy()
        expect(response.validationErrors[0].ErrorMessage == 'User Type cannot be changed.').toBeTruthy()

    })

    test("Update Owner Email",async () =>{
        const getRes = await getAndSearch(`${baseURL}/Search`,{ userProfileId: "Admin"})
        const updatedData = {
            ...getRes[0],
            emailId: "shekhar@gmail.com"
        }
        const res = await saveMaster(`${baseURL}/Update`,updatedData,false);
        const response = await res.json();
        expect(response.validationErrors[0].PropertyName == "EmailId","Checking Email Field").toBeTruthy()
        expect(response.validationErrors[0].ErrorMessage == 'Email Id of owner cannot be changed.', "Checking Email Message").toBeTruthy()

    })

     test("Delete Owner Type",async () =>{
        const getRes = await getAndSearch(`${baseURL}/Search`,{ userProfileId: "Admin"})
        console.log(getRes)
        const res = await deleteById(`${baseURL}/Delete`,getRes[0].id);
        expect(res.validationErrors[0].PropertyName == "UserTyprNo").toBeTruthy()
        expect(res.validationErrors[0].ErrorMessage == 'Owner Cannot be deleted.').toBeTruthy()

    })
});

const validateGetRes = (formData, getRes) => {

  expect(getRes.userProfileId == formData.userProfileId,"userProfileNo check").toBeTruthy();
  expect(getRes.UserName == formData.UserName,"userName check").toBeTruthy();
  expect(getRes.UserTypeNo == formData.UserTypeNo,"userTypeNo check").toBeTruthy();
};

const validateSearchRes = (formData, searchRes) => {

  expect(searchRes.userTypeNo == formData.userTypeNo,"userTypeNo check").toBeTruthy();
  expect(searchRes.userProfileId == formData.userProfileId,"userProfile check").toBeTruthy();
  expect(searchRes.userName == formData.userName,"userName check").toBeTruthy();
  expect(searchRes.emailId == formData.emailId,"emailId check").toBeTruthy();
  expect(searchRes.contactNo == formData.contactNo,"conatactNo check").toBeTruthy();
  expect(searchRes.statusNo == formData.statusNo,"statusNo check").toBeTruthy();
};

function validateResponseMatch(formData: any, apiResponse: any) {
  expect(apiResponse.userProfileId == formData.userProfileId ,"userProfile check").toBeTruthy();
  expect(apiResponse.userTypeNo == formData.userTypeNo,"userTypeNo check").toBeTruthy();
  expect(apiResponse.userName == formData.userName,"userName check").toBeTruthy();
  expect(apiResponse.emailId == formData.emailId,"emailId check").toBeTruthy();
  expect(apiResponse.employeeId == formData.employeeId,"employeeId check").toBeTruthy();
  expect(apiResponse.designation == formData.designation,"designation check").toBeTruthy();
  expect(apiResponse.reportingManagerName == formData.reportingManagerName,"reportingManagerName check").toBeTruthy();
  expect(apiResponse.status?.statusNo == formData.statusNo,"statusNo check").toBeTruthy();
  expect(apiResponse.statusRemarks == formData.statusRemarks,"statusRemarks check").toBeTruthy();
}
