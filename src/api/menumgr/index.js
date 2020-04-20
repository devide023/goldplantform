import request from '@/utils/request';

export default {
    list: function (data) {
        return request({
            method: 'post',
            url: '/menu/list',
            data: data
        });
    },
    menucode: function (data) {
        return request({
            method: 'get',
            url: '/menu/menucode',
            params: data
        });
    },
    savemenu: function (data) {
        return request({
            method: 'post',
            url: '/menu/add',
            data: data
        })
    }
}