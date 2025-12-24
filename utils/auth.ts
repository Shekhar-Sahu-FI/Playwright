import { request } from "@playwright/test";

const baseURL = "https://stageapi.arpaerp.com/api";
import { testConfig } from '../test.config';

export const login = async () => {
  const apiContext = await request.newContext();

  console.log(testConfig.email);
  console.log(testConfig.password);
  const response = await apiContext.post(baseURL + "/Auth/login", {
    data: {
      emailId: testConfig.email,
      password: testConfig.password,
    },
  });
  const body = await response.json();
  if (response.status() !== 200) throw new Error("Login failed");
  return body.data.token;
};
