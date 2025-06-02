import React from "react";

const DataDisplay = ({ data }) => {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Email Lookup Results</h1>
      <div className="grid gap-4">
        {data.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-blue-600">{item.pretty_name}</h2>
            <p className="text-gray-700">Module: {item.module}</p>
            <p className="text-gray-700">Query: {item.query}</p>
            <p className="text-gray-700">Source: {item.from}</p>
            <p className="text-gray-700">Status: {item.status}</p>
            <p className="text-gray-700">Category: {item.category.name} - {item.category.description}</p>
            <p className="text-green-600 font-medium">Registered: {item.spec_format[0].registered.value ? "Yes" : "No"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataDisplay;
