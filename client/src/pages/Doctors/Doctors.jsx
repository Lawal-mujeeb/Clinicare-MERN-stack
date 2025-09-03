import PageWrapper from "@/components/PageWrapper";
import React, { Suspense } from "react";
import { useAuth } from "@/store";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import usePaginate from "@/hooks/usePaginate";
import Paginate from "@/components/Paginate";
import Filter from "@/features/doctors/Filter";
import Search from "@/components/Search";
import { SkeletonTable } from "@/components/LazyLoader";
import { getAllDoctors } from "@/api/doctor";
import Table from "@/features/doctors/Table";
import ErrorAlert from "@/components/ErrorAlert";



export default function Doctors() {
  const { accessToken } = useAuth();
  const [searchParams] = useSearchParams();
   const page = Number(searchParams.get("page")) || 1;
 const limit = Number(searchParams.get("limit")) || 10;
 const query = searchParams.get("query") || "";
 const params = new URLSearchParams();
 const specialization = searchParams.get("specialization" )  ||  "";
 const availability = searchParams.get("availability" )  ||  "";
   params.append("page", page);
 params.append("limit", limit);
  if (query) params.append("query", query);
  if (specialization) params.append("specialization",specialization);
  if (availability) params.append("availability", availability);
  const { isPending, isError, data, error } = useQuery({
    // queryKey: ["getAllDoctors", accessToken],
    queryKey: ["getAllDoctors", {  query, specialization, availability, accessToken }],

    queryFn: () => getAllDoctors(params, accessToken),
  });

  const { handlePageChange, totalPages, hasMore, currentPage } = usePaginate({
    totalPages: data?.data?.data?.meta?.totalPages || 1,
    hasMore: data?.data?.data?.meta?.hasMore || false,
    currentPage: data?.data?.data?.meta?.currentPage || 1,
  });
  const doctors = data?.data?.data?.doctors || [];


  return (
    <>
      <PageWrapper>
        <div className="flex justify-between items-center">
          <div>
             <h1 className="font-bold text-2xl">Doctors</h1>
  <p className="text-gray-500">Manage your Doctors</p>
          </div>
       
        </div>

        <div className="flex justify-end items-center">
          <Search id="search-doctors">
            <Filter />
          </Search>
        </div>
        {isPending ? (
                  <SkeletonTable />
                ) : (

        <>
                   {isError ? (
                     <ErrorAlert error={error?.response?.data?.message} />
                   ) : (
                     <>
                       {doctors?.length > 0 ? (
                         <>
                           {/* <Suspense fallback={<SkeletonTable />}> */}
                             <Table  doctors={doctors} />
                           {/* </Suspense> */}
                           <Paginate
                             totalPages={totalPages}
                             hasMore={hasMore}
                             handlePageChange={handlePageChange}
                             currentPage={currentPage}
                           />
                         </>
                       ) : (
                         <p className="mt-6 font-semibold text-center">
                           No Doctors Found
                         </p>
                       )}
                     </>
                   )}
                 </>
        )}
      </PageWrapper>
    </>
  );
}
