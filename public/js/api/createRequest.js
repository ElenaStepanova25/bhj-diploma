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
        // Убираем проверку статуса, так как load срабатывает только на успешных запросах
        options.callback(null, xhr.response);
        });

    xhr.addEventListener('error', function () {
        options.callback(new Error('Сетевой ошибка'), null);
    });

    try {
        let formData = null;
        if (options.method !== 'GET') {
            formData = new FormData();
            if (options.data) {
                for (const key in options.data) {
                    formData.append(key, options.data[key]);
                }
            }
        }    
            xhr.send(formData || null);
        } catch (e) {
        options.callback(e, null);
    }

    return xhr;
};
