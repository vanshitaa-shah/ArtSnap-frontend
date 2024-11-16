import { urlBase64ToUint8Array } from "./helpers";

const INSTALL_PROMPT_KEY = 'pwa-install-prompt';

interface InstallPromptState {
  outcome: 'accepted' | 'dismissed';
  timestamp: number;
}

export const askForInstallation = async (e: Event | null) => {
  if (!e) return;
  
  const savedChoice = localStorage.getItem(INSTALL_PROMPT_KEY);
  if (savedChoice) {
    const state: InstallPromptState = JSON.parse(savedChoice);
    
    // If previously accepted, never show again
    if (state.outcome === 'accepted') return;
    
    // If dismissed, only show after 30 days
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    if (state.outcome === 'dismissed' && 
        Date.now() - state.timestamp < thirtyDaysInMs) {
      return;
    }
  }

  let installPrompt = e as any;
  installPrompt.prompt();
  const choiceResult = await installPrompt.userChoice;
  
  // Store the user's choice
  const promptState: InstallPromptState = {
    outcome: choiceResult.outcome,
    timestamp: Date.now()
  };
  localStorage.setItem(INSTALL_PROMPT_KEY, JSON.stringify(promptState));

  if (choiceResult.outcome === "dismissed") {
	//TODO: show a notification to the user
  } else {
	//TODO: show a notification to the user
  }
  
  installPrompt = null;
  return choiceResult;
};

// function to add push subscription
export const configurePushSub = async () => {
	try {
		if (!navigator.serviceWorker) return;
		const serviceWorker = await navigator.serviceWorker.ready;
		const subscription = await serviceWorker.pushManager.getSubscription();
		

		if (subscription === null) {
			if (!import.meta.env.VITE_VAPID_PUB_KEY) {
				alert("No vapid key found");
				return;
			}

			// no subscription key found, create new
			const vapidPublicKey = import.meta.env.VITE_VAPID_PUB_KEY;
			const newSubscription = await serviceWorker.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
			});

			const url = `${import.meta.env.VITE_DATABASE_URL}/subscriptions.json`;

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(newSubscription),
			});

			if (response.ok) {
				displayConfirmNotification();
			}
		}
	} catch (error) {
		console.error("[NOTIFICATION]", error);
	}
};

// function to display notification message of confirmation
export const displayConfirmNotification = async () => {
	if ("serviceWorker" in navigator) {
		const options: NotificationOptions = {
			body: "You have successfully subscribed the notification services",
			icon: "/favicon.svg",
			dir: "ltr",
			lang: "en-US",
			badge: "/favicon.svg",
			tag: "confirm-notification",
		};

		const swreg = await navigator.serviceWorker.ready;
		swreg.showNotification("Successfully subscribed", options);
	}
};
