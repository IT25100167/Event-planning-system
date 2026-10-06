package edu.sliit.service;

import edu.sliit.dto.ServiceBookingDto;
import edu.sliit.dto.VendorAvailabilityDto;
import edu.sliit.dto.VendorProfileUpdateDto;
import edu.sliit.dto.VendorServiceDto;

import java.util.List;

public interface VendorManagementService {
    // 1. Vendor Profile Management
    VendorProfileUpdateDto getVendorProfile(Integer vendorId);
    VendorProfileUpdateDto updateVendorProfile(Integer vendorId, VendorProfileUpdateDto updateDto);

    // 2. Service Management
    VendorServiceDto addService(VendorServiceDto serviceDto);
    VendorServiceDto updateService(Integer serviceId, VendorServiceDto serviceDto);
    void deleteService(Integer serviceId);
    List<VendorServiceDto> getVendorServices(Integer vendorId);

    // 3. Availability Updates
    VendorAvailabilityDto updateAvailability(VendorAvailabilityDto availabilityDto);
    void deleteAvailability(Integer availabilityId);
    List<VendorAvailabilityDto> getVendorAvailability(Integer vendorId);

    // 4 & 5. Booking and Payment tracking
    ServiceBookingDto createBooking(ServiceBookingDto bookingDto);
    ServiceBookingDto updateBookingStatus(Integer bookingId, String status);
    ServiceBookingDto updatePaymentStatus(Integer bookingId, String paymentStatus);
    List<ServiceBookingDto> getVendorBookings(Integer vendorId);
}
