import request from '@/utils/request';

export default {
    shiplist: (data) => {
        return request({
            url: '/hotel/shiplist',
            method: 'get',
            params: data
        });
    },
    roomtypelist: (data) => {
        return request({
            url: '/hotel/roomtypelist',
            method: 'get',
            params: data
        });
    },
    addroomtype: (data) => {
        return request({
            url: '/hotel/addroomtype',
            method: 'post',
            data: data
        });
    },
    editroomtype: (data) => {
        return request({
            url: '/hotel/editroomtype',
            method: 'post',
            data: data
        });
    },
    book_room_list: (data) => {
        return request({
            url: '/hotel/bookroomlist',
            method: 'post',
            data: data
        });
    },
    add_book_room: (data) => {
        return request({
            url: '/hotel/bookroom',
            method: 'post',
            data: data
        });
    }
}