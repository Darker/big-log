import idbRequestPromise from "../promises/idbRequestPromise.js";
import LogLocalDb from "./LogLocalDb.js";

class LogIndexedDb extends LogLocalDb {
    /**
     * @param {LogReadRange} dataLoader 
     * @param {string} databaseName
     */
    constructor(dataLoader, databaseName) {
        this.loader = dataLoader;

        this.idbRequestPromise = idbRequestPromise(databaseName, 1);
        /** @type {IDBDatabase} **/
        this._db = null;
    }

    async getDb() {
        if(!this._db) {
            const result = await this.idbRequestPromise;
            if(result.upgradeNeeded) {
                throw new Error("Upgrade not implemented!");
            }
            this._db = result.db;
        }
        return this._db;
    }

    
};

export default LogIndexedDb;