import { Page, test, expect } from "@playwright/test";
import { LoginPage } from "../../../../pages/login";
import { TestConfig } from "../../../../test.config";
import { UserMaster } from "../../../../pages/user-master";
import { HomePage } from "../../../../pages/home";
import { FormLayout } from "../../../../utils/form-layout";
import { loadTestData } from "../../../../utils/data-provider";
import { FormHelper } from "../../../../utils/form-helper";
import { checkInputAttributes } from "../../../../utils/inputBox";

let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;
let userMasterPage: UserMaster;
let formLayout: FormLayout;
let formHelper: FormHelper;

 const inputFieldSpecs = [
      // {
      //   name: "userType",
      //   placeholder: "Select User Type",
      //   type: "select", // or "dropdown" if using custom UI
      //   required: true,
      //   dataType: "number"
      // },
      {
        name: "code",
        placeholder: "Ex- UM00001",
        maxlength: "10",
        readonly: true,
        visibleOnlyOnUpdate: true,
        type: "text",
        autocomplete: "off",
        dataType: "string",
      },
      {
        name: "userProfileId",
        placeholder: "Ex- John123",
        maxlength: "12",
        required: true,
        type: "text",
        autocomplete: "off",
        dataType: "string",
      },
      {
        name: "userName",
        placeholder: "Ex- John Doe",
        maxlength: "100",
        required: true,
        type: "text",
        autocomplete: "off",
        dataType: "string",
      },
      {
        name: "emailId",
        placeholder: "Ex- john@mail.com",
        maxlength: "150",
        required: true,
        type: "email",
        autocomplete: "off",
        dataType: "string",
      },
      {
        name: "contactNo",
        placeholder: "Enter Contact No.",
        maxlength: "15",
        optional: true,
        type: "text", // can be 'tel' if formatted
        dataType: "number",
      },
      {
        name: "employeeId",
        placeholder: "Ex- Emp0001",
        maxlength: "20",
        optional: true,
        type: "text",
        dataType: "string",
      },
      {
        name: "designation",
        placeholder: "Ex- Manager",
        maxlength: "100",
        optional: true,
        type: "text",
        dataType: "string",
      },
      // {
      //   name: "department",
      //   placeholder: "Select Department",
      //   type: "autosuggestion",
      //   optional: true,
      //   dataType: "GUID"
      // },
      {
        name: "reportingManagerName",
        placeholder: "Enter Reporting Manager's Name",
        maxlength: "100",
        optional: true,
        type: "text",
        dataType: "string",
      },
      {
        name: "statusRemarks",
        placeholder: "Enter Status Remarks",
        maxlength: "300",
        dataType: "string",
      },
    ];

test.describe("User Master Tests", () => {
  const testData = loadTestData("test-data/ui/user-master-data.json");

  test.beforeEach(async ({ page }) => {
    config = new TestConfig();
    await page.goto(config.appUrl);

    loginPage = new LoginPage(page);
    await loginPage.login(config.email, config.password);

    formLayout = new FormLayout(page);

    homePage = new HomePage(page);
    await homePage.isHomePage();
    await homePage.masterSearch("MUMM");
    // await homePage.geToMaster('master', "Other Masters","User Master");

    userMasterPage = new UserMaster(page);
    await userMasterPage.isUserMasterPage();
    await expect(page).toHaveURL(/.*user-master/);

    formHelper = new FormHelper(page, formLayout, SaveData, userMasterPage);
  });

  for(const spec of inputFieldSpecs){
    test(`Input attribute test ${spec.name}`,async ({page})=>{
      await formLayout.clickAdd();
      await checkInputAttributes(page, spec)
    })
  }

  test("New Unit creation 1 @saveUserNew1", async ({ page }) => {
    await formHelper.saveAndVerify(testData.save1);
  });

  test("New Unit creation 2 @saveUserNew2", async ({ page }) => {
    await formHelper.saveAndVerify(testData.save2);
  });

  test("New Unit creation 3 @saveUserNew3", async ({ page }) => {
    await formHelper.saveAndVerify(testData.save3);
  });

  test("New Unit creation 4 @saveUserNew4", async ({ page }) => {
    await formHelper.saveAndVerify(testData.save4);
  });

  test("Check Validation Error @validationUserError", async ({ page }) => {
    await formHelper.checkValidationError([
      "Enter User Type.",
      "Enter User Profile Id.",
      "Enter User Name.",
      "Enter Email Id.",
      "Enter Status Remarks.",
    ]);
  });

  test("Delete Saved Data @deleteUserData", async ({ page }) => {
    await formHelper.deleteAndVerify(
      testData.delete,
      testData.delete.userProfileId
    );
  });

  test("Duplicate Data Validation @duplicateUser", async ({ page }) => {
    await formHelper.duplicateDataValidation(testData.duplicate);

    const { userProfileIdError, emailIdError, employeeIdError } =
      await userMasterPage.getErrorStates();
    expect(userProfileIdError).toBeTruthy();
    expect(emailIdError).toBeTruthy();
    expect(employeeIdError).toBeTruthy();
  });

  test("Update Saved Data @updateUserData", async ({ page }) => {
    await formHelper.updateData(
      testData.update,
      testData.update.firstSave.userProfileId
    );
  });

});

const SaveData = async (
  page: Page,
  data: any,
  mode: "save" | "update" | "" = ""
) => {
  await test.step("Fill the form", async () => {
    if (data.name) {
      await userMasterPage.fillUserName(data.name);
    }
    if (data.userProfileId) {
      await userMasterPage.fillUserProfileId(data.userProfileId);
    }
    if (data.userType) {
      await userMasterPage.fillUserType(data.userType);
    }
    if (data.emailId) {
      await userMasterPage.fillEmailId(data.emailId);
    }
    if (data.contactNo) {
      await userMasterPage.fillContactNo(data.contactNo);
    }
    if (data.employeeId) {
      await userMasterPage.fillEmployeeId(data.employeeId);
    }
    if (data.departmentQuery) {
      await userMasterPage.fillDepartment(
        data.departmentQuery,
        data.departmentName
      );
    }
    if (data.businessUnit1) {
      await userMasterPage.selectBusinessUnit(data.businessUnit1);
    }
    if (data.designation) {
      await userMasterPage.fillDesignation(data.designation);
    }
    if (data.reportingManagerName) {
      await userMasterPage.fillReportingManagerName(data.reportingManagerName);
    }
    if (data.status) {
      await userMasterPage.selectStatusNo(data.status);
    }
    if (data.status === "2") {
      await userMasterPage.fillStatusRemarks(data.statusRemarks);
    }
  });

  if (mode) {
    await test.step("Save and verify", async () => {
      await formLayout.saveData(mode);
      await expect(page).toHaveURL(/.*user-master/);
      const row = userMasterPage.getRowByCode(data.name);
      await expect(row).toHaveCount(1);
    });
  }
};
