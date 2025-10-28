import Navbar from './Navbar';
import Hero from './Hero';
import Featured from './Featured';
import Footer from './Footer';
import FAQSection from './FAQ';

export default function HomeScreen(){
    return(
      <>
        <Navbar />
        <Hero />
        <Featured />
        <FAQSection />
        <Footer />
      </>
    )
}