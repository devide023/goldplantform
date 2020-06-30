import request from '@/utils/request';
export default {
    date_room_book: (data) => {
        return request({
            url: '/hotel/report/date_roombook',
            method: 'post',
            data: data
        });
    },
    date_room_book_detail: (data) => {
        return request({
            url: '/hotel/report/date_roombook_detail',
            method: 'post',
            data: data
        });
    }
}