import request from '@/utils/request';

export default {
  date_book_cnt: (data) => {
    return request({
      url: '/echarts/datebookcnt',
      method: 'get',
      params: data
    });
  },
  agent_book_cnt: (data) => {
    return request({
      url: '/echarts/agentbookcnt',
      method: 'get',
      params: data
    });
  }
}
