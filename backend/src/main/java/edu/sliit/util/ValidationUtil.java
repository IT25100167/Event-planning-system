package edu.sliit.util;

import java.util.regex.Pattern;

public class ValidationUtil {

    // Email validation
    public static boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        return Pattern.matches(emailRegex, email);
    }

    // phone-number validation
    public static boolean isValidPhoneNumber(String phone) {
        String phoneRegex = "^[0-9]{10}$";
        return Pattern.matches(phoneRegex, phone);
    }

    public static boolean isValidPassword(String password) {
        return password.length() >= 6;
    }
}