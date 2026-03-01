// The Master's Background Service Worker

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// 1. BACKGROUND SYNC: Silently sends queued data when she gets internet connection
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-master-data') {
        event.waitUntil(
            // In a full implementation, this loops through an IndexedDB queue 
            // and pushes her offline keystrokes/actions to Firebase.
            console.log("Syncing offline submissive data to Master...")
        );
    }
});

// 2. PUSH API: Remote Wakeup & Un-swipeable Notifications
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: "Master Commands You", body: "Return to the Altar." };
    
    const options = {
        body: data.body,
        icon: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&q=80',
        badge: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&q=80',
        vibrate: [200, 100, 200, 100, 500], // Aggressive vibration pattern
        requireInteraction: true, // Forces her to click it; she cannot just swipe it away
        data: { url: '/' }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Force open the app when she clicks the notification
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            if (windowClients.length > 0) {
                windowClients[0].focus();
            } else {
                clients.openWindow('/');
            }
        })
    );
});