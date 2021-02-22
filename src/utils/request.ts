import { Toast } from 'antd-mobile';
import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import cookie from '@/utils/cookie';
import { omit, assign } from 'lodash';

interface IRequestOption extends AxiosRequestConfig {
  url: string; // 请求的url
  method?: 'post' | 'get' | 'put' | 'delete' | 'patch';
}

class Request {
  private instance: AxiosInstance = null;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.REACT_APP_BASE_API,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      timeout: 20000, // 请求超时时间
    });
    /**
     * TODO 可以根据自己的情况来扩展、覆写请求
     * exp 删除通用拦截器 添加自定义拦截器。。。
     */
    this.instance.interceptors.response.use(
      response => {
        return response.data;
      },
      error => {
        const response = error.response;
        if (!response) {
          return Promise.reject(response);
        }
        if (response.status >= 300 && response.status < 500) {
          if (response.status === 401) {
            Toast.fail('没登录权限');
          } else {
            Toast.fail(response.data.errmsg);
          }
        } else if (response.status >= 500) {
          Toast.fail('系统错误！');
        }
        return Promise.reject(response);
      }
    );
    this.commonRequestInterceptor();
  }

  /**
   * 通用请求拦截器
   */
  commonRequestInterceptor(token?: string) {
    this.instance.interceptors.request.use(config => {
      const params = {
        // 已改为从cookie拿token
        Authoration: `${token || cookie.getToken()}`,
      };
      assign(config.headers, params);
      return config;
    });
  }

  request = (opt: IRequestOption) => {
    return this.instance.request(opt);
  };

  get = (opt: IRequestOption | string) => {
    let options: IRequestOption;
    if (typeof opt === 'string') {
      options = {
        url: opt as string,
      };
    } else {
      options = opt;
    }
    if (options.params) {
      Object.keys(options.params).forEach((key: string) => {
        const reg = new RegExp(`{${key}}`, 'g');
        options.url = options.url.replace(reg, options.params[key]);
      });
    }
    return this.request({
      ...omit(options, 'data'),
      method: 'get',
      params: { timespan: new Date().getTime(), ...options.data },
    });
  };

  post = (opt: IRequestOption) => {
    if (opt.params) {
      Object.keys(opt.params).forEach((key: string) => {
        const reg = new RegExp(`{${key}}`, 'g');
        opt.url = opt.url.replace(reg, opt.params[key]);
      });
    }
    return this.request({
      ...omit(opt, 'params'),
      method: 'post',
    });
  };

  put = (opt: IRequestOption) => {
    if (opt.params) {
      Object.keys(opt.params).forEach((key: string) => {
        const reg = new RegExp(`{${key}}`, 'g');
        opt.url = opt.url.replace(reg, opt.params[key]);
      });
    }
    return this.request({
      ...omit(opt, 'params'),
      method: 'put',
    });
  };

  patch = (opt: IRequestOption) => {
    if (opt.params) {
      Object.keys(opt.params).forEach((key: string) => {
        const reg = new RegExp(`{${key}}`, 'g');
        opt.url = opt.url.replace(reg, opt.params[key]);
      });
    }
    return this.request({
      ...omit(opt, 'params'),
      method: 'patch',
    });
  };

  del = (opt: IRequestOption) => {
    if (opt.params) {
      Object.keys(opt.params).forEach((key: string) => {
        const reg = new RegExp(`{${key}}`, 'g');
        opt.url = opt.url.replace(reg, opt.params[key]);
      });
    }
    return this.request({
      ...omit(opt, 'params'),
      method: 'delete',
    });
  };
}

export default new Request();
