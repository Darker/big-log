class CancellationError extends Error {
    constructor(nestedErrors) {
        super("Error in one or more cancellation callbacks");
        this.errors = nestedErrors instanceof Array ? nestedErrors : [nestedErrors];
    }
};

export default CancellationError;