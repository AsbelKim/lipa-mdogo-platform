<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Device;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeviceController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request): JsonResponse
    {
        $devices = Device::where('company_id', $request->user()->company_id)
            ->with(['currentAgent', 'assignments'])
            ->paginate(20);

        return response()->json($devices);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category' => 'required|in:phone,solar,radio,tv,other',
            'brand' => 'required|string',
            'model' => 'required|string',
            'specs' => 'nullable|json',
            'imei' => 'nullable|unique:devices',
            'serial_number' => 'required|unique:devices',
            'colour' => 'nullable|string',
            'unit_cost' => 'required|numeric|min:0',
        ]);

        $device = Device::create([
            ...$validated,
            'company_id' => $request->user()->company_id,
        ]);

        return response()->json(['message' => 'Device created', 'device' => $device], 201);
    }

    public function show(Request $request, Device $device): JsonResponse
    {
        $this->authorize('view', $device);

        return response()->json($device->load(['currentAgent', 'assignments', 'sales']));
    }

    public function update(Request $request, Device $device): JsonResponse
    {
        $this->authorize('update', $device);

        $validated = $request->validate([
            'category' => 'in:phone,solar,radio,tv,other',
            'brand' => 'string',
            'model' => 'string',
            'specs' => 'nullable|json',
            'colour' => 'nullable|string',
            'unit_cost' => 'numeric|min:0',
            'status' => 'in:in_stock,assigned,sold,repossessed,lost',
        ]);

        $device->update($validated);

        return response()->json(['message' => 'Device updated', 'device' => $device]);
    }

    public function destroy(Request $request, Device $device): JsonResponse
    {
        $this->authorize('delete', $device);

        $device->delete();

        return response()->json(['message' => 'Device deleted']);
    }
}
