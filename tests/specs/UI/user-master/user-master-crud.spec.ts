import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '../../../../pages/login';
import { TestConfig } from '../../../../test.config';
import { UserMaster } from '../../../../pages/user-master';
import { HomePage } from '../../../../pages/home';
import { FormLayout } from '../../../../utils/form-layout';
import { loadTestData } from '../../../../utils/data-provider';
import { FormOperation } from '../../../../utils/form-operation';
import { fieldParameterCheck } from '../../../../utils/field-utillity';


let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;
let userMasterPage: UserMaster;
let formLayout: FormLayout;
let formOperation: FormOperation;
let fieldData: any;

test.describe('User Master Tests', () => {
  const testData = loadTestData('test-data/ui/user-master-data.json');

  test.beforeEach(async ({ page }) => {
    config = new TestConfig();
    await page.goto(config.appUrl);

    loginPage = new LoginPage(page);
    await loginPage.login(config.email, config.password);

    formLayout = new FormLayout(page);

    homePage = new HomePage(page);
    await homePage.isHomePage();
    await homePage.masterSearch('MAUM');
    // await homePage.geToMaster('master', "Other Masters","User Master");

    userMasterPage = new UserMaster(page);
    await userMasterPage.isUserMasterPage();
    await expect(page).toHaveURL(/.*user-master/);

    formOperation = new FormOperation(page, formLayout, SaveData, userMasterPage);
  });

  test('New Unit creation 1 @saveUserNew1', async ({ page }) => {
    await formOperation.saveAndVerify(testData.save1);
  });

  test('New Unit creation 2 @saveUserNew2', async ({ page }) => {
    await formOperation.saveAndVerify(testData.save2);
  });

  test('New Unit creation 3 @saveUserNew3', async ({ page }) => {
    await formOperation.saveAndVerify(testData.save3);
  });

  test('New Unit creation 4 @saveUserNew4', async ({ page }) => {
    await formOperation.saveAndVerify(testData.save4);
  });

  test('Check Validation Error @validationUserError', async ({ page }) => {
    await formOperation.checkValidationError([
      'Enter User Type.',
      'Enter User Profile Id.',
      'Enter User Name.',
      'Enter Email Id.',
      'Enter Status Remarks.',
    ]);
  });

  test('Delete Saved Data @deleteUserData', async ({ page }) => {
    await formOperation.deleteAndVerify(testData.delete, testData.delete.userProfileId);
  });

  test('Duplicate Data Validation @duplicateUser', async ({ page }) => {
    await formOperation.duplicateDataValidation(testData.duplicate);

    const { userProfileIdError, emailIdError, employeeIdError } =
      await userMasterPage.getErrorStates();
    expect(userProfileIdError).toBeTruthy();
    expect(emailIdError).toBeTruthy();
    expect(employeeIdError).toBeTruthy();
  });

  test('Update Saved Data @updateUserData', async ({ page }) => {
    await formOperation.updateData(testData.update, testData.update.firstSave.userProfileId);
  });

});

const SaveData = async (page: Page, data: any, mode: 'save' | 'update' | '' = '') => {
  await test.step('Fill the form', async () => {
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
      await userMasterPage.fillDepartment(data.departmentQuery, data.departmentName);
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
    if (data.status === '2') {
      await userMasterPage.fillStatusRemarks(data.statusRemarks);
    }
  });

  if (mode) {
    await test.step('Save and verify', async () => {
      await formLayout.saveData(mode);
      await expect(page).toHaveURL(/.*user-master/);
      const row = userMasterPage.getRowByCode(data.name);
      await expect(row).toHaveCount(1);
    });
  }
};
