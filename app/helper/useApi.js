import axios from 'axios';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
export const baseUrl = 'https://pirireis-backend.herokuapp.com';

export const useAPI = () => {
  const defaultHeader = {
    Accept: 'application/json',
    'Content-Type': 'application/json',

    'x-access-token': null,
  };

  const navigation = useNavigation();

  const customFetch = ({
    endpoint,
    method = 'GET',
    body = {},
    headers = defaultHeader,
    isBinary,
  }) => {
    const url = `${baseUrl}/${endpoint}`;

    const options = {
      method,
      headers,
    };

    if (Object.keys(body).length) {
      options.data = JSON.stringify(body);
    }
    if (isBinary) {
      options.responseType = 'arraybuffer';
    }

    return axios(url, options)
      .then(response => response.data)
      .catch(error => {
        console.log(error?.response?.status);
        if (error?.response?.status === 401) {
          Alert.alert(
            'Uyarı',
            'Kullanılan token süresi dolmuştur.Lütfen tekrar giriş yapınız.',
            [
              {
                text: 'Tamam',
                onPress: () => navigation.navigate('Giriş'),
              },
            ],
            {cancelable: false},
          );
        }
        return error?.response?.data || {status: false};
      });
  };

  const get = ({endpoint, id, query, token}) => {
    const url = `${endpoint}${
      id ? `/${id}${query ? `?${query}` : ''}` : `${query ? `?${query}` : ''}`
    }`;

    if (token) {
      defaultHeader['x-access-token'] = `${token}`;
    }
    return customFetch({endpoint: url});
  };

  const post = (endpoint, body = {}) => {
    //if (!Object.keys(body).length)throw new Error('to make a post you must provide a  body');

    return customFetch({endpoint, method: 'POST', body});
  };

  const put = ({endpoint, id, body = {}, token}) => {
    if (!id && !body) {
      throw new Error('to make a put you must provide the id and the   body');
    }
    if (token) {
      defaultHeader['x-access-token'] = `${token}`;
    }
    const url = `${endpoint}${id ? `/${id}` : ''}`;
    return customFetch({
      endpoint: url,
      method: 'PUT',
      body,
      headers: defaultHeader,
    });
  };

  const del = (endpoint, id) => {
    if (!id) {
      throw new Error('to make a delete you must provide the id and the body');
    }
    const url = `${endpoint}/${id}`;

    return customFetch({endpoint: url, method: 'DELETE'});
  };
  return {
    get,
    post,
    put,
    del,
  };
};
