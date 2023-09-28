import CancellationError from "./CancellationError.js";

class CancellationToken {
    constructor() {
        // callbacks to be executed upon cancellation
        /** @type {()=>{}[]} **/
        this.cancellations = [];
        this._isCancelled = false;
    }
    cancel() {
        if(!this._isCancelled) {
            this._isCancelled = true;
            let errors = [];
            for(const cb of this.cancellations) {
                try {
                    cb();
                }
                catch(e) {
                    errors.push(e);
                }
            }
            if(errors.length > 0) {
                throw new CancellationError(errors);
            }
        }
    }
};

export default CancellationToken;