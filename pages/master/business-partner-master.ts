import { Page, Locator, expect } from '@playwright/test';
import { FormLayout } from '../../utils/form-layout';
import { selectFromAutoSuggestion } from '../../utils/field-utillity';

export class BusinessPartnerMaster {
  private readonly page: Page;
  private readonly formLayout: FormLayout;

  private readonly bpName: Locator;
  private readonly website: Locator;
  private readonly pritingName: Locator;
  private readonly msmeNo: Locator;
  private readonly panNo: Locator;
  private readonly customer: Locator;
  private readonly supplier: Locator;
  private readonly transporter: Locator;
  private readonly addLocationBtn: Locator;
  private readonly addCPBtn: Locator;

  private readonly locationTypeNo: Locator;
  private readonly locationName: Locator;
  private readonly gstRegTypeNo: Locator;
  private readonly gstinNo: Locator;
  private readonly cinNo: Locator;
  private readonly address1: Locator;
  private readonly address2: Locator;
  private readonly address3: Locator;
  private readonly countryNo: Locator;
  private readonly stateName: Locator;
  private readonly cityName: Locator;
  private readonly pincode: Locator;
  private readonly statusNo: Locator;
  private readonly statusRemarks: Locator;
  private readonly confirmation: Locator;

  private readonly contactPersonName: Locator;
  private readonly designation: Locator;
  private readonly contactNo: Locator;
  private readonly emailId: Locator;
  private readonly remarks: Locator;

  private readonly cancelBtn: Locator;
  private readonly okBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formLayout = new FormLayout(page);

    this.bpName = page.locator('[name="bpName"]');
    this.website = page.locator('[name="website"]');
    this.msmeNo = page.locator('[name="msmeNo"]');
    this.pritingName = page.locator('[name="printingName"]');
    this.customer = page.locator('[name="customer"]');
    this.supplier = page.locator('[name="supplier"]');
    this.transporter = page.locator('[name="transporter"]');
    this.addLocationBtn = page.locator('.cursor-pointer.text-gray-8');
    this.addCPBtn = page.locator('.cursor-pointer.text-gray-8');
    this.locationTypeNo = page.locator('[name="locationTypeNo"]');
    this.panNo = page.locator('[name="panNo"]');
    this.statusNo = page.locator('select[name="statusNo"]');
    this.statusRemarks = page.locator('[name="statusRemarks"]');
    this.confirmation = page.getByRole('heading', { name: 'Confirmation' });

    // Location Modal elements
    this.locationName = page.locator('[name="locationName"]');
    this.gstRegTypeNo = page.locator('[name="gstRegTypeNo"]');
    this.gstinNo = page.locator('[name="gstinNo"]');
    this.cinNo = page.locator('[name="cinNo"]');
    this.address1 = page.locator('[name="address1"]');
    this.address2 = page.locator('[name="address2"]');
    this.address3 = page.locator('[name="address3"]');
    this.countryNo = page.locator('[name="countryNo"]');
    this.stateName = page.getByPlaceholder('Select State');
    this.cityName = page.locator('[name="cityName"]');
    this.pincode = page.locator('[name="pincode"]');

    // contact person modal elements
    this.contactPersonName = page.locator('[name="contactPersonName"]');
    this.designation = page.locator('[name="designation"]');
    this.contactNo = page.locator('[name="contactNo"]');
    this.emailId = page.locator('[name="emailId"]');
    this.remarks = page.locator('[name="remarks"]');

