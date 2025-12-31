import { Page, Locator, expect } from '@playwright/test';
import { FormLayout } from '../../utils/form-layout';
import { selectDate, selectFromAutoSuggestion } from '../../utils/field-utillity';

export class PurchaseRequest {
  readonly page: Page;
  readonly formLayout: FormLayout;
  readonly docDateInput: Locator;
  readonly refDateInput: Locator;
  readonly docNo: Locator;
  readonly docSeriesButton: Locator;
  readonly docSeriesType: Locator;
  readonly docStatus: Locator;
  readonly warehouseName: Locator;
  readonly indentType: Locator;
  readonly departmentName: Locator;
  readonly requestedBy: Locator;
  readonly referenceNo: Locator;
  readonly referenceDate: Locator;
  readonly remarks: Locator;
  readonly OKButton: Locator;


  constructor(page: Page) {
    this.page = page;
    this.formLayout = new FormLayout(page);

    this.docDateInput = page.locator('input[label="Document Date"]');
    this.docNo = page.locator('input[label="Document No."]');
    this.docSeriesButton = page.locator('button[title="DocumentSerialButton"]');
    this.docSeriesType = page.locator('button[title="Activate"]');
    this.refDateInput = this.page.locator('input[label="Reference Date"]');

    this.docStatus = page.getByLabel('Document Status');
    this.warehouseName = page.locator('#warehouseId');
    this.indentType = page.getByLabel('Indent Type');
    this.departmentName = page.locator('#departmentId');
    this.requestedBy = page.getByLabel('Requested By');
    this.referenceNo = page.getByLabel('Reference No.');
    this.referenceDate = page.getByLabel('Reference Date');
    this.remarks = page.getByLabel('Remarks');

    this.OKButton = this.page.getByRole('button', { name: 'OK' });
  }

  async selectDocDate(date: string) {
    await selectDate(this.page, this.docDateInput, date);
  }

  async fillDocNo(docNo: string) {
    await this.docSeriesButton.click();
    await this.docSeriesType.click();
    await this.page.locator('text=Document Series').waitFor({ state: 'visible' });
    await this.OKButton.click();
    await this.docNo.fill(docNo);
  }

  async selectRefDate(date: string) {
    await selectDate(this.page, this.refDateInput, date);
  }
  async selectDocumnetStatus(status: string) {

    const docStatus = this.page.locator(
      'div.flex.flex-col:has(label:has-text("Document Status")) select'
    );

    await docStatus.selectOption({ value: status });
    this.page.waitForTimeout(2000);
  }


  async selectItem(index: number, itemName: string) {
    const itemCell = this.page.locator(`td[data-cell-id="cell-${index}-itemName"] input`);
    await itemCell.waitFor({ state: 'visible' });
    await itemCell.scrollIntoViewIfNeeded();
    await itemCell.click({ force: true });
    await selectFromAutoSuggestion(this.page, itemCell, itemName, itemName);
  }

  async selectMake(index: number, makeName: string) {
    const makeCell = this.page.locator(`td[data-cell-id="cell-${index}-makeName"] input`);
    await makeCell.waitFor({ state: 'visible' });
    await makeCell.scrollIntoViewIfNeeded();
    await makeCell.click({ force: true });
    await selectFromAutoSuggestion(this.page, makeCell, makeName, makeName);
  }

  async selectUnit(index: number, unitName: string) {
    const unitCell = this.page.locator(`td[data-cell-id="cell-${index}-unitName"] input`);
    await unitCell.waitFor({ state: 'visible' });
    await unitCell.scrollIntoViewIfNeeded();
    await unitCell.click({ force: true });
    await selectFromAutoSuggestion(this.page, unitCell, unitName, unitName);
  }

  async fillTechSpec(index: number, techSpec: string) {
    const techSpecCell = this.page.locator(
      'td[data-cell-id="cell-0-techSpecification"]'
    );

    const editButton = techSpecCell.locator('button');
    await editButton.click({ force: true });
    const techSpecTextarea = this.page.getByPlaceholder('Enter Tech. Specification');
    const saveTechSpecButton = this.page.locator('button').nth(0);
    const cancelTechSpecButton = this.page.locator('button').nth(1);

    await techSpecTextarea.fill(techSpec);
    await saveTechSpecButton.click();
  }

  async fillRequiredQty(index: number, requiredQty: string) {
    const requiredQtyCell = this.page.locator(`td[data-cell-id="cell-${index}-requiredQty"] input`);
    await requiredQtyCell.type(requiredQty);
  }

  async fillPRQty(index: number, prQty: string) {
    const prQtyCell = this.page.locator(`td[data-cell-id="cell-${index}-prQty"] input`);
    await prQtyCell.type(prQty);
  }

  async fillRate(index: number, rate: string) {
    const rateCell = this.page.locator(`td[data-cell-id="cell-${index}-rate"] input`);
    await rateCell.type(rate);
  }


  async selectScheduleDate(index: number, date: string, scheduleQty: string) {
    const scheduleCell = this.page.locator(`td[data-cell-id="cell-${index}-schedule"] button`);
    await scheduleCell.click();
    await expect(this.page.getByText('Item Schedule')).toBeVisible();
    const scheduleDateInput = this.page.locator(`td[data-cell-id="cell-${index}-scheduleDate"] input`);
    await selectDate(this.page, scheduleDateInput, date);

    const scheduleQtyInput = this.page.locator(`td[data-cell-id="cell-${index}-qty"] input`);
    await scheduleQtyInput.clear();
    await scheduleQtyInput.type(scheduleQty);
    await this.OKButton.click();
  }

  async selectCostCenter(index: number, costCenterName: string) {
    const costCenterCell = this.page.locator(`td[data-cell-id="cell-${index}-costCenterName"] input`);
    await costCenterCell.waitFor({ state: 'visible' });
    await costCenterCell.scrollIntoViewIfNeeded();
    await costCenterCell.click({ force: true });
    await selectFromAutoSuggestion(this.page, costCenterCell, costCenterName, costCenterName);
  }

  async fillItemRemarks(index: number, remarks: string) {
    const remarksCell = this.page.locator(
      `td[data-cell-id="cell-${index}-remarks"]`
    );
    const editButton = remarksCell.locator('button');
    await editButton.click({ force: true });
    const remrksTextarea = this.page.getByPlaceholder('Enter Remark');
    const saveRemarksButton = this.page.locator('button').nth(0);
    const cancelRemarksButton = this.page.locator('button').nth(1);

    await remrksTextarea.fill(remarks);
    await saveRemarksButton.click();
  }

  async fillPersonName(index: number, personName: string) {
    const personNameCell = this.page.locator(`td[data-cell-id="cell-${index}-personName"] input`);
    await personNameCell.type(personName);
  }

  async fillEmail(index: number, email: string) {
    const emailCell = this.page.locator(`td[data-cell-id="cell-${index}-emailId"] input`);
    await emailCell.type(email);
  }

  async fillWhatsAppNo(index: number, whatsappNo: string) {
    const whatsappNoCell = this.page.locator(`td[data-cell-id="cell-${index}-whatsAppNo"] input`);
    await whatsappNoCell.type(whatsappNo);
  }

  async fillSchedule() {
    await this.page.waitForTimeout(5000);
    await this.selectDocDate("2025-02-06")
    await this.selectDocumnetStatus("30");
  }



}
