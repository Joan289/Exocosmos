"use client";

import { useState, useEffect } from "react";
import { useFetchWithAuth } from "../hooks/useFetchWithAuth";
import { Loader } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function AddCompoundByName({
  onAdd,
  disabled,
  existingCompounds = [],
}) {
  /**
   * Input field value (compound name)
   */
  const [input, setInput] = useState("");

  /**
   * List of name suggestions returned from PubChem autocomplete
   */
  const [suggestions, setSuggestions] = useState([]);

  /**
   * Whether the component is currently processing a selection
   */
  const [loading, setLoading] = useState(false);

  /**
   * Optional user feedback message
   */
  const [message, setMessage] = useState(null);

  const fetchWithAuth = useFetchWithAuth();

  useEffect(() => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }

    // Query PubChem autocomplete endpoint
    fetch(
      `https://pubchem.ncbi.nlm.nih.gov/rest/autocomplete/compound/${input}/json`
    )
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data.dictionary_terms?.compound || []);
      })
      .catch(() => setSuggestions([]));
  }, [input]);

  /**
   * Handles compound selection from the suggestion list.
   * Fetches CID from PubChem and adds the compound to the local database.
   */
  const handleSelect = async (name) => {
    setLoading(true);
    setMessage(null);

    try {
      // Step 1: Get CID from PubChem
      const cidRes = await fetch(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${name}/cids/JSON`
      );
      const cidData = await cidRes.json();
      const cid = cidData.IdentifierList?.CID?.[0];

      if (!cid) {
        setMessage("No s'ha trobat el CID.");
        setLoading(false);
        return;
      }

      // Step 2: Avoid duplicates
      const alreadyExists = existingCompounds.some((c) => c.CID === cid);
      if (alreadyExists) {
        setMessage("Aquest compost ja està afegit.");
        setLoading(false);
        return;
      }

      // Step 3: POST to local API
      const localCompound = await fetchWithAuth(`${API_URL}/compounds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ CID: cid }),
      }).then((res) => res.data);

      onAdd(localCompound);
      setInput("");
      setSuggestions([]);
      setMessage("Afegit amb èxit!");
    } catch (err) {
      setMessage("Error en afegir el compost.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="mb-3">
        <label className="text-sm font-medium text-white block mb-2">
          Afegir compost pel nom
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled || loading}
          placeholder="Ex: oxygen"
          className="w-full px-3 py-2 rounded-lg bg-gray-800/70 border border-gray-700 text-sm text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
        />
      </div>

      {suggestions.length > 0 && (
        <ul className="mt-1 bg-gray-800 border border-gray-700 rounded-lg max-h-40 overflow-y-auto text-sm text-white">
          {suggestions.map((name) => (
            <li
              key={name}
              onClick={() => handleSelect(name)}
              className="px-3 py-2 hover:bg-gray-700 cursor-pointer transition-colors"
            >
              {name}
            </li>
          ))}
        </ul>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-xs text-blue-400 mt-2">
          <Loader className="h-3 w-3 animate-spin" />
          <span>Cercant i afegint...</span>
        </div>
      )}

      {message && (
        <p
          className={`text-xs mt-2 ${
            message.includes("Error") ? "text-red-400" : "text-green-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
