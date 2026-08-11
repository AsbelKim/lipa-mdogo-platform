'use client';

import { useState, useRef } from 'react';
import Modal from './Modal';

interface UploadedPhone {
  model: string;
  imei: string;
  serialNumber: string;
  condition: 'new' | 'refurbished' | 'used';
  status: 'pending' | 'valid' | 'invalid';
  error?: string;
}

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (phones: UploadedPhone[]) => void;
}

const PHONE_MODELS = [
  'Samsung Galaxy A05',
  'Samsung Galaxy A06',
  'Samsung Galaxy A07',
  'Samsung Galaxy A16 5G',
  'Samsung Galaxy A26 5G',
  'Samsung Galaxy A36 5G',
  'Samsung Galaxy A56 5G',
];

export default function BulkUploadModal({ isOpen, onClose, onUpload }: BulkUploadModalProps) {
  const [phones, setPhones] = useState<UploadedPhone[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'preview' | 'success'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateIMEI = (imei: string): boolean => {
    // IMEI should be 15 digits
    return /^\d{15}$/.test(imei.trim());
  };

  const validatePhone = (phone: any): { valid: boolean; error?: string } => {
    if (!phone.model || !PHONE_MODELS.includes(phone.model)) {
      return { valid: false, error: 'Invalid phone model' };
    }
    if (!phone.imei || !validateIMEI(phone.imei)) {
      return { valid: false, error: 'Invalid IMEI (must be 15 digits)' };
    }
    if (!phone.serialNumber || phone.serialNumber.toString().trim() === '') {
      return { valid: false, error: 'Serial number is required' };
    }
    if (!['new', 'refurbished', 'used'].includes(phone.condition?.toLowerCase())) {
      return { valid: false, error: 'Invalid condition' };
    }
    return { valid: true };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n').filter((line) => line.trim());

        // Skip header if it exists
        const dataLines = lines[0]?.toLowerCase().includes('model')
          ? lines.slice(1)
          : lines;

        const uploadedPhones: UploadedPhone[] = dataLines.map((line) => {
          const [model, imei, serialNumber, condition] = line.split(',').map((col) => col.trim());

          const phone: UploadedPhone = {
            model: model || '',
            imei: imei || '',
            serialNumber: serialNumber || '',
            condition: (condition?.toLowerCase() || 'new') as 'new' | 'refurbished' | 'used',
            status: 'pending',
          };

          const validation = validatePhone(phone);
          if (!validation.valid) {
            phone.status = 'invalid';
            phone.error = validation.error;
          } else {
            phone.status = 'valid';
          }

          return phone;
        });

        setPhones(uploadedPhones);
        setUploadStatus('preview');
      } catch (error) {
        setPhones([
          {
            model: '',
            imei: '',
            serialNumber: '',
            condition: 'new',
            status: 'invalid',
            error: 'Failed to parse CSV file. Please check the format.',
          },
        ]);
      }
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  const handleUpload = () => {
    const validPhones = phones.filter((p) => p.status === 'valid');
    if (validPhones.length === 0) {
      alert('No valid phones to upload');
      return;
    }

    onUpload(validPhones);
    setUploadStatus('success');
    setTimeout(() => {
      resetModal();
    }, 2000);
  };

  const resetModal = () => {
    setPhones([]);
    setUploadStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={resetModal} title="Bulk Upload Phones">
      <div className="space-y-4">
        {uploadStatus === 'idle' && (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">CSV Format Required</h4>
              <p className="text-sm text-blue-800 mb-3">Upload a CSV file with the following columns:</p>
              <code className="text-xs bg-white p-2 block border border-blue-200 rounded mb-3 overflow-x-auto">
                Model,IMEI,SerialNumber,Condition
              </code>
              <p className="text-sm text-blue-800">
                <strong>Example:</strong><br />
                Samsung Galaxy A05,123456789012345,SN001,new
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-700 font-medium">Click to upload CSV file</p>
              <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Need a template?</p>
              <a
                href="/phones-template.csv"
                download="phones-template.csv"
                className="text-primary hover:underline font-medium text-sm"
              >
                📥 Download CSV Template
              </a>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />

            {isProcessing && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-gray-600 text-sm mt-2">Processing file...</p>
              </div>
            )}
          </>
        )}

        {uploadStatus === 'preview' && phones.length > 0 && (
          <>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Upload Preview</h4>
              <div className="flex gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{phones.filter(p => p.status === 'valid').length}</p>
                  <p className="text-sm text-gray-600">Valid phones</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{phones.filter(p => p.status === 'invalid').length}</p>
                  <p className="text-sm text-gray-600">Invalid phones</p>
                </div>
              </div>
            </div>

            {phones.filter(p => p.status === 'invalid').length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h5 className="font-semibold text-red-900 mb-2">Issues Found:</h5>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {phones
                    .filter(p => p.status === 'invalid')
                    .map((p, idx) => (
                      <p key={idx} className="text-sm text-red-800">
                        Row {idx + 1}: {p.error}
                      </p>
                    ))}
                </div>
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Model</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">IMEI</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Condition</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {phones.map((phone, idx) => (
                    <tr key={idx} className={phone.status === 'valid' ? 'bg-white' : 'bg-red-50'}>
                      <td className="px-3 py-2 text-xs text-gray-900">{phone.model}</td>
                      <td className="px-3 py-2 text-xs font-mono text-gray-600">{phone.imei}</td>
                      <td className="px-3 py-2 text-xs text-gray-600">{phone.condition}</td>
                      <td className="px-3 py-2 text-center">
                        {phone.status === 'valid' ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            ✕
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setUploadStatus('idle')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Choose Different File
              </button>
              <button
                onClick={handleUpload}
                disabled={phones.filter(p => p.status === 'valid').length === 0}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload {phones.filter(p => p.status === 'valid').length} Valid Phones
              </button>
            </div>
          </>
        )}

        {uploadStatus === 'success' && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✓</div>
            <h4 className="text-lg font-semibold text-green-600 mb-2">Upload Successful!</h4>
            <p className="text-gray-600">
              {phones.filter(p => p.status === 'valid').length} phones have been added to inventory
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
