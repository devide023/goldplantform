import request from '@/utils/request';

export default {
    user_header: function (data) {
        return request({
            method: 'post',
            url: '/user/headimg',
            data
        });
    }
}