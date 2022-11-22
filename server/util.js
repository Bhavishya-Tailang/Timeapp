const je = require("nodejs-jsencrypt");

const encryptDecryptData = function(method, data, encryptionKey = '') {
    const jsencryptInstance = new je.JSEncrypt({ default_key_size: 256 });
    let prKey = '';
    if(encryptionKey !== '') prKey = encryptionKey
    else prKey = jsencryptInstance.getPrivateKey();
    jsencryptInstance.setPrivateKey(prKey)
    jsencryptInstance.getPublicKey()
    if(method === "encrypt"){
        const password = jsencryptInstance.encrypt(data)
        return {encryptionKey: prKey, password: password};
    }
    return jsencryptInstance.decrypt(data);
}

module.exports = encryptDecryptData;

// encryptDecryptData(operation, password);
// encryptDecryptData(operation, data[0]?.password, data[0]?.encryptionKey)

