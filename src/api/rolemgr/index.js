import request from '@/utils/request';

export default {
    list: function (data) {
        return request({
            method: 'post',
            url: '/role/list',
            data: data
        });
    },
    saverole: function (data) {
        return request({
            method: 'post',
            url: '/role/add',
            data: data
        });
    },
    updaterole: function (data) {
        return request({
            method: 'post',
            url: '/role/edit',
            data: data
        });
    },
    rolerel: function (data) {
        return request({
            url: '/role/rolerel',
            method: 'get',
            params: data
        })
    },
    getrolemenus: (data) => {
        return request({
            url: '/role/menus',
            method: 'get',
            params: data
        });
    },
    saverolemenus: (data) => {
        return request({
            url: '/role/rolemenu',
            method: 'post',
            data: data
        });
    }
}
