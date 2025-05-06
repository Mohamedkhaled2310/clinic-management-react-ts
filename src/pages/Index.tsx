
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";

const Index = () => {
  return (
    <Layout>
      <div className="relative bg-white">
        {/* Hero section */}
        <div className="bg-gradient-to-b from-clinic-50 to-white">
          <div className="clinic-container pt-12 pb-24">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Your Health, Our Priority
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                ClinicCare makes it easy to schedule appointments, manage your health records, and stay connected with your healthcare providers.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button className="px-8 py-6 text-lg bg-clinic-500 hover:bg-clinic-600">
                    Get Started
                  </Button>
                </Link>
                <Link to="/book-appointment">
                  <Button variant="outline" className="px-8 py-6 text-lg">
                    Book an Appointment
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div className="py-16 bg-white">
          <div className="clinic-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Streamlined Healthcare Management
              </h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform offers comprehensive tools for patients, doctors, and staff
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="rounded-full bg-clinic-100 w-12 h-12 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-clinic-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Easy Scheduling</h3>
                  <p className="text-gray-600">
                    Book appointments online, receive confirmations, and get reminders before your visit.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="rounded-full bg-clinic-100 w-12 h-12 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-clinic-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Billing Management</h3>
                  <p className="text-gray-600">
                    View and pay bills online, track payment history, and access detailed invoices.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="rounded-full bg-clinic-100 w-12 h-12 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-clinic-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Appointment Tracking</h3>
                  <p className="text-gray-600">
                    Doctors and staff can manage appointment status, add notes, and track patient visits.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="bg-clinic-600 py-16">
          <div className="clinic-container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white">
                Ready to experience better healthcare management?
              </h2>
              <p className="mt-4 text-xl text-clinic-100">
                Join ClinicCare today and take control of your healthcare journey.
              </p>
              <div className="mt-8">
                <Link to="/auth">
                  <Button variant="secondary" className="px-8 py-3 text-lg">
                    Create Your Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
