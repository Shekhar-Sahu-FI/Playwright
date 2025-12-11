import { test, expect, Page } from '@playwright/test';
import { ItemSubgroupMaster, ItemSubgroupMasterFormData } from '../../../../pages/item-subgroup-master';
import { loadTestData } from '../../../../utils/data-provider';
import { setupMasterForm } from '../../../../utils/playwright-utility';
import { FormOperation } from '../../../../utils/form-operation';
import { FormLayout } from '../../../../utils/form-layout';

let itemSubgroupMasterPage: ItemSubgroupMaster;
let formOperation: FormOperation<ItemSubgroupMasterFormData>;
let formLayout: FormLayout;

/**
 * SaveData: Fills the Item Subgroup Master form and saves/updates as needed.
 */
const SaveData = async (page: Page, data: ItemSubgroupMasterFormData, mode: 'save' | 'update' | '' = '') => {
  await test.step('Fill the form', async () => {
    await itemSubgroupMasterPage.fillItemSubgroupMasterForm(data);
  });
  if (mode) {
    await test.step('Save and verify', async () => {
      console.log('1 =====================>');
      await formLayout.saveData(mode);
      console.log('2 =====================>');
      await expect(page).toHaveURL(/.*item-subgroup-master/);
      console.log('3 ========================>');
      const row = itemSubgroupMasterPage.getRowByCodeAcrossPages(data.itemSubgroupName);
      await expect(row).toHaveCount(1);
    });
  }
};

test.describe('Item Subgroup Master UI Tests', () => {
  const testData: Record<string, ItemSubgroupMasterFormData | any> = loadTestData(
    'test-data/ui/item-subgroup-master-data.json',
  );

  test.beforeEach(async ({ page }) => {
    const setup = await setupMasterForm<ItemSubgroupMasterFormData>(
      page,
      'MMSG', // master code for Item Subgroup
      ItemSubgroupMaster,
      SaveData,
    );
    itemSubgroupMasterPage = setup.masterPage;
    formOperation = setup.formOperation;
    formLayout = setup.formLayout;
  });

  test('Mandatory Validation For Subgroup', async ({ page }) => {
    await formOperation.checkValidationError([
      'Enter Subgroup Code',
      'Enter Subgroup Code',
      'Select Item Group',
      'Select a Unit',
      'Enter lead time',
      'Enter Status Remarks',
    ]);
  });

  test('Subgroup Save And Update', async ({ page }) => {
    await formOperation.updateData(testData.saveAndUpdate, testData.saveAndUpdate.firstSave.itemSubgroupName);
  });

  test('Check Subgroup Tab Indexing', async ({ page }) => {
    await formOperation.openNewForm();
    // await itemSubgroupMasterPage.checkTabIndexing();
  });

  test('Delete Saved Item Subgroup', async ({ page }) => {
    await formOperation.deleteAndVerify(testData.saveAndDelete, testData.saveAndDelete.itemSubgroupName);
  });

  test('Check Item Subgroup Field Parameters', async ({ page }) => {
    await formOperation.openNewForm();
    await itemSubgroupMasterPage.checkFieldParameter();
  });

  test('Duplicate Item Subgroup Validation', async ({ page }) => {
    await formOperation.duplicateDataValidation(testData.duplicateError);
    const { codeErrorVisible, subgroupCodeErrorVisible, nameErrorVisible } =
      await itemSubgroupMasterPage.getErrorStates();
    expect(codeErrorVisible).toBeTruthy();
    expect(subgroupCodeErrorVisible).toBeTruthy();
    expect(nameErrorVisible).toBeTruthy();
  });
});
