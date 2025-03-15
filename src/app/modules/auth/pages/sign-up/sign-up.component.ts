import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { CommonModule } from '@angular/common';
import { Cities } from 'src/app/core/models/interfaces-graphics';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, RouterLink, CommonModule, AngularSvgIconModule, ButtonComponent, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  form: FormGroup<{
    role_id: FormControl,
    use_con_hea_id: FormControl,
    city_id: FormControl,
    identification: FormControl,
    name: FormControl,
    age: FormControl,
    gender: FormControl,
    email: FormControl,
    password: FormControl,
    status: FormControl,
  }>
  roleId = 4;
  roleTextCode: 'patient'|'professional'|'parent'|'' = '';
  cities: Cities[] = [];
  filteredCities: Cities[] = [];
  searchTerm: string = '';


  constructor(private formBuilder: FormBuilder, private readonly _router: Router, private _authService: AuthService, private _toastService: ToastService) {

    const roles: { [key: string]: number } = { "admin": 1,"professional": 2,"parent": 3,"patient": 4 }
    
    let _role = this._router.parseUrl(this._router.url).queryParams['role']
    if(_role){
      this.roleId = roles[_role]
      this.roleTextCode = _role
    }else{
      this._router.navigateByUrl('/home')
    }

    this.form = this.formBuilder.group({
      role_id: [this.roleId, []],
      use_con_hea_id: [4, []],
      city_id: [null, [Validators.required]],
      identification: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      age: ['', [Validators.required, Validators.min(4), Validators.max(100) ]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(1500) ]],
      status: ['active', []],
    })

    this._authService.getCities().subscribe((data) => {
      
      this.cities = data.res;
      this.filteredCities = data.res; // Inicialmente, mostrar todas las ciudades
    });
  }

  filterCities(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredCities = this.cities.filter((city) =>
      city.city_name.toLowerCase().includes(searchTerm)
    );
  }
  
  ngAfterViewInit(){
    const roles: { [key: string]: number } = { "admin": 1,"professional": 2,"parent": 3,"patient": 4 }
    
    let _role = this._router.parseUrl(this._router.url).queryParams['role']
    if(_role){
      this.roleId = roles[_role]
      this.roleTextCode = _role
    }else{
      this._router.navigateByUrl('/home')
    }
  }

  handleSubmit(event: any){
    event.preventDefault()
    const pass = event.target[7].value
    if (this.form.invalid || !pass || this.form.controls.password.value !== pass) {
      console.log('>> >> invalido :', this.form.getRawValue());
      return;
    }
    
    this.form.controls.city_id.setValue(Number(this.form.controls.city_id.value))
    const data = this.form.getRawValue()
    
    this._toastService.toast.set({ type: 'loading'})
    
    this._authService.signup(data).subscribe({
      next: (res) => {
        if(res.isError) return

        this._toastService.toast.set(undefined)
      
        this._toastService.toast.set({ type: 's', timeS: 1.5, title: "Exitoso", message: "Usuario registrado con exito!", end: () => { 
          this._toastService.toast.set(undefined)
          let _role = this._router.parseUrl(this._router.url).queryParams['role']
          this._router.navigateByUrl('/auth/sign-in?role='+_role)
        }})
        
      },
      error: (err) => {
        console.error('>> >>  :', err);
        this._toastService.toast.set(undefined)
      
        this._toastService.toast.set({ type: 'w', timeS: 1.5, title: "Error", message: "Error al resgistrar el usuario", end: () => { 
          this._toastService.toast.set(undefined)
        }})
      },
    })
    
  }
}
