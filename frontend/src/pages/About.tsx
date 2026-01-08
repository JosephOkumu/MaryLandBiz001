import React from "react";
import { motion } from "framer-motion";
import { Building, Users, Target, Award, Heart, MapPin, Phone, Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const About = () => {
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

  const values = [
    {
      icon: <Building className="h-8 w-8" />,
      title: "Business Growth",
      description: "We're committed to helping Maryland's minority-owned businesses thrive and expand their reach in the community."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Connection",
      description: "Building bridges between businesses and customers, fostering meaningful relationships that strengthen our local economy."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Accessibility",
      description: "Making it easy for everyone to discover and connect with the diverse business landscape Maryland has to offer."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Excellence",
      description: "Promoting quality businesses and services that represent the best of Maryland's entrepreneurial spirit."
    }
  ];

  const stats = [
    { number: "500+", label: "Registered Businesses" },
    { number: "50+", label: "Business Categories" },
    { number: "99.9%", label: "Customer Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex flex-col">
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
              About MarylandBiz
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Empowering Maryland's minority-owned businesses and connecting communities through innovative digital solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp} transition={{ duration: 0.6 }}>
              <h2 className="text-4xl font-bold mb-6 text-primary">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                MarylandBiz was founded with a simple yet powerful vision: to create a comprehensive platform that showcases and supports Maryland's vibrant minority-owned business community. We believe that every business deserves the opportunity to be discovered, celebrated, and supported.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our platform serves as a bridge between entrepreneurs and customers, making it easier than ever to find quality services, products, and experiences while supporting local economic growth and diversity.
              </p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 text-center">
                <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-primary mb-4">Supporting Local Communities</h3>
                <p className="text-gray-600">
                  Every business listing helps strengthen Maryland's economic ecosystem and promotes diversity in entrepreneurship.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-primary">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and shape how we serve Maryland's business community.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
              >
                <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-lg inline-block text-white mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-primary">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-primary">Our Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how we're making a difference in Maryland's business landscape.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <div className="text-5xl font-bold mb-2 text-primary">{stat.number}</div>
                <div className="text-lg text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-primary">Get In Touch</h2>
            <p className="text-xl text-gray-600 mb-12">
              Have questions or want to learn more about how we can help your business? We'd love to hear from you.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="bg-white p-6 rounded-xl shadow-lg"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Address</h3>
                <p className="text-gray-600">5011 Arbutus Ave<br />Baltimore, MD 21215</p>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-xl shadow-lg"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Phone</h3>
                <p className="text-gray-600">1-888-PCG-0630</p>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-xl shadow-lg"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Email</h3>
                <p className="text-gray-600">info@pcg.org</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
