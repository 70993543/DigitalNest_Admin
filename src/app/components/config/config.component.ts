import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';

declare let iziToast: any;
import { v4 as uuidv4 } from 'uuid'

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  public token;
  public config : any = {}; 

  public titulo_cat = '';
  public icono_cat = '';
  public file: File | undefined;

  public imgSelect: any | ArrayBuffer;
  public fileName: string = 'Seleccionar imagen';

  constructor(
    private _adminService: AdminService
  ){
    this.token = localStorage.getItem('token')
    
    this._adminService.obtener_config_admin(this.token).subscribe({
      next: response => {
       /*  console.log(response); */
       this.config = response.data
        console.log(this.config);
        
        
      },
      error: error => {
        console.log(error);
        
      }
    })
  }
  ngOnInit(): void {
  }

  agregar_cat(){
    if (this.titulo_cat && this.icono_cat) {
      console.log(uuidv4());
      
      this.config.categorias.push({
        titulo: this.titulo_cat,
        icono: this.icono_cat,
        _id: uuidv4()
      })

      this.titulo_cat = '';
      this.icono_cat = '';
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debe ingresar un titulo y un icono para la categoria'
      });
    }
  }
  actualizar(confForm: NgForm){
    if (confForm.valid) {
      let data = {
        titulo: confForm.value.titulo,
        serie: confForm.value.serie,
        correlativo: confForm.value.correlativo,
        categorias: this.config.categorias,
        logo: this.file
      }
      console.log(data);
      this._adminService.actualiza_config_admin("657782fedd5f2bebac36c858",data, this.token).subscribe({
        next: response => {
          console.log(response);
          
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
        message: 'Complete correctamente el formulario'
      });
    }
  }

  fileChangeEvent(fileInput: HTMLInputElement){
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
        reader.readAsDataURL(this.file)

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

