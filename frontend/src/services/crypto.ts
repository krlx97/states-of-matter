declare const CryptoJS: any;

class CryptoService {
  private readonly _crypto: any;

  constructor () {
    this._crypto = CryptoJS;
  }

  decrypt (private_key_hash: string, password: string): string {
    const {_crypto} = this;
    const decrypted = _crypto.AES.decrypt(private_key_hash, password);
    return decrypted.toString(_crypto.enc.Utf8);
  }

  encrypt (privateKey: string, password: string): string {
    return this._crypto.AES.encrypt(privateKey, password).toString();
  }
}

const cryptoService = new CryptoService();

export default cryptoService;