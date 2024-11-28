/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    let url = options.url;
    xhr.responseType = 'json';

    if (options.method === 'GET') {
        if (options.data && Object.keys(options.data).length > 0) {
            const params = new URLSearchParams(options.data).toString();
            url += '?' + params;
        }
    }

    xhr.open(options.method, url);

    xhr.addEventListener('load', function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            options.callback(null, xhr.response);
        } else {
            options.callback(new Error(`Ошибка ${xhr.status}: ${xhr.statusText}`), null);
        }
    });

    xhr.addEventListener('error', function () {
        options.callback(new Error('Сетевой ошибка'), null);
    });

    try {
        if (options.method === 'POST') {
            const formData = new FormData();
            if (options.data) {
                for (const key in options.data) {
                    formData.append(key, options.data[key]);
                }
            }
            xhr.send(formData);
        } else {
            xhr.send();
        }
    } catch (e) {
        options.callback(e, null);
    }

    return xhr;
};
