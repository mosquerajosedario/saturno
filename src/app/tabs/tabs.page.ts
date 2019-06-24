import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  saleId: number = null;

  constructor(public storage: Storage) {}

  getSaleId() {
    this.storage.get('saleId').then((val) => {
      this.saleId = val;
    });
  }

}
