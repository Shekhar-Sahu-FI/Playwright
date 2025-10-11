import { test, expect, request } from '@playwright/test';
import { login } from './auth';
import { strictEqual } from 'assert';
import { json } from 'stream/consumers';

const baseURL = 'http://192.168.0.35:5555/api';

const createContext = async () => {
  const token = await login();
  return request.newContext({
    extraHTTPHeaders: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const saveMaster = async (endpoint: string, data: any, isSave = true) => {
  const context = await createContext();
  const method = isSave ? 'post' : 'put';
  console.log('payLoadData', data);
  const response = await context[method](baseURL + endpoint, { data });
  console.log('API Response', await response.json());
  return response;
};

export const getAll = async (endpoint: string) => {
  const context = await createContext();
  const response = await context.get(baseURL + endpoint);
  console.log("response", response)
  return await response.json();
};

export const getById = async (endpoint: string, id: string | number) => {
  const context = await createContext();
  const response = await context.get(`${baseURL + endpoint}/${id}`);
  return await response.json();
};

export const deleteById = async (endpoint: string, id: string | number) => {
  const context = await createContext();
  const response = await context.put(`${baseURL + endpoint}/${id}`);
  console.log(await response.json());
  return await response.json();
};

export const getAndSearch = async (endpoint: string, data) => {
  const context = await createContext();
  const response = await context.post(`${baseURL + endpoint}`, { data });
  console.log(response);
  return await response.json();
};

export const findCreatedData = async (url: string, code: string) => {
  const all = await getAll(`${url}/GetAll`);
  return all.find((item) => item.code === code);
};

export const getByIdAndValidate = async (
  baseURL: string,
  validateResponse,
  formData,
  searchQuery
) => {
  const saveRes = await saveMaster(`${baseURL}/Save`, formData, true);
  expect(saveRes.status(), 'Status code should be 200').toBe(200);

  const getRes = await getAndSearch(`${baseURL}/Get`, searchQuery);
  console.log(getRes, 'by get');
  const byId = await getById(`${baseURL}/GetById`, getRes[0].id);
  console.log(byId, 'by get  id');
  validateResponse(formData, byId);
};

export const duplicateCheck = async (baseURL: string, errorsList, testData) => {
  // const saveRes = await saveMaster(`${baseURL}/Save`, testData, true);
  // expect(saveRes.status(), "Status code should be 200").toBe(200);

  const duplicateRes = await saveMaster(`${baseURL}/Save`, testData, true);
  const body = await duplicateRes.json();

  for (const [field, message] of Object.entries(errorsList)) {
    console.log(field, message, body.validationErrors);
    const isError = body.validationErrors.find(
      (e) => e.PropertyName == field && e.ErrorMessage == message
    );
    console.log(isError, 'errorss');
    expect(isError, `Expected validation error for ${field}`).toBeTruthy();
  }
};

export const saveAndUpdate = async (saveData, updateData, baseURL, searchQuery) => {
  const saveRes = await saveMaster(`${baseURL}/Save`, saveData, true);
  expect(saveRes.status(), 'Status code should be 200').toBe(200);

  const getRes = await getAndSearch(`${baseURL}/Search`, searchQuery);
  console.log(getRes);
  const updatedData = {
    ...updateData,
    id: getRes[0].id,
  };

  const updateRes = await saveMaster(`${baseURL}/Update`, updatedData, false);
  expect(updateRes.status(), 'Status code should be 200').toBe(200);

  const body = await updateRes.json();
  expect(body, 'Response Body should be true').toBeTruthy();
};

export const saveAndDelete = async (baseURL, saveData, searchData) => {
  const saveRes = await saveMaster(`${baseURL}/Save`, saveData, true);
  expect(saveRes.status(), 'Status code should be 200').toBe(200);
  const getRes = await getAndSearch(`${baseURL}/Search`, searchData);
  const delRes = await deleteById(`${baseURL}/Delete`, getRes[0].id);
  expect(typeof delRes, 'Response Body should be boolean').toBe('boolean');
  expect(delRes, 'Response Body should be true').toBeTruthy();
};

export const saveAndGet = async (baseURL, formData, query, varifyGetRes) => {
  const saveRes = await saveMaster(`${baseURL}/Save`, formData, true);
  expect(saveRes.status(), 'Status code should be 200').toBe(200);

  // console.log(query,"<====================Query")
  // const value = Object.values(query)[0];
  // const key = Object.keys(query)[0];
  // for (let i = 2; i < String(value)?.length; i++) {
  //   console.log({
  //     [key]: String(value).slice(0, i),
  //   },"formatred")
  //   const getRes = await getAndSearch(`${baseURL}/Get`, {
  //     [key]: String(value).slice(0, i),
  //   });
  //   console.log(getRes, "get Response");
  //   return varifyGetRes(formData, getRes[0]);
  // }

  // Previous working file
  const getRes = await getAndSearch(`${baseURL}/Get`, query);
  console.log(getRes, 'get Response');
  return varifyGetRes(formData, getRes[0]);
};

export const saveAndSearch = async (baseURL, formData, searchQyery, varifyGetRes) => {
  const saveRes = await saveMaster(`${baseURL}/Save`, formData, true);
  expect(saveRes.status(), 'Status code should be 200').toBe(200);

  const searchRes = await getAndSearch(`${baseURL}/Search`, searchQyery);
  console.log('Search response ==>', searchRes);
  return varifyGetRes(formData, searchRes[0]);
};

export const getByIdWithGetAll = async (baseURL, formData, validateResponse) => {
  const saveRes = await saveMaster(`${baseURL}/Save`, formData, true);
  expect(saveRes.status(), 'Status code should be 200').toBe(200);

  const getAllRes = await getAll(`${baseURL}/GetAll`);
  console.log(getAllRes[0]);

  const savedData = getAllRes.find((ele) => {
    return ele.code == formData.code;
  });

  const getByIdRes = await getById(`${baseURL}/GetById`, savedData.id);
  validateResponse(formData, getByIdRes);
};

export const deleteSavedData = async (testData, baseURL) => {
  const getAllRes = await getAll(`${baseURL}/GetAll`);

  const savedData = getAllRes.find((ele) => {
    return ele.code == testData.code;
  });
  const deleteRes = await deleteById(`${baseURL}/Delete`, savedData.id);
  expect(deleteRes, 'Successfully Deleted').toBeTruthy();
};

export const save = (testData, baseURL) => {
  testData.forEach((data) => {
    test(`${data.description}`, async () => {
      const response = await saveMaster(`${baseURL}/Save`, data.save, true);
      const body = await response.json();
      expect(typeof body).toBe('boolean');
      expect(body).toBeTruthy();
    });
  });
};

export const checkValidation = async (testData, baseURL, endpoint) => {
  testData.forEach((data, index) => {
    test(` ${index} ${data?.description}`, async () => {
      const response = await saveMaster(`${baseURL}/${endpoint}`, data.save, true);
      const body = await response.json();
      const expectedErrors = body.validationErrors;
      let exists = false;
      for (const expected of data.validationError) {
        exists = expectedErrors.some(
          (err) =>
            err.PropertyName === expected.PropertyName && err.ErrorMessage === expected.ErrorMessage
        );
        expect(
          exists,
          `Validation error for ${expected.PropertyName} should be present`
        ).toBeTruthy();
      }
    });
  });
};

export const deleteAll = async (endpoint: string) => {
  const data = await getAll(`${endpoint}/GetAll`);

  const context = await createContext();

  for (let i = 0; i < data.length; i++) {
    console.log(`${baseURL}${endpoint}/Delete/${data[i].id}`);

    const response = await context.put(`${baseURL}${endpoint}/Delete/${data[i].id}`);
    // console.log(response, 'response');
    console.log(await response.json());
  }
};


const search = async (endpoint: string) => {
  const context = await createContext();

  const emptyObj = {};
  const response = await context.post(`${baseURL + endpoint}`, { data: {} });
  return await response.json();
}

export const deleteAllWithSearch = async (endpoint: string) => {
  const data = await search(`${endpoint}/Search`);

  const context = await createContext();

  for (let i = 0; i < data.length; i++) {
    console.log(`${baseURL}${endpoint}/Delete/${data[i].id}`);

    const response = await context.put(`${baseURL}${endpoint}/Delete/${data[i].id}`);
    // console.log(response, 'response');
    console.log(await response.json());
  }
};
