import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

declare let jQuery:any;
declare let $:any;
declare let iziToast: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  public user : any = {};

  public usuario : any = {};

  public token : any = '';

  constructor(
    private _adminService: AdminService,
    private _router: Router
    ){
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    console.log(this.token);
    if (this.token) {
      this._router.navigate(['/'])
    }else{
      // Mantener en el componente
    }
  }

  login(loginForm: NgForm){
    if (loginForm.valid) {
      console.log(this.user);

      let data = {
        email: this.user.email,
        password: this.user.password
      }
      
      this._adminService.login_admin(data).subscribe(
        {
          next: response => {
            if (response.data == undefined){
              iziToast.show({
                title: 'ERROR',
                titleColor: '#FF0000',
                color: '#FFF',
                class: 'text-danger',
                position: 'topRight',
                message: response.message
              })
            }else{
              this.usuario = response.data;

              localStorage.setItem('token', response.token);
              localStorage.setItem('_id', response.data._id)

              this._router.navigate(['/'])

            }
            console.log(response);
          },
          error: error => {
            console.log(error);
          }
        }
      )
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son válidos'
      })
    }
  }

}