    // modal form buttons
    this.cancelBtn = page.getByRole('button', { name: 'Cancel' });
    this.okBtn = page.getByRole('button', { name: 'Ok' });
  }

  async isBPMasterPage() {
    await this.page.getByText('business-partner-master').isVisible();
  }

  // Main form filling functions
  async fillBPName(val: string) {
    await this.bpName.fill(val);
  }
  async fillWebsite(val: string) {
    await this.website.fill(val);
  }
  async fillMsmeNo(val: string) {
    await this.msmeNo.fill(val);
  }
  async fillPrintingName(val: string) {
    await this.pritingName.fill(val);
  }
  async checkCustomer() {
    await this.customer.check({ force: true });
  }
  async checkSupplier() {
    await this.supplier.check({ force: true });
  }
  async checkTransporter() {
    await this.transporter.check({ force: true });
  }
  async clickAddLocation() {
    await this.addLocationBtn.nth(0).click();
    await this.page.waitForTimeout(2500);
  }
  async clickAddCP() {
    await this.addCPBtn.nth(1).click();
    await this.page.waitForTimeout(2500);
  }

  async fillPanNo(val: string) {
    await this.panNo.fill(val);
  }

  // Location modal functions
  async fillLocationName(val: string) {
    await this.locationName.fill(val);
  }

  async selectGstRegType(val: string) {
    await this.gstRegTypeNo.selectOption(val);
  }

  async selectLocationType(val: string) {
    await this.page.locator(`label:has(input[name="locationTypeNo"][value="${val}"])`).click({ force: true });
  }

  async fillGstinNo(val: string) {
    await this.gstinNo.fill(val);
  }
  async fillCinNo(val: string) {
    await this.cinNo.fill(val);
  }
  async fillAddress1(val: string) {
    await this.address1.fill(val);
  }
  async fillAddress2(val: string) {
    await this.address2.fill(val);
  }
  async fillAddress3(val: string) {
    await this.address3.fill(val);
  }
  async selectCountry(val: string) {
    await this.countryNo.selectOption(val);
  }
  async selectState(query: string, val: string) {
    await selectFromAutoSuggestion(this.page, this.stateName, query, val, 0);
  }

  async fillCityName(val: string) {
    await this.cityName.fill(val);
  }
  async fillPincode(val: string) {
    await this.pincode.fill(val);
  }

  // Contact person modal functions
  async fillContactPersonName(val: string) {
    console.log('person name', val);
    await this.contactPersonName.fill(val);
  }
  async fillDesignation(val: string) {
    await this.designation.fill(val);
  }
  async fillContactNo(val: string) {
    await this.contactNo.fill(val);
  }
  async fillEmailId(val: string) {
    await this.emailId.fill(val);
  }
  async fillRemarks(val: string) {
    await this.remarks.fill(val);
  }

  async selectStatusNo(status: string) {
    await this.statusNo.selectOption(status);
  }

  async fillStatusRemarks(statusRemarks: string) {
    await this.statusRemarks.fill(statusRemarks);
  }

  async clickOk() {
    await this.okBtn.click();
  }

  async clickCancel() {
    await this.cancelBtn.click();
  }

  async fillLocationForm(locationDetail: any) {
    for (let data of locationDetail) {
      await this.clickAddLocation();
      await this.fillLocationName(data.locationName);
      await this.selectLocationType(data.locationTypeNo);
      await this.selectGstRegType(data.gstRegTypeNo);
      await this.fillGstinNo(data.gstinNo);
      await this.fillCinNo(data.cinNo);
      await this.fillAddress1(data.address1);
      await this.fillAddress2(data.address2);
      await this.fillAddress3(data.address3);
      await this.selectCountry(data.countryNo);
      await this.selectState(data.stateQuery, data.stateName);
      await this.fillCityName(data.cityName);
      await this.fillPincode(data.pincode);
      await this.clickOk();
    }
  }

  async fillContactPersonForm(contactPersonDetail: any) {
    for (let data of contactPersonDetail) {
      await this.clickAddCP();
      await this.fillContactPersonName(data.name);
      await this.fillDesignation(data.designation);
      await this.fillContactNo(data.contactNo);
      await this.fillEmailId(data.email);
      await this.fillRemarks(data.remarks);
      await this.clickOk();
    }
  }

  async getErrorStates() {
    return {
      // nameErrorVisible: await this.authGroupNameError.isVisible(),
    };
  }

  getRowByCode(code: string) {
    return this.page.locator('tr', {
      has: this.page.locator(`td >> text=${code}`),
    });
  }

  async verifyFormData(data: any) {
    await expect(this.bpName).toHaveValue(data.bpName);
    if (data.status) {
      await expect(this.statusNo).toHaveValue(data.status);
    }
    if (data.status === '2') {
      await expect(this.statusRemarks).toHaveValue(data.statusRemarks);
    }
  }
}
