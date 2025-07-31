import { request } from "@playwright/test";

const baseURL = "http://192.168.0.35:5000/api";

export const login = async () => {
  const apiContext = await request.newContext();
  const response = await apiContext.post(baseURL + "/Auth/login", {
    data: {
      emailId: "shekhar.sahu@arpaerp.com",
      password: "QWer12!@",
    },
  });
  const body = await response.json();
  if (response.status() !== 200) throw new Error("Login failed");
  return body.token;
};
