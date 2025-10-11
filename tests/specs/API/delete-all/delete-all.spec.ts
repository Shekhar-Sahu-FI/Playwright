import { test, expect } from "@playwright/test";
import { deleteAll, deleteAllWithSearch } from "../../../../utils/apiClients";

test.describe("Delete All", () => {
  test("Delete all Make in Make Master", async () => {
    await deleteAll("/Master/MakeMaster");
  });

  test("Delete all Unit in Unit Master", async () => {
    await deleteAll("/Master/UnitMaster");
  });

  test("Delete all Item Category in Item Category Master", async () => {
    await deleteAll("/Master/ItemCategoryMaster");
  });

  test("Delete all Item Subgroup in Item Subgroup Master", async () => {
    await deleteAll("/Master/ItemSubgroupMaster");
  });

  test("Delete all Business Unit in Business Unit Master", async () => {
    await deleteAll("/Admin/BusinessUnitMaster");
  });

  test("Delete all User in User Master", async () => {
    await deleteAll("/Admin/UserMaster");
  });


  test("Delete all Cost Center Master", async () => {
    await deleteAll("/Master/CostCenterMaster");
  });

  test("Delete all Purchase Request", async () => {
    await deleteAllWithSearch("/Inventory/PurchaseRequest");
  });


  test("Delete all Purchase Order", async () => {
    await deleteAllWithSearch("/Purchase/PurchaseOrder");
  });

});
