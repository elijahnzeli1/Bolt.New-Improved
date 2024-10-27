import React from 'react';
import { Bar } from 'react-chartjs-2';

interface DataPoint {
  label: string;
  value: number;
}

interface ModelAnalyticsProps {
  analyticsData: DataPoint[];
}

const ModelAnalytics: React.FC<ModelAnalyticsProps> = ({ analyticsData }) => {
  const chartData = {
    labels: analyticsData.map(dataPoint => dataPoint.label),
    datasets: [
      {
        label: 'Model Performance',
        data: analyticsData.map(dataPoint => dataPoint.value),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Model Performance Analytics</h2>
      {analyticsData.length > 0 ? (
        <>
          <Bar data={chartData} />
          <ul>
            {analyticsData.map((dataPoint, index) => (
              <li key={index}>
                <strong>{dataPoint.label}:</strong> {dataPoint.value}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No analytics data available.</p>
      )}
    </div>
  );
};

export default ModelAnalytics;