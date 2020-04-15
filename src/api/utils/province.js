import request from '@/utils/request';

export default {
    province: function (pid) {
        return request({
            method: 'get',
            url: '/baseinfo/province',
            params: {
                pid: pid
            }
        });
    }
}