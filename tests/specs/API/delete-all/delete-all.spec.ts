import { test, expect } from "@playwright/test";
import { deleteAll } from "../../../../utils/apiClients";

test.describe("Delete All", () => {
  test("Delete all Make in Make Master", async () => {
    await deleteAll("/Master/MakeMaster");
  });

  test("Delete all Unit in Unit Master", async () => {
    await deleteAll("/Master/UnitMaster");
  });

  test("Delete all Item Category in Item Category Master", async () => {
    await deleteAll("/Master/ItemCategory");
  });

  test("Delete all Business Unit in Business Unit Master", async () => {
    await deleteAll("/Admin/BusinessUnitMaster");
  });
  

  test("Delete all Cost Center Master", async () => {
    await deleteAll("/Master/CostCenterMaster");
  });
});
