const axios = require('axios');
const proxy = require('node-global-proxy').default;

const PROXY_URL = 'localhost:10809';

const test = async () => {
  console.log(proxy);

  proxy.system();
  console.log(proxy.getConfig());
  res = await axios.get('http://ip-api.com/json', {
    timeout: 3000,
  });
  console.log(res.data);

  proxy.setConfig(PROXY_URL);
  console.log(proxy.getConfig());

  proxy.start();
  res = await axios.get('http://ip-api.com/json', {
    timeout: 3000,
  });
  console.log(res.data);

  proxy.stop();
  res = await axios.get('http://ip-api.com/json', {
    timeout: 3000,
  });
  console.log(res.data);

  proxy.setConfig({
    http: 'http://' + PROXY_URL,
    https: 'https://' + PROXY_URL,
  });
  console.log(proxy.getConfig());
  proxy.start();
  res = await axios.get('http://ip-api.com/json', {
    timeout: 3000,
  });
  console.log(res.data);
};

test();
