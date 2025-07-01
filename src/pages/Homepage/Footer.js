import React from 'react';
import { Link } from 'react-router-dom';
import { FaYoutube, FaFacebookF, FaInstagram, FaTwitter, FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import styled from '@emotion/styled';

const defaultTheme = {
  colors: {
    lightGrayBg: '#F7F8FA',
    text: '#696984',
    secondary: '#0A033C',
    primary: '#0862F7',
    white: '#FFFFFF',
    border: '#E9EAF0'
  },
  font: "'Poppins', sans-serif"
};

const FooterContainer = styled.footer(({ theme = defaultTheme }) => ({
  backgroundColor: theme.colors.lightGrayBg,
  color: theme.colors.text,
  fontFamily: theme.font,
}));

const TopFooter = styled.div(({ theme = defaultTheme }) => ({
  padding: '30px 5%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '30px',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    textAlign: 'center',
    padding: '30px 5%',
  },
}));

const SignUpText = styled.h3(({ theme = defaultTheme }) => ({
  fontSize: 'clamp(20px, 2vw, 24px)',
  fontWeight: 600,
  color: theme.colors.secondary,
  margin: 0,
  minWidth: '300px',
  flex: 1,
}));

const SubscribeForm = styled.form(({ theme = defaultTheme }) => ({
  display: 'flex',
  width: '100%',
  maxWidth: '500px',
  minWidth: '250px',
  flex: 2,
}));

const EmailInput = styled.input(({ theme = defaultTheme }) => ({
  flex: 1,
  padding: '15px 20px',
  border: `1px solid ${theme.colors.border}`,
  borderRight: 'none',
  borderRadius: '8px 0 0 8px',
  fontSize: '15px',
  '&:focus': {
    outline: 'none',
    borderColor: theme.colors.primary,
  },
}));

const SubscribeButton = styled.button(({ theme = defaultTheme }) => ({
  padding: '15px 30px',
  backgroundColor: theme.colors.primary,
  color: theme.colors.white,
  border: 'none',
  borderRadius: '0 8px 8px 0',
  fontWeight: 600,
  fontSize: '15px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: '#0540c2',
  },
}));

const MainFooter = styled.div(({ theme = defaultTheme }) => ({
  padding: '5px 3%',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '30px',
  borderTop: `1px solid ${theme.colors.border}`,
  '@media (max-width: 600px)': {
    gridTemplateColumns: '1fr',
    gap: '30px',
  },
}));

const FooterColumn = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const ColTitle = styled.h4(({ theme = defaultTheme }) => ({
  fontSize: '18px',
  fontWeight: 600,
  color: theme.colors.secondary,
  marginBottom: '15px',
  '@media (max-width: 600px)': {
    fontSize: '19px', // Make title slightly bigger on mobile
  },
}));

const ContactItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  marginBottom: '12px',
  fontSize: '15px',
  lineHeight: 1.5,
  '@media (max-width: 600px)': {
    fontSize: '16px', // Increase font size for mobile
  },
});

const ContactIcon = styled.div(({ theme = defaultTheme }) => ({
  minWidth: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: theme.colors.white,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.colors.primary,
  fontSize: '18px',
}));

const FooterLink = styled(Link)(({ theme = defaultTheme }) => ({
  display: 'block',
  color: theme.colors.text,
  textDecoration: 'none',
  marginBottom: '10px',
  fontSize: '15px',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: theme.colors.primary,
  },
  '@media (max-width: 600px)': {
    fontSize: '16px', // Increase font size for mobile
  },
}));

const SocialItem = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px',
});

const SocialLink = styled.a(({ theme = defaultTheme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: theme.colors.text,
  textDecoration: 'none',
  fontSize: '15px',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: theme.colors.primary,
  },
  '@media (max-width: 600px)': {
    fontSize: '16px', // Increase font size for mobile
  },
}));

const BottomFooter = styled.div(({ theme = defaultTheme }) => ({
  padding: '20px 5%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  fontSize: '18px',
  borderTop: `1px solid ${theme.colors.border}`,
  gap: '20px',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    textAlign: 'center',
  },
}));

// ✅ UPDATED: Logo shows image + text neatly aligned
const LogoBottom = styled(Link)(({ theme = defaultTheme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: '22px',
  fontWeight: 800,
  color: theme.colors.primary,
  textDecoration: 'none',
}));

const BottomLinks = styled.div({
  display: 'flex',
  gap: '20px',
  '@media (max-width: 768px)': {
    justifyContent: 'center',
  },
  '@media (max-width: 480px)': {
    flexDirection: 'column',
    gap: '10px',
  },
});

const Copyright = styled.span({
  '@media (max-width: 768px)': {
    width: '100%',
  },
});

const Footer = ({ theme }) => {
  const mergedTheme = {
    ...defaultTheme,
    ...theme,
    colors: {
      ...defaultTheme.colors,
      ...(theme?.colors || {})
    }
  };

  return (
    <FooterContainer theme={mergedTheme}>
      <MainFooter theme={mergedTheme}>
        <FooterColumn>
          <ColTitle theme={mergedTheme}>Get in touch</ColTitle>
          <ContactItem>
            <ContactIcon theme={mergedTheme}><FaPhoneAlt /></ContactIcon>
            <div>Call us directly?<br /><b>+91 987654321</b></div>
          </ContactItem>
          <ContactItem>
            <ContactIcon theme={mergedTheme}><FaMapMarkerAlt /></ContactIcon>
            <div>Address<br /><b>Tamilnadu,India</b></div>
          </ContactItem>
          <ContactItem>
            <ContactIcon theme={mergedTheme}><FaEnvelope /></ContactIcon>
            <div>Email<br /><b>contact@learnly.com</b></div>
          </ContactItem>
        </FooterColumn>

        <FooterColumn>
          <ColTitle theme={mergedTheme}>Popular subjects</ColTitle>
          <FooterLink to="#" theme={mergedTheme}>Siddha</FooterLink>
          <FooterLink to="#" theme={mergedTheme}>Ayurveda</FooterLink>
          <FooterLink to="#" theme={mergedTheme}>Varma</FooterLink>
          <FooterLink to="#" theme={mergedTheme}>Design</FooterLink>
        </FooterColumn>

        <FooterColumn>
          <ColTitle theme={mergedTheme}>Follow us</ColTitle>
          <SocialItem>
            <SocialLink href="#" theme={mergedTheme}>
              <FaYoutube color="#FF0000" /> YouTube
            </SocialLink>
          </SocialItem>
          <SocialItem>
            <SocialLink href="#"  theme={mergedTheme}>
              <FaFacebookF color="#1877F2" /> Facebook
            </SocialLink>
          </SocialItem>
          <SocialItem>
            <SocialLink href="#"theme={mergedTheme}>
              <FaInstagram color="#C13584" /> Instagram
            </SocialLink>
          </SocialItem>
          <SocialItem>
            <SocialLink href="#" target="_blank"  theme={mergedTheme}>
              <FaTwitter color="#1DA1F2" /> Twitter
            </SocialLink>
          </SocialItem>
        </FooterColumn>
      </MainFooter>


    </FooterContainer>
  );
};

export default Footer;
