class Generators {
    constructor() {
        
    }

    /**
     * @template {T}
     * @param {IterableIterator<T>} iterable 
     * @param {number} itemsToSkip 
     */
    static *offset(iterable, itemsToSkip=0) {
        for(const x of iterable) {
            if(itemsToSkip <= 0) {
                yield x;
            }
            else {
                itemsToSkip--;
            }
        }
    }
};

export default Generators;