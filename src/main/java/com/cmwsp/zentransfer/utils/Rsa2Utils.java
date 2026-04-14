package com.cmwsp.zentransfer.utils;

import org.apache.commons.codec.binary.Base64;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.security.*;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.*;

/**
 * RSA2签名
 *
 * @author lifan
 */
public class Rsa2Utils {

  /**
   * 签名算法
   */
  public static final String SIGNATURE_ALGORITHM = "SHA256WithRSA";

  /**
   * 加密算法RSA
   */
  public static final String KEY_ALGORITHM = "RSA";

  /**
   * RSA keySize
   */
  @SuppressWarnings("unused")
  private static final int KEY_SIZE = 2048;

  /**
   * RSA最大加密明文大小
   */
  @SuppressWarnings("unused")
  private static final int MAX_ENCRYPT_BLOCK = 245;

  /**
   * RSA最大解密密文大小
   */
  @SuppressWarnings("unused")
  private static final int MAX_DECRYPT_BLOCK = 256;

  private Rsa2Utils() {
  }

  /**
   * 签名字符
   * 
   * @param text       要签名的字符
   * @param privateKey 私钥(BASE64编码)
   * @param charset    编码格式
   * @return 签名结果(BASE64编码)
   */
  public static String sign(String text, String privateKey, String charset) throws Exception {
    PKCS8EncodedKeySpec pkcs8EncodedKeySpec = new PKCS8EncodedKeySpec(decodeBase64(privateKey));
    KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
    PrivateKey pk = keyFactory.generatePrivate(pkcs8EncodedKeySpec);
    Signature signature = Signature.getInstance(SIGNATURE_ALGORITHM);
    signature.initSign(pk);
    signature.update(getContentBytes(text, charset));
    byte[] result = signature.sign();
    return Base64.encodeBase64String(result);
  }

  /**
   * 签名字符
   * 
   * @param text      要签名的字符
   * @param sign      客户签名结果
   * @param publicKey 公钥(BASE64编码)
   * @param charset   编码格式
   * @return 验签结果
   */
  public static boolean verify(String text, String sign, String publicKey, String charset) throws Exception {
    X509EncodedKeySpec x509EncodedKeySpec = new X509EncodedKeySpec(decodeBase64(publicKey));
    KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
    PublicKey pk = keyFactory.generatePublic(x509EncodedKeySpec);
    Signature signature = Signature.getInstance(SIGNATURE_ALGORITHM);
    signature.initVerify(pk);
    signature.update(getContentBytes(text, charset));
    return signature.verify(Base64.decodeBase64(sign));
  }

  private static byte[] getContentBytes(String content, String charset) {
    if (charset == null || "".equals(charset)) {
      return content.getBytes();
    }
    try {
      return content.getBytes(charset);
    } catch (UnsupportedEncodingException e) {
      throw new RuntimeException("签名过程中出现错,指定的编码集不对,您目前指定的编码集是:" + charset);
    }
  }

  public static final String EQUAL_FLAG = "=";

  public static final String CONTACT_FLAG = "&";

  /**
   * 把数组所有元素排序，并按照“参数=参数值”的模式用“&”字符拼接成字符串
   *
   * @param params 需要排序并参与字符拼接的参数组
   * @param encode 是否需要urlEncode
   * @return 拼接后字符串
   */
  public static String createLinkString(Map<String, String> params, boolean encode) {
    List<String> keys = new ArrayList<String>(params.keySet());
    Collections.sort(keys);
    String prestr = "";
    String charset = "UTF-8";
    for (int i = 0; i < keys.size(); i++) {
      String key = keys.get(i);
      String value = params.get(key);
      if (encode && value != null) {
        try {
          value = URLEncoder.encode(value, charset);
        } catch (UnsupportedEncodingException e) {
        }
      }
      // 拼接时，不包括最后一个&字符
      if (i == keys.size() - 1) {
        prestr = prestr + key + EQUAL_FLAG + value;
      } else {
        prestr = prestr + key + EQUAL_FLAG + value + CONTACT_FLAG;
      }
    }
    return prestr;
  }

  private static byte[] decodeBase64(String privateKey) {
    return Base64.decodeBase64(privateKey);
  }

  public static String privateKey;
  public static String publicKey;

  public static void initKey() throws Exception {
    KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
    keyPairGenerator.initialize(2048);
    KeyPair keyPair = keyPairGenerator.generateKeyPair();
    RSAPublicKey publicKeyo = (RSAPublicKey) keyPair.getPublic();
    RSAPrivateKey privateKeyo = (RSAPrivateKey) keyPair.getPrivate();
    privateKey = new String(java.util.Base64.getEncoder().encode(privateKeyo.getEncoded()));
    publicKey = new String(java.util.Base64.getEncoder().encode(publicKeyo.getEncoded()));
    System.out.println("public key is: " + new String(java.util.Base64.getEncoder().encode(publicKeyo.getEncoded())));
    System.out.println("private key is: " + new String(java.util.Base64.getEncoder().encode(privateKeyo.getEncoded())));
  }

  public static void main(String[] args) throws Exception {
    initKey();
    Map<String, String> model = new HashMap<>();
    model.put("status", "0");
    model.put("payNo", "123");
    model.put("outTradeNo", "321");
    model.put("srcReserve", "CustomChannel");
    String linkString = createLinkString(model, true);
    System.out.printf(linkString);
    String sign = sign(linkString, privateKey, "UTF-8");
    model.put("sign", sign);
    System.out.println(sign);
    System.out.println("========> " + linkString + "&sign=" + sign);

    boolean verify = verify(linkString, sign, publicKey, "UTF-8");
    System.out.println(verify);
  }

}
