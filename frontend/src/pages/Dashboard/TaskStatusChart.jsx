import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const TaskStatusChart = ({ data = [] }) => {
  const totalTasks = data.reduce((sum, item) => sum + item.value, 0);

  if (totalTasks === 0) {
    return (
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl p-10 text-center">
        <p className="text-gray-500">No task data available yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Task Status</h2>
          <p className="mt-0.5 text-xs text-gray-500">Current task distribution</p>
        </div>
      </div>

      <div className="relative h-[360px] overflow-hidden">
        {data.map((item, index) => {
          // Dynamic positioning based on index (simplified for 4 items)
          const positions = [
            { pos: 'left-6 top-8', align: 'left' },
            { pos: 'right-6 top-8', align: 'right' },
            { pos: 'left-6 bottom-8', align: 'left' },
            { pos: 'right-6 bottom-8', align: 'right' }
          ];
          const { pos, align } = positions[index] || positions[0];
          const percentage = Math.round((item.value / totalTasks) * 100);

          return (
            <div key={item.name} className={`absolute z-10 ${pos} ${align === 'right' ? 'text-right' : ''}`}>
              <div className={`flex items-center gap-2 ${align === 'right' ? 'justify-end' : ''}`}>
                <span className={`h-3.5 w-3.5 rounded-full ring-4 shadow-sm`} style={{ backgroundColor: item.color, ringColor: `${item.color}20` }} />
                <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
              </div>
              <p className={`mt-1 text-xs text-gray-500 ${align === 'right' ? 'mr-6' : 'ml-6'}`}>
                <span className="font-semibold text-gray-800">{item.value}</span> Tasks • {percentage}%
              </p>
            </div>
          );
        })}

        <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 h-60 w-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={78}
                outerRadius={108}
                paddingAngle={3}
                stroke="#fff"
                strokeWidth={5}
              >
                {data.map((item, index) => (
                  <Cell key={index} fill={item.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900">{totalTasks}</h2>
            <p className="mt-1 text-xs font-medium tracking-wide text-gray-500 uppercase">Total Tasks</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStatusChart;