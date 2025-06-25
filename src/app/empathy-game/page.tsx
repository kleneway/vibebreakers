import { EmpathyEnigma } from '@/components/EmpathyEnigma';

export default function EmpathyGamePage() {
  // Mock participants for testing
  const participants = [
    'Alice',
    'Bob', 
    'Charlie',
    'Diana'
  ];

  const handleGameComplete = (results: any) => {
    console.log('Game completed:', results);
  };

  return (
    <div className="container mx-auto py-8">
      <EmpathyEnigma 
        participants={participants}
        onGameComplete={handleGameComplete}
      />
    </div>
  );
}