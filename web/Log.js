

class Log {
    /**
     * 
     * @param {Document} document 
     */
    constructor(document) {
        this.document = document;

        this.viewport = this.document.body;
    }

    init() {
        while(this.viewport.firstChild) {
            this.viewport.removeChild(this.viewport.firstChild);
        }
        this.logView = this.document.createElement("div");
        
    }
}

export default Log;