import request from '@/utils/request';

export default {
    list: function (data) {
        return request({
            method: 'post',
            url: '/role/list',
            data: data
        });
    }
}
