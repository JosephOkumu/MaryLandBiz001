
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Categories from "@/components/Categories"
import Statistics from "@/components/Statistics"
import Footer from "@/components/Footer"
import AnimatedPage from "@/components/AnimatedPage"

const Index = () => {
  return (
    <AnimatedPage>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Hero />
        <Categories />
        <Statistics />
        <Footer />
      </div>
    </AnimatedPage>
  )
}

export default Index
