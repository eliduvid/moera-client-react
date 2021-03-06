export default class EmojiList {

    constructor(str) {
        const list = str ? str.split(",").map(s => s.trim()) : [];
        this._other = list.includes("*");
        this._included = list.filter(s => s !== "*").map(v => parseInt(v));
        this._includedSet = new Set(this._included);
        this._recommended = list.filter(s => s.startsWith("+")).map(v => parseInt(v));
        this._recommendedSet = new Set(this._recommended);
    }

    other() {
        return this._other;
    }

    included() {
        return this._included;
    }

    includes(emoji) {
        return this._other || this._includedSet.has(emoji);
    }

    includesExplicitly(emoji) {
        return this._includedSet.has(emoji);
    }

    recommended() {
        return this._recommended;
    }

    recommends(emoji) {
        return this._recommendedSet.has(emoji);
    }

}
