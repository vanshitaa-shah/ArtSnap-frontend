import { openDB } from "idb";
export const ART_STORE = "arts";
export const SYNC = "back-sync";

const dbPromise = openDB("posts-store", 4, {
	upgrade: (db) => {
		if (!db.objectStoreNames.contains(ART_STORE)) {
			db.createObjectStore(ART_STORE, { keyPath: "id" });
		}
		if (!db.objectStoreNames.contains(SYNC)) {
			db.createObjectStore(SYNC, { keyPath: "id" });
		}
	},
});
export function writeData(st: string, data: unknown) {
	return dbPromise.then((db) => {
		const tx = db.transaction(st, "readwrite");
		const store = tx.objectStore(st);
		store.put(data);
		return tx.done;
	});
}
export function readAllData(st: string) {
	return dbPromise.then((db) => {
		const tx = db.transaction(st, "readonly");
		const store = tx.objectStore(st);
		return store.getAll();
	});
}

export function clearAllData(st: string) {
	return dbPromise.then((db) => {
		const tx = db.transaction(st, "readwrite");
		const store = tx.objectStore(st);
		store.clear();
		return tx.done;
	});
}

export function deleteItem(st: string, id: string) {
	return dbPromise.then((db) => {
		const tx = db.transaction(st, "readwrite");
		const store = tx.objectStore(st);
		store.delete(id);
		return tx.done;
	});
}
