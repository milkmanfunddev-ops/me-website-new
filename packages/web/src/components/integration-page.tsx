import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ArrowRight, ChevronDown, Check } from "lucide-react";
import { APP_STORE_LINK, PLAY_STORE_LINK } from "@mealvana/shared";

export type IntegrationPageProps = {
  partnerName: string;
  partnerLogo: string;
  logoHeightClass?: string;
  tagline: string;
  intro: string;
  syncRows: Array<{ label: string; value: string }>;
  howToSteps: Array<{ title: string; body: string }>;
  faqs: Array<{ question: string; answer: string }>;
  relatedIntegrations: Array<{ name: string; href: string }>;
};

export function IntegrationPage({
  partnerName,
  partnerLogo,
  logoHeightClass = "h-10",
  tagline,
  intro,
  syncRows,
  howToSteps,
  faqs,
  relatedIntegrations,
}: IntegrationPageProps) {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden bg-blackberry">
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-orange/10 blur-[120px]" />
          <div className="absolute right-0 top-1/3 h-[300px] w-[300px] rounded-full bg-electrolyte/8 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-8 text-center"
          >
            <div className="inline-flex items-center gap-5 rounded-2xl border border-cream/10 bg-cream/5 px-6 py-4 backdrop-blur-sm">
              <span className="font-heading text-xl font-black text-cream">
                Mealvana
              </span>
              <span className="text-cream/40">×</span>
              <img
                src={partnerLogo}
                alt={partnerName}
                className={`${logoHeightClass} w-auto object-contain`}
              />
            </div>

            <h1 className="max-w-3xl font-heading text-4xl font-black leading-[1.05] tracking-tight text-cream sm:text-5xl lg:text-6xl">
              {tagline}
            </h1>

            <p className="max-w-2xl text-lg leading-relaxed text-cream/60">
              {intro}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={APP_STORE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center rounded-full bg-orange px-7 py-3.5 font-heading text-sm font-bold text-white shadow-lg shadow-orange/25 transition-all hover:bg-orange-light hover:-translate-y-0.5"
              >
                Download Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href={PLAY_STORE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-cream/20 bg-cream/5 px-7 py-3.5 font-heading text-sm font-bold text-cream backdrop-blur-sm transition-all hover:bg-cream/10"
              >
                Get on Google Play
              </a>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-cream to-transparent" />
      </section>

      {/* What syncs */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl font-bold tracking-tight text-blackberry sm:text-4xl">
              What syncs with {partnerName}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Exactly what moves between {partnerName} and Mealvana Endurance.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-10 overflow-hidden rounded-2xl border border-border bg-cream-dark"
          >
            <table className="w-full text-left">
              <tbody className="divide-y divide-border">
                {syncRows.map((row) => (
                  <tr key={row.label}>
                    <th
                      scope="row"
                      className="w-1/3 px-6 py-5 align-top font-heading text-sm font-bold text-blackberry"
                    >
                      {row.label}
                    </th>
                    <td className="px-6 py-5 text-sm leading-relaxed text-muted-foreground">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* How to connect */}
      <section className="bg-cream-dark py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl font-bold tracking-tight text-blackberry sm:text-4xl">
              How to connect {partnerName}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Takes about a minute inside the Mealvana Endurance app.
            </p>
          </motion.div>

          <ol className="mt-10 grid gap-5 sm:grid-cols-2">
            {howToSteps.map((step, i) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="relative rounded-2xl border border-border bg-cream p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange/10 font-heading text-lg font-black text-orange">
                  {i + 1}
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-blackberry">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl font-bold tracking-tight text-blackberry sm:text-4xl">
              {partnerName} integration FAQs
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Answers to what endurance athletes ask most about the {partnerName}{" "}
              integration.
            </p>
          </motion.div>

          <div className="mt-10">
            {faqs.map((faq, i) => (
              <FaqRow
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="bg-cream-dark py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-blackberry sm:text-3xl">
            Other training platforms Mealvana supports
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {relatedIntegrations.map((r) => (
              <Link
                key={r.name}
                to={r.href}
                className="group flex items-center justify-between rounded-2xl border border-border bg-cream px-5 py-4 transition-colors hover:border-orange/30 hover:bg-cream"
              >
                <span className="font-heading font-bold text-blackberry">
                  {r.name}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-orange" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blackberry py-20 text-cream sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">
            Sync {partnerName}. Fuel smarter.
          </h2>
          <p className="mt-4 text-cream/70">
            Download Mealvana Endurance and let your training platform drive
            your fueling plan.
          </p>
          <ul className="mx-auto mt-8 grid max-w-lg gap-3 text-left sm:grid-cols-2">
            {[
              "Free to download",
              "Offline-first",
              "50+ peer-reviewed studies",
              "iOS · Android · Web",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-cream/80"
              >
                <Check className="h-4 w-4 text-orange" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={APP_STORE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <img src="/appstore.png" alt="Download on the App Store" className="h-12" />
            </a>
            <a
              href={PLAY_STORE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <img src="/playstore.png" alt="Get it on Google Play" className="h-12" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function FaqRow({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.04, duration: 0.45 }}
      className="border-b border-blackberry/10"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-orange"
      >
        <span className="pr-4 font-heading text-lg font-bold text-blackberry">
          {question}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="h-5 w-5 shrink-0 text-orange" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5 leading-relaxed text-muted-foreground">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
