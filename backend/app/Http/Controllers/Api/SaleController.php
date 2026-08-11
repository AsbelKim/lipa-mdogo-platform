<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request): JsonResponse
    {
        $sales = Sale::where('company_id', $request->user()->company_id)
            ->with(['device', 'customer', 'agent', 'payments'])
            ->paginate(20);

        return response()->json($sales);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'device_id' => 'required|exists:devices,id',
            'customer_id' => 'required|exists:customers,id',
            'agent_id' => 'required|exists:users,id',
            'down_payment' => 'required|numeric|min:0',
            'total_price' => 'required|numeric|min:0',
            'installment_amount' => 'required|numeric|min:0',
            'installment_frequency' => 'required|in:daily,weekly,monthly',
            'start_date' => 'required|date|after_or_equal:today',
        ]);

        $sale = Sale::create([
            ...$validated,
            'company_id' => $request->user()->company_id,
        ]);

        return response()->json(['message' => 'Sale created', 'sale' => $sale->load(['device', 'customer', 'agent'])], 201);
    }

    public function show(Request $request, Sale $sale): JsonResponse
    {
        $this->authorize('view', $sale);

        return response()->json($sale->load(['device', 'customer', 'agent', 'payments']));
    }

    public function update(Request $request, Sale $sale): JsonResponse
    {
        $this->authorize('update', $sale);

        $validated = $request->validate([
            'status' => 'in:active,completed,defaulted,repossessed',
        ]);

        $sale->update($validated);

        return response()->json(['message' => 'Sale updated', 'sale' => $sale]);
    }

    public function destroy(Request $request, Sale $sale): JsonResponse
    {
        $this->authorize('delete', $sale);

        $sale->delete();

        return response()->json(['message' => 'Sale deleted']);
    }
}
