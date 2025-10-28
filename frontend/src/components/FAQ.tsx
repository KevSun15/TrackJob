import { useState } from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid';

function AccordionItem({ title , children } : { title: string; children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-platinum">
          <button onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center w-full cursor-pointer py-5 text-left">
            <h3 className="text-lg font-semibold text-oxford-blue">{title}</h3>
            {isOpen ? (
              <MinusIcon className="h-5 w-5 text-orange-web" />
            ) : (
              <PlusIcon className="h-5 w-5 text-oxford-blue/70" />
            )}
          </button>
          <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <p className="pb-5 text-oxford-blue/70 leading-relaxed">
                {children}
              </p>
            </div>
          </div>
        </div>
      );
}

export default function FAQSection() {
    return (
      <section id="faq" className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-oxford-blue mb-4">
                Frequently Asked <span className="text-orange-web">Questions</span>
              </h2>
              <p className="text-lg text-oxford-blue/70 max-w-2xl mx-auto">
                Have questions? We've got answers. Here are some common things to know.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <AccordionItem title="How do I create an account?">
                You can create a free account by clicking the "Register" button in the top navigation bar or on our homepage. All you need is an email address and a password to get started.
              </AccordionItem>
              <AccordionItem title="Is TrackJob free for job seekers?">
                Yes! TrackJob is 100% free for job seekers. You can search for jobs, create a profile, apply to openings, and use all our tracking tools at no cost.
              </AccordionItem>
              <AccordionItem title="What types of jobs can I find on TrackJob?">
                TrackJob features a wide variety of job listings, including full-time, part-time, contract, and internship positions across multiple industries. Whether you're looking for remote work or on-site opportunities, you'll find options that suit your needs.
              </AccordionItem>
              <AccordionItem title="Can I track my applications?">
                Absolutely. Our dashboard allows you to track the status of every application you submit. You'll see when your application has been viewed, if you've been shortlisted, or if an interview has been requested.
              </AccordionItem>
              <AccordionItem title="Who Made this Website?">
                You can find the creator of this website in the footer links
              </AccordionItem>
            </div>
          </div>
      </section>
    );
}