import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const TaskStatusChart = () => {
  const data = [
    {
      name: "To Do",
      value: 12,
      color: "#F59E0B",
    },
    {
      name: "In Progress",
      value: 18,
      color: "#3B82F6",
    },
    {
      name: "Review",
      value: 6,
      color: "#8B5CF6",
    },
    {
      name: "Completed",
      value: 32,
      color: "#22C55E",
    },
  ];

  const totalTasks = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Task Status</h2>

          <p className="mt-0.5 text-xs text-gray-500">
            Current task distribution
          </p>
        </div>

        <span className="rounded-lg bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-600">
          This Week
        </span>
      </div>

     {/* Body */}
<div className="relative h-[360px] overflow-hidden">

  {/* TOP LEFT */}
  <div className="absolute z-10 left-6 top-8">
    <div className="flex items-center gap-2">
      <span className="h-3.5 w-3.5 rounded-full bg-orange-500 ring-4 ring-orange-100 shadow-sm" />

      <h4 className="text-sm font-semibold text-gray-900">
        To Do
      </h4>
    </div>

    <p className="mt-1 ml-6 text-xs text-gray-500">
      <span className="font-semibold text-gray-800">12</span> Tasks • 18%
    </p>
  </div>

  {/* TOP RIGHT */}
  <div className="absolute z-10 text-right right-6 top-8">
    <div className="flex items-center justify-end gap-2">
      <h4 className="text-sm font-semibold text-gray-900">
        Completed
      </h4>

      <span className="h-3.5 w-3.5 rounded-full bg-green-500 ring-4 ring-green-100 shadow-sm" />
    </div>

    <p className="mt-1 mr-6 text-xs text-gray-500">
      <span className="font-semibold text-gray-800">32</span> Tasks • 47%
    </p>
  </div>

  {/* BOTTOM LEFT */}
  <div className="absolute z-10 bottom-8 left-6">
    <div className="flex items-center gap-2">
      <span className="h-3.5 w-3.5 rounded-full bg-blue-500 ring-4 ring-blue-100 shadow-sm" />

      <h4 className="text-sm font-semibold text-gray-900">
        In Progress
      </h4>
    </div>

    <p className="mt-1 ml-6 text-xs text-gray-500">
      <span className="font-semibold text-gray-800">18</span> Tasks • 26%
    </p>
  </div>

  {/* BOTTOM RIGHT */}
  <div className="absolute z-10 text-right right-6 bottom-8">
    <div className="flex items-center justify-end gap-2">
      <h4 className="text-sm font-semibold text-gray-900">
        Review
      </h4>

      <span className="h-3.5 w-3.5 rounded-full bg-violet-500 ring-4 ring-violet-100 shadow-sm" />
    </div>

    <p className="mt-1 mr-6 text-xs text-gray-500">
      <span className="font-semibold text-gray-800">6</span> Tasks • 9%
    </p>
  </div>

  {/* DONUT */}
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
            <Cell
              key={index}
              fill={item.color}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>

    {/* Center */}
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold tracking-tight text-gray-900">
        {totalTasks}
      </h2>

      <p className="mt-1 text-xs font-medium tracking-wide text-gray-500 uppercase">
        Total Tasks
      </p>
    </div>

  </div>

</div>
    </div>
  );
};

export default TaskStatusChart;
