import { createBrowserRouter, RouterProvider } from "react-router";
import { lazy, Suspense } from "react";
import { LazyLoader } from "@/components/LazyLoader";
import { PublicRoutes, PrivateRoutes } from "./ProtectedRoutes";
import { useAuth } from "@/store";

//render pages
const RootLayout = lazy(() => import("@/layouts/RootLayout"));
const Home = lazy(() => import("@/pages/home/Home"));
const Contact = lazy(() => import("@/pages/contact/Contact"));
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));
const SignUp = lazy(() => import("@/pages/signup/SignUp"));
const SignIn = lazy(() => import("@/pages/signin/SignIn"));
const ForgetPassword = lazy(() =>
  import("@/pages/Forget-password/ForgetPassword")
);
const ResetPassword = lazy(() =>
  import("@/pages/reset-password/ResetPassword")
);
const OnboardingLayout = lazy(() => import("@/layouts/OnboardingLayout"));
const PatientsOnboard = lazy(() =>
  import("@/pages/patient-onboard/PatientsOnboard")
);
const Verify = lazy(() => import("@/pages/verify-account/Verify"));
const DashboardLayout = lazy(() => import("@/layouts/DashboardLayout"));
import React from "react";
const Dashboard = lazy(() => import("@/pages/Dashboard/Dashboard"));
const Appointments = lazy(() => import("@/pages/Appointments/Appointments"));
const Rooms = lazy(() => import("@/pages/Rooms/Rooms"));
const Payments = lazy(() => import("@/pages/Payments/Payments"));
const Doctors = lazy(() => import("@/pages/Doctors/Doctors"));
const Patients = lazy(() => import("@/pages/Patient/Patients"));
const InPatients = lazy(() => import("@/pages/InPatient/InPatients"));
const User = lazy(() => import("@/pages/Users/User"));
const Settings = lazy(() => import("@/pages/settings/Settings"));

export default function AppRoutes() {
  const { accessToken, user } = useAuth(); //this what we need our useAuth for, we need to get the accessToken and the user from our context
  const routes = [
    {
      element: (
        <Suspense fallback={<LazyLoader />}>
          <PublicRoutes accessToken={accessToken}>
            <RootLayout />
          </PublicRoutes>
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Home />
            </Suspense>
          ),
        },
        {
          path: "/contact",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Contact />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "/account",
      element: (
        <Suspense fallback={<LazyLoader />}>
          <PublicRoutes accessToken={accessToken}>
            <AuthLayout />
          </PublicRoutes>
        </Suspense>
      ),
      children: [
        {
          path: "signup",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <SignUp />
            </Suspense>
          ),
        },
        {
          path: "signin",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <SignIn />
            </Suspense>
          ),
        },
        {
          path: "forgot-password",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <ForgetPassword />
            </Suspense>
          ),
        },
        {
          path: "reset-password",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <ResetPassword />
            </Suspense>
          ),
        },
      ],
    },
    {
      // the private routes takes access token and the user
      element: (
        <Suspense fallback={<LazyLoader />}>
          <PrivateRoutes accessToken={accessToken} user={user}>
            <OnboardingLayout />
          </PrivateRoutes>
        </Suspense>
      ),
      children: [
        {
          path: "/patient-onboard",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <PatientsOnboard />
            </Suspense>
          ),
        },
        {
          path: "/verify-account",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Verify />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "/dashboard",
      element: (
        <Suspense fallback={<LazyLoader />}>
          <PrivateRoutes accessToken={accessToken} user={user}>
            <DashboardLayout />
          </PrivateRoutes>
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Dashboard />
            </Suspense>
          ),
        },
        {
          path: "appointments",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Appointments />
            </Suspense>
          ),
        },
        {
          path: "Rooms",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Rooms />
            </Suspense>
          ),
        },
        {
          path: "payments",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Payments />
            </Suspense>
          ),
        },
        {
          path: "Doctors",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Doctors />
            </Suspense>
          ),
        },
        {
          path: "patients",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Patients />
            </Suspense>
          ),
        },
        {
          path: "InPatients",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <InPatients />
            </Suspense>
          ),
        },
        {
          path: "Users",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <User />
            </Suspense>
          ),
        },
        {
          path: "setting",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Settings />
            </Suspense>
          ),
        },
      ],
    },
  ];
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}
