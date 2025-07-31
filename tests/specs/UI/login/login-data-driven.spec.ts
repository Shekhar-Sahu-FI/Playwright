// import { test, expect } from '@playwright/test'
// import { LoginPage } from '../../pages/login'
// import { DataProvider } from '../utils/data-provider';
// import { TestConfig } from '../../test.config'


// const jsonPath = "test-data/login-data.json";
// const jsonTestData : any = DataProvider.getTestDataFromJSON(jsonPath);

// for( const data of jsonTestData){

//     test(`User Login Test : ${data.testName} @data-driven`, async ({page})=>{
//         const config = new TestConfig();
//         console.log(config.appUrl,"@#@#@")
//         await page.goto(config.appUrl);

//         const loginPage = new LoginPage(page);
//         await loginPage.setEmail(data.email);
//         await loginPage.setPassword(data.password);
//         await loginPage.clickLoginButton();
        
//         if(data.expected === 'success'){
//             const successMessage = await loginPage.isSuccessMessageVisible();
//             // expect(successMessage).toBeTruthy();
//             await expect(page).toHaveURL(/.*dashboard/);
//         }
//         else{
//             const errorMessage = await loginPage.getValidationError();
//             expect(errorMessage).toBeTruthy();
//         }
        
//     })
// }