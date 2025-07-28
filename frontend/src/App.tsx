import { BrowserRouter as Router } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { AuthProvider } from './context';
import Layout from './components/common/Layout';
import DynamicAuth from './components/auth/EmailLogin';
import MessageForm from './components/message/MessageForm';
import MessageHistory from './components/message/MessageHistory';

// Global styles
const GlobalStyle = createGlobalStyle`
  :root {
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    --background: #f9fafb;
    --text-primary: #111827;
    --text-secondary: #4b5563;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--background);
    color: var(--text-primary);
  }

  * {
    box-sizing: border-box;
  }
  
  h1, h2, h3, h4, h5, h6 {
    color: var(--text-primary);
    margin-top: 0;
  }
  
  p {
    color: var(--text-secondary);
    line-height: 1.5;
  }
  
  button {
    font-family: var(--font-sans);
  }
`;

const ContentSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
`;

function App() {
  return (
    <Router>
      <AuthProvider>
        <GlobalStyle />
        <Layout>
          <DynamicAuth />
          <ContentSection>
            <MessageForm />
            <MessageHistory />
          </ContentSection>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
