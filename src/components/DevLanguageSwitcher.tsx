import React from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

const SwitcherContainer = styled.div`
  position: fixed;
  bottom: 100px;
  left: 20px;
  background: rgba(139, 69, 19, 0.9);
  padding: 10px;
  border-radius: 8px;
  z-index: 1000;
  display: flex;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const LanguageButton = styled.button<{ $isActive: boolean }>`
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background: ${props => props.$isActive ? '#FFF8DC' : '#FFE4B5'};
  color: #8B4513;
  cursor: pointer;
  font-weight: ${props => props.$isActive ? 'bold' : 'normal'};
  transition: all 0.2s ease;

  &:hover {
    background: #FFF8DC;
    transform: translateY(-2px);
  }
`;

const DevLanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'nl', name: 'NL' },
    { code: 'fr', name: 'FR' },
    { code: 'es', name: 'ES' },
    { code: 'de', name: 'DE' }
  ];

  return (
    <SwitcherContainer>
      {languages.map(lang => (
        <LanguageButton
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          $isActive={i18n.language === lang.code}
        >
          {lang.name}
        </LanguageButton>
      ))}
    </SwitcherContainer>
  );
};

export default DevLanguageSwitcher; 