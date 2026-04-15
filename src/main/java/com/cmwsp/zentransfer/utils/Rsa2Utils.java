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
//    initKey();
//    privateKey = "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCYWJln6szryswTU5e1P/p4rDsmi87lGJBD24NoSIFoZQ983JAFLbM+PD/U/VxPrxEnXoPsH7VPdRkioILrKXi1lbEOv/icPn7Iy5pxZUQ2uUOxmEBoJcyTidH6p9KMX0fi413fOqAml1EeiahE+/EA89WJnjRx8U5g3x1byd9aDYLCXKRQrWwWGbYeMJY6CmYvfHHqfI8TldesiaYI4/HBo5o1Wi0GUwKMWDOXm4H76Ug2PaFIXAniY/QXO15m5Y+y48FcH2YWOhBneaIitn0Yr7QmxSh3lVz7q5ADFK2d8P5nLWuOLGmAwnE6xhZqTHkIUaERcC76kALzJLJ4woD/AgMBAAECggEALyw4DDJrU5PPDyjyL+BoqVcDVdMytEOf4DMnhHH3CCFK42nUepYFC39ScJwnKlFWKW+dv86tsLXcm5lCEJkd1HROh/evfonnbjuFThmCPsOtD1/KibUynHiveULf8jFKrBmlJosbrfdq2d7cKMgufxIBjARdzu5eS6aqi5J9w38xX2VB0MKAKXmKns1Y2kc7L+W+5BIG0fwf+EEZfZUNZPLnAeteBA03UTEt1Ywe9TdDNiq9uPGeNci6xVDU36gJljpuglRdJi2fqP5efNKOQY/O1WROzi7YbjEj59LiVEw4gTfEYK2arfsvvPACg4aAwmsrZa2vQH5dBj8uaXECsQKBgQDqpK6s9cg1ctZ4+0mWXjjGuztLrj9IH/Xd/fhERtCKJtO8p2XKw31UmCuFZUI7+2fL6IOyJan652HI3hdkKAMQdPJTqdYcNf0XmFJjDKg1PigruZKUsCDyxYRyVdYXDQYwHOWNxA35m1n4UaKF+X4ycoH5hRJBt6kfNWF18zZ1ZwKBgQCmNljPoS7mVGvleBSbkplnWk5PRluXw7AZHTo6DKzX8WYc5coZOfnUebZwHuwBxljVg0dDcmGif1exXCPckY2edhFcYPhrT9w3KITYVUHgNK0/UatguCG278cwVcX/ZWARBNsdrgmnxiY7xqO6lMvzcIJJsXeWQ8b3drYYf1kAqQKBgBO4a4XV0lHLqQLZ+8FLgfIR4lXl+yOQrBVQNwFmAjjaMol0eDWmYG4vq9i2Pe7UnlCg5hCe4b5Ym/tJzyV3x2omqgcmCvyr/O1yu9nfQnPXGYEzQ4KDmwFMYGlLlYaybYa1pwVXKOWFjPY1xjcEVPrgbNQPvw0O5oPc9Kf5HOaZAoGANQLEVIRN1vw55VflCrE45/OvYi1IbSDmezwNJBKC1eSR8sl/KYiKG7At9ZiHIRHHp2FVSzeh2BfROinu7hwmFNIHO3VaBa/UxmrP48ddWUqzrqw3goN3jUbwOoRAv/HvL75ivBaT0cSq0QnLkmh+m8fYZfSJ9YzsWmSsMyf6lPECgYEAkNAPXld2Sxlri19mjH5zRZMulVet+yCQRz9AS/OvKzozEtMs++lcQuSjD44DSEnf/WqwL1n0gnvy5wsYyekridJEUC2Aj9RfWM037dOznjFKsRN1RnaZZpxZU+h/jzvVcWe2kfnM33oJiHcanQlsy8uvmVgnWad5kZR8I5C3GFA=";
//    publicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtzRuTymYepsAhVFvLFCK/Qh8zSBF22qh5qyb8CYZtXe0ZlgHqtsHXMeXuITv37xiwmLR7W6bUd6O+wnxPnHR ExW5053r1ysOQpSUsMI8PbURQLfC5npWm2/WfTqYwrnaccD27u+7itKdlRf3SNCtGCAVEJaNURv2weUDIL79WqbqEF2A/8U9AEP08D9+VZ22vg9HR/KvgtF+iiqa2gnWGJ6UXUuc5CdRMvMtCH2+93ZpYKZSgG/R6UqbbacRoqzdPz8Xg/m4Gxp6XgqJMDdLTY9McXnOLrm/xAxA73zc1WapgIaZeOlGzaSZg0utWSrqidjLf8vOV3E7QmeEDv/WHQIDAQAB";
//    String sign = "U6+isKgPhVB2P7Ba3+1OLAhmWoC6s3Fh2lCuOZRMdeG58BCZAA2RjnBy2DrgzrGE+571b+OCWkq+8OM+SravbCc8IQ9HmNXish6mXYwfB2U/rhnV33xyQW5j9W7gm2Ixht90xAfl3wCZTk6zSUcP30z9jDR3N7iQfLyKPiOwpMj6sIvWOXIi5/Vh9Prp/+dE07hEZaeUPBA7wZKvrLCFQ58jl6m8NQwPUWlJLAMVYiwXTgmIO3pP3zvhN7GB1j8+PZ0MYcXdCk2+Z3ByItdAxsymIiXkBez/VbIgsPEGdG4YB9KWB2ZXywST1lySkKGpwP6r4O2u62TnycqZ8UPnrw==";
//    Map<String, String> model = new HashMap<>();
//    model.put("status", "0");
//    model.put("payNo", "UP-c07e6d41c00d2407120055");
//    model.put("outTradeNo", "2024071211108259332");
//    model.put("srcReserve", "CustomChannel");
//    String linkString = createLinkString(model, true);
//    System.out.printf(linkString);
////    String sign = sign(linkString, privateKey, "UTF-8");
//    model.put("sign", sign);
//    System.out.println(sign);
//    System.out.println("========> " + linkString + "&sign=" + sign);
    String sign = "cMwxvuUWxX rmJulU0 IdgRNuAzsPWG6p2lAZ6gJ/C EE2V8VdA5vt7cSNgQyGDPN3Cn1UEjcq3Ne/TrDwgt6AfkoyCIrhs Y1EHcUSx9OawNpvetz8BmVj2m/tU KO4 TiIqx1JW5qTrwDZ6MFl7ycdCqpw7Abbw/O8/KKzi8UAHqvgp9OdFoIvKfAYTWUh/JTTosf0v 7tQAClftVRz1XjA51/8kDWKyyGe5UA0q6F bUIDf5gT6LMBmu4ihqd172Cz0zbTwRy7SJImAYXiPFU05AgbIEqH4Bi6x3AZFg77qQ18dCzq LXyqXV RN7r9qPmoNgAaUNxPx0p26yfw==";
    Map<String, String> model = new HashMap<>();
    model.put("_input_charset","UTF-8");
    model.put("agentId", "16099");
    model.put("amount", "1.00000000");
    model.put("bizId", "124149123076492");
    model.put("notifyUrl", "https://Fapi.udinghuo.cn/api/basic/PaySrv/newPaymentNotify");
    model.put("orderNo","UO-c07e6d41c00d2407050001");
    model.put("payNo","UP-c07e6d41c00d2407050002");
    model.put("produceDesc","收款测试客户（测试系统使用）的单据UO-c07e6d41c00d2407050001");
    model.put("returnUrl","https://m.udinghuo.cn/pages/mobilePaySuccess.html");
    model.put("srcReserve","CustomChannel");
    model.put("size","M");
    String linkString = createLinkString(model, true);
    publicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtzRuTymYepsAhVFvLFCK/Qh8zSBF22qh5qyb8CYZtXe0ZlgHqtsHXMeXuITv37xiwmLR7W6bUd6O+wnxPnHRExW5053r1ysOQpSUsMI8PbURQLfC5npWm2/WfTqYwrnaccD27u+7itKdlRf3SNCtGCAVEJaNURv2weUDIL79WqbqEF2A/8U9AEP08D9+VZ22vg9HR/KvgtF+iiqa2gnWGJ6UXUuc5CdRMvMtCH2+93ZpYKZSgG/R6UqbbacRoqzdPz8Xg/m4Gxp6XgqJMDdLTY9McXnOLrm/xAxA73zc1WapgIaZeOlGzaSZg0utWSrqidjLf8vOV3E7QmeEDv/WHQIDAQAB";

    boolean verify = verify(linkString, sign.replaceAll(" ","+"), publicKey, "UTF-8");
    System.out.println(verify);
  }

}
