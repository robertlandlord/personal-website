// Function to encrypt content
function encryptContent(content, password) {
    return CryptoJS.AES.encrypt(content, password).toString();
}

// Function to decrypt content
function decryptContent(encryptedContent, password) {
    try {
        const decrypted = CryptoJS.AES.decrypt(encryptedContent, password);
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (e) {
        return '';
    }
} 