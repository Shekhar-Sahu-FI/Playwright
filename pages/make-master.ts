import { expect, Page, Locator } from "@playwright/test";
import { FormLayout } from "../utils/form-layout";

export class MakeMaster {
  private readonly page: Page;
  private readonly formLayout: FormLayout;

  private readonly code: Locator;
  private readonly makeName: Locator;
  private readonly statusNo: Locator;
  private readonly statusRemarks: Locator;
  private readonly codeError: Locator;
  private readonly makeNameError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formLayout = new FormLayout(page);

    this.code = page.locator('[name="code"]');
    this.makeName = page.locator('[name="makeName"]');
    this.statusNo = page.locator('select[name="statusNo"]');
    this.statusRemarks = page.locator('[name="statusRemark"]');
    this.codeError = page.getByText("Duplicate code is not allowed.");
    this.makeNameError = page.getByText("Duplicate Make Name is not allowed.");
  }

  async isMakeMasterPage() {
    await this.page.getByText("make-master").isVisible();
  }

  async fillCode(code: string) {
    await this.code.fill(code);
  }

  async fillMakeName(makeName: string) {
    await this.makeName.fill(makeName);
  }

  async selectStatusNo(status: string) {
    await this.statusNo.selectOption(status);
  }

  async fillStatusRemarks(statusRemarks: string) {
    await this.statusRemarks.fill(statusRemarks);
  }

  async fillMakeMasterForm(data:any){
    await this.fillCode(data.code);
    await this.fillMakeName(data.name);
    await this.selectStatusNo(data.status);
     if(data.statusRemarks){
      await this.fillStatusRemarks(data.statusRemarks);
    }
    await this.formLayout.saveData("save");
  }

  async getErrorStates() {
    return {
      codeErrorVisible: await this.codeError.isVisible(),
      nameErrorVisible: await this.makeNameError.isVisible(),
    };
  }

  getRowByCode(code: string) {
    return this.page.locator("tr", {
      has: this.page.locator(`td >> text=${code}`),
    });
  }

  async verifyFormData(data: any) {
    await expect(this.code).toHaveValue(data.code);
    await expect(this.makeName).toHaveValue(data.name);
    if(data.status){
      await expect(this.statusNo).toHaveValue(data.status);
    }
    if(data.status === '2'){
      await expect(this.statusRemarks).toHaveValue(data.statusRemarks);
    }
  }
}
