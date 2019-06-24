import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SaleService } from '../sale/sale.service';
import { BatchService } from '../batchs/batch.service';
import { TabsPage } from '../tabs/tabs.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  clients: Array<any> = [];
  saleId: number = null;
  paymentMethod = '';
  products: Array<any> = [];
  client = '';
  paymentShow = false;

  constructor(
    private saleService: SaleService,
    private batchService: BatchService,
    public navCtrl: NavController,
    public storage: Storage,
    public tabsPage: TabsPage,
    private alertCtrl: AlertController,
  ) {
    this.generateCients();
  }

  ionViewWillEnter() {
    this.tabsPage.getSaleId();

    this.storage.get('saleId').then((val) => {
      this.saleId =  val;

      if (this.saleId !== null) {
        this.identifyById();
      }
    });
  }

  identifyById() {
    this.saleService.identifyById(this.saleId).subscribe(resp => {
      this.client = resp.data.customer_name;
      this.paymentMethod = resp.data.payment_method;
      this.products = resp.data.items;
    });
  }

  generateCients() {
    this.saleService.getClients().subscribe(resp => {
      this.clients = resp.data;
    });
  }

  onChangeClient(event) {
    if (event === 'Consumidor Final') {
      this.paymentShow = true;
    } else {
      this.paymentShow = false;
    }

    this.saleService.create(event).subscribe(resp => {
      this.saleId = resp.data.id;
      this.storage.set('saleId', resp.data.id).then(() => {
        this.tabsPage.getSaleId();
      });
      // this.storage.set('products', resp.data.items);
    });
  }

  onChangePaymentMethod(event) {
    if (this.paymentMethod !== '') {
      this.saleService.setPaymentMethod(this.saleId, event).subscribe(resp => {});
    }
  }

  changeItem(item, i) {
    this.batchService.getQuantityByBatch(item.batch).subscribe(respo => {
      const totalQuantity = respo.data.quantity;
      this.saleService.identifyById(this.saleId).subscribe(resp => {
        const itemQuantity = resp.data.items[i].quantity;
        const itemPrice = resp.data.items[i].price;

        if (item.quantity > 0 && item.price > 0) {
          this.saleService.updateItemQuantity(this.saleId, item.batch, item.quantity)
          .subscribe(response => {

            this.saleService.updateItemPrice(this.saleId, item.batch, item.price).subscribe(response2 => {
              this.alert('OPERACIÓN EXITOSA', '', 'Se realizaron las modificaciones exitozamente');
            });

          }, err => {
            item.quantity = itemQuantity;
            this.alert(
              'ERROR!',
              'Advertencia',
              `Ah ocurrido un error, es posible que la cantidad ingresada
                supere a la cantidad disponible en su lote ${item.batch},
                la cantidad restante disponible es ${totalQuantity}`
            );
          } );
        } else if (item.quantity <= 0) {
          this.alert('CUIDADO!', `Dato inválido: Cantidad: ${item.quantity}`,
          'La cantidad ingresada no es válida, no se guardaron los cambios');
          item.quantity = itemQuantity;
        } else if (item.price <= 0) {
          this.alert('CUIDADO!', `Dato inválido: $ ${item.price}`, 'El precio ingresado no es válido, no se guardaron los cambios');
          item.price = itemPrice;
        }
      });
    });
  }

  removeItem(item, i) {
    this.saleService.removeItem(this.saleId, item.batch).subscribe(resp => {
      this.identifyById();
      this.alert('OPERACIÓN COMPLETA', '', 'Producto removido de la venta');
    });
  }

  resetValues() {
    this.saleId = null;
    this.paymentMethod = '';
    this.products = [];
    this.client = '';
    this.paymentShow = false;
  }

  closeSale() {
    this.saleService.isClosable(this.saleId).subscribe(resp => {
      if (resp.data.closable) {
        this.saleService.close(this.saleId).subscribe(resposnse => {
          this.alert('OPERACIÓN EXITOSA', 'VENTA CERRADA', 'Su venta fue registrada con éxito.');
          this.resetValues();
        });
      }
    });
  }

  cancelSale() {
    this.presentAlertConfirm();
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


  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: '¡¿Esta seguro?!',
      message: 'Se eliminara la venta por completo!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {}
        }, {
          text: 'Eliminar',
          handler: () => {
            this.saleService.delete(this.saleId).subscribe(resp => {
              this.alert('OPERACION EXITOSA', 'ELIMINACIÓN', 'Se ha eliminado la venta por completo');
              this.resetValues();
              this.storage.set('saleId', null).then(() => {
                this.tabsPage.getSaleId();
              });
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
