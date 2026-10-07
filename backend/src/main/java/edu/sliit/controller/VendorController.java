package edu.sliit.controller;

import edu.sliit.dto.ServiceBookingDto;
import edu.sliit.dto.VendorAvailabilityDto;
import edu.sliit.dto.VendorProfileUpdateDto;
import edu.sliit.dto.VendorServiceDto;
import edu.sliit.service.VendorManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendor")
@RequiredArgsConstructor
public class VendorController {

    private final VendorManagementService vendorManagementService;

    @GetMapping("/{vendorId}/profile")
    public ResponseEntity<VendorProfileUpdateDto> getProfile(@PathVariable Integer vendorId) {
        return ResponseEntity.ok(vendorManagementService.getVendorProfile(vendorId));
    }

    @PutMapping("/{vendorId}/profile")
    public ResponseEntity<VendorProfileUpdateDto> updateProfile(@PathVariable Integer vendorId, @RequestBody VendorProfileUpdateDto updateDto) {
        return ResponseEntity.ok(vendorManagementService.updateVendorProfile(vendorId, updateDto));
    }

    @PostMapping("/services")
    public ResponseEntity<VendorServiceDto> addService(@RequestBody VendorServiceDto serviceDto) {
        return ResponseEntity.ok(vendorManagementService.addService(serviceDto));
    }

    @PutMapping("/services/{serviceId}")
    public ResponseEntity<VendorServiceDto> updateService(@PathVariable Integer serviceId, @RequestBody VendorServiceDto serviceDto) {
        return ResponseEntity.ok(vendorManagementService.updateService(serviceId, serviceDto));
    }

    @DeleteMapping("/services/{serviceId}")
    public ResponseEntity<Void> deleteService(@PathVariable Integer serviceId) {
        vendorManagementService.deleteService(serviceId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{vendorId}/services")
    public ResponseEntity<List<VendorServiceDto>> getVendorServices(@PathVariable Integer vendorId) {
        return ResponseEntity.ok(vendorManagementService.getVendorServices(vendorId));
    }

    @PostMapping("/availability")
    public ResponseEntity<VendorAvailabilityDto> updateAvailability(@RequestBody VendorAvailabilityDto availabilityDto) {
        return ResponseEntity.ok(vendorManagementService.updateAvailability(availabilityDto));
    }

    @DeleteMapping("/availability/{availabilityId}")
    public ResponseEntity<Void> deleteAvailability(@PathVariable Integer availabilityId) {
        vendorManagementService.deleteAvailability(availabilityId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{vendorId}/availability")
    public ResponseEntity<List<VendorAvailabilityDto>> getVendorAvailability(@PathVariable Integer vendorId) {
        return ResponseEntity.ok(vendorManagementService.getVendorAvailability(vendorId));
    }

    @PostMapping("/bookings")
    public ResponseEntity<ServiceBookingDto> createBooking(@RequestBody ServiceBookingDto bookingDto) {
        return ResponseEntity.ok(vendorManagementService.createBooking(bookingDto));
    }

    @PatchMapping("/bookings/{bookingId}/status")
    public ResponseEntity<ServiceBookingDto> updateBookingStatus(@PathVariable Integer bookingId, @RequestParam String status, @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(vendorManagementService.updateBookingStatus(bookingId, status, reason));
    }

    @PatchMapping("/bookings/{bookingId}/payment-status")
    public ResponseEntity<ServiceBookingDto> updatePaymentStatus(@PathVariable Integer bookingId, @RequestParam String paymentStatus) {
        return ResponseEntity.ok(vendorManagementService.updatePaymentStatus(bookingId, paymentStatus));
    }

    @GetMapping("/{vendorId}/bookings")
    public ResponseEntity<List<ServiceBookingDto>> getVendorBookings(@PathVariable Integer vendorId) {
        return ResponseEntity.ok(vendorManagementService.getVendorBookings(vendorId));
    }
}
