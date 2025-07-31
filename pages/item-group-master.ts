import { Page, Locator, expect } from '@playwright/test';
import { FormLayout } from '../utils/form-layout'; 

export class ItemGroupMaster {
  private readonly page: Page;
  private readonly formLayout: FormLayout;

  private readonly code: Locator;
  private readonly groupName: Locator;
  private readonly statusNo: Locator;
  private readonly statusRemarks: Locator;
  private readonly codeError: Locator;
  private readonly groupNameError: Locator;
  private readonly confirmation: Locator;
  private readonly category: Locator;


  constructor(page: Page) {
    this.page = page;
    this.formLayout = new FormLayout(page); 

    this.code = page.locator('[name="itemGroupCode"]');
    this.groupName = page.locator('[name="itemGroupName"]');
    this.category =  page.getByPlaceholder("Ex - Welding Consumables")
    this.statusNo = page.locator('select[name="statusNo"]');
    this.statusRemarks = page.locator('[name="statusRemark"]');
    this.confirmation = page.getByRole('heading', { name: 'Confirmation' });
    this.codeError = page.getByText('Duplicate Code is not allowed');
    this.groupNameError = page.getByText('Duplicate Item Item Group Name is not allowed.');
  }

  async isItemGroupMasterPage() {
    await this.page.getByText('unit-master').isVisible();
  }

  async fillCode(code: string) {
    await this.code.fill(code);
  }

  async fillGroupName(groupName: string) {
    await this.groupName.fill(groupName);
  }

  async selectStatusNo(status: string) {
    await this.statusNo.selectOption(status);
  }

  async fillStatusRemarks(statusRemarks: string) {
    await this.statusRemarks.fill(statusRemarks);
  }

  async fillCategory(query: string, category: string) {
  await this.category.fill(query);
  await this.selectSuggestion(category); 
 
}
async selectSuggestion(name:string){
  const suggestion = this.page.locator(`td:has-text("${name}")`);
  await expect(suggestion).toBeVisible({ timeout: 6000 });

  for (let i = 0; i < 3; i++) {
    try {
      await suggestion.click();
      break;
    } catch (err) {
      if (i === 2) throw err; 
      await this.page.waitForTimeout(500); 
    }
  }
}

  async fillItemGroupMasterForm(data:any) {
    await this.fillCode(data.code);
    await this.fillGroupName(data.name);
    await this.selectStatusNo(data.status);
    await this.fillCategory(data.query, data.category);
    if(data.statusRemarks){
      await this.fillStatusRemarks(data.statusRemarks);
    }
    await this.formLayout.saveData("save");
  }

   async getErrorStates() {
    return {
        codeErrorVisible: await this.codeError.isVisible(),
        nameErrorVisible: await this.groupNameError.isVisible(),
    };
    }

  getRowByCode(code: string) {
    return this.page.locator('tr', {
      has: this.page.locator(`td >> text=${code}`)
    });
  }  

  async  verifyFormData( data: any) {
    await expect(this.code).toHaveValue(data.code);
    await expect(this.groupName).toHaveValue(data.name);
    if(data.status){
      await expect(this.statusNo).toHaveValue(data.status);
    }
    if(data.status === '2'){
      await expect(this.statusRemarks).toHaveValue(data.statusRemarks);
    }
  }
  
}
