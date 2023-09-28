/**
 * @typedef {import("../pod/LogLine.js").default} LogLine
 * @typedef {import("../promises/CancellationToken.js").default} CancellationToken
 **/


class LogLocalDb {
    /**
     * @param {string} filename
     * @param {number} lineIndex
     * @param {CancellationToken} cancel 
     * @returns {Promise<LogLine>}
     */
    async getLine(filename, lineIndex, cancel) {
        throw new Error("Abstract method call");
    }

    /**
     * @param {string} filename
     * @param {number} lineIndex 
     * @param {CancellationToken} cancel 
     * @returns {Promise<number>}
     */
    async getLineByteOffset(filename, lineIndex, cancel) {
        throw new Error("Abstract method call");
    }

    /**
     * @param {string} filename
     * @param {number} byteStart
     * @param {number} byteLength
     * @param {CancellationToken} cancel 
     * @returns {Promise<ArrayBuffer>}
     */
    async getData(filename, byteStart, byteLength, cancel) {
        throw new Error("Abstract method call");
    }
};

export default LogLocalDb;