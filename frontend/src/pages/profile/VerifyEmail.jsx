import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export function VerifyEmail({ active, setNavroute }) {
    // state to hold the message to display to the user
    const [message, setMessage] = useState(null);

    // get the email and token from the url
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();

    useEffect(() => {
        setNavroute("home-container");
    }, [setNavroute]);

    useEffect(() => {
        if (
            [searchParams.get("email"), searchParams.get("token")].some(
                (param) =>
                    !param || typeof param !== "string" || param.trim() === ""
            )
        ) {
            return setMessage(
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                        <h1 className="text-2xl font-bold mb-4">
                            Invalid verification link
                        </h1>
                        <p className="text-gray-600 mb-6">
                            The verification link is invalid. Please check your
                            email and try again.
                        </p>
                    </div>
                </div>
            );
        }

        const verifyEmail = async () => {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/user/verify-email`,
                    {
                        email: searchParams.get("email"),
                        token: searchParams.get("token"),
                    }
                );

                if (response.data.success) {
                    setMessage(
                        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                                <h1 className="text-2xl font-bold mb-4">
                                    Email verified successfully
                                </h1>
                                <p className="text-gray-600 mb-6">
                                    Your email has been verified. You will be
                                    redirected to the login page shortly.
                                </p>
                            </div>
                        </div>
                    );

                    setTimeout(() => {
                        navigate("/user/login");
                    }, 3000);
                } else {
                    throw new Error("Email verification failed");
                }
            } catch (error) {
                console.error("Error verifying email:", error);
                setMessage(
                    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                        <div className="bg-white p-8 rounded-lg shadow-md text-center">
                            <h1 className="text-2xl font-bold mb-4">
                                Email verification failed
                            </h1>
                            <p className="text-gray-600 mb-6">
                                There was an error verifying your email. Please
                                try again later.
                            </p>
                        </div>
                    </div>
                );
            }
        };
        verifyEmail();
    }, [searchParams]);

    return (
        <>
            {message ? (
                message
            ) : (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                        <h1 className="text-2xl font-bold mb-4">
                            Verifying your email...
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Please wait while we verify your email address.
                        </p>
                        <div className="flex justify-center">
                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
