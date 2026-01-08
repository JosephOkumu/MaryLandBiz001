import React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, ArrowLeft, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

const Contact = () => {
    const navigate = useNavigate();

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const contactInfo = [
        {
            icon: <MapPin className="h-8 w-8 text-primary" />,
            title: "Address",
            details: ["5011 Arbutus Ave", "Baltimore, MD 21215"]
        },
        {
            icon: <Phone className="h-8 w-8 text-primary" />,
            title: "Phone",
            details: ["1-888-PCG-0630", "Mon-Fri: 9AM - 5PM EST"]
        },
        {
            icon: <Mail className="h-8 w-8 text-primary" />,
            title: "Email",
            details: ["info@pcg.org"]
        },
        {
            icon: <Clock className="h-8 w-8 text-primary" />,
            title: "Business Hours",
            details: ["Monday - Friday: 9AM - 5PM"]
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
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Get In Touch
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                            Have questions or need assistance? We're here to help you connect with Maryland's business community.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-12 bg-white">
                <div className="container">
                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                transition={{ duration: 0.6 }}
                                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
                            >
                                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-3 rounded-lg inline-block mb-4">
                                    {info.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-primary">{info.title}</h3>
                                {info.details.map((detail, idx) => (
                                    <p key={idx} className="text-gray-600 leading-relaxed">
                                        {detail}
                                    </p>
                                ))}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Contact Actions Section */}
            <section className="py-20">
                <div className="container">
                    <motion.div
                        className="max-w-4xl mx-auto text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold mb-6 text-primary">Ready to Connect?</h2>
                        <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                            Whether you're a business owner looking to get listed, or someone searching for services,
                            we'd love to hear from you. Reach out using any of the methods below.
                        </p>

                        <div className="flex justify-center max-w-2xl mx-auto">
                            {/* Email Button */}
                            <motion.a
                                href="mailto:info@pcg.org"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-primary to-blue-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto md:min-w-[300px]"
                            >
                                <Mail className="h-12 w-12 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold mb-2">Email Us</h3>
                                <p className="text-blue-100 mb-4">Send us an email anytime</p>
                                <span className="text-lg font-medium">info@pcg.org</span>
                            </motion.a>
                        </div>

                        <motion.div
                            className="mt-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            <h3 className="text-2xl font-bold text-primary mb-4">Quick Response Time</h3>
                            <p className="text-gray-600 text-lg">
                                We typically respond to all inquiries within 24-48 hours during business days.
                                For urgent matters, please call us directly.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
