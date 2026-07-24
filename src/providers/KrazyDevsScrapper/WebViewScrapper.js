import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

const isPlayableUrl = url => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const clean = url.split('?')[0].toLowerCase();
  return clean.includes('.m3u8') || clean.endsWith('.mp4') || clean.endsWith('.mkv') || clean.endsWith('.webm') || clean.endsWith('.ts');
};

const buildInjectedScript = () => `
(function () {
  if (window.__LATCHI_PLAY_SCRAPPER__) {
    true;
    return;
  }
  window.__LATCHI_PLAY_SCRAPPER__ = true;

  var sent = {};
  function send(type, payload) {
    try {
      window.ReactNativeWebView.postMessage(JSON.stringify(Object.assign({ type: type }, payload || {})));
    } catch (error) {}
  }

  function maybeSend(url, source) {
    if (!url || typeof url !== 'string') return;
    var lower = url.toLowerCase();
    var playable = lower.indexOf('.m3u8') !== -1 || /\.(mp4|mkv|webm|ts)(\?|$)/.test(lower);
    if (!playable || sent[url]) return;
    sent[url] = true;
    send('video', {
      video: url,
      source: source || 'webview',
      headers: {
        Referer: window.location.href,
        Origin: window.location.origin
      }
    });
  }

  var originalFetch = window.fetch;
  if (originalFetch) {
    window.fetch = function(input, init) {
      var url = typeof input === 'string' ? input : (input && input.url);
      maybeSend(url, 'fetch');
      return originalFetch.apply(this, arguments).then(function(response) {
        maybeSend(response && response.url, 'fetch-response');
        return response;
      });
    };
  }

  var originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    maybeSend(url, 'xhr');
    return originalOpen.apply(this, arguments);
  };

  function inspectDom() {
    try {
      var elements = document.querySelectorAll('video, source');
      for (var i = 0; i < elements.length; i++) {
        maybeSend(elements[i].src || elements[i].currentSrc, 'dom-video');
      }

      if (window.performance && performance.getEntriesByType) {
        var entries = performance.getEntriesByType('resource') || [];
        for (var j = 0; j < entries.length; j++) {
          maybeSend(entries[j].name, 'performance');
        }
      }
    } catch (error) {}
  }

  setInterval(inspectDom, 1000);
  document.addEventListener('DOMContentLoaded', inspectDom);
  window.addEventListener('load', inspectDom);
  send('ready', { url: window.location.href });
  true;
})();
true;
`;

const WebViewScrapper = ({ websiteUrl, onDataExtracted, onLoading }) => {
  const hasExtracted = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    hasExtracted.current = false;
    onLoading?.(true);

    timeoutRef.current = setTimeout(() => {
      if (!hasExtracted.current) {
        onLoading?.(false);
        onDataExtracted?.({ error: 'Timed out while extracting video URL' });
      }
    }, 35000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [websiteUrl]);

  const complete = data => {
    if (hasExtracted.current || !data?.video || !isPlayableUrl(data.video)) {
      return;
    }

    hasExtracted.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onLoading?.(false);
    onDataExtracted?.(data);
  };

  const handleMessage = event => {
    try {
      const msg = event.nativeEvent?.data || '';
      console.log('WebViewScrapper message:', msg);
      const data = JSON.parse(msg);
      console.log('WebViewScrapper parsed data:', data);
      if (data?.type === 'video') {
        complete(data);
      } else if (data?.type === 'ready') {
        console.log('WebViewScrapper ready:', data.url);
      } else if (data?.error) {
        console.warn('WebViewScrapper site error:', data);
      }
    } catch (error) {
      console.log('WebViewScrapper non-JSON message:', event.nativeEvent?.data);
    }
  };

  const handleRequest = request => {
    if (isPlayableUrl(request.url)) {
      complete({
        type: 'video',
        video: request.url,
        source: 'navigation-request',
        headers: {
          Referer: websiteUrl,
          Origin: 'https://www.vidfast.pro',
        },
      });
      return false;
    }

    return true;
  };

  if (!websiteUrl) {
    return null;
  }

  return (
    <View
      style={{
        width: 1,
        height: 1,
        opacity: 0.01,
        position: 'absolute',
        left: -10,
        top: -10,
      }}
      pointerEvents="none">
      <WebView
        source={{ uri: websiteUrl }}
        injectedJavaScriptBeforeContentLoaded={buildInjectedScript()}
        injectedJavaScript={buildInjectedScript()}
        onMessage={handleMessage}
        onShouldStartLoadWithRequest={handleRequest}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={['*']}
        mixedContentMode="always"
        onLoadEnd={() => onLoading?.(false)}
        onError={() => onLoading?.(false)}
      />
    </View>
  );
};

export default WebViewScrapper;
