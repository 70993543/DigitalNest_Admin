import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ProductoService } from 'src/app/services/producto.service';

declare let iziToast: any;

@Component({
  selector: 'app-create-producto',
  templateUrl: './create-producto.component.html',
  styleUrls: ['./create-producto.component.css'],
})
export class CreateProductoComponent {
  public producto: any = {};
  public file: File | undefined = undefined;
  public imgSelect: any | ArrayBuffer = 'assets/img/01.jpg';
  public fileName: string = 'Seleccionar imagen';
  public config: any = {};
  public token: any;
  public load_btn = false;
  public config_global: any = {};

  constructor(
    private _productoService: ProductoService,
    private _adminService: AdminService,
    private _router: Router
  ) {
    this.config = {
      height: 500,
    };
    this.token = this._adminService.getToken();
    this._adminService.obtener_config_public().subscribe({
      next: response => {
        this.config_global = response.data
        console.log(this.config_global);
        
      }
    })
  }

  registro(registroForm: NgForm) {
    if (registroForm.valid) {
      if (this.file == undefined) {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Debe subir una portada para registrar',
        });
      } else {
        console.log(this.producto);
        console.log(this.file);

        this.load_btn = true;
        this._productoService
          .registro_producto_admin(this.producto, this.file, this.token)
          .subscribe({
            next: (response) => {
              iziToast.show({
                title: 'Success',
                titleColor: '#1DC74C',
                color: '#FFF',
                class: 'text-success',
                position: 'topRight',
                message: 'Se registro correctamente el nuevo producto.',
              });
              this.load_btn = false;

              this._router.navigate(['/panel/productos']);
            },
            error: (error) => {
              console.log(error);
              this.load_btn = false;
            },
          });
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son válidos',
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
