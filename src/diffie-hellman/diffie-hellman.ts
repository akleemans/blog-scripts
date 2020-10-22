declare var angular: any;

enum Person {
    ALICE = 'Alice',
    BOB = 'Bob'
}

enum NumberSize {
    SMALL = 'Small',
    BIG = 'Big'
}

class DiffieHellmanCtrl implements ng.IOnInit {
    public me: Person = Person.ALICE;
    public numberSize: NumberSize = NumberSize.SMALL;

    public _p: bigint;
    public _g: bigint;
    public _a: bigint;
    public _b: bigint;
    public A: bigint;
    public B: bigint;
    public K: bigint;

    public $onInit(): void {
        console.log('Starting up!');
    }

    // Function for Alice
    public prepareAlice() {
        // Initialize primes based on number size
        if (this.numberSize === NumberSize.SMALL) {
            this._p = 23n;
            this._g = 5n;
            this._a = 4n;
        } else {
            // Group with id 14 from https://tools.ietf.org/html/rfc3526
            this._p = 32317006071311007300338913926423828248817941241140239112842009751400741706634354222619689417363569347117901737909704191754605873209195028853758986185622153212175412514901774520270235796078236248884246189477587641105928646099411723245426622522193230540919037680524235519125679715870117001058055877651038861847280257976054903569732561526167081339361799541336476559160368317896729073178384589680639671900977202194168647225871031411336429319536193471636533209717077448227988588565369208645296636077250268955505928362751121174096972998068410554359584866583291642136218231078990999448652468262416972035911852507045361090559n;
            this._g = 2n;
            this._a = this.getSecretNumber();
        }

        this.A = this.modExp(this._g, this._a, this._p);
    }

    // Function for Bob
    public prepareBob() {
        this._b = this.getSecretNumber();
        this.B = this.modExp(this._g, this._b, this._p);
    }

    // Gets a secret number, for example a or b.
    private getSecretNumber(): bigint {
        // https://tools.ietf.org/html/rfc5054#section-3.1: "The private values a and b SHOULD be at least 256-bit
        // random numbers, to give approximately 128 bits of security against certain methods of calculating discrete
        // logarithms.
        // TODO
        if (this.numberSize === NumberSize.SMALL) {
            return BigInt(Math.floor(Math.random() * 20));
        } else {
            return this.getBigRandomNumber();
        }
    }

    private getBigRandomNumber(): bigint {
        let array = new Uint32Array(8);
        window.crypto.getRandomValues(array);

        let s = '0x';
        for (let i = 0; i < array.length; i++) {
            s += array[i].toString(16);
        }

        return BigInt(s);
    }

    // Fast modular exponentiation for a ^ b mod n
    // from https://gist.github.com/krzkaczor/0bdba0ee9555659ae5fe
    private modExp(a: bigint, b: bigint, n: bigint) {
        a = a % n;
        let result: bigint = 1n;
        let x = a;
        while (b > 0) {
            let leastSignificantBit: bigint = b % 2n;
            b = b / 2n;
            if (leastSignificantBit == 1n) {
                result = result * x;
                result = result % n;
            }
            x = x * x;
            x = x % n;
        }
        return result;
    };
}

angular.module('DiffieHellmanApp', []).controller('DiffieHellmanCtrl', DiffieHellmanCtrl);
