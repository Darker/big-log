const ASCII_NEWLINE = "\n".charCodeAt(0);
const ASCII_CARRIAGE_RETURN = "\r".charCodeAt(0);
const EMPTY_UINT8_ARR = new Uint8Array();

/**
 * 
 * @param {ReadableStreamDefaultReader<Uint8Array>} dataReader
 */
async function* line_iterator(dataReader) {
    const utf8Decoder = new TextDecoder("utf-8");

    let { value: chunk, done: readerDone } = await dataReader.read();
    chunk = chunk ? chunk : EMPTY_UINT8_ARR;
  
    // byte offset of the location where the last line ended
    // This includes any newLine chars etc, this is simply the byte after the last one consumed
    let startIndex = 0;

    // Previous chunks without a newLine
    /** @type {Uint8Array[]} **/
    let oldChunks = [];

    function sumSize() {
        let size = 0;
        for(const ch of oldChunks) {
            size += ch.byteLength;
        }
        return size;
    }

    /**
     * Merge all old chunks into this buffer, return total offset
     * @param {Uint8Array} targetBuffer 
     */
    function mergeChunks(targetBuffer) {
        let offsetFromStart = 0;
        for(const ch of oldChunks) {
            targetBuffer.set(ch, offsetFromStart);
            offsetFromStart += ch.byteLength;
        }
        return offsetFromStart;
    }

    while (true) {
        // if(startIndex > 1000) {
        //     break;
        // }
        let newLine = -1;
        let newLineStart = -1;
        let newLineSuccess = false;
        const chunkSize = chunk.length;
        // find new line
        for(let i=0; i<chunkSize; ++i) {
            // check for carriage return, adnvance newLine if found
            if(newLine >= 0) {
                if(chunk[i] == ASCII_NEWLINE) {
                    ++newLine;
                    //console.log("New line moved due to cr: ", startIndex + newLine);
                }
                newLineSuccess = true;
                break;
            }
            if((chunk[i] == ASCII_NEWLINE || chunk[i] == ASCII_CARRIAGE_RETURN) && i+1 < chunkSize) {
                newLine = i * chunk.BYTES_PER_ELEMENT;
                newLineStart = newLine;
                
                // new line character means immediate return, but with cr we wait for lf
                if(chunk[i] == ASCII_NEWLINE) {
                    newLineSuccess = true;
                    break;
                }
            }
        }

        if (!newLineSuccess) {
            if (readerDone) break;

            oldChunks.push(chunk);
            ({ value: chunk, done: readerDone } = await dataReader.read());
            if(readerDone) {
                break;
            }
            //console.log("Loaded", chunk.byteLength, "bytes");
            continue;
            // let remainder = chunk.substr(startIndex);
            // ({ value: chunk, done: readerDone } = await reader.read());
            // chunk = remainder + (chunk ? utf8Decoder.decode(chunk) : "");
            // startIndex = re.lastIndex = 0;
            // continue;
        }

        // construct the result string and drop anything, that was read
        {
            const oldSize = sumSize();
            const resBuffer = new Uint8Array(new ArrayBuffer(oldSize+newLine+1));
            // add all old chunks
            const offsetFromStart = mergeChunks(resBuffer);
            console.assert(offsetFromStart == oldSize);

            resBuffer.set(chunk.subarray(0, newLine+1), offsetFromStart);

            // how many bytes to remove from the string
            const newLineOffset = newLine - newLineStart + 1;

            yield {
                buffer: resBuffer,
                str: utf8Decoder.decode(resBuffer.subarray(0, newLineStart)),
                start: startIndex,
                end: startIndex+resBuffer.length-newLineOffset,
                endGlobal: startIndex+resBuffer.length
            };
            startIndex += resBuffer.length;

            oldChunks.length = 0;
            // split the current buffer if needed
            if(newLine+1 < chunk.length) {
                const remainder = new Uint8Array(new ArrayBuffer(chunk.byteLength - newLine-1));
                remainder.set(chunk.subarray(newLine+1), 0);
                //console.log("Keeping ",remainder.length,"/",chunk.length,"bytes from current chunk.");
                chunk = remainder;
            }
            else {
                chunk = EMPTY_UINT8_ARR;
            }
        }
    }

    const remainsInChunk = chunk ? chunk.length : 0;
  
    if (startIndex < remainsInChunk || oldChunks.length > 0) {
        const oldSize = sumSize();
        let resBuffer = new Uint8Array(new ArrayBuffer(oldSize+remainsInChunk));
        const offsetFromStart = mergeChunks(resBuffer);
        if(chunk)
            resBuffer.set(chunk, offsetFromStart);
        // Last line didn't end in a newLine char
        const end = startIndex+resBuffer.byteLength;
        yield {buffer: resBuffer, str: utf8Decoder.decode(resBuffer), start: startIndex, end, endGlobal: end};
    }

}

export default line_iterator;