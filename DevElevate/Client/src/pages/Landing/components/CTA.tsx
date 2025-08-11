import React from 'react';
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="relative py-24">
      <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 rounded-3xl blur-3xl"></div>

        <div className="relative p-12 border bg-black/50 backdrop-blur-sm border-white/10 rounded-3xl">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 mb-8 space-x-2 border rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300">Start Your Journey Today</span>
          </div>

          {/* Heading */}
          <h2 className="mb-6 text-4xl font-bold md:text-6xl">
            <span className="text-transparent bg-gradient-to-r from-white to-gray-400 bg-clip-text">
              Ready to Transform
            </span>
            <br />
            <span className="text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">
              Your Tech Career?
            </span>
          </h2>
          <p className="max-w-2xl mx-auto mb-12 text-xl leading-relaxed text-gray-400">
            Join 50,000+ developers who are already learning, growing, and landing their dream jobs with DevElevate's AI-powered platform.
          </p>
          {/* CTA Buttons */}
          <div className="flex flex-col justify-center gap-4 mb-8 sm:flex-row">
            <Link to="/dashboard">
              <button className="flex items-center justify-center px-12 py-4 space-x-2 font-semibold text-white transition-all duration-300 transform group bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl hover:shadow-2xl hover:shadow-purple-500/25 hover:scale-105">
                <span>Start Learning Free</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>
            <a
              href="mailto:officialdevelevate@gmail.com?subject=Book%20a%20Demo&body=Hi%20Team,%0AI%20would%20like%20to%20book%20a%20demo."
              className="px-12 py-4 font-semibold text-white transition-all duration-300 border bg-white/5 backdrop-blur-sm border-white/10 rounded-xl hover:bg-white/10"
            >
              Book a Demo
            </a>
          </div>
          {/* Trust Indicators */}
          <div className="flex flex-col items-center justify-center space-y-4 text-sm text-gray-500 sm:flex-row sm:space-y-0 sm:space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Free 7-day trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;