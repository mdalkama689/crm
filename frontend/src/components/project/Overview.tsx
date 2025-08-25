import { ArrowUp, ArrowDown } from 'lucide-react';

const Overview = () => {
  const metrics = [
    {
      title: 'Sales',
      subtitle: 'Weekly comparison',
      value: '1,187',
      trend: 'up',
      progressColor: 'bg-red-400',
      progressWidth: '75%',
    },
    {
      title: 'Leads',
      subtitle: 'Monthly comparison',
      value: '4,619',
      trend: 'down',
      progressColor: 'bg-purple-500',
      progressWidth: '60%',
    },
    {
      title: 'Income',
      subtitle: 'Weekly comparison',
      value: '$10,593.09',
      trend: 'up',
      progressColor: 'bg-cyan-400',
      progressWidth: '80%',
    },
    {
      title: 'Spendings',
      subtitle: 'Month comparison',
      value: '$4,730.41',
      trend: 'up',
      progressColor: 'bg-lime-500',
      progressWidth: '90%',
    },
  ];

  return (
    <div className="bg-white w-full max-w-[380px] p-6">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-900 mb-8">Overview</h2>

      {/* Metrics */}
      <div className="space-y-8">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-3">
            {/* Title and Value Row */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  {metric.title}
                </h3>
                <p className="text-sm text-gray-500">{metric.subtitle}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg font-semibold text-gray-900">
                  {metric.value}
                </span>
                {metric.trend === 'up' ? (
                  <ArrowUp size={16} className="text-cyan-400" />
                ) : (
                  <ArrowDown size={16} className="text-red-400" />
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${metric.progressColor}`}
                style={{ width: metric.progressWidth }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
