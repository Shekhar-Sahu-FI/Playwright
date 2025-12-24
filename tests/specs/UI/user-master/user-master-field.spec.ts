import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../../../../pages/admin/login';
import { TestConfig } from '../../../../test.config';
import { UserMaster } from '../../../../pages/admin/user-master';
import { HomePage } from '../../../../pages/home';
import { FormLayout } from '../../../../utils/form-layout';
import { FormOperation } from '../../../../utils/form-operation';
import { fieldParameterCheck } from '../../../../utils/field-utillity';

let config: TestConfig;
let page: Page;
let userMasterPage: UserMaster;
let homePage: HomePage;
let formLayout: FormLayout;
let formOperation: FormOperation;
let fieldData: any[] = [
  {
    key: 'userType',
    label: 'User Type',
    type: 'dropdown',
    mandatory: true,
    expectedValues: ['Select User Type', 'Admin', 'General'],
    expectedCodes: [1, 2, 3],
    selectedValue: 'Select User Type',
  },
  {
    key: 'code',
    label: 'Code',
    type: 'text',
    maxlength: 10,
    readonly: true,
  },
  {
    key: 'userProfileId',
    label: 'User Profile Id',
    type: 'text',
    maxlength: 12,
    mandatory: true,
    unique: true,
    placeholder: 'Enter User Profile Id',
  },
  {
    key: 'userName',
    label: 'User Name',
    type: 'text',
    maxlength: 100,
    mandatory: true,
    allowSpecialChars: false,
    placeholder: 'Enter User Name',
  },
  {
    key: 'emailId',
    label: 'Email Id',
    type: 'text',
    maxlength: 150,
    mandatory: true,
    unique: true,
    placeholder: 'Enter Email Id',
  },
  {
    key: 'contactNo',
    label: 'Contact Number',
    type: 'text',
    maxlength: 15,
    mandatory: false,
    allowSpecialChars: false,
    numericOnly: true,
    placeholder: 'Enter Contact Number',
  },
  {
    key: 'employeeId',
    label: 'Employee Id',
    type: 'text',
    maxlength: 20,
    mandatory: false,
    unique: true,
    placeholder: 'Enter Employee Id',
  },
  {
    key: 'designation',
    label: 'Designation',
    type: 'text',
    maxlength: 100,
    mandatory: false,
    placeholder: 'Enter Designation',
  },
  {
    key: 'reportingManagerName',
    label: 'Reporting Manager Name',
    type: 'text',
    maxlength: 100,
    mandatory: false,
    placeholder: 'Enter Reporting Manager Name',
  },
  {
    key: 'statusNo',
    label: 'Status',
    type: 'dropdown',
    mandatory: true,
    expectedValues: ['Select Status', 'Active', 'Inactive', 'Suspended'],
    selectedValue: 'Active',
  },
  {
    key: 'statusRemarks',
    label: 'Status Remarks',
    type: 'textarea',
    maxlength: 300,
    mandatory: false, // becomes true for Inactive/Suspended
    visibleWhenStatus: ['Inactive', 'Suspended'],
    placeholder: 'Enter Remarks',
  },
];

test.beforeAll(async ({ browser }) => {
  config = new TestConfig();
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto(config.appUrl);

  const loginPage = new LoginPage(page);
  await loginPage.login(config.email, config.password);

  homePage = new HomePage(page);
  await homePage.isHomePage();
  await homePage.masterSearch('MAUM');

  userMasterPage = new UserMaster(page);
  await userMasterPage.isUserMasterPage();
  await expect(page).toHaveURL(/.*user-master/);

  formLayout = new FormLayout(page);
  formOperation = new FormOperation(page, formLayout, SaveData, userMasterPage);
  await formOperation.openNewForm();
});

test.describe('User Master Field Tests', () => {
  test('Field Parameter Validation @userMasterFieldValidation', async ({ page }) => {
    const failedFields: string[] = [];

    for (const field of fieldData) {
      await test.step(`Validate field: ${field.label}`, async () => {
        try {
          const locator = (userMasterPage as any)[field.key];
          await fieldParameterCheck({ ...field, field: locator }, page);
        } catch (err: any) {
          console.warn(`⚠️ Field check failed for ${field.label}: ${err.message}`);
          failedFields.push(`${field.label}: ${err.message}`);
          // ✅ Don’t throw here — soft fail
        }
      });
    }

    // ✅ At the end, check if any fields failed
    expect.soft(failedFields.length, 'All field validations should pass').toBe(0);

    if (failedFields.length > 0) {
      console.table(failedFields);
    }
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
