import { Page, Locator, expect } from '@playwright/test';
import { FormLayout } from '../utils/form-layout'; 

export class UserMaster {
  private readonly page: Page;
  private readonly formLayout: FormLayout;

  private readonly code: Locator;
  private readonly userType: Locator;
  private readonly userName: Locator;
  private readonly userProfileId: Locator;
  private readonly emailId: Locator;
  private readonly contactNo: Locator;
  private readonly employeeId: Locator;
  private readonly designation: Locator;
  private readonly department: Locator;
  private readonly reportingManagerName: Locator;
  private readonly statusNo: Locator;
  private readonly statusRemarks: Locator;
  private readonly userProfileIdError: Locator;
  private readonly emailIdError: Locator;
  private readonly employeeIdError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formLayout = new FormLayout(page); 

    this.code = page.locator('[name="code"]');
    this.userType = page.locator('[name="userTypeNo"]');
    this.userName = page.locator('[name="userName"]');
    this.userProfileId = page.locator('[name="userProfileId"]');
    this.emailId = page.locator('[name="emailId"]');
    this.contactNo = page.locator('[name="contactNo"]');
    this.employeeId = page.locator('[name="employeeId"]');
    this.designation = page.locator('[name="designation"]');
    this.reportingManagerName = page.locator('[name="reportingManagerName"]');
    this.employeeId = page.locator('[name="employeeId"]');
    this.statusNo = page.locator('select[name="statusNo"]');
    this.statusRemarks = page.locator('[name="statusRemark"]');
    this.userProfileIdError = page.getByText('Duplicate User Profile Id is not allowed.');
    this.emailIdError = page.getByText('Duplicate Email Id is not allowed.');
    this.employeeIdError = page.getByText('Duplicate Employee Id is not allowed.');
  }

  async isUserMasterPage() {
    await this.page.getByText('user-master').isVisible();
  }

  async fillCode(code: string) {
    await this.code.fill(code);
  }

  async fillUserName(userName: string) {
    await this.userName.fill(userName);
  }

  async fillUserType(userType: string) {
    await this.userType.selectOption(userType);
  }

  async fillUserProfileId(userProfileId: string) {
    await this.userProfileId.fill(userProfileId);
  }

  async fillEmailId(emailId: string) {
    await this.emailId.fill(emailId);
  }

  async fillContactNo(contactNo: string) {
    await this.contactNo.fill(contactNo);
  }
  
  async fillEmployeeId(employeeId: string) {
    await this.employeeId.fill(employeeId);
  }

  async fillDepartment(query: string, department: string) {
    await this.department.fill(query);
    await this.selectSuggestion(department);  
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
  
  async fillDesignation(contactNo: string) {
    await this.designation.fill(contactNo);
  }

  async fillReportingManagerName(reportingManagerName: string) {
    await this.reportingManagerName.fill(reportingManagerName);
  }

  async selectStatusNo(status: string) {
    await this.statusNo.selectOption(status);
  }

  async fillStatusRemarks(statusRemarks: string) {
    await this.statusRemarks.fill(statusRemarks);
  }

  async fillUserMasterForm(data:any) {

    await this.fillUserName(data.name);
    await this.fillUserProfileId(data.userProfileId);
    await this.fillEmailId(data.emailId);
    await this.fillUserType(data.userType)
     if(data.contactNo){
      await this.contactNo.fill(data.contactNo);
    }
    if(data.employeeId){
      await this.employeeId.fill(data.employeeId);
    }
    if(data.designation){
      await this.designation.fill(data.designation);
    }
    if(data.reportingManagerName){
      await this.reportingManagerName.fill(data.reportingManagerName);
    }
    if(data.status === '2'){
      await expect(this.statusRemarks).toHaveValue(data.statusRemarks);
    }
    if(data.businessUnit1){
        await this.checkBusinessUnit(data.businessUnit1)
    }
    await this.selectStatusNo(data.status);
    
    if(data.statusRemarks){
      await this.fillStatusRemarks(data.statusRemarks);
    }
    await this.formLayout.saveData("save");
  }

  async selectBusinessUnit(children: string[]) {

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
        userProfileIdError: await this.userProfileIdError.isVisible(),
        emailIdError: await this.emailIdError.isVisible(),
        employeeIdError : await this.employeeIdError.isVisible()
    };
    }

  getRowByCode(code: string) {
    console.log(code,"code")
    return this.page.locator('tr', {
      has: this.page.locator(`td >> text=${code}`)
    });
  }  

  async  verifyFormData( data: any) {

    await expect(this.userName).toHaveValue(data.name);
    await expect(this.userProfileId).toHaveValue(data.userProfileId);
    await expect(this.emailId).toHaveValue(data.emailId);
    await expect(this.userType).toHaveValue(data.userType);
    if(data.status){
      await expect(this.statusNo).toHaveValue(data.status);
    }
    if(data.contactNo){
      await expect(this.contactNo).toHaveValue(data.contactNo);
    }
    if(data.employeeId){
      await expect(this.employeeId).toHaveValue(data.employeeId);
    }
    if(data.designation){
      await expect(this.designation).toHaveValue(data.designation);
    }
    if(data.reportingManagerName){
      await expect(this.reportingManagerName).toHaveValue(data.reportingManagerName);
    }
    if(data.status === '2'){
      await expect(this.statusRemarks).toHaveValue(data.statusRemarks);
    }
    if(data.businessUnit1){
        await this.checkBusinessUnit(data.businessUnit1)
    }
    if(data.businessUnit2){
        await this.checkBusinessUnit(data.businessUnit2)
    }
  }
  
}
