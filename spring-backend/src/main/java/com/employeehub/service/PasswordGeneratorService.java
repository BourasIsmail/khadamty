package com.employeehub.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class PasswordGeneratorService {

    private static final String LOWER = "abcdefghijkmnopqrstuvwxyz";
    private static final String UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    private static final String DIGITS = "23456789";
    private static final String SYMBOLS = "@#$%";
    private static final String ALL = LOWER + UPPER + DIGITS + SYMBOLS;
    private static final int DEFAULT_LENGTH = 12;

    private final SecureRandom random = new SecureRandom();

    public String generateTemporaryPassword() {
        List<Character> chars = new ArrayList<>();
        chars.add(randomChar(LOWER));
        chars.add(randomChar(UPPER));
        chars.add(randomChar(DIGITS));
        chars.add(randomChar(SYMBOLS));

        while (chars.size() < DEFAULT_LENGTH) {
            chars.add(randomChar(ALL));
        }

        Collections.shuffle(chars, random);
        StringBuilder password = new StringBuilder(DEFAULT_LENGTH);
        for (Character c : chars) {
            password.append(c);
        }
        return password.toString();
    }

    private char randomChar(String source) {
        return source.charAt(random.nextInt(source.length()));
    }
}
