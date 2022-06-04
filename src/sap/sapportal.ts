import puppeteer from "puppeteer";
import BrowserManager from "./browsermanager";
import { Attendance, Session, Student, StudentAttendace, Year } from "./types";

const SAP_PORTAL_URL = "https://kiitportal.kiituniversity.net/irj/portal/";
const MAIN_FRAME_SELECTOR = "#ivuFrm_page0ivu4";
const INNER_FRAME_SELECTOR = "#isolatedWorkArea";
const STUD_NAME_SELECTOR = "#WD2E";
const STUD_SCHOOL_SELECTOR = "#WD22";
const STUD_PROGRAM_SELECTOR = "#WD3A";
const STUD_SEMESTER_SELECTOR = "#WD3F";
const STUD_ROLL_SELECTOR = "#WD29";
const STUD_REG_SELECTOR = "#WD35";
const STUD_IMG_SELECTOR = "#WD4F";

async function getMainFrame(page: puppeteer.Page): Promise<puppeteer.Frame> {
    console.log("[INFO] getting main iframe to load");
    await page.waitForSelector(MAIN_FRAME_SELECTOR);
    const el_mainFrame = await page.$(MAIN_FRAME_SELECTOR);
    const mainFrame = await el_mainFrame.contentFrame();
    return mainFrame;
}

async function getInnerFrame(mainFrame: puppeteer.Frame): Promise<puppeteer.Frame> {
    console.log("[INFO] Waiting for inner iframe to load");
    await mainFrame.waitForSelector("#isolatedWorkArea");
    const el_innerFrame = await mainFrame.$(INNER_FRAME_SELECTOR);
    const innerFrame = await el_innerFrame.contentFrame();
    return innerFrame;
}

async function navigateTo(mainFrame: puppeteer.Frame, to: string) {
    console.log(`[INFO] Navigating to '${to}' page`);
    await mainFrame.waitForSelector(`.urLnkDragRelate[title='${to}']`)
    await mainFrame.click(`.urLnkDragRelate[title='${to}']`);
}

async function getText(frame: puppeteer.Frame, selector: string): Promise<string> {
    return await (await frame.$(selector)).evaluate(el => el.textContent);
}

async function extractStudentDetails(innerFrame: puppeteer.Frame): Promise<Student> {

    console.log('[INFO] extracting student details');

    // wait for the information to load
    await innerFrame.waitForSelector(STUD_NAME_SELECTOR);
    await innerFrame.waitForSelector(STUD_SCHOOL_SELECTOR);
    await innerFrame.waitForSelector(STUD_PROGRAM_SELECTOR);
    await innerFrame.waitForSelector(STUD_SEMESTER_SELECTOR);
    await innerFrame.waitForSelector(STUD_ROLL_SELECTOR);
    await innerFrame.waitForSelector(STUD_REG_SELECTOR);
    await innerFrame.waitForSelector(STUD_IMG_SELECTOR);

    // extract the information
    const name = await getText(innerFrame, STUD_NAME_SELECTOR);
    const school = await getText(innerFrame, STUD_SCHOOL_SELECTOR);
    const program = await getText(innerFrame, STUD_PROGRAM_SELECTOR);
    const semester = await getText(innerFrame, STUD_SEMESTER_SELECTOR);
    const rollno = await getText(innerFrame, STUD_ROLL_SELECTOR);
    const regno = await getText(innerFrame, STUD_REG_SELECTOR);
    const img = await (await innerFrame.$(STUD_IMG_SELECTOR)).evaluate(el => el.getAttribute('src'));
    return { name, school, program, semester, rollno, regno, img };
}

async function loadAttendanceReport(innerFrame: puppeteer.Frame, academic_year: Year, session: Session) {
    const YEAR_DROPDOWN_BTN_SELECTOR = "#WD5C-btn";
    const SESSION_DROPDOWN_BTN_SELECTOR = "#WD74-btn";
    const SUBMIT_BTN_SELECTOR = "#WD81";

    await innerFrame.waitForSelector(YEAR_DROPDOWN_BTN_SELECTOR);
    await innerFrame.waitForSelector(SESSION_DROPDOWN_BTN_SELECTOR);
    await innerFrame.waitForSelector(SUBMIT_BTN_SELECTOR);

    // select the year
    await innerFrame.click(YEAR_DROPDOWN_BTN_SELECTOR);
    await innerFrame.waitForSelector(academic_year.toString());
    await innerFrame.click(academic_year.toString());

    // select the session
    await innerFrame.click(SESSION_DROPDOWN_BTN_SELECTOR);
    await innerFrame.waitForSelector(session.toString());
    await innerFrame.click(session.toString());

    // click the submit button
    await innerFrame.click(SUBMIT_BTN_SELECTOR);
}

function mapToAttendance(details: any[]): Attendance {
    if (details.length != 10) return null;

    return {
        subject: details[1],
        presents: Number.parseInt(details[2]),
        absents: Number.parseInt(details[3]),
        excuses: Number.parseInt(details[4]),
        totalClasses: Number.parseInt(details[5]),
        percentage: Number.parseFloat(details[6]),
        facultyCode: details[7],
        facultyName: details[8],
        percentageWithExcuses: Number.parseFloat(details[9])
    };
}

export async function login(
    username: string,
    password: string
): Promise<[puppeteer.Page, puppeteer.BrowserContext]> {
    const browser = await BrowserManager.instance.getBrowser();
    const context = await browser.createIncognitoBrowserContext();

    console.log("[INFO] opening new page");
    const page = await context.newPage();

    console.log(`[INFO] navigating to ${SAP_PORTAL_URL}`);
    await page.goto(SAP_PORTAL_URL);

    console.log(`[INFO] entering login details`);
    // wait for the input fields to appear then enter the details
    await page.waitForSelector("#logonuidfield");
    await page.type("#logonuidfield", username);
    await page.type("#logonpassfield", password);
    // press the login button
    await page.click("input[name='uidPasswordLogon']");
    return [page, context];
}

export async function getStudentAttendanceDetails(
    page: puppeteer.Page,
    academic_year: Year,
    session: Session): Promise<StudentAttendace> {

    const mainFrame = await getMainFrame(page);
    await navigateTo(mainFrame, "Student Attendance Details");
    const innerFrame = await getInnerFrame(mainFrame);
    const student: Student = await extractStudentDetails(innerFrame);

    await loadAttendanceReport(innerFrame, academic_year, session);

    console.log("[INFO] extracting attendance details");

    const attendances: Attendance[] = [];

    try {
        // if a row element tr as the attribute rr='0' it means 
        // the data is not loaded yet or there's no data
        // if there's no data it will timeout
        await innerFrame.waitForSelector("#WD84 tr[rr]:not([rr='0'])");

        // get the table rows
        const subjectRows = await innerFrame.$$("#WD84 tr[rr]:not([rr='0'])");

        console.log(`[INFO] Found ${subjectRows.length} subjects`);

        // extract details of each subject
        for (const subject of subjectRows) {
            const cells = await subject.$$("td");

            const attendanceDetails = [];

            for (const cell of cells) {
                const value = await cell.evaluate(el => el.textContent);
                attendanceDetails.push(value);
            }

            attendances.push(mapToAttendance(attendanceDetails));
        }
    } catch (e) {
        console.warn("[WARN] No attendance details found");
    }

    return { student, attendances };
}