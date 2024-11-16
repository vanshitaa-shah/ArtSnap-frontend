/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import { clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import { precacheAndRoute } from 'workbox-precaching';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { imageCache } from 'workbox-recipes';
import { NetworkFirst, NetworkOnly } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';


import { ART_STORE, clearAllData, writeData } from '@/lib/indexDb';

clientsClaim();

self.addEventListener('activate', () => self.skipWaiting());

// precache manifest assets
precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  // Match all navigation and same-origin requests
  ({ request, url }) => request.mode === 'navigate' || url.origin === self.location.origin,
  new NetworkFirst({
    cacheName: 'artsnap-dynamic-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200]
      })
    ]
  })
);


// cache images using cache first strategy
imageCache();



// store arts in indexedDB
registerRoute(
  'https://pwagram-14946-default-rtdb.firebaseio.com/arts.json',
  async (e) => {
    return fetch(e.request).then((response) => {
      const clonedResponse = response.clone();
      // clear existing arts from indexDB
      clearAllData(ART_STORE)
        .then(() => clonedResponse.json())
        .then((data) => {
          // write each art in indexedDB
          for (const key in data) {
            writeData(ART_STORE, data[key]);
          }
        });
      return response;
    });
  }
);

// plugin for background sync to store failed requests
// in indexedDB, retry request when connectivity established
const bgSyncPlugin = new BackgroundSyncPlugin('art-post-sync', {
  maxRetentionTime: 24 * 60,

  // callback to run when syncing starts
  onSync: async ({ queue }) => {
    let entry;
    // shift each request from queue and upload it
    while ((entry = await queue.shiftRequest())) {
      try {
        const options: NotificationOptions = {
          body: 'Syncing posts in background',
          icon: '/favicon.svg',
          dir: 'ltr',
          lang: 'en-US',
          badge: '/favicon.svg',
        };

        self.registration.showNotification('Syncing art post', options);
        await fetch(entry.request.clone());
      } catch (error) {
        // if request fails, again add it in queue
        const options: NotificationOptions = {
          body: 'Posts failed to sync, will retry later',
          icon: '/favicon.svg',
          dir: 'ltr',
          lang: 'en-US',
          badge: '/favicon.svg',
        };

        self.registration.showNotification('Syncing failed', options);

        await queue.unshiftRequest(entry);
        throw error;
      }
    }
  },
});

// attach background sync plugin to post request
registerRoute(
  ({ url }) =>
    url.pathname === '/postArt' ,
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  'POST'
);

// listen to push notification that comes from backend
self.addEventListener('push', (event) => {
  // default notification data
  let data = {
    title: 'New!',
    content: 'Something new happened',
    url: '/',
  };
  if (event.data) {
    data = JSON.parse(event.data.text());
  }
  
  const options: NotificationOptions = {
    body: data.content,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: {
      url: data.url,
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// listen to clicks on notification
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const action = event.action;

  console.log('Notification clicked', action);

  // if confirm action is clicked
  if (action === 'confirm') {
    notification.close();
  } else {
    // if notification is clicked
    event.waitUntil(
      // get current client with visible state
      self.clients.matchAll({ type: 'window' }).then((clients) => {
        const client = clients.find((c) => c.visibilityState === 'visible');

        // if client is not undefined, navigate user to it
        if (client !== undefined) {
          client.navigate(notification.data.url);
          client.focus();
        } else {
          // if client is undefined, open new window
          self.clients && self.clients.openWindow(notification.data.url);
        }
        notification.close();
      })
    );
    notification.close();
  }
});
