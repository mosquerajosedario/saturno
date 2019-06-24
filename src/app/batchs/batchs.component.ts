import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BatchService } from './batch.service';
import { SaleService } from '../sale/sale.service';
import { NavController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

export interface Batch {
  colour: string;
  quantity: string;
  variety: string;
  product_id: string;
  name: string;
  batch: string;
  description: string;
}

@Component({
  selector: 'app-batchs',
  templateUrl: './batchs.component.html',
  styleUrls: ['./batchs.component.scss'],
})
export class BatchsComponent implements OnInit {

  batchs: Array<Batch> = [];
  saleId: number = null;
  products: Array<any> = [];
  sub: any;
  data: any = {
    name: null,
    description: null,
    variety: null,
    colour: null,
  };

  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private batchService: BatchService,
    public storage: Storage,
    private alertCtrl: AlertController,
    private saleService: SaleService,
  ) {

    this.storage.get('saleId').then((val) => {
      this.saleId =  val;
      this.identifyById();
    });

    // this.storage.get('products').then((val) => {
    //   this.products = val;
    // }).then(() => {
    //   this.sub = this.route
    //   .queryParams
    //   .subscribe(params => {
    //     this.data = JSON.parse(params['stock']);
    //     this.batchService.get(this.data).subscribe(result => {
    //       this.batchs = result.data.page.stocks;

    //       for (let product of this.products) {
    //         for (let _batch of this.batchs) {
    //           if (_batch.batch === product.batch) {

    //             const index = this.batchs.indexOf(_batch);
    //             this.batchs.splice(index, 1);

    //             break;
    //           }
    //         }
    //       }
    //     });
    //   });

    // });
  }

  ngOnInit() {
  }

  identifyById() {
    this.saleService.identifyById(this.saleId).subscribe(resp => {
      this.products = resp.data.items;

      this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.data = JSON.parse(params.stock);
        this.batchService.get(this.data).subscribe(result => {
          this.batchs = result.data.page.stocks;

          for (const product of this.products) {
            for (const batch1 of this.batchs) {
              if (batch1.batch === product.batch) {

                const index = this.batchs.indexOf(batch1);
                this.batchs.splice(index, 1);

                break;
              }
            }
          }
        });
      });
    });
  }

  backClicked() {
    this.navCtrl.navigateRoot('/tabs/tab3');
  }

  addItem(item, index) {
    if (item.amountSell !== undefined && item.amountSell > 0
      && item.amountSell <= item.quantity && item.price !== undefined && item.price > 0 ) {

        const addItem = {
          batch: item.batch,
          quantity: item.amountSell,
          price: item.price,
        };

        this.saleService.addItem(this.saleId, addItem).subscribe(resp => {
          this.batchs.splice(index, 1);
          this.storage.set('products', resp.data.items);
          this.alert('Operación completa', 'Producto añadido', `Se han agregado ${item.amountSell} del lote ${item.batch}`);
        });
    } else if (item.amountSell === undefined) {
      this.alert('Cuidado!', '', 'No se ingreso una cantidad.');
    } else if (item.price === undefined) {
      this.alert('Cuidado!', '', 'No se ingreso un precio.');
    } else if (item.amountSell < 0 || item.amountSell > item.quantity) {
      this.alert('Cuidado!', '', 'La cantidad es insuficiente o supera la cantidad disponible.');
    } else if (item.price < 0) {
      this.alert('Cuidado!', '', 'El precio es insuficiente.');
    }
  }

  async alert(header, subHeader, message) {
    const alert = await this.alertCtrl.create({
      header,
      subHeader,
      message,
      buttons: ['OK'],
    });
    return await alert.present();
  }
}
