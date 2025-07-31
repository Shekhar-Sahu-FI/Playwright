import { Page, Locator, expect } from "@playwright/test";
import { FormLayout } from "../utils/form-layout";

export class DepartmentMaster {
  private readonly page: Page;
  private readonly formLayout: FormLayout;

  private readonly code: Locator;
  private readonly departmentName: Locator;
  private readonly statusNo: Locator;
  private readonly statusRemarks: Locator;
  private readonly confirmation: Locator;
  private readonly codeError: Locator;
  private readonly departmentNameError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formLayout = new FormLayout(page);

    this.code = page.locator('[name="code"]');
    this.departmentName = page.locator('[name="departmentName"]');
    this.statusNo = page.locator('select[name="statusNo"]');
    this.statusRemarks = page.locator('[name="statusRemarks"]');
    this.confirmation = page.getByRole("heading", { name: "Confirmation" });
    this.codeError = page.getByText("Duplicate Code not allowed.");
    this.departmentNameError = page.getByText(
      "Duplicate Department Name not allowed."
    );
  }

  async isDepartmentMasterPage() {
    await this.page.getByText("department-master").isVisible();
  }

  async fillCode(code: string) {
    await this.code.fill(code);
  }

  async fillDepartmentName( departmentName: string ) {
    await this.departmentName.fill(departmentName);
  }

  async selectStatusNo(status: string) {
    await this.statusNo.selectOption(status);
  }

  async fillStatusRemarks(statusRemarks: string) {
    await this.statusRemarks.fill(statusRemarks);
  }

  async fillDepartmentMasterForm(data: any) {
    await this.fillCode(data.code);
    await this.fillDepartmentName(data.name);
    await this.selectStatusNo(data.status);
    await this.selectBusinessUnit(data.businessUnit)
    if(data.statusRemarks){
      await this.fillStatusRemarks(data.statusRemarks);
    }
    await this.formLayout.saveData("save");
  }

  async selectBusinessUnit(children: string[]) {
    // const parentLabel = this.page.locator("label", { hasText: parent });
    // await parentLabel.click();

    for (const child of children) {
      const childLabel = this.page.locator("label", { hasText: child });
      await childLabel.click();
    }
  }

  async checkBusinessUnit(children: string[]){
     for (const child of children) {
      const childLabel = this.page.locator("label", { hasText: child });
      await expect(childLabel).toBeChecked();
    }

  }



  async getErrorStates() {
    return {
      codeErrorVisible: await this.codeError.isVisible(),
      nameErrorVisible: await this.departmentNameError.isVisible(),
    };
  }



  getRowByCode(code: string) {
    return this.page.locator('tr', {
      has: this.page.locator(`td >> text=${code}`)
    });
  }

   async  verifyFormData( data: any) {
  
    await expect(this.code).toHaveValue(data.code);
    await expect(this.departmentName).toHaveValue(data.name);
    if(data.status){
      await expect(this.statusNo).toHaveValue(data.status);
    }
    if(data.status === '2'){
      await expect(this.statusRemarks).toHaveValue(data.statusRemarks);
    }
    await this.checkBusinessUnit(data.businessUnit1);
    await this.checkBusinessUnit(data.businessUnit2);
  }
}
