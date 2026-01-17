import { Footer } from "./Footer";

export const Login: React.FC = () => {
  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left p-2 m-20">
            <h1 className="text-5xl font-bold mb-2">Find Your Perfect Dev Match</h1>
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
              <fieldset className="fieldset">
                <label className="label">Email</label>
                <input type="email" className="input" placeholder="Email" />
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Password"
                />
                <div>
                  <a className="link link-hover">Forgot password?</a>
                </div>
                <button className="btn btn-neutral mt-4">Login</button>
                <button className="btn btn-neutral mt-4">
                  New here? Create Account
                </button>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
