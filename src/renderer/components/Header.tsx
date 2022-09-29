import { Flex, Heading, Link, Spacer } from '@chakra-ui/react';
import { FC } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { usePageData } from 'renderer/utils/PageHelper';

const Header: FC = () => {
  const location = useLocation();
  const pageData = usePageData();

  return (
    <header>
      <Flex mb={4} gap={2}>
        {location.pathname !== '/' && (
          <>
            <Link as={RouterLink} to="/">
              <Heading fontSize={24}>&larr; Back</Heading>
            </Link>
            <Heading fontSize={24}>|</Heading>
          </>
        )}
        <Heading fontSize={24}>{pageData.title}</Heading>
        <Spacer />
        {location.pathname !== '/settings' && (
          <Link as={RouterLink} to="/settings">
            <Heading fontSize={24}>Settings</Heading>
          </Link>
        )}
      </Flex>
    </header>
  );
};

export default Header;
