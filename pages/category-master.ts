import { Page, Locator, expect } from '@playwright/test';
import { FormLayout } from '../utils/form-layout'; 

export class CategoryMaster {
  private readonly page: Page;
  private readonly formLayout: FormLayout;

  private readonly code: Locator;
  private readonly categoryName: Locator;
  private readonly statusNo: Locator;
  private readonly statusRemarks: Locator;
  private readonly codeError: Locator;
  private readonly categoryNameError: Locator;
  private readonly confirmation: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formLayout = new FormLayout(page); 

    this.code = page.locator('[name="code"]');
    this.categoryName = page.locator('[name="itemCategoryName"]');
    this.statusNo = page.locator('select[name="statusNo"]');
    this.statusRemarks = page.locator('[name="statusRemark"]');
    this.confirmation = page.getByRole('heading', { name: 'Confirmation' });
    this.codeError = page.getByText('Duplicate Code is not allowed');
    this.categoryNameError = page.getByText('Duplicate Item Category Name is not allowed.');
  }

  async isCategoryMasterPage() {
    await this.page.getByText('unit-master').isVisible();
  }

  async fillCode(code: string) {
    await this.code.fill(code);
  }

  async fillCategoryName(categoryName: string) {
    await this.categoryName.fill(categoryName);
  }

  async selectStatusNo(status: string) {
    await this.statusNo.selectOption(status);
  }

  async fillStatusRemarks(statusRemarks: string) {
    await this.statusRemarks.fill(statusRemarks);
  }

  async fillCategoryMasterForm(data:any) {
    await this.fillCode(data.code);
    await this.fillCategoryName(data.name);
    await this.selectStatusNo(data.status);
    if(data.statusRemarks){
      await this.fillStatusRemarks(data.statusRemarks);
    }
    await this.formLayout.saveData("save");
  }

   async getErrorStates() {
    return {
        codeErrorVisible: await this.codeError.isVisible(),
        nameErrorVisible: await this.categoryNameError.isVisible(),
    };
    }

  getRowByCode(code: string) {
    return this.page.locator('tr', {
      has: this.page.locator(`td >> text=${code}`)
    });
  }  

  async  verifyFormData( data: any) {
    await expect(this.code).toHaveValue(data.code);
    await expect(this.categoryName).toHaveValue(data.name);
    if(data.status){
      await expect(this.statusNo).toHaveValue(data.status);
    }
    if(data.status === '2'){
      await expect(this.statusRemarks).toHaveValue(data.statusRemarks);
    }
  }
  
}
