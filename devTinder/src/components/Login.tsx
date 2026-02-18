import { useState } from "react";
import { Footer } from "./Footer";
import { useNavigate } from "react-router";
import { createUser, loginUser, mapAuthError } from "../services/auth";


type FormState = {
  displayName: string;
  email: string;
  password: string;
  mobile: string;
};

const initialValues = {
  displayName: "",
  email: "",
  password: "",
  mobile: "",
};

export const Login : React.FC = () => {
  const [isLogin, setIsLogin] = useState<Boolean>(true);
  const [form, setForm] = useState<FormState>(initialValues);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFormChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };  
  
  const handelSumbit = async () => {
    setError("");
    setLoading(true);
    try {
      await createUser({
        email: form.email,
        password: form.password,
        displayName: form.displayName,
        mobile: form.mobile,
      });
      navigate("/app/home");
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handelLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginUser({
        email: form.email,
        password: form.password,
      });
       navigate("/app/home");
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left p-2 m-20">
            <h1 className="text-5xl font-bold mb-2">
              Find Your Perfect Dev Match
            </h1>
            <h3 className="text-3xl">
              Connect with developers based on skills, interests, and goals —
              not just profiles.
            </h3>
            <p className="py-6">
              DevTinder helps developers discover meaningful connections for
              projects, collaborations, startups, or learning together.
            </p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              {error && (
                <div className="alert alert-error">
                  <span>{error}</span>
                </div>
              )}
              <fieldset className="fieldset">
                {!isLogin && (
                  <>
                    <label className="label">Name</label>
                    <input
                      className="input"
                      name="displayName"
                      placeholder="Enter Your Name"
                      onChange={handleFormChange}
                      value={form.displayName}
                    />
                  </>
                )}
                <label className="label">Email</label>
                <input
                  type="email"
                  name="email"
                  required={true}
                  className="input"
                  placeholder="Email"
                  onChange={handleFormChange}
                  value={form.email}
                />
                {!isLogin && (
                  <>
                    <label className="label">Phone Number</label>
                    <input
                      className="input"
                      name="mobile"
                      type="tel"
                      onChange={handleFormChange}
                      value={form.mobile}
                      placeholder="Enter Your Phone Number"
                    />
                  </>
                )}
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Password"
                  name="password"
                  onChange={handleFormChange}
                  value={form.password}
                />
                {!isLogin && (
                  <>
                    <label className="label">Re-Enter Password</label>
                    <input className="input" placeholder="Password" />
                  </>
                )}
                {isLogin && (
                  <>
                    <div>
                      <a className="link link-hover">Forgot password?</a>
                    </div>
                    <button 
                      className="btn btn-neutral mt-4"
                      onClick={() => handelLogin()}
                      disabled={loading}
                    >
                      {loading ? <span className="loading loading-spinner"></span> : "Login"}
                    </button>
                  </>
                )}
                {isLogin && (
                  <button
                    className="btn btn-neutral mt-4"
                    onClick={() => setIsLogin(false)}
                  >
                    New here? Create Account
                  </button>
                )}
                {!isLogin && (
                  <button 
                    className="btn btn-neutral mt-9"
                    onClick={handelSumbit}
                    disabled={loading}
                  >
                    {loading ? <span className="loading loading-spinner"></span> : "Submit"}
                  </button>
                )}
              </fieldset>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
  };
