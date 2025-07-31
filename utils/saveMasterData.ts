import { expect, request } from "@playwright/test";
import { getAndSearch, saveMaster } from "./apiClients";

export const save = async (baseURL, formData, masterNameField) => {
  const response = await saveMaster(`${baseURL}/Save`, formData, true);
  expect(response.status(), "Status code should be 200").toBe(200);
  const body = await response.json();
  expect(body, "Save response should be truthy").toBeTruthy();
  const getRes = await getAndSearch(`${baseURL}/Search`,{code:formData.code});
  return {id: getRes[0].id, code: getRes[0].code, name:getRes[0][masterNameField] };
};

export const createUnit = async (formData) => {
    const res = await save("/Master/UnitMaster",formData,"unitName")
    console.log(res,"Returned Value");
};
