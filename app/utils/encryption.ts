import CryptoJS from 'crypto-js';
import bcrypt from 'bcrypt';

// Define types for the encryption parameters and results
interface EncryptionResult {
  ciphertext: string;
  iv: string;
  salt: string;
}

interface DecryptionOptions {
  maxOutputLength?: number;  // Optional safety limit for output size
  timeout?: number;          // Optional timeout in milliseconds
}

interface SecureLogOptions {
  maskLength?: number;
}

/**
 * Class to handle encryption, decryption, and password hashing operations
 */
export class CryptoService {
  private static readonly ITERATION_COUNT = 10000;
  private static readonly KEY_SIZE = 256 / 32;
  private static readonly DEFAULT_MAX_OUTPUT_LENGTH = 1024 * 1024; // 1MB
  private static readonly DEFAULT_TIMEOUT = 5000; // 5 seconds
  private static readonly SALT_ROUNDS = 12; // bcrypt salt rounds

  /**
   * Encrypts data with a secret key
   * @param data - The data to encrypt (string or object)
   * @param secret - The secret key for encryption
   * @returns The encrypted data with IV and salt
   * @throws Error if encryption fails
   */
  static encrypt(
    data: string | object,
    secret: string
  ): EncryptionResult {
    try {
      // Input validation
      if (!data) {
        throw new Error('Data is required');
      }
      if (!secret || secret.length < 8) {
        throw new Error('Secret must be at least 8 characters long');
      }

      // Convert object to string if necessary
      const stringData = typeof data === 'object' 
        ? JSON.stringify(data) 
        : String(data);

      // Generate a random salt
      const salt = CryptoJS.lib.WordArray.random(128 / 8);

      // Generate key and IV
      const key = CryptoJS.PBKDF2(secret, salt, {
        keySize: this.KEY_SIZE,
        iterations: this.ITERATION_COUNT
      });
      const iv = CryptoJS.lib.WordArray.random(128 / 8);

      // Perform encryption
      const encrypted = CryptoJS.AES.encrypt(stringData, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      });

      return {
        ciphertext: encrypted.toString(),
        iv: iv.toString(),
        salt: salt.toString()
      };

    } catch (error) {
      throw new Error(
        `Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Decrypts encrypted data with a secret key
   * @param encryptedData - The encrypted data object
   * @param secret - The secret key for decryption
   * @param options - Optional decryption parameters
   * @returns The decrypted data
   * @throws Error if decryption fails
   */
  static decrypt(
    encryptedData: EncryptionResult,
    secret: string,
    options: DecryptionOptions = {}
  ): string {
    // Set up abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, options.timeout || this.DEFAULT_TIMEOUT);

    try {
      // Input validation
      if (!encryptedData?.ciphertext || !encryptedData.iv || !encryptedData.salt) {
        throw new Error('Invalid encrypted data structure');
      }
      if (!secret || secret.length < 8) {
        throw new Error('Invalid secret key');
      }

      // Generate key from salt and secret
      const key = CryptoJS.PBKDF2(secret, encryptedData.salt, {
        keySize: this.KEY_SIZE,
        iterations: this.ITERATION_COUNT
      });

      // Perform decryption
      const decrypted = CryptoJS.AES.decrypt(
        encryptedData.ciphertext,
        key,
        {
          iv: CryptoJS.enc.Hex.parse(encryptedData.iv),
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.CBC
        }
      );

      // Convert to string
      const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);

      // Validate output
      if (!decryptedStr) {
        throw new Error('Decryption failed: Invalid result');
      }

      const maxLength = options.maxOutputLength || this.DEFAULT_MAX_OUTPUT_LENGTH;
      if (decryptedStr.length > maxLength) {
        throw new Error(`Decrypted data exceeds maximum length of ${maxLength} bytes`);
      }

      return decryptedStr;

    } catch (error) {
      throw new Error(
        `Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Utility method to generate a secure random key
   * @param length - The desired length of the key
   * @returns A secure random key
   */
  static generateSecureKey(length: number = 32): string {
    return CryptoJS.lib.WordArray.random(length).toString();
  }

  /**
   * Hashes a password using bcrypt
   * @param password - The password to hash
   * @returns The hashed password
   * @throws Error if hashing fails
   */
  static async hashPassword(password: string): Promise<string> {
    try {
      if (!password || password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      throw new Error(
        `Password hashing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Verifies a password against a hashed password
   * @param password - The password to verify
   * @param hashedPassword - The hashed password to compare against
   * @returns True if the password matches, false otherwise
   * @throws Error if verification fails
   */
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error(
        `Password verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Securely logs sensitive data by masking it
   * @param data - The data to log
   * @param options - Optional logging parameters
   * @returns The masked data
   */
  private static secureLog(data: string, options: SecureLogOptions = {}): string {
    const maskLength = options.maskLength || 4;
    return data.slice(0, maskLength) + '****' + data.slice(-maskLength);
  }

  /**
   * Public wrapper method for secure logging
   * @param data - The data to log
   * @param options - Optional logging parameters
   * @returns The masked data
   */
  public static logSecurely(data: string, options: SecureLogOptions = {}): string {
    return this.secureLog(data, options);
  }
}

// Example usage
export const example = async (): Promise<void> => {
  try {
    // Encrypt data
    const data = { message: 'Hello, World!' };
    const secret = CryptoService.generateSecureKey();
    
    const encrypted = CryptoService.encrypt(data, secret);
    console.debug('Operation result:', CryptoService.logSecurely(JSON.stringify(encrypted)));

    // Decrypt data
    const decrypted = CryptoService.decrypt(encrypted, secret, {
      maxOutputLength: 1024,  // 1KB max output
      timeout: 3000          // 3 second timeout
    });
    console.log('Decrypted:', decrypted);

    // Hash password
    const password = 'securepassword123';
    const hashedPassword = await CryptoService.hashPassword(password);
    console.log('Hashed Password:', hashedPassword);

    // Verify password
    const isPasswordValid = await CryptoService.verifyPassword(password, hashedPassword);
    console.log('Password is valid:', isPasswordValid);

  } catch (error) {
    console.error('Crypto operation failed:', error);
  }
};