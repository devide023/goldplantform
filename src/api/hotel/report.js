import request from '@/utils/request';

export default {
    bookroom_report: (data) => {
        return request({
            url: '/hotel/report/room_book',
            method: 'post',
            data: data
        });
    }
}