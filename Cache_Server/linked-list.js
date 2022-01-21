class Cache {
    constructor(max = 100) {
        this.head = null
        this.tail = null
        this.len = 0
        this.maxLen = max
    }

    addToLast(cnK, cnV) {
        var node = new CacheNode(cnK, cnV, this.tail);
        if (this.head === null || this.tail === null) {
            this.head = node;
        }

        this.tail = node;
        this.len++;

        if (this.len > this.maxLen)
            this.removeFirst();
        return node;
    }

    removeFirst() {
        this.head = this.head.next;
        this.len--;
    }

    find(k) {
        var prev = null;
        for (let it = this.head; it !== undefined && it !== null; it = it.next) {
            const {
                key
            } = it;

            if (key === k)
                return {
                    prev: prev,
                    f: it
                }
            prev = it
        }
        return {
            prev: null,
            f: null
        };
    }

    getKey(k) {
        const {
            f
        } = this.find(k);

        return f !== null ? f.value : null;
    }

    setKey(k, newValue) {
        var {
            prev,
            f
        } = this.find(k)

        if (f === null) {
            f = this.addToLast(k, newValue)
        } else {
            f.value = newValue

            if (prev !== null)
                prev.next = f
        }
        return f;
    }

    clear() {
        this.head = null;
        this.tail = null;
        this.len = 0;
        return this;
    }

    all() {
        var res = []

        for (let it = this.head; it !== undefined && it !== null; it = it.next)
            res = [...res, {
                key: it.key,
                value: it.value
            }]

        return res
    }
}

class CacheNode {
    constructor(k, v, prev) {
        this.key = k;
        this.value = v;
        if (prev !== undefined && prev !== null)
            prev.next = this;
    }
}

module.exports = {
    Cache
}