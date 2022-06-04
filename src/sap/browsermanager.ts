import puppeteer from 'puppeteer';

export default class BrowserManager {
    static instance: BrowserManager = new BrowserManager();
    private browser: puppeteer.Browser = null;

    constructor() { }

    async getBrowser(): Promise<puppeteer.Browser> {
        if (!this.browser) {
            console.log('[INFO] 🍁 browser loaded');
            this.browser = await puppeteer.launch({ args: ["--no-sandbox"] });
        }

        return this.browser;
    }

    close() {
        this.browser.close();
    }
}
