import request from '@/utils/request';

export default {
    bookroom_report: (data) => {
        return request({
            url: '/hotel/report/room_book',
            method: 'post',
            data: data
        });
    },
    current_bookqty: (data) => {
        return request({
            url: '/hotel/report/cur_room_book',
            method: 'get',
            params: data
        });
    }
}