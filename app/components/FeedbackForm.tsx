import React, { useState } from 'react';

interface FeedbackResponse {
  message: string;
}

const FeedbackForm: React.FC = () => {
  const [feedback, setFeedback] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!feedback.trim()) {
      setError('Feedback cannot be empty.');
      return;
    }

    const submitFeedback = async (feedback: string) => {
      try {
        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ feedback }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit feedback');
        }

        const result: FeedbackResponse = await response.json();
        console.log('Feedback submitted successfully:', result);
        setSuccess('Feedback submitted successfully.');
        setFeedback('');
        setError(null);
      } catch (error) {
        console.error('Error submitting feedback:', error);
        setError('Error submitting feedback. Please try again.');
        setSuccess(null);
      }
    };

    submitFeedback(feedback);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="feedback" style={{ display: 'block', marginBottom: '5px' }}>Your Feedback:</label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Your feedback"
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Submit</button>
      </form>
    </div>
  );
};

export default FeedbackForm;