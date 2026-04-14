package com.cmwsp.zentransfer.utils;

import com.cmwsp.zentransfer.configuration.UOrderConfiguration;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;

import java.util.Arrays;
import java.util.Map;

@Slf4j
public class UOrderUtils {

    public static final String FORMDATA = "json";

    public static String sign(Map<String,String> params, UOrderConfiguration configuration){
        String[] keyArray = params.keySet().toArray(new String[0]);
        Arrays.sort(keyArray);

        // 拼接有序的参数名-值串
        var stringBuilder = new StringBuilder();
        stringBuilder.append(configuration.getSecret());
        for (String key :keyArray)
        {
            stringBuilder.append(key).append(params.get(key));
        }
        stringBuilder.append(configuration.getSecret());

        if(log.isDebugEnabled()){
            log.debug("拼接参数:{}", stringBuilder);
        }

        return DigestUtils.md5Hex(stringBuilder.toString()).toUpperCase();
    }
}
