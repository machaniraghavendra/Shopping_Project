package com.shopping.query.command.service.implementation;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Service;

import com.shopping.query.command.service.SecurityService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class SecurityServiceImpl implements SecurityService {

	private static SecretKeySpec secretKey;

	private static byte[] key;

	private static final String ALGORITHM = "AES";

	public void prepareSecreteKey() {
		MessageDigest sha = null;
		final String myKey = "Shopping_Mart";
		try {
			key = myKey.getBytes(StandardCharsets.UTF_8);
			sha = MessageDigest.getInstance("SHA-1");
			key = sha.digest(key);
			key = Arrays.copyOf(key, 16);
			secretKey = new SecretKeySpec(key, ALGORITHM);
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
	}

	@Override
	public String encrypt(String toConvert) {
		try {
			prepareSecreteKey();
			Cipher cipher = Cipher.getInstance(ALGORITHM);
			cipher.init(Cipher.ENCRYPT_MODE, secretKey);
			return Base64.getEncoder().encodeToString(cipher.doFinal(toConvert.getBytes(StandardCharsets.UTF_8)));
		} catch (Exception e) {
			log.info("Error while encrypting: {}", e.toString());
		}
		return null;
	}

	@Override
	public String decrypt(String toConvert) {
		try {
			prepareSecreteKey();
			Cipher cipher = Cipher.getInstance(ALGORITHM);
			cipher.init(Cipher.DECRYPT_MODE, secretKey);
			return new String(cipher.doFinal(Base64.getDecoder().decode(toConvert)));
		} catch (Exception e) {
			log.info("Error while decrypting: {}", e.toString());
		}
		return null;
	}

}
