"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = __importStar(require("shardus-crypto-utils"));
crypto.init('69fa4195670576c0160d660c3be36556ff8d504725be8a59b5a96509e0c994bc');
function hex2bin(hex) {
    let bin = '';
    for (let i = 0; i < hex.length; i++) {
        bin += parseInt(hex[i], 16)
            .toString(2)
            .padStart(4, '0');
    }
    return bin;
}
process.on('message', ({ seed, difficulty }) => {
    let nonce, hash;
    do {
        nonce = crypto.randomBytes();
        hash = crypto.hashObj({ seed, nonce });
    } while (parseInt(hex2bin(hash).substring(0, difficulty), 2) !== 0);
    process.send({
        nonce,
        hash,
    });
});
//# sourceMappingURL=computePowGenerator.js.map