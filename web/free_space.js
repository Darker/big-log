const quota = await navigator.storage.estimate();
const totalSpace = quota.quota;
const usedSpace = quota.usage;