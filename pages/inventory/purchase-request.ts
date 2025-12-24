import { Page, Locator, expect } from '@playwright/test';
import { FormLayout } from '../../utils/form-layout';
import { selectDate } from '../../utils/field-utillity';

export class PurchaseRequest {
  readonly page: Page;
  readonly formLayout: FormLayout;
  readonly docDate: Locator;
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


  constructor(page: Page) {
    this.page = page;
    this.formLayout = new FormLayout(page);

    this.docDate = page.locator('input[label="Document Date"]');
    this.docNo = page.locator('input[label="Document No."]');
    this.docSeriesButton = page.locator('button[title="DocumentSerialButton"]');
    this.docSeriesType = page.locator('button[title="Activate"]');


    this.docStatus = page.getByLabel('Document Status');
    this.warehouseName = page.locator('#warehouseId');
    this.indentType = page.getByLabel('Indent Type');
    this.departmentName = page.locator('#departmentId');
    this.requestedBy = page.getByLabel('Requested By');
    this.referenceNo = page.getByLabel('Reference No.');
    this.referenceDate = page.getByLabel('Reference Date');
    this.remarks = page.getByLabel('Remarks');
  }

  async selectDocDate(date: string) {
    await selectDate(this.page, "Document Date", date);
  }

  async fillDocNo(docNo: string) {
    await this.docSeriesButton.click();
    console.log("this is manual and auto")
    await this.docSeriesType.click();
    await this.page.locator('text=Document Series').waitFor({ state: 'visible' });
    await this.page.getByRole('button', { name: 'OK' }).click();
    await this.docNo.fill(docNo);
  }

  async selectRefDate(date: string) {
    await selectDate(this.page, "Reference Date", date);
  }


  async selectItem(index: number, itemName: string) {
    const itemCell = this.page.locator(`td[data-cell-id="cell-${index}-itemName"] input`);
    await itemCell.type(itemName);
  }

  async selectMake(index: number, makeName: string) {
    const makeCell = this.page.locator(`td[data-cell-id="cell-${index}-makeName"] input`);
    await makeCell.type(makeName);
  }

  async selectUnit(index: number, unitName: string) {
    const unitCell = this.page.locator(`td[data-cell-id="cell-${index}-unitName"] input`);
    await unitCell.type(unitName);
  }

  async fillTechSpec(index: number, techSpec: string) {
    const techSpecCell = this.page.locator(`td[data-cell-id="cell-${index}-technicalSpecification"] button`);
    await techSpecCell.click();
    const techSpecTextarea = this.page.getByPlaceholder('Enter Tech. Specification');
    const saveTechSpecButton = this.page.locator('button').nth(0);
    const cancelTechSpecButton = this.page.locator('button').nth(1);

    await techSpecTextarea.fill(techSpec);
    await saveTechSpecButton.click();
  }

  async selectRequiredQty(index: number, requiredQty: string) {
    const requiredQtyCell = this.page.locator(`td[data-cell-id="cell-${index}-rate"] input`);
    await requiredQtyCell.type(requiredQty);
  }

  async selectprQty(index: number, prQty: string) {
    const prQtyCell = this.page.locator(`td[data-cell-id="cell-${index}-prQty"] input`);
    await prQtyCell.type(prQty);
  }

  async selectRate(index: number, rate: string) {
    const rateCell = this.page.locator(`td[data-cell-id="cell-${index}-rate"] input`);
    await rateCell.type(rate);
  }

  async selectScheduleDate(index: number, date: string) {
    const scheduleDateCell = this.page.locator(`td[data-cell-id="cell-${index}-scheduleDate"] input`);
    await scheduleDateCell.type(date);
  }

  async fillItemRemarks(index: number, remarks: string) {
    const remarksCell = this.page.locator(`td[data-cell-id="cell-${index}-technicalSpecification"] button`);
    await remarksCell.click();
    const remrksTextarea = this.page.getByPlaceholder('Enter Tech. Specification');
    const saveRemarksButton = this.page.locator('button').nth(0);
    const cancelRemarksButton = this.page.locator('button').nth(1);

    await remrksTextarea.fill(remarks);
    await saveRemarksButton.click();
  }



}
