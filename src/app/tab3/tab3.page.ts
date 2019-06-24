import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ProductService } from '../product/product.service';

export interface Products {
  colour: string;
  description: string;
  name: string;
  variety: string;
  quantity: string;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  products: Array<Products> = [];
  batchs: Array<any> = [];
  sub: any;

  constructor(
    public navCtrl: NavController,
    private productService: ProductService,
  ) {
    this.productService.getStockTotal().subscribe(resp => {
      this.products = resp.data.page.stocks;
    });
  }

  goToBatchs(item) {
    this.navCtrl.navigateRoot(['/batchs'], { queryParams: { stock: JSON.stringify(item) } });
  }

}
