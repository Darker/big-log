import LogIndex from "./LogIndex.js";
import line_iterator from "./line_iterator.js";

(async () => {
    const response = await fetch("sample/evts.csv");
    //const response = await fetch("test.html");
    const expectedLength = response.headers.get("Content-Length");
    let all = new Uint8Array(new ArrayBuffer(expectedLength));

    console.log("Expecting ", expectedLength, "bytes");

    const reader = response.body.getReader();
    // approximate expected amount of lines
    const expectedLines = Math.max(20, Math.round(expectedLength/35))
    let lineCacheStart = new Uint32Array(expectedLines);
    let lineCacheLen = new Uint16Array(expectedLines);
    let cacheOff = 0;
    let dataOff = 0;

    let expansions = 0;

    for await (const lineinfo of line_iterator(reader)) {
        //console.log(lineinfo);
        //console.log({dataOff, start:lineinfo.start});

        lineCacheStart[cacheOff] = lineinfo.start;
        lineCacheLen[cacheOff] = lineinfo.end-lineinfo.start;
        ++cacheOff;

        if(all.length < lineinfo.buffer.length+dataOff) {

            console.warn("Exceeded initial buffer! Adding",lineinfo.buffer.length,"more bytes");
            const newAll = new Uint8Array(new ArrayBuffer(all.length+lineinfo.buffer.length));
            newAll.set(all, 0);
            all = newAll;
            if(++expansions > 3)
                break;
        }
        all.set(lineinfo.buffer, dataOff);
        dataOff += lineinfo.buffer.length;
    }
    console.log("Reading done, total lines: ", cacheOff);
    console.log("              total bytes: ", dataOff);

    function getLine(lineIndex) {
        const utf8Decoder = new TextDecoder("utf-8");
        const start = lineCacheStart[lineIndex];
        const end = lineCacheLen[lineIndex] + start;
        //console.log("Reading range",start," > ",end)
        return utf8Decoder.decode(all.subarray(start, end)).replace(/\n/g,"\\n").replace(/\r/g,"\\r");
    }

    window.addEventListener("getLine", (e)=>{
        const lineIndex = e.detail;
        const utf8Decoder = new TextDecoder("utf-8");
        const start = lineCacheStart[lineIndex];
        const end = lineCacheLen[lineIndex] + start;
        console.log("Reading range",start," > ",end)
        console.dir(utf8Decoder.decode(all.subarray(start, end)).replace(/\n/g,"\\n").replace(/\r/g,"\\r"));
    });

    // floating view
    const mainView = document.createElement("div");
    
    // set a line haight
    const lineHeight = 18;
    const allLinesHeight = cacheOff * lineHeight;
    // how much of the log floater is hidden behind the top of the screen
    let topAreaHidden = 120;

    mainView.style.minHeight = `${allLinesHeight+50}px`;
    mainView.style.height = `${allLinesHeight+50}px`;
    mainView.appendChild(new Text("\xa0"+allLinesHeight));
    mainView.className = "main";

    const floating = document.createElement("div");
    floating.style.position = "fixed";
    floating.className = "floating";
    floating.appendChild(new Text("\xa0"));

    document.body.appendChild(mainView);
    document.body.appendChild(floating);

    const rect = floating.getBoundingClientRect();
    console.log(rect.height);
    // check how many lines can fit
    const linesFit = Math.floor(rect.height / lineHeight);


    const onlySpaces = /^ +$/;
    function lineSafeText(lineIndex) {
        if(lineIndex >= 0 && lineIndex < cacheOff) {
            let text = getLine(lineIndex);
            if(text.length == 0 || onlySpaces.exec(text)) {
                text += "\xa0";
            }
            return text;
        }
        else {
            return "\xa0";
        }
    }

    function drawLines(lineOffset = 0) {
        let i = 0;
        for(const ch of floating.querySelectorAll(".line")) {
            
            ch.firstChild.data = lineSafeText(i+lineOffset);

            ++i;
            if(i >= linesFit) {
                i = -1;
                break;
            }
        }
        if(i >= 0) {

            for(;i<linesFit;++i) {
                let line = document.createElement("div");
                line.appendChild(new Text(lineSafeText(i+lineOffset)));
                line.className = "line";
                line.style.maxHeight = `${lineHeight}px`
                floating.appendChild(line);
            }
        }
    }

    // line position calculation - offset from scroll top (Y=0)
    function lineFromScroll(offset) {
        offset -= topAreaHidden;
        // magic number, this is how much pixels were hidden behind top of the screen
        offset -= 100;
        // slight additional offset from the top
        offset -= 30;
        const index = Math.floor(offset / lineHeight);
        return index;
    }
    window.moveView = function(offset) {
        floating.style.top = (floating.getBoundingClientRect().top+offset) + "px";
        const top = floating.getBoundingClientRect().top+offset;

        const line = lineFromScroll(top);
        drawLines(line);
    }
    window.updateView = function() {
        const top = floating.getBoundingClientRect().top;
        const scrollTop = window.scrollY;

        // we want alignment between scroll and our fixed div
        let baseTop = -topAreaHidden;
        let undividedScroll = scrollTop % lineHeight;
        console.log(undividedScroll)
        let finalTop = baseTop - undividedScroll;

        const scrollFullLines = Math.floor(scrollTop/lineHeight);
        const scrollFullLinesPx = scrollFullLines * lineHeight;

        let firstLoadedLine = lineFromScroll(scrollFullLinesPx - baseTop);

        floating.style.top = `${finalTop}px`;

        drawLines(firstLoadedLine);
    }
    window.updateView();
    window.addEventListener("scroll", updateView);
})();