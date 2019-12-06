import Layout from "../components/Layout";
import ContactForm from "../components/ContactForm";

const Index = () => {
  return (
    <Layout>
      <div className='container'>
        <h2>Contact Us</h2>
        <ContactForm />
      </div>
    </Layout>
  );
};

export default Index;
