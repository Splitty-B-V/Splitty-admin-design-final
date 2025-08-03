import { useState } from 'react'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
import {
  PlusIcon,
  MinusIcon,
  ShoppingCartIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

export default function TestOrder() {
  const [selectedRestaurant, setSelectedRestaurant] = useState('')
  const [tableNumber, setTableNumber] = useState('')
  const [cart, setCart] = useState([])
  const [activeCategory, setActiveCategory] = useState('starters')

  const restaurants = [
    { id: 6, name: 'Limon B.V.' },
    { id: 7, name: 'Viresh Kewalbansing' },
    { id: 10, name: 'Restaurant Stefan' },
    { id: 11, name: 'Aldenaire catering' },
    { id: 15, name: 'Loetje' },
    { id: 16, name: 'Splitty' },
    { id: 17, name: 'Anatolii Restaurant' },
  ]

  const menuCategories = {
    starters: 'Voorgerechten',
    mains: 'Hoofdgerechten',
    desserts: 'Desserts',
    drinks: 'Dranken',
  }

  const menuItems = {
    starters: [
      { id: 1, name: 'Caesar Salade', price: 8.50, description: 'Knapperige romeinse sla, parmezaan, croutons' },
      { id: 2, name: 'Bruschetta', price: 7.00, description: 'Geroosterd brood met tomaten en basilicum' },
      { id: 3, name: 'Soep van de Dag', price: 6.50, description: 'Chef\'s speciale soep' },
      { id: 4, name: 'Knoflookbrood', price: 5.00, description: 'Vers gebakken met knoflookboter' },
    ],
    mains: [
      { id: 5, name: 'Gegrilde Zalm', price: 24.50, description: 'Atlantische zalm met seizoensgroenten' },
      { id: 6, name: 'Ribeye Steak', price: 32.00, description: '300g grasgevoerd rundvlees met friet' },
      { id: 7, name: 'Chicken Parmesan', price: 18.50, description: 'Gepaneerde kip met marinara en kaas' },
      { id: 8, name: 'Vegetarische Pasta', price: 16.00, description: 'Verse pasta met geroosterde groenten' },
    ],
    desserts: [
      { id: 9, name: 'Tiramisu', price: 7.50, description: 'Klassiek Italiaans dessert' },
      { id: 10, name: 'Chocolade Taart', price: 8.00, description: 'Rijke chocolade met vanille-ijs' },
      { id: 11, name: 'Cheesecake', price: 7.00, description: 'New York style met bessensaus' },
    ],
    drinks: [
      { id: 12, name: 'Coca Cola', price: 3.50, description: '330ml' },
      { id: 13, name: 'Verse Jus d\'Orange', price: 4.50, description: '250ml' },
      { id: 14, name: 'Koffie', price: 3.00, description: 'Espresso, Americano, of Cappuccino' },
      { id: 15, name: 'Bier', price: 5.00, description: 'Van de tap of flesje' },
      { id: 16, name: 'Huiswijn', price: 6.50, description: 'Rood of Wit, per glas' },
    ],
  }

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id)
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      )
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId, change) => {
    setCart(
      cart.map((item) => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
        }
        return item
      }).filter(Boolean)
    )
  }

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleSubmitOrder = () => {
    if (!selectedRestaurant || !tableNumber || cart.length === 0) {
      alert('Selecteer een restaurant, voer een tafelnummer in en voeg items toe aan de winkelwagen')
      return
    }
    
    const orderData = {
      restaurant: selectedRestaurant,
      table: tableNumber,
      items: cart,
      total: getTotal(),
    }
    
    console.log('Submitting test order:', orderData)
    alert('Testbestelling succesvol verstuurd!')
    
    // Reset form
    setCart([])
    setTableNumber('')
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#0A0B0F]">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ name: 'Test Bestelling' }]} />

            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-white">Test Bestelling</h1>
              <p className="mt-2 text-[#BBBECC]">
                Maak een testbestelling om de restaurant integratie te verifiëren
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Configuration */}
              <div className="lg:col-span-2 space-y-6">
                {/* Restaurant and Table Selection */}
                <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                  <h2 className="text-xl font-semibold text-white mb-6">Bestelgegevens</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="restaurant" className="block text-sm font-medium text-[#BBBECC] mb-2">
                        Restaurant
                      </label>
                      <select
                        id="restaurant"
                        name="restaurant"
                        value={selectedRestaurant}
                        onChange={(e) => setSelectedRestaurant(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent cursor-pointer"
                      >
                        <option value="">Selecteer een restaurant</option>
                        {restaurants.map((restaurant) => (
                          <option key={restaurant.id} value={restaurant.id}>
                            {restaurant.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="table" className="block text-sm font-medium text-[#BBBECC] mb-2">
                        Tafelnummer
                      </label>
                      <input
                        type="text"
                        id="table"
                        name="table"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder="bijv. 101"
                        className="w-full px-4 py-3 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="bg-[#1c1e27] rounded-xl border border-[#2a2d3a] overflow-hidden">
                  <div className="border-b border-[#2a2d3a]">
                    <nav className="flex -mb-px">
                      {Object.entries(menuCategories).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => setActiveCategory(key)}
                          className={`py-4 px-6 text-sm font-medium border-b-2 transition-all duration-200 ${
                            activeCategory === key
                              ? 'border-[#2BE89A] text-[#2BE89A] bg-[#2BE89A]/10'
                              : 'border-transparent text-[#BBBECC] hover:text-white hover:bg-[#0F1117]'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {menuItems[activeCategory].map((item) => (
                        <div
                          key={item.id}
                          className="bg-[#0F1117] rounded-lg p-5 hover:bg-[#0F1117]/80 border border-[#2a2d3a] hover:border-[#2BE89A]/30 transition-all duration-200 group"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="text-white font-medium text-lg">{item.name}</h3>
                              <p className="text-sm text-[#BBBECC] mt-1">{item.description}</p>
                            </div>
                            <span className="text-[#2BE89A] font-bold ml-4 text-lg">€{item.price.toFixed(2)}</span>
                          </div>
                          <button
                            onClick={() => addToCart(item)}
                            className="mt-3 w-full inline-flex justify-center items-center px-4 py-2.5 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg"
                          >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Toevoegen
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart */}
              <div className="lg:col-span-1">
                <div className="bg-[#1c1e27] rounded-xl border border-[#2a2d3a] sticky top-4">
                  <div className="p-6 border-b border-[#2a2d3a]">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <ShoppingCartIcon className="h-5 w-5 mr-2 text-[#2BE89A]" />
                      Winkelwagen ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
                    </h2>
                  </div>

                  <div className="p-6">
                    {cart.length === 0 ? (
                      <p className="text-[#BBBECC] text-center py-12">Je winkelwagen is leeg</p>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div key={item.id} className="bg-[#0F1117] rounded-lg p-4 border border-[#2a2d3a]">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h4 className="text-white font-medium">{item.name}</h4>
                                <p className="text-sm text-[#BBBECC]">€{item.price.toFixed(2)} per stuk</p>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-400 hover:text-red-300 ml-2 transition-colors"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="p-1.5 rounded-md bg-[#2a2d3a] hover:bg-[#2BE89A]/20 text-white transition-colors"
                                >
                                  <MinusIcon className="h-4 w-4" />
                                </button>
                                <span className="text-white font-medium w-8 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="p-1.5 rounded-md bg-[#2a2d3a] hover:bg-[#2BE89A]/20 text-white transition-colors"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                </button>
                              </div>
                              <span className="text-[#2BE89A] font-bold">
                                €{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}

                        <div className="border-t border-[#2a2d3a] pt-4 mt-4">
                          <div className="flex justify-between items-center text-lg font-bold mb-4">
                            <span className="text-white">Totaal</span>
                            <span className="text-[#2BE89A] text-xl">€{getTotal().toFixed(2)}</span>
                          </div>
                        </div>

                        <button
                          onClick={handleSubmitOrder}
                          className="w-full inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg"
                        >
                          Verstuur Testbestelling
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}