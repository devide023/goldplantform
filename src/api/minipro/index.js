import request from '@/utils/request';

export default {
    mpmenulist: (data) => {
        return request({
            url: '/mp/menuslist',
            method: 'get',
            params: data
        });
    },
    save_user_mpsetting: (data) => {
        return request({
            url: '/mp/user_setting',
            method: 'post',
            data: data
        });
    },
    get_usersetting: (data) => {
        return request({
            url: '/mp/getusersetting',
            method: 'get',
            params: data
        });
    }
}