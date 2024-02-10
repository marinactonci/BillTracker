import React from "react";

function NotFound() {
  return (
    <>
      <section className="h-[84vh] grid place-items-center">
        <div className="flex gap-20">
          <img src="./not-found.webp" alt="" />
          <div className="flex flex-col items-center justify-center gap-3">
            <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
            <p className="text-center text-xl">
              The page you are looking for is no longer available or it doesn't
              exist. Please try again.
            </p>
            <button
              className="p-2 bg-black border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default NotFound;
