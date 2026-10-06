package edu.sliit.service;

import edu.sliit.dto.ServiceBookingDto;
import edu.sliit.dto.VendorAvailabilityDto;
import edu.sliit.dto.VendorProfileUpdateDto;
import edu.sliit.dto.VendorServiceDto;
import edu.sliit.entity.*;
import edu.sliit.repository.ServiceBookingRepository;
import edu.sliit.repository.UserRepository;
import edu.sliit.repository.VendorAvailabilityRepository;
import edu.sliit.repository.VendorServiceRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class VendorManagementServiceImpl implements VendorManagementService {

    private final UserRepository userRepository;
    private final VendorServiceRepository vendorServiceRepository;
    private final VendorAvailabilityRepository vendorAvailabilityRepository;
    private final ServiceBookingRepository serviceBookingRepository;

    @Override
    public VendorProfileUpdateDto updateVendorProfile(Integer vendorId, VendorProfileUpdateDto updateDto) {
        UserEntity user = userRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        
        if (user.getRole() != Role.VENDOR) {
            throw new RuntimeException("User is not a vendor");
        }

        user.setName(updateDto.getName());
        user.setPhoneNum(updateDto.getPhoneNum());
        user.setEmail(updateDto.getEmail());

        userRepository.save(user);

        return new VendorProfileUpdateDto(user.getName(), user.getPhoneNum(), user.getEmail());
    }

    @Override
    public VendorServiceDto addService(VendorServiceDto serviceDto) {
        UserEntity vendor = userRepository.findById(serviceDto.getVendorId())
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        VendorServiceEntity entity = new VendorServiceEntity();
        entity.setVendor(vendor);
        entity.setServiceName(serviceDto.getServiceName());
        entity.setDescription(serviceDto.getDescription());
        entity.setPrice(serviceDto.getPrice());

        VendorServiceEntity saved = vendorServiceRepository.save(entity);
        return mapToDto(saved);
    }

    @Override
    public VendorServiceDto updateService(Integer serviceId, VendorServiceDto serviceDto) {
        VendorServiceEntity entity = vendorServiceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        entity.setServiceName(serviceDto.getServiceName());
        entity.setDescription(serviceDto.getDescription());
        entity.setPrice(serviceDto.getPrice());

        VendorServiceEntity updated = vendorServiceRepository.save(entity);
        return mapToDto(updated);
    }

    @Override
    public void deleteService(Integer serviceId) {
        vendorServiceRepository.deleteById(serviceId);
    }

    @Override
    public List<VendorServiceDto> getVendorServices(Integer vendorId) {
        return vendorServiceRepository.findByVendorUserId(vendorId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public VendorAvailabilityDto updateAvailability(VendorAvailabilityDto availabilityDto) {
        UserEntity vendor = userRepository.findById(availabilityDto.getVendorId())
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        VendorAvailabilityEntity entity = vendorAvailabilityRepository
                .findByVendorUserIdAndDate(vendor.getUserId(), availabilityDto.getDate())
                .orElse(new VendorAvailabilityEntity());

        entity.setVendor(vendor);
        entity.setDate(availabilityDto.getDate());
        entity.setIsAvailable(availabilityDto.getIsAvailable());

        VendorAvailabilityEntity saved = vendorAvailabilityRepository.save(entity);
        return mapToDto(saved);
    }

    @Override
    public List<VendorAvailabilityDto> getVendorAvailability(Integer vendorId) {
        return vendorAvailabilityRepository.findByVendorUserId(vendorId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ServiceBookingDto createBooking(ServiceBookingDto bookingDto) {
        VendorServiceEntity service = vendorServiceRepository.findById(bookingDto.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        UserEntity coordinator = userRepository.findById(bookingDto.getEventCoordinatorId())
                .orElseThrow(() -> new RuntimeException("Coordinator not found"));

        // Conflict check
        vendorAvailabilityRepository.findByVendorUserIdAndDate(service.getVendor().getUserId(), bookingDto.getBookingDate())
                .ifPresent(availability -> {
                    if (!availability.getIsAvailable()) {
                        throw new RuntimeException("Vendor is not available on this date");
                    }
                });

        ServiceBookingEntity entity = new ServiceBookingEntity();
        entity.setService(service);
        entity.setEventCoordinator(coordinator);
        entity.setBookingDate(bookingDto.getBookingDate());
        entity.setStatus(BookingStatus.PENDING);
        entity.setPaymentStatus(PaymentStatus.PENDING);
        entity.setCommunicationNotes(bookingDto.getCommunicationNotes());

        ServiceBookingEntity saved = serviceBookingRepository.save(entity);
        return mapToDto(saved);
    }

    @Override
    public ServiceBookingDto updateBookingStatus(Integer bookingId, String status) {
        ServiceBookingEntity entity = serviceBookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        entity.setStatus(BookingStatus.valueOf(status.toUpperCase()));
        
        // Automated schedule conflict management
        if (entity.getStatus() == BookingStatus.CONFIRMED) {
            VendorAvailabilityEntity availability = vendorAvailabilityRepository
                    .findByVendorUserIdAndDate(entity.getService().getVendor().getUserId(), entity.getBookingDate())
                    .orElse(new VendorAvailabilityEntity());
            
            availability.setVendor(entity.getService().getVendor());
            availability.setDate(entity.getBookingDate());
            availability.setIsAvailable(false); // Mark as unavailable once confirmed
            vendorAvailabilityRepository.save(availability);
        }
        
        ServiceBookingEntity updated = serviceBookingRepository.save(entity);
        return mapToDto(updated);
    }

    @Override
    public ServiceBookingDto updatePaymentStatus(Integer bookingId, String paymentStatus) {
        ServiceBookingEntity entity = serviceBookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        entity.setPaymentStatus(PaymentStatus.valueOf(paymentStatus.toUpperCase()));
        ServiceBookingEntity updated = serviceBookingRepository.save(entity);
        return mapToDto(updated);
    }

    @Override
    public List<ServiceBookingDto> getVendorBookings(Integer vendorId) {
        return serviceBookingRepository.findByServiceVendorUserId(vendorId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private VendorServiceDto mapToDto(VendorServiceEntity entity) {
        return new VendorServiceDto(
                entity.getId(),
                entity.getVendor().getUserId(),
                entity.getServiceName(),
                entity.getDescription(),
                entity.getPrice()
        );
    }

    private VendorAvailabilityDto mapToDto(VendorAvailabilityEntity entity) {
        return new VendorAvailabilityDto(
                entity.getId(),
                entity.getVendor().getUserId(),
                entity.getDate(),
                entity.getIsAvailable()
        );
    }

    private ServiceBookingDto mapToDto(ServiceBookingEntity entity) {
        return new ServiceBookingDto(
                entity.getId(),
                entity.getService().getId(),
                entity.getEventCoordinator().getUserId(),
                entity.getBookingDate(),
                entity.getStatus(),
                entity.getPaymentStatus(),
                entity.getCommunicationNotes()
        );
    }
}
