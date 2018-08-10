let maxPrice = 190;
// let mPrice = prompt('请输入你要出的价格');
let waitTime = 0;
let time = 1500
let tarr = document.getElementById('J-count-down').innerText.replace(/ /g, '').split(':');
// let waitTime = tarr[0] * 360 + tarr[1] * 60 + tarr[2] - 5;
// if(mPrice) {
// maxPrice = Number(mPrice);
let success = (res) => {
    waitTime = res.data.auctionInfo.endTime - new Date().getTime() - time;
    document.getElementById('M_waitTime').innerText = waitTime + 'ms';
    console.log(waitTime);
    main();
}
ajax({
    url: 'https://used-api.jd.com/auction/detail',
    jsonp: 'success',
    type: 'GET',
    data: {'auctionId': window.location.href.split('/')[4]},
    success: (res) => {
        waitTime = res.data.auctionInfo.endTime - new Date().getTime() - time;
        document.getElementById('M_waitTime').innerText = waitTime + 'ms';
        console.log(waitTime);
        main();
    },
    error: function (error) {
    }
});
// }
let oldRecordId;
let txt = document.createElement('h1');
txt.innerHTML = '当前价格:<span id="M_price"></span><br>最高出价:' + maxPrice + '<br>等待时间:<span id="M_waitTime"></span>';
txt.style.position = 'fixed';
txt.style.left = 0;
txt.style.top = 0;
txt.style.zIndex = 99999;
txt.style.background = '#ccc';
txt.style.border = '2px solid #000';
txt.style.append = '10px 20px';
txt.style.lineHeight = '40px';
document.body.appendChild(txt);

function ajax(params) {
    params = params || {};
    params.data = params.data || {};
    var json = params.jsonp ? jsonp(params) : json(params);

    function jsonp(params) {
        var callbackName = params.jsonp;
        var head = document.getElementsByTagName('head')[0];
        params.data['callback'] = callbackName;
        var data = formatParams(params.data);
        var script = document.createElement('script');
        head.appendChild(script);
        window[callbackName] = function (json) {
            head.removeChild(script);
            clearTimeout(script.timer);
            window[callbackName] = null;
            params.success && params.success(json);
        };
        script.src = params.url + '?' + data;
        if (params.time) {
            script.timer = setTimeout(function () {
                window[callbackName] = null;
                head.removeChild(script);
                params.error && params.error({
                    message: '超时'
                });
            }, time);
        }
    }

    function formatParams(data) {
        var arr = [];
        for (var name in data) {
            arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
        }
        arr.push('v=' + random());
        return arr.join('&');
    }

    function random() {
        return Math.floor(Math.random() * 10000 + 500);
    }
}

ajax({
    url: 'https://used-api.jd.com/auctionRecord/getCurrentAndOfferNum',
    jsonp: 'cb',
    type: 'GET',
    data: {'auctionId': window.location.href.split('/')[4]},
    success: function (res) {
        let curr = res.data.currentPrice;
        document.getElementById('M_price').innerText = curr;
    },
    error: function (error) {
    }
});

let main = () => {
    console.log('fuck', waitTime);
    setTimeout(() => {
        console.log(new Date().getTime());
        chujia(maxPrice);
        // let timer = setInterval(function () {
        //     function cb(msg) {
        //         console.log(msg);
        //     }
        //
        //     ajax({
        //         url: 'https://used-api.jd.com/auctionRecord/getCurrentAndOfferNum',
        //         jsonp: 'cb',
        //         type: 'GET',
        //         data: {'auctionId': window.location.href.split('/')[4]},
        //         success: function (res) {
        //             let curr = res.data.currentPrice;
        //             document.getElementById('M_price').innerText = curr;
        //             if ((curr + 1) > maxPrice) {
        //                 console.log('已超出最高价，停止抢购');
        //                 clearInterval(timer);
        //             }
        //             if ((curr + 1) <= maxPrice && res.data.auctionRecordId !== oldRecordId) {
        //                 chujia(curr + 1);
        //             }
        //         },
        //         error: function (error) {
        //         }
        //     });
        // }, 50);
        // setTimeout(() => {
        //     if(timer) {
        //         clearInterval(timer);
        //     }
        // }, 7000);
    }, waitTime);
}


function cb(msg) {
    console.log(msg);
}

function chujia(price) {
    function cb(msg) {
        console.log(msg);
    }

    ajax({
        url: 'https://used-api.jd.com/auctionRecord/offerPrice',
        jsonp: 'cb',
        type: 'GET',
        data: {'auctionId': window.location.href.split('/')[4], 'price': price},
        success: function (res) {
            console.log('出价成功');
            ajax({
                url: 'https://used-api.jd.com/auctionRecord/getCurrentAndOfferNum',
                jsonp: 'cb',
                type: 'GET',
                data: {'auctionId': window.location.href.split('/')[4]},
                success: function (res) {
                    oldRecordId = res.data.auctionRecordId;
                },
                error: function (error) {
                }
            });
        },
        error: function (error) {
        }
    })
}
