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
    }
}
