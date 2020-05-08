import request from '@/utils/request';
import tool from '@/api/utils/tool';
export default {
    list: (data) => {
        return request({
            url: '/contract/list',
            method: 'post',
            data: data
        });
    },
    getcontractno: () => {
        return request({
            url: '/contract/getcontractno',
            method: 'get'
        });
    },
    add_contract: (data) => {
        return request({
            url: '/contract/add',
            method: 'post',
            data: data
        });
    },
    update_contract: (data) => {
        return request({
            url: '/contract/edit',
            method: 'post',
            data: data
        });
    },
    delcontract_file: (data) => {
        return request({
            url: '/contract/delfile',
            method: 'post',
            data: data
        });
    },
    contractfilesbyid: (data) => {
        return request({
            url: '/contract/getfiles',
            method: 'get',
            params: data
        });
    },
    upload_contract_url: request.defaults.baseURL + '/contract/upload'
}