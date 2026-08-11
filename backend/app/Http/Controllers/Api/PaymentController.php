<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Sale;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request): JsonResponse
    {
        $sale_id = $request->query('sale_id');

        $query = Payment::query();

        if ($sale_id) {
            $sale = Sale::where('company_id', $request->user()->company_id)->findOrFail($sale_id);
            $query->where('sale_id', $sale_id);
        } else {
            $query->whereHas('sale', function ($q) {
                $q->where('company_id', auth()->user()->company_id);
            });
        }

        $payments = $query->with(['sale', 'recordedBy'])->paginate(50);

        return response()->json($payments);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sale_id' => 'required|exists:sales,id',
            'amount' => 'required|numeric|min:0.01',
            'method' => 'required|in:cash,mpesa,other',
            'notes' => 'nullable|string',
        ]);

        $sale = Sale::where('company_id', $request->user()->company_id)->findOrFail($validated['sale_id']);

        $payment = Payment::create([
            ...$validated,
            'paid_at' => now(),
            'recorded_by' => $request->user()->id,
        ]);

        return response()->json(['message' => 'Payment recorded', 'payment' => $payment->load(['sale', 'recordedBy'])], 201);
    }

    public function show(Request $request, Payment $payment): JsonResponse
    {
        $this->authorize('view', $payment);

        return response()->json($payment->load(['sale', 'recordedBy']));
    }

    public function destroy(Request $request, Payment $payment): JsonResponse
    {
        $this->authorize('delete', $payment);

        $payment->delete();

        return response()->json(['message' => 'Payment deleted']);
    }
}
