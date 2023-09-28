class LogLine {
    /**
     * 
     * @param {number} index Number of the line, zero indexed (so line 0 is really line #1)
     * @param {number} startByte 
     * @param {number} byteLength 
     * @param {number} startChar 
     * @param {number} charLength 
     * @param {ArrayBuffer} buffer 
     * @param {TextDecoder} decoder
     */
    constructor(index, startByte, byteLength, startChar, charLength, buffer, decoder) {
        // Zero indexed index of the line
        this.index = index;
        this.startByte = startByte;
        this.byteLength = byteLength;
        this.startChar = startChar;
        this.charLength = charLength;
        this.buffer = buffer;
        this.decoder = decoder;

        /** @type {string} will be lazy loaded **/
        this._str = null;
    }

    get stringContent() {
        if(!this._str) {
            if(!this.decoder) {
                throw new Error("string text not set and decoder is missing");
            }
            this._str = this.decoder.decode(this.buffer);
        }
        return this._str;
    }

    set stringContent(value) {
        if(this.decoder) {
            throw new Error("Cannot override string content when decoder is set");
        }
        if(typeof value !== "string") {
            throw new Error("Invalid value type "+(typeof value));
        }
        return this._str = value;
    }
};

export default LogLine;
