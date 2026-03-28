
import { ConstellationBackground } from "./ConstellationBackground";

export const Feed:React.FC = () => {

    return (
        <>
        <div className="relative bg-[#0a0f1e] min-h-screen overflow-hidden">
          <ConstellationBackground />
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="max-w-md text-center text-white">
              <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
              <p className="mb-5 text-gray-300">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                quasi. In deleniti eaque aut repudiandae et a id nisi.
              </p>
              <button className="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>
        </>
    )
}