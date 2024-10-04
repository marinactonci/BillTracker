"use client";

import React, { useRef } from "react";
import Link from "next/link";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-full overflow-x-hidden">
      <Hero handleClick={handleClick} />
      <WhyChoose ref={ref} />
      <GettingStarted />
      {isLoggedIn ? <Start /> : <Join />}
    </div>
  );
}

export default Home;

function Hero({ handleClick }: { handleClick: () => void }) {
  return (
    <>
      <main className="flex justify-between items-center h-[92vh] container mx-auto">
        <div className="flex flex-col gap-3">
          <h1 className="text-6xl font-bold">Welcome to Bill Tracker</h1>
          <h2 className="text-2xl">Never Miss a Bill Payment Again</h2>
          <div>
            <button
              className="p-4 bg-black border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
              onClick={handleClick}
            >
              Get started
            </button>
          </div>
        </div>
        <img src="/landing.png" alt="" className="rounded-full" />
      </main>
    </>
  );
}

const WhyChoose = React.forwardRef((props, ref) => {
  return (
    <>
      <section
        className="bg-gray-100"
        ref={ref as React.RefObject<HTMLElement>}
      >
        <div className="container mx-auto py-20">
          <h1 className="text-4xl font-bold">Why choose Bill Tracker?</h1>
          <p className="mb-8 mt-3 text-xl">
            Managing your bills has never been easier. With{" "}
            <span className="font-bold">Bill Tracker</span>, you can
            effortlessly track, organize, and stay on top of your financial
            commitments. Here's why you'll love it:
          </p>

          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-6 place-items-center">
              <div className="p-4 border-2 rounded-lg w-full h-full cursor-pointer hover:scale-105 transition-transform">
                <h2 className="text-xl font-bold">Simple and intuitive</h2>
                <p>
                  Add, edit, and mark bills as paid with just a few clicks. Our
                  user-friendly interface ensures a hassle-free experience.
                </p>
              </div>
              <div className="p-4 border-2 rounded-lg w-full h-full cursor-pointer hover:scale-105 transition-transform">
                <h2 className="text-xl font-bold">Real-Time Updates</h2>
                <p>
                  Stay in the loop with real-time updates on upcoming bills and
                  payment status changes.
                </p>
              </div>
              <div className="p-4 border-2 rounded-lg w-full h-full cursor-pointer hover:scale-105 transition-transform">
                <h2 className="text-xl font-bold">
                  Powerful Filtering and Sorting
                </h2>
                <p>
                  Easily find the information you need by filtering and sorting
                  bills based on due date, payment status, or any other
                  criteria.
                </p>
              </div>
              <div className="p-4 border-2 rounded-lg w-full h-full cursor-pointer hover:scale-105 transition-transform">
                <h2 className="text-xl font-bold">Secure and Private</h2>
                <p>
                  Your data is important. Rest assured, our robust security
                  measures keep your personal and financial information safe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
});

function GettingStarted() {
  return (
    <>
      <section className="container mx-auto py-20">
        <h2 className="text-4xl font-bold mb-12">Getting Started is Simple</h2>
        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
          <li>
            <div className="timeline-middle">
              <div className="bg-black text-white w-8 h-8 rounded-lg grid place-items-center">
                1
              </div>
            </div>
            <div className="timeline-start md:text-end mb-10">
              <div className="text-lg font-black">Sign Up</div>
              Create your account effortlessly in just a few minutes. We've
              streamlined the sign-up process to prioritize your privacy and
              security. Your information is important, and we've implemented
              robust measures to ensure that your data remains confidential. By
              signing up, you unlock a personalized space where you can manage
              your bills seamlessly.
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-middle">
              <div className="bg-black text-white w-8 h-8 rounded-lg grid place-items-center">
                2
              </div>
            </div>
            <div className="timeline-end mb-10">
              <div className="text-lg font-black">Add Your Bills</div>
              Take control of your financial commitments by inputting your bills
              into our user-friendly interface. With a focus on simplicity, our
              intuitive form allows you to add essential details such as the
              name of the bill, the amount due, and the due date. This step is
              quick and straightforward, designed to save you time and eliminate
              the hassle of bill tracking. Whether it's a recurring expense or a
              one-time payment, you can effortlessly organize all your bills in
              one place.
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-middle">
              <div className="bg-black text-white w-8 h-8 rounded-lg grid place-items-center">
                3
              </div>
            </div>
            <div className="timeline-start md:text-end mb-10">
              <div className="text-lg font-black">Stay Organized</div>
              Once you've added your bills, dive into our feature-rich
              dashboard. Gain a comprehensive overview of your financial
              landscape, allowing you to stay organized and in control. The
              dashboard provides a visual representation of all your bills,
              making it easy to identify upcoming payments, track your expenses,
              and monitor your financial health. Effortlessly edit existing
              bills, mark them as paid when you've settled the amount, or add
              new bills as needed. Our goal is to empower you to manage your
              finances with ease.
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-middle">
              <div className="bg-black text-white w-8 h-8 rounded-lg grid place-items-center">
                4
              </div>
            </div>
            <div className="timeline-end mb-10">
              <div className="text-lg font-black">Never Miss a Due Date</div>
              Worry less about due dates with our built-in reminder system.
              Receive timely notifications for upcoming bills, ensuring you have
              ample time to plan your payments in advance. By staying informed
              about your financial obligations, you can avoid late fees and
              maintain a proactive approach to managing your budget. Our
              reminder feature is designed to provide you with the peace of mind
              that comes with staying on top of your financial responsibilities.
            </div>
          </li>
        </ul>
      </section>
      ;
    </>
  );
}

function Join() {
  return (
    <>
      <section className=" bg-gray-100">
        <div className="container mx-auto text-center py-20 flex flex-col gap-4">
          <h2 className="text-4xl font-bold">Join Bill Tracker Today</h2>
          <p className="text-xl">
            Ready to take control of your finances? Join Bill Tracker today and
            experience the convenience of organized bill management.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href={"/register"}
              className="p-4 bg-black border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
            >
              Sign Up Now
            </Link>
            <Link
              href={""}
              className="p-4 border uppercase bg-white border-black rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
          <div className="flex items-center justify-center text-xl">
            <span>Have questions? </span>
            <a
              className="ml-1 text-gray-600 hover:underline"
              href="mailto:billtracker@gmail.com"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function Start() {
  return (
    <>
      <section className=" bg-gray-100">
        <div className="container mx-auto text-center py-20 flex flex-col gap-4">
          <h2 className="text-4xl font-bold">
            Start Managing Your Bills Effortlessly
          </h2>
          <p className="text-xl">
            Ready to stay on top of your expenses? With Bill Tracker, you're in
            control. Here's what you can do:
          </p>

          <div className="flex justify-center">
            <div className="grid grid-cols-custom gap-6 place-items-center">
              <div className="p-4 border-2 rounded-lg w-full h-full cursor-pointer hover:scale-105 transition-transform">
                <h2 className="text-xl font-bold">Create Your First Profile</h2>
                <p>
                  Begin by setting up profiles for different living places. It's
                  the first step to organized bill management!
                </p>
              </div>
              <div className="p-4 border-2 rounded-lg w-full h-full cursor-pointer hover:scale-105 transition-transform">
                <h2 className="text-xl font-bold">Add Bills to Profiles</h2>
                <p>
                  Track your monthly expenses by adding bills to each profile.
                  It's quick and easy!
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href={"/settings"}
              className="p-4 bg-black border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
            >
              Add bill
            </Link>
            <Link
              href={""}
              className="p-4 border uppercase bg-white border-black rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
