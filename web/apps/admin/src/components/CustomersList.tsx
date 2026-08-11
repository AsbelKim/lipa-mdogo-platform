'use client';

export default function CustomersList() {
  const customers = [
    { id: '1', name: 'John Doe', phone: '+254712345678', location: 'Nairobi', status: 'active' },
    { id: '2', name: 'Jane Smith', phone: '+254712345679', location: 'Mombasa', status: 'active' },
    { id: '3', name: 'Peter Johnson', phone: '+254712345680', location: 'Kisumu', status: 'inactive' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <button className="px-4 py-2 bg-primary hover:bg-emerald-700 text-white rounded-lg transition">
          + Add Customer
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{customer.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{customer.location}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      customer.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {customer.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  <button className="text-primary hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
