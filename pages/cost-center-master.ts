import { Page, Locator, expect } from "@playwright/test";
import { FormLayout } from "../utils/form-layout";

export class CostCenterMaster {
  private readonly page: Page;
  private readonly formLayout: FormLayout;

  private readonly code: Locator;
  private readonly costCenterName: Locator;
  private readonly businessUnit: Locator;
  private readonly parentCostCenter: Locator;
  private readonly description: Locator;
  private readonly statusNo: Locator;
  private readonly statusRemarks: Locator;
  private readonly confirmation: Locator;
  private readonly codeError: Locator;
  private readonly costCenterNameError: Locator;
  private readonly departmentNameError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formLayout = new FormLayout(page);

    this.code = page.locator('[name="code"]');
    this.costCenterName = page.locator('[name="costCenterName"]');
    this.businessUnit =  page.getByPlaceholder("Select Business Unit")
    this.parentCostCenter = page.getByPlaceholder('Select Parent Cost Center')
    this.statusNo = page.locator('select[name="statusNo"]');
    this.description = page.getByPlaceholder('Enter Description');
    this.statusRemarks = page.locator('[name="statusRemark"]');
    this.confirmation = page.getByRole("heading", { name: "Confirmation" });
    this.codeError = page.getByText("Duplicate code is not allowed.");
    this.costCenterNameError = page.getByText(
      "Duplicate Cost Center Name is not allowed."
    );
  }

  async isCostCenterMasterPage() {
    await this.page.getByText("cost-center-master").isVisible();
  }

  async fillCode(code: string) {
    await this.code.fill(code);
  }

  async fillDescription( desc: string){
    await this.description.fill(desc);
  }

  async fillCostCenterName(costCenterName: string) {
    await this.costCenterName.fill(costCenterName);
  }

  async fillBusinessUnit(query: string, businessUnit: string) {
    await this.businessUnit.fill(query);
    await this.selectSuggestion(businessUnit);  
  }


//   async selectSuggestion( valueToSelect: string) {
//   for (let i = 0; i < 10; i++) {
//     const currentRow = this.page.locator('table tr.bg-primary-3');
//     const text = await currentRow.innerText();
//     console.log(text);
//     if (text.includes(valueToSelect)) {
//         console.log("inside if")
//       await this.page.keyboard.press('Enter');
//       this.page.waitForTimeout(500)
//       return;
//     }
//     else{
//         console.log("inside else")
//          await this.page.keyboard.press('ArrowDown');
//     }
//   }
//   throw new Error(`Value "${valueToSelect}" not found in suggestions.`);
// }

async fillParentCostCenter(query: string, parentCostCenter: string) {
  await this.parentCostCenter.fill(query);
  await this.selectSuggestion(parentCostCenter); 
 
}
async selectSuggestion(name:string){
  const suggestion = this.page.locator(`td:has-text("${name}")`);
  await expect(suggestion).toBeVisible({ timeout: 5000 });

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

  async selectStatusNo(status: string) {
    await this.statusNo.selectOption(status);
  }

  async fillStatusRemarks(statusRemarks: string) {
    await this.statusRemarks.fill(statusRemarks);
  }

  async fillCostCenterMasterForm( data : any){
    await this.fillCode(data.code);
    await this.fillCostCenterName(data.name);
    await this.fillBusinessUnit(data.businessUnitQuery, data.businessUnitName)
    await this.selectStatusNo(data.status);
     if(data.statusRemarks){
      await this.fillStatusRemarks(data.statusRemarks);
    }
    await this.formLayout.saveData("save");
  }

 
  async getErrorStates() {
    return {
      codeErrorVisible: await this.codeError.isVisible(),
      nameErrorVisible: await this.costCenterNameError.isVisible(),
    };
  }

  getRowByCode(code: string) {
    return this.page.locator('tr', {
      has: this.page.locator(`td >> text=${code}`)
    });
  }


 async  verifyFormData( data: any) {

  await expect(this.code).toHaveValue(data.code);
  await expect(this.costCenterName).toHaveValue(data.name);
  await expect(this.businessUnit).toHaveValue(data.businessUnitName);
  await expect(this.parentCostCenter).toHaveValue(data.parentCostCenterName);
  await expect(this.description).toHaveValue(data.description);
  if(data.status){
    await expect(this.statusNo).toHaveValue(data.status);
  }
  if(data.status === '2'){
    await expect(this.statusRemarks).toHaveValue(data.statusRemarks);
  }
 }  

}
