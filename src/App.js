import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import { XMarkIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

const App = () => {
  const [input, setInput] = useState('{\n"data":[]\n}');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([
    "Numbers",
    "Highest Lowercase Alphabet",
  ]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const options = [
    "Numbers",
    "Highest Lowercase Alphabet",
    "Alphabets",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponse(null);

    try {
      const parsedInput = JSON.parse(input);
      console.log(parsedInput)
      const res = await fetch("http://localhost:5000/bfhl", {
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
      setResponse(data);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Error communicating with the server"
          : "Invalid JSON input"
      );
    }
  };

  const handleOptionChange = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const renderResponse = () => {
    if (!response) return null;

    return (
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Filtered Response</h2>
        {selectedOptions.includes("Numbers") && (
          <p>Numbers: {response.numbers.join(", ")}</p>
        )}
        {selectedOptions.includes("Highest Lowercase Alphabet") && (
          <p>Highest Lowercase Alphabet: {response.highest_lowercase_alphabet.join("")}</p>
        )}
        {selectedOptions.includes("Alphabets") && (
          <p>Alphabets: {response.alphabets.join(", ")}</p>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">BFHL Demo</h1>
      <div className="mb-4">
        <label
          htmlFor="api-input"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          API Input
        </label>
        <textarea
          id="api-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows="3"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
      >
        Submit
      </button>
      {response && (
        <div className="mt-4 relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-gray-100 text-left py-2 px-4 rounded-md flex justify-between items-center"
          >
            <span>Multi Filter</span>
            <ChevronDownIcon className="h-5 w-5" />
          </button>
          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
              {options.map((option) => (
                <label
                  key={option}
                  className="flex items-center p-2 hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionChange(option)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
          <div className="mt-2 flex flex-wrap">
            {selectedOptions.map((option) => (
              <span
                key={option}
                className="bg-gray-200 text-sm rounded-full px-3 py-1 m-1 flex items-center"
              >
                {option}
                <XMarkIcon
                  className="h-4 w-4 ml-1 cursor-pointer"
                  onClick={() => handleOptionChange(option)}
                />
              </span>
            ))}
          </div>
        </div>
      )}
      {renderResponse()}
      <Transition
        show={!!error}
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
          <span className="block sm:inline"> {error}</span>
        </div>
      </Transition>
    </div>
  );
};

export default App;
