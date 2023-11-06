import { Helmet } from 'react-helmet-async';
import { SigninView } from 'src/sections/signin';

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Sign In | SKT </title>
      </Helmet>
      <SigninView />
    </>
  );
}
