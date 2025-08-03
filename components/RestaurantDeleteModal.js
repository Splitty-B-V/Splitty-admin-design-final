import { useState } from 'react'
import {
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

export default function RestaurantDeleteModal({ restaurant, onClose, onConfirm }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerTalked: false,
    qrReturned: false,
    paymentsSettled: false,
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.restaurantName.toLowerCase() === restaurant.name.toLowerCase()
      case 2:
        return formData.ownerTalked
      case 3:
        return formData.qrReturned
      case 4:
        return formData.paymentsSettled
      default:
        return false
    }
  }

  const handleNext = () => {
    if (isStepValid()) {
      if (step < 4) {
        setStep(step + 1)
      } else {
        // All verifications complete, proceed with deletion
        onConfirm()
      }
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Stap 1: Bevestig Restaurant Naam</h4>
            <p className="text-[#BBBECC] mb-4">
              Type de exacte naam van het restaurant om door te gaan met het verwijderingsproces.
            </p>
            <div className="bg-[#0F1117] border border-[#2a2d3a] rounded-lg p-4 mb-4">
              <p className="text-sm text-[#BBBECC]">Restaurant dat verwijderd wordt:</p>
              <p className="text-lg font-semibold text-white">{restaurant.name}</p>
            </div>
            <input
              type="text"
              name="restaurantName"
              className="w-full px-4 py-3 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Type de restaurant naam..."
              value={formData.restaurantName}
              onChange={handleInputChange}
            />
            <p className="text-xs text-[#BBBECC] mt-2">
              Verwachte invoer: <span className="text-white font-mono">{restaurant.name}</span>
            </p>
          </div>
        )
      
      case 2:
        return (
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Stap 2: Contact met Eigenaar</h4>
            <p className="text-[#BBBECC] mb-4">
              Bevestig dat je contact hebt gehad met de restaurant eigenaar of manager over het beëindigen van de samenwerking.
            </p>
            <div className="bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-lg p-4 mb-4">
              <p className="text-[#FF6B6B] font-medium mb-2">⚠️ Belangrijk</p>
              <p className="text-sm text-[#BBBECC]">
                Het is essentieel dat de restaurant eigenaar op de hoogte is van het beëindigen van de Splitty diensten.
              </p>
            </div>
            <label className="flex items-start bg-[#0F1117] rounded-lg p-4 cursor-pointer border border-[#2a2d3a] hover:border-[#2BE89A]/50 transition">
              <input
                type="checkbox"
                name="ownerTalked"
                className="h-5 w-5 text-[#2BE89A] mt-0.5 focus:ring-[#2BE89A] border-[#2a2d3a] rounded bg-[#0F1117]"
                checked={formData.ownerTalked}
                onChange={handleInputChange}
              />
              <div className="ml-3">
                <span className="text-white font-medium">Ja, ik heb gesproken met de eigenaar/manager</span>
                <p className="text-sm text-[#BBBECC] mt-1">
                  De restaurant eigenaar is geïnformeerd en heeft ingestemd met het beëindigen van de diensten.
                </p>
              </div>
            </label>
          </div>
        )
      
      case 3:
        return (
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Stap 3: QR Code Houders</h4>
            <p className="text-[#BBBECC] mb-4">
              Bevestig dat alle QR code houders zijn terugontvangen van het restaurant.
            </p>
            <div className="bg-[#667EEA]/10 border border-[#667EEA]/30 rounded-lg p-4 mb-4">
              <p className="text-[#667EEA] font-medium mb-2">📱 QR Code Materialen</p>
              <p className="text-sm text-[#BBBECC]">
                Alle fysieke QR code houders, tafelstickers en andere Splitty materialen moeten worden terugontvangen.
              </p>
            </div>
            <label className="flex items-start bg-[#0F1117] rounded-lg p-4 cursor-pointer border border-[#2a2d3a] hover:border-[#2BE89A]/50 transition">
              <input
                type="checkbox"
                name="qrReturned"
                className="h-5 w-5 text-[#2BE89A] mt-0.5 focus:ring-[#2BE89A] border-[#2a2d3a] rounded bg-[#0F1117]"
                checked={formData.qrReturned}
                onChange={handleInputChange}
              />
              <div className="ml-3">
                <span className="text-white font-medium">Alle QR materialen zijn terugontvangen</span>
                <p className="text-sm text-[#BBBECC] mt-1">
                  Ik heb alle QR code houders en andere Splitty materialen terugontvangen van het restaurant.
                </p>
              </div>
            </label>
          </div>
        )
      
      case 4:
        return (
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Stap 4: Financiële Afhandeling</h4>
            <p className="text-[#BBBECC] mb-4">
              Bevestig dat alle financiële zaken zijn afgehandeld en dat er geen openstaande betalingen zijn.
            </p>
            <div className="bg-[#2BE89A]/10 border border-[#2BE89A]/30 rounded-lg p-4 mb-4">
              <p className="text-[#2BE89A] font-medium mb-2">💰 Financiële Checklist</p>
              <ul className="text-sm text-[#BBBECC] space-y-1">
                <li>• Laatste Stripe uitbetalingen zijn verwerkt</li>
                <li>• Geen openstaande facturen of betalingen</li>
                <li>• Alle transacties zijn afgerond</li>
                <li>• Stripe account is afgesloten of overgezet</li>
              </ul>
            </div>
            <label className="flex items-start bg-[#0F1117] rounded-lg p-4 cursor-pointer border border-[#2a2d3a] hover:border-[#2BE89A]/50 transition">
              <input
                type="checkbox"
                name="paymentsSettled"
                className="h-5 w-5 text-[#2BE89A] mt-0.5 focus:ring-[#2BE89A] border-[#2a2d3a] rounded bg-[#0F1117]"
                checked={formData.paymentsSettled}
                onChange={handleInputChange}
              />
              <div className="ml-3">
                <span className="text-white font-medium">Alle financiële zaken zijn afgehandeld</span>
                <p className="text-sm text-[#BBBECC] mt-1">
                  Er zijn geen openstaande betalingen en alle Stripe transacties zijn afgerond.
                </p>
              </div>
            </label>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1c1e27] rounded-xl p-6 max-w-lg w-full mx-4 border border-[#2a2d3a] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <BuildingOfficeIcon className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-white ml-3">Restaurant Verwijderen</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#BBBECC] hover:text-white transition"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition ${
                    i < step
                      ? 'bg-[#2BE89A] text-black'
                      : i === step
                      ? 'bg-red-500 text-white'
                      : 'bg-[#0F1117] text-[#BBBECC] border border-[#2a2d3a]'
                  }`}
                >
                  {i < step ? <CheckCircleIcon className="h-5 w-5" /> : i}
                </div>
                {i < 4 && (
                  <div
                    className={`h-0.5 w-full mx-2 transition ${
                      i < step ? 'bg-[#2BE89A]' : 'bg-[#2a2d3a]'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-[#BBBECC]">
            <span>Naam</span>
            <span>Contact</span>
            <span>QR</span>
            <span>Financieel</span>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-red-400 font-medium mb-1">Permanente Actie</p>
              <p className="text-sm text-[#BBBECC]">
                Het verwijderen van een restaurant profiel is permanent en kan niet ongedaan worden gemaakt. 
                Alle data, gebruikers en bestellingen worden permanent verwijderd.
              </p>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-6">
          {renderStepContent()}
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={step === 1}
            className="px-6 py-3 bg-[#0F1117] border border-[#2a2d3a] text-white font-medium rounded-lg hover:bg-[#1a1c25] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Vorige
          </button>
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`px-6 py-3 font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
              step === 4
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black hover:opacity-90'
            }`}
          >
            {step === 4 ? 'Permanent Verwijderen' : 'Volgende'}
          </button>
        </div>
      </div>
    </div>
  )
}