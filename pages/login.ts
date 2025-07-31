import { Page, Locator } from '@playwright/test';

export class LoginPage{

    private readonly page: Page;
    private readonly email : Locator;
    private readonly password : Locator;
    private readonly loginButton : Locator;
    private readonly successMessage : Locator;
    private readonly errorMessage : Locator;


    constructor( page : Page ){

        this.page  = page;
        this.email = page.getByPlaceholder('Email Address');
        this.password =  page.getByPlaceholder('Password');
        this.loginButton =  page.getByRole('button', { name: 'Login' });
        this.successMessage = page.getByText('Logged in successfully');
        this.errorMessage = page.getByRole('heading', { name: 'Error' });

    }

    async isLoginPage (){
        const isVisible = await this.page.getByText('Submit').isVisible();
        if(isVisible){  
            return true;
        }
        else{
            return false;
        }
    }

    async clickLoginButton (){
        try{
            await this.loginButton.click({ force: true })
        }
        catch( error ){
            console.log(`Error Occured while Clicking Login Button : ${error} `);
            throw error;
        }
    }

    async setPassword (password: string){
        await this.password.fill(password);
    }

    async setEmail (email: string){
        await this.email.fill(email);
    }

    async isSuccessMessageVisible(){
        return await this.successMessage.isVisible() ?? '';
    }

    async getValidationError(){
        return await this.errorMessage.textContent() ?? ''
    }

    async login(email: string, password:string){
        try{
            await this.setEmail(email);
            await this.setPassword(password);
            await this.loginButton.click()
            await this.successMessage.waitFor({ state: 'visible' })
        }
        catch( error ){
            console.log(`Error Occured while Clicking Login Button : ${error} `);
            throw error;
        }
    }
}

