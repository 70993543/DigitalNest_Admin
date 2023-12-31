import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';

declare let iziToast: any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit{

  public load_data = true;
  public filtro = '';
  public token:any;
  public productos : Array<any> = [];
  public url;

  public page = 1;
  public pageSize = 2;

  constructor(
    private _productoService: ProductoService

  ){
    this.token = localStorage.getItem('token')
    this.url = GLOBAL.url;
  }
  ngOnInit(): void {
    this.init_data()
  }

  init_data(){
    this._productoService.listar_productos_admin(this.filtro, this.token).subscribe({
      next: response => {
        console.log(response);
        this.productos = response.data;
        this.load_data = false;
        
      },
      error: error => {
        console.log(error);
        
      }
    })
  }
  filtrar(){
    if (this.filtro) {
      this._productoService.listar_productos_admin(this.filtro, this.token).subscribe({
        next: response => {
          console.log(response);
          this.productos = response.data;
          this.load_data = false;
          
        },
        error: error => {
          console.log(error);
          
        }
      })
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Ingrese un filtro para buscar',
      });
    }
  }

  resetear(){
    this.filtro = '';
    this.init_data()
  }
  


  
}
