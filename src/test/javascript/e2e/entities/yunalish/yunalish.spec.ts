import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { YunalishComponentsPage, YunalishDeleteDialog, YunalishUpdatePage } from './yunalish.page-object';

const expect = chai.expect;

describe('Yunalish e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let yunalishComponentsPage: YunalishComponentsPage;
  let yunalishUpdatePage: YunalishUpdatePage;
  let yunalishDeleteDialog: YunalishDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Yunalishes', async () => {
    await navBarPage.goToEntity('yunalish');
    yunalishComponentsPage = new YunalishComponentsPage();
    await browser.wait(ec.visibilityOf(yunalishComponentsPage.title), 5000);
    expect(await yunalishComponentsPage.getTitle()).to.eq('talabaApp.yunalish.home.title');
    await browser.wait(ec.or(ec.visibilityOf(yunalishComponentsPage.entities), ec.visibilityOf(yunalishComponentsPage.noResult)), 1000);
  });

  it('should load create Yunalish page', async () => {
    await yunalishComponentsPage.clickOnCreateButton();
    yunalishUpdatePage = new YunalishUpdatePage();
    expect(await yunalishUpdatePage.getPageTitle()).to.eq('talabaApp.yunalish.home.createOrEditLabel');
    await yunalishUpdatePage.cancel();
  });

  it('should create and save Yunalishes', async () => {
    const nbButtonsBeforeCreate = await yunalishComponentsPage.countDeleteButtons();

    await yunalishComponentsPage.clickOnCreateButton();

    await promise.all([yunalishUpdatePage.setNomInput('nom'), yunalishUpdatePage.setKodInput('kod')]);

    expect(await yunalishUpdatePage.getNomInput()).to.eq('nom', 'Expected Nom value to be equals to nom');
    expect(await yunalishUpdatePage.getKodInput()).to.eq('kod', 'Expected Kod value to be equals to kod');

    await yunalishUpdatePage.save();
    expect(await yunalishUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await yunalishComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Yunalish', async () => {
    const nbButtonsBeforeDelete = await yunalishComponentsPage.countDeleteButtons();
    await yunalishComponentsPage.clickOnLastDeleteButton();

    yunalishDeleteDialog = new YunalishDeleteDialog();
    expect(await yunalishDeleteDialog.getDialogTitle()).to.eq('talabaApp.yunalish.delete.question');
    await yunalishDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(yunalishComponentsPage.title), 5000);

    expect(await yunalishComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
