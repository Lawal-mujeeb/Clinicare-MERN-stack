import { RiSearchLine, RiCloseLine } from "@remixicon/react";
import { useSearchParams, useNavigate } from "react-router"; //useSearchParams → gives you [searchParams, setSearchParams] for URL queries.
import { useRef } from "react"; //tracks the <input> element.
import useSearch from "@/hooks/useSearch";
import { useDebouncedCallback } from "use-debounce"; //useDebouncedCallback → prevents firing search logic on every keystroke (waits 500ms).

export default function Search({ id, children }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const query = searchParams.get("query") || "";
  useSearch({
    inputRef,
    searchParams,
    setSearchParams,
    navigate,
    query,
  });

  //Wraps your function in a debounce: it will only run after 500ms of no typing.This avoids firing the function on every single keystroke.
  const debouncedSubmit = useDebouncedCallback((e) => {
    e.preventDefault(); //e.preventDefault() stops the form’s default submit behavior (refreshing the page).
    const value = e.target.value; //Grabs what the user typed into the input field.
    const params = new URLSearchParams(searchParams); //this makes a copy of the current url search parameters
    if (value.length > 3) {
      params.set("query", value);
    } else {
      params.delete("query");
    }
    setSearchParams(params);
  }, 500);  //Waits 500ms after the last keystroke (debouncing).
  // in plain words  Wait half a second (to avoid spamming).If the text is long enough (>3 chars) → put it in the URL as ?query=....If it’s too short → clear ?query.



  return (
    <>
      <div className="flex justify-between items-center md:gap-2 w-full md:w-auto">
        <form role="search" id={id} className="relative flex-1">
          <label className="input w-full max-w-[220px]">
            <RiSearchLine className="text-gray-500" />
            <input
              onChange={debouncedSubmit}
              type="search"
              className="w-full grow"
              placeholder="Search"
              name="query"
              aria-label="Search"
              defaultValue={query}
              ref={inputRef}
            />
          </label>
          {query && (
            <RiCloseLine
              className="absolute top-[20%] right-2"
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.delete("query");
                setSearchParams(params);
                if (inputRef.current) {
                  inputRef.current.value = "";
                }
              }}
            />
          )}
        </form>
        {children}
         {/* allows adding extra buttons/elements beside the search form */}
      </div>
    </>
  );
}




// Great question — that “> 3 characters” check is a classic pattern in search.

// Why it’s used 🧐

// Avoid noisy queries

// Short terms like "a", "i", "to" are too common.

// If you run a search or hit an API for every tiny word, you’ll get useless results.

// Performance

// Each keystroke could trigger a fetch.

// If you allow 1–2 letter searches, that could mean lots of unnecessary requests (especially with debounce < 500ms).

// User intent

// Usually when someone types 1–2 characters, they’re just starting to type — not ready to search yet.

// Waiting until 3+ chars means you’re more likely to have a meaningful search term.

// Cleaner URL / UX

// Without this rule, your app could fill the URL with ?query=a, ?query=ab, ?query=abc with every keystroke.

// With the rule, only more deliberate queries end up in the URL (less clutter).