import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../../../components/Layout';
import mockDB from '../../../../utils/mockDatabase';
import { 
  ArrowLeftIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  CalendarIcon,
  HashtagIcon,
  TableCellsIcon,
  UserIcon,
  CurrencyEuroIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

export default function OrderDetails() {
  const router = useRouter();
  const { id, orderId } = router.query;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId && id) {
      console.log('Looking for order:', orderId, 'in restaurant:', id);
      
      // Get order from centralized mock database
      const orderData = mockDB.getOrder(orderId);
      
      if (orderData) {
        console.log('Found order:', orderData);
        // Ensure the restaurant ID matches or just set it anyway for demo
        setOrder(orderData);
      } else {
        // Order not found, create a fallback order
        console.log('Order not found, creating fallback for:', orderId);
        
        // Create a fallback order with the given ID
        const fallbackOrder = {
          id: orderId,
          restaurantId: id,
          restaurantName: 'Restaurant',
          posTransactionId: `3000${orderId.toString().padStart(7, '0')}`,
          tableNumber: ((parseInt(orderId) * 7) % 20) + 1,
          customer: `Tafel ${((parseInt(orderId) * 7) % 20) + 1}`,
          totalAmount: '75.50',
          paidAmount: '75.50',
          remainingAmount: '0.00',
          status: 'completed',
          splitMode: 'Items',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          items: [
            { name: 'Burger', quantity: 2, unitPrice: 15.50, total: 31.00, paymentStatus: 'paid' },
            { name: 'Friet', quantity: 2, unitPrice: 4.50, total: 9.00, paymentStatus: 'paid' },
            { name: 'Bier', quantity: 4, unitPrice: 3.50, total: 14.00, paymentStatus: 'paid' },
            { name: 'Dessert', quantity: 2, unitPrice: 7.50, total: 15.00, paymentStatus: 'paid' }
          ],
          payments: [{
            id: `#${orderId}`,
            method: 'card',
            customer: 'Gast',
            amount: 75.50,
            tip: 6.50,
            status: 'completed',
            date: new Date(Date.now() - 1 * 60 * 60 * 1000)
          }]
        };
        
        setOrder(fallbackOrder);
      }
    }
  }, [orderId, id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!order) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Back Button */}
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 rounded-lg transition-all text-sm font-medium group bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-700 hover:bg-gray-100 hover:border-green-300"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Terug
          </button>

          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-[#111827] mb-1">
                Order #{order.id}
                <span className="ml-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {order.status === 'completed' && (
                      <>
                        <CheckCircleIconSolid className="h-4 w-4 mr-1" />
                        Voltooid
                      </>
                    )}
                    {order.status === 'in_progress' && (
                      <>
                        <ClockIcon className="h-4 w-4 mr-1" />
                        Actief
                      </>
                    )}
                    {order.status === 'partial' && (
                      <>
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-1.5" />
                        Deels Betaald
                      </>
                    )}
                  </span>
                </span>
              </h1>
              <p className="text-[#6B7280]">Bestel details en betaling informatie</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                Vernieuwen
              </button>
            </div>
          </div>

          {/* Order Details Card */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Bestel Details</h3>
                <p className="mt-1 text-sm text-gray-500">Aangemaakt op {formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center">
                <span className="text-lg font-medium">{order.restaurantName}</span>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Restaurant ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {order.restaurantId} ({order.restaurantName})
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">POS Transactie ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.posTransactionId}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Tafel Informatie</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Tafel #{order.tableNumber}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Klant</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.customer}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Totaal Bedrag</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium">€{order.totalAmount}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Resterend Bedrag</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">€{order.remainingAmount}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 sm:mt-0 sm:col-span-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {order.status === 'completed' && (
                        <>
                          <CheckCircleIconSolid className="h-4 w-4 mr-1" />
                          Voltooid
                        </>
                      )}
                      {order.status === 'in_progress' && (
                        <>
                          <ClockIcon className="h-4 w-4 mr-1" />
                          Actief
                        </>
                      )}
                      {order.status === 'partial' && (
                        <>
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-1.5" />
                          Deels Betaald
                        </>
                      )}
                    </span>
                    {order.completedAt && (
                      <p className="text-sm text-gray-500 mt-1">Voltooid op {formatDate(order.completedAt)}</p>
                    )}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Split Modus</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.splitMode}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Bestel Items</h3>
              <p className="mt-1 text-sm text-gray-500">{order.items.length} items in deze bestelling</p>
            </div>
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Artikel
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aantal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stukprijs
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Totaal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Betaalstatus
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          €{item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          €{item.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {item.paymentStatus === 'paid' ? 'Betaald' : 'In afwachting'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payments */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Betalingen</h3>
              <p className="mt-1 text-sm text-gray-500">{order.payments.length} betaling(en) voor deze bestelling</p>
            </div>
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Methode
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Klant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bedrag
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Datum
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.payments.map((payment, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          €{payment.amount.toFixed(2)}
                          {payment.tip && (
                            <span className="text-xs text-gray-400 block">
                              Fooi: €{payment.tip.toFixed(2)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Voltooid
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payment.date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}