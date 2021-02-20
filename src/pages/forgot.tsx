import React, { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Input,
  Link as ChakraLink,
} from '@chakra-ui/react';

import { useAuth } from '@hooks/useAuth';
import Redirect from '@components/redirect';
import { PokemonLogo } from '@components/pokemon-logo';
import { errorToast, successToast } from '@utils/toasts';
import { formatAuthErrors } from '@utils/format-auth-errors';
import { auth } from '@libs/firebase/firebase';

const ForgotPage: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  const { user } = useAuth();
  const router = useRouter();

  const handleResetPassword = async (): Promise<void> => {
    if (email.length === 0) {
      errorToast({ description: 'You must provide an email.' });
      return;
    }

    try {
      setLoading(true);
      await auth.sendPasswordResetEmail(email);
      successToast({
        title: `You have received an email to reset your password.`,
        description: 'Catch them all !',
      });
      router.push('/');
      // Do not setLoading(false) because success reset navigate to /.
    } catch (err) {
      console.error(err);
      errorToast({ description: formatAuthErrors(err) });
      setLoading(false);
    }
  };

  if (user) {
    return <Redirect to="/pokedex" />;
  }

  return (
    <Container py="6">
      <Center mb="12">
        <Link href="/" passHref>
          <ChakraLink>
            <PokemonLogo />
          </ChakraLink>
        </Link>
      </Center>
      <FormControl id="email" isRequired mb="4">
        <FormLabel>Email</FormLabel>
        <Input
          maxLength={255}
          placeholder="Enter your email"
          value={email}
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
        />
      </FormControl>
      <Button variant="primary" onClick={handleResetPassword} isLoading={loading}>
        Send
      </Button>
      <ChakraLink ml="4" onClick={() => router.push('/')}>
        Go back
      </ChakraLink>
    </Container>
  );
};

export default ForgotPage;