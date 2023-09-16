import { TeamMember, PortfolioLinkType } from '@/Models/Models'
import nikolayAvatar from '@/assets/img/nikolayAvatar.png'
import ruzannaAvatar from '@/assets/img/ruzannaAvatar.png'
import maxAvatar from '@/assets/img/maxAvatar.png'
import ivanAvatar from '@/assets/img/ivanAvatar.png'

const SYSTEM_MESSAGES = {
  LOGIN_SCSS: 'Successfully logged in as',
  LOGOUT_SCSS: 'User successfully logged out',
  LOGIN_FAIL: 'Error during login. Please try again',
  LOGOUT_FAIL: 'Error during logout',
  DEFAULT_ERROR: 'Something went wrong. Please try again',
  REGISTER_SCSS: 'New user account successfully created',
  REGISTER_FAIL: 'Error while creating new user account. Please try again',
  INIT_ERROR: 'Error while app initialization',
  WELCOME_BACK: 'Welcome back',
  EDIT_USER_SCSS: 'User profile successfully changed',
  PASSWORD_CHANGE_SCSS: 'Your password successfully changed',
  PASSWORD_CHANGE_ERR: 'Error during password change. Please try again',
}

const UI_TEXTS = {
  NOT_FOUND: "Oops! Didn't find anything here.",
  LINK_FROM_NOT_FOUND: 'Go to',

  REGISTER_HEADER: 'Create account',
  REGISTER_CTA: 'Register with your email',
  REGISTER_BTN: 'Register',

  LOGIN_HEADER: 'Log in',
  LOGIN_CTA: 'Welcome back!',
  LOGIN_BTN: 'Login',

  ABOUT_HEADER: 'About us',
}

const TEAM: Array<TeamMember> = [
  {
    NAME: 'Ivan Gavrilin',
    ROLE: 'Frontend developer',
    PICTURE: ivanAvatar,
    SKILLS: [
      {
        id: 1,
        text: `bio + each member's contributions to the project, their effective collaboration methods`,
      },
      {
        id: 2,
        text: `💻 I'm the front-end developer behind the visual magic you see on our website.`,
      },
      {
        id: 3,
        text: `🖌️ My toolbox is filled with HTML, CSS, and JavaScript.`,
      },
      {
        id: 4,
        text: `🖌️ My toolbox is filled with HTML, CSS, and JavaScript.`,
      },
    ],
    PORTFOLIO: {
      LINK: 'https://github.com/ivan-gav',
      TYPE: PortfolioLinkType.GITHUB,
    },
  },
  {
    NAME: 'Maksim Shamal',
    ROLE: 'Frontend developer',
    PICTURE: maxAvatar,
    SKILLS: [
      {
        id: 1,
        text: `bio + each member's contributions to the project, their effective collaboration methods`,
      },
      {
        id: 2,
        text: `💻 I'm the front-end developer behind the visual magic you see on our website.`,
      },
      {
        id: 3,
        text: `🖌️ My toolbox is filled with HTML, CSS, and JavaScript.`,
      },
      {
        id: 4,
        text: `🖌️ My toolbox is filled with HTML, CSS, and JavaScript.`,
      },
    ],
    PORTFOLIO: {
      LINK: 'https://github.com/lazy-goose',
      TYPE: PortfolioLinkType.GITHUB,
    },
  },
  {
    NAME: 'Nikolay Krihstopa',
    ROLE: 'Frontend developer',
    PICTURE: nikolayAvatar,
    SKILLS: [
      {
        id: 1,
        text: `💻 I'm the front-end developer behind the visual magic you see on our website.`,
      },
      {
        id: 2,
        text: `💻 Javascript, React.js. vue.js, Redux/toolkit, Vuex`,
      },
      {
        id: 3,
        text: `🖌️ HTML, CSS/SCSS, Figma`,
      },
    ],
    PORTFOLIO: {
      LINK: 'https://github.com/NikolayKrishtopa',
      TYPE: PortfolioLinkType.GITHUB,
    },
  },
  {
    NAME: 'Ruzanna Baldryan',
    ROLE: 'UI/UX designer',
    PICTURE: ruzannaAvatar,
    SKILLS: [
      {
        id: 1,
        text: `Ruzanna specializes in crafting intuitive and user-centric products for startups.`,
      },
      {
        id: 2,
        text: `She developed the UI concept for the Skateshop project.`,
      },
      {
        id: 3,
        text: `She is proficient in Figma, Adobe Creative Cloud tools (including Adobe XD), and Framer.`,
      },
    ],
    PORTFOLIO: {
      LINK: 'https://ruzannadesigns.framer.website/',
      TYPE: PortfolioLinkType.FRAMER,
    },
  },
]

export { SYSTEM_MESSAGES, UI_TEXTS, TEAM }
