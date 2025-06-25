import React from 'react';

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <p>Thanks for joining us!</p>
    </div>
  );
}
