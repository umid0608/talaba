import { element, by, ElementFinder } from 'protractor';

export class GuruhComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-guruh div table .btn-danger'));
  title = element.all(by.css('jhi-guruh div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class GuruhUpdatePage {
  pageTitle = element(by.id('jhi-guruh-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  nomInput = element(by.id('field_nom'));
  yilInput = element(by.id('field_yil'));

  yunalishSelect = element(by.id('field_yunalish'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setNomInput(nom: string): Promise<void> {
    await this.nomInput.sendKeys(nom);
  }

  async getNomInput(): Promise<string> {
    return await this.nomInput.getAttribute('value');
  }

  async setYilInput(yil: string): Promise<void> {
    await this.yilInput.sendKeys(yil);
  }

  async getYilInput(): Promise<string> {
    return await this.yilInput.getAttribute('value');
  }

  async yunalishSelectLastOption(): Promise<void> {
    await this.yunalishSelect.all(by.tagName('option')).last().click();
  }

  async yunalishSelectOption(option: string): Promise<void> {
    await this.yunalishSelect.sendKeys(option);
  }

  getYunalishSelect(): ElementFinder {
    return this.yunalishSelect;
  }

  async getYunalishSelectedOption(): Promise<string> {
    return await this.yunalishSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class GuruhDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-guruh-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-guruh'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
