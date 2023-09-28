
class IDBOpenError extends Error {
    constructor(code) {
        super("IndexedDB open error: "+code);
        this.code = code;
    }
}

/**
 * 
 * @param {string} databaseName name of the db to open
 * @param {number} version 0 by default
 * @returns {Promise<{db:IDBDatabase, upgradeNeeded:boolean, oldVersion: number?, newVersion: number?}, IDBOpenError>}
 */
function idbRequestPromise(databaseName, version = 1) {
    return new Promise(function(resolve, reject) {
        const req = window.indexedDB.open(databaseName, version);
        req.addEventListener("error", function(e) {
            reject(new IDBOpenError(event.target.errorCode));
        });
        req.addEventListener("upgradeneeded", function(e) {
            resolve({db: e.target.result, upgradeNeeded: true, oldVersion: e.oldVersion, newVersion: e.newVersion});
        });
        req.addEventListener("success", function(e) {
            resolve({db: e.target.result, upgradeNeeded: false});
        });
    });
};

export default idbRequestPromise;