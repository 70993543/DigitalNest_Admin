import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { AdminService } from 'src/app/services/admin.service';
import { ProductoService } from 'src/app/services/producto.service';

declare let iziToast: any;

@Component({
  selector: 'app-update-producto',
  templateUrl: './update-producto.component.html',
  styleUrls: ['./update-producto.component.css']
})
export class UpdateProductoComponent implements OnInit{

  public producto: any = {};
  public config: any = {};
  public file: File | undefined = undefined;
  public imgSelect: any | ArrayBuffer;
  public fileName: string = 'Seleccionar imagen';
  public load_btn = false;
  public id:any;
  public token: any;
  public url:any;
  public config_global: any = { }

  constructor(
    private _activateRoute: ActivatedRoute,
    private _productoService: ProductoService,
    private _router: Router,
    private _adminService: AdminService
    
  ){
    this.config = {
      height: 200
    }
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;

    this._adminService.obtener_config_public().subscribe({
      next: response => {
        this.config_global = response.data
        console.log(this.config_global);
        
      }
    })
  }

  ngOnInit(): void{
    this._activateRoute.params.subscribe(params => {
      this.id = params['id'];
      console.log(this.id);
      this._productoService.obtener_producto_admin(this.id, this.token).subscribe({
        next :response => {
          if (response.data == undefined) {
            this.producto = undefined;
          }else{
            this.producto = response.data;
            this.imgSelect = this.url + 'obtener_portada/' + this.producto.portada;
          }
          
        },
        error: error => {
          console.log(error);
          
        }
      })
    })
  }

  actualizar(actualizarForm: NgForm){
    if (actualizarForm.valid) {
      console.log(this.producto)
      console.log(this.file);

      let data :any= {};

      if (this.file !== undefined) {
        data.portada = this.file;
      }

      data.titulo = this.producto.titulo;
      data.stock = this.producto.stock;
      data.precio = this.producto.precio;
      data.categoria = this.producto.categoria;
      data.descripcion = this.producto.descripcion;
      data.contenido = this.producto.contenido

      this.load_btn = true;

      this._productoService.actualizar_producto_admin(data, this.id, this.token).subscribe({
        next: response => {
          console.log(response);
          iziToast.show({
            title: 'Success',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se actualizó correctamente el nuevo producto.',
          });


          this.load_btn = false;

          this._router.navigate(['/panel/productos'])
          
        },
        error: error => {
          console.log(error);
          this.load_btn = false;
        }
      })
      
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son válidos'
      });
      this.load_btn = false;
    }
  }

  fileChangeEvent(fileInput: HTMLInputElement): void {
    if (fileInput.files && fileInput.files[0]) {
      this.file = fileInput.files[0];
      console.log(this.file);

      // Actualizar la etiqueta del input con el nombre del archivo seleccionado
      this.fileName = this.file.name;
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'No hay una imagen de envío',
      });
      // Restablecer el nombre por defecto si no hay archivo
      this.fileName = 'Seleccionar imagen';
    }
    if (this.file && this.file.size <= 4000000) {
      if (
        this.file.type == 'image/png' ||
        this.file.type == 'image/webp' ||
        this.file.type == 'image/jpg' ||
        this.file.type == 'image/gif' ||
        this.file.type == 'image/jpeg'
      ) {
        const reader = new FileReader();
        reader.onload = (e) => (this.imgSelect = reader.result);
        console.log(this.imgSelect);

        reader.readAsDataURL(this.file);
      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'El archivo debe ser una imagen',
        });
        this.imgSelect = 'assets/img/01.jpg';
        this.file = undefined;
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'La imagen no puede superar los 4MB',
      });
      this.imgSelect = 'assets/img/01.jpg';
      this.file = undefined;
    }

    console.log(this.file);
  }
}
