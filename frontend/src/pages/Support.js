import React, { useState, useEffect } from 'react';
import { Mail, MessageCircle, ChevronDown } from 'lucide-react';
import axios from 'axios';

const Support = () => {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await axios.get(`${API}/faq`);
      setFaqs(response.data);
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F2EFE9]" data-testid="support-page">
      {/* Header */}
      <section className="section-padding bg-[#EAE7E2] pt-32">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h1
            className="text-5xl md:text-7xl mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
            data-testid="support-title"
          >
            Customer Support
          </h1>
          <p className="text-lg md:text-xl text-[#5C6B70] max-w-3xl mx-auto leading-relaxed">
            Kami siap membantu Anda. Temukan jawaban atau hubungi kami langsung.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="section-padding">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <a
              href="mailto:hello@archipelagoscent.com"
              className="bg-[#EAE7E2] p-8 rounded hover:bg-[#DCD7C9] transition-colors group"
              data-testid="email-contact"
            >
              <Mail size={32} className="text-[#A27B5C] mb-4" strokeWidth={1.5} />
              <h3
                className="text-2xl mb-2 group-hover:text-[#A27B5C] transition-colors"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Email Us
              </h3>
              <p className="text-[#5C6B70] mb-4">
                Untuk pertanyaan detail atau inquiry khusus.
              </p>
              <p className="text-sm text-[#A27B5C]">hello@archipelagoscent.com</p>
            </a>

            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#EAE7E2] p-8 rounded hover:bg-[#DCD7C9] transition-colors group"
              data-testid="whatsapp-contact"
            >
              <MessageCircle size={32} className="text-[#A27B5C] mb-4" strokeWidth={1.5} />
              <h3
                className="text-2xl mb-2 group-hover:text-[#A27B5C] transition-colors"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                WhatsApp
              </h3>
              <p className="text-[#5C6B70] mb-4">
                Chat langsung dengan tim kami untuk respon cepat.
              </p>
              <p className="text-sm text-[#A27B5C]">+62 812-3456-7890</p>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-[#EAE7E2]">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <h2
            className="text-4xl md:text-5xl mb-12 text-center"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Frequently Asked Questions
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="bg-[#F2EFE9] rounded overflow-hidden"
                  data-testid={`faq-item-${index}`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-[#EAE7E2] transition-colors"
                    data-testid={`faq-question-${index}`}
                  >
                    <h3 className="text-lg font-medium pr-4">{faq.question}</h3>
                    <ChevronDown
                      size={20}
                      className={`flex-shrink-0 transition-transform ${
                        openIndex === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-6 text-[#5C6B70] leading-relaxed" data-testid={`faq-answer-${index}`}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Policies */}
      <section className="section-padding">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <h2
            className="text-4xl md:text-5xl mb-12 text-center"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Policies
          </h2>

          <div className="space-y-12">
            <div>
              <h3
                className="text-2xl mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Shipping Policy
              </h3>
              <div className="text-[#5C6B70] leading-relaxed space-y-3">
                <p>• Pengiriman ke seluruh Indonesia via JNE, J&T, dan SiCepat</p>
                <p>• Estimasi pengiriman 3-7 hari kerja (tergantung lokasi)</p>
                <p>• Free shipping untuk pembelian di atas Rp 500.000</p>
                <p>• Packaging aman dengan bubble wrap dan box eksklusif</p>
              </div>
            </div>

            <div>
              <h3
                className="text-2xl mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Refund Policy
              </h3>
              <div className="text-[#5C6B70] leading-relaxed space-y-3">
                <p>• Retur diterima dalam 14 hari untuk produk yang belum dibuka</p>
                <p>• Produk harus dalam kondisi original dengan segel utuh</p>
                <p>• Refund diproses dalam 7-14 hari kerja setelah produk diterima</p>
                <p>• Ongkir retur ditanggung customer kecuali ada kesalahan dari kami</p>
              </div>
            </div>

            <div>
              <h3
                className="text-2xl mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Exchange Policy
              </h3>
              <div className="text-[#5C6B70] leading-relaxed space-y-3">
                <p>• Tukar varian diperbolehkan dalam 30 hari (produk belum dibuka)</p>
                <p>• Cukup bayar selisih harga jika ada</p>
                <p>• Hubungi customer service untuk arrange exchange</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Support;