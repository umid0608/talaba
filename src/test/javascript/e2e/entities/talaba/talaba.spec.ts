import { browser, ExpectedConditions as ec /* , promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  TalabaComponentsPage,
  /* TalabaDeleteDialog, */
  TalabaUpdatePage,
} from './talaba.page-object';

const expect = chai.expect;

describe('Talaba e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let talabaComponentsPage: TalabaComponentsPage;
  let talabaUpdatePage: TalabaUpdatePage;
  /* let talabaDeleteDialog: TalabaDeleteDialog; */
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Talabas', async () => {
    await navBarPage.goToEntity('talaba');
    talabaComponentsPage = new TalabaComponentsPage();
    await browser.wait(ec.visibilityOf(talabaComponentsPage.title), 5000);
    expect(await talabaComponentsPage.getTitle()).to.eq('talabaApp.talaba.home.title');
    await browser.wait(ec.or(ec.visibilityOf(talabaComponentsPage.entities), ec.visibilityOf(talabaComponentsPage.noResult)), 1000);
  });

  it('should load create Talaba page', async () => {
    await talabaComponentsPage.clickOnCreateButton();
    talabaUpdatePage = new TalabaUpdatePage();
    expect(await talabaUpdatePage.getPageTitle()).to.eq('talabaApp.talaba.home.createOrEditLabel');
    await talabaUpdatePage.cancel();
  });

  /* it('should create and save Talabas', async () => {
        const nbButtonsBeforeCreate = await talabaComponentsPage.countDeleteButtons();

        await talabaComponentsPage.clickOnCreateButton();

        await promise.all([
            talabaUpdatePage.setIsmInput('ism'),
            talabaUpdatePage.setFamiliyaInput('familiya'),
            talabaUpdatePage.setSharifInput('sharif'),
            talabaUpdatePage.setTugilganKunInput('2000-12-31'),
            talabaUpdatePage.guruhSelectLastOption(),
        ]);

        expect(await talabaUpdatePage.getIsmInput()).to.eq('ism', 'Expected Ism value to be equals to ism');
        expect(await talabaUpdatePage.getFamiliyaInput()).to.eq('familiya', 'Expected Familiya value to be equals to familiya');
        expect(await talabaUpdatePage.getSharifInput()).to.eq('sharif', 'Expected Sharif value to be equals to sharif');
        expect(await talabaUpdatePage.getTugilganKunInput()).to.eq('2000-12-31', 'Expected tugilganKun value to be equals to 2000-12-31');

        await talabaUpdatePage.save();
        expect(await talabaUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await talabaComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last Talaba', async () => {
        const nbButtonsBeforeDelete = await talabaComponentsPage.countDeleteButtons();
        await talabaComponentsPage.clickOnLastDeleteButton();

        talabaDeleteDialog = new TalabaDeleteDialog();
        expect(await talabaDeleteDialog.getDialogTitle())
            .to.eq('talabaApp.talaba.delete.question');
        await talabaDeleteDialog.clickOnConfirmButton();
        await browser.wait(ec.visibilityOf(talabaComponentsPage.title), 5000);

        expect(await talabaComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
