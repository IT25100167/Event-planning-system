package edu.sliit.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class VendorViewController {

    @GetMapping({
        "/vendor/dashboard",
        "/vendor/profile",
        "/vendor/services",
        "/vendor/availability",
        "/vendor/bookings",
        "/vendor/payments"
    })
    public String vendorViews() {
        return "forward:/index.html";
    }
}
