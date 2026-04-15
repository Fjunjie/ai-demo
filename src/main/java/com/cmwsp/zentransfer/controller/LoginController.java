package com.cmwsp.zentransfer.controller;

import com.cmwsp.zentransfer.configuration.UOrderConfiguration;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class LoginController {

    @Autowired
    UOrderConfiguration uOrderConfiguration;

    @RequestMapping({"/","/login"})
    public ModelAndView login()
    {
        return new ModelAndView("login");
    }

    @PostMapping("/login")
    public ModelAndView processLoginForm(@RequestParam("username") String username,
                                   @RequestParam("password") String password,
                                   HttpSession session) {
        // 这里应该有验证用户名和密码的逻辑
        if (uOrderConfiguration.getUsername().equals(username)
                && uOrderConfiguration.getPassword().equals(password)) {
            // 保存用户信息到 Session
            session.setAttribute("user", username);
            return new ModelAndView("redirect:/reconciliation/list");
        } else {
            return new ModelAndView("redirect:/login?error");
        }
    }

    @GetMapping("/auto-login")
    public ModelAndView processAutoLogin(@RequestParam("token") String token,
                                         HttpSession session) {
        // 这里应该有验证用户名和密码的逻辑
        if (uOrderConfiguration.getKey().equals(token)) {
            // 保存用户信息到 Session
            session.setAttribute("user", uOrderConfiguration.getUsername());
            return new ModelAndView("redirect:/reconciliation/list");
        } else {
            return new ModelAndView("redirect:/login?error");
        }
    }

    @RequestMapping("/logout")
    public ModelAndView logout() {
        // 返回一个视图或重定向到其他页面
        return new ModelAndView("redirect:/login");
    }
    
}
