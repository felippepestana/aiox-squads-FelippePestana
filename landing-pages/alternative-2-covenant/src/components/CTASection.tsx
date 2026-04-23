import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="section-padding bg-gradient-to-r from-covenant-blue-dark to-covenant-blue" aria-label="Chamada final">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            Pronto para Transformar Sua Vida?
          </h2>
          <p className="mt-4 text-white/80 text-lg max-w-lg mx-auto">
            Milhares de pessoas ja encontraram proposito, comunidade e
            transformacao. O proximo passo e seu.
          </p>
          <div className="mt-8">
            <a
              href="#contato"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-white text-covenant-blue-dark font-bold text-base transition-all duration-200 hover:bg-covenant-gray hover:shadow-lg hover:shadow-black/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-covenant-blue active:scale-[0.98]"
            >
              Quero Dar o Primeiro Passo
              <ArrowRight size={18} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
