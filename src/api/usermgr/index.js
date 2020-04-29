import request from '@/utils/request'

export default {
    head_image_path: request.defaults.baseURL + '/user/headimg',
    userlist: function (data) {
        return request({
            method: 'post',
            url: '/user/list',
            data: data
        });
    },
    find: (data) => {
        return request({
            url: '/user/find',
            method: 'get',
            params: data
        });
    },
    saverole: function (data) {
        return request({
            url: '/user/userrole',
            method: 'post',
            data: data
        });
    },
    saveorgnodes: (data) => {
        return request({
            url: '/user/userorg',
            method: 'post',
            data: data
        });
    },
    add: function (data) {
        return request({
            url: '/user/add',
            method: 'post',
            data: data
        });
    },

    edit: function (data) {
        return request({
            url: '/user/edit',
            method: 'post',
            data: data
        });
    },

    saveorg: function (data) {
        return request({
            url: '/user/userorg',
            method: 'post',
            data: data
        });
    },
    getuserroles: (data) => {
        return request({
            method: 'get',
            url: '/user/get_userroles',
            params: data
        });
    },
    getuserorgs: (data) => {
        return request({
            url: '/user/get_userorgs',
            method: 'get',
            params: data
        });
    },
    getmenus: function (data) {
        return request({
            url: '/user/menus',
            method: 'get',
            params: { id: data }
        });
    },
    disabel: function (data) {
        return request({
            method: 'post',
            url: '/user/disable',
            data: data
        });
    },
    enabel: function (data) {
        return request({
            method: 'post',
            url: '/user/enable',
            data: data
        });
    }
}