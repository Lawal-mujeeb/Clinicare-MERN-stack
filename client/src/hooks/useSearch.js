import { useEffect } from "react";


//useSearch is a custom React hook (convention: starts with use).
//Instead of taking multiple arguments, it takes one object and destructures its properties.
//Whoever calls useSearch must pass in an object with these keys:

export default function useSearch({
  inputRef,  //A React ref pointing to your search <input> element.Used to read the live value of the search box (inputRef.current.value).
  searchParams, //Represents the current URL query parameters.
  setSearchParams, //Lets you update the query parameters without full navigation.
  navigate,  //Used here to programmatically change the browser’s URL
  query,      //Likely the current value of searchParams.get("query").//Acts as the "source of truth" for whether a query exists in the URL.
}) {
  useEffect(() => {
    if (query) {
      const params = new URLSearchParams(searchParams);
      const inputElement = inputRef.current; //Grabs the actual <input> DOM element (the search box). inputRef.current is whatever you attached with <input ref={inputRef} />
      if (inputElement) {
        const queryValue = inputElement.value.trim();
        if (queryValue) {
          params.set("query", queryValue); //If the input has text → updates the URL params to include ?query=text.
        } else {
          params.delete("query"); //If the input is empty → removes the query parameter entirely from the URL.
        }
        setSearchParams(params); //This updates the URL search string without a full page reload.
      }
    }
  }, [inputRef, query, searchParams, setSearchParams]);
//This effect says:"Whenever the query value changes, look at the search box. If it has text, update the URL to match. If it’s empty, strip the query parameter out."


  useEffect(() => {
    if (inputRef.current && inputRef.current?.value !== "") { //if we have an input value
      const params = new URLSearchParams(searchParams); 
      params.set("query", inputRef.current?.value); //if the input has a value, update the url to include it
      navigate(window.location.pathname + "?" + params.toString()); // navigate to the input path and and question mark to the search  direction
    } else {
      navigate(window.location.pathname);
      const params = new URLSearchParams(searchParams);
      params.delete("query");
      setSearchParams(params);
    }
  }, [
    inputRef,
    inputRef?.current?.value,
    navigate,
    searchParams,
    setSearchParams,
  ]);
}

//Watches the actual input value (via inputRef?.current?.value).
//If input has text → ensures the browser navigates to pathname?query=value.
//If input is empty → navigates to just pathname (no ?query) and also removes the query from searchParams.