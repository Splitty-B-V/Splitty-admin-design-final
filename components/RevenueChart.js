import { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function RevenueChart() {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: 'rgb(243, 244, 246)',
        bodyColor: 'rgb(209, 213, 219)',
        borderColor: 'rgb(55, 65, 81)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('nl-NL', {
                style: 'currency',
                currency: 'EUR',
              }).format(context.parsed.y)
            }
            return label
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
      },
      y: {
        grid: {
          color: 'rgba(55, 65, 81, 0.3)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          callback: function (value) {
            return '€' + value
          },
        },
      },
    },
  }

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue',
        data: [3200, 3800, 3500, 4200, 3900, 4100, 4409],
        fill: true,
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderColor: 'rgb(255, 107, 107)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(255, 107, 107)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 transition-transform duration-300 hover:shadow-xl hover:scale-[1.01]">
      <h2 className="text-lg font-medium mb-4 text-white">Revenue Trend</h2>
      <div className="h-64">
        <Line options={options} data={data} />
      </div>
    </div>
  )
}