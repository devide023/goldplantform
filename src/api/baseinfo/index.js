import request from '@/utils/request';

export default {
    iconlist: function (data) {
        return request({
            url: '/baseinfo/icons',
            method: 'get',
            params: data
        });
    },
    addfuncode: function (data) {
        return request({
            method: 'post',
            url: '/baseinfo/addfuncode',
            data: data
        })
    },
    delfuncode: function (data) {
        return request({
            method: 'get',
            url: '/baseinfo/delfuncode',
            params: data
        });
    },
    funcodelist: function (data) {
        return request({
            url: '/baseinfo/funcodes',
            method: 'get',
            params: data
        });
    },
    routelist: function () {
        return request({
            url: '/baseinfo/routes',
            method: 'get'
        })
    },
    freshroutelist: function () {
        return request({
            url: '/baseinfo/freshroute',
            method: 'get'
        })
    }
}