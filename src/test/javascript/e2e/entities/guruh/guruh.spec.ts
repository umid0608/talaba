import { browser, ExpectedConditions as ec /* , promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  GuruhComponentsPage,
  /* GuruhDeleteDialog, */
  GuruhUpdatePage,
} from './guruh.page-object';

const expect = chai.expect;

describe('Guruh e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let guruhComponentsPage: GuruhComponentsPage;
  let guruhUpdatePage: GuruhUpdatePage;
  /* let guruhDeleteDialog: GuruhDeleteDialog; */
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Guruhs', async () => {
    await navBarPage.goToEntity('guruh');
    guruhComponentsPage = new GuruhComponentsPage();
    await browser.wait(ec.visibilityOf(guruhComponentsPage.title), 5000);
    expect(await guruhComponentsPage.getTitle()).to.eq('talabaApp.guruh.home.title');
    await browser.wait(ec.or(ec.visibilityOf(guruhComponentsPage.entities), ec.visibilityOf(guruhComponentsPage.noResult)), 1000);
  });

  it('should load create Guruh page', async () => {
    await guruhComponentsPage.clickOnCreateButton();
    guruhUpdatePage = new GuruhUpdatePage();
    expect(await guruhUpdatePage.getPageTitle()).to.eq('talabaApp.guruh.home.createOrEditLabel');
    await guruhUpdatePage.cancel();
  });

  /* it('should create and save Guruhs', async () => {
        const nbButtonsBeforeCreate = await guruhComponentsPage.countDeleteButtons();

        await guruhComponentsPage.clickOnCreateButton();

        await promise.all([
            guruhUpdatePage.setNomInput('nom'),
            guruhUpdatePage.setYilInput('5'),
            guruhUpdatePage.yunalishSelectLastOption(),
        ]);

        expect(await guruhUpdatePage.getNomInput()).to.eq('nom', 'Expected Nom value to be equals to nom');
        expect(await guruhUpdatePage.getYilInput()).to.eq('5', 'Expected yil value to be equals to 5');

        await guruhUpdatePage.save();
        expect(await guruhUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await guruhComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last Guruh', async () => {
        const nbButtonsBeforeDelete = await guruhComponentsPage.countDeleteButtons();
        await guruhComponentsPage.clickOnLastDeleteButton();

        guruhDeleteDialog = new GuruhDeleteDialog();
        expect(await guruhDeleteDialog.getDialogTitle())
            .to.eq('talabaApp.guruh.delete.question');
        await guruhDeleteDialog.clickOnConfirmButton();
        await browser.wait(ec.visibilityOf(guruhComponentsPage.title), 5000);

        expect(await guruhComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
