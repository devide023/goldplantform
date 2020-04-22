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
    menupath: function (data) {
        return request({
            url: '/role/rolemenupath',
            method: 'get',
            params: data
        });
    }
}
