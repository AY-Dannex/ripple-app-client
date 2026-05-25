import { Button } from "@/components/ui/button.jsx"
import { Link } from "react-router-dom"
import { useEffect, useRef } from "react"
import Authentication from "./Authentication.jsx"
import { Waves } from "lucide-react"

function Landing() {
    const heroRef = useRef(null)

    useEffect(() => {
        const hero = heroRef.current
        if (!hero) return
        const children = hero.querySelectorAll(".animate-in")
        children.forEach((el, i) => {
            el.style.animationDelay = `${i * 0.15}s`
        })
    }, [])

    return (
        <div
            className="w-full h-screen overflow-hidden relative"
            style={{ backgroundColor: "#060612" }}
        >
            {/* Grid lines */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
                    `,
                    backgroundSize: "50px 50px",
                }}
            />

            {/* Purple orb */}
            <div
                className="absolute rounded-full z-0"
                style={{
                    width: "600px",
                    height: "600px",
                    left: "15%",
                    top: "10%",
                    background: "#4b0082",
                    filter: "blur(160px)",
                    opacity: 0.55,
                }}
            />

            {/* Blue orb */}
            <div
                className="absolute rounded-full z-0"
                style={{
                    width: "500px",
                    height: "500px",
                    right: "10%",
                    bottom: "5%",
                    background: "#1a3a6b",
                    filter: "blur(140px)",
                    opacity: 0.6,
                }}
            />

            {/* Subtle top glow */}
            <div
                className="absolute rounded-full z-0"
                style={{
                    width: "300px",
                    height: "300px",
                    left: "50%",
                    top: "-80px",
                    transform: "translateX(-50%)",
                    background: "#6d28d9",
                    filter: "blur(100px)",
                    opacity: 0.25,
                }}
            />

            {/* Header */}
            <header className="w-full fixed top-0 left-0 z-50">
                <div
                    className="max-w-[1440px] mx-auto flex justify-between items-center px-6 py-4"
                    style={{
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        backdropFilter: "blur(12px)",
                        backgroundColor: "rgba(6,6,18,0.6)",
                    }}
                >
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <span style={{ fontSize: "22px" }}><Waves className="text-purple-500"/></span>
                        <span
                            className="font-bold text-white tracking-tight"
                            style={{ fontSize: "20px", letterSpacing: "-0.02em" }}
                        >
                            Ripple
                        </span>
                    </div>

                    {/* Nav buttons */}
                    <div className="flex gap-3">
                        <Link to="/authentication" type="Log In">
                            <Button
                                variant="ghost"
                                className="text-white/70 hover:text-white hover:bg-white/10 cursor-pointer px-5 rounded-full transition-all duration-200"
                            >
                                Sign In
                            </Button>
                        </Link>
                        <Link to="/authentication" type="Sign Up">
                            <Button
                                className="cursor-pointer px-5 rounded-full font-medium transition-all duration-200 hover:scale-105"
                                style={{
                                    background: "linear-gradient(135deg, #4b0082, #1a3a6b)",
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    color: "white",
                                    boxShadow: "0 0 20px rgba(75,0,130,0.4)",
                                }}
                            >
                                Sign Up
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero content */}
            <div
                ref={heroRef}
                className="relative z-10 h-full max-w-[1440px] mx-auto flex flex-col items-center justify-center px-6 text-center"
            >
                {/* Badge */}
                <div
                    className="animate-in mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm text-white/60"
                    style={{
                        border: "1px solid rgba(255,255,255,0.1)",
                        backgroundColor: "rgba(255,255,255,0.05)",
                        backdropFilter: "blur(8px)",
                        opacity: 0,
                        animation: "fadeSlideUp 0.6s ease forwards",
                    }}
                >
                    <span
                        className="w-1.5 h-1.5 rounded-full bg-purple-400"
                        style={{ boxShadow: "0 0 6px #a855f7" }}
                    />
                    Now in beta — join the wave
                </div>

                {/* Headline */}
                <h1
                    className="animate-in font-bold text-white leading-none tracking-tight mb-5"
                    style={{
                        fontSize: "clamp(3rem, 8vw, 7rem)",
                        letterSpacing: "-0.04em",
                        opacity: 0,
                        animation: "fadeSlideUp 0.6s ease forwards",
                        textShadow: "0 0 80px rgba(109,40,217,0.4)",
                    }}
                >
                    Introducing{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #a855f7, #6366f1, #3b82f6)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Ripple
                    </span>
                </h1>

                {/* Subheading */}
                <p
                    className="animate-in text-white/50 mb-10 max-w-md leading-relaxed"
                    style={{
                        fontSize: "clamp(1rem, 2vw, 1.2rem)",
                        opacity: 0,
                        animation: "fadeSlideUp 0.6s ease forwards",
                    }}
                >
                    Share your thoughts, connect with the world. A space for real conversations that matter.
                </p>

                {/* CTA Buttons */}
                <div
                    className="animate-in flex flex-wrap gap-4 justify-center"
                    style={{
                        opacity: 0,
                        animation: "fadeSlideUp 0.6s ease forwards",
                    }}
                >
                    <Link to="/authentication">
                        <Button
                            className="cursor-pointer px-8 py-6 text-base rounded-full font-semibold transition-all duration-200 hover:scale-105 hover:shadow-2xl"
                            style={{
                                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                                color: "white",
                                boxShadow: "0 0 30px rgba(124,58,237,0.5)",
                                border: "1px solid rgba(255,255,255,0.15)",
                            }}
                        >
                            Get Started →
                        </Button>
                    </Link>
                    <Link to="/authentication">
                        <Button
                            variant="outline"
                            className="cursor-pointer px-8 py-6 text-base rounded-full font-semibold transition-all duration-200 hover:scale-105"
                            style={{
                                backgroundColor: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                color: "white",
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            Sign In
                        </Button>
                    </Link>
                </div>

                {/* Social proof */}
                <div
                    className="animate-in mt-12 flex items-center gap-3 text-white/30 text-sm"
                    style={{
                        opacity: 0,
                        animation: "fadeSlideUp 0.6s ease forwards",
                    }}
                >
                    <div className="flex -space-x-2">
                        {["#7c3aed", "#4f46e5", "#2563eb", "#0891b2"].map((color, i) => (
                            <div
                                key={i}
                                className="w-7 h-7 rounded-full border-2"
                                style={{
                                    backgroundColor: color,
                                    borderColor: "#060612",
                                    opacity: 0.8,
                                }}
                            />
                        ))}
                    </div>
                    <span>Join thousands already making waves</span>
                </div>
            </div>

            {/* CSS animations */}
            <style>{`
                @keyframes fadeSlideUp {
                    from {
                        opacity: 0;
                        transform: translateY(24px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    )
}

export default Landing
