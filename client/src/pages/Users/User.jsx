import PageWrapper from "@/components/PageWrapper";
import AddUser from "@/features/user/AddUser";

// import { dummy } from "@/utils/constants";
import { getAllUsers } from "@/api/auth";
import { SkeletonCard } from "@/components/LazyLoader";
import ErrorAlert from "@/components/ErrorAlert";
import { useAuth } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import usePaginate from "@/hooks/usePaginate";
import Paginate from "@/components/Paginate";
import Search from "@/components/Search";
import Filter from "@/features/user/Filter";
import { lazy, Suspense } from "react";
const UserCards = lazy(() => import("@/features/user/UserCards"));


export default function User() {
  const { accessToken } = useAuth();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const role = searchParams.get("role") || "";
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["getAllUsers", page, limit, query, role],
    queryFn: () => getAllUsers(searchParams, accessToken),
  });

  const { handlePageChange, totalPages, hasMore, currentPage } = usePaginate({
    totalPages: data?.data?.data?.meta?.totalPages || 1, //Look inside the API response: meta.totalPages. If it exists, use that number. If it’s missing/undefined, fall back to 1 (default).

    hasMore: data?.data?.data?.meta?.hasMore || false,
    currentPage: data?.data?.data?.meta?.currentPage || 1, //Look for meta.hasMore at the backend. If it’s there, use it (true/false from the API).If it’s missing, fall back to false.
  });

  const users = data?.data?.data?.users || [];
  

  return (
    <PageWrapper>
      <div className="flex justify-between items-center ">
        <div>
          <h1 className="font-bold text-2xl">User Data</h1>
          <p className="text-gray-500">Manage your list of users</p>
        </div>
        {/* <div className=" hidden md:flex gap-4 justify-end"></div> */}
        <div className="  flex gap-4  items-center   md:justify-end">
          <AddUser />
        </div>
      </div>
      <div className="flex justify-end items-center  ">
        <Search id="search-users">
          <Filter />
        </Search>
      </div>
      {isPending ? <SkeletonCard />  : <>
      {isError ? <ErrorAlert  error={error?.response?.data?.message} /> : <>
      {users?.length > 0 ? (
        <>
        <Suspense fallback={<SkeletonCard />}>
          <div className="grid grid-cols-12 gap-4 ">
            {users.map((item) => (
              <div
                // lg:col-span-4 xl:col-span-3
                className="col-span-12 md:col-span-6 lg:col-span-4"
                key={item._id}
              >
                <UserCards item={item} />
              </div>
            ))}
          </div>
          </Suspense>
          <Paginate
            totalPages={totalPages}
            hasMore={hasMore}
            handlePageChange={handlePageChange}
            currentPage={currentPage}
          />
        </>
      ) : (
        <p className="mt-6 font-semibold text-center">No user found</p>
      )}
       </> }
       </>  }
    </PageWrapper>
  );
}

// ✅ In plain words:
// This page does 4 jobs:

// Reads page, limit, query, role from the URL.

// Fetches users from your backend with React Query.

// Shows them in nice cards with pagination controls.

// Lets you add new users or see errors/loading states.
