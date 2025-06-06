const tt = () => {console.log('tt')};
const yy = () => {console.log('yy')};

const loop = () => ({
    _arr : [],

    do(fn){
        this._arr.push(fn);
        return this;
    },

    run(n){
        if( n === 0 ) return this;

        this._arr.forEach(fn => fn());
        
        return this.run(n-1);
    }
});


const _loop = loop()
                .do(tt)
                .do(yy)
                .run(3);