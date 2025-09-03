import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

export function PublicRoutes({ children, accessToken }) {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location?.state?.from || "/dashboard"; // the dashboard would be our home page for our login user

  useEffect(() => {
    if (accessToken) {
      navigate(from, {
        state: { from: location },
        replace: true,
      });
    }
  }, [accessToken, from, location, navigate]);
  return children; // if this rule is succesful, we want to return the children which is the pages
}

// u need to be aunthenticated to get to this page

export function PrivateRoutes({ children, accessToken, user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location?.state?.from || "/account/signin";
  useEffect(() => {
    if (!accessToken) {
      navigate(from, {
        state: { from: location },
        replace: true,
      });
    }
    if (user && !user.isVerified && location.pathname !== "/verify-account") {
      navigate("/verify-account");
      
    }
    //handle redirect to  patient onboard page
    if (
      user &&
      user?.isVerified &&
      user?.role === "patient" &&
      !user?.isCompletedOnboard &&
      location.pathname !== "/patient-onboard"
    ) {
      navigate("/patient-onboard", {
        state: { from: location },
        replace: true,
      });
    }
  }, [accessToken, from, location, navigate, user]);

  return children;
}



export function VerifiedRoutes({ children, accessToken, user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.pathname?.from || "/account/signin";

  useEffect(() => {
    if (!accessToken) {
      navigate(from, {
        state: { from: location },
        replace: true,
      });
    }
    //handle redirect to verify account
    if (user && !user.isVerified && location.pathname !== "/verify-account") {
      navigate("/verify-account");
      //       //here we are saying if we have a user and it not verified, take them to verify page

    }
  }, [accessToken, from, location, navigate, user]);
  return children;
}

//old

// useEffect(() => {
//     if (!accessToken) {
//       navigate(from, {
//         state: { from: location },
//         replace: true,
//       });
//     }
//     //handle redirect to verify account
//     if (user && !user.isVerified && location.pathname !== "/verify-account") {
//       navigate("/verify-account");
//       //here we are saying if we have a user and it not verified, take them to verify page
//     }

//     //here, we are saying if the user is verified and the role is patient and the user is not completed the onboard, take them to the patient onboard page
//     if (
//       user &&
//       user?.isVerified &&
//       user?.role === "patient" &&
//       !user?.isCompletedOnboard &&
//       location.pathname !== "/patient-onboard"
//     ) {
//       navigate("/patient-onboard", {
//         state: { from: location },
//         replace: true,
//       });
//     }
//   }, [accessToken, from, location, navigate, user]);
//   return children;
// }

//start