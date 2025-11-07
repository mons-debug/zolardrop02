'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-xs font-normal uppercase tracking-widest text-gray-500 block mb-4">
              About Zolar
            </span>
            <h1 
              className="text-4xl md:text-6xl font-light tracking-tight text-black mb-6"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Crafting Excellence
            </h1>
            <p className="text-gray-600 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
              We believe in creating timeless pieces that transcend seasonal trends.
              Each product is a testament to quality, design, and meticulous craftsmanship.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-normal uppercase tracking-widest text-gray-500 block mb-4">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-black mb-6">
                Born from Passion
              </h2>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed font-light">
                <p>
                  Zolar began with a simple vision: to create clothing that speaks to individuality 
                  while maintaining the highest standards of quality and design.
                </p>
                <p>
                  Every collection is carefully curated, with each piece designed to become a 
                  staple in your wardrobe. We don't chase trends—we set them.
                </p>
                <p>
                  From fabric selection to the final stitch, we ensure that every detail meets 
                  our exacting standards. This is more than fashion; it's a commitment to excellence.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/5]"
            >
              <Image
                src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80"
                alt="Zolar Craftsmanship"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-xs font-normal uppercase tracking-widest text-gray-500 block mb-4">
              Our Philosophy
            </span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-black">
              Quality Over Quantity
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Timeless Design',
                description: 'We create pieces that last beyond seasons, focusing on enduring style rather than fleeting trends.'
              },
              {
                title: 'Premium Materials',
                description: 'Only the finest fabrics and materials make it into our collections, ensuring comfort and durability.'
              },
              {
                title: 'Ethical Production',
                description: 'Every piece is crafted with care, respecting both artisans and the environment.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 border border-gray-200"
              >
                <h3 className="text-lg font-normal text-black mb-3 tracking-wide">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed font-light">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square"
            >
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                alt="Zolar Values"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-normal uppercase tracking-widest text-gray-500 block mb-4">
                Our Values
              </span>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-black mb-6">
                What We Stand For
              </h2>
              <div className="space-y-6">
                {[
                  {
                    title: 'Authenticity',
                    text: 'We stay true to our vision, never compromising on quality or design principles.'
                  },
                  {
                    title: 'Innovation',
                    text: 'While respecting tradition, we constantly push boundaries in design and production.'
                  },
                  {
                    title: 'Community',
                    text: 'Our customers are part of the Zolar family. Your feedback shapes our future collections.'
                  }
                ].map((value, index) => (
                  <div key={index} className="border-l-2 border-black pl-4">
                    <h3 className="text-base font-normal text-black mb-2">{value.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed font-light">
                      {value.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 
              className="text-3xl md:text-5xl font-light tracking-tight mb-6"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Explore the Collection
            </h2>
            <p className="text-gray-300 text-sm mb-8 max-w-2xl mx-auto font-light">
              Discover pieces that reflect your unique style and commitment to quality.
            </p>
            <Link
              href="/products"
              className="inline-block px-12 py-3 bg-white text-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors duration-300"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}





