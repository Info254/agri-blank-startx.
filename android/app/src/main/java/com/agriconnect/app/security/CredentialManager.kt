package com.agriconnect.app.security

import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec
import com.agriconnect.app.BuildConfig

object CredentialManager {
    private const val TRANSFORMATION = "AES/GCM/NoPadding"
    private const val TAG_LENGTH = 128
    private const val KEY_ALIAS = "agriconnect_credential_key"
    private const val ANDROID_KEYSTORE = "AndroidKeyStore"

    fun getSupabaseUrl(): String {
        return decryptCredential(BuildConfig.SUPABASE_URL_ENCRYPTED)
    }

    fun getSupabaseKey(): String {
        return decryptCredential(BuildConfig.SUPABASE_KEY_ENCRYPTED)
    }

    private fun getOrCreateSecretKey(): SecretKey {
        val keyStore = KeyStore.getInstance(ANDROID_KEYSTORE)
        keyStore.load(null)

        // Try to get existing key
        if (keyStore.containsAlias(KEY_ALIAS)) {
            return keyStore.getKey(KEY_ALIAS, null) as SecretKey
        }

        // Create new key
        val keyGenerator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, ANDROID_KEYSTORE)
        val keyGenParameterSpec = KeyGenParameterSpec.Builder(
            KEY_ALIAS,
            KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
        )
            .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
            .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
            .setKeySize(256)
            .build()

        keyGenerator.init(keyGenParameterSpec)
        return keyGenerator.generateKey()
    }

    private fun decryptCredential(encryptedValue: String): String {
        try {
            // Decode base64 encrypted value
            val encryptedData = Base64.decode(encryptedValue, Base64.DEFAULT)
            
            // Extract IV and encrypted content
            val ivSize = 12 // GCM IV size
            val iv = encryptedData.sliceArray(0..ivSize-1)
            val encrypted = encryptedData.sliceArray(ivSize until encryptedData.size)
            
            // Get secret key from Android Keystore
            val secretKey = getOrCreateSecretKey()
            
            // Decrypt using AES/GCM
            val cipher = Cipher.getInstance(TRANSFORMATION)
            val spec = GCMParameterSpec(TAG_LENGTH, iv)
            cipher.init(Cipher.DECRYPT_MODE, secretKey, spec)
            
            val decryptedBytes = cipher.doFinal(encrypted)
            return String(decryptedBytes, Charsets.UTF_8)
        } catch (e: Exception) {
            throw SecurityException("Failed to decrypt credential", e)
        }
    }
}
