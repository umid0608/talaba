import { element, by, ElementFinder } from 'protractor';

export class TalabaComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-talaba div table .btn-danger'));
  title = element.all(by.css('jhi-talaba div h2#page-heading span')).first();
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

export class TalabaUpdatePage {
  pageTitle = element(by.id('jhi-talaba-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  ismInput = element(by.id('field_ism'));
  familiyaInput = element(by.id('field_familiya'));
  sharifInput = element(by.id('field_sharif'));
  tugilganKunInput = element(by.id('field_tugilganKun'));

  guruhSelect = element(by.id('field_guruh'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setIsmInput(ism: string): Promise<void> {
    await this.ismInput.sendKeys(ism);
  }

  async getIsmInput(): Promise<string> {
    return await this.ismInput.getAttribute('value');
  }

  async setFamiliyaInput(familiya: string): Promise<void> {
    await this.familiyaInput.sendKeys(familiya);
  }

  async getFamiliyaInput(): Promise<string> {
    return await this.familiyaInput.getAttribute('value');
  }

  async setSharifInput(sharif: string): Promise<void> {
    await this.sharifInput.sendKeys(sharif);
  }

  async getSharifInput(): Promise<string> {
    return await this.sharifInput.getAttribute('value');
  }

  async setTugilganKunInput(tugilganKun: string): Promise<void> {
    await this.tugilganKunInput.sendKeys(tugilganKun);
  }

  async getTugilganKunInput(): Promise<string> {
    return await this.tugilganKunInput.getAttribute('value');
  }

  async guruhSelectLastOption(): Promise<void> {
    await this.guruhSelect.all(by.tagName('option')).last().click();
  }

  async guruhSelectOption(option: string): Promise<void> {
    await this.guruhSelect.sendKeys(option);
  }

  getGuruhSelect(): ElementFinder {
    return this.guruhSelect;
  }

  async getGuruhSelectedOption(): Promise<string> {
    return await this.guruhSelect.element(by.css('option:checked')).getText();
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

export class TalabaDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-talaba-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-talaba'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
