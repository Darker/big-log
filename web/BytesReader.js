
/**
 * @template TBytes
 * @typedef {Object} BytesChunk
 * @prop {TBytes|undefined} chunk undefined if done
 * @prop {boolean} done
 */

/**
 * @template TBytes
 */
class BytesReader {
    /**
     * @returns {Promise<BytesChunk>}
     */
    async read() {}
    async cancel() {}
    releaseLock() {}
};

export default BytesReader;