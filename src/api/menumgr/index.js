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
    pagefuncodes: function (data) {
        return request({
            method: 'get',
            url: '/menu/pagefuns',
            params: data
        });
    },
    savemenu: function (data) {
        return request({
            method: 'post',
            url: '/menu/add',
            data: data
        })
    },
    editmenu: function (data) {
        return request({
            method: 'post',
            url: '/menu/edit',
            data: data
        });
    },
    disableitem: function (data) {
        return request({
            method: 'get',
            url: '/menu/disable',
            params: data
        });
    },
    enableitem: function (data) {
        return request({
            method: 'get',
            url: '/menu/enable',
            params: data
        });
    },
    removemenu: function (data) {
        return request({
            method: 'get',
            url: '/menu/del',
            params: data
        });
    }
}