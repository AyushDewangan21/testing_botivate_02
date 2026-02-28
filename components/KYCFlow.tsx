import { useState } from 'react';
import { Shield, Upload, CheckCircle, ChevronRight, X } from 'lucide-react';

interface KYCFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

type Step = 'intro' | 'pan' | 'aadhaar' | 'complete';

export function KYCFlow({ onComplete, onSkip }: KYCFlowProps) {
  const [step, setStep] = useState<Step>('intro');
  const [panNumber, setPanNumber] = useState('');
  const [panName, setPanName] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panFile, setPanFile] = useState<File | null>(null);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);

  const getStepNumber = () => {
    const steps = ['intro', 'pan', 'aadhaar'];
    return steps.indexOf(step);
  };

  const totalSteps = 2;

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <button
          onClick={onSkip}
          className="absolute top-6 right-6 p-2 text-gray-600 hover:bg-gray-200 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="bg-[#F3F1F7] rounded-full p-6 mb-6">
          <Shield className="w-20 h-20 text-[#3D3066]" />
        </div>

        <h1 className="text-black text-2xl font-bold mb-4">Complete KYC</h1>
        <p className="text-gray-600 text-center max-w-md mb-8">
          Verify your identity to unlock all features
        </p>

        <div className="bg-gray-50 rounded-xl p-6 w-full max-w-md mb-8 space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-gray-900">Higher Transaction Limits</p>
              <p className="text-gray-600 text-sm">Buy and sell larger amounts of gold</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-gray-900">Loan Eligibility</p>
              <p className="text-gray-600 text-sm">Get instant loans against your gold</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-gray-900">Faster Withdrawals</p>
              <p className="text-gray-600 text-sm">Quick and secure money transfers</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setStep('pan')}
          className="w-full max-w-md bg-[#3D3066] text-white py-3 rounded-lg hover:bg-[#5C4E7F] transition-colors mb-3 flex items-center justify-center gap-2"
        >
          Complete KYC Now
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          onClick={onSkip}
          className="text-gray-600 hover:text-gray-800"
        >
          Skip, Do Later
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className='text-black text-xl font-semibold'>KYC Verification</h2>
            <button
              onClick={onSkip}
              className="text-gray-600 hover:text-gray-800"
            >
              Skip
            </button>
          </div>
          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full ${i < getStepNumber() ? 'bg-[#3D3066]' : 'bg-gray-200'
                  }`}
              />
            ))}
          </div>
          <p className="text-gray-600 text-sm mt-2">
            Step {getStepNumber()} of {totalSteps}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-6">
        {step === 'pan' && (
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="bg-[#F3F1F7] rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-[#3D3066]" />
            </div>
            <h2 className="mb-2 text-black text-xl font-semibold">PAN Card Details</h2>
            <p className="text-gray-600 mb-6">Enter your PAN card information</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">PAN Number</label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase().slice(0, 10))}
                  placeholder="ABCDE1234F"
                  className="text-gray-800 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7FA8]"
                  maxLength={10}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Name as per PAN</label>
                <input
                  type="text"
                  value={panName}
                  onChange={(e) => setPanName(e.target.value)}
                  placeholder="Enter name"
                  className="text-gray-800 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7FA8]"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Upload PAN Card</label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#8B7FA8] cursor-pointer relative"
                  onClick={() => document.getElementById('panUpload')?.click()}
                >
                  <input
                    type="file"
                    id="panUpload"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => setPanFile(e.target.files?.[0] || null)}
                  />
                  {panFile ? (
                    <div>
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-green-600 font-medium">{panFile.name}</p>
                      <p className="text-gray-400 text-sm">Click to change</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-gray-400 text-sm">PNG, JPG or PDF (max. 5MB)</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('aadhaar')}
              disabled={!panNumber || !panName || !panFile}
              className="w-full bg-[#3D3066] text-white py-3 rounded-lg hover:bg-[#5C4E7F] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {step === 'aadhaar' && (
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="bg-[#F3F1F7] rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-[#3D3066]" />
            </div>
            <h2 className="text-black mb-2 text-xl font-semibold">Aadhaar Card</h2>
            <p className="text-gray-600 mb-6">Upload your Aadhaar card for identity verification</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Aadhaar Number</label>
                <input
                  type="text"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  placeholder="XXXX XXXX XXXX"
                  className="text-gray-800 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7FA8]"
                  maxLength={12}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Upload Aadhaar Card</label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#8B7FA8] cursor-pointer relative"
                  onClick={() => document.getElementById('aadhaarUpload')?.click()}
                >
                  <input
                    type="file"
                    id="aadhaarUpload"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => setAadhaarFile(e.target.files?.[0] || null)}
                  />
                  {aadhaarFile ? (
                    <div>
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-green-600 font-medium">{aadhaarFile.name}</p>
                      <p className="text-gray-400 text-sm">Click to change</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Click to upload Aadhaar (front & back)</p>
                      <p className="text-gray-400 text-sm">PNG, JPG or PDF (max. 5MB)</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('complete')}
              disabled={!aadhaarNumber || !aadhaarFile}
              className="w-full bg-[#3D3066] text-white py-3 rounded-lg hover:bg-[#5C4E7F] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Submit for Verification
            </button>
          </div>
        )}

        {step === 'complete' && (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <div className="bg-green-100 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-black text-2xl font-bold mb-2">KYC Submitted!</h1>
            <p className="text-gray-600 mb-8">
              Your documents are under review. We'll notify you once verified.
            </p>

            <div className="bg-[#F3F1F7] border border-[#B5A9C9] rounded-lg p-4 mb-8">
              <p className="text-[#3D3066]">
                Verification usually takes 24-48 hours
              </p>
            </div>

            <button
              onClick={onComplete}
              className="w-full bg-[#3D3066] text-white py-3 rounded-lg hover:bg-[#5C4E7F] transition-colors"
            >
              Continue to App
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
