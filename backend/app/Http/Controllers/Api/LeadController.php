<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request): JsonResponse
    {
        $leads = Lead::where('company_id', $request->user()->company_id)
            ->with('agent')
            ->when($request->query('stage'), fn ($q) => $q->where('stage', $request->query('stage')))
            ->when($request->user()->role === 'agent', fn ($q) => $q->where('agent_id', $request->user()->id))
            ->paginate(20);

        return response()->json($leads);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string',
            'phone' => 'required|string',
            'product_interest' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $lead = Lead::create([
            ...$validated,
            'company_id' => $request->user()->company_id,
            'agent_id' => $request->user()->role === 'agent' ? $request->user()->id : $request->input('agent_id'),
            'stage' => 'new',
        ]);

        return response()->json(['message' => 'Lead created', 'lead' => $lead], 201);
    }

    public function show(Request $request, Lead $lead): JsonResponse
    {
        $this->authorize('view', $lead);

        return response()->json($lead->load('agent'));
    }

    public function update(Request $request, Lead $lead): JsonResponse
    {
        $this->authorize('update', $lead);

        $validated = $request->validate([
            'customer_name' => 'string',
            'phone' => 'string',
            'product_interest' => 'nullable|string',
            'stage' => 'in:new,contacted,kyc,converted,lost',
            'notes' => 'nullable|string',
        ]);

        $lead->update($validated);

        return response()->json(['message' => 'Lead updated', 'lead' => $lead]);
    }

    public function destroy(Request $request, Lead $lead): JsonResponse
    {
        $this->authorize('delete', $lead);

        $lead->delete();

        return response()->json(['message' => 'Lead deleted']);
    }
}
