import "./Auth.css";
import { useState } from "react";
import { useAuth } from "./AuthContext.jsx";

function Auth() {
    const { login, register } = useAuth();

    const [isLoginMode, setIsLoginMode] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            if (isLoginMode) {
                await login(email, password);
            } else {
                await register(name, email, password);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="authPage">
            <div className="authCard">
                <h1>{isLoginMode ? "Welcome back" : "Create your account"}</h1>
                <p className="authSubtitle">
                    {isLoginMode ? "Log in to continue to SigmaGPT" : "Sign up to start chatting"}
                </p>
                {error && <div className="authError">{error}</div>}

                <form className="authForm" onSubmit={handleSubmit}>
                    {!isLoginMode && (
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                    <button type="submit" disabled={submitting}>
                        {submitting ? "Please wait..." : isLoginMode ? "Log in" : "Sign up"}
                    </button>
                </form>

                <p className="authSwitch">
                    {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                    <span onClick={() => setIsLoginMode(!isLoginMode)}>
                        {isLoginMode ? "Sign up" : "Log in"}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Auth;