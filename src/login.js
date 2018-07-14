const http = require('http');
const URL = require('url');
const cheerio = require('cheerio');

module.exports = class Checker {
    login(username, password) {
        
    }
    gatherInfo(url) {
        this.getHtml(url, (data) => {
            if (data) {
                const $ = cheerio.load(data);
            }
            else console.log('error');
        });
        url = new URL(url);
        console.log(`url.host:${url.host}`);
        switch (url.host) {
            case 'www.saksfifthavenue.com':
                break;
            case 'meimanmarcus.com':
                break;
            case 'nordstrom.com':
                break;
            case 'saks.com':
                break;
            default:

        }


    }

    getHtml(url, callback) {
        http.get(url, function (res) {
            const data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                callback(data);
            });
        }).on('error', function () {
            callback(null);
        });
    }
}
