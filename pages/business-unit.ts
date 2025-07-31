import { Page, Locator, expect } from "@playwright/test";
import { FormLayout } from "../utils/form-layout";

export class BusinessUnitMaster {
  private readonly page: Page;
  private readonly formLayout: FormLayout;

  private readonly gstIn: Locator;
  private readonly parentBUCode: Locator;
  private readonly buName: Locator;
  private readonly buCode: Locator;
  private readonly parentBuName: Locator;
  private readonly address1: Locator;
  private readonly address2: Locator;
  private readonly address3: Locator;
  private readonly country: Locator;
  private readonly city: Locator;
  private readonly pin: Locator;
  private readonly status: Locator;
  private readonly state: Locator;
  private readonly statusRemarks: Locator;
  private readonly saveBtn: Locator;
  private readonly confirmation: Locator;
  private readonly userName: Locator;
  private readonly contactNo: Locator;
  private readonly industryType: Locator;
  private readonly portalURL: Locator;
  private readonly addStateBtn: Locator;
  private readonly stateCountry: Locator;
  private readonly stateCode: Locator;
  private readonly stateName: Locator;
  private readonly yesBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formLayout = new FormLayout(page);

    this.gstIn = page.locator('[name="gstinNo"]');
    this.parentBUCode = page.locator('[name="parentBusinessUnitCode"]');
    this.buName = page.locator('[name="businessUnitName"]');
    this.buCode = page.locator('[name="code"]');
    this.parentBuName = page.getByPlaceholder("Select Parent Business Unit");
    this.address1 = page.locator('[name="address1"]');
    this.address2 = page.locator('[name="address2"]');
    this.address3 = page.locator('[name="address3"]');
    this.country = page.locator('[name="countryNo"]');
    this.city = page.locator('[name="cityName"]');
    this.pin = page.locator('[name="pincode"]');
    this.state = page.getByPlaceholder("Select State");
    this.status = page.locator('[name="statusNo"]');
    this.userName = page.locator('[name="userName"]');
    this.contactNo = page.locator('[name="contactNo"]');
    this.industryType = page.locator('[name="industryType"]');
    this.portalURL = page.locator('[name="portalURL"]');
    this.statusRemarks = page.locator('[name="statusRemarks"]');
    this.saveBtn = page.getByRole("button", { name: "Save" });
    this.yesBtn = page.getByRole("button", { name: "Yes" });
    this.addStateBtn = page.locator('[name="addState"]');
    this.confirmation = page.getByRole("heading", {
      level: 2,
      name: "Confirmation",
    });
  }

  async fillBUCode(code: string) {
    await this.buCode.fill(code);
  }
  async fillGSTIn(gstIn: string) {
    await this.gstIn.fill(gstIn);
  }
  async fillBUName(name: string) {
    await this.buName.fill(name);
  }
  async fillParentBU(query: string, parentBU: string) {
    await this.parentBuName.fill(query);
    await this.selectSuggestion(parentBU);
  }
  async fillState(query: string, stateName: string) {
    await this.state.fill(query);
    await this.selectSuggestion(stateName);
  }
  async selectSuggestion(name: string) {
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
  async fillAddress1(address: string) {
    await this.address1.fill(address);
  }
  async fillAddress2(address: string) {
    await this.address2.fill(address);
  }
  async fillAddress3(address: string) {
    await this.address3.fill(address);
  }
  async fillCountry(country: string) {
    await this.country.selectOption(country);
  }
  async fillCity(city: string) {
    await this.city.fill(city);
  }
  async selectStatus(status: string) {
    await this.status.selectOption(status);
  }
  async fillStatusRemarks(statusRemarks: string) {
    await this.statusRemarks.fill(statusRemarks);
  }
  async fillPin(statusRemarks: string) {
    await this.pin.fill(statusRemarks);
  }

  async fillUserName(userName: string) {
    await this.userName.fill(userName);
  }

  async fillContactNo(contactNo: string) {
    await this.contactNo.fill(contactNo);
  }

 
  async selectIndustryType(industryType: string) {
    await this.industryType.selectOption({ label: industryType });
  }
  async fillPortalUrl(portalURL: string) {
    await this.portalURL.fill(portalURL);
  }

  async addState(data: any) {
    await this.addStateBtn.click();
    await expect(
      this.page.locator("h1", { hasText: "State Master" })
    ).toBeVisible();
    await this.page.getByLabel("State Code").fill(data.code);
    await this.page.getByLabel("State Name").fill(data.name);
    await this.page
      .locator("form")
      .filter({ hasText: "State MasterCountry * Select" })
      .getByRole("combobox")
      .selectOption(data.country);
    await this.saveBtn.first().click();
    expect(await this.confirmation.isVisible()).toBeTruthy();
    await this.yesBtn.click();
    await expect(this.page.getByText("Successfully  created.")).toBeVisible();
   
  }

  async fillData(data: any, mode: "save" | "update", mainBU: boolean = false) {
    await this.fillBUCode(data.code);
    await this.fillBUName(data.name);
    if (data.parentBUQuery) {
      await this.fillParentBU(data.parentBUQuery, data.parentBUName);
    }
    await this.fillAddress1(data.address1);
    await this.fillAddress2(data.address2);
    await this.fillAddress3(data.address3);
    await this.fillCountry(data.country);
    await this.fillState(data.stateQuery, data.stateName);
    if(data.status){
      await this.selectStatus(data.status);
    }
    await this.fillPin(data.pin);
    await this.fillCity(data.cityName);
    if (data.gstIn) {
      await this.fillGSTIn(data.gstIn);
    }
    if (mainBU && data.userName) {
      await this.fillUserName(data.userName);
    }
    if (mainBU && data.portalURL) {
      await this.fillPortalUrl(data.portalURL);
    }
    if (mainBU && data.industryType) {
      await this.selectIndustryType(data.industryType);
    }
    if (mainBU && data.contactNo) {
      await this.fillContactNo(data.contactNo);
    }
    if (data.status == "Inactive") {
      await this.fillStatusRemarks(data.statusRemarks);
    }

    await this.saveBtn.click();
    expect(await this.confirmation.isVisible()).toBeTruthy();
    await this.yesBtn.click();
    let message =
      mode === "save" ? "Successfully  created." : "Successfully  updated.";
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async deteleData() {
    await this.page.getByRole("button", { name: "Delete" }).click();
    await expect(
      this.page.getByRole("heading", { level: 2, name: "Confirmation" })
    ).toBeVisible();
    await this.yesBtn.click();
    await expect(this.page.getByText("Deleted")).toBeVisible();
  }

  async verifyFormData(data: any) {
    if (data.gstIn) {
      await expect(this.gstIn).toHaveValue(data.gstIn);
    }
    if (data.code) {
      await expect(this.buCode).toHaveValue(data.code);
    }
    if (data.name) {
      await expect(this.buName).toHaveValue(data.name);
    }
    if (data.parentBUQuery || data.parentBUName) {
      await expect(this.parentBUCode).toHaveValue(data.parentBUQuery);
      await expect(this.parentBuName).toHaveValue(data.parentBUName);
    }
    if (data.address1) {
      await expect(this.address1).toHaveValue(data.address1);
    }
    if (data.address2) {
      await expect(this.address2).toHaveValue(data.address2);
    }
    if (data.address3) {
      await expect(this.address3).toHaveValue(data.address3);
    }
    if (data.country) {
      await expect(this.country).toHaveValue(data.country);
    }
    if (data.stateQuery || data.stateName) {
      await expect(this.state).toHaveValue(data.stateName);
    }
    if (data.city) {
      await expect(this.city).toHaveValue(data.city);
    }
    if (data.pin) {
      await expect(this.pin).toHaveValue(data.pin);
    }
    if (data.status) {
      await expect(this.status).toHaveValue(data.status);
    }
    if (data.status === "2" && data.statusRemarks) {
      await expect(this.statusRemarks).toHaveValue(data.statusRemarks);
    }
  }
}
