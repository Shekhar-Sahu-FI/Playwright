import { Page, Locator, expect } from '@playwright/test';
import { FormLayout } from '../utils/form-layout'; 

export class UnitMaster {
  private readonly page: Page;
  private readonly formLayout: FormLayout;

  private readonly code: Locator;
  private readonly unitName: Locator;
  private readonly statusNo: Locator;
  private readonly statusRemarks: Locator;
  private readonly codeError: Locator;
  private readonly unitNameError: Locator;
  private readonly confirmation: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formLayout = new FormLayout(page); 

    this.code = page.locator('[name="code"]');
    this.unitName = page.locator('[name="unitName"]');
    this.statusNo = page.locator('select[name="statusNo"]');
    this.statusRemarks = page.locator('[name="statusRemark"]');
    this.confirmation = page.getByRole('heading', { name: 'Confirmation' });
    this.codeError = page.getByText('Duplicate code is not allowed.');
    this.unitNameError = page.getByText('Duplicate Unit Name is not allowed.');
  }

  async isUnitMasterPage() {
    await this.page.getByText('unit-master').isVisible();
  }

  async fillCode(code: string) {
    await this.code.fill(code);
  }

  async fillUnitName(unitName: string) {
    await this.unitName.fill(unitName);
  }

  async selectStatusNo(status: string) {console.log(status)
    await this.statusNo.selectOption(status);
  }

  async fillStatusRemarks(statusRemarks: string) {
    await this.statusRemarks.fill(statusRemarks);
  }

  async fillUnitMasterForm(data:any) {
    await this.fillCode(data.code);
    await this.fillUnitName(data.name);
    await this.selectStatusNo(data.status);
    if(data.statusRemarks){
      await this.fillStatusRemarks(data.statusRemarks);
    }
    await this.formLayout.saveData("save");
  }

   async getErrorStates() {
    return {
        codeErrorVisible: await this.codeError.isVisible(),
        nameErrorVisible: await this.unitNameError.isVisible(),
    };
    }

  getRowByCode(code: string) {
    console.log(code,"code")
    return this.page.locator('tr', {
      has: this.page.locator(`td >> text=${code}`)
    });
  }  

  async  verifyFormData( data: any) {
    await expect(this.code).toHaveValue(data.code);
    await expect(this.unitName).toHaveValue(data.name);
    if(data.status){
      await expect(this.statusNo).toHaveValue(data.status);
    }
    if(data.status === '2'){
      await expect(this.statusRemarks).toHaveValue(data.statusRemarks);
    }
  }
  
}
