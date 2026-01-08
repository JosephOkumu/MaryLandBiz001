import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, UserCheck, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const PrivacyPolicy = () => {
    const navigate = useNavigate();
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const sections = [
        {
            icon: <Database className="h-8 w-8" />,
            title: "Information We Collect",
            content: [
                {
                    subtitle: "Business Information",
                    text: "When businesses submit their listings, we collect business name, category, location, contact details (phone, email, website), and business descriptions. This information is publicly displayed on our directory to help customers find and connect with businesses."
                }
            ]
        },
        {
            icon: <Lock className="h-8 w-8" />,
            title: "How We Use Your Information",
            content: [
                {
                    subtitle: "Directory Services",
                    text: "Business information is used to create and maintain accurate business listings that help customers discover and connect with Maryland businesses."
                }
            ]
        },
        {
            icon: <Eye className="h-8 w-8" />,
            title: "Information Sharing & Disclosure",
            content: [
                {
                    subtitle: "Public Directory",
                    text: "Business information submitted to our directory is publicly accessible to help customers find businesses. This includes business name, category, location, contact details, and descriptions."
                },
                {
                    subtitle: "No Third-Party Sales",
                    text: "We do not sell, rent, or share your personal information with third parties for marketing purposes."
                },
                {
                    subtitle: "Legal Requirements",
                    text: "We may disclose information if required by law, court order, or to protect our rights, property, or safety, or that of our users."
                }
            ]
        },
        {
            icon: <UserCheck className="h-8 w-8" />,
            title: "Your Rights & Choices",
            content: [
                {
                    subtitle: "Access & Updates",
                    text: "Business owners can request updates to their listings by contacting our administrators. We will verify ownership before making changes to ensure accuracy and prevent unauthorized modifications."
                },
                {
                    subtitle: "Listing Removal",
                    text: "If you wish to remove your business listing from our directory, please contact us with your business details and verification information."
                },
                {
                    subtitle: "Data Accuracy",
                    text: "We strive to maintain accurate business information. If you notice any errors in a listing, please contact us so we can review and correct the information."
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex flex-col">
            <Header />
            {/* Back Button */}
            <div className="container pt-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium group"
                >
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>
            </div>

            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
                <div className="container relative z-10">
                    <motion.div
                        className="text-center max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex justify-center mb-6">
                            <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-full">
                                <Shield className="h-12 w-12 text-white" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Privacy Policy
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                            Your privacy is important to us. Learn how we collect, use, and protect your information.
                        </p>
                        <p className="text-sm text-gray-500 mt-4">
                            Last Updated: January 8, 2026
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Introduction */}
            <section className="py-12">
                <div className="container">
                    <motion.div
                        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="text-lg text-gray-600 leading-relaxed mb-4">
                            Welcome to MarylandBiz, an online business directory dedicated to showcasing Maryland's diverse business community. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or submit business information to our directory.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            By using our website, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our website.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Sections */}
            {sections.map((section, index) => (
                <section key={index} className={`py-12 ${index % 2 === 0 ? 'bg-white' : ''}`}>
                    <div className="container">
                        <motion.div
                            className="max-w-4xl mx-auto"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-lg text-white">
                                    {section.icon}
                                </div>
                                <h2 className="text-3xl font-bold text-primary">{section.title}</h2>
                            </div>

                            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-md space-y-8">
                                {section.content.map((item, idx) => (
                                    <div key={idx} className={idx !== 0 ? "pt-8 border-t border-gray-100" : ""}>
                                        <h3 className="text-xl font-bold text-primary mb-3">{item.subtitle}</h3>
                                        <p className="text-gray-600 leading-relaxed">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>
            ))}
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
