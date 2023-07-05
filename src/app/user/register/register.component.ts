import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import {AngularFirestore} from '@angular/fire/compat/firestore'
import { AuthService } from 'src/app/services/auth.service';
import IUser from 'src/app/models/user.model';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(
    private auth: AuthService,
    private emailTaken: EmailTaken
    ) { }

  inSubmission = false

  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3)

  ])
  email = new FormControl ('', [
    Validators.required,
    Validators.email
  ],[this.emailTaken.validate])
  age = new FormControl <number | null>(null, [
    Validators.required,
    Validators.min(18),
    Validators.max(120)
  ])
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ])
  confirm_Password = new FormControl('', [
    Validators.required,
    Validators.minLength(13),
    Validators.maxLength(13)

  ])
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(13),
    Validators.maxLength(13)


  ])

  showAlert = false
  alertMsg = 'Please wait! Your account is being created.'
  alertColor = 'blue'


  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_Password: this.confirm_Password,
    phoneNumber: this.phoneNumber
  }, [RegisterValidators.match('password','confirm_Password')
]
)

  async register() {

    // console.log('register calledd')
    this.showAlert = true
    this.alertMsg = 'Please wait! Your account is being created.'
    this.alertColor = 'blue'
    this.inSubmission = true

    // const {email, password} = this.registerForm.value

    // if (email && password && typeof email === 'string' && typeof password === 'string') {
    //   const userCred = await this.auth.createUserWithEmailAndPassword(email, password);
    //   // Rest of your code logic
    // } else {
    //   // Handle the case when email or password is not provided or invalid
    //   console.error("Invalid email or password.");
    // }
    
    try {
    await this.auth.createUser(this.registerForm.value as IUser)
    } catch (e) {
      console.error(e)

      this.alertMsg= 'An unexpected error occurred. Please try again later'
      this.alertColor = 'red'
      this.inSubmission = false
      return
    }
    this.alertMsg = 'Success! Your account has been created'
    this.alertColor = 'green'
  }
}
