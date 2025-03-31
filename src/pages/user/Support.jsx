import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  ShoppingCart,
  CreditCard,
  Package,
  RefreshCw,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { Textarea } from '@/shadcn/components/ui/textarea';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { Badge } from '@/shadcn/components/ui/badge';
import { toast } from 'sonner';

export function Support() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const faqs = [
    {
      id: 1,
      question: 'How do I download my purchased games?',
      answer:
        'After purchasing a game, go to your account dashboard and select "My Library." You\'ll find all your purchased games there with download options. Click the download button next to the game you want to install.',
    },
    {
      id: 2,
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and various regional payment methods. For some regions, we also support cryptocurrency payments including Bitcoin and Ethereum.',
    },
    {
      id: 3,
      question: 'Can I get a refund for my purchase?',
      answer:
        "Yes, we offer refunds within 14 days of purchase if you've played less than 2 hours of the game. Special conditions may apply for certain titles. Please visit our refund policy page for more details.",
    },
    {
      id: 4,
      question: 'How do I redeem a gift card or promotional code?',
      answer:
        'To redeem a code, log into your account and go to "Account Settings." Find the "Redeem Code" section and enter your code. The credit will be automatically added to your account or the game will be added to your library.',
    },
    {
      id: 5,
      question: 'Is my payment information secure?',
      answer:
        'Absolutely. We use industry-standard encryption and security protocols to protect your payment information. We are PCI DSS compliant and never store your full credit card details on our servers.',
    },
    {
      id: 6,
      question: 'How do I change my account password?',
      answer:
        'To change your password, go to "Account Settings" and select the "Security" tab. Click on "Change Password" and follow the instructions. You\'ll need to enter your current password for verification.',
    },
  ];

  const supportCategories = [
    {
      icon: ShoppingCart,
      title: 'Orders & Purchases',
      description: 'Help with your orders, payments, and purchase history',
    },
    {
      icon: Package,
      title: 'Game Downloads',
      description: 'Assistance with downloading and installing games',
    },
    {
      icon: RefreshCw,
      title: 'Refunds & Returns',
      description: 'Information about our refund policy and process',
    },
    {
      icon: CreditCard,
      title: 'Payment Issues',
      description: 'Help with payment methods and billing problems',
    },
    {
      icon: Shield,
      title: 'Account Security',
      description: 'Support for account access and security concerns',
    },
    {
      icon: HelpCircle,
      title: 'Technical Support',
      description: 'Help with technical issues and game performance',
    },
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitContactForm = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', contactForm);
    toast.success("Your message has been sent! We'll get back to you soon.");
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='min-h-screen bg-primary-bg text-primary-text font-sans select-none'>
      <div className='container mx-auto px-4 py-6 sm:py-8'>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-center mb-12'>
          <Badge className='mb-4 bg-accent-blue hover:bg-hover-blue text-white px-3 py-1 text-sm'>
            Customer Support
          </Badge>
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-4'>
            How Can We Help You?
          </h1>
          <p className='text-secondary-text max-w-3xl mx-auto text-lg'>
            Find answers to common questions or get in touch with our support
            team.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='max-w-2xl mx-auto mb-12'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-text h-5 w-5' />
            <Input
              type='text'
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder='Search for answers...'
              className='pl-10 py-6 rounded-full bg-secondary-bg/30 text-primary-text border-accent-blue/30 focus:border-accent-blue focus:ring focus:ring-accent-blue/30 w-full'
            />
          </div>
        </motion.div>

        {/* Support Categories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='mb-16'>
          <h2 className='text-2xl sm:text-3xl font-bold mb-8 text-center'>
            Support Categories
          </h2>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {supportCategories.map((category, index) => (
              <Card
                key={index}
                className='border-0 bg-secondary-bg/20 overflow-hidden transition-all hover:shadow-lg hover:bg-secondary-bg/30'>
                <CardContent className='p-6'>
                  <div className='flex items-start'>
                    <div className='bg-accent-blue/10 p-3 rounded-full mr-4'>
                      <category.icon className='h-6 w-6 text-accent-blue' />
                    </div>
                    <div>
                      <h3 className='text-xl font-bold mb-2'>
                        {category.title}
                      </h3>
                      <p className='text-secondary-text'>
                        {category.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='mb-16'>
          <div className='text-center mb-10'>
            <Badge className='mb-4 bg-accent-red hover:bg-hover-red text-white px-3 py-1 text-sm'>
              FAQ
            </Badge>
            <h2 className='text-2xl sm:text-3xl font-bold'>
              Frequently Asked Questions
            </h2>
          </div>

          <div className='max-w-3xl mx-auto'>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className='mb-4'>
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className={`w-full text-left p-4 rounded-lg flex justify-between items-center transition-colors ${
                      expandedFaq === faq.id
                        ? 'bg-accent-blue text-white'
                        : 'bg-secondary-bg/30 hover:bg-secondary-bg/50'
                    }`}>
                    <span className='font-semibold'>{faq.question}</span>
                    {expandedFaq === faq.id ? (
                      <ChevronUp className='h-5 w-5 flex-shrink-0' />
                    ) : (
                      <ChevronDown className='h-5 w-5 flex-shrink-0' />
                    )}
                  </button>

                  {expandedFaq === faq.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className='bg-secondary-bg/10 p-4 rounded-b-lg border-t-0 text-secondary-text'>
                      {faq.answer}
                    </motion.div>
                  )}
                </div>
              ))
            ) : (
              <div className='text-center py-8 bg-secondary-bg/10 rounded-lg'>
                <p className='text-secondary-text'>
                  No results found for &quot;{searchQuery}&quot;
                </p>
                <p className='mt-2'>
                  Try a different search term or browse the categories above.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Contact Section */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className='lg:col-span-1'>
            <div className='bg-secondary-bg/30 p-6 rounded-xl h-full'>
              <h2 className='text-2xl font-bold mb-6'>Contact Information</h2>

              <div className='space-y-6'>
                <div className='flex items-start'>
                  <div className='bg-accent-blue/10 p-3 rounded-full mr-4'>
                    <MessageSquare className='h-5 w-5 text-accent-blue' />
                  </div>
                  <div>
                    <h3 className='font-semibold mb-1'>Live Chat</h3>
                    <p className='text-secondary-text'>
                      Available 24/7 for premium members
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div className='bg-accent-blue/10 p-3 rounded-full mr-4'>
                    <Mail className='h-5 w-5 text-accent-blue' />
                  </div>
                  <div>
                    <h3 className='font-semibold mb-1'>Email Support</h3>
                    <p className='text-secondary-text'>support@gamestash.com</p>
                    <p className='text-secondary-text text-sm'>
                      Response within 24 hours
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div className='bg-accent-blue/10 p-3 rounded-full mr-4'>
                    <Phone className='h-5 w-5 text-accent-blue' />
                  </div>
                  <div>
                    <h3 className='font-semibold mb-1'>Phone Support</h3>
                    <p className='text-secondary-text'>+1 (555) 123-4567</p>
                    <p className='text-secondary-text text-sm'>
                      Mon-Fri, 9am-5pm EST
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div className='bg-accent-blue/10 p-3 rounded-full mr-4'>
                    <Clock className='h-5 w-5 text-accent-blue' />
                  </div>
                  <div>
                    <h3 className='font-semibold mb-1'>Business Hours</h3>
                    <p className='text-secondary-text'>
                      Monday - Friday: 9am - 8pm EST
                    </p>
                    <p className='text-secondary-text'>
                      Saturday - Sunday: 10am - 6pm EST
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className='lg:col-span-2'>
            <div className='bg-secondary-bg/30 p-6 rounded-xl'>
              <h2 className='text-2xl font-bold mb-6'>Send Us a Message</h2>

              <form
                onSubmit={handleSubmitContactForm}
                className='space-y-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-secondary-text mb-1'>
                      Your Name
                    </label>
                    <Input
                      id='name'
                      name='name'
                      value={contactForm.name}
                      onChange={handleContactFormChange}
                      placeholder='John Doe'
                      required
                      className='bg-primary-bg border-accent-blue/30 focus:border-accent-blue focus:ring focus:ring-accent-blue/30'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='email'
                      className='block text-sm font-medium text-secondary-text mb-1'>
                      Your Email
                    </label>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      value={contactForm.email}
                      onChange={handleContactFormChange}
                      placeholder='john@example.com'
                      required
                      className='bg-primary-bg border-accent-blue/30 focus:border-accent-blue focus:ring focus:ring-accent-blue/30'
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor='subject'
                    className='block text-sm font-medium text-secondary-text mb-1'>
                    Subject
                  </label>
                  <Input
                    id='subject'
                    name='subject'
                    value={contactForm.subject}
                    onChange={handleContactFormChange}
                    placeholder='How can we help you?'
                    required
                    className='bg-primary-bg border-accent-blue/30 focus:border-accent-blue focus:ring focus:ring-accent-blue/30'
                  />
                </div>

                <div>
                  <label
                    htmlFor='message'
                    className='block text-sm font-medium text-secondary-text mb-1'>
                    Message
                  </label>
                  <Textarea
                    id='message'
                    name='message'
                    value={contactForm.message}
                    onChange={handleContactFormChange}
                    placeholder='Please describe your issue in detail...'
                    rows={5}
                    required
                    className='bg-primary-bg border-accent-blue/30 focus:border-accent-blue focus:ring focus:ring-accent-blue/30'
                  />
                </div>

                <Button
                  type='submit'
                  className='w-full sm:w-auto bg-accent-blue hover:bg-hover-blue text-white'>
                  Send Message
                </Button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Support Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className='bg-accent-green rounded-xl p-8 sm:p-10 text-center mb-8'>
          <h2 className='text-2xl sm:text-3xl font-bold text-black mb-4'>
            Our Support Guarantee
          </h2>
          <p className='text-black/80 mb-6 max-w-2xl mx-auto'>
            We are committed to providing exceptional customer service. If you
            are not satisfied with our support, we will escalate your issue to a
            senior support specialist at no additional cost.
          </p>
          <div className='flex justify-center gap-4 flex-wrap'>
            <Button className='bg-black text-white hover:bg-gray-800'>
              Live Chat
            </Button>
            <Button
              variant='outline'
              className='bg-transparent border-black text-black hover:bg-black/10'>
              Support Ticket
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
