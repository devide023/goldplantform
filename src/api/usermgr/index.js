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
    saverole: function (data) {
        return request({
            url: '/user/userrole',
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

    getmenus: function (data) {
        return request({
            url: '/user/menus',
            method: 'get',
            params: { id: data }
        });
    }
}