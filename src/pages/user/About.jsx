import { motion } from 'framer-motion';
import { Users, Award, Gamepad2, Globe, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { Badge } from '@/shadcn/components/ui/badge';

export const About = () => {
  const milestones = [
    {
      year: '2018',
      title: 'Company Founded',
      description:
        'GameStash was established with a mission to provide gamers with the best digital gaming marketplace.',
    },
    {
      year: '2019',
      title: 'Platform Launch',
      description:
        'Our digital platform launched with support for over 100 game titles across multiple genres.',
    },
    {
      year: '2020',
      title: 'Mobile App Release',
      description:
        'Expanded our reach with dedicated mobile applications for iOS and Android devices.',
    },
    {
      year: '2021',
      title: 'Partnership Program',
      description:
        'Established partnerships with major game developers and publishers worldwide.',
    },
    {
      year: '2022',
      title: 'Community Features',
      description:
        'Introduced community features including forums, game reviews, and user profiles.',
    },
    {
      year: '2023',
      title: 'Global Expansion',
      description:
        'Expanded operations to serve customers in over 50 countries with localized support.',
    },
  ];

  return (
    <div className='min-h-screen bg-primary-bg text-primary-text font-sans select-none'>
      <div className='container mx-auto px-4 py-6 sm:py-8'>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-center mb-12 sm:mb-16'>
          <Badge className='mb-4 bg-accent-blue hover:bg-hover-blue text-white px-3 py-1 text-sm'>
            About Us
          </Badge>
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-4'>
            Your Ultimate Gaming Destination
          </h1>
          <p className='text-secondary-text max-w-3xl mx-auto text-lg'>
            Founded in 2018, GameStash has grown to become one of the leading
            digital gaming marketplaces, connecting gamers with their favorite
            titles at competitive prices.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-16'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='bg-secondary-bg/30 p-6 rounded-xl'>
            <div className='flex items-center mb-4'>
              <div className='bg-accent-blue p-3 rounded-full mr-4'>
                <Gamepad2 className='h-6 w-6 text-white' />
              </div>
              <h2 className='text-2xl font-bold'>Our Mission</h2>
            </div>
            <p className='text-secondary-text leading-relaxed'>
              To create an accessible gaming marketplace that connects players
              with their perfect games, while supporting developers and
              fostering a vibrant gaming community.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className='bg-secondary-bg/30 p-6 rounded-xl'>
            <div className='flex items-center mb-4'>
              <div className='bg-accent-red p-3 rounded-full mr-4'>
                <Globe className='h-6 w-6 text-white' />
              </div>
              <h2 className='text-2xl font-bold'>Our Vision</h2>
            </div>
            <p className='text-secondary-text leading-relaxed'>
              To become the worlds most trusted gaming platform, known for our
              curated selection, competitive pricing, and exceptional customer
              experience.
            </p>
          </motion.div>
        </div>

        {/* Company Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-16'>
          <Card className='border-0 bg-secondary-bg/20 overflow-hidden'>
            <CardContent className='p-6 text-center'>
              <p className='text-3xl sm:text-4xl font-bold text-accent-blue mb-2'>
                500+
              </p>
              <p className='text-secondary-text'>Games Available</p>
            </CardContent>
          </Card>

          <Card className='border-0 bg-secondary-bg/20 overflow-hidden'>
            <CardContent className='p-6 text-center'>
              <p className='text-3xl sm:text-4xl font-bold text-accent-red mb-2'>
                50+
              </p>
              <p className='text-secondary-text'>Countries Served</p>
            </CardContent>
          </Card>

          <Card className='border-0 bg-secondary-bg/20 overflow-hidden'>
            <CardContent className='p-6 text-center'>
              <p className='text-3xl sm:text-4xl font-bold text-accent-green mb-2'>
                1M+
              </p>
              <p className='text-secondary-text'>Happy Customers</p>
            </CardContent>
          </Card>

          <Card className='border-0 bg-secondary-bg/20 overflow-hidden'>
            <CardContent className='p-6 text-center'>
              <p className='text-3xl sm:text-4xl font-bold text-hover-blue mb-2'>
                24/7
              </p>
              <p className='text-secondary-text'>Customer Support</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Our Journey */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className='mb-16'>
          <h2 className='text-2xl sm:text-3xl font-bold mb-8 text-center'>
            Our Journey
          </h2>

          <div className='relative'>
            {/* Timeline line */}
            <div className='absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-accent-blue/30 z-0'></div>

            {/* Timeline items */}
            <div className='relative z-10'>
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-start mb-8 ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}>
                  <div className='md:w-1/2 flex justify-center md:justify-end md:pr-8 pb-8 md:pb-0'>
                    <div
                      className={`bg-secondary-bg/30 p-5 rounded-xl max-w-md ${
                        index % 2 === 0 ? 'md:ml-8' : 'md:mr-8'
                      }`}>
                      <span className='text-accent-blue font-bold text-lg'>
                        {milestone.year}
                      </span>
                      <h3 className='text-xl font-bold mb-2'>
                        {milestone.title}
                      </h3>
                      <p className='text-secondary-text'>
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  <div className='absolute left-0 md:left-1/2 transform -translate-x-1/2 mt-2 md:mt-0'>
                    <div className='w-6 h-6 rounded-full bg-accent-blue border-4 border-primary-bg'></div>
                  </div>

                  <div className='md:w-1/2'></div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className='bg-secondary-bg/30 p-6 sm:p-10 rounded-xl mb-16'>
          <div className='text-center mb-10'>
            <Badge className='mb-4 bg-accent-green hover:bg-hover-green text-black px-3 py-1 text-sm'>
              Our Values
            </Badge>
            <h2 className='text-2xl sm:text-3xl font-bold'>What Drives Us</h2>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div className='bg-primary-bg/30 p-5 rounded-lg'>
              <Award className='h-10 w-10 text-accent-blue mb-4' />
              <h3 className='text-xl font-bold mb-2'>Quality</h3>
              <p className='text-secondary-text'>
                We curate our game selection to ensure only the best titles make
                it to our platform.
              </p>
            </div>

            <div className='bg-primary-bg/30 p-5 rounded-lg'>
              <Users className='h-10 w-10 text-accent-red mb-4' />
              <h3 className='text-xl font-bold mb-2'>Community</h3>
              <p className='text-secondary-text'>
                We foster a vibrant community of gamers who share their passion
                and experiences.
              </p>
            </div>

            <div className='bg-primary-bg/30 p-5 rounded-lg'>
              <Gamepad2 className='h-10 w-10 text-accent-green mb-4' />
              <h3 className='text-xl font-bold mb-2'>Innovation</h3>
              <p className='text-secondary-text'>
                We continuously improve our platform to provide the best gaming
                marketplace experience.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className='bg-accent-blue rounded-xl p-8 sm:p-10 text-center mb-8'>
          <h2 className='text-2xl sm:text-3xl font-bold text-white mb-4'>
            Ready to Join Our Gaming Community?
          </h2>
          <p className='text-white/80 mb-6 max-w-2xl mx-auto'>
            Discover amazing games at competitive prices and become part of our
            growing community of passionate gamers.
          </p>
          <a
            href='/games'
            className='inline-flex items-center bg-white text-accent-blue font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors'>
            Browse Games
            <ChevronRight className='ml-2 h-5 w-5' />
          </a>
        </motion.div>
      </div>
    </div>
  );
};
