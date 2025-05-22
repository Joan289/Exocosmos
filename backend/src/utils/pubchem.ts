import { AppError } from "../middlewares/error.js";

/**
 * Fetches compound data from PubChem using the PUG-View REST API.
 * 
 * Extracts:
 * - `name` from `RecordTitle`
 * - `formula` from "Names and Identifiers > Molecular Formula"
 * 
 * If the compound is not found or the response is malformed, throws a 404 AppError.
 * 
 * @param CID - PubChem Compound ID
 * @returns An object with `CID`, `name`, and `formula` (truncated)
 */
export async function fetchCompoundFromPubChem(CID: number) {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${CID}/JSON`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new AppError(404, `Compound with CID ${CID} not found in PubChem.`);
  }

  const data = await res.json();
  const record = data?.Record;

  if (!record) {
    throw new AppError(404, `Compound with CID ${CID} returned no record from PubChem.`);
  }

  // Extract compound name
  const name = record.RecordTitle ?? `CID-${CID}`;

  // Extract molecular formula from the expected section path
  const formula = record.Section
    ?.find((s: { TOCHeading?: string; }) => s.TOCHeading === 'Names and Identifiers')
    ?.Section?.find((s: { TOCHeading?: string; }) => s.TOCHeading === 'Molecular Formula')
    ?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String ?? 'Unknown';

  return {
    CID,
    name: name.slice(0, 100),
    formula: formula.slice(0, 50)
  };
}
