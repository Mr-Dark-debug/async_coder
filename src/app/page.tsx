import Image from "next/image";
import { Github, Cloud, TestTube, Twitter, Linkedin } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen font-roboto">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4 bg-gradient-to-b from-white to-syntaxiaRed/30">
        <div className="flex space-x-8 mb-8">
          <Github className="text-syntaxiaDarkRed" size={48} />
          <Cloud className="text-syntaxiaDarkRed" size={48} />
          <TestTube className="text-syntaxiaDarkRed" size={48} />
        </div>
        <h1 className="font-montserrat text-5xl md:text-6xl font-bold text-syntaxiaDarkRed mb-6">
          Welcome to Syntaxia, Your Asynchronous Coding Assistant.
        </h1>
        <p className="font-roboto text-xl md:text-2xl text-gray-700 mb-10 max-w-2xl">
          Automate your coding tasks and focus on what matters most.
        </p>
        <button className="bg-syntaxiaRed text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-syntaxiaDarkRed transition-colors duration-300 shadow-lg">
          Try Syntaxia Today!
        </button>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold font-montserrat text-center mb-16 text-syntaxiaDarkRed">
            Powerful Features to Streamline Your Workflow
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl hover:bg-syntaxiaRed/10 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center mb-6">
                <Github className="text-syntaxiaRed" size={40} />
              </div>
              <h3 className="text-2xl font-semibold font-montserrat mb-3 text-syntaxiaDarkRed text-center">
                GitHub Integration
              </h3>
              <p className="text-gray-600 text-center font-roboto">
                Syntaxia imports your repos, tracks changes, and helps you create pull requests seamlessly.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl hover:bg-syntaxiaRed/10 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center mb-6">
                <Cloud className="text-syntaxiaRed" size={40} />
              </div>
              <h3 className="text-2xl font-semibold font-montserrat mb-3 text-syntaxiaDarkRed text-center">
                Virtual Machine
              </h3>
              <p className="text-gray-600 text-center font-roboto">
                Clones your code into a cloud VM to verify that your changes work.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl hover:bg-syntaxiaRed/10 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center mb-6">
                <TestTube className="text-syntaxiaRed" size={40} />
              </div>
              <h3 className="text-2xl font-semibold font-montserrat mb-3 text-syntaxiaDarkRed text-center">
                Test Suite
              </h3>
              <p className="text-gray-600 text-center font-roboto">
                Run your existing tests or create new ones, ensuring your code is always optimized.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl hover:bg-syntaxiaRed/10 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-codesandbox text-syntaxiaRed"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="m12 22V12"/></svg>
              </div>
              <h3 className="text-2xl font-semibold font-montserrat mb-3 text-syntaxiaDarkRed text-center">
                Task Automation
              </h3>
              <p className="text-gray-600 text-center font-roboto">
                Automate repetitive tasks and workflows, freeing you up for more important work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-poppins font-bold text-center mb-16 text-syntaxiaDarkRed">
            How Syntaxia Works
          </h2>
          <div className="flex flex-col md:flex-row justify-around items-start gap-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center md:w-1/3 p-6">
              <div className="bg-syntaxiaRed text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-6 shadow-md">
                1
              </div>
              <h3 className="text-2xl font-semibold font-montserrat mb-3 text-syntaxiaDarkRed">
                Connect
              </h3>
              <p className="text-gray-600 font-roboto">
                Connect your GitHub repositories to Syntaxia.
              </p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center md:w-1/3 p-6">
              <div className="bg-syntaxiaRed text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-6 shadow-md">
                2
              </div>
              <h3 className="text-2xl font-semibold font-montserrat mb-3 text-syntaxiaDarkRed">
                Configure
              </h3>
              <p className="text-gray-600 font-roboto">
                Select the tasks Syntaxia will handle, from bug fixing to test creation.
              </p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center md:w-1/3 p-6">
              <div className="bg-syntaxiaRed text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-6 shadow-md">
                3
              </div>
              <h3 className="text-2xl font-semibold font-montserrat mb-3 text-syntaxiaDarkRed">
                Execute
              </h3>
              <p className="text-gray-600 font-roboto">
                Sit back while Syntaxia executes the tasks, tracks progress, and delivers results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-poppins font-bold text-center mb-16 text-syntaxiaDarkRed">
            What Our Users Are Saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Testimonial 1 (Placeholder) */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl hover:border-syntaxiaRed border-2 border-transparent transition-all duration-300">
              <p className="text-gray-600 font-roboto italic mb-6">
                "Syntaxia has revolutionized our development process. The automation features saved us countless hours!"
              </p>
              <div className="flex items-center">
                {/* Optional: Company Logo */}
                {/* <Image src="/path-to-logo.png" alt="Company Logo" width={40} height={40} className="mr-4 rounded-full" /> */}
                <div>
                  <p className="font-semibold font-montserrat text-syntaxiaDarkRed">Jane Doe</p>
                  <p className="text-sm text-gray-500 font-roboto">Lead Developer, Tech Solutions Inc.</p>
                </div>
              </div>
            </div>
            {/* Testimonial 2 (Placeholder) */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl hover:border-syntaxiaRed border-2 border-transparent transition-all duration-300">
              <p className="text-gray-600 font-roboto italic mb-6">
                "The GitHub integration is seamless, and the ability to run tests in a virtual machine is a game-changer."
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold font-montserrat text-syntaxiaDarkRed">John Smith</p>
                  <p className="text-sm text-gray-500 font-roboto">Software Engineer, Innovate Ltd.</p>
                </div>
              </div>
            </div>
            {/* Testimonial 3 (Placeholder) */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl hover:border-syntaxiaRed border-2 border-transparent transition-all duration-300">
              <p className="text-gray-600 font-roboto italic mb-6">
                "I can't imagine going back to coding without Syntaxia. It handles the repetitive tasks so I can focus on complex problem-solving."
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold font-montserrat text-syntaxiaDarkRed">Alice Brown</p>
                  <p className="text-sm text-gray-500 font-roboto">Freelance Developer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-white pt-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center mb-8">
            <div className="w-full md:w-auto text-center md:text-left mb-6 md:mb-0">
              <h3 className="text-2xl font-montserrat font-semibold text-syntaxiaDarkRed">Syntaxia</h3>
              <p className="text-sm text-gray-500 font-roboto">Your Asynchronous Coding Assistant</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3 text-sm font-roboto">
              <a href="#" className="text-gray-600 hover:text-syntaxiaRed transition-colors">About Us</a>
              <a href="#" className="text-gray-600 hover:text-syntaxiaRed transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-syntaxiaRed transition-colors">Terms & Conditions</a>
              <a href="#" className="text-gray-600 hover:text-syntaxiaRed transition-colors">Contact</a>
              <a href="#" className="text-gray-600 hover:text-syntaxiaRed transition-colors">FAQ</a>
            </div>
          </div>
          <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="text-gray-500 hover:text-syntaxiaRed transition-colors">
              <Twitter size={24} />
            </a>
            <a href="#" className="text-gray-500 hover:text-syntaxiaRed transition-colors">
              <Github size={24} />
            </a>
            <a href="#" className="text-gray-500 hover:text-syntaxiaRed transition-colors">
              <Linkedin size={24} />
            </a>
          </div>
        </div>
        <div className="bg-syntaxiaRed py-4">
          <p className="text-center text-sm text-white font-roboto">
            &copy; {new Date().getFullYear()} Syntaxia. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
