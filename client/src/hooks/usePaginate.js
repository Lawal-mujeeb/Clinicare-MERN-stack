import { useNavigate, useSearchParams } from "react-router";
import { useMemo } from "react";

export default function usePaginate({ totalPages, hasMore, currentPage }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);
  const params = useMemo(  //Copies the current search params so you can update them easily (e.g. change page to 2).
    () => new URLSearchParams(searchParams),
    [searchParams]
  );

  const handlePageChange = (direction) => {
    const pageChangeMap = {
      first: 1, //it goes to page 1.
      last: totalPages, //it goes to the last page.
      prev: Math.max(1, page - 1), //it goes to the previous page.
      next: Math.min(totalPages, page + 1), //it goes to currentPage + 1, but never more than the total pages.
    };
    const newPage = pageChangeMap[direction];
    if (newPage !== undefined) {  //Updates the query string in the URL →e.g. /users?page=3&limit=10.
      params.set("page", newPage.toString());
      params.set("limit", limit.toString());
      navigate(window.location.pathname + "?" + params.toString()); //Then navigate(...) makes React Router actually go to that new URL.
    }
    //handlePageChange just says: “If I click Next, figure out the new page number.” “Update the URL with that new page.” “Navigate there so the data refreshes.”
  };

  return {
    handlePageChange,
    page,
    totalPages,
    limit,
    hasMore,
    currentPage,
  };
}