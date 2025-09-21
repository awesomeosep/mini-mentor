import {
  FaceSmileIcon,
  ChartBarSquareIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  AdjustmentsHorizontalIcon,
  SunIcon,
} from '@heroicons/react/24/solid';

import benefitOneImg from '@/public/img/benefit-one.png';
import benefitTwoImg from '@/public/img/benefit-two.png';

const benefitOne = {
  title: 'How it works',
  desc: "On MiniMentor, everyone is a learner. Whether you are a seasoned professional or just starting out, you can both teach and learn. Here's how it works:",
  image: benefitOneImg,
  bullets: [
    {
      title: 'Create a profile',
      desc: 'Sign up and create a profile highlighting your skills, availability, and experience.',
      icon: <FaceSmileIcon />,
    },
    {
      title: 'Find your match',
      desc: 'Search our database of mentors and mentees to find the perfect match for your goals and interests.',
      icon: <ChartBarSquareIcon />,
    },
    {
      title: 'Find demand for your skills',
      desc: 'Create a listing to offer your skills and expertise to those seeking mentorship in that area.',
      icon: <CursorArrowRaysIcon />,
    },
  ],
};

const benefitTwo = {
  title: 'Give back to your community',
  desc: 'MiniMentor allows you to give back while strengthening your own skills. Research shows that mentoring is a two-way street, with both mentors and mentees reaping the benefits.',
  image: benefitTwoImg,
  bullets: [
    {
      title: 'Trackable, Provable Impact',
      desc: 'You can track and share the impact you make through mentoring.',
      icon: <DevicePhoneMobileIcon />,
    },
    {
      title: 'Responsive Design',
      desc: 'Use MiniMentor on any device, no matter the screen size.',
      icon: <AdjustmentsHorizontalIcon />,
    },
    {
      title: 'Dark & Light Mode',
      desc: 'Adapts to your system preference, or set manually.',
      icon: <SunIcon />,
    },
  ],
};

export { benefitOne, benefitTwo };
