import request from '@/utils/request';

export default {
    menutypelist: function () {
        return request({
            url: '/baseinfo/menutypelist',
            method: 'get'
        });
    }
}