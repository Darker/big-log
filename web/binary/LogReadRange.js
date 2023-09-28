
/**
 * @typedef {import("../promises/CancellationToken.js").default} CancellationToken
 **/
/**
 * This interface represents a pull-style reader, meaning you request a range and it will try to read it
 */
class LogReadRange {
    constructor() {}
    /**
     * 
     * @param {number} start 
     * @param {number} length 
     * @param {CancellationToken} cancel 
     */
    async read(start, length, cancel) {}
};

export default LogReadRange;