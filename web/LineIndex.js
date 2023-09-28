
/**
 * @typedef {import("./BytesReader.js").default} BytesReader
 **/

class LineIndex {
    /**
     * @param {number} dataSize
     */
    constructor(dataSize) {
        this.dataSize = dataSize;
        const expectedLines = Math.max(255, dataSize/35);
        this.expectedLineCount = Number(expectedLines);
        this.lineCacheStart = new Uint32Array(this.expectedLineCount);
        this.lineCacheLen = new Uint16Array(this.expectedLineCount);
        this.linesRead = 0;
        this.bytesRead = 0;
        this.lineCount = -1;
        this.lineCountPrecise = false;
    }
};

export default LineIndex;