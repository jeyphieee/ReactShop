import axios from "axios";
import { base_url } from "../utils/axiosConfig";

const register = async (userData) => {
    const response = await axios.post(`${base_url}/v1/register`, userData);
    if(response.data){
        return response.data;
    }
}
const Login = async (userData) => {
    const response = await axios.post(`${base_url}/v1/login`, userData);
    if(response.data){
        return response.data;
    }
}
export const authService={
    register,
}
