class BigMath {
    constructor() {
        
    }

    /**
     * 
     * @param  {...BigInt} numbers 
     */
    static max(...numbers) {
        if(numbers.length < 1) {
            throw new TypeError("Must provide at least one BigInt value");
        }
        let maxVal = numbers[0];
        for(const val of numbers) {
            if(maxVal < val) {
                maxVal = val;
            }
        }
        return maxVal;
    }
};

export default BigMath;