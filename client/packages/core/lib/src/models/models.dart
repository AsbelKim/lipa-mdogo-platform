import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:equatable/equatable.dart';

part 'models.freezed.dart';
part 'models.g.dart';

@freezed
class User with _$User {
  const factory User({
    required int id,
    required String name,
    required String email,
    required String phone,
    required String role,
    required int companyId,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
}

@freezed
class Company with _$Company {
  const factory Company({
    required int id,
    required String name,
    required String email,
    required String? phone,
    required String subscriptionStatus,
  }) = _Company;

  factory Company.fromJson(Map<String, dynamic> json) => _$CompanyFromJson(json);
}

@freezed
class Device with _$Device {
  const factory Device({
    required int id,
    required int companyId,
    required String category,
    required String brand,
    required String model,
    required String serialNumber,
    required String? imei,
    required String? colour,
    required double unitCost,
    required String status,
    required int? currentAgentId,
  }) = _Device;

  factory Device.fromJson(Map<String, dynamic> json) => _$DeviceFromJson(json);
}

@freezed
class Customer with _$Customer {
  const factory Customer({
    required int id,
    required int companyId,
    required String name,
    required String phone,
    required String? nationalId,
    required String? address,
  }) = _Customer;

  factory Customer.fromJson(Map<String, dynamic> json) => _$CustomerFromJson(json);
}

@freezed
class Sale with _$Sale {
  const factory Sale({
    required int id,
    required int companyId,
    required int deviceId,
    required int customerId,
    required int agentId,
    required double downPayment,
    required double totalPrice,
    required double installmentAmount,
    required String installmentFrequency,
    required String startDate,
    required String status,
  }) = _Sale;

  factory Sale.fromJson(Map<String, dynamic> json) => _$SaleFromJson(json);

  double get totalPaid => 0; // Will be calculated from payments
  double get remainingBalance => totalPrice - totalPaid;
}

@freezed
class Payment with _$Payment {
  const factory Payment({
    required int id,
    required int saleId,
    required double amount,
    required String paidAt,
    required String method,
    required int recordedBy,
    required String? notes,
  }) = _Payment;

  factory Payment.fromJson(Map<String, dynamic> json) => _$PaymentFromJson(json);
}

@freezed
class Lead with _$Lead {
  const factory Lead({
    required int id,
    required int companyId,
    required int agentId,
    required String customerName,
    required String phone,
    required String? productInterest,
    required String stage,
    required String? notes,
  }) = _Lead;

  factory Lead.fromJson(Map<String, dynamic> json) => _$LeadFromJson(json);
}

@freezed
class AuthResponse with _$AuthResponse {
  const factory AuthResponse({
    required String message,
    required User user,
    required String token,
  }) = _AuthResponse;

  factory AuthResponse.fromJson(Map<String, dynamic> json) => _$AuthResponseFromJson(json);
}

@freezed
class PaginatedResponse<T> with _$PaginatedResponse<T> {
  const factory PaginatedResponse({
    required List<T> data,
    required int currentPage,
    required int lastPage,
    required int perPage,
    required int total,
  }) = _PaginatedResponse<T>;

  factory PaginatedResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Object?) fromJsonT,
  ) =>
      _$PaginatedResponseFromJson(json, fromJsonT);
}
