import { expect, Locator, Page, test } from "@playwright/test";
import { FormLayout } from "./form-layout";
import { checkInputAttributes, testTextBox } from "./inputBox";

export class FormHelper {
  readonly page: Page;
  readonly formLayout: FormLayout;
  readonly masterPage: any;
  readonly saveData: (
    page: Page,
    data: any,
    mode?: "save" | "update" | ""
  ) => Promise<void>;

  constructor(
    page: Page,
    formLayout: FormLayout,
    saveData: (
      page: Page,
      data: any,
      mode?: "save" | "update" | ""
    ) => Promise<void>,
    masterPage
  ) {
    this.page = page;
    this.formLayout = formLayout;
    this.masterPage = masterPage;
    this.saveData = saveData;
  }

  async openNewForm() {
    await test.step("Open new form", async () => {
      await this.formLayout.clickAdd();
      await expect(this.page).toHaveURL(/.*new/);
    });
  }

  getRowByCode(code: string) {
    return this.page.locator("tr", {
      has: this.page.locator(`td >> text=${code}`),
    });
  }

  async saveAndVerify(data : any) {
    await this.openNewForm();
    await this.saveData(this.page, data, "save");
  }

  async updateData( data: any, attributeForGet ) {
    await this.openNewForm();
   
    await this.saveData(this.page, data.firstSave, "save");

    // update
    const row = this.getRowByCode(attributeForGet);
    await row.locator("button").first().click();
    await expect(this.page).toHaveURL(/.*edit/);
    await this.masterPage.verifyFormData(data.firstSave);
    await this.saveData(this.page, data.updateCase, "update");
  }

  async duplicateDataValidation(data:any) {

    await this.openNewForm();

    await this.saveData(this.page, data, "save");

    await test.step("Open new form", async () => {
      await this.formLayout.clickAdd();
      await expect(this.page).toHaveURL(/.*new/);
    });

    await this.saveData(this.page, data);
    await this.formLayout.clickSaveAndYes();
    await expect(
      this.page.getByRole("heading", { name: "Error" })
    ).toBeVisible();
    await this.page.getByRole("button", { name: "OK" }).click();
  }

  async checkValidationError(errors: string[]) {
    await this.formLayout.clickAdd();
    await expect(this.page).toHaveURL(/.*new/);
    await this.masterPage.selectStatusNo("2");
    await this.formLayout.clickSave();
    for (let error of errors) {
      await expect(this.page.getByText(error)).toBeVisible();
    }
  }

  async deleteAndVerify( data: any, attributeForGet ) {
    await this.openNewForm();
    await this.saveData(this.page, data, "save");

    const row = this.getRowByCode(attributeForGet);
    await expect(row).toHaveCount(1);

    await test.step("Open and delete", async () => {
      await row.locator("button").first().click();
      await expect(this.page).toHaveURL(/.*edit/);
      this.masterPage.verifyFormData(data);
      await this.formLayout.deleteData();
    });

    await test.step("Verify deletion", async () => {
      await expect(this.page).toHaveURL(/.*\/.*-master/);
      const checkRow =  this.getRowByCode(data.code);
      await expect(checkRow).toHaveCount(0);
    });
  }

  async checkFields(fieldsList : any){
   
    await this.openNewForm();
    
    // fieldsList.forEach(async (field : any)  => {
    for(const field of fieldsList){
        await checkInputAttributes( this.page, field);
    };
  }
}
