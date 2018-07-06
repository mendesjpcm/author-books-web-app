import axios from 'axios';

import * as Constant from '../common/Constant'

const API = Constant.API.AUTHORS;

export const Save = function(data) {
    return axios.post(API, data)
}

export const Delete = function(id) {     
    return axios.delete(API +"/"+ id);
}

export const Update = function(data) {
    return axios.put(API + "/" + data.id , data)
}

export const FindAll = function() {    
    return axios.get(API);
}