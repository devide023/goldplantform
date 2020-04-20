import request from '@/utils/request';

export default {
    iconlist: function (data) {
        return request({
            url: '/baseinfo/icons',
            method: 'get',
            params: data
        });
    },
    funcodelist: function (data) {
        return request({
            url: '/baseinfo/funcodes',
            method: 'get',
            params: data
        });
    }
}