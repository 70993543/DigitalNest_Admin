import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

declare let iziToast: any;

@Component({
  selector: 'app-index-cliente',
  templateUrl: './index-cliente.component.html',
  styleUrls: ['./index-cliente.component.css']
})
export class IndexClienteComponent implements OnInit {

  public clientes : Array<any> = [];
  public filtro_apellidos = '';
  public filtro_correo = '';

  public page = 1;
  public pageSize = 10;
  public token:any;
  public load_data = true;

  // Variable para almacenar la referencia del modal
  private modalRef: NgbModalRef | undefined;

  constructor(
    private _clienteService: ClienteService,
    private _adminService: AdminService,
    private modalService: NgbModal
  ){
    this.token = this._adminService.getToken();
    
  }

  ngOnInit(): void {
    this.init_Data();
  }

  init_Data(){
    this._clienteService.listar_clientes_filtro_admin(null, null, this.token).subscribe({
      next: response => {
        this.clientes = response.data;
        this.load_data = false;
        
      },
      error: error => {
        console.log(error);
        
      }
    }
    )
  }

  filtro(tipo:any){

    if (tipo == 'apellidos') {
      
      if (this.filtro_apellidos) {
        this.load_data = true;
        this._clienteService.listar_clientes_filtro_admin(tipo, this.filtro_apellidos, this.token).subscribe({
          next: response => {
            this.clientes = response.data;
            this.load_data = false;
            
          },
          error: error => {
            console.log(error);
            
          }
        }
        )
      }else{
        this.init_Data()
      }
     
      
    }else if(tipo == 'correo'){
      if (this.filtro_correo) {
        this.load_data = true;
        this._clienteService.listar_clientes_filtro_admin(tipo, this.filtro_correo, this.token).subscribe({
          next: response => {
            this.clientes = response.data;
            this.load_data = false;
            
          },
          error: error => {
            console.log(error);
            
          }
        }
        )
      }else{
        this.init_Data()
      }
    }
  }

  // Función para abrir el modal
  open(content: any, clienteId: string){
    this.modalRef = this.modalService.open(content, {centered: true})
  }

  // Función para cerrar el modal
  close(){
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = undefined;
    }
  }

  eliminar(id:any){
    this._clienteService.eliminar_cliente_admin(id, this.token).subscribe({
      next: response => {
        console.log(response);
        iziToast.show({
          title: 'Success',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó correctamente el cliente.'
        })

        // Cierra el modal despues de eliminar
        this.close()

         // Cierra el overlay manualmente
        const backdrop = document.querySelector('.modal-backdrop')
        backdrop?.remove();

        // Reacarga los datos después de eliminar
        this.init_Data()
      },
      error: error => {
        console.log(error);
        
      }
    })
  }
}
