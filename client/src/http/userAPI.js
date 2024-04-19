import {$authHost, $host} from "./index";
import {jwtDecode} from "jwt-decode";
import {useContext} from "react";
import {Context} from "../index";

export const registration = async (email, phone, password) => {
    const {data} = await $host.post('api/user/registration', {email, phone, password, roleId:2})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const check = async () => {
    if (localStorage.getItem('token')){
        const {data} = await $authHost.get('api/user/auth')
        localStorage.setItem('token', data.token)
        console.log(jwtDecode(data.token))
        return jwtDecode(data.token)
    }
}