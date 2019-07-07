const simulate = (method, path, body = {}, params = {}) =>
  new Promise((resolve, reject) => {
    // console.info('Simulating', method, 'request to path', path);
    if (body && typeof body === 'string' && Object.keys(body).length > 0) {
      // console.info(body);
    }
    const delay = Math.round(Math.random() * 4 * 1000); // Requests will take at most 4 seconds
    setTimeout(() => {
      if (params.forceError) {
        reject(new Error('Simulated error. This error is totally expected to happen sometimes to show how application behave in error cases.'));
      } else if (params.expectedResponse) {
        if (typeof params.expectedResponse === 'function') {
          params.expectedResponse(body)
            .then((data) => {
              resolve({
                status: 200,
                data,
              });
            }).catch((error) => {
              const newError = new Error(error.message);
              if (error.status) {
                newError.response = {
                  status: error.status,
                  data: {
                    message: error.message,
                    errors: error.errors,
                  },
                };
                reject(newError);
              } else {
                newError.status = 500;
                reject(newError);
              }
            });
        } else {
          resolve({
            response: {
              status: 200,
              data: params.expectedResponse,
            },
          });
        }
      } else {
        resolve({
          response: {
            status: 200,
            data: '',
          },
        });
      }
    }, delay);
  });

const axios = {
  get: (path, params) => simulate('GET', path, undefined, params),
  post: (path, body, params) => simulate('POST', path, body, params),
  put: (path, body, params) => simulate('PUT', path, body, params),
  delete: (path, params) => simulate('DELETE', path, undefined, params),
};

export default axios;
