import { Form } from '@remix-run/react';

const LogoutButton = () => {
  return (
    <Form action='/logout' method='post'>
      <button>logout</button>
    </Form>
  );
};

export default LogoutButton;
