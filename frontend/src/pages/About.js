import React from 'react';
import { Heart, Leaf, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-[#F2EFE9]" data-testid="about-page">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 image-zoom">
          <img
            src="https://images.unsplash.com/photo-1637060548964-f064b88cd344?crop=entropy&cs=srgb&fm=jpg&q=85"
            alt="About Archipelago Scent"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(44,54,57,0.4), rgba(44,54,57,0.8))' }}></div>
        <div className="absolute inset-0 flex items-center justify-center text-center z-10 pt-20">
          <div className="container mx-auto px-6">
            <h1
              className="text-5xl md:text-7xl text-white mb-6"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}
              data-testid="about-title"
            >
              Our Story
            </h1>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section-padding">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <h2
            className="text-4xl md:text-5xl mb-8 text-center"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Filosofi Kami
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-[#5C6B70]">
            <p>
              Archipelago Scent lahir dari kecintaan mendalam terhadap kekayaan alam dan budaya Indonesia.
              Kami percaya bahwa setiap pulau di Nusantara memiliki karakter unik yang dapat diterjemahkan
              menjadi bahasa aroma.
            </p>
            <p>
              Perjalanan kami dimulai dengan riset mendalam ke enam pulau terpilih—Buton, Sumba, Alor,
              Komodo, Nias, dan Papua. Di setiap tempat, kami mempelajari flora lokal, mendengarkan cerita
              rakyat, dan merasakan spirit yang mengalir dalam tanah, laut, dan udara.
            </p>
            <p>
              Hasilnya adalah koleksi parfum yang bukan sekadar wewangian, tetapi narasi olfaktori—
              sebuah perjalanan sensorik yang membawa Anda melintasi ruang dan waktu, dari hutan mistis
              Buton hingga surga Papua yang masih perawan.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-[#EAE7E2]">
        <div className="container mx-auto px-6 md:px-12">
          <h2
            className="text-4xl md:text-5xl mb-16 text-center"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#A27B5C] text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf size={32} strokeWidth={1.5} />
              </div>
              <h3
                className="text-2xl mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Sustainability
              </h3>
              <p className="text-[#5C6B70] leading-relaxed">
                Kami berkomitmen menggunakan bahan-bahan yang berkelanjutan dan ramah lingkungan,
                mendukung petani lokal dan praktik harvesting yang bertanggung jawab.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#A27B5C] text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart size={32} strokeWidth={1.5} />
              </div>
              <h3
                className="text-2xl mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Authenticity
              </h3>
              <p className="text-[#5C6B70] leading-relaxed">
                Setiap aroma adalah hasil riset mendalam dan kolaborasi dengan komunitas lokal,
                memastikan autentisitas cerita di balik setiap botol.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#A27B5C] text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Award size={32} strokeWidth={1.5} />
              </div>
              <h3
                className="text-2xl mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Quality
              </h3>
              <p className="text-[#5C6B70] leading-relaxed">
                Kami tidak berkompromi dengan kualitas. Setiap parfum dibuat dengan konsentrasi
                Eau de Parfum (15-20%) untuk ketahanan maksimal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="section-padding">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="image-zoom rounded overflow-hidden order-2 md:order-1">
              <img
                src="https://images.unsplash.com/photo-1720404219082-d4f6ee18b5b2?crop=entropy&cs=srgb&fm=jpg&q=85"
                alt="Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2
                className="text-4xl md:text-5xl mb-6"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Crafted with Precision
              </h2>
              <p className="text-lg leading-relaxed text-[#5C6B70] mb-6">
                Setiap parfum Archipelago Scent melalui proses development selama 6-12 bulan.
                Kami bekerja dengan perfumer berpengalaman untuk menerjemahkan esensi setiap pulau
                ke dalam komposisi yang harmonis.
              </p>
              <p className="text-lg leading-relaxed text-[#5C6B70]">
                Dari pemilihan raw materials hingga proses maceration, setiap tahap dikontrol ketat
                untuk memastikan konsistensi dan kualitas yang exceptional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-[#2C3639] text-white">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl">
          <h2
            className="text-4xl md:text-5xl mb-8"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Our Mission
          </h2>
          <p className="text-xl leading-relaxed text-[#DCD7C9]">
            Menjadikan Indonesia dikenal dunia bukan hanya melalui destinasi wisata, tetapi juga
            melalui aroma yang mendunia. Archipelago Scent adalah duta olfaktori Nusantara—
            sebuah cara baru untuk merayakan dan melestarikan kekayaan budaya Indonesia.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;