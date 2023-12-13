import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';

declare let iziToast: any;

@Component({
  selector: 'app-edit-cliente',
  templateUrl: './edit-cliente.component.html',
  styleUrls: ['./edit-cliente.component.css']
})
export class EditClienteComponent implements OnInit {
  public cliente: any = {};
  public id: any;
  public token: any;
  public load_btn = false;
  public load_data = true;
  private ngUnsubscribe = new Subject();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _clienteService: ClienteService,
    private _adminService: AdminService,
    private _router: Router
    
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
      this.obtenerCliente();
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  obtenerCliente(): void {
    this._clienteService.obtener_cliente_admin(this.id, this.token).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (response) => {
        console.log(response);
        if (response.data == undefined) {
          this.cliente = undefined;
          this.load_data = false;
        }else{
          this.cliente = response.data;
          this.load_data = false;
        }
      }
    })
  }
  // Método para manejar la actualización del cliente
  actualizarCliente(updateForm: NgForm): void {
    if (updateForm.valid) {
      /* this.load_btn = true; */
      this._clienteService.actualizar_cliente_admin(this.id, this.cliente, this.token).subscribe({
        next: (response) => {
        /*   this.load_btn = false; */
          this.handleUpdateResponse(response);
        },
        error: (error) => {
          this.handleUpdateError(error);
        }
      });
    } else {
      this.showFormValidationError();
    }
  }

  // Método para manejar la respuesta del servidor después de la actualización
  private handleUpdateResponse(response: any): void {
    if (response && response.success) {
      this.showSuccessToast();
      
      this._router.navigate(['/panel/clientes']);
    } else {
      this.showUnexpectedResponseError(response);
    }
  }

  // Método para manejar errores durante la actualización
  private handleUpdateError(error: any): void {
    console.error('Error al actualizar el cliente:', error);
    this.showErrorToast('Hubo un problema al actualizar el cliente.');
  }

  // Método para mostrar un toast de éxito
  private showSuccessToast(): void {
    iziToast.show({
      title: 'Success',
      titleColor: '#1DC74C',
      color: '#FFF',
      class: 'text-success',
      position: 'topRight',
      message: `Cliente ${this.cliente.nombres} ${this.cliente.apellidos} actualizado correctamente.`
    });
  }

  // Método para mostrar un toast de error
  private showErrorToast(message: string): void {
    iziToast.error({
      title: 'Error',
      message: message,
      position: 'topRight'
    });
  }

  // Método para mostrar un toast en caso de respuesta inesperada del servidor
  private showUnexpectedResponseError(response: any): void {
    console.error('Respuesta inesperada del servidor:', response);
    this.showErrorToast('Respuesta inesperada del servidor al actualizar el cliente.');
  }

  // Método para mostrar un toast si los datos del formulario no son válidos
  private showFormValidationError(): void {
    iziToast.show({
      title: 'ERROR',
      titleColor: '#FF0000',
      color: '#FFF',
      class: 'text-danger',
      position: 'topRight',
      message: 'Los datos del formulario no son válidos'
    });
  }



  
  /* ngOnInit(): void {
    
    this._activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id')
      console.log(this.id);

      this._clienteService.obtener_cliente_admin(this.id, this.token).subscribe({
        next: response => {
          console.log(response);
          if (response.data == undefined) {
            this.cliente = undefined
          }else{
            this.cliente = response.data
          }
          
        }
      })
    })
  }

  actualizar(updateForm: NgForm) {
    if (updateForm.valid) {
      this._clienteService.actualizar_cliente_admin(this.id, this.cliente, this.token).subscribe({
        next: response => {
          if (response && response.success) {
            iziToast.show({
              title: 'Success',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: `Cliente ${this.cliente.nombres} ${this.cliente.apellidos} actualizado correctamente.`
            });
            this._router.navigate(['/panel/clientes']);
          } else {
            iziToast.error({
              title: 'Error',
              message: 'Respuesta inesperada del servidor al actualizar el cliente.',
              position: 'topRight'
            });
            console.error('Respuesta inesperada del servidor:', response);
          }
        },
        error: error => {
          iziToast.error({
            title: 'Error',
            message: 'Hubo un problema al actualizar el cliente.',
            position: 'topRight'
          });
          console.error('Error al actualizar el cliente:', error);
        }
      });
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son válidos'
      });
    }
  } */
  
}
