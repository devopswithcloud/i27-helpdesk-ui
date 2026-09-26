"use client";

import { useRouter } from "next/navigation";
import {
  Shield,
  Ticket,
  Lock,
  ArrowRight,
  Zap,
  Users,
  BarChart3,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/20">
      {/* Top nav */}
      <nav className="max-w-6xl mx-auto w-full flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <span className="font-bold text-xl text-gray-900">
            i27<span className="text-primary-500">Helpdesk</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/student/login")}
            className="btn-secondary text-sm"
          >
            Student Login
          </button>
          <button
            onClick={() => router.push("/support/login")}
            className="btn-primary text-sm"
          >
            Agent / Admin Login
            <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto text-center px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <Zap size={14} />
          Cloud-Native Helpdesk Platform
        </div>

        <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Support made{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-[#051C36]">
            simple & faster
          </span>
        </h1>

        <p className="text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Centralized support platform for i27Academy students. Submit tickets,
          track progress, and get help — all in one place.
        </p>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => router.push("/student/login")}
            className="btn-primary text-base px-8 py-3"
          >
            Get Started
            <ArrowRight size={18} />
          </button>
          <button
            onClick={() => router.push("/support/login")}
            className="btn-secondary text-base px-8 py-3"
          >
            Support Portal
          </button>
        </div>
      </section>

      {/* Trust badge */}
      <section className="text-center pb-12">
        <p className="text-sm text-gray-400 mb-1">Internal support system for</p>
        <p className="text-sm font-semibold text-gray-600">
          i27Academy · Cloud · DevOps · Data Engineering Programs
        </p>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Users,
              title: "Student-Only Access",
              desc: "Tickets can be raised only by authenticated i27Academy students, ensuring focused and accurate support.",
              color: "navy",
            },
            {
              icon: Ticket,
              title: "Structured Ticket Management",
              desc: "Every request is tracked, assigned, and resolved with complete visibility and accountability.",
              color: "emerald",
            },
            {
              icon: Shield,
              title: "Secure & Role-Based",
              desc: "Access is governed by roles — Student, Agent, and Admin — to maintain security and operational clarity.",
              color: "amber",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="card p-6 hover:shadow-card-hover transition-all duration-300 group"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${feature.color === "navy"
                  ? "bg-blue-50 text-[#051C36]"
                  : feature.color === "emerald"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600"
                  }`}
              >
                <feature.icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats row */}
      <section className="bg-white border-t border-b border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Microservices", value: "6+", icon: BarChart3 },
              { label: "Auth System", value: "JWT", icon: Lock },
              { label: "Ticket Mgmt", value: "Full", icon: Ticket },
              { label: "Role Types", value: "3", icon: Users },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} i27Academy · Internal Support Platform
        </p>
      </footer>
    </div>
  );
}