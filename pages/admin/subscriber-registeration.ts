import { Page, Locator } from '@playwright/test';

export class SubsrcriberRegistrationPage{

    private readonly page: Page;
    private readonly emailId : Locator;
    private readonly contactPersonName : Locator;
    private readonly password : Locator;
    private readonly registerButton : Locator;
    private readonly successMessage : Locator;
    private readonly errorMessage : Locator;


    constructor( page : Page ){

        this.page  = page; 
        this.emailId = page.locator('[name="emailId"]');
        this.password =   page.locator('[name="password"]');
        this.contactPersonName =  page.locator('[name="contactPersonName"]');
        this.registerButton =  page.getByRole('button', { name: 'Register' });
        this.successMessage = page.getByText(' in successfully');
        this.errorMessage = page.getByRole('heading', { name: 'Error' });

    }

    async isLoginPage (){
        const isVisible = await this.page.getByText('Register').isVisible();
        if(isVisible){  
            return true;
        }
        else{
            return false;
        }
    }

    async clickRegisterButton (){
        try{
            await this.registerButton.click({ force: true })
        }
        catch( error ){
            console.log(`Error Occured while Clicking Login Button : ${error} `);
            throw error;
        }
    }

    async fillPassword (password: string){
        await this.password.fill(password);
    }

    async fillEmail (email: string){
        await this.emailId.fill(email);
    }
    async fillContactPersonName(name: string){
        await this.contactPersonName.fill(name);
    }

    async isSuccessMessageVisible(){
        return await this.successMessage.isVisible() ?? '';
    }

    async getValidationError(){
        return await this.errorMessage.textContent() ?? ''
    }

    async register(email: string,name : string, password:string){
        try{
            await this.fillEmail(email);
            await this.fillContactPersonName(name);
            await this.fillPassword(password);
            await this.registerButton.click()
            await this.successMessage.waitFor({ state: 'visible' })
        }
        catch( error ){
            console.log(`Error Occured while Clicking Login Button : ${error} `);
            throw error;
        }
    }
}

