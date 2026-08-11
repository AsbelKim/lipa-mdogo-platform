<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request): JsonResponse
    {
        $customers = Customer::where('company_id', $request->user()->company_id)
            ->with('sales')
            ->paginate(20);

        return response()->json($customers);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'phone' => 'required|unique:customers',
            'national_id' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $customer = Customer::create([
            ...$validated,
            'company_id' => $request->user()->company_id,
        ]);

        return response()->json(['message' => 'Customer created', 'customer' => $customer], 201);
    }

    public function show(Request $request, Customer $customer): JsonResponse
    {
        $this->authorize('view', $customer);

        return response()->json($customer->load('sales'));
    }

    public function update(Request $request, Customer $customer): JsonResponse
    {
        $this->authorize('update', $customer);

        $validated = $request->validate([
            'name' => 'string',
            'phone' => 'unique:customers,phone,' . $customer->id,
            'national_id' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $customer->update($validated);

        return response()->json(['message' => 'Customer updated', 'customer' => $customer]);
    }

    public function destroy(Request $request, Customer $customer): JsonResponse
    {
        $this->authorize('delete', $customer);

        $customer->delete();

        return response()->json(['message' => 'Customer deleted']);
    }
}
