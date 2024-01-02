
    (function() {
      var baseURL = "https://cdn.shopify.com/shopifycloud/checkout-web/assets/";
      var scripts = ["https://cdn.shopify.com/shopifycloud/checkout-web/assets/runtime.latest.en.408828ee63fd3cd0db4f.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/362.latest.en.c3486f33125b202e0bec.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/441.latest.en.616a678ab319dd69a14d.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/598.latest.en.bb7e3ccc9128780c9738.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/app.latest.en.213e9775a2d74f3bfe2e.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/731.latest.en.13d4de92b88330e8fea9.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/958.latest.en.5650d8c92dd2c0e13401.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/844.latest.en.7fcd45ae446a9a5574e8.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/OnePage.latest.en.cbb4eb1a4161dc605ef6.js"];
      var styles = ["https://cdn.shopify.com/shopifycloud/checkout-web/assets/362.latest.en.18eecd205dabb9c44d0a.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/app.latest.en.e5a7f63ca146c0549466.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/958.latest.en.5f60c0e91d9d5d6ad7d1.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/74.latest.en.eb557fd11c539973a9ee.css"];
      var fontPreconnectUrls = ["https://fonts.shopifycdn.com"];
      var fontPrefetchUrls = ["https://fonts.shopifycdn.com/roboto/roboto_n4.da808834c2315f31dd3910e2ae6b1a895d7f73f5.woff2?valid_until=MTcwMzk5Nzg1Mg&hmac=089908d0019efb4019111719a3f5931287423067ff45c0ca666e5e0368850ab8","https://fonts.shopifycdn.com/roboto/roboto_n5.126dd24093e910b23578142c0183010eb1f2b9be.woff2?valid_until=MTcwMzk5Nzg1Mg&hmac=0e11adece6df682bb02661b9a37fd6b18bf23bed5e36d884024f00c6ffae8500","https://fonts.shopifycdn.com/raleway/raleway_n4.e721da6683e65ea8e217c48c3a4254b0476a6709.woff2?valid_until=MTcwMzk5Nzg1Mg&hmac=23ddefc4d6411bfd8ad545af8a9ee772e05dcdebd37aedb9ab878f2c9b129870","https://fonts.shopifycdn.com/raleway/raleway_n6.6c405c3e5d61f12e93db56d9d0f418c2881b8452.woff2?valid_until=MTcwMzk5Nzg1Mg&hmac=1d1eda3a5b85d8c0b840c3f080cbad929f3e599768dab164b5eaf7d54f59b0fb"];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0668/6706/9225/files/fetus-logo_x320.png?v=1667447245","https://cdn.shopify.com/s/files/1/0668/6706/9225/files/Nairalsaif_hea3_2000x.jpg?v=1673030071"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = [baseURL].concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res[0], next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        })();
      }

      function onLoaded() {
        preconnectAssets();
        prefetchAssets();
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  