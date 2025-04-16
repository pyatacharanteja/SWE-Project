'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  return (
    <main className="min-h-screen flex flex-col">
      {/* Login Section */}
      <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-800 text-white min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 py-24 max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <div className="max-w-2xl mb-12">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Secure Anonymous Voting
              </h1>
              <p className="text-xl mb-8">
                Login to access our secure voting platform. Cast your vote with confidence!
              </p>
              <div className="flex justify-center">
                <Link
                  href="/login"
                  className="bg-white text-indigo-800 px-6 py-3 rounded-lg font-medium text-lg hover:bg-gray-100 transition-colors duration-200 text-center"
                >
                  Login to Continue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="w-full py-16 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            About Our Platform
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Our Mission</h3>
              <p className="text-gray-600 mb-4">
                We are dedicated to providing a secure and transparent voting platform that ensures 
                every vote is counted accurately while maintaining voter privacy and anonymity.
              </p>
              <p className="text-gray-600">
                Our system combines cutting-edge blockchain technology with user-friendly interfaces
                to make democratic participation accessible to everyone.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">How It Works</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Login with your credentials to access the voting platform</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>View available polls and their details</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Cast your vote securely and anonymously</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>View results in real-time with transparent verification</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Key Security Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Anonymous Voting',
                description:
                  'Cast your vote with complete anonymity using our token-based system that separates your identity from your voting choices.',
                icon: '🔒',
              },
              {
                title: 'Blockchain Verification',
                description:
                  'Every vote is recorded on the Ethereum blockchain, creating an immutable and transparent audit trail without compromising voter privacy.',
                icon: '⛓️',
              },
              {
                title: 'Fraud Prevention',
                description:
                  'Advanced security measures including browser fingerprinting, rate limiting, and CAPTCHA verification prevent duplicate voting and bot attacks.',
                icon: '🛡️',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="w-full bg-indigo-700 text-white py-16">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">
            Ready to participate in secure voting?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join our secure voting platform and cast your vote with confidence.
          </p>
          <Link
            href="/login"
            className="bg-white text-indigo-700 px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-100 transition-colors duration-200 inline-block"
          >
            Login to Continue
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-bold mb-4">Secure Voting System</h3>
              <p className="text-gray-400 max-w-md">
                A robust and secure voting platform with cryptographic anonymity,
                blockchain verification, and fraud prevention mechanisms.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Platform</h4>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="/login" 
                      className="text-gray-400 hover:text-white cursor-pointer"
                    >
                      Login
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white">
                      Security
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Secure Voting System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
