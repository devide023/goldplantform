import request from '@/utils/request';

export default {
    list: (data) => {
        return request({
            url: '/repair/list',
            method: 'post',
            data: data
        });
    },
    add: (data) => {
        return request({
            url: '/repair/add',
            method: 'post',
            data: data
        });
    },
    edit: (data) => {
        return request({
            url: '/repair/edit',
            method: 'post',
            data: data
        });
    },
    find: (data) => {
        return request({
            url: '/repair/find',
            method: 'get',
            params: data
        });
    }
}