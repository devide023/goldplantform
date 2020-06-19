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
    },
    orgtypelist: () => {
        return request({
            method: 'get',
            url: '/baseinfo/orgtypes'
        })
    },
    contracttypes: () => {
        return request({
            method: 'get',
            url: '/baseinfo/contracttypes',
        });
    },
    contractstatus: () => {
        return request({
            url: '/baseinfo/contractstatus',
            method: 'get'
        });
    },
    repairtypes: () => {
        return request({
            url: '/baseinfo/repairtypes',
            method: 'get'
        });
    },
    repairstatus: () => {
        return request({
            url: '/baseinfo/repairstatus',
            method: 'get'
        });
    },
    bookstatus: () => {
        return request({
            url: '/baseinfo/bookstatus',
            method: 'get'
        });
    }
}