import { createBrowserRouter, RouterProvider } from "react-router";
import { lazy, Suspense } from "react";
import { LazyLoader } from "@/components/LazyLoader";
import { PublicRoutes, PrivateRoutes, VerifiedRoutes } from "./ProtectedRoutes";
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
const Setting = lazy(() => import("@/pages/settings/Setting"));
const Account = lazy(() => import("@/pages/settings/account/Account"));
const Password = lazy(() => import("@/pages/settings/password/Password"));
const HealthRecord = lazy(() => import("@/pages/settings/healthRecord/HealthRecord"));
const PatientPayments = lazy(() => import("@/pages/Payments/PatientPayments"));
const PatientAppointments = lazy(() => import("@/pages/Appointments/PatientAppointments"));
import ErrorBoundary from "@/components/ErrorBoundary";





export default function AppRoutes() {
  const { accessToken, user } = useAuth(); //this what we need our useAuth for, we need to get the accessToken and the user from our context
  const routes = [
    {
      element: (
        <Suspense fallback={<LazyLoader />}>
          <PublicRoutes accessToken={accessToken}>
            <RootLayout  />
          </PublicRoutes>
        </Suspense>
      ),
      errorElement: <ErrorBoundary />,
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
       errorElement: <ErrorBoundary />,
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
          <VerifiedRoutes accessToken={accessToken} user={user}>
            <OnboardingLayout />
          </VerifiedRoutes>
        </Suspense>
      ),
       errorElement: <ErrorBoundary />,
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
      path: "dashboard",
      element: (
        <Suspense fallback={<LazyLoader />}>
          <PrivateRoutes accessToken={accessToken} user={user}>
            <DashboardLayout />
          </PrivateRoutes>
        </Suspense>
      ),
       errorElement: <ErrorBoundary />,
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
          path: "patient-payments",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <PatientPayments />
            </Suspense>
          ),
        },
        {
          path: "patient-appointments",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <PatientAppointments />
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
          path: "settings",
          element: (
            <Suspense fallback={<LazyLoader />}>
              <Setting />
            </Suspense>
          ),
          children: [
            {
              path: "account",
              element: (
                <Suspense fallback={<LazyLoader />}>
                  <Account />
                </Suspense>
              ),
            },
            {
              path:"password",
              element: (
                <Suspense fallback={<LazyLoader />}>
                  <Password />
                </Suspense>
              ),
            },
             {
              path:"health",
              element: (
                <Suspense fallback={<LazyLoader />}>
                  <HealthRecord />
                </Suspense>
              ),
            }
          ],
        },
      ],
    },
  ];
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}
