import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Redirect = ({ to, message, timeout = 3000 }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(to);
        }, timeout || 3000);

        return () => clearTimeout(timer);
    }, [to, timeout, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl bg-white border border-gray-200 shadow-lg p-8 text-center space-y-4">
                <div className="mx-auto h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
                <h1 className="text-2xl font-bold text-gray-900">
                    {message || "Redirecting..."}
                </h1>
                <p className="text-sm text-gray-500">
                    Redirecting in {Math.round(timeout / 1000)}s...
                </p>
            </div>
        </div>
    );
};

Redirect.propTypes = {
    to: PropTypes.string.isRequired,
    message: PropTypes.string,
    timeout: PropTypes.number,
};

export default React.memo(Redirect);
