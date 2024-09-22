import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import { XMarkIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

const App = () => {
  const [jsonInput, setJsonInput] = useState('{\n"data":[]\n}');
  const [apiResponse, setApiResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([
    "Numbers",
    "Highest Lowercase Alphabet",
  ]);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterOptions = [
    "Numbers",
    "Highest Lowercase Alphabet",
    "Alphabets",
  ];

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setApiResponse(null);

    try {
      const parsedInput = JSON.parse(jsonInput);
      console.log(parsedInput)
      const res = await fetch("https://bfhl-backend-wheat.vercel.app/bfhl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
      setApiResponse(data);
    } catch (err) {
      setErrorMessage(
        err.message === "Failed to fetch"
          ? "Error communicating with the server"
          : "Invalid JSON input"
      );
    }
  };

  const handleFilterChange = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((item) => item !== filter)
        : [...prev, filter]
    );
  };

  const renderFilteredResponse = () => {
    if (!apiResponse) return null;

    return (
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Filtered Response</h2>
        {selectedFilters.includes("Numbers") && (
          <p>Numbers: {apiResponse.numbers.join(", ")}</p>
        )}
        {selectedFilters.includes("Highest Lowercase Alphabet") && (
          <p>Highest Lowercase Alphabet: {apiResponse.highest_lowercase_alphabet.join("")}</p>
        )}
        {selectedFilters.includes("Alphabets") && (
          <p>Alphabets: {apiResponse.alphabets.join(", ")}</p>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">BFHL Demo</h1>
      <div className="mb-4">
        <label
          htmlFor="json-input"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          API Input
        </label>
        <textarea
          id="json-input"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows="3"
        />
      </div>
      <button
        onClick={handleFormSubmit}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
      >
        Submit
      </button>
      {apiResponse && (
        <div className="mt-4 relative">
          <button
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className="w-full bg-gray-100 text-left py-2 px-4 rounded-md flex justify-between items-center"
          >
            <span>Multi Filter</span>
            <ChevronDownIcon className="h-5 w-5" />
          </button>
          {isFilterDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
              {filterOptions.map((filter) => (
                <label
                  key={filter}
                  className="flex items-center p-2 hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(filter)}
                    onChange={() => handleFilterChange(filter)}
                    className="mr-2"
                  />
                  {filter}
                </label>
              ))}
            </div>
          )}
          <div className="mt-2 flex flex-wrap">
            {selectedFilters.map((filter) => (
              <span
                key={filter}
                className="bg-gray-200 text-sm rounded-full px-3 py-1 m-1 flex items-center"
              >
                {filter}
                <XMarkIcon
                  className="h-4 w-4 ml-1 cursor-pointer"
                  onClick={() => handleFilterChange(filter)}
                />
              </span>
            ))}
          </div>
        </div>
      )}
      {renderFilteredResponse()}
      <Transition
        show={!!errorMessage}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {errorMessage}</span>
        </div>
      </Transition>
    </div>
  );
};

export default App;
