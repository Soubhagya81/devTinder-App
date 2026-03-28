import { useState } from "react";
import { Footer } from "./Footer";
import { useNavigate } from "react-router";
import { createUser, loginUser, mapAuthError } from "../services/auth";
import { Error } from "./Error";
import { ParticleNetwork } from "./ParticleNetwork";
import background from "../public/background_wallpaper.jpg"

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

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState<Boolean>(true);
  const [form, setForm] = useState<FormState>(initialValues);
  const [passwordCheckError, setPasswordCheckError] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handelSumbit = async () => {
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
      setErrorMessage(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handelLogin = async () => {
    setLoading(true);
    try {
      const res = await loginUser({
        email: form.email,
        password: form.password,
      });

      console.log("Logged in user:", res);
      navigate("/app/home", { state: { userName: res.displayName } });
    } catch (err) {
      console.log("error",err, mapAuthError(err));
      
      setErrorMessage(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const passwordCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== form.password)
      setPasswordCheckError("Password do not match");
    else setPasswordCheckError("");
  };

  return (
    <>
      <div className="hero min-h-screen bg-base-200"
      style={{ backgroundImage: `url(${background})` }}
      >
        <ParticleNetwork />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          {errorMessage && <Error errorMessage={errorMessage} />}
          <div className="text-center lg:text-left p-2 m-20 text-white">
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
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl bg-base-100/15 text-white">
            <div className="card-body">
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
                  { passwordCheckError &&
                    <div role="alert" className="alert alert-error alert-soft h-3 w-60">
                      <span className="text-error absolute">{passwordCheckError}</span>
                    </div>
                    }
                    <label className="label">Re-Enter Password</label>
                    <input
                      className="input"
                      placeholder="Password"
                      onChange={passwordCheck}
                    />
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
                      {loading ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        "Login"
                      )}
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
                    {loading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      "Submit"
                    )}
                  </button>
                )}
              </fieldset>
            </div>
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
