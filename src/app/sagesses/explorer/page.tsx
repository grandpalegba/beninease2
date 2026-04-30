import ConsultationPage from '@/features/consultation/ConsultationPage';

/**
 * Sagesses Route
 * 
 * This page serves as the entry point for the /sagesses URL.
 * It leverages the ConsultationPage feature component to maintain
 * a clean separation between routing and business logic.
 */
export default function Page() {
  return <ConsultationPage />;
}
