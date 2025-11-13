import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '../../../../pages/login';
import { TestConfig } from '../../../../test.config';
import { StateMaster } from '../../../../pages/state-master';
import { HomePage } from '../../../../pages/home';
import { FormLayout } from '../../../../utils/form-layout';
import { loadTestData } from '../../../../utils/data-provider';
import { FormOperation } from '../../../../utils/form-operation';
import { fieldParameterCheck } from '../../../../utils/field-utillity';

let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;
let stateMasterPage: StateMaster;
let formLayout: FormLayout;
let formOperation: FormOperation;

const authFile = 'playwright/.auth/state.json';
test.use({ storageState: authFile });

const testData = loadTestData('test-data/ui/state-master-data.json');

test.describe('State Master Full UI Tests @TestStateMaster', () => {
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    stateMasterPage = new StateMaster(page);
    formLayout = new FormLayout(page);
    formOperation = new FormOperation(page, formLayout, SaveData, stateMasterPage);
    await page.goto('http://localhost:5173/master/state-master');
    await expect(page).toHaveURL(/.*state-master/);
  });

  // for (const dataKey of Object.keys(testData.saveCases || {})) {
  //   test(`New State creation ${dataKey} @saveUnitNew${dataKey}`, async ({ page }) => {
  //     await formOperation.saveAndVerify(testData.saveCases[dataKey]);
  //   });
  // }

  test('Check Validation Error @validationUnitError', async ({ page }) => {
    await formOperation.checkValidationError([
      'Select Country.',
      'Enter Code',
      'Enter State Name.',
      'Enter Status Remarks.',
    ]);
  });

    test('New State creation 1 @saveStateNew1', async ({ page }) => {
    await formOperation.saveAndVerify(testData.save1);
  });

  test('Delete Saved Data @deleteUnitData', async ({ page }) => {
    await formOperation.deleteAndVerify(testData.delete, testData.delete.code);
  });

  test('Duplicate Data Validation @duplicateUnit', async ({ page }) => {
    await formOperation.duplicateDataValidation(testData.duplicate);

    const { codeErrorVisible, nameErrorVisible } = await stateMasterPage.getErrorStates();
    expect(codeErrorVisible).toBeTruthy();
    expect(nameErrorVisible).toBeTruthy();
  });

  test('Update Saved Data @updateStateData', async ({ page }) => {
    await formOperation.updateData(testData.update, testData.update.firstSave.code);
  });

  test('should validate all text fields parameters in state master', async ({ page }) => {
    await formOperation.openNewForm();

    const fieldData = [
      {
        field: stateMasterPage.stateName,
        label: 'State Name',
        maxlength: 50,
        mandatory: true,
        type: 'text',
        placeholder: 'E.g. - Chhattisgarh',
      },
      {
        field: stateMasterPage.code,
        label: 'Code',
        maxlength: 6,
        type: 'text',
        mandatory: true,
        placeholder: 'E.g. - CG',
      },
      {
        field: stateMasterPage.statusNo,
        label: 'Status',
        type: 'dropdown',
        mandatory: true,
        disabled: false,
        expectedValues: ['Select Status', 'Active', 'Inactive'],
        selectedValue: 'Active',
      },
      {
        field: stateMasterPage.statusRemarks,
        label: 'Status Remarks',
        maxlength: 300,
        mandatory: false,
        disabled: true,
        type: 'textarea',
      },
    ];

    await fieldParameterCheck(fieldData, page);
  });
});

const SaveData = async (page: Page, data: any, mode: 'save' | 'update' | '' = '') => {
  await test.step('Fill the form', async () => {
    await stateMasterPage.selectCountry(data.query, data.countryName);
    await stateMasterPage.fillCode(data.code);
    await stateMasterPage.fillStateName(data.name);
    if (data.status) {
      await stateMasterPage.selectStatusNo(data.status);
    }
    if (data.status === '2') {
      await stateMasterPage.fillStatusRemarks(data.statusRemarks);
    }
  });

  if (mode) {
    await test.step('Save and verify', async () => {
      await formLayout.saveData(mode);
      await expect(page).toHaveURL(/.*state-master/);
      const row = stateMasterPage.getRowByCode(data.code);
      await expect(row).toHaveCount(1);
    });
  }
};
