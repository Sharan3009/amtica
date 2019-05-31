import { Routes } from "@angular/router";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { HomeComponent } from "./home/home.component";

export const userRouterConfig: Routes = [
    { path: 'signup', component: SignUpComponent },
    { path: 'login', component: SignInComponent },
    { path: 'home', component: HomeComponent },
    { path: '**', redirectTo:'login', pathMatch:'full' }
]