<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\DeviceController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\SaleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        Route::apiResource('devices', DeviceController::class);
        Route::apiResource('customers', CustomerController::class);
        Route::apiResource('sales', SaleController::class);
        Route::apiResource('payments', PaymentController::class)->only(['index', 'store', 'show', 'destroy']);
        Route::apiResource('leads', LeadController::class);

        Route::post('/devices/{device}/assign', [DeviceController::class, 'assign']);
        Route::post('/devices/{device}/return', [DeviceController::class, 'return']);
    });
});
